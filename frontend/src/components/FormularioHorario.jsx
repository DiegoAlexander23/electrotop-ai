
function FormularioHorario({
    formulario,
    practicantes,
    editando,
    onChange,
    onSubmit,
    onCerrar
}) {
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
                                ? "Editar horario"
                                : "Asignar horario"}
                        </h2>
                        <p>Define el día y las horas de la jornada.</p>
                    </div>

                    <button
                        type="button"
                        className="modal-cerrar"
                        onClick={onCerrar}
                        aria-label="Cerrar ventana"
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
                                <option value="">Seleccionar practicante</option>

                                {practicantes
                                    .filter((p) => p.estado === "Activo")
                                    .map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.nombre} {p.apellido}
                                        </option>
                                    ))}
                            </select>
                        </label>

                        <label>
                            Día de la semana
                            <select
                                name="dia_semana"
                                value={formulario.dia_semana}
                                onChange={onChange}
                                required
                            >
                                <option value="">Seleccionar día</option>
                                <option value="Lunes">Lunes</option>
                                <option value="Martes">Martes</option>
                                <option value="Miércoles">Miércoles</option>
                                <option value="Jueves">Jueves</option>
                                <option value="Viernes">Viernes</option>
                                <option value="Sábado">Sábado</option>
                                <option value="Domingo">Domingo</option>
                            </select>
                        </label>

                        <label>
                            Hora de entrada
                            <input
                                type="time"
                                name="hora_entrada"
                                value={formulario.hora_entrada}
                                onChange={onChange}
                                required
                            />
                        </label>

                        <label>
                            Hora de salida
                            <input
                                type="time"
                                name="hora_salida"
                                value={formulario.hora_salida}
                                onChange={onChange}
                                required
                            />
                        </label>
                    </div>

                    <div className="modal-horario-acciones">
                        <button
                            type="button"
                            className="btn-cancelar"
                            onClick={onCerrar}
                        >
                            Cancelar
                        </button>

                        <button type="submit" className="btn-guardar">
                            Guardar horario
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}

export default FormularioHorario;
