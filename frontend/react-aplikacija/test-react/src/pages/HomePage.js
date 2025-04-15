import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const renderAdminContent = () => (
    <div className="overlay-content">
      <h1>Admin Panel</h1>
      <h4>Dobrodošli u sistem za upravljanje nastavnim procesom.</h4>
      <p>{user?.ime} {user?.prezime}</p>
      <div className="navigation-links">
        <Link to="/studenti" className="nav-button">Upravljanje studentima</Link>
        <Link to="/profesori" className="nav-button">Upravljanje profesorima</Link>
        <Link to="/predmeti" className="nav-button">Upravljanje predmetima</Link>
        <Link to="/raspored" className="nav-button">Upravljanje rasporedom</Link>
      </div>
    </div>
  );

  const renderUserContent = () => (
    <div className="overlay-content">
      <h1>Dobrodošli!</h1>
      <h4>Ovo je platforma za pregled rasporeda časova, evidenciju prisustva i upravljanje nastavnim procesom.</h4>
      <p>{user?.ime} {user?.prezime}</p>
      <div className="navigation-links">
        <Link to="/raspored" className="nav-button">Pogledaj raspored</Link>
        <Link to="/evidencija" className="nav-button">Evidencija prisustva</Link>
        <Link to="/profil" className="nav-button">Moj profil</Link>
      </div>
    </div>
  );

  return (
    <div className="home-container">
      <div className="background-overlay"></div>
      {user?.role === 'admin' ? renderAdminContent() : renderUserContent()}
    </div>
  );
};

export default HomePage;

