
const diasSemana = [
    { valor: "Lunes", letra: "L" },
    { valor: "Martes", letra: "M" },
    { valor: "Miércoles", letra: "X" },
    { valor: "Jueves", letra: "J" },
    { valor: "Viernes", letra: "V" },
    { valor: "Sábado", letra: "S" },
    { valor: "Domingo", letra: "D" }
];



function FormularioHorario({
    formulario,
    practicantes,
    editando,
    onChange,
    onToggleDia,
    onChangeDia,
    onSubmit,
    onCerrar,
    guardando
}) {
    const horarios = formulario.horarios || [];

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
                className="modal-horario"
                role="dialog"
                aria-modal="true"
                aria-labelledby="titulo-modal-horario"
            >
                <div className="modal-horario-header">
                    <div>
                        <h2 id="titulo-modal-horario">
                            {editando !== null
                                ? "Editar horario semanal"
                                : "Asignar horario semanal"}
                        </h2>
                        <p>
                            Selecciona los días de trabajo y configura
                            las horas de cada jornada.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="modal-cerrar"
                        onClick={onCerrar}
                        aria-label="Cerrar ventana"
                        disabled={guardando}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={onSubmit}>
                    <div className="formulario-horario">
                        <label>
                            Practicante
                            <select
                                name="practicante_id"
                                value={formulario.practicante_id}
                                onChange={onChange}
                                required
                            >
                                <option value="">
                                    Seleccionar practicante
                                </option>

                                {practicantes
                                    .filter((p) => p.estado === "Activo")
                                    .map((p) => (
                                        <option
                                            key={p.id}
                                            value={p.id}
                                        >
                                            {p.nombre} {p.apellido}
                                        </option>
                                    ))}
                            </select>
                        </label>

                        <div className="campo-dias">
                            <span className="etiqueta-dias">
                                Días de trabajo
                            </span>

                            <div className="selector-dias">
                                {diasSemana.map((dia) => {
                                    const seleccionado = horarios.some(
                                        (h) =>
                                            h.dia_semana === dia.valor &&
                                            h.seleccionado
                                    );

                                    return (
                                        <button
                                            key={dia.valor}
                                            type="button"
                                            className={
                                                seleccionado
                                                    ? "dia-seleccionado"
                                                    : ""
                                            }
                                            aria-pressed={seleccionado}
                                            aria-label={dia.valor}
                                            onClick={() =>
                                                onToggleDia(dia.valor)
                                            }
                                        >
                                            {dia.letra}
                                        </button>
                                    );
                                })}
                            </div>

                            <p className="ayuda-dias">
                                Marca cada día que trabaja el practicante.
                            </p>
                        </div>

                        <div className="horarios-por-dia">
                            {diasSemana.map((dia) => {
                                const horario = horarios.find(
                                    (h) => h.dia_semana === dia.valor
                                );

                                if (!horario?.seleccionado) {
                                    return null;
                                }

                                return (
                                    <div
                                        className="horario-dia"
                                        key={dia.valor}
                                    >
                                        <h3>{dia.valor}</h3>

                                        <label>
                                            Entrada
                                            <input
                                                type="time"
                                                value={
                                                    horario.hora_entrada
                                                }
                                                onChange={(e) =>
                                                    onChangeDia(
                                                        dia.valor,
                                                        "hora_entrada",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </label>

                                        <label>
                                            Salida
                                            <input
                                                type="time"
                                                value={
                                                    horario.hora_salida
                                                }
                                                onChange={(e) =>
                                                    onChangeDia(
                                                        dia.valor,
                                                        "hora_salida",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="modal-horario-acciones">
                        <button
                            type="button"
                            className="btn-cancelar"
                            onClick={onCerrar}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="btn-guardar"
                            disabled={guardando}
                        >
                            {guardando
                                ? "Guardando..."
                                : editando !== null
                                    ? "Guardar cambios"
                                    : "Guardar horario semanal"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}

export default FormularioHorario;
