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

        if (!/^[1-9]\d*$/.test(String(practicante_id))) {
            return res.status(400).json({
                success: false,
                mensaje: "El practicante seleccionado no es válido."
            });
        }

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
export async function registrarHorariosSemana(req, res) {
    let conexion;

    try {
        const { practicante_id, horarios } = req.body;

        if (
            !/^[1-9]\d*$/.test(String(practicante_id ?? "")) ||
            !Array.isArray(horarios) ||
            horarios.length === 0 ||
            horarios.length > 7
        ) {
            return res.status(400).json({
                success: false,
                mensaje: "Selecciona un practicante y al menos un día."
            });
        }

        const diasValidos = [
            "Lunes",
            "Martes",
            "Miércoles",
            "Jueves",
            "Viernes",
            "Sábado",
            "Domingo"
        ];

        const formatoHora = /^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/;
        const diasRecibidos = new Set();

        for (const horario of horarios) {
            const {
                dia_semana,
                hora_entrada,
                hora_salida
            } = horario ?? {};

            if (!diasValidos.includes(dia_semana)) {
                return res.status(400).json({
                    success: false,
                    mensaje: "Uno de los días seleccionados no es válido."
                });
            }

            if (diasRecibidos.has(dia_semana)) {
                return res.status(400).json({
                    success: false,
                    mensaje: `El día ${dia_semana} está repetido.`
                });
            }

            diasRecibidos.add(dia_semana);

            if (
                typeof hora_entrada !== "string" ||
                typeof hora_salida !== "string" ||
                !formatoHora.test(hora_entrada) ||
                !formatoHora.test(hora_salida) ||
                hora_entrada >= hora_salida
            ) {
                return res.status(400).json({
                    success: false,
                    mensaje: `Revisa las horas de entrada y salida del ${dia_semana}.`
                });
            }
        }

        const [practicantes] = await pool.query(
            `SELECT id
             FROM practicantes
             WHERE id = ? AND estado = 'Activo'`,
            [Number(practicante_id)]
        );

        if (practicantes.length === 0) {
            return res.status(400).json({
                success: false,
                mensaje: "El practicante no existe o está inactivo."
            });
        }

        conexion = await pool.getConnection();
        await conexion.beginTransaction();

        for (const horario of horarios) {
            await conexion.query(
                `INSERT INTO horarios
                    (practicante_id, dia_semana, hora_entrada, hora_salida)
                 VALUES (?, ?, ?, ?)`,
                [
                    Number(practicante_id),
                    horario.dia_semana,
                    horario.hora_entrada,
                    horario.hora_salida
                ]
            );
        }

        await conexion.commit();

        return res.status(201).json({
            success: true,
            mensaje: "Horario semanal registrado correctamente.",
            cantidad: horarios.length
        });

    } catch (error) {
        if (conexion) {
            await conexion.rollback();
        }

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                mensaje: "Uno de los días ya tiene un horario asignado para este practicante. No se guardaron los cambios."
            });
        }

        console.error("Error al registrar horario semanal:", error.message);

        return res.status(500).json({
            success: false,
            mensaje: "Error al registrar el horario semanal."
        });

    } finally {
        if (conexion) {
            conexion.release();
        }
    }
}

export async function actualizarHorariosSemana(req, res) {
    let conexion;

    try {
        const practicanteId = req.params.practicanteId;
        const { horarios } = req.body;

        if (
            !/^[1-9]\d*$/.test(String(practicanteId ?? "")) ||
            !Array.isArray(horarios) ||
            horarios.length === 0 ||
            horarios.length > 7
        ) {
            return res.status(400).json({
                success: false,
                mensaje: "Selecciona un practicante y al menos un día."
            });
        }

        const diasValidos = [
            "Lunes",
            "Martes",
            "Miércoles",
            "Jueves",
            "Viernes",
            "Sábado",
            "Domingo"
        ];

        const formatoHora =
            /^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/;

        const diasRecibidos = new Set();

        for (const horario of horarios) {
            const {
                dia_semana,
                hora_entrada,
                hora_salida
            } = horario ?? {};

            if (!diasValidos.includes(dia_semana)) {
                return res.status(400).json({
                    success: false,
                    mensaje: "Uno de los días seleccionados no es válido."
                });
            }

            if (diasRecibidos.has(dia_semana)) {
                return res.status(400).json({
                    success: false,
                    mensaje: `El día ${dia_semana} está repetido.`
                });
            }

            diasRecibidos.add(dia_semana);

            if (
                typeof hora_entrada !== "string" ||
                typeof hora_salida !== "string" ||
                !formatoHora.test(hora_entrada) ||
                !formatoHora.test(hora_salida) ||
                hora_entrada >= hora_salida
            ) {
                return res.status(400).json({
                    success: false,
                    mensaje: `Revisa las horas del ${dia_semana}.`
                });
            }
        }

        conexion = await pool.getConnection();
        await conexion.beginTransaction();

        const [practicantes] = await conexion.query(
            `SELECT id
             FROM practicantes
             WHERE id = ? AND estado = 'Activo'
             FOR UPDATE`,
            [Number(practicanteId)]
        );

        if (practicantes.length === 0) {
            await conexion.rollback();

            return res.status(400).json({
                success: false,
                mensaje: "El practicante no existe o está inactivo."
            });
        }

        const dias = [...diasRecibidos];
        const marcadores = dias.map(() => "?").join(", ");

        await conexion.query(
            `DELETE FROM horarios
             WHERE practicante_id = ?
             AND dia_semana NOT IN (${marcadores})`,
            [Number(practicanteId), ...dias]
        );

        for (const horario of horarios) {
            await conexion.query(
                `
                INSERT INTO horarios
                    (practicante_id, dia_semana, hora_entrada, hora_salida)
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    hora_entrada = VALUES(hora_entrada),
                    hora_salida = VALUES(hora_salida)
                `,
                [
                    Number(practicanteId),
                    horario.dia_semana,
                    horario.hora_entrada,
                    horario.hora_salida
                ]
            );
        }

        await conexion.commit();

        return res.json({
            success: true,
            mensaje: "Horario semanal actualizado correctamente."
        });

    } catch (error) {
        if (conexion) {
            await conexion.rollback();
        }

        console.error(
            "Error al actualizar horario semanal:",
            error.message
        );

        return res.status(500).json({
            success: false,
            mensaje: "No se pudo actualizar el horario semanal."
        });

    } finally {
        if (conexion) {
            conexion.release();
        }
    }
}


export async function eliminarHorariosPracticante(req, res) {
    let conexion;

    try {
        const practicanteId = req.params.practicanteId;

        if (!/^[1-9]\d*$/.test(String(practicanteId ?? ""))) {
            return res.status(400).json({
                success: false,
                mensaje: "El ID del practicante no es válido."
            });
        }

        conexion = await pool.getConnection();
        await conexion.beginTransaction();

        const [practicantes] = await conexion.query(
            `SELECT id
             FROM practicantes
             WHERE id = ?
             FOR UPDATE`,
            [Number(practicanteId)]
        );

        if (practicantes.length === 0) {
            await conexion.rollback();

            return res.status(404).json({
                success: false,
                mensaje: "El practicante no existe."
            });
        }

        const [resultado] = await conexion.query(
            `DELETE FROM horarios
             WHERE practicante_id = ?`,
            [Number(practicanteId)]
        );

        await conexion.commit();

        return res.json({
            success: true,
            mensaje: resultado.affectedRows > 0
                ? "Horarios eliminados correctamente."
                : "El practicante no tenía horarios asignados.",
            eliminados: resultado.affectedRows
        });

    } catch (error) {
        if (conexion) {
            await conexion.rollback();
        }

        console.error(
            "Error al eliminar horarios:",
            error.message
        );

        return res.status(500).json({
            success: false,
            mensaje: "No se pudieron eliminar los horarios."
        });

    } finally {
        if (conexion) {
            conexion.release();
        }
    }
}
