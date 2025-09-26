import axios from "axios";

const API_BASE_URL =  "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token automatically to requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("waste2fertilizer_token");
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
