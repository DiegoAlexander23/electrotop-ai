import { diasSemana } from "./HorarioSemanal.jsx";

function resumirHorario(horarios) {
    const turnos = diasSemana
        .filter(({ id }) =>
            horarios[id]?.entrada && horarios[id]?.salida
        )
        .map(({ nombre, id }) =>
            `${nombre.slice(0, 3)}: ${horarios[id].entrada}-${horarios[id].salida}`
        );

    return turnos.length
        ? turnos.join(" · ")
        : "Sin turnos asignados";
}

function ListaPracticantes({ practicantes, onNuevo, onEditar }) {
    return (
        <>
            <section className="practicantes-resumen">
                <div>
                    <span>Practicantes mienbros</span>
                    <strong>{practicantes.length}</strong>
                </div>
            </section>

            <section className="lista-practicantes">
                <div className="lista-practicantes-titulo">
                    <h3>Listado de mienbros</h3>
                    <span>{practicantes.length} registros</span>
                </div>

                {practicantes.length === 0 ? (
                    <div className="practicantes-vacio">
                        <h3>Aún no hay practicantes</h3>
                        <p>Registra al primer practicante para comenzar.</p>
                        <button
                            className="btn-nuevo-practicante"
                            onClick={onNuevo}
                        >
                            Nuevo mienbro
                        </button>
                    </div>
                ) : (
                    <div className="practicantes-lista">
                        {practicantes.map((persona) => (
                            <article
                                className="practicante-item"
                                key={persona.id}
                            >
                                <div className="practicante-identidad">
                                    <div className="practicante-avatar">
                                        {persona.nombre
                                            .split(" ")
                                            .map((parte) => parte[0])
                                            .slice(0, 2)
                                            .join("")
                                            .toUpperCase()}
                                    </div>

                                    <div className="practicante-nombre">
                                        <h4>{persona.nombre}</h4>
                                        <span>{persona.area}</span>
                                    </div>
                                </div>

                                <div className="practicante-horario-resumen">
                                    <span className="campo-resumen-label">
                                        Horario habitual
                                    </span>
                                    <p>
                                        {resumirHorario(persona.horarios)}
                                    </p>
                                </div>

                                <button
                                    className="btn-editar-practicante"
                                    onClick={() => onEditar(persona)}
                                >
                                    ✎ Consultar / editar
                                </button>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}

export default ListaPracticantes;