
function TablaPracticantes({
    practicantes,
    onEditar,
    onCambiarEstado
}) {
    return (
        <div className="practicantes-tabla-contenedor">
            <table className="practicantes-tabla">
                <thead>
                    <tr>
                        <th>Nombre completo</th>
                        <th>WhatsApp</th>
                        <th>Área</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {practicantes.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="practicantes-vacio">
                                No hay practicantes registrados.
                            </td>
                        </tr>
                    ) : (
                        practicantes.map((practicante) => (
                            <tr key={practicante.id}>
                                <td>
                                    {practicante.nombre} {practicante.apellido}
                                </td>

                                <td>{practicante.telefono}</td>

                                <td>{practicante.area}</td>

                                <td>
                                    <span
                                        className={`estado-practicante ${
                                            practicante.estado === "Activo"
                                                ? "estado-activo"
                                                : "estado-inactivo"
                                        }`}
                                    >
                                        {practicante.estado}
                                    </span>
                                </td>

                                <td>
                                    <div className="acciones-practicante">
                                        <button
                                            type="button"
                                            onClick={() => onEditar(practicante)}
                                        >
                                            Editar
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                onCambiarEstado(practicante.id)
                                            }
                                        >
                                            {practicante.estado === "Activo"
                                                ? "Desactivar"
                                                : "Activar"}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default TablaPracticantes;
