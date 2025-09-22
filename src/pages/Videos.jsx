import { useEffect, useState } from "react";
import API from "../services/api";

export default function Videos() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await API.get("/videos");
        setVideos(res.data);
      } catch (err) {
        console.error("Error cargando videos", err);
      }
    };
    fetchVideos();
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>📹 Lista de Videos</h2>
      {videos.length === 0 ? (
        <p>No hay videos aún</p>
      ) : (
        <div style={{ display: "grid", gap: "20px", marginTop: "20px" }}>
          {videos.map((v) => (
            <div key={v.id} style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "8px" }}>
              <h3>{v.title}</h3>
              <p>{v.description}</p>
              <video width="400" controls>
                <source src={v.url} type={`video/${v.format}`} />
                Tu navegador no soporta video.
              </video>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
