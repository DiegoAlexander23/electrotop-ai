import "dotenv/config";
import app from "./app.js";
import pool from "./config/database.js";

try {
    const connection = await pool.getConnection();

    console.log("se conecto a MySQL correctamente");
    connection.release();

    app.listen(8080, () => {
        console.log("servidor corriendo en el puerto 8080");
    });

} catch (error) {
    console.error("Error al conectar con MySQL:", error.message);
}