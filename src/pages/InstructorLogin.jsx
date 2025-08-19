import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./InstructorLogin.css";

export default function InstructorLogin() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/instructor/login", { usuario, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("instructor", JSON.stringify(res.data.instructor));

      navigate("/panel-instructor");
    } catch (error) {
      alert("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="instructor-login-container">
      <h2>Login Instructor</h2>
      <form onSubmit={handleLogin}>
        {/* Usuario */}
        <div className="group">
          <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"></path>
          </svg>
          <input
            className="input-loginstructor"
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
        </div>

        {/* Contraseña */}
        <div className="group">
          <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 17a2 2 0 100-4 2 2 0 000 4zm6-6h-1V9a5 5 0 00-10 0v2H6c-1.1 0-2 .9-2 
            2v9c0 1.1.9 2 2 2h12c1.1 0 2-.9 
            2-2v-9c0-1.1-.9-2-2-2zm-3 
            0H9V9a3 3 0 016 0v2z"></path>
          </svg>
          <input
            className="input-loginstructor"
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* Botón ojo */}
          <svg
            className="icon-eye"
            viewBox="0 0 24 24"
            aria-hidden="true"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <path d="M12 4.5C7 4.5 2.73 7.61 1 
              12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 
              11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 
              12a4.5 4.5 0 110-9 4.5 4.5 
              0 010 9z" />
            ) : (
              <path d="M12 6a9.77 9.77 0 018.94 6A9.77 9.77 
              0 0112 18a9.77 9.77 0 01-8.94-6A9.77 
              9.77 0 0112 6zm0 10a4 4 0 100-8 4 4 
              0 000 8z" />
            )}
          </svg>
        </div>

        {/* Botones */}
        <div className="button-group">
          <button type="submit" className="btn">Entrar</button>
          <button type="button" className="btn-2" onClick={() => navigate("/")}>
            Volver
          </button>
        </div>
      </form>
    </div>
  );
}
