import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-box">
        <h1>Bienvenido</h1>
        <p>Selecciona tu rol para continuar</p>
        <div className="button-group">
          <button className="btn" onClick={() => navigate("/instructor")}>
            Soy Instructor
          </button>
          <button className="btn-2" onClick={() => navigate("/usuario")}>
            Soy Usuario
          </button>
          <button className="btn" onClick={() => navigate("/videos")}>
            Videos
          </button>
        </div>
      </div>
    </div>
  );
}
