import express from "express";
import { obtenerAsistencias } from "../controllers/asistencias.controller.js";

const router = express.Router();

router.get("/", obtenerAsistencias);

export default router;