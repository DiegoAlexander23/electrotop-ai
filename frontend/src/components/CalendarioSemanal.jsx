
const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo"
];

function CalendarioSemanal({ practicante, horarios, onCerrar }) {
    function obtenerHora(hora) {
        return String(hora).slice(0, 5);
    }

    return (
        <div
            className="modal-fondo"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    onCerrar();
                }
            }}
        >
            <section
                className="modal-horario modal-calendario"
                role="dialog"
                aria-modal="true"
                aria-labelledby="titulo-calendario"
            >
                <div className="modal-horario-header">
                    <div>
                        <h2 id="titulo-calendario">
                            Horario semanal
                        </h2>
                        <p>
                            {practicante.nombre} {practicante.apellido}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="modal-cerrar"
                        onClick={onCerrar}
                        aria-label="Cerrar calendario"
                    >
                        ×
                    </button>
                </div>

                <div className="calendario-semanal">
                    {diasSemana.map((dia) => {
                        const horario = horarios.find(
                            (h) => h.dia_semana === dia
                        );

                        return (
                            <article
                                className="calendario-dia"
                                key={dia}
                            >
                                <h3>{dia}</h3>

                                {horario ? (
                                    <div className="calendario-jornada">
                                        <span>
                                            {obtenerHora(
                                                horario.hora_entrada
                                            )}
                                        </span>

                                        <span>
                                            {obtenerHora(
                                                horario.hora_salida
                                            )}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="calendario-sin-horario">
                                        Sin horario
                                    </span>
                                )}
                            </article>
                        );
                    })}
                </div>

                <div className="modal-horario-acciones">
                    <button
                        type="button"
                        className="btn-cancelar"
                        onClick={onCerrar}
                    >
                        Cerrar
                    </button>
                </div>
            </section>
        </div>
    );
}

export default CalendarioSemanal;
