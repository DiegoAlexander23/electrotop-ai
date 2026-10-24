import express from 'express';
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import practicantesRoutes from "./routes/practicantes.routes.js";
import horariosRoutes from "./routes/horarios.routes.js";
import asistenciasRoutes from "./routes/asistencias.routes.js";

const app = express();

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/practicantes", practicantesRoutes);
app.use("/api/horarios", horariosRoutes);
app.use("/api/asistencias", asistenciasRoutes);

export default app;
