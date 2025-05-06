import React, { useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  if (user?.role === 'admin') {
    return null;
  }

  // Za studente i profesore prikazujemo standardni sadržaj
  return (
    <div className="home-container">
      <div className="background-overlay"></div>
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
    </div>
  );
};

export default HomePage;

