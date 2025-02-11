import React from 'react';
import { NavLink } from 'react-router-dom';
import "./HomePage.css";
import pozadina from "../assets/pozadina.jpg";

const HomePage = () => {
  return (
    <div className="home-container">
      <div className="background-overlay" style={{ backgroundImage: `url(${pozadina})` }}></div>
      <div className="overlay-content">
        <h1>Dobrodošli!</h1>
        <p>Ovo je platforma za pregled rasporeda časova, evidenciju prisustva i upravljanje nastavnim procesom.</p>
        
        <div className="navigation-links">
          <NavLink to="/raspored" className="nav-button">Pogledaj raspored</NavLink>
          <NavLink to="/evidencija" className="nav-button">Evidencija prisustva</NavLink>
          <NavLink to="/profil" className="nav-button">Moj profil</NavLink>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

