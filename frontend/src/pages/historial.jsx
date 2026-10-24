
import { useEffect, useMemo, useState } from "react";
import { obtenerAsistencias } from "../services/asistenciasService";
import "./style/historial.css";

const REGISTROS_POR_PAGINA = 10;

function obtenerMesActual() {
    const ahora = new Date();
    const mes = String(ahora.getMonth() + 1).padStart(2, "0");

    return `${ahora.getFullYear()}-${mes}`;
}

function formatearFecha(fecha) {
    if (!fecha) return "—";

    // MySQL suele devolver: YYYY-MM-DD HH:mm:ss
    const [fechaParte, horaParte = ""] = String(fecha).split(" ");
    const [anio, mes, dia] = fechaParte.split("-");

    if (!anio || !mes || !dia) return fecha;

    return `${dia}/${mes}/${anio} ${horaParte.slice(0, 5)}`;
}

function Historial() {
    const [asistencias, setAsistencias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    const [busqueda, setBusqueda] = useState("");
    const [tipoSeleccionado, setTipoSeleccionado] = useState("todos");
    const [mesSeleccionado, setMesSeleccionado] = useState(obtenerMesActual);
    const [paginaActual, setPaginaActual] = useState(1);

    useEffect(() => {
        const cargarAsistencias = async () => {
            try {
                setCargando(true);
                setError("");

                const datos = await obtenerAsistencias();
                setAsistencias(datos);
            } catch (err) {
                console.error(err);
                setError("No se pudo cargar el historial.");
            } finally {
                setCargando(false);
            }
        };

        cargarAsistencias();
    }, []);

    const asistenciasFiltradas = useMemo(() => {
        return asistencias.filter((asistencia) => {
            const nombreCompleto =
                `${asistencia.nombre ?? ""} ${asistencia.apellido ?? ""}`
                    .toLowerCase();

            const coincideNombre = nombreCompleto.includes(
                busqueda.trim().toLowerCase()
            );

            const coincideTipo =
                tipoSeleccionado === "todos" ||
                asistencia.tipo === tipoSeleccionado;

            const fecha = String(asistencia.fecha_hora_mensaje ?? "");
            const coincideMes =
                !mesSeleccionado ||
                fecha.slice(0, 7) === mesSeleccionado;

            return coincideNombre && coincideTipo && coincideMes;
        });
    }, [asistencias, busqueda, tipoSeleccionado, mesSeleccionado]);

    const totalPaginas = Math.max(
        1,
        Math.ceil(asistenciasFiltradas.length / REGISTROS_POR_PAGINA)
    );

    const registrosVisibles = asistenciasFiltradas.slice(
        (paginaActual - 1) * REGISTROS_POR_PAGINA,
        paginaActual * REGISTROS_POR_PAGINA
    );

    useEffect(() => {
        setPaginaActual(1);
    }, [busqueda, tipoSeleccionado, mesSeleccionado]);

    useEffect(() => {
        if (paginaActual > totalPaginas) {
            setPaginaActual(totalPaginas);
        }
    }, [paginaActual, totalPaginas]);

    return (
        <section className="historial">
            <header className="historial-header">
                <div>
                    <h2>Historial de asistencias</h2>
                    <p>
                        Consulta las entradas y salidas registradas
                        de los practicantes.
                    </p>
                </div>
            </header>

            <div className="historial-panel">
                <div className="historial-toolbar">
                    <strong>Registros de asistencia</strong>
                    <span>
                        {asistenciasFiltradas.length}{" "}
                        {asistenciasFiltradas.length === 1
                            ? "registro"
                            : "registros"}
                    </span>
                </div>

                <div className="historial-filtros">
                    <input
                        type="text"
                        placeholder="Buscar practicante..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        aria-label="Buscar practicante"
                    />

                    <select
                        value={tipoSeleccionado}
                        onChange={(e) => setTipoSeleccionado(e.target.value)}
                        aria-label="Filtrar por tipo de asistencia"
                    >
                        <option value="todos">Todas las asistencias</option>
                        <option value="entrada">Entradas</option>
                        <option value="salida">Salidas</option>
                    </select>

                    <div className="historial-filtro-mes">
                        <label htmlFor="filtro-mes">Mes:</label>
                        <input
                            id="filtro-mes"
                            type="month"
                            value={mesSeleccionado}
                            onChange={(e) => setMesSeleccionado(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setMesSeleccionado("")}
                            title="Mostrar todos los meses"
                        >
                            Todos
                        </button>
                    </div>
                </div>

                {cargando && (
                    <div className="historial-cargando">
                        Cargando registros...
                    </div>
                )}

                {!cargando && error && (
                    <div className="historial-error">{error}</div>
                )}

                {!cargando && !error && asistenciasFiltradas.length === 0 && (
                    <div className="historial-vacio">
                        No se encontraron asistencias con esos filtros.
                    </div>
                )}

                {!cargando && !error && asistenciasFiltradas.length > 0 && (
                    <>
                        <div className="historial-tabla-contenedor">
                            <table className="historial-tabla">
                                <thead>
                                    <tr>
                                        <th>Practicante</th>
                                        <th>Fecha y hora</th>
                                        <th>Tipo</th>
                                        <th>Mensaje original</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {registrosVisibles.map((asistencia) => (
                                        <tr key={asistencia.id}>
                                            <td>
                                                {asistencia.nombre}{" "}
                                                {asistencia.apellido}
                                            </td>

                                            <td>
                                                {formatearFecha(
                                                    asistencia.fecha_hora_mensaje
                                                )}
                                            </td>

                                            <td>
                                                <span
                                                    className={`estado-asistencia ${
                                                        asistencia.tipo === "entrada"
                                                            ? "asistencia-entrada"
                                                            : "asistencia-salida"
                                                    }`}
                                                >
                                                    {asistencia.tipo === "entrada"
                                                        ? "Entrada"
                                                        : "Salida"}
                                                </span>
                                            </td>

                                            <td className="historial-mensaje">
                                                {asistencia.mensaje_original}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="historial-paginacion">
                            <span>
                                Página {paginaActual} de {totalPaginas}
                            </span>

                            <div>
                                <button
                                    type="button"
                                    disabled={paginaActual === 1}
                                    onClick={() =>
                                        setPaginaActual((pagina) => pagina - 1)
                                    }
                                >
                                    Anterior
                                </button>

                                <button
                                    type="button"
                                    disabled={paginaActual === totalPaginas}
                                    onClick={() =>
                                        setPaginaActual((pagina) => pagina + 1)
                                    }
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}

export default Historial;
