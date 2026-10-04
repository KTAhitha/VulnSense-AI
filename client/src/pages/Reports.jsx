import { useEffect, useState } from "react";
import { getReports } from "../services/api";

function Reports() {

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadReports = async () => {

            try {

                const data = await getReports();

                setReports(data);

            } catch (err) {

                console.error(err);

                setError("Unable to load scan reports.");

            } finally {

                setLoading(false);

            }
        };

        loadReports();

    }, []);

    return (
        <main className="reports-page">

            <div className="reports-header">

                <div>
                    <p className="tag">
                        SECURITY HISTORY
                    </p>

                    <h1>
                        Scan Reports
                    </h1>

                    <p className="subtitle">
                        View previous vulnerability assessments
                        performed by VulnSense AI.
                    </p>
                </div>

            </div>


            {loading && (
                <div className="loading-box">
                    Loading reports...
                </div>
            )}


            {error && (
                <div className="error-box">
                    {error}
                </div>
            )}


            {!loading && !error && reports.length === 0 && (

                <div className="empty-reports">

                    <div className="empty-icon">
                        📋
                    </div>

                    <h2>
                        No Reports Yet
                    </h2>

                    <p>
                        Run your first security scan from
                        the dashboard.
                    </p>

                </div>

            )}


            {!loading && reports.length > 0 && (

                <div className="reports-table">

                    <div className="reports-table-header">
                        <span>Target</span>
                        <span>Date</span>
                        <span>Vulnerabilities</span>
                        <span>Status</span>
                    </div>


                    {reports.map((report) => {

                        const count =
                            report.summary
                                ?.total_vulnerabilities || 0;

                        return (

                            <div
                                className="report-row clickable"
                                key={report.report_id}
                                onClick={() =>
                                window.location.href =
                                `/reports/${report.report_id}`
                                }
                            >

                                <div className="report-target">
                                    🎯 {report.target}
                                </div>

                                <div className="report-date">
                                    {new Date(
                                        report.scanned_at
                                    ).toLocaleString()}
                                </div>

                                <div>
                                    {count}
                                </div>

                                <div>

                                    <span
                                        className={
                                            count === 0
                                                ? "status-secure"
                                                : "status-danger"
                                        }
                                    >
                                        {count === 0
                                            ? "SECURE"
                                            : "VULNERABLE"}
                                    </span>

                                </div>

                            </div>

                        );

                    })}

                </div>

            )}

        </main>
    );
}

export default Reports;