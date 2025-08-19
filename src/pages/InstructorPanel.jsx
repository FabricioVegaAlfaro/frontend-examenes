import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./InstructorPanel.css";

export default function InstructorPanel() {
  const navigate = useNavigate();
  const [intentos, setIntentos] = useState([]);
  const [tokenGenerado, setTokenGenerado] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [copiado, setCopiado] = useState(false); // ✅ Estado para copiar
  const instructor = JSON.parse(localStorage.getItem("instructor"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/instructor");
      return;
    }
    cargarIntentos();
  }, [navigate]);

  const cargarIntentos = async (filtro = "") => {
    try {
      const res = await API.get(
        `/instructor/intentos${filtro ? `?search=${filtro}` : ""}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setIntentos(res.data);
    } catch (err) {
      console.error(err);
      setError("Error cargando intentos");
    }
  };

  const generarToken = async () => {
    try {
      const res = await API.post(
        "/instructor/tokens",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTokenGenerado(res.data);
    } catch (err) {
      console.error(err);
      setError("Error generando token");
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("instructor");
    navigate("/instructor");
  };

  // 🔍 Buscar en vivo mientras se escribe
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      cargarIntentos(search.trim());
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleCopiar = () => {
    navigator.clipboard.writeText(tokenGenerado.token);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000); // ✅ vuelve al texto normal después de 2s
  };

  return (
    <div className="panel-container">
      <h2>Bienvenido, {instructor?.nombre || "Instructor"}</h2>

      <div className="button-group">
        <a className="btn" onClick={generarToken}>
          Generar Token
        </a>
        <a className="btn" onClick={() => cargarIntentos()}>
          Refrescar
        </a>
        <a className="btn-logout" onClick={cerrarSesion}>
          Cerrar Sesión
        </a>
      </div>

      {tokenGenerado && (
        <div className="token-info">
          <p>
            <strong>Token:</strong> {tokenGenerado.token}
          </p>
          {tokenGenerado.vence && (
            <p>
              <strong>Vence:</strong>{" "}
              {new Date(tokenGenerado.vence).toLocaleString()}
            </p>
          )}

          <div className="centralize">
            {/* Botón copiar token */}
            <a className="btn-action btn-copy" onClick={handleCopiar}>
              <span>{copiado ? "Copiado ✔" : "Copiar Token"}</span>
            </a>

            {/* Botón compartir por WhatsApp */}
            {tokenGenerado.whatsappUrl && (
              <a
                href={tokenGenerado.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-action btn-share"
              >
                <span className="share-text">Compartir</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="currentColor"
                  className="icon-whatsapp"
                  viewBox="0 0 18 18"
                >
                  <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      )}

      {/* 🔍 Buscador en vivo */}
      <div className="search-form">
        {/* 🔎 Barra de búsqueda moderna */}
        <div className="group">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
            <g>
              <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
            </g>
          </svg>
          <input
            className="input"
            type="search"
            placeholder="Buscar Usuario..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <h3>Intentos de Usuarios</h3>
      {error && <p className="error">{error}</p>}

      {intentos.length === 0 ? (
        <p className="no-results">No se encontraron usuarios</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Nota</th>
              <th>Estado</th>
              <th>Token</th>
              <th>Inicio</th>
              <th>Fin</th>
            </tr>
          </thead>
          <tbody>
            {intentos.map((i) => (
              <tr key={i.id_intento}>
                <td>{i.nombre_usuario}</td>
                <td>{i.nota ?? "—"}</td>
                <td>
                  {i.estado === "en_progreso"
                    ? "⏳ En progreso"
                    : i.aprobado
                    ? "✅ Aprobado"
                    : "❌ Reprobado"}
                </td>
                <td>{i.codigo_token}</td>
                <td>
                  {i.fecha_inicio
                    ? new Date(i.fecha_inicio).toLocaleString()
                    : "—"}
                </td>
                <td>
                  {i.fecha_fin ? new Date(i.fecha_fin).toLocaleString() : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
