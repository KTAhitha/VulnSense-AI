function Navbar() {
    return (
        <nav className="navbar">

            <div className="logo">
                🛡️ VulnSense <span>AI</span>
            </div>

            <div className="nav-links">
                <a href="/">Dashboard</a>
                <a href="/reports">Reports</a>
            </div>

        </nav>
    );
}

export default Navbar;