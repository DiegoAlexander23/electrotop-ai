const API_URL = "http://localhost:8080/api/horarios";

export async function obtenerHorarios() {
    const respuesta = await fetch(API_URL);
    const data = await respuesta.json();

    if (!respuesta.ok || !data.success) {
        throw new Error(data.mensaje || "Error al obtener horarios.");
    }

    return data.horarios;
}
