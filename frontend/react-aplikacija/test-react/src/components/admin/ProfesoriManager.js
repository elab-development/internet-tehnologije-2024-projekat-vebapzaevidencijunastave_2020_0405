import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import './AdminManager.css';

const ProfesoriManager = () => {
  const [profesori, setProfesori] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    ime: '',
    prezime: '',
    email: '',
    korisnicko_ime: '',
    lozinka: ''
  });

  useEffect(() => {
    fetchProfesori();
  }, []);

  const fetchProfesori = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get('/api/profesori', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setProfesori(response.data);
      setLoading(false);
    } catch (err) {
      setError('Greška pri učitavanju profesora');
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
      await axios.post('/api/profesori', formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setFormData({
        ime: '',
        prezime: '',
        email: '',
        korisnicko_ime: '',
        lozinka: ''
      });
      setShowForm(false);
      fetchProfesori();
    } catch (err) {
      setError('Greška pri dodavanju profesora');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovog profesora? Ovo će takođe obrisati sve njegove predmete i termine.')) {
      try {
        const token = localStorage.getItem('auth_token');
        await axios.delete(`/api/profesori/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchProfesori();
      } catch (err) {
        setError('Greška pri brisanju profesora');
      }
    }
  };

  if (loading) return <div>Učitavanje...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-manager">
      <div className="manager-header">
        <h2>Upravljanje Profesorima</h2>
        <button 
          className="add-button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Otkaži' : 'Dodaj Profesora'}
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
            <label>Korisničko ime:</label>
            <input
              type="text"
              name="korisnicko_ime"
              value={formData.korisnicko_ime}
              onChange={handleInputChange}
              required
            />
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
              <th>Email</th>
              <th>Korisničko ime</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            {profesori.map(profesor => (
              <tr key={profesor.id}>
                <td>{profesor.ime}</td>
                <td>{profesor.prezime}</td>
                <td>{profesor.email}</td>
                <td>{profesor.korisnicko_ime}</td>
                <td>
                  <button 
                    className="delete-button"
                    onClick={() => handleDelete(profesor.id)}
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

export default ProfesoriManager; 