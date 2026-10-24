import { useState, useEffect } from "react";
import "./style/dashboard.css";

import Inicio from "./inicio.jsx";
import Practicantes from "./practicantes.jsx";
import Configuracion from "./configuracion.jsx";
import Horarios from "./horarios.jsx";

import logo from "../assets/logo.png";

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

    const opcionesMenu = [
        { id: "inicio", icono: "⌂", nombre: "Dashboard" },
        { id: "practicantes", icono: "♙", nombre: "Practicantes" },
        { id: "horarios", icono: "⏱", nombre: "Horarios" },
        { id: "configuracion", icono: "⚙", nombre: "Configuración" }
    ];

    const nombrePagina =
        opcionesMenu.find((opcion) => opcion.id === page)?.nombre || "Dashboard";

    return (
        <div className="dashboard">

            <aside className="sidebar">
                <div className="sidebar-brand">
                    <div className="brand-icon">
                        <img src={logo} alt="Logo de Electrotop Perú" />
                    </div>

                    <div className="brand-text">
                        <h2>Electrotop Perú</h2>
                        <span>Control de asistencia</span>
                    </div>
                </div>

                <div className="menu-label">MENÚ PRINCIPAL</div>

                <nav className="sidebar-menu">
                    {opcionesMenu.map((opcion) => (
                        <button
                            key={opcion.id}
                            className={`menu-item ${
                                page === opcion.id ? "active" : ""
                            }`}
                            onClick={() => setPage(opcion.id)}
                        >
                            <span className="menu-icon">
                                {opcion.icono}
                            </span>

                            <span>{opcion.nombre}</span>
                        </button>
                    ))}
                </nav>

                <div className="sidebar-bottom">
                    <div className="user-card">
                        <div className="user-avatar">G</div>

                        <div className="user-info">
                            <strong>Gerente</strong>
                            <span>Administrador</span>
                        </div>
                    </div>

                    <button
                        className="logout-button"
                        onClick={cerrarSesion}
                    >
                        <span className="menu-icon">↪</span>
                        Cerrar sesión
                    </button>
                </div>
            </aside>

            <div className="dashboard-main">    
                <main className="main-content">
                    {page === "inicio" && <Inicio />}
                    {page === "practicantes" && <Practicantes />}
                    {page === "configuracion" && <Configuracion />}
                    {page === "horarios" && <Horarios />}
                </main>
            </div>
        </div>
    );
}

export default Dashboard;