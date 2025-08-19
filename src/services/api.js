import axios from "axios";

const API = axios.create({
  baseURL: "https://examenes-app-354o.onrender.com/api",
  withCredentials: false, // No necesitamos cookies en este caso
  headers: { "Content-Type": "application/json" },
});

// Interceptor para añadir el token en cada request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
