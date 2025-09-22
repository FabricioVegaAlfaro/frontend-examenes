import { useState } from "react";
import API from "../services/api";

export default function UploadVideo() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Selecciona un archivo de video");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);

    try {
      const res = await API.post("/videos/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("✅ Video subido correctamente");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error subiendo video");
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>📤 Subir Video</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px", margin: "0 auto" }}>
        <input type="text" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files[0])} required />
        <button type="submit">Subir</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
