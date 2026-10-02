import Login from "./pages/login";
import Dashboard from "./pages/dashboard";

function App() {
    const ruta = window.location.pathname;
    const sesion = localStorage.getItem("sesion");

    if (ruta === "/dashboard" && sesion === "true") {
        return <Dashboard />;
    }

    return <Login />;
}

export default App;