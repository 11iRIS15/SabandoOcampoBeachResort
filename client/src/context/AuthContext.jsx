import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("resortUser")) || null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  async function login(email, password) {
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user: loggedInUser } = response.data;

      localStorage.setItem("resortToken", token);
      localStorage.setItem("resortUser", JSON.stringify(loggedInUser));

      setUser(loggedInUser);

      return loggedInUser;
    } finally {
      setLoading(false);
    }
  }

  async function register(userData) {
    setLoading(true);

    try {
      const response = await api.post("/auth/register", userData);

      const { token, user: registeredUser } = response.data;

      if (token) {
        localStorage.setItem("resortToken", token);
        localStorage.setItem("resortUser", JSON.stringify(registeredUser));
        setUser(registeredUser);
      }

      return response.data;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("resortToken");
    localStorage.removeItem("resortUser");
    setUser(null);
  }

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}