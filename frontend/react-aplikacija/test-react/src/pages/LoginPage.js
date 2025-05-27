import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import "./LoginPage.css";
import logo from "../assets/logo.png";
import axios, { getCsrfToken } from '../api/axios';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!identifier || !password) {
      setError("Sva polja moraju biti popunjena.");
      return;
    }

    setLoading(true);

    try {
      await getCsrfToken();

      // Određivanje tipa korisnika na osnovu identifikatora
      let endpoint;
      let payload;

      if (identifier.match(/^\d{4}\/\d{4}$/)) {
        // Format broja indeksa (npr. 2020/0405)
        endpoint = '/api/student/login';
        payload = { broj_indeksa: identifier, lozinka: password };
      } else if (identifier.startsWith('admin')) {
        // Admin korisničko ime počinje sa 'admin'
        endpoint = '/api/admin/login';
        payload = { korisnicko_ime: identifier, lozinka: password };
      } else {
        // Ostalo su profesori
        endpoint = '/api/profesor/login';
        payload = { korisnicko_ime: identifier, lozinka: password };
      }

      const response = await axios.post(endpoint, payload);
      const { token, role } = response.data;

      login(token, role);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Neispravni podaci za prijavu. Pokušajte ponovo.");
      } else if (err.request) {
        setError("Greška u komunikaciji sa serverom. Proverite vašu internet konekciju.");
      } else {
        setError("Došlo je do greške. Pokušajte ponovo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="FON Logo" className="login-logo" />
      <h1>Prijava</h1>
      <Card className="login-card">
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Broj indeksa (2020/0405) ili korisničko ime"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            className="login-input"
          />
          <Input
            type="password"
            placeholder="Lozinka"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
          {error && <p className="error-message">{error}</p>}
          
          <Button
            type="submit"
            disabled={loading}
            className="login-button"
            variant="primary"
          >
            {loading ? "Prijavljivanje..." : "Prijavi se"}
          </Button>

          {loading && <div className="spinner"></div>}
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
