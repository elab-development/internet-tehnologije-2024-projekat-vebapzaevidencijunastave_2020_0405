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
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    oldPassword: "",
    newPassword: ""
  });
  const [editError, setEditError] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;

      try {
        const token = localStorage.getItem('auth_token');
        const endpoint = `/api/${user.role}/profile`;
        const response = await axios.get(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError("");

    try {
      const token = localStorage.getItem('auth_token');
      const endpoint = user.role === "profesor" ? '/api/profesor/profile/update' : '/api/student/profile/update';
      const response = await axios.post(endpoint, {
        old_password: editForm.oldPassword,
        new_password: editForm.newPassword
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setShowEditModal(false);
      setEditForm({
        oldPassword: "",
        newPassword: ""
      });
      alert("Lozinka je uspešno izmenjena!");
    } catch (err) {
      setEditError(err.response?.data?.message || 'Došlo je do greške pri izmeni lozinke.');
    }
  };

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
            {(user?.role === "student" || user?.role === "profesor") && (
              <button className="edit-button" onClick={() => setShowEditModal(true)}>
                Izmeni profil
              </button>
            )}
            <button className="logout-button" onClick={logout}>Odjavi se</button>
          </div>
        </div>
      </div>

      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowEditModal(false)}>&times;</span>
            <h2>Izmena lozinke</h2>
            {editError && <div className="error-message">{editError}</div>}
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Trenutna lozinka:</label>
                <input
                  type="password"
                  value={editForm.oldPassword}
                  onChange={(e) => setEditForm(prev => ({ ...prev, oldPassword: e.target.value }))}
                  placeholder="Unesite trenutnu lozinku"
                />
              </div>
              <div className="form-group">
                <label>Nova lozinka:</label>
                <input
                  type="password"
                  value={editForm.newPassword}
                  onChange={(e) => setEditForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Unesite novu lozinku"
                />
              </div>
              <div className="form-buttons">
                <button type="submit" className="save-button">Sačuvaj izmene</button>
                <button type="button" className="cancel-button" onClick={() => setShowEditModal(false)}>
                  Odustani
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilPage;
