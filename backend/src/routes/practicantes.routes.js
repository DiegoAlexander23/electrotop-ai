import express from "express";
import {
    obtenerPracticantes,
    registrarPracticante,
    actualizarPracticante,
    cambiarEstadoPracticante
} from "../controllers/practicantes.controller.js";

const router = express.Router();

router.get("/", obtenerPracticantes);
router.post("/", registrarPracticante);
router.put("/:id", actualizarPracticante);
router.patch("/:id/estado", cambiarEstadoPracticante);

export default router;
