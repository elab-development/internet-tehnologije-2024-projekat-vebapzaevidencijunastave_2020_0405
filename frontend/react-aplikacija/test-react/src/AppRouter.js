
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from './components/Navbar';
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import RasporedPage from "./pages/RasporedPage";
import EvidencijaPage from "./pages/EvidencijaPage";
import ProfilPage from "./pages/ProfilPage";
import AdminPage from "./pages/AdminPage";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/raspored" element={<PrivateRoute><RasporedPage /></PrivateRoute>} />
        <Route path="/evidencija" element={<PrivateRoute><EvidencijaPage /></PrivateRoute>} />
        <Route path="/profil" element={<PrivateRoute><ProfilPage /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><AdminPage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;




