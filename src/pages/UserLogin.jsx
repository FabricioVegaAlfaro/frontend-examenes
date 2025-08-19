import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./UserLogin.css";

export default function UsuarioLogin() {
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [codigoToken, setCodigoToken] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!nombreCompleto || !codigoToken) {
      setError("Debes ingresar nombre completo y token");
      return;
    }
    try {
      const res = await API.post("/examen/iniciar", {
        nombre_completo: nombreCompleto,
        codigo_token: codigoToken,
      });
      localStorage.setItem("intento_id", res.data.intento_id);
      localStorage.setItem("pregunta_actual", JSON.stringify(res.data.pregunta));
      navigate("/examen");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Error iniciando examen");
    }
  };

  return (
    <div className="user-login-container">
      <h2>Ingreso de Usuario</h2>
      <form onSubmit={handleLogin}>
        {/* Nombre completo */}
        <div className="group">
          <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 
            7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 
            0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
          </svg>
          <input
            className="input-user"
            type="text"
            placeholder="Nombre completo tal y como aparece en la cédula"
            value={nombreCompleto}
            onChange={(e) => setNombreCompleto(e.target.value)}
          />
        </div>

        {/* Token */}
        <div className="group">
          <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17 3H7c-1.1 0-2 .9-2 2v14c0 
            1.1.9 2 2 2h10c1.1 0 2-.9 
            2-2V5c0-1.1-.9-2-2-2zm-5 
            16c-1.1 0-2-.9-2-2s.9-2 
            2-2 2 .9 2 2-.9 2-2 
            2zm3-8H9V7h6v4z"/>
          </svg>
          <input
            className="input-user"
            type="text"
            placeholder="Token del instructor"
            value={codigoToken}
            onChange={(e) => setCodigoToken(e.target.value)}
          />
        </div>

        {error && <p className="error">{error}</p>}

        {/* Botones */}
        <div className="button-group">
          <button type="submit" className="btn">Comenzar examen</button>
          <button type="button" className="btn-2" onClick={() => navigate("/")}>
            Volver
          </button>
        </div>
      </form>
    </div>
  );
}
