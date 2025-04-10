import axios from "axios";

const httpClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add authentication token if available
httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("userTokenLexMedica");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default httpClient;
