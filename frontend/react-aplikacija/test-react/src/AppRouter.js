import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from './components/Navbar';
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import RasporedPage from "./pages/RasporedPage";
import EvidencijaPage from "./pages/EvidencijaPage";
import ProfilPage from "./pages/ProfilPage";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("auth_token");
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  if (!token) {
    return <Navigate to="/login" />;
  }
  
  return (
    <>
      {!isHomePage && <Navbar />}
      {children}
    </>
  );
};

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
      <Route path="/raspored" element={<PrivateRoute><RasporedPage /></PrivateRoute>} />
      <Route path="/evidencija" element={<PrivateRoute><EvidencijaPage /></PrivateRoute>} />
      <Route path="/profil" element={<PrivateRoute><ProfilPage /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRouter;




