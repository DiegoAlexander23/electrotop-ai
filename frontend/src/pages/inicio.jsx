
import "./style/inicio.css";

const practicantesEjemplo = [
    {
        id: 1,
        nombre: "Carlos Mendoza",
        area: "Publicidad y contenido",
        horarios: {
            lunes: "09:00 - 15:00",
            martes: "09:00 - 15:00",
            miercoles: "09:00 - 15:00",
            jueves: "09:00 - 15:00",
            viernes: "09:00 - 13:00"
        }
    },
    {
        id: 2,
        nombre: "María Torres",
        area: "Redes y soporte técnico",
        horarios: {
            lunes: "08:00 - 14:00",
            martes: "08:00 - 14:00",
            miercoles: "08:00 - 14:00",
            jueves: "08:00 - 14:00",
            viernes: "08:00 - 12:00"
        }
    },
    {
        id: 3,
        nombre: "Luis Ramírez",
        area: "Instalación de cámaras",
        horarios: {
            lunes: "10:00 - 16:00",
            martes: "10:00 - 16:00",
            miercoles: "-",
            jueves: "10:00 - 16:00",
            viernes: "10:00 - 14:00"
        }
    },
    {
        id: 4,
        nombre: "Ana Flores",
        area: "Publicidad y contenido",
        horarios: {
            lunes: "08:00 - 14:00",
            martes: "-",
            miercoles: "08:00 - 14:00",
            jueves: "08:00 - 14:00",
            viernes: "08:00 - 12:00"
        }
    },
    {
        id: 5,
        nombre: "José Vargas",
        area: "Redes y soporte técnico",
        horarios: {
            lunes: "-",
            martes: "12:00 - 18:00",
            miercoles: "12:00 - 18:00",
            jueves: "12:00 - 18:00",
            viernes: "12:00 - 16:00"
        }
    },
    {
        id: 6,
        nombre: "Daniela Rojas",
        area: "Instalación de cámaras",
        horarios: {
            lunes: "09:00 - 15:00",
            martes: "09:00 - 15:00",
            miercoles: "09:00 - 15:00",
            jueves: "-",
            viernes: "09:00 - 13:00"
        }
    }
];

const diasSemana = [
    { id: "lunes", nombre: "Lunes" },
    { id: "martes", nombre: "Martes" },
    { id: "miercoles", nombre: "Miércoles" },
    { id: "jueves", nombre: "Jueves" },
    { id: "viernes", nombre: "Viernes" },
    { id: "sabado", nombre: "Sabado" }
];

function Inicio() {
    return (
        <div className="inicio">
            <section className="inicio-header">
                <div>
                    <h2>Resumen general</h2>
                    <p>
                        Consulta los horarios habituales de los practicantes.
                    </p>
                </div>

                <span className="inicio-etiqueta">
                    <span className="punto-activo"></span>
                    Horarios habituales
                </span>
            </section>

            <section className="estadisticas">
                <article className="tarjeta tarjeta-practicantes">
                    <div>
                        <p>Practicantes</p>
                        <strong>6</strong>
                        <span>Registrados en el sistema</span>
                    </div>
                </article>

                {/*<article className="tarjeta tarjeta-aprobado">
                    <div className="tarjeta-icono">✓</div>
                    <div>
                        <p>Horario aprobado</p>
                        <strong>4 de 6</strong>
                        <span>Con horario aprobado</span>
                    </div>
                </article>

                <article className="tarjeta tarjeta-conflictos">
                    <div className="tarjeta-icono">!</div>
                    <div>
                        <p>Conflictos</p>
                        <strong>2</strong>
                        <span>Por revisar</span>
                    </div>
                </article>

                <article className="tarjeta tarjeta-horas">
                    <div>
                        <p>Horas programadas</p>
                        <strong>132 h</strong>
                        <span>Por semana, según el ejemplo</span>
                    </div>
                </article>*/}
            </section>

            <section className="horarios-panel">
                <div className="horarios-header">   
                    <div>
                        <h2>Horario habitual de trabajo</h2>
                    </div>
                </div>

                <div className="tabla-contenedor">
                    <table className="tabla-horarios">
                        <thead>
                            <tr>
                                <th className="columna-practicante">
                                    Practicante
                                </th>
                                <th className="columna-area">
                                    Área / función
                                </th>

                                {diasSemana.map((dia) => (
                                    <th key={dia.id}>
                                        <span className="dia-nombre">
                                            {dia.nombre}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {practicantesEjemplo.map((practicante) => (
                                <tr key={practicante.id}>
                                    <td className="celda-practicante">
                                        <div className="datos-practicante">
                                            <div className="avatar-practicante">
                                                {practicante.nombre
                                                    .split(" ")
                                                    .map((parte) => parte[0])
                                                    .slice(0, 2)
                                                    .join("")}
                                            </div>

                                            <div className="nombre-practicante">
                                                <strong>
                                                    {practicante.nombre}
                                                </strong>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="celda-area">
                                        {practicante.area}
                                    </td>

                                    {diasSemana.map((dia) => {
                                        const horario =
                                            practicante.horarios[dia.id];

                                        return (
                                            <td key={dia.id}>
                                                {horario && horario !== "-" ? (
                                                    <div className="bloque-horario">
                                                        <span className="horario-punto"></span>
                                                        {horario}
                                                    </div>
                                                ) : (
                                                    <span className="sin-horario">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

export default Inicio;
