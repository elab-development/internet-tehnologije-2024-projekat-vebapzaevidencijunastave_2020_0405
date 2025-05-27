// // Navbar.js - Dodato logout dugme i prikaz godine studija
// import React, { useContext } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import "./Navbar.css";

// const Navbar = () => {
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();

//   if (!user) return null; // Sakrij navbar ako korisnik nije prijavljen

//   const handleLogout = () => {
//     logout();
//     setTimeout(() => navigate("/login"), 100); // Kratko kašnjenje da se izbegne bug
//   };

//   return (
//     <nav>
//       <ul>
//         <li><NavLink to="/">Početna</NavLink></li>
//         <li><NavLink to="/raspored">Raspored</NavLink></li>
//         {user?.role === "student" && <li><NavLink to="/evidencija">Evidencija</NavLink></li>}
//         <li><NavLink to="/profil">Profil</NavLink></li>
//         {user?.role === "admin" && <li><NavLink to="/admin">Admin</NavLink></li>}
//       </ul>
//       <div className="user-info">
//         <span>{user?.ime} {user?.prezime} ({user?.godina_studija}. godina)</span>
//         <button className="logout-button" onClick={handleLogout}>Odjavi se</button>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


import React, { useContext } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    setTimeout(() => navigate("/login"), 100);
  };

  const isProfilePage = location.pathname === "/profil";

  // Ako je korisnik admin, prikazujemo samo admin link
  if (user.role === 'admin') {
    return (
      <nav>
        <ul>
          <li><NavLink to="/admin">Admin Panel</NavLink></li>
        </ul>
        <div className="user-info">
          <span>{user.ime} {user.prezime}</span>
          {!isProfilePage && (
            <button className="logout-btn" onClick={handleLogout}>Odjavi se</button>
          )}
        </div>
      </nav>
    );
  }

  // Za studente i profesore prikazujemo standardnu navigaciju
  return (
    <nav>
      <ul>
        {/* <li><NavLink to="/">Početna</NavLink></li> */}
        <li><NavLink to="/raspored">Raspored</NavLink></li>
        {(user.role === "student" || user.role === "profesor") && <li><NavLink to="/evidencija">Evidencija</NavLink></li>}
        <li><NavLink to="/profil">Profil</NavLink></li>
      </ul>
      <div className="user-info">
        <span>{user.ime} {user.prezime} {user.godina_studija && `(${user.godina_studija}. godina)`}</span>
        {!isProfilePage && (
          <button className="logout-btn" onClick={handleLogout}>Odjavi se</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
