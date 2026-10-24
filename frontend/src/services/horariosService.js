const API_URL = "http://localhost:8080/api/horarios";

export async function obtenerHorarios() {
    const respuesta = await fetch(API_URL);
    const data = await respuesta.json();

    if (!respuesta.ok || !data.success) {
        throw new Error(
            data.mensaje || "Error al obtener horarios."
        );
    }

    return data.horarios;
}

export async function registrarHorario(horario) {
    const respuesta = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(horario)
    });

    const data = await respuesta.json();

    if (!respuesta.ok || !data.success) {
        throw new Error(
            data.mensaje || "Error al registrar el horario."
        );
    }

    return data;
}

export async function registrarHorariosSemana(datos) {
    const respuesta = await fetch(`${API_URL}/semana`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    const data = await respuesta.json();

    if (!respuesta.ok || !data.success) {
        throw new Error(
            data.mensaje || "Error al registrar el horario semanal."
        );
    }

    return data;
}

export async function actualizarHorariosSemana(practicanteId, datos) {
    const respuesta = await fetch(
        `${API_URL}/semana/${practicanteId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        }
    );

    const data = await respuesta.json();

    if (!respuesta.ok || !data.success) {
        throw new Error(
            data.mensaje || "Error al actualizar el horario semanal."
        );
    }

    return data;
}
