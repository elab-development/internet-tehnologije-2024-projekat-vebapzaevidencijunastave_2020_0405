import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const role = localStorage.getItem("role");

    if (token && role) {
      setUser({ token, role });
    }
  }, []);

  const login = (token, role) => {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("role", role);
    setUser({ token, role });
    
    // Preusmeravanje na osnovu uloge
    if (role === "admin") {
      navigate("/"); // Admin ide prena početnu stranicu
    } else if (role === "profesor") {
      navigate("/profesor");
    } else {
      navigate("/"); // za studente
    }
  };

  const logout = async () => {
    try {
      // Pozivamo logout endpoint na backend-u
      await axios.post('/api/logout');
    } catch (error) {
      console.error('Greška prilikom logout-a:', error);
    }
    
    // Čistimo lokalno stanje
    localStorage.removeItem("auth_token");
    localStorage.removeItem("role");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

