
import { useState, useEffect } from "react";
import "./style/practicantes.css";

import TablaPracticantes from "../components/TablaPracticantes";
import FormularioPracticante from "../components/FormularioPracticante";

import {
    obtenerPracticantes,
    registrarPracticante,
    actualizarPracticante,
    cambiarEstadoPracticante
} from "../services/practicantesService";

function Practicantes() {
    const [practicantes, setPracticantes] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [modalAbierto, setModalAbierto] = useState(false);
    const [editando, setEditando] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    const formularioInicial = {
        nombre: "",
        apellido: "",
        telefono: "",
        area: "",
        estado: "Activo"
    };

    const [formulario, setFormulario] = useState(formularioInicial);

    useEffect(() => {
        cargarPracticantes();
    }, []);

    async function cargarPracticantes() {
        try {
            setCargando(true);
            setError("");

            const datos = await obtenerPracticantes();
            setPracticantes(datos);
        } catch (error) {
            setError(error.message || "No se pudieron cargar los practicantes.");
        } finally {
            setCargando(false);
        }
    }

    const listaFiltrada = practicantes.filter((practicante) => {
        const texto = busqueda.toLowerCase();

        return (
            `${practicante.nombre} ${practicante.apellido}`
                .toLowerCase()
                .includes(texto) ||
            practicante.telefono.includes(busqueda)
        );
    });

    function abrirNuevo() {
        setEditando(null);
        setFormulario(formularioInicial);
        setModalAbierto(true);
    }

    function abrirEdicion(practicante) {
        setEditando(practicante.id);

        setFormulario({
            nombre: practicante.nombre,
            apellido: practicante.apellido,
            telefono: practicante.telefono,
            area: practicante.area,
            estado: practicante.estado
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

    async function guardarPracticante(e) {
        e.preventDefault();

        const nombre = formulario.nombre.trim();
        const apellido = formulario.apellido.trim();
        const telefono = formulario.telefono.trim();

        if (!nombre || !apellido || !telefono || !formulario.area) {
            alert("Completa todos los campos obligatorios.");
            return;
        }

        if (!/^\+?[0-9\s-]{7,15}$/.test(telefono)) {
            alert("Ingresa un número de teléfono válido.");
            return;
        }

        const datosPracticante = {
            ...formulario,
            nombre,
            apellido,
            telefono
        };

        try {
            if (editando !== null) {
                await actualizarPracticante(editando, datosPracticante);
            } else {
                await registrarPracticante(datosPracticante);
            }

            cerrarFormulario();
            await cargarPracticantes();
        } catch (error) {
            alert(error.message || "No se pudo guardar el practicante.");
        }
    }

    async function cambiarEstado(id) {
        const practicante = practicantes.find((item) => item.id === id);

        if (!practicante) return;

        const nuevoEstado =
            practicante.estado === "Activo" ? "Inactivo" : "Activo";

        try {
            await cambiarEstadoPracticante(id, nuevoEstado);
            await cargarPracticantes();
        } catch (error) {
            alert(error.message || "No se pudo cambiar el estado.");
        }
    }

    return (
        <div className="practicantes">
            <section className="practicantes-header">
                <div>
                    <h2>Gestión de practicantes</h2>
                    <p>
                        Registra y administra la información de los practicantes.
                    </p>
                </div>

                <button
                    type="button"
                    className="btn-nuevo-practicante"
                    onClick={abrirNuevo}
                >
                    + Nuevo practicante
                </button>
            </section>

            <section className="practicantes-panel">
                <div className="practicantes-toolbar">
                    <input
                        type="search"
                        placeholder="Buscar por nombre o teléfono..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />

                    <span>{listaFiltrada.length} registros</span>
                </div>

                {cargando ? (
                    <p className="practicantes-vacio">
                        Cargando practicantes...
                    </p>
                ) : error ? (
                    <div className="practicantes-vacio">
                        <p>{error}</p>
                        <button type="button" onClick={cargarPracticantes}>
                            Reintentar
                        </button>
                    </div>
                ) : (
                    <TablaPracticantes
                        practicantes={listaFiltrada}
                        onEditar={abrirEdicion}
                        onCambiarEstado={cambiarEstado}
                    />
                )}
            </section>

            {modalAbierto && (
                <FormularioPracticante
                    formulario={formulario}
                    editando={editando}
                    onChange={manejarCambio}
                    onSubmit={guardarPracticante}
                    onCerrar={cerrarFormulario}
                />
            )}
        </div>
    );
}

export default Practicantes;
