
function FormularioPracticante({
    formulario,
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
                className="modal-practicante"
                role="dialog"
                aria-modal="true"
                aria-labelledby="titulo-modal-practicante"
            >
                <div className="modal-practicante-header">
                    <div>
                        <h2 id="titulo-modal-practicante">
                            {editando !== null
                                ? "Editar practicante"
                                : "Nuevo practicante"}
                        </h2>

                        <p>Completa los datos del practicante.</p>
                    </div>

                    <button
                        type="button"
                        className="modal-cerrar"
                        aria-label="Cerrar ventana"
                        onClick={onCerrar}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={onSubmit}>
                    <div className="formulario-practicante">
                        <label>
                            Nombre
                            <input
                                name="nombre"
                                value={formulario.nombre}
                                onChange={onChange}
                                required
                            />
                        </label>

                        <label>
                            Apellido
                            <input
                                name="apellido"
                                value={formulario.apellido}
                                onChange={onChange}
                                required
                            />
                        </label>

                        <label>
                            Número de WhatsApp
                            <input
                                name="telefono"
                                type="tel"
                                value={formulario.telefono}
                                onChange={onChange}
                                placeholder="Ej. +51987654321"
                                required
                            />
                        </label>

                        <label>
                            Área o especialidad
                            <select
                                name="area"
                                value={formulario.area}
                                onChange={onChange}
                                required
                            >
                                <option value="">Seleccionar área</option>
                                <option value="Software">Software</option>
                                <option value="Instalaciones">
                                    Instalaciones
                                </option>
                                <option value="Publicidad y contenido">
                                    Publicidad y contenido
                                </option>
                                <option value="Otra">Otra</option>
                            </select>
                        </label>

                        <label>
                            Estado
                            <select
                                name="estado"
                                value={formulario.estado}
                                onChange={onChange}
                            >
                                <option value="Activo">Activo</option>
                                <option value="Inactivo">Inactivo</option>
                            </select>
                        </label>
                    </div>

                    <div className="modal-practicante-acciones">
                        <button
                            type="button"
                            className="btn-cancelar"
                            onClick={onCerrar}
                        >
                            Cancelar
                        </button>

                        <button type="submit" className="btn-guardar">
                            Guardar
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}

export default FormularioPracticante;
