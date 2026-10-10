import HorarioSemanal from "./HorarioSemanal.jsx";

function FormularioPracticante({
    formulario,
    idEditado,
    onActualizarCampo,
    onActualizarHorario,
    onGuardar,
    onCancelar
}) {
    return (
        <section className="formulario-practicante-panel">
            <div className="formulario-practicante-header">
                <span className="formulario-etiqueta">
                    REGISTRO DE PERSONAL
                </span>

                <h3>
                    {idEditado !== null
                        ? "Editar mienbros"
                        : "Nuevo mienbros"}
                </h3>

                <p>
                    Completa los datos y configura el horario habitual.
                </p>
            </div>

            <form onSubmit={onGuardar}>
                <div className="formulario-seccion">
                    <h4>Datos del mienbros</h4>

                    <div className="formulario-grid">
                        <label className="campo-formulario">
                            <span>Nombre completo *</span>
                            <input
                                type="text"
                                value={formulario.nombre}
                                onChange={(e) =>
                                    onActualizarCampo("nombre", e.target.value)
                                }
                                placeholder="Ej. Carlos Mendoza"
                                required
                            />
                        </label>

                        <label className="campo-formulario">
                            <span>Área / función habitual *</span>
                            <input
                                type="text"
                                value={formulario.area}
                                onChange={(e) =>
                                    onActualizarCampo("area", e.target.value)
                                }
                                placeholder="Ej. Redes y soporte técnico"
                                required
                            />
                        </label>

                        <label className="campo-formulario">
                            <span>Inicio del convenio</span>
                            <input
                                type="date"
                                value={formulario.fechaInicio}
                                onChange={(e) =>
                                    onActualizarCampo(
                                        "fechaInicio",
                                        e.target.value
                                    )
                                }
                            />
                        </label>

                        <label className="campo-formulario">
                            <span>Fin del convenio</span>
                            <input
                                type="date"
                                value={formulario.fechaFin}
                                min={formulario.fechaInicio || undefined}
                                onChange={(e) =>
                                    onActualizarCampo(
                                        "fechaFin",
                                        e.target.value
                                    )
                                }
                            />
                        </label>
                    </div>

                    <label className="campo-formulario campo-actividades">
                        <span>Actividades habituales</span>
                        <textarea
                            value={formulario.actividades}
                            onChange={(e) =>
                                onActualizarCampo(
                                    "actividades",
                                    e.target.value
                                )
                            }
                            placeholder="Describe brevemente sus tareas..."
                            rows={3}
                        />
                    </label>
                </div>

                <HorarioSemanal
                    horarios={formulario.horarios}
                    onActualizarHorario={onActualizarHorario}
                />

                <div className="formulario-acciones">
                    <button
                        type="button"
                        className="btn-cancelar-formulario"
                        onClick={onCancelar}
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        className="btn-guardar-practicante"
                    >
                        Guardar practicante
                    </button>
                </div>
            </form>
        </section>
    );
}

export default FormularioPracticante;