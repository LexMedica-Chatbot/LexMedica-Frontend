import axios from "axios";

const httpClient = axios.create({
  baseURL: process.env.BACKEND_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add authentication token if available
httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("tokenLexMedica");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default httpClient;
