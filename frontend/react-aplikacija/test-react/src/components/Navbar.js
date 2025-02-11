import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null; // Sakrij navbar ako korisnik nije prijavljen

  return (
    <nav>
      <ul>
        <li><NavLink to="/">Početna</NavLink></li>
        <li><NavLink to="/raspored">Raspored</NavLink></li>
        {user.role === "student" && <li><NavLink to="/evidencija">Evidencija</NavLink></li>}
        <li><NavLink to="/profil">Profil</NavLink></li>
        {user.role === "admin" && <li><NavLink to="/admin">Admin</NavLink></li>}
      </ul>
    </nav>
  );
};

export default Navbar;
