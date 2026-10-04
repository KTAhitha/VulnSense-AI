import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import ReportDetails from "./pages/ReportDetails";

function App() {

    const path = window.location.pathname;

    if (path.startsWith("/reports/")) {
        return <ReportDetails />;
    }

    if (path === "/reports") {
        return <Reports />;
    }

    return <Dashboard />;
}

export default App;