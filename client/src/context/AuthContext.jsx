import {
  createContext,
  useContext,
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

  // CUSTOMER LOGIN
  async function login(email, password) {
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user: loggedInUser } = response.data;

      if (!token || !loggedInUser) {
        throw new Error("Invalid login response from server.");
      }

      localStorage.setItem("resortToken", token);
      localStorage.setItem("resortUser", JSON.stringify(loggedInUser));

      setUser(loggedInUser);

      return loggedInUser;
    } finally {
      setLoading(false);
    }
  }

  // CUSTOMER REGISTRATION
  async function register(userData) {
    setLoading(true);

    try {
      const response = await api.post("/auth/register", userData);

      const { token, user: registeredUser } = response.data;

      if (token && registeredUser) {
        localStorage.setItem("resortToken", token);
        localStorage.setItem("resortUser", JSON.stringify(registeredUser));

        setUser(registeredUser);
      }

      return response.data;
    } finally {
      setLoading(false);
    }
  }

  // CUSTOMER LOGOUT
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

// CUSTOM AUTHENTICATION HOOK
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}