import "./style/inicio.css";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";

function Inicio() {
    return (
        <div className="inicio">

            <div className="inicio-header">
                <h1>Inicio</h1>
                <p>Resumen general del sistema</p>
            </div>

            <div className="estadisticas">

                <div className="tarjeta">
                    <h3>Conversaciones</h3>
                    <strong>125</strong>
                </div>

                <div className="tarjeta">
                    <h3>Solicitudes</h3>
                    <strong>32</strong>
                </div>

                <div className="tarjeta">
                    <h3>Productos</h3>
                    <strong>248</strong>
                </div>

                <div className="tarjeta">
                    <h3>Consultas IA</h3>
                    <strong>97</strong>
                </div>

            </div>
            <div className="graficos">

    <div className="grafico">
        <h2>Marcas más consultadas</h2>

        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
                { nombre: "Hikvision", consultas: 45 },
                { nombre: "Dahua", consultas: 32 },
                { nombre: "Axis", consultas: 27 },
                { nombre: "TP-Link ", consultas: 21 },
                { nombre: "Ezviz", consultas: 18 }
            ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="consultas" />
            </BarChart>
        </ResponsiveContainer>
    </div>

    <div className="grafico">
        <h2>Solicitudes por tipo</h2>

        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={[
                        { name: "Cotización", value: 15 },
                        { name: "Instalación", value: 8 },
                        { name: "Mantenimiento", value: 5 },
                        { name: "Evaluación", value: 3 },
                        { name: "Otros", value: 1 }
                    ]}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                >
                    <Cell />
                    <Cell />
                    <Cell />
                    <Cell />
                    <Cell />
                </Pie>

                <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    </div>

</div>

        </div>
    );
}

export default Inicio;