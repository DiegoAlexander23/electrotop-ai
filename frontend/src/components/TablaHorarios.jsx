
function TablaHorarios({ horarios, onVerHorario, onEditar, onEliminar }) {
    const practicantesMap = new Map();

    horarios.forEach((horario) => {
        const id = String(horario.practicante_id);

        if (!practicantesMap.has(id)) {
            practicantesMap.set(id, {
                practicante_id: horario.practicante_id,
                nombre: horario.nombre,
                apellido: horario.apellido,
                horarios: []
            });
        }

        practicantesMap.get(id).horarios.push(horario);
    });

    const practicantesAgrupados = Array.from(
        practicantesMap.values()
    );

    return (
        <div className="horarios-tabla-contenedor">
            <table className="horarios-tabla">
                <thead>
                    <tr>
                        <th>Practicante</th>
                        <th>Días asignados</th>
                        <th>Jornadas</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {practicantesAgrupados.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="horarios-vacio">
                                No hay horarios asignados.
                            </td>
                        </tr>
                    ) : (
                        practicantesAgrupados.map((practicante) => {
                            const dias = practicante.horarios.map(
                                (h) => h.dia_semana
                            );

                            return (
                                <tr key={practicante.practicante_id}>
                                    <td>
                                        {practicante.nombre}{" "}
                                        {practicante.apellido}
                                    </td>

                                    <td>
                                        {dias.length}{" "}
                                        {dias.length === 1  
                                            ? "día"
                                            : "días"}
                                    </td>

                                    <td>
                                        {dias.join(", ")}
                                    </td>

                                    <td>
                                        <div className="acciones-horario">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onVerHorario(practicante)
                                                }
                                            >
                                                Ver horario
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onEditar(practicante)
                                                }
                                            >
                                                Editar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onEliminar(practicante.practicante_id)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default TablaHorarios;
