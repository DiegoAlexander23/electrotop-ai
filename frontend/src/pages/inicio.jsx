import "./style/inicio.css";

function Inicio() {
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
                    Asistencia del día
                </span>
            </section>
            <section className="estadisticas">
                <article className="tarjeta tarjeta-presentes">
                    <div className="tarjeta-icono">✓</div>
                    <div className="tarjeta-info">
                        <p>Presentes</p>
                        <strong>—</strong>
                        <span>Entradas registradas</span>
                    </div>
                </article>

                <article className="tarjeta tarjeta-tardanzas">
                    <div className="tarjeta-icono">◷</div>
                    <div className="tarjeta-info">
                        <p>Tardanzas</p>
                        <strong>—</strong>
                        <span>Entradas fuera de horario</span>
                    </div>
                </article>

                <article className="tarjeta tarjeta-sin-marcacion">
                    <div className="tarjeta-icono">○</div>
                    <div className="tarjeta-info">
                        <p>Sin marcación</p>
                        <strong>—</strong>
                        <span>Entradas pendientes</span>
                    </div>
                </article>

                <article className="tarjeta tarjeta-faltas">
                    <div className="tarjeta-icono">!</div>
                    <div className="tarjeta-info">
                        <p>Faltas confirmadas</p>
                        <strong>—</strong>
                        <span>Ausencias verificadas</span>
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
                            <tr>
                                <td colSpan="5" className="tabla-vacia">
                                    <div className="tabla-vacia-icono">
                                        <span>◷</span>
                                    </div>

                                    <strong>
                                        Datos de asistencia no disponibles
                                    </strong>

                                    <p>
                                        La información aparecerá aquí cuando
                                        conectemos los horarios y las
                                        marcaciones reales del sistema.
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

export default Inicio;