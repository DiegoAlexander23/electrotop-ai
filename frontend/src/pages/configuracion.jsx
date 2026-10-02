import "./style/configuracion.css";

function Configuracion() {
    return (
        <div className="configuracion">

            <div className="configuracion-header">
                <h1>Configuración</h1>
                <p>Administra la información utilizada por el sistema y la IA.</p>
            </div>

            <div className="configuracion-grid">

                <section className="config-card">
                    <h2>Información de la empresa</h2><br />

                    <div className="form-group">
                        <label>Nombre de la empresa</label>
                        <input
                            type="text"
                            defaultValue="Electrotop Peru S.A.C."
                        />
                    </div>

                    <div className="form-group">
                        <label>Dirección</label>
                        <input
                            type="text"
                            defaultValue="Arequipa, Perú"
                        />
                    </div>

                    <div className="form-group">
                        <label>Horario de atención</label>
                        <input
                            type="text"
                            defaultValue="Lunes a sábado: 9:00 AM - 6:00 PM"
                        />
                    </div>

                    <div className="form-group">
                        <label>Teléfono / WhatsApp</label>
                        <input
                            type="text"
                            defaultValue=""
                            placeholder="Número de contacto"
                        />
                    </div>

                    <button className="btn-guardar">
                        Guardar cambios
                    </button>
                </section>


                <section className="config-card">
                    <h2>Configuración de la IA</h2>
                    <p className="descripcion">
                        Define el comportamiento general del asistente.
                    </p>

                    <div className="form-group">
                        <label>Nombre del asistente</label>
                        <input
                            type="text"
                            defaultValue="Asistente Electrotop"
                        />
                    </div>

                    <div className="form-group">
                        <label>Mensaje de bienvenida</label>
                        <textarea
                            defaultValue="¡Hola! Soy el asistente virtual de Electrotop. ¿En qué podemos ayudarte?"
                        />
                    </div>

                    <div className="form-group">
                        <label>Instrucciones del asistente</label>
                        <textarea
                            
                        />
                    </div>

                    <button className="btn-guardar">
                        Guardar cambios
                    </button>
                </section>

            </div>

        </div>
    );
}

export default Configuracion;