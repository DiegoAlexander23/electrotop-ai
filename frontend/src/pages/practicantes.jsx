import { useState } from "react";
import "./style/practicantes.css";

import ListaPracticantes from "./componentes/ListaPracticantes.jsx";
import FormularioPracticante from "./componentes/FormularioPracticante.jsx";
import { diasSemana } from "./componentes/HorarioSemanal.jsx";

const datosIniciales = [
    {
        id: 1,
        nombre: "Carlos Mendoza",
        area: "Publicidad y creación de contenido",
        fechaInicio: "2026-08-01",
        fechaFin: "2027-01-31",
        actividades: "Crear publicaciones e imágenes para promocionar productos.",
        horarios: {
            lunes: { entrada: "09:00", salida: "15:00" },
            martes: { entrada: "09:00", salida: "15:00" },
            miercoles: { entrada: "09:00", salida: "15:00" },
            jueves: { entrada: "09:00", salida: "15:00" },
            viernes: { entrada: "09:00", salida: "13:00" }
        }
    },
    {
        id: 2,
        nombre: "María Torres",
        area: "Redes y soporte técnico",
        fechaInicio: "2026-08-15",
        fechaFin: "2027-02-15",
        actividades: "Apoyar en la configuración de redes y tareas de soporte.",
        horarios: {
            lunes: { entrada: "08:00", salida: "14:00" },
            martes: { entrada: "08:00", salida: "14:00" },
            miercoles: { entrada: "08:00", salida: "14:00" },
            jueves: { entrada: "08:00", salida: "14:00" },
            viernes: { entrada: "08:00", salida: "12:00" }
        }
    },
    {
        id: 3,
        nombre: "Luis Ramírez",
        area: "Instalación de cámaras de seguridad",
        fechaInicio: "2026-09-01",
        fechaFin: "2027-03-01",
        actividades: "Apoyar al personal técnico durante las instalaciones.",
        horarios: {
            lunes: { entrada: "10:00", salida: "16:00" },
            martes: { entrada: "10:00", salida: "16:00" },
            miercoles: { entrada: "", salida: "" },
            jueves: { entrada: "10:00", salida: "16:00" },
            viernes: { entrada: "10:00", salida: "14:00" }
        }
    }
];

function crearHorariosVacios() {
    return Object.fromEntries(
        diasSemana.map(({ id }) => [
            id,
            { entrada: "", salida: "" }
        ])
    );
}

function crearFormulario(practicante = null) {
    if (!practicante) {
        return {
            nombre: "",
            area: "",
            fechaInicio: "",
            fechaFin: "",
            actividades: "",
            horarios: crearHorariosVacios()
        };
    }

    return {
        ...practicante,
        horarios: Object.fromEntries(
            diasSemana.map(({ id }) => [
                id,
                {
                    entrada: practicante.horarios[id]?.entrada || "",
                    salida: practicante.horarios[id]?.salida || ""
                }
            ])
        )
    };
}

function Practicantes() {
    const [practicantes, setPracticantes] = useState(datosIniciales);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [idEditado, setIdEditado] = useState(null);
    const [formulario, setFormulario] = useState(() => crearFormulario());

    function nuevoPracticante() {
        setIdEditado(null);
        setFormulario(crearFormulario());
        setMostrarFormulario(true);
    }

    function editarPracticante(persona) {
        setIdEditado(persona.id);
        setFormulario(crearFormulario(persona));
        setMostrarFormulario(true);
    }

    function actualizarCampo(campo, valor) {
        setFormulario((actual) => ({
            ...actual,
            [campo]: valor
        }));
    }

    function actualizarHorario(dia, campo, valor) {
        setFormulario((actual) => ({
            ...actual,
            horarios: {
                ...actual.horarios,
                [dia]: {
                    ...actual.horarios[dia],
                    [campo]: valor
                }
            }
        }));
    }

    function guardarPracticante(evento) {
        evento.preventDefault();

        const nombre = formulario.nombre.trim();
        const area = formulario.area.trim();

        if (!nombre || !area) return;

        const registro = {
            ...formulario,
            nombre,
            area,
            actividades: formulario.actividades.trim()
        };

        if (idEditado !== null) {
            setPracticantes((actuales) =>
                actuales.map((persona) =>
                    persona.id === idEditado
                        ? { ...registro, id: idEditado }
                        : persona
                )
            );
        } else {
            setPracticantes((actuales) => [
                ...actuales,
                { ...registro, id: Date.now() }
            ]);
        }

        cancelarFormulario();
    }

    function cancelarFormulario() {
        setMostrarFormulario(false);
        setIdEditado(null);
        setFormulario(crearFormulario());
    }

    return (
        <div className="practicantes-page">
            <header className="practicantes-header">
                <div>
                    <h2>Mienbros</h2>
                    <p>
                        Registra a los mienbros y administra sus horarios
                        y funciones habituales.
                    </p>
                </div>

                {!mostrarFormulario && (
                    <button
                        className="btn-nuevo-practicante"
                        onClick={nuevoPracticante}
                    >
                        + Nuevo mienbros
                    </button>
                )}
            </header>

            {mostrarFormulario ? (
                <FormularioPracticante
                    formulario={formulario}
                    idEditado={idEditado}
                    onActualizarCampo={actualizarCampo}
                    onActualizarHorario={actualizarHorario}
                    onGuardar={guardarPracticante}
                    onCancelar={cancelarFormulario}
                />
            ) : (
                <ListaPracticantes
                    practicantes={practicantes}
                    onNuevo={nuevoPracticante}
                    onEditar={editarPracticante}
                />
            )}
        </div>
    );
}

export default Practicantes;