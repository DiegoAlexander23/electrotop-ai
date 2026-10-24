
import { useState, useEffect } from "react";
import "./style/horarios.css";

import TablaHorarios from "../components/TablaHorarios";
import FormularioHorario from "../components/FormularioHorario";

import { obtenerPracticantes } from "../services/practicantesService";
import {
    obtenerHorarios,
    registrarHorariosSemana,
    actualizarHorariosSemana
} from "../services/horariosService";
import CalendarioSemanal from "../components/CalendarioSemanal";

const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo"
];

function crearHorariosIniciales() {
    return diasSemana.map((dia) => ({
        dia_semana: dia,
        seleccionado: false,
        hora_entrada: "",
        hora_salida: ""
    }));
}

function crearFormularioInicial() {
    return {
        practicante_id: "",
        horarios: crearHorariosIniciales()
    };
}

function Horarios() {
    const [horarios, setHorarios] = useState([]);
    const [practicantes, setPracticantes] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [modalAbierto, setModalAbierto] = useState(false);
    const [editando, setEditando] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");
    const [practicanteSeleccionado, setPracticanteSeleccionado] = useState(null);

    const [formulario, setFormulario] = useState(
        crearFormularioInicial
    );

    useEffect(() => {
        cargarDatos();
    }, []);

    async function cargarDatos() {
        try {
            setCargando(true);
            setError("");

            const [datosHorarios, datosPracticantes] =
                await Promise.all([
                    obtenerHorarios(),
                    obtenerPracticantes()
                ]);

            setHorarios(datosHorarios);
            setPracticantes(datosPracticantes);
        } catch (error) {
            setError(
                error.message || "No se pudieron cargar los datos."
            );
        } finally {
            setCargando(false);
        }
    }

    const horariosFiltrados = horarios.filter((horario) => {
        const nombre =
            `${horario.nombre} ${horario.apellido}`.toLowerCase();

        const termino = busqueda.toLowerCase();

        return (
            nombre.includes(termino) ||
            horario.dia_semana.toLowerCase().includes(termino)
        );
    });

    function abrirNuevo() {
        setEditando(null);
        setFormulario(crearFormularioInicial());
        setModalAbierto(true);
    }
    function verHorario(practicante) {
        setPracticanteSeleccionado(practicante);
    }

    function abrirEdicion(practicante) {
        const horariosActuales = horarios.filter(
            (horario) =>
                String(horario.practicante_id) ===
                String(practicante.practicante_id)
        );

        const horariosFormulario = crearHorariosIniciales().map(
            (horarioInicial) => {
                const horarioGuardado = horariosActuales.find(
                    (horario) =>
                        horario.dia_semana === horarioInicial.dia_semana
                );

                if (!horarioGuardado) {
                    return horarioInicial;
                }

                return {
                    ...horarioInicial,
                    seleccionado: true,
                    hora_entrada: String(horarioGuardado.hora_entrada).slice(0, 5),
                    hora_salida: String(horarioGuardado.hora_salida).slice(0, 5)
                };
            }
        );

        setEditando(practicante.practicante_id);

        setFormulario({
            practicante_id: String(practicante.practicante_id),
            horarios: horariosFormulario
        });

        setModalAbierto(true);
    }

    function cerrarFormulario() {
        setModalAbierto(false);
        setEditando(null);
        setFormulario(crearFormularioInicial());
    }

    function manejarCambio(e) {
        const { name, value } = e.target;

        setFormulario((anterior) => ({
            ...anterior,
            [name]: value
        }));
    }

    function manejarToggleDia(diaSeleccionado) {
        setFormulario((anterior) => ({
            ...anterior,
            horarios: anterior.horarios.map((horario) =>
                horario.dia_semana === diaSeleccionado
                    ? {
                        ...horario,
                        seleccionado: !horario.seleccionado
                    }
                    : horario
            )
        }));
    }

    function manejarCambioDia(diaSeleccionado, campo, valor) {
        setFormulario((anterior) => ({
            ...anterior,
            horarios: anterior.horarios.map((horario) =>
                horario.dia_semana === diaSeleccionado
                    ? {
                        ...horario,
                        [campo]: valor
                    }
                    : horario
            )
        }));
    }

    async function guardarHorario(e) {
    e.preventDefault();

    if (guardando) return;

    if (!formulario.practicante_id) {
        alert("Selecciona un practicante.");
        return;
    }

    const horariosSeleccionados = formulario.horarios.filter(
        (horario) => horario.seleccionado
    );

    if (horariosSeleccionados.length === 0) {
        alert("Selecciona al menos un día de trabajo.");
        return;
    }

    for (const horario of horariosSeleccionados) {
        if (!horario.hora_entrada || !horario.hora_salida) {
            alert(
                `Completa las horas de entrada y salida del ${horario.dia_semana}.`
            );
            return;
        }

        if (horario.hora_entrada >= horario.hora_salida) {
            alert(
                `La salida del ${horario.dia_semana} debe ser posterior a la entrada.`
            );
            return;
        }
    }

    const datos = {
        horarios: horariosSeleccionados.map((horario) => ({
            dia_semana: horario.dia_semana,
            hora_entrada: horario.hora_entrada,
            hora_salida: horario.hora_salida
        }))
    };

    const estabaEditando = editando !== null;

    try {
        setGuardando(true);

        if (estabaEditando) {
            await actualizarHorariosSemana(editando, datos);
        } else {
            await registrarHorariosSemana({
                practicante_id: Number(formulario.practicante_id),
                ...datos
            });
        }

        setModalAbierto(false);
        setEditando(null);
        setFormulario(crearFormularioInicial());

        await cargarDatos();

        alert(
            estabaEditando
                ? "Horario semanal actualizado correctamente."
                : "Horario semanal registrado correctamente."
        );
        } catch (error) {
            alert(
                error.message || "No se pudo guardar el horario semanal."
            );
        } finally {
            setGuardando(false);
        }   
    }

    function eliminarHorario(id) {
        alert(`Todavía falta conectar la eliminación del horario ${id}.`);
    }

    return (
        <div className="horarios">
            <section className="horarios-header">
                <div>
                    <h2>Gestión de horarios</h2>
                    <p>
                        Asigna y administra las jornadas de los practicantes.
                    </p>
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

                    <span>
                        {horariosFiltrados.length} horarios
                    </span>
                </div>

                {cargando ? (
                    <p className="horarios-vacio">
                        Cargando horarios...
                    </p>
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
                        onVerHorario={verHorario}
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
                    onToggleDia={manejarToggleDia}
                    onChangeDia={manejarCambioDia}
                    onSubmit={guardarHorario}
                    onCerrar={cerrarFormulario}
                    guardando={guardando}
                />
            )}
            {practicanteSeleccionado && (
                <CalendarioSemanal
                    practicante={practicanteSeleccionado}
                    horarios={horarios.filter(
                        (horario) =>
                            String(horario.practicante_id) ===
                            String(practicanteSeleccionado.practicante_id)
                    )}
                    onCerrar={() => setPracticanteSeleccionado(null)}
                />
            )}
        </div>
    );
}

export default Horarios;
