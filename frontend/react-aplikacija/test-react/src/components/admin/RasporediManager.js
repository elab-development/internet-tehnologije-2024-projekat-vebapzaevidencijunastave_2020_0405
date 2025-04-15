import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import './AdminManager.css';

const TimeInput = ({ name, value, onChange, required }) => {
  return (
    <input
      type="time"
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      step="300"
      style={{width: "150px"}}
    />
  );
};

const RasporediManager = () => {
  const [rasporedi, setRasporedi] = useState([]);
  const [predmeti, setPredmeti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showAddPredmetForm, setShowAddPredmetForm] = useState(false);
  const [selectedRaspored, setSelectedRaspored] = useState(null);
  
  const [formData, setFormData] = useState({
    naziv: '',
    godina_studija: '',
    semestar: '',
    skolska_godina: '',
    aktivan: false
  });

  const [predmetFormData, setPredmetFormData] = useState({
    predmet_id: '',
    dan_u_nedelji: '',
    vreme_pocetka: '',
    vreme_zavrsetka: '',
    sala: '',
    tip_nastave: ''
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

      const [rasporediRes, predmetiRes] = await Promise.all([
        axios.get('/api/rasporedi', config),
        axios.get('/api/predmeti', config)
      ]);

      setRasporedi(rasporediRes.data);
      setPredmeti(predmetiRes.data);
      setLoading(false);
    } catch (err) {
      setError('Greška pri učitavanju podataka');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handlePredmetInputChange = (e) => {
    setPredmetFormData({
      ...predmetFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('auth_token');
      await axios.post('/api/rasporedi', formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setFormData({
        naziv: '',
        godina_studija: '',
        semestar: '',
        skolska_godina: '',
        aktivan: false
      });
      setShowForm(false);
      fetchData();
    } catch (err) {
      setError('Greška pri dodavanju rasporeda');
    }
  };

  const handleAddPredmet = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('auth_token');
      await axios.post(`/api/rasporedi/${selectedRaspored.id}/predmeti`, predmetFormData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setPredmetFormData({
        predmet_id: '',
        dan_u_nedelji: '',
        vreme_pocetka: '',
        vreme_zavrsetka: '',
        sala: '',
        tip_nastave: ''
      });
      setShowAddPredmetForm(false);
      fetchData();
    } catch (err) {
      setError('Greška pri dodavanju predmeta u raspored');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovaj raspored?')) {
      try {
        const token = localStorage.getItem('auth_token');
        await axios.delete(`/api/rasporedi/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchData();
      } catch (err) {
        setError('Greška pri brisanju rasporeda');
      }
    }
  };

  const handleDeletePredmet = async (rasporedId, predmetId) => {
    if (window.confirm('Da li ste sigurni da želite da uklonite ovaj predmet iz rasporeda?')) {
      try {
        const token = localStorage.getItem('auth_token');
        await axios.delete(`/api/rasporedi/${rasporedId}/predmeti/${predmetId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchData();
      } catch (err) {
        setError('Greška pri uklanjanju predmeta iz rasporeda');
      }
    }
  };

  if (loading) return <div>Učitavanje...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-manager">
      <div className="manager-header">
        <h2>Upravljanje Rasporedima</h2>
        <button 
          className="add-button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Otkaži' : 'Dodaj Raspored'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Naziv rasporeda:</label>
            <input
              type="text"
              name="naziv"
              value={formData.naziv}
              onChange={handleInputChange}
              required
            />
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
            </select>
          </div>
          <div className="form-group">
            <label>Školska godina:</label>
            <input
              type="text"
              name="skolska_godina"
              value={formData.skolska_godina}
              onChange={handleInputChange}
              placeholder="npr. 2024/2025"
              required
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="aktivan"
                checked={formData.aktivan}
                onChange={handleInputChange}
              />
              Aktivan raspored
            </label>
          </div>
          <button type="submit" className="submit-button">Sačuvaj</button>
        </form>
      )}

      {showAddPredmetForm && selectedRaspored && (
        <div className="overlay">
          <div className="modal">
            <h3>Dodaj predmet u raspored: {selectedRaspored.naziv}</h3>
            <form onSubmit={handleAddPredmet} className="admin-form">
              <div className="form-group">
                <label>Predmet:</label>
                <select
                  name="predmet_id"
                  value={predmetFormData.predmet_id}
                  onChange={handlePredmetInputChange}
                  required
                >
                  <option value="">Izaberite predmet</option>
                  {predmeti
                    .filter(p => p.godina_studija === selectedRaspored.godina_studija)
                    .map(predmet => (
                      <option key={predmet.id} value={predmet.id}>
                        {predmet.naziv}
                      </option>
                    ))}
                </select>
              </div>
              <div className="form-group">
                <label>Dan u nedelji:</label>
                <select
                  name="dan_u_nedelji"
                  value={predmetFormData.dan_u_nedelji}
                  onChange={handlePredmetInputChange}
                  required
                >
                  <option value="">Izaberite dan</option>
                  <option value="Ponedeljak">Ponedeljak</option>
                  <option value="Utorak">Utorak</option>
                  <option value="Sreda">Sreda</option>
                  <option value="Četvrtak">Četvrtak</option>
                  <option value="Petak">Petak</option>
                </select>
              </div>
              <div className="form-group">
                <label>Vreme početka:</label>
                <TimeInput
                  name="vreme_pocetka"
                  value={predmetFormData.vreme_pocetka}
                  onChange={handlePredmetInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Vreme završetka:</label>
                <TimeInput
                  name="vreme_zavrsetka"
                  value={predmetFormData.vreme_zavrsetka}
                  onChange={handlePredmetInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Sala:</label>
                <input
                  type="text"
                  name="sala"
                  value={predmetFormData.sala}
                  onChange={handlePredmetInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Tip nastave:</label>
                <select
                  name="tip_nastave"
                  value={predmetFormData.tip_nastave}
                  onChange={handlePredmetInputChange}
                  required
                >
                  <option value="">Izaberite tip nastave</option>
                  <option value="Predavanje">Predavanje</option>
                  <option value="Vezbe">Vezbe</option>
                </select>
              </div>
              <div className="button-group">
                <button type="submit" className="submit-button">Dodaj</button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => {
                    setShowAddPredmetForm(false);
                    setSelectedRaspored(null);
                  }}
                >
                  Otkaži
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-container">
        {rasporedi.map(raspored => (
          <div key={raspored.id} className="raspored-card">
            <div className="raspored-header">
              <h3>{raspored.naziv}</h3>
              <div className="raspored-actions">
                <button
                  className="add-button"
                  onClick={() => {
                    setSelectedRaspored(raspored);
                    setShowAddPredmetForm(true);
                  }}
                >
                  Dodaj predmet
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(raspored.id)}
                >
                  Obriši raspored
                </button>
              </div>
            </div>
            <div className="raspored-info">
              <p>Godina studija: {raspored.godina_studija}. godina</p>
              <p>Semestar: {raspored.semestar}. semestar</p>
              <p>Školska godina: {raspored.skolska_godina}</p>
              <p>Status: {raspored.aktivan ? 'Aktivan' : 'Neaktivan'}</p>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Predmet</th>
                  <th>Dan</th>
                  <th>Vreme</th>
                  <th>Sala</th>
                  <th>Tip nastave</th>
                  <th>Akcije</th>
                </tr>
              </thead>
              <tbody>
                {raspored.predmeti?.map(predmet => (
                  <tr key={`${raspored.id}-${predmet.id}`}>
                    <td>{predmet.naziv}</td>
                    <td>{predmet.pivot.dan_u_nedelji}</td>
                    <td>{predmet.pivot.vreme_pocetka} - {predmet.pivot.vreme_zavrsetka}</td>
                    <td>{predmet.pivot.sala}</td>
                    <td>{predmet.pivot.tip_nastave}</td>
                    <td>
                      <button
                        className="delete-button"
                        onClick={() => handleDeletePredmet(raspored.id, predmet.id)}
                      >
                        Ukloni
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RasporediManager; 