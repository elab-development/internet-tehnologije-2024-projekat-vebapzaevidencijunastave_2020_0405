import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from './components/Navbar';
import Breadcrumbs from './components/Breadcrumbs';
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import RasporedPage from "./pages/RasporedPage";
import EvidencijaPage from "./pages/EvidencijaPage";
import ProfilPage from "./pages/ProfilPage";
import AdminPage from "./pages/AdminPage";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("auth_token");
  const location = useLocation();
  const isHomePage = location.pathname === "/" || location.pathname === "/home";

  if (!token) {
    return <Navigate to="/login" />;
  }
  
  return (
    <>
      {!isHomePage && <Navbar />}
      {!isHomePage && <Breadcrumbs />}
      {children}
    </>
  );
};

const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return children;
};

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
      <Route path="/raspored" element={<PrivateRoute><RasporedPage /></PrivateRoute>} />
      <Route path="/evidencija" element={<PrivateRoute><EvidencijaPage /></PrivateRoute>} />
      <Route path="/profil" element={<PrivateRoute><ProfilPage /></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute><AdminRoute><AdminPage /></AdminRoute></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRouter;




