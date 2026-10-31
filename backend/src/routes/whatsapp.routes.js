import express from "express";
import pool from "../config/database.js";
import { execFile } from "child_process";
import { promisify } from "util";

const ejecutarArchivo = promisify(execFile);

async function clasificarMensaje(texto) {
    const rutaPython = "./src/python/venv/Scripts/python.exe";
    const rutaScript = "./src/python/predecir_mensaje.py";

    const { stdout } = await ejecutarArchivo(
        rutaPython,
        [rutaScript, texto]
    );

    const resultado = JSON.parse(stdout);

    return resultado.categoria;
}

async function registrarAsistencia(practicante, mensaje, categoria) {
    const fecha = new Date(
        Number(mensaje.timestamp) * 1000 - 5 * 60 * 60 * 1000
    );

    const fechaHora = fecha.toISOString().slice(0, 19).replace("T", " ");

    await pool.query(
        `INSERT INTO asistencias
        (id_practicante, fecha_hora_mensaje, tipo, mensaje_original, id_mensaje_whatsapp)
        VALUES (?, ?, ?, ?, ?)`,
        [
            practicante.id,
            fechaHora,
            categoria,
            mensaje.text.body,
            mensaje.id
        ]
    );
}

const router = express.Router();

function normalizarTelefono(telefono) {
    const digitos = telefono.replace(/\D/g, "");

    if (digitos.startsWith("51") && digitos.length === 11) {
        return digitos.slice(2);
    }

    return digitos;
}

router.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
        console.log("Webhook de WhatsApp verificado");
        return res.status(200).send(challenge);
    }

    return res.sendStatus(403);
});

router.post("/webhook", async (req, res) => {
    try {
        const entry = req.body.entry?.[0];
        const change = entry?.changes?.[0];
        const value = change?.value;

        const mensaje = value?.messages?.[0];

        if (!mensaje) {
            console.log("Notificación recibida, pero no contiene mensajes.");
            return res.sendStatus(200);
        }

        const texto = mensaje.text?.body;

        if (typeof texto !== "string" || !texto.trim()) {
            console.log("El mensaje recibido no es de texto.");
            return res.sendStatus(200);
        }

        const telefono = mensaje.from;
        const telefonoNacional = normalizarTelefono(telefono);

        const [practicantes] = await pool.query(
            `SELECT id, nombre, apellido, telefono
             FROM practicantes
             WHERE telefono = ?`,
            [telefonoNacional]
        );

        if (practicantes.length === 0) {
            console.log("No se encontró ningún practicante con ese teléfono.");
            return res.sendStatus(200);
        }

        const practicante = practicantes[0];

        const idMensaje = mensaje.id;
        const fechaHora = mensaje.timestamp;

        console.log("Practicante identificado:");
        console.log("ID:", practicante.id);
        console.log("Nombre:", practicante.nombre, practicante.apellido);

        console.log("Mensaje de WhatsApp recibido:");
        console.log("Texto:", texto);
        console.log("ID del mensaje:", idMensaje);
        console.log("Fecha:", fechaHora);

        const categoria = await clasificarMensaje(texto);

        console.log("Categoría detectada:", categoria);

        if (categoria === "otro") {
            console.log("El mensaje no corresponde a una marcación de asistencia.");

        } else if (categoria === "entrada" || categoria === "salida") {
            console.log("Marcación de asistencia identificada:", categoria);

            await registrarAsistencia(practicante, mensaje, categoria);

            console.log("Asistencia registrada correctamente en MySQL.");

        } else {
            console.log("El clasificador devolvió una categoría desconocida.");
        }

        return res.sendStatus(200);

    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            console.log("El mensaje ya fue registrado. Se ignora el duplicado.");
            return res.sendStatus(200);
        }

        console.error("Error al procesar el mensaje:", error);
        return res.sendStatus(500);
    }
});

export default router;