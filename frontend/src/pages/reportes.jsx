
import { useEffect, useState } from "react";
import { obtenerAsistencias } from "../services/asistenciasService";
import { obtenerPracticantes } from "../services/practicantesService";
import "./style/reportes.css";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
} from "recharts";

function Reportes() {
    const [asistencias, setAsistencias] = useState([]);
    const [practicantes, setPracticantes] = useState([]);
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [practicanteId, setPracticanteId] = useState("");
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setCargando(true);
                setError("");

                const [datosAsistencias, datosPracticantes] =
                    await Promise.all([
                        obtenerAsistencias(),
                        obtenerPracticantes(),
                    ]);

                setAsistencias(datosAsistencias);
                setPracticantes(datosPracticantes);
            } catch (err) {
                setError(err.message || "No se pudieron cargar los reportes.");
            } finally {
                setCargando(false);
            }
        };

        cargarDatos();
    }, []);

    const asistenciasFiltradas = asistencias.filter((a) => {
        const fecha = String(a.fecha_hora_mensaje || "").slice(0, 10);

        const cumpleInicio = !fechaInicio || fecha >= fechaInicio;
        const cumpleFin = !fechaFin || fecha <= fechaFin;
        const cumplePracticante =
            !practicanteId ||
            String(a.id_practicante) === practicanteId;

        return cumpleInicio && cumpleFin && cumplePracticante;
    });

    const entradas = asistenciasFiltradas.filter(
        (a) => a.tipo?.toLowerCase() === "entrada"
    );

    const salidas = asistenciasFiltradas.filter(
        (a) => a.tipo?.toLowerCase() === "salida"
    );

    const puntuales = entradas.filter(
        (a) => a.estado?.toLowerCase() === "puntual"
    );

    const tardanzas = entradas.filter(
        (a) => a.estado?.toLowerCase() === "tardanza"
    );

    const porcentajePuntualidad =
        entradas.length > 0
            ? Math.round((puntuales.length / entradas.length) * 100)
            : 0;

    const totalEvaluadas = puntuales.length + tardanzas.length;

    const porcentajePuntuales =
        totalEvaluadas > 0
            ? Math.round((puntuales.length / totalEvaluadas) * 100)
            : 0;

    const porcentajeTardanzas =
        totalEvaluadas > 0
            ? 100 - porcentajePuntuales
            : 0;

    const datosGraficoPuntualidad = [
        {
            estado: "Puntuales",
            cantidad: puntuales.length,
            porcentaje: porcentajePuntuales,
        },
        {
            estado: "Tardanzas",
            cantidad: tardanzas.length,
            porcentaje: porcentajeTardanzas,
        },
    ];

    
const resumenPracticantes = practicantes
    .map((p) => {
        const marcas = asistenciasFiltradas.filter(
            (a) => String(a.id_practicante) === String(p.id)
        );

        const entradasPracticante = marcas.filter(
            (a) => a.tipo?.toLowerCase() === "entrada"
        );

        const puntualesPracticante = entradasPracticante.filter(
            (a) => a.estado?.toLowerCase() === "puntual"
        );

        const tardanzasPracticante = entradasPracticante.filter(
            (a) => a.estado?.toLowerCase() === "tardanza"
        );

        const entradasEvaluables =
            puntualesPracticante.length + tardanzasPracticante.length;

        const porcentaje =
            entradasEvaluables > 0
                ? Math.round(
                      (puntualesPracticante.length / entradasEvaluables) * 100
                  )
                : null;

        return {
            id: p.id,
            nombre: `${p.nombre} ${p.apellido}`,
            entradas: entradasPracticante.length,
            puntuales: puntualesPracticante.length,
            tardanzas: tardanzasPracticante.length,
            porcentaje,
        };
    })
    .filter((p) => p.entradas > 0)
    .sort((a, b) => b.tardanzas - a.tardanzas);

    if (cargando) {
        return <div className="reportes"><p>Cargando reportes...</p></div>;
    }

    if (error) {
        return (
            <div className="reportes">
                <h2>Reportes</h2>
                <p className="reportes-error">{error}</p>
            </div>
        );
    }

    return (
        <main className="reportes">
            <header className="reportes-header">
                <div>
                    <h1>Reportes</h1>
                    <p>Resumen de las marcaciones de asistencia.</p>
                </div>
            </header>

            <section className="reportes-filtros">
                <label>
                    Desde
                    <input
                        type="date"
                        value={fechaInicio}
                        max={fechaFin || undefined}
                        onChange={(e) => setFechaInicio(e.target.value)}
                    />
                </label>

                <label>
                    Hasta
                    <input
                        type="date"
                        value={fechaFin}
                        min={fechaInicio || undefined}
                        onChange={(e) => setFechaFin(e.target.value)}
                    />
                </label>

                <label>
                    Practicante
                    <select
                        value={practicanteId}
                        onChange={(e) => setPracticanteId(e.target.value)}
                    >
                        <option value="">Todos los practicantes</option>
                        {practicantes.map((p) => (
                            <option key={p.id} value={String(p.id)}>
                                {p.nombre} {p.apellido}
                            </option>
                        ))}
                    </select>
                </label>

                <button
                    type="button"
                    onClick={() => {
                        setFechaInicio("");
                        setFechaFin("");
                        setPracticanteId("");
                    }}
                >
                    Limpiar filtros
                </button>
            </section>

            <section className="reportes-tarjetas">
                <article className="reporte-card">
                    <span>Entradas</span>
                    <strong>{entradas.length}</strong>
                </article>

                <article className="reporte-card">
                    <span>Salidas</span>
                    <strong>{salidas.length}</strong>
                </article>

                <article className="reporte-card">
                    <span>Entradas puntuales</span>
                    <strong>{puntuales.length}</strong>
                </article>

                <article className="reporte-card">
                    <span>Tardanzas</span>
                    <strong>{tardanzas.length}</strong>
                </article>

                <article className="reporte-card">
                    <span>Puntualidad</span>
                    <strong>{porcentajePuntualidad}%</strong>
                </article>
            </section>


            <section className="reportes-graficos-conjuntos">
                {/* Dona general */}
                <section className="reportes-grafico reportes-grafico-dona">
                    <div className="reportes-grafico-header">
                        <h2>Puntualidad general</h2>
                        <p>Distribución de entradas evaluadas.</p>
                    </div>

                    <div className="reportes-dona-contenedor">
                        {totalEvaluadas === 0 ? (
                            <p className="reportes-vs-vacio">
                                No hay entradas evaluables.
                            </p>
                        ) : (
                            <>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={datosGraficoPuntualidad}
                                            dataKey="cantidad"
                                            nameKey="estado"
                                            innerRadius="62%"
                                            outerRadius="88%"
                                            paddingAngle={2}
                                            stroke="none"
                                        >
                                            {datosGraficoPuntualidad.map((dato, index) => (
                                                <Cell
                                                    key={dato.estado}
                                                    fill={index === 0 ? "#3b82f6" : "#f43f5e"}
                                                />
                                            ))}
                                        </Pie>

                                        <Tooltip
                                            formatter={(value, name) => [
                                                `${value} entradas`,
                                                name,
                                            ]}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>

                                <div className="reportes-dona-centro">
                                    <strong>{porcentajePuntuales}%</strong>
                                    <span>Puntuales</span>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="reportes-leyenda reportes-leyenda-dona">
                        <span>
                            <i className="reportes-punto-azul" />
                            Puntuales ({puntuales.length})
                        </span>
                        <span>
                            <i className="reportes-punto-rojo" />
                            Tardanzas ({tardanzas.length})
                        </span>
                    </div>
                </section>

                {/* Comparación por practicante */}
                <section className="reportes-grafico reportes-grafico-practicantes">
                    <div className="reportes-grafico-header">
                        <h2>Entradas por practicante</h2>
                        <p>Comparación durante el período seleccionado.</p>
                    </div>

                    <div className="reportes-leyenda">
                        <span>
                            <i className="reportes-punto-azul" />
                            Puntual
                        </span>
                        <span>
                            <i className="reportes-punto-rojo" />
                            Tardanza
                        </span>
                        <span>
                            <i className="reportes-punto-gris" />
                            Sin marcación
                        </span>
                    </div>

                    <div className="reportes-barras-practicantes">
                        {resumenPracticantes.filter(
                            (p) => p.puntuales + p.tardanzas > 0
                        ).length === 0 ? (
                            <p>No hay entradas evaluables para comparar.</p>
                        ) : (
                            resumenPracticantes
                                .filter((p) => p.puntuales + p.tardanzas > 0)
                                .map((p) => {
                                    const total = p.puntuales + p.tardanzas;
                                    const porcentajeAzul = (p.puntuales / total) * 100;
                                    const porcentajeRojo = (p.tardanzas / total) * 100;

                                    return (
                                        <div
                                            className="reportes-fila-practicante"
                                            key={p.id}
                                        >
                                            <span className="reportes-nombre-practicante">
                                                {p.nombre}
                                            </span>

                                            <div
                                                className="reportes-barra-practicante"
                                                role="img"
                                                aria-label={`${p.nombre}: ${p.puntuales} puntuales y ${p.tardanzas} tardanzas`}
                                            >
                                                <div
                                                    className="reportes-barra-azul"
                                                    style={{ width: `${porcentajeAzul}%` }}
                                                />
                                                <div
                                                    className="reportes-barra-roja"
                                                    style={{ width: `${porcentajeRojo}%` }}
                                                />
                                            </div>

                                            <span className="reportes-total-practicante">
                                                {total}
                                            </span>
                                        </div>
                                    );
                                })
                        )}
                    </div>
                </section>
            </section>


            <section className="reportes-tabla">
                <h2>Resumen por practicante</h2>
                <p className="reportes-descripcion">
                    Rendimiento de asistencia durante el período seleccionado.
                </p>

                {resumenPracticantes.length === 0 ? (
                    <p>No hay entradas registradas para estos filtros.</p>
                ) : (
                    <div className="reportes-tabla-contenedor">
                        <table>
                            <thead>
                                <tr>
                                    <th>Practicante</th>
                                    <th>Entradas</th>
                                    <th>Puntuales</th>
                                    <th>Tardanzas</th>
                                    <th>Puntualidad</th>
                                </tr>
                            </thead>

                            <tbody>
                                {resumenPracticantes.map((p) => (
                                    <tr key={p.id}>
                                        <td>{p.nombre}</td>
                                        <td>{p.entradas}</td>
                                        <td>{p.puntuales}</td>
                                        <td>{p.tardanzas}</td>
                                        <td>
                                            {p.porcentaje === null
                                                ? "—"
                                                : `${p.porcentaje}%`}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </main>
    );
}

export default Reportes;
