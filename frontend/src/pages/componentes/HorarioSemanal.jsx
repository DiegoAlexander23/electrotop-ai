export const diasSemana = [
    { id: "lunes", nombre: "Lunes" },
    { id: "martes", nombre: "Martes" },
    { id: "miercoles", nombre: "Miércoles" },
    { id: "jueves", nombre: "Jueves" },
    { id: "viernes", nombre: "Viernes" }
];

function HorarioSemanal({ horarios, onActualizarHorario }) {
    return (
        <div className="formulario-seccion">
            <div className="horario-formulario-titulo">
                <div>
                    <h4>Horario habitual</h4>
                    <p>
                        Deja las horas vacías si no trabaja ese día.
                    </p>
                </div>

                <span className="horario-formulario-badge">
                    Lunes a viernes
                </span>
            </div>

            <div className="horario-formulario-lista">
                {diasSemana.map((dia) => {
                    const turno = horarios[dia.id];

                    return (
                        <div
                            className="horario-formulario-fila"
                            key={dia.id}
                        >
                            <div className="horario-dia-nombre">
                                <span className="horario-dia-punto"></span>
                                {dia.nombre}
                            </div>

                            <label className="campo-hora">
                                <span>Entrada</span>
                                <input
                                    type="time"
                                    value={turno.entrada}
                                    max={turno.salida || undefined}
                                    onChange={(e) =>
                                        onActualizarHorario(
                                            dia.id,
                                            "entrada",
                                            e.target.value
                                        )
                                    }
                                />
                            </label>

                            <span className="separador-horas">a</span>

                            <label className="campo-hora">
                                <span>Salida</span>
                                <input
                                    type="time"
                                    value={turno.salida}
                                    min={turno.entrada || undefined}
                                    onChange={(e) =>
                                        onActualizarHorario(
                                            dia.id,
                                            "salida",
                                            e.target.value
                                        )
                                    }
                                />
                            </label>

                            <button
                                type="button"
                                className="btn-limpiar-dia"
                                onClick={() => {
                                    onActualizarHorario(
                                        dia.id,
                                        "entrada",
                                        ""
                                    );
                                    onActualizarHorario(
                                        dia.id,
                                        "salida",
                                        ""
                                    );
                                }}
                            >
                                Quitar turno
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default HorarioSemanal;