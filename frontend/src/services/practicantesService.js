
const API_URL = "http://localhost:8080/api/practicantes";

export async function obtenerPracticantes() {
    const respuesta = await fetch(API_URL);
    const data = await respuesta.json();

    if (!respuesta.ok || !data.success) {
        throw new Error(data.mensaje || "Error al obtener practicantes.");
    }

    return data.practicantes;
}

export async function registrarPracticante(practicante) {
    const respuesta = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(practicante)
    });

    const data = await respuesta.json();

    if (!respuesta.ok || !data.success) {
        throw new Error(data.mensaje || "Error al registrar practicante.");
    }

    return data;
}

export async function actualizarPracticante(id, practicante) {
    const respuesta = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(practicante)
    });

    const data = await respuesta.json();

    if (!respuesta.ok || !data.success) {
        throw new Error(data.mensaje || "Error al actualizar practicante.");
    }

    return data;
}

export async function cambiarEstadoPracticante(id, estado) {
    const respuesta = await fetch(`${API_URL}/${id}/estado`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ estado })
    });

    const data = await respuesta.json();

    if (!respuesta.ok || !data.success) {
        throw new Error(data.mensaje || "Error al cambiar el estado.");
    }

    return data;
}
