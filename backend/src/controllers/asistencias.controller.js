
import pool from "../config/database.js";

export const obtenerAsistencias = async (req, res) => {
    try {
        const [asistencias] = await pool.query(`
            SELECT
                a.id,
                a.id_practicante,
                p.nombre,
                p.apellido,
                a.fecha_hora_mensaje,
                a.tipo,
                a.mensaje_original,

                CASE
                    WHEN h.id IS NULL THEN 'Pendiente'

                    WHEN a.tipo = 'entrada' THEN
                        CASE
                            WHEN TIME(a.fecha_hora_mensaje)
                                <= ADDTIME(h.hora_entrada, '00:05:00')
                            THEN 'Puntual'
                            ELSE 'Tardanza'
                        END

                    WHEN a.tipo = 'salida' THEN
                        CASE
                            WHEN TIME(a.fecha_hora_mensaje) < h.hora_salida
                            THEN 'Anticipada'
                            ELSE 'Normal'
                        END

                    ELSE 'Pendiente'
                END AS estado

            FROM asistencias a

            INNER JOIN practicantes p
                ON a.id_practicante = p.id

            LEFT JOIN horarios h
            ON h.practicante_id = a.id_practicante
                AND LOWER(
                    REPLACE(
                        REPLACE(
                            REPLACE(
                                REPLACE(TRIM(h.dia_semana), 'á', 'a'),
                                'é', 'e'
                            ),
                            'í', 'i'
                        ),
                        'ó', 'o'
                    )
                ) = CASE DAYOFWEEK(a.fecha_hora_mensaje)
                    WHEN 1 THEN 'domingo'
                    WHEN 2 THEN 'lunes'
                    WHEN 3 THEN 'martes'
                    WHEN 4 THEN 'miercoles'
                    WHEN 5 THEN 'jueves'
                    WHEN 6 THEN 'viernes'
                    WHEN 7 THEN 'sabado'
                END

            ORDER BY a.fecha_hora_mensaje DESC
        `);

        res.json(asistencias);
    }catch (error) {
    console.error("Error al consultar asistencias:", error);

    res.status(500).json({
        mensaje: "Error al obtener el historial de asistencias",
        detalle: error.message,
        codigo: error.code
    });
}
};
 