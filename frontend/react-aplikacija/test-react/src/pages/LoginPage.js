import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import "./LoginPage.css";
import logo from "../assets/logo.png";
import axios, { getCsrfToken } from '../api/axios';

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
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Broj indeksa (2020/0405) ili korisničko ime"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Lozinka"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        
        <button type="submit" disabled={loading} className="login-button">
          {loading ? "Prijavljivanje..." : "Prijavi se"}
        </button>

        {loading && <div className="spinner"></div>}
        <p className="login-help">
          * Za studente unesite broj indeksa u formatu YYYY/XXXX (npr. 2020/0405)<br />
          * Za profesore unesite vaše korisničko ime<br />
          * Za administratore korisničko ime mora početi sa "admin"
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
