import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import RasporedPage from "./pages/RasporedPage";
import AdminPage from "./pages/AdminPage";
import ProfilPage from "./pages/ProfilPage";
import EvidencijaPage from "./pages/EvidencijaPage";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/raspored" element={<RasporedPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/profil" element={<ProfilPage />} />
        <Route path="/evidencija" element={<EvidencijaPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;

