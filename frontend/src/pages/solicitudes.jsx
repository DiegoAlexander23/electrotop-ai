import "./style/solicitudes.css";

function Solicitudes() {

    const solicitudes = [
        {
            id: "01",
            contacto: "987654321",
            tipo: "Instalación",
            descripcion: "Instalación de 4 cámaras",
            fecha: "02/10/2026",
            estado: "En seguimiento"
        },
        {
            id: "02",
            contacto: "912345678",
            tipo: "Mantenimiento",
            descripcion: "Revisar sistema DVR",
            fecha: "01/10/2026",
            estado: "Atendida"
        },
        {
            id: "03",
            contacto: "976543210",
            tipo: "Evaluación",
            descripcion: "Evaluación de cámaras",
            fecha: "01/10/2026",
            estado: "Por atender"
        }
    ];
    return (
        <div className="solicitudes">
            <div className="solicitudes-header">
                <h1>Solicitudes</h1>
                <p>
                    Gestiona las solicitudes generadas durante la atención al cliente.
                </p>
            </div>
            <div className="filtros">
                <input
                    type="text"
                    placeholder="Buscar solicitud"
                />
                <select>
                    <option>Todos los tipos</option>
                    <option>Instalación</option>
                    <option>Mantenimiento</option>
                    <option>Evaluación</option>
                    <option>Otro</option>
                </select>
                <select>
                    <option>Todos los estados</option>
                    <option>Por atender</option>
                    <option>En seguimiento</option>
                    <option>Atendida</option>
                    <option>Cancelada</option>
                </select>
            </div>
            <div className="tabla-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Contacto</th>
                            <th>Tipo</th>
                            <th>Descripción</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {solicitudes.map((solicitud) => (
                            <tr key={solicitud.id}>
                                <td>#{solicitud.id}</td>
                                <td>{solicitud.contacto}</td>
                                <td>{solicitud.tipo}</td>
                                <td>{solicitud.descripcion}</td>
                                <td>{solicitud.fecha}</td>
                                <td>
                                    <span className={`estado ${solicitud.estado
                                        .toLowerCase()
                                        .replace(" ", "-")}`}>
                                        {solicitud.estado}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn-ver">
                                        Ver
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Solicitudes;