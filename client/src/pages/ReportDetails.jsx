import { useEffect, useState } from "react";
import { getReport } from "../services/api";

function ReportDetails() {

    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const reportId =
        window.location.pathname.split("/")[2];

    useEffect(() => {

        const loadReport = async () => {

            try {

                const data = await getReport(reportId);

                setReport(data);

            } catch (err) {

                console.error(err);

                setError("Unable to load report.");

            } finally {

                setLoading(false);

            }
        };

        loadReport();

    }, [reportId]);

    if (loading) {
        return (
            <main className="report-details-page">
                <div className="loading-box">
                    Loading report...
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="report-details-page">
                <div className="error-box">
                    {error}
                </div>
            </main>
        );
    }

    if (!report) {
        return null;
    }

    const vulnerabilities =
        report.vulnerabilities || [];

    const ports =
        report.ports || [];

    return (
        <main className="report-details-page">

            {/* HEADER */}

            <div className="details-header">

                <a
                    href="/reports"
                    className="back-link"
                >
                    ← Back to Reports
                </a>

                <p className="tag">
                    SECURITY REPORT
                </p>

                <h1>
                    Scan Details
                </h1>

                <p className="details-target">
                    🎯 {report.target}
                </p>

            </div>


            {/* STATS */}

            <div className="details-stats">

                <div className="detail-stat">
                    <span>Target</span>

                    <strong>
                        {report.target}
                    </strong>
                </div>


                <div className="detail-stat">

                    <span>Scan Date</span>

                    <strong>
                        {new Date(
                            report.scanned_at
                        ).toLocaleString()}
                    </strong>

                </div>


                <div className="detail-stat">

                    <span>Vulnerabilities</span>

                    <strong>
                        {report.summary
                            ?.total_vulnerabilities || 0}
                    </strong>

                </div>

            </div>


            {/* DETECTED SERVICES */}

            <section className="detected-services">

                <div className="section-title">

                    <p className="tag">
                        NETWORK DISCOVERY
                    </p>

                    <h2>
                        Detected Services
                    </h2>

                </div>


                <div className="services-table">

                    <div className="services-header">

                        <span>
                            Port
                        </span>

                        <span>
                            Service
                        </span>

                        <span>
                            Version
                        </span>

                    </div>


                    {ports.length === 0 ? (

                        <div className="service-row">

                            <span>
                                -
                            </span>

                            <span>
                                No services detected
                            </span>

                            <span>
                                -
                            </span>

                        </div>

                    ) : (

                        ports.map((port, index) => (

                            <div
                                className="service-row"
                                key={index}
                            >

                                <span className="port">
                                    {port.port}
                                </span>

                                <span>
                                    {port.service}
                                </span>

                                <span>
                                    {port.version}
                                </span>

                            </div>

                        ))

                    )}

                </div>

            </section>


            {/* VULNERABILITIES */}

            {vulnerabilities.length === 0 ? (

                <div className="no-vulnerabilities">

                    <div className="success-icon">
                        ✓
                    </div>

                    <div>

                        <h3>
                            No Matching Vulnerabilities Found
                        </h3>

                        <p>
                            NVD did not identify a
                            vulnerability matching the
                            detected software version.
                        </p>

                    </div>

                </div>

            ) : (

                <section className="vulnerability-list">

                    <div className="section-title">

                        <p className="tag">
                            FINDINGS
                        </p>

                        <h2>
                            Detected Vulnerabilities
                        </h2>

                    </div>


                    {vulnerabilities.map(
                        (vulnerability, index) => (

                            <article
                                className="vulnerability-card"
                                key={index}
                            >

                                {/* VULNERABILITY HEADER */}

                                <div className="vulnerability-header">

                                    <div>

                                        <span className="cve-label">
                                            CVE
                                        </span>

                                        <h3>
                                            {vulnerability.cve_id}
                                        </h3>

                                    </div>


                                    <span className="service-badge">

                                        {vulnerability.service}
                                        :
                                        {vulnerability.port}

                                    </span>

                                </div>


                                {/* DESCRIPTION */}

                                <div className="vulnerability-info">

                                    <h4>
                                        Description
                                    </h4>

                                    <p>
                                        {vulnerability.description}
                                    </p>

                                </div>


                                {/* AI ANALYSIS */}

                                <div className="ai-analysis">

                                    <div className="ai-title">

                                        🤖 AI Security Analysis

                                    </div>


                                    <div className="ai-content">

                                        {vulnerability.ai_analysis}

                                    </div>

                                </div>

                            </article>

                        )
                    )}

                </section>

            )}

        </main>
    );
}

export default ReportDetails;