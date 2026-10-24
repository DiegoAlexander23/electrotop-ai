
function TablaHorarios({ horarios, onEditar, onEliminar }) {
    return (
        <div className="horarios-tabla-contenedor">
            <table className="horarios-tabla">
                <thead>
                    <tr>
                        <th>Practicante</th>
                        <th>Día</th>
                        <th>Entrada</th>
                        <th>Salida</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {horarios.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="horarios-vacio">
                                No hay horarios asignados.
                            </td>
                        </tr>
                    ) : (
                        horarios.map((horario) => (
                            <tr key={horario.id}>
                                <td>
                                    {horario.nombre} {horario.apellido}
                                </td>
                                <td>{horario.dia_semana}</td>
                                <td>{String(horario.hora_entrada).slice(0, 5)}</td>
                                <td>{String(horario.hora_salida).slice(0, 5)}</td>
                                <td>
                                    <div className="acciones-horario">
                                        <button
                                            type="button"
                                            onClick={() => onEditar(horario)}
                                        >
                                            Editar
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => onEliminar(horario.id)}
                                        >
                                            Eliminar
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

export default TablaHorarios;
