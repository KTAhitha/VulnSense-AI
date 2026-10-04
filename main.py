from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from bson import ObjectId

from scanner import scan_target
from database import scans_collection, reports_collection
from nvd import search_cves_for_version, find_mysql_cpe
from ollama_ai import explain_vulnerability

app = FastAPI(title="VulnSense AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "VulnSense AI Backend is running!"
    }


@app.get("/scan")
def scan(target: str = "localhost"):

    result = scan_target(target)

    inserted = scans_collection.insert_one(result)

    result["scan_id"] = str(inserted.inserted_id)
    result.pop("_id", None)

    return result

@app.get("/cves")
def get_cves(
    product: str = "MySQL",
    version: str = "8.0.46"
):
    return search_cves_for_version(product, version)

@app.get("/cpe")
def get_cpe(version: str):
    return find_mysql_cpe(version)

@app.get("/ai-explain")
def ai_explain(
    cve_id: str,
    description: str
):
    explanation = explain_vulnerability(
        cve_id,
        description
    )

    return {
        "cve_id": cve_id,
        "ai_analysis": explanation
    }

@app.get("/scan-and-analyze")
def scan_and_analyze(target: str = "localhost"):

    # --------------------------------
    # 1. NMAP SCAN
    # --------------------------------

    scan_result = scan_target(target)

    # Store the raw scan
    scan_insert = scans_collection.insert_one(scan_result)

    scan_id = str(scan_insert.inserted_id)

    # --------------------------------
    # 2. FIND VULNERABILITIES
    # --------------------------------

    vulnerabilities = []

    for port in scan_result["ports"]:

        service = port["service"]
        version = port["version"]

        # Skip unknown versions
        if version == "Unknown":
            continue

        # Currently analyze MySQL
        if service.lower() == "mysql":

            cves = search_cves_for_version(
                "MySQL",
                version
            )

            # --------------------------------
            # 3. AI ANALYSIS
            # --------------------------------

            for cve in cves:

                ai_analysis = explain_vulnerability(
                    cve["cve_id"],
                    cve["description"]
                )

                vulnerabilities.append({

                    "port": port["port"],

                    "service": service,

                    "version": version,

                    "cve_id": cve["cve_id"],

                    "description": cve["description"],

                    "ai_analysis": ai_analysis

                })

    # --------------------------------
    # 4. CREATE FINAL REPORT
    # --------------------------------

    report = {

    "target": target,

    "scan_id": scan_id,

    "scanned_at": datetime.utcnow(),

    "ports": scan_result["ports"],

    "vulnerabilities": vulnerabilities,

    "summary": {

        "total_vulnerabilities":
            len(vulnerabilities),

        "total_open_ports":
            len(scan_result["ports"])

    }

}

    # --------------------------------
    # 5. STORE REPORT IN MONGODB
    # --------------------------------

    report_insert = reports_collection.insert_one(report)

    report["report_id"] = str(
        report_insert.inserted_id
    )

    # MongoDB ObjectId cannot be returned directly
    report.pop("_id", None)

    return report

@app.get("/reports")
def get_reports():

    reports = list(
        reports_collection.find(
            {},
            {
                "_id": 1,
                "target": 1,
                "scan_id": 1,
                "scanned_at": 1,
                "summary": 1
            }
        ).sort("scanned_at", -1)
    )

    for report in reports:
        report["report_id"] = str(report["_id"])
        report.pop("_id", None)

    return reports
@app.get("/reports/{report_id}")
def get_report(report_id: str):

    report = reports_collection.find_one(
        {
            "_id": ObjectId(report_id)
        }
    )

    if not report:
        return {
            "message": "Report not found"
        }

    report["report_id"] = str(report["_id"])
    report.pop("_id", None)

    return report
