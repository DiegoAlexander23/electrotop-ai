
import { useEffect, useState } from "react";
import "./style/inicio.css";

import { obtenerAsistencias } from "../services/asistenciasService";
import { obtenerHorarios } from "../services/horariosService";
import { obtenerPracticantes } from "../services/practicantesService";

function Inicio() {
    const [asistencias, setAsistencias] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [practicantes, setPracticantes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function cargarDatos() {
            try {
                setCargando(true);
                setError("");

                const [datosAsistencias, datosHorarios, datosPracticantes] =
                    await Promise.all([
                        obtenerAsistencias(),
                        obtenerHorarios(),
                        obtenerPracticantes()
                    ]);

                setAsistencias(datosAsistencias);
                setHorarios(datosHorarios);
                setPracticantes(datosPracticantes);
            } catch (err) {
                setError(err.message || "No se pudieron cargar los datos.");
            } finally {
                setCargando(false);
            }
        }

        cargarDatos();
    }, []);

    const ahora = new Date();

    const fechaHoy = [
        ahora.getFullYear(),
        String(ahora.getMonth() + 1).padStart(2, "0"),
        String(ahora.getDate()).padStart(2, "0")
    ].join("-");

    const diaHoy = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado"
    ][ahora.getDay()];

    const normalizarDia = (dia) =>
        String(dia || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();

    const horariosHoy = horarios.filter(
        (horario) =>
            normalizarDia(horario.dia_semana) === normalizarDia(diaHoy)
    );

    const activosHoy = practicantes.filter(
        (practicante) => practicante.estado === "Activo"
    );

    const asistenciasHoy = asistencias.filter((asistencia) => {
        const fecha = new Date(asistencia.fecha_hora_mensaje);

        if (Number.isNaN(fecha.getTime())) return false;

        const fechaLocal = [
            fecha.getFullYear(),
            String(fecha.getMonth() + 1).padStart(2, "0"),
            String(fecha.getDate()).padStart(2, "0")
        ].join("-");

        return fechaLocal === fechaHoy;
    });

    const filas = horariosHoy
        .filter((horario) =>
            activosHoy.some(
                (practicante) =>
                    String(practicante.id) === String(horario.practicante_id)
            )
        )
        .map((horario) => {
            const marcaciones = asistenciasHoy
                .filter(
                    (asistencia) =>
                        String(asistencia.id_practicante) ===
                        String(horario.practicante_id)
                )
                .sort(
                    (a, b) =>
                        new Date(a.fecha_hora_mensaje) -
                        new Date(b.fecha_hora_mensaje)
                );

            const entrada = marcaciones.find(
                (marcacion) => marcacion.tipo === "entrada"
            );

            const salida = [...marcaciones]
                .reverse()
                .find((marcacion) => marcacion.tipo === "salida");

            return {
                ...horario,
                entrada,
                salida,
                estado: entrada?.estado || "Sin marcación"
            };
        });

    const presentes = new Set(
        asistenciasHoy
            .filter((a) => a.tipo === "entrada")
            .map((a) => String(a.id_practicante))
    ).size;

    const tardanzas = asistenciasHoy.filter(
        (a) => a.tipo === "entrada" && a.estado === "Tardanza"
    ).length;

    const sinMarcacion = filas.filter((fila) => !fila.entrada).length;

    function formatearHora(fecha) {
        if (!fecha) return "—";

        const valor = new Date(fecha);

        if (Number.isNaN(valor.getTime())) return "—";

        return valor.toLocaleTimeString("es-PE", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        });
    }

    return (
        <div className="inicio">
            <section className="inicio-header">
                <div>
                    <h2>Control de asistencia</h2>
                    <p>
                        Resumen diario de asistencia de los practicantes
                        de Electrotop Perú S.A.C.
                    </p>
                </div>

                <span className="inicio-fecha">
                    <span className="inicio-punto"></span>
                    {ahora.toLocaleDateString("es-PE", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    })}
                </span>
            </section>

            {error && (
                <p className="inicio-error" role="alert">{error}</p>
            )}

            <section className="estadisticas">
                <article className="tarjeta tarjeta-presentes">
                    <div className="tarjeta-icono">✓</div>
                    <div className="tarjeta-info">
                        <p>Presentes</p>
                        <strong>{cargando ? "—" : presentes}</strong>
                        <span>Con entrada registrada hoy</span>
                    </div>
                </article>

                <article className="tarjeta tarjeta-tardanzas">
                    <div className="tarjeta-icono">◷</div>
                    <div className="tarjeta-info">
                        <p>Tardanzas</p>
                        <strong>{cargando ? "—" : tardanzas}</strong>
                        <span>Entradas fuera de horario</span>
                    </div>
                </article>

                <article className="tarjeta tarjeta-sin-marcacion">
                    <div className="tarjeta-icono">○</div>
                    <div className="tarjeta-info">
                        <p>Sin marcación</p>
                        <strong>{cargando ? "—" : sinMarcacion}</strong>
                        <span>Sin entrada registrada hoy</span>
                    </div>
                </article>

                <article className="tarjeta tarjeta-faltas">
                    <div className="tarjeta-icono">!</div>
                    <div className="tarjeta-info">
                        <p>Faltas confirmadas</p>
                        <strong>—</strong>
                        <span>Requiere confirmar ausencias</span>
                    </div>
                </article>
            </section>

            <section className="asistencia-panel">
                <div className="asistencia-header">
                    <div>
                        <h2>Asistencia de hoy</h2>
                        <p>
                            Practicantes con jornada programada para hoy.
                        </p>
                    </div>
                </div>

                <div className="tabla-contenedor">
                    <table className="tabla-asistencia">
                        <thead>
                            <tr>
                                <th>Practicante</th>
                                <th>Horario programado</th>
                                <th>Hora de entrada</th>
                                <th>Hora de salida</th>
                                <th>Estado</th>
                            </tr>
                        </thead>

                        <tbody>
                            {cargando ? (
                                <tr>
                                    <td colSpan="5">Cargando asistencia...</td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="5">
                                        No se pudo cargar la asistencia.
                                    </td>
                                </tr>
                            ) : filas.length === 0 ? (
                                <tr>
                                    <td colSpan="5">
                                        No hay practicantes con horario programado para hoy.
                                    </td>
                                </tr>
                            ) : (
                                filas.map((fila) => (
                                    <tr key={fila.practicante_id}>
                                        <td>
                                            {fila.nombre} {fila.apellido}
                                        </td>
                                        <td>
                                            {fila.hora_entrada.slice(0, 5)}
                                            {" - "}
                                            {fila.hora_salida.slice(0, 5)}
                                        </td>
                                        <td>
                                            {formatearHora(
                                                fila.entrada?.fecha_hora_mensaje
                                            )}
                                        </td>
                                        <td>
                                            {formatearHora(
                                                fila.salida?.fecha_hora_mensaje
                                            )}
                                        </td>
                                        <td>
                                            <span
                                                className={`estado-asistencia estado-${normalizarDia(fila.estado).replace(/\s+/g, "-")}`}
                                            >
                                                {fila.estado}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

export default Inicio;
