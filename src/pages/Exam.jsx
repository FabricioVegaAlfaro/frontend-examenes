import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Exam.css";

export default function Exam() {
  const navigate = useNavigate();
  const [pregunta, setPregunta] = useState(null);
  const [intentoId, setIntentoId] = useState(null);
  const [tiempoRestante, setTiempoRestante] = useState(20 * 60); // 20 min en segundos
  const [resultado, setResultado] = useState(null);

  // 🔹 Cargar datos guardados al iniciar
  useEffect(() => {
    const intento = localStorage.getItem("intento_id");
    const preg = localStorage.getItem("pregunta_actual");

    if (!intento || !preg) {
      navigate("/usuario");
      return;
    }

    setIntentoId(intento);
    setPregunta(JSON.parse(preg));

    // temporizador
    const interval = setInterval(() => {
      setTiempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          finalizarExamen();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  // 🔹 Responder una pregunta
  const responder = async (opcionId) => {
    try {
      const res = await API.post("/examen/responder", {
        intento_id: intentoId,
        pregunta_intento_id: pregunta.pregunta_intento_id,
        opcion_id: opcionId,
      });

      if (res.data.error) {
        alert(res.data.error);
        return;
      }

      if (res.data.finalizado) {
        setResultado(res.data);
        localStorage.removeItem("intento_id");
        localStorage.removeItem("pregunta_actual");
      } else {
        setPregunta(res.data.pregunta);
        localStorage.setItem("pregunta_actual", JSON.stringify(res.data.pregunta));
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión. Intenta nuevamente.");
    }
  };

  // 🔹 Finalizar por tiempo o al terminar preguntas
  const finalizarExamen = async () => {
    try {
      const res = await API.post("/examen/finalizar", { intento_id: intentoId });
      setResultado(res.data);
      localStorage.removeItem("intento_id");
      localStorage.removeItem("pregunta_actual");
    } catch (err) {
      console.error(err);
    }
  };

  if (resultado) {
    return (
      <div className="exam-box">
        <h2>Resultado Final</h2>
        <p>Nota: {resultado.nota}</p>
        <p>{resultado.aprobado ? "✅ Aprobado" : "❌ Reprobado"}</p>
        <button className="btn" onClick={() => navigate("/")}>
          Volver al inicio
        </button>
      </div>
    );
  }

  if (!pregunta) return <p>Cargando examen...</p>;

  return (
    <div className="exam-box">
      <h2>Pregunta {pregunta.posicion}</h2>
      <p className="enunciado">{pregunta.enunciado}</p>
      <ul className="options-list">
        {pregunta.opciones.map((op) => (
          <li key={op.id}>
            <button className="btn" onClick={() => responder(op.id)}>
              {op.texto}
            </button>
          </li>
        ))}
      </ul>
      <p className="timer">
        Tiempo restante:{" "}
        {Math.floor(tiempoRestante / 60)}:{String(tiempoRestante % 60).padStart(2, "0")}
      </p>
    </div>
  );
}
