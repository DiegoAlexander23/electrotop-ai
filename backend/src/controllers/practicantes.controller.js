
import pool from "../config/database.js";

export async function obtenerPracticantes(req, res) {
    try {
        const [practicantes] = await pool.query(
            `SELECT id, nombre, apellido, telefono, area, estado, fecha_registro
             FROM practicantes
             ORDER BY id DESC`
        );

        res.json({
            success: true,
            practicantes
        });
    } catch (error) {
        console.error("Error al obtener practicantes:", error.message);

        res.status(500).json({
            success: false,
            mensaje: "Error al consultar los practicantes."
        });
    }
}

export async function registrarPracticante(req, res) {
    try {
        const { nombre, apellido, telefono, area, estado = "Activo" } = req.body;

        if (
            typeof nombre !== "string" ||
            typeof apellido !== "string" ||
            typeof telefono !== "string" ||
            typeof area !== "string" ||
            !nombre.trim() ||
            !apellido.trim() ||
            !telefono.trim() ||
            !area.trim()
        ) {
            return res.status(400).json({
                success: false,
                mensaje: "Completa todos los campos obligatorios."
            });
        }

        if (!/^\+?[0-9\s-]{7,15}$/.test(telefono.trim())) {
            return res.status(400).json({
                success: false,
                mensaje: "Ingresa un número de teléfono válido."
            });
        }

        if (!["Activo", "Inactivo"].includes(estado)) {
            return res.status(400).json({
                success: false,
                mensaje: "El estado indicado no es válido."
            });
        }

        const [resultado] = await pool.query(
            `INSERT INTO practicantes (nombre, apellido, telefono, area, estado)
             VALUES (?, ?, ?, ?, ?)`,
            [
                nombre.trim(),
                apellido.trim(),
                telefono.trim(),
                area.trim(),
                estado
            ]
        );

        res.status(201).json({
            success: true,
            mensaje: "Practicante registrado correctamente.",
            id: resultado.insertId
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                mensaje: "Este número de teléfono ya está registrado."
            });
        }

        console.error("Error al registrar practicante:", error.message);

        res.status(500).json({
            success: false,
            mensaje: "Error al registrar el practicante."
        });
    }
}

export async function actualizarPracticante(req, res) {
    try {
        const { id } = req.params;
        const { nombre, apellido, telefono, area, estado } = req.body;

        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({
                success: false,
                mensaje: "El identificador no es válido."
            });
        }

        if (
            typeof nombre !== "string" ||
            typeof apellido !== "string" ||
            typeof telefono !== "string" ||
            typeof area !== "string" ||
            !nombre.trim() ||
            !apellido.trim() ||
            !telefono.trim() ||
            !area.trim()
        ) {
            return res.status(400).json({
                success: false,
                mensaje: "Completa todos los campos obligatorios."
            });
        }

        if (!/^\+?[0-9\s-]{7,15}$/.test(telefono.trim())) {
            return res.status(400).json({
                success: false,
                mensaje: "Ingresa un número de teléfono válido."
            });
        }

        if (!["Activo", "Inactivo"].includes(estado)) {
            return res.status(400).json({
                success: false,
                mensaje: "El estado indicado no es válido."
            });
        }

        const [resultado] = await pool.query(
            `UPDATE practicantes
             SET nombre = ?, apellido = ?, telefono = ?, area = ?, estado = ?
             WHERE id = ?`,
            [
                nombre.trim(),
                apellido.trim(),
                telefono.trim(),
                area.trim(),
                estado,
                Number(id)
            ]
        );

        if (resultado.affectedRows === 0) {
            const [filas] = await pool.query(
                "SELECT id FROM practicantes WHERE id = ?",
                [Number(id)]
            );

            if (filas.length === 0) {
                return res.status(404).json({
                    success: false,
                    mensaje: "No se encontró el practicante."
                });
            }
        }

        res.json({
            success: true,
            mensaje: "Practicante actualizado correctamente."
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                mensaje: "Este número de teléfono ya está registrado."
            });
        }

        console.error("Error al actualizar practicante:", error.message);

        res.status(500).json({
            success: false,
            mensaje: "Error al actualizar el practicante."
        });
    }
}

export async function cambiarEstadoPracticante(req, res) {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({
                success: false,
                mensaje: "El identificador no es válido."
            });
        }

        if (!["Activo", "Inactivo"].includes(estado)) {
            return res.status(400).json({
                success: false,
                mensaje: "El estado indicado no es válido."
            });
        }

        const [resultado] = await pool.query(
            "UPDATE practicantes SET estado = ? WHERE id = ?",
            [estado, Number(id)]
        );

        if (resultado.affectedRows === 0) {
            const [filas] = await pool.query(
                "SELECT id FROM practicantes WHERE id = ?",
                [Number(id)]
            );

            if (filas.length === 0) {
                return res.status(404).json({
                    success: false,
                    mensaje: "No se encontró el practicante."
                });
            }
        }

        res.json({
            success: true,
            mensaje: "Estado actualizado correctamente."
        });
    } catch (error) {
        console.error("Error al cambiar estado:", error.message);

        res.status(500).json({
            success: false,
            mensaje: "Error al cambiar el estado del practicante."
        });
    }
}
