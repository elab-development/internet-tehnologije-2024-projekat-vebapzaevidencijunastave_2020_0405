import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../assets/profilna.webp";
import "./ProfilPage.css";

const ProfilPage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="profil-container">
      <h1>Moj Profil</h1>
      <div className="profil-card">
        <img src={user?.slika || defaultAvatar} alt="Profilna slika" className="profil-slika" />
        <div className="profil-info">
          <p><strong>Ime i prezime:</strong> {user?.ime} {user?.prezime}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          {user?.role === "student" ? (
            <>
              <p><strong>Broj indeksa:</strong> {user?.broj_indeksa}</p>
              <p><strong>Godina studija:</strong> {user?.godina_studija}</p>
              {user?.broj_telefona && <p><strong>Broj telefona:</strong> {user?.broj_telefona}</p>}
            </>
          ) : user?.role === "profesor" ? (
            <>
              <p><strong>Korisničko ime:</strong> {user?.korisnicko_ime}</p>
              <p><strong>Predmeti koje predaje:</strong> {user?.predmeti?.join(", ") || "Nema podataka"}</p>
              {user?.broj_telefona && <p><strong>Broj telefona:</strong> {user?.broj_telefona}</p>}
            </>
          ) : null}
          <div className="buttons">
            <button className="edit-button">Izmeni profil</button>
            <button className="logout-button" onClick={handleLogout}>Odjavi se</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilPage;
