import express from "express";

import {
    obtenerHorarios,
    registrarHorario,
    registrarHorariosSemana,
    actualizarHorariosSemana,
    eliminarHorariosPracticante
} from "../controllers/horarios.controller.js";

const router = express.Router();

router.get("/", obtenerHorarios);
router.post("/", registrarHorario);
router.post("/semana", registrarHorariosSemana);
router.put("/semana/:practicanteId", actualizarHorariosSemana);
router.delete("/semana/:practicanteId", eliminarHorariosPracticante);

export default router;
