import { useState } from 'react'
import eletrotop from '../assets/logo.png'
import letra_logo from '../assets/letra_logo.png'
import './style/login.css'

function Login() {
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  async function login(e){
    e.preventDefault()
    const respuesta = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        clave: clave
      })
    })
    const data = await respuesta.json()
    console.log(data)
    if (respuesta.ok && data.success) {
        localStorage.setItem("sesion", "true");
        localStorage.setItem("usuario", JSON.stringify(data.usuario));  
        
        window.location.href = "/dashboard";
    } else {
        alert(data.mensaje || "Credenciales incorrectas");
    }
  }


  return (
    <div className="login-container">

      <div className="login-brand">
        <img src={eletrotop} alt="Logo" />
        <img src={letra_logo} alt="Eletrotop" />
      </div>

      <div className="login-box">
        <label className="welcome">Bienvenido</label>
        <label className="credentials">Ingrese sus credenciales:</label>

        <form onSubmit={login}>
          <label>Correo:</label>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />

          <label>Clave:</label>
          <input type="password" value={clave} onChange={(e) => setClave(e.target.value)} />

          <input type="submit" value="Ingresar" />
        </form>
      </div>

    </div>
  )
}

export default Login
