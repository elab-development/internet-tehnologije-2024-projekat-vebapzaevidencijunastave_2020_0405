import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../assets/profilna.webp";
import "./ProfilPage.css";
import axios from "../api/axios";

const ProfilPage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;

      try {
        const endpoint = `/api/${user.role}/profile`; // endpoint za profil
        const response = await axios.get(endpoint);
        setProfileData(response.data);
        setError(null);
      } catch (err) {
        console.error('Greška pri dobavljanju podataka:', err);
        setError('Došlo je do greške pri učitavanju podataka profila.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  if (!user) {
    navigate("/login");
    return null;
  }

  if (loading) {
    return (
      <div className="profil-container">
        <div className="loading">Učitavanje...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profil-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  // Helper funkcija za formatiranje predmeta
  const formatPredmete = (predmeti) => {
    if (!predmeti || predmeti.length === 0) return "Nema podataka";
    return predmeti.map(predmet => predmet.naziv).join(", ");
  };

  return (
    <div className="profil-container">
      <h1>Moj Profil</h1>
      <div className="profil-card">
        <img src={profileData?.slika || defaultAvatar} alt="Profilna slika" className="profil-slika" />
        <div className="profil-info">
          <p><strong>Ime i prezime:</strong> {profileData?.ime} {profileData?.prezime}</p>
          <p><strong>Email:</strong> {profileData?.email}</p>
          {user?.role === "student" ? (
            <>
              <p><strong>Broj indeksa:</strong> {profileData?.broj_indeksa}</p>
              <p><strong>Godina studija:</strong> {profileData?.godina_studija}</p>
              {profileData?.broj_telefona && (
                <p><strong>Broj telefona:</strong> {profileData?.broj_telefona}</p>
              )}
            </>
          ) : user?.role === "profesor" ? (
            <>
              <p><strong>Korisničko ime:</strong> {profileData?.korisnicko_ime}</p>
              <p><strong>Predmeti koje predaje:</strong> {formatPredmete(profileData?.predmeti)}</p>
              {profileData?.broj_telefona && (
                <p><strong>Broj telefona:</strong> {profileData?.broj_telefona}</p>
              )}
            </>
          ) : null}
          <div className="buttons">
            <button className="edit-button">Izmeni profil</button>
            <button className="logout-button" onClick={logout}>Odjavi se</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilPage;
