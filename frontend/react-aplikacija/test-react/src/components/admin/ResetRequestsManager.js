import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import Card from '../Card';
import Button from '../Button';
import Input from '../Input';

const ResetRequestsManager = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/password-reset-requests');
      setRequests(res.data);
    } catch (e) {
      setError('Greška pri učitavanju zahteva.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (identifier) => {
    setError('');
    setSuccess('');
    if (!newPassword) {
      setError('Unesite novu lozinku.');
      return;
    }
    try {
      await axios.post('/api/admin/reset-password', { identifier, newPassword });
      setSuccess('Lozinka je uspešno promenjena!');
      setNewPassword('');
      setSelected(null);
      fetchRequests();
    } catch (e) {
      setError('Greška pri promeni lozinke.');
    }
  };

  return (
    <div>
      <h2>Zahtevi za reset lozinke</h2>
      {loading ? <p>Učitavanje...</p> : (
        <>
          {requests.length === 0 ? (
            <p>Nema zahteva.</p>
          ) : (
            <div className="reset-requests-list">
              {requests.map(req => (
                <Card key={req.id} className="reset-request-card">
                  <div>
                    <b>Korisnik:</b> {req.identifier}<br/>
                    <b>Status:</b> {req.status}
                  </div>
                  {req.status === 'pending' && (
                    selected === req.id ? (
                      <div style={{ marginTop: 10 }}>
                        <Input
                          type="text"
                          placeholder="Nova lozinka"
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                        />
                        <Button variant="primary" onClick={() => handleReset(req.identifier)}>
                          Potvrdi promenu
                        </Button>
                        <Button variant="secondary" onClick={() => setSelected(null)}>
                          Otkaži
                        </Button>
                      </div>
                    ) : (
                      <Button variant="primary" onClick={() => setSelected(req.id)}>
                        Izmeni lozinku
                      </Button>
                    )
                  )}
                </Card>
              ))}
            </div>
          )}
        </>
      )}
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
};

export default ResetRequestsManager; 