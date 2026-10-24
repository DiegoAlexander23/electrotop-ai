
const API_URL = "http://localhost:8080/api/asistencias";

export const obtenerAsistencias = async () => {
    const respuesta = await fetch(API_URL);

    if (!respuesta.ok) {
        throw new Error("Error al obtener las asistencias");
    }

    return await respuesta.json();
};
