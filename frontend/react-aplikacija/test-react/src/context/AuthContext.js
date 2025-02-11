// import React, { createContext, useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   // useNavigate() mora biti unutar useEffect ili funkcija
//   const location = useLocation();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const role = localStorage.getItem("role");

//     if (token && role) {
//       setUser({ token, role });
//     }
//   }, []);

//   const login = (token, role) => {
//     localStorage.setItem("token", token);
//     localStorage.setItem("role", role);
//     setUser({ token, role });

//     // Navigacija se dešava samo ako postoji korisnik
//     if (role === "admin") {
//       navigate("/admin", { replace: true });
//     } else {
//       navigate("/", { replace: true });
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     setUser(null);
//     navigate("/login", { replace: true });
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      setUser({ token, role });
    }
  }, []);

  const login = (token, role, navigate) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    setUser({ token, role });

    if (role === "admin") {
      navigate("/admin", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  const logout = (navigate) => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
