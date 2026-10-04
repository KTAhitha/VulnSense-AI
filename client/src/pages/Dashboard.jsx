import { useState } from "react";
import { scanTarget } from "../services/api";
import Navbar from "../components/Navbar";

function Dashboard() {

    const [target, setTarget] = useState("localhost");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const handleScan = async () => {

        try {

            setLoading(true);
            setError("");
            setResult(null);

            const data = await scanTarget(target);

            setResult(data);

        } catch (err) {

            console.error(err);

            setError(
                "Unable to connect to VulnSense backend."
            );

        } finally {

            setLoading(false);

        }
    };

    const vulnerabilityCount =
        result?.summary?.total_vulnerabilities || 0;

    const status =
        vulnerabilityCount === 0
            ? "SECURE"
            : "VULNERABILITIES FOUND";

    return (
        <div className="app">

            <Navbar />

            <main className="dashboard" id="dashboard">

                <section className="hero-section">

                    <div>
                        <p className="tag">
                            AI-POWERED SECURITY
                        </p>

                        <h1>
                            Vulnerability
                            <span> Assessment</span>
                        </h1>

                        <p className="subtitle">
                            Scan authorized systems, identify known
                            vulnerabilities and generate AI-powered
                            security analysis.
                        </p>
                    </div>

                </section>


                <section className="scan-section">

                    <div className="scan-box">

                        <div className="input-area">

                            <label>
                                Target
                            </label>

                            <input
                                value={target}
                                onChange={(e) =>
                                    setTarget(e.target.value)
                                }
                                placeholder="localhost"
                            />

                        </div>

                        <button
                            className="scan-button"
                            onClick={handleScan}
                            disabled={loading}
                        >
                            {loading
                                ? "Scanning..."
                                : "🔍 Start Scan"
                            }
                        </button>

                    </div>

                    <p className="authorization-note">
                        ⚠️ Only scan systems you own or have
                        explicit permission to assess.
                    </p>

                </section>


                {error && (
                    <div className="error-box">
                        {error}
                    </div>
                )}


                {result && (

                    <section className="results-section">

                        <div className="section-header">

                            <div>
                                <p className="tag">
                                    SCAN COMPLETE
                                </p>

                                <h2>
                                    Security Overview
                                </h2>
                            </div>

                            <div className="target-badge">
                                🎯 {result.target}
                            </div>

                        </div>


                        <div className="stats-grid">

                            <div className="stat-card">

                                <div className="stat-icon">
                                    🔌
                                </div>

                                <div>
                                    <p>
                                        Open Ports
                                    </p>

                                    <h3>
                                        {result.summary?.total_open_ports ||
                                           result.ports?.length ||
                                           0}
                                    </h3>
                                </div>

                            </div>


                            <div className="stat-card">

                                <div className="stat-icon">
                                    🛡️
                                </div>

                                <div>
                                    <p>
                                        Vulnerabilities
                                    </p>

                                    <h3>
                                        {vulnerabilityCount}
                                    </h3>
                                </div>

                            </div>


                            <div className="stat-card">

                                <div className="stat-icon">
                                    🤖
                                </div>

                                <div>
                                    <p>
                                        AI Analysis
                                    </p>

                                    <h3>
                                        Active
                                    </h3>
                                </div>

                            </div>


                            <div className="stat-card">

                                <div className="stat-icon">
                                    {vulnerabilityCount === 0
                                        ? "✓"
                                        : "⚠️"}
                                </div>

                                <div>
                                    <p>
                                        Security Status
                                    </p>

                                    <h3 className={
                                        vulnerabilityCount === 0
                                            ? "secure"
                                            : "danger"
                                    }>
                                        {status}
                                    </h3>
                                </div>

                            </div>

                        </div>


                        <div className="ports-card">

                            <div className="card-header">

                                <div>
                                    <h2>
                                        Detected Services
                                    </h2>

                                    <p>
                                        Services discovered by Nmap
                                    </p>
                                </div>

                            </div>


                            <div className="table-wrapper">

                                <table>

                                    <thead>
                                        <tr>
                                            <th>Port</th>
                                            <th>Service</th>
                                            <th>Version</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {result.ports?.map(
                                            (port, index) => (

                                                <tr key={index}>

                                                    <td>
                                                        <span className="port">
                                                            {port.port}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        {port.service}
                                                    </td>

                                                    <td>
                                                        {port.version}
                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </div>


                        {vulnerabilityCount === 0 && (

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

                        )}

                    </section>

                )}

            </main>

        </div>
    );
}

export default Dashboard;