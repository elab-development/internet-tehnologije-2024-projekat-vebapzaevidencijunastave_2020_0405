import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import './AdminManager.css';

const StudentiManager = () => {
  const [studenti, setStudenti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    ime: '',
    prezime: '',
    broj_indeksa: '',
    email: '',
    godina_studija: '',
    lozinka: ''
  });

  useEffect(() => {
    fetchStudenti();
  }, []);

  const fetchStudenti = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get('/api/studenti', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setStudenti(response.data);
      setLoading(false);
    } catch (err) {
      setError('Greška pri učitavanju studenata');
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
      await axios.post('/api/studenti', formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setFormData({
        ime: '',
        prezime: '',
        broj_indeksa: '',
        email: '',
        godina_studija: '',
        lozinka: ''
      });
      setShowForm(false);
      fetchStudenti();
    } catch (err) {
      setError('Greška pri dodavanju studenta');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovog studenta?')) {
      try {
        const token = localStorage.getItem('auth_token');
        await axios.delete(`/api/studenti/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchStudenti();
      } catch (err) {
        setError('Greška pri brisanju studenta');
      }
    }
  };

  if (loading) return <div>Učitavanje...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-manager">
      <div className="manager-header">
        <h2>Upravljanje Studentima</h2>
        <button 
          className="add-button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Otkaži' : 'Dodaj Studenta'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Ime:</label>
            <input
              type="text"
              name="ime"
              value={formData.ime}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Prezime:</label>
            <input
              type="text"
              name="prezime"
              value={formData.prezime}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Broj Indeksa:</label>
            <input
              type="text"
              name="broj_indeksa"
              value={formData.broj_indeksa}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Godina Studija:</label>
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
            <label>Lozinka:</label>
            <input
              type="password"
              name="lozinka"
              value={formData.lozinka}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="submit-button">Sačuvaj</button>
        </form>
      )}

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ime</th>
              <th>Prezime</th>
              <th>Broj Indeksa</th>
              <th>Email</th>
              <th>Godina</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            {studenti.map(student => (
              <tr key={student.id}>
                <td>{student.ime}</td>
                <td>{student.prezime}</td>
                <td>{student.broj_indeksa}</td>
                <td>{student.email}</td>
                <td>{student.godina_studija}</td>
                <td>
                  <button 
                    className="delete-button"
                    onClick={() => handleDelete(student.id)}
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

export default StudentiManager; 