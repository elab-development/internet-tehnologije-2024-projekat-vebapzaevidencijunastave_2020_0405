import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import './AdminManager.css';
import Button from '../Button';
import Input from '../Input';
import Card from '../Card';

const TerminiManager = () => {
  const [termini, setTermini] = useState([]);
  const [predmeti, setPredmeti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    predmet_id: '',
    datum: '',
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

      const [terminiRes, predmetiRes] = await Promise.all([
        axios.get('/api/termini', config),
        axios.get('/api/predmeti', config)
      ]);

      setTermini(terminiRes.data);
      setPredmeti(predmetiRes.data);
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
      await axios.post('/api/termini', formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setFormData({
        predmet_id: '',
        datum: '',
        vreme_pocetka: '',
        vreme_zavrsetka: '',
        sala: '',
        tip_nastave: ''
      });
      setShowForm(false);
      fetchData();
    } catch (err) {
      setError('Greška pri dodavanju termina');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovaj termin?')) {
      try {
        const token = localStorage.getItem('auth_token');
        await axios.delete(`/api/termini/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchData();
      } catch (err) {
        setError('Greška pri brisanju termina');
      }
    }
  };

  const getPredmetInfo = (predmet_id) => {
    const predmet = predmeti.find(p => p.id === predmet_id);
    return predmet ? predmet.naziv : 'Nepoznat predmet';
  };

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('sr-RS', options);
  };

  if (loading) return <div>Učitavanje...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-manager">
      <div className="manager-header">
        <h2>Upravljanje Terminima</h2>
        <Button 
          variant="primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Otkaži' : 'Dodaj Termin'}
        </Button>
      </div>

      {showForm && (
        <Card className="admin-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Predmet:</label>
              <select
                name="predmet_id"
                value={formData.predmet_id}
                onChange={handleInputChange}
                required
                className="form-select"
              >
                <option value="">Izaberite predmet</option>
                {predmeti.map(predmet => (
                  <option key={predmet.id} value={predmet.id}>
                    {predmet.naziv}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Datum"
              type="date"
              name="datum"
              value={formData.datum}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Vreme početka"
              type="time"
              name="vreme_pocetka"
              value={formData.vreme_pocetka}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Vreme završetka"
              type="time"
              name="vreme_zavrsetka"
              value={formData.vreme_zavrsetka}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Sala"
              type="text"
              name="sala"
              value={formData.sala}
              onChange={handleInputChange}
              required
            />
            <div className="form-group">
              <label>Tip nastave:</label>
              <select
                name="tip_nastave"
                value={formData.tip_nastave}
                onChange={handleInputChange}
                required
                className="form-select"
              >
                <option value="">Izaberite tip nastave</option>
                <option value="predavanje">Predavanje</option>
                <option value="vezbe">Vežbe</option>
                <option value="laboratorija">Laboratorija</option>
              </select>
            </div>
            <Button type="submit" variant="primary">Sačuvaj</Button>
          </form>
        </Card>
      )}

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Predmet</th>
              <th>Datum</th>
              <th>Vreme</th>
              <th>Sala</th>
              <th>Tip nastave</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            {termini.map(termin => (
              <tr key={termin.id}>
                <td>{getPredmetInfo(termin.predmet_id)}</td>
                <td>{formatDate(termin.datum)}</td>
                <td>{termin.vreme_pocetka} - {termin.vreme_zavrsetka}</td>
                <td>{termin.sala}</td>
                <td>{termin.tip_nastave}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(termin.id)}
                  >
                    Obriši
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TerminiManager; 