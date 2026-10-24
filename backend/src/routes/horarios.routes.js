import express from "express";

import {
    obtenerHorarios,
    registrarHorario
} from "../controllers/horarios.controller.js";

const router = express.Router();

router.get("/", obtenerHorarios);
router.post("/", registrarHorario);

export default router;
