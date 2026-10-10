    import { useState, useEffect } from "react";
    import "./style/dashboard.css";
    import Inicio from "./inicio.jsx";
    import Practicantes from "./practicantes.jsx";
    import Areas from "./areas.jsx";
    import Disponibilidad from "./disponibilidad.jsx";
    import Planificacion from "./planificacion.jsx";
    import Configuracion from "./configuracion.jsx";
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
            { id: "inicio", icono: "⌂", nombre: "Inicio" },
            { id: "practicantes", icono: "♙", nombre: "Miembros" },
            { id: "areas", icono: "▦", nombre: "Áreas y actividades" },
            { id: "disponibilidad", icono: "◷", nombre: "Disponibilidad" },
            { id: "configuracion", icono: "⚙", nombre: "Configuración" }
        ];

        const nombrePagina =
            opcionesMenu.find((opcion) => opcion.id === page)?.nombre || "Inicio";

        return (
            <div className="dashboard">

                <aside className="sidebar">
                    <div className="sidebar-brand">
                        <div className="brand-icon">
                            <img src={logo} alt="Logo de Planifica" />
                        </div>
                        <div className="brand-text">
                            <h2>Electrotop Peru</h2>
                            <span>Gestión de horarios</span>
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
                                <span className="menu-icon">{opcion.icono}</span>
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

                        <button className="logout-button" onClick={cerrarSesion}>
                            <span className="menu-icon">↪</span>
                            Cerrar sesión
                        </button>
                    </div>
                </aside>

                <div className="dashboard-main">
                    <header className="topbar">
                        <div>
                            <span className="breadcrumb">
                                Panel principal / {nombrePagina}
                            </span>
                            <h1>{nombrePagina}</h1>
                        </div>
                    </header>
                    <main className="main-content">
                        {page === "inicio" && <Inicio />}
                        {page === "practicantes" && <Practicantes />}
                        {page === "areas" && <Areas />}
                        {page === "disponibilidad" && <Disponibilidad />}
                        {page === "planificacion" && <Planificacion />}
                        {page === "configuracion" && <Configuracion />}
                    </main>
                </div>
            </div>
        );
    }

    export default Dashboard;
