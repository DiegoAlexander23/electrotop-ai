
import { useState, useEffect } from "react";
import "./style/horarios.css";

import TablaHorarios from "../components/TablaHorarios";
import FormularioHorario from "../components/FormularioHorario";

import { obtenerHorarios } from "../services/horariosService";
import { obtenerPracticantes } from "../services/practicantesService";

function Horarios() {
    const [horarios, setHorarios] = useState([]);
    const [practicantes, setPracticantes] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [modalAbierto, setModalAbierto] = useState(false);
    const [editando, setEditando] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    const formularioInicial = {
        practicante_id: "",
        dia_semana: "",
        hora_entrada: "",
        hora_salida: ""
    };

    const [formulario, setFormulario] = useState(formularioInicial);

    useEffect(() => {
        cargarDatos();
    }, []);

    async function cargarDatos() {
        try {
            setCargando(true);
            setError("");

            const [datosHorarios, datosPracticantes] = await Promise.all([
                obtenerHorarios(),
                obtenerPracticantes()
            ]);

            setHorarios(datosHorarios);
            setPracticantes(datosPracticantes);
        } catch (error) {
            setError(error.message || "No se pudieron cargar los datos.");
        } finally {
            setCargando(false);
        }
    }

    const horariosFiltrados = horarios.filter((horario) => {
        const nombre = `${horario.nombre} ${horario.apellido}`.toLowerCase();

        return (
            nombre.includes(busqueda.toLowerCase()) ||
            horario.dia_semana.toLowerCase().includes(busqueda.toLowerCase())
        );
    });

    function abrirNuevo() {
        setEditando(null);
        setFormulario(formularioInicial);
        setModalAbierto(true);
    }

    function abrirEdicion(horario) {
        setEditando(horario.id);

        setFormulario({
            practicante_id: String(horario.practicante_id),
            dia_semana: horario.dia_semana,
            hora_entrada: String(horario.hora_entrada).slice(0, 5),
            hora_salida: String(horario.hora_salida).slice(0, 5)
        });

        setModalAbierto(true);
    }

    function cerrarFormulario() {
        setModalAbierto(false);
        setEditando(null);
        setFormulario(formularioInicial);
    }

    function manejarCambio(e) {
        const { name, value } = e.target;

        setFormulario((anterior) => ({
            ...anterior,
            [name]: value
        }));
    }

    function guardarHorario(e) {
        e.preventDefault();

        if (
            !formulario.practicante_id ||
            !formulario.dia_semana ||
            !formulario.hora_entrada ||
            !formulario.hora_salida
        ) {
            alert("Completa todos los campos.");
            return;
        }

        if (formulario.hora_entrada >= formulario.hora_salida) {
            alert("La hora de salida debe ser posterior a la entrada.");
            return;
        }

        alert("El formulario está listo. Falta conectar el guardado al backend.");
    }

    function eliminarHorario(id) {
        alert(`Todavía falta conectar la eliminación del horario ${id}.`);
    }

    return (
        <div className="horarios">
            <section className="horarios-header">
                <div>
                    <h2>Gestión de horarios</h2>
                    <p>Asigna y administra las jornadas de los practicantes.</p>
                </div>

                <button
                    type="button"
                    className="btn-nuevo-horario"
                    onClick={abrirNuevo}
                >
                    + Asignar horario
                </button>
            </section>

            <section className="horarios-panel">
                <div className="horarios-toolbar">
                    <input
                        type="search"
                        placeholder="Buscar por practicante o día..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />

                    <span>{horariosFiltrados.length} horarios</span>
                </div>

                {cargando ? (
                    <p className="horarios-vacio">Cargando horarios...</p>
                ) : error ? (
                    <div className="horarios-vacio">
                        <p>{error}</p>
                        <button type="button" onClick={cargarDatos}>
                            Reintentar
                        </button>
                    </div>
                ) : (
                    <TablaHorarios
                        horarios={horariosFiltrados}
                        onEditar={abrirEdicion}
                        onEliminar={eliminarHorario}
                    />
                )}
            </section>

            {modalAbierto && (
                <FormularioHorario
                    formulario={formulario}
                    practicantes={practicantes}
                    editando={editando}
                    onChange={manejarCambio}
                    onSubmit={guardarHorario}
                    onCerrar={cerrarFormulario}
                />
            )}
        </div>
    );
}

export default Horarios;
