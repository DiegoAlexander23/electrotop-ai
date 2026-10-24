import pool from "../config/database.js";

export async function obtenerHorarios(req, res) {
    try {
        const [horarios] = await pool.query(`
            SELECT
                h.id,
                h.practicante_id,
                p.nombre,
                p.apellido,
                h.dia_semana,
                h.hora_entrada,
                h.hora_salida
            FROM horarios h
            INNER JOIN practicantes p
                ON h.practicante_id = p.id
            ORDER BY h.id DESC
        `);

        res.json({
            success: true,
            horarios
        });

    } catch (error) {
        console.error("Error al obtener horarios:", error.message);

        res.status(500).json({
            success: false,
            mensaje: "Error al consultar los horarios."
        });
    }
}

export async function registrarHorario(req, res) {
    try {
        const {
            practicante_id,
            dia_semana,
            hora_entrada,
            hora_salida
        } = req.body;

        // Validar los campos obligatorios
        if (
            !practicante_id ||
            !dia_semana ||
            !hora_entrada ||
            !hora_salida
        ) {
            return res.status(400).json({
                success: false,
                mensaje: "Completa todos los campos obligatorios."
            });
        }

        // Validar el identificador del practicante
        if (!/^[1-9]\d*$/.test(String(practicante_id))) {
            return res.status(400).json({
                success: false,
                mensaje: "El practicante seleccionado no es válido."
            });
        }

        // Validar el día de la semana
        const diasValidos = [
            "Lunes",
            "Martes",
            "Miércoles",
            "Jueves",
            "Viernes",
            "Sábado",
            "Domingo"
        ];

        if (!diasValidos.includes(dia_semana)) {
            return res.status(400).json({
                success: false,
                mensaje: "El día de la semana no es válido."
            });
        }

        // Validar el formato y el orden de las horas
        const formatoHora = /^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/;

        if (
            !formatoHora.test(hora_entrada) ||
            !formatoHora.test(hora_salida) ||
            hora_entrada >= hora_salida
        ) {
            return res.status(400).json({
                success: false,
                mensaje: "La hora de salida debe ser posterior a la entrada."
            });
        }

        // Comprobar que el practicante exista y esté activo
        const [practicantes] = await pool.query(
            "SELECT id FROM practicantes WHERE id = ? AND estado = 'Activo'",
            [Number(practicante_id)]
        );

        if (practicantes.length === 0) {
            return res.status(400).json({
                success: false,
                mensaje: "El practicante no existe o está inactivo."
            });
        }

        // Registrar el horario en MySQL
        await pool.query(
            `INSERT INTO horarios
                (practicante_id, dia_semana, hora_entrada, hora_salida)
             VALUES (?, ?, ?, ?)`,
            [
                Number(practicante_id),
                dia_semana,
                hora_entrada,
                hora_salida
            ]
        );

        res.status(201).json({
            success: true,
            mensaje: "Horario registrado correctamente."
        });

    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                mensaje: "Este practicante ya tiene un horario asignado para ese día."
            });
        }

        console.error("Error al registrar horario:", error.message);

        res.status(500).json({
            success: false,
            mensaje: "Error al registrar el horario."
        });
    }
}
