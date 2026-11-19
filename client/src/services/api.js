import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the logged-in user's token to API requests.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("resortToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired or invalid login sessions.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("resortToken");
      localStorage.removeItem("resortUser");
    }

    return Promise.reject(error);
  }
);

export default api;