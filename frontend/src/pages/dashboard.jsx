import { useState, useEffect } from "react";
import eletrotop from '../assets/logo.png'
import letra_logo from '../assets/letra_logo.png'
import './style/dashboard.css'
import Inicio from './inicio.jsx'
import Chats from './chats.jsx'
import Solicitudes from './solicitudes.jsx'
import Productos from './productos.jsx'
import Configuracion from './configuracion.jsx'

function Dashboard() {
    const [page, setPage] = useState("inicio");
    useEffect(() => {

        const verificarSesion = () => {
            const sesion = localStorage.getItem("sesion");

            if (sesion !== "true") {
                window.location.replace("/");
            }
        };

        verificarSesion();

        window.addEventListener("pageshow", verificarSesion);

        return () => {
            window.removeEventListener("pageshow", verificarSesion);
        };

    }, []);
        
    function cerrarSesion() {
        localStorage.removeItem("sesion");
        localStorage.removeItem("usuario");

        window.location.replace("/");
    }
    
    return(
        <div className="dashboard">
        <header className="topbar">
            <img src={eletrotop} alt="Electrotop" />
            <h2>Electrotop Peru S.A.C</h2>
        </header>
        <div className="dashboard-body">
            <aside className="sidebar">
                <button onClick={() => setPage("inicio")}>
                    Inicio
                </button>
                <button onClick={() => setPage("chats")}>
                    Chats
                </button>
                <button onClick={() => setPage("solicitudes")}>
                    Solicitudes
                </button>
                <button onClick={() => setPage("productos")}>
                    Productos
                </button>
                <button onClick={() => setPage("configuracion")}>
                    Configuración
                </button>
                <button onClick={cerrarSesion}>
                    Salir
                </button>
            </aside>
            <main className="main-content">
                {page === "inicio" && <Inicio />}
                {page === "chats" && <Chats />}
                {page === "solicitudes" && <Solicitudes />}
                {page === "productos" && <Productos />}
                {page === "configuracion" && <Configuracion />}
        
            </main>
        </div>
    </div>
    )
}
export default Dashboard;