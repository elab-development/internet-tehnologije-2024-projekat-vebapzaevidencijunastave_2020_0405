import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import './AdminManager.css';

const PredmetiManager = () => {
  const [predmeti, setPredmeti] = useState([]);
  const [profesori, setProfesori] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    naziv: '',
    semestar: '',
    godina_studija: '',
    profesor_id: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const config = {
        headers: { 'Authorization': `Bearer ${token}` }
      };

      const [predmetiRes, profesoriRes] = await Promise.all([
        axios.get('/api/predmeti', config),
        axios.get('/api/profesori', config)
      ]);

      setPredmeti(predmetiRes.data);
      setProfesori(profesoriRes.data);
      setLoading(false);
    } catch (err) {
      setError('Greška pri učitavanju podataka');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('auth_token');
      await axios.post('/api/predmeti', formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setFormData({
        naziv: '',
        semestar: '',
        godina_studija: '',
        profesor_id: ''
      });
      setShowForm(false);
      fetchData();
    } catch (err) {
      setError('Greška pri dodavanju predmeta');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovaj predmet? Ovo će obrisati i sve termine vezane za ovaj predmet.')) {
      try {
        const token = localStorage.getItem('auth_token');
        await axios.delete(`/api/predmeti/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchData();
      } catch (err) {
        setError('Greška pri brisanju predmeta');
      }
    }
  };

  const getProfesorInfo = (profesor_id) => {
    const profesor = profesori.find(p => p.id === profesor_id);
    return profesor ? `${profesor.ime} ${profesor.prezime}` : 'Nije dodeljen';
  };

  if (loading) return <div>Učitavanje...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-manager">
      <div className="manager-header">
        <h2>Upravljanje Predmetima</h2>
        <button 
          className="add-button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Otkaži' : 'Dodaj Predmet'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Naziv predmeta:</label>
            <input
              type="text"
              name="naziv"
              value={formData.naziv}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Semestar:</label>
            <select
              name="semestar"
              value={formData.semestar}
              onChange={handleInputChange}
              required
            >
              <option value="">Izaberite semestar</option>
              <option value="1">Prvi</option>
              <option value="2">Drugi</option>
              <option value="3">Treći</option>
              <option value="4">Četvrti</option>
              <option value="5">Peti</option>
              <option value="6">Šesti</option>
              <option value="7">Sedmi</option>
              <option value="8">Osmi</option>
            </select>
          </div>
          <div className="form-group">
            <label>Godina studija:</label>
            <select
              name="godina_studija"
              value={formData.godina_studija}
              onChange={handleInputChange}
              required
            >
              <option value="">Izaberite godinu</option>
              <option value="1">Prva godina</option>
              <option value="2">Druga godina</option>
              <option value="3">Treća godina</option>
              <option value="4">Četvrta godina</option>
            </select>
          </div>
          <div className="form-group">
            <label>Profesor:</label>
            <select
              name="profesor_id"
              value={formData.profesor_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Izaberite profesora</option>
              {profesori.map(profesor => (
                <option key={profesor.id} value={profesor.id}>
                  {profesor.ime} {profesor.prezime}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="submit-button">Sačuvaj</button>
        </form>
      )}

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Naziv predmeta</th>
              <th>Semestar</th>
              <th>Godina studija</th>
              <th>Profesor</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            {predmeti.map(predmet => (
              <tr key={predmet.id}>
                <td>{predmet.naziv}</td>
                <td>{predmet.semestar}. semestar</td>
                <td>{predmet.godina_studija}. godina</td>
                <td>{getProfesorInfo(predmet.profesor_id)}</td>
                <td>
                  <button 
                    className="delete-button"
                    onClick={() => handleDelete(predmet.id)}
                  >
                    Obriši
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PredmetiManager; 