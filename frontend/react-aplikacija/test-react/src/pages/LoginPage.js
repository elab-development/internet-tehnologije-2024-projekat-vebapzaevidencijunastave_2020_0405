// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const LoginPage = () => {
//   const [loginType, setLoginType] = useState('student'); // 'student', 'profesor', 'admin'
//   const [usernameOrIndex, setUsernameOrIndex] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       let payload = {};

//       if (loginType === 'student') {
//         payload = { broj_indeksa: usernameOrIndex, password };
//       } else {
//         payload = { korisnicko_ime: usernameOrIndex, password };
//       }

//       const response = await axios.post('URL_TVOG_BACKEND_API/login', payload);
//       const { token, role } = response.data;

//       localStorage.setItem('token', token);
//       localStorage.setItem('role', role);

//       navigate(role === 'admin' ? '/admin' : '/');
//     } catch (err) {
//       setError('Neispravni podaci za prijavu. Pokušajte ponovo.');
//     }
//   };

//   return (
//     <div>
//       <h1>Prijava</h1>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Tip korisnika:</label>
//           <select value={loginType} onChange={(e) => setLoginType(e.target.value)}>
//             <option value="student">Student</option>
//             <option value="profesor">Profesor</option>
//             <option value="admin">Administrator</option>
//           </select>
//         </div>
//         <div>
//           <label>{loginType === 'student' ? 'Broj indeksa:' : 'Korisničko ime:'}</label>
//           <input
//             type="text"
//             value={usernameOrIndex}
//             onChange={(e) => setUsernameOrIndex(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label>Lozinka:</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         {error && <p style={{ color: 'red' }}>{error}</p>}
//         <button type="submit">Prijavi se</button>
//       </form>
//     </div>
//   );
// };

// export default LoginPage;

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import "./LoginPage.css";
import logo from "../assets/logo.png";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [loginType, setLoginType] = useState('student');
  const [usernameOrIndex, setUsernameOrIndex] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!usernameOrIndex || !password) {
      setError("Sva polja moraju biti popunjena.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      let role = "";
      if (loginType === "student" && usernameOrIndex === "2020-001" && password === "test123") {
        role = "student";
      } else if (loginType === "profesor" && usernameOrIndex === "profesor1" && password === "test123") {
        role = "profesor";
      } else if (loginType === "admin" && usernameOrIndex === "admin" && password === "admin123") {
        role = "admin";
      } else {
        setError("Neispravni podaci za prijavu. Pokušajte ponovo.");
        setLoading(false);
        return;
      }

      login("mocked-jwt-token", role, navigate);
      setLoading(false);
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }, 2000);
  };

  return (
    <div className="login-container">
      <img src={logo} alt="FON Logo" className="login-logo" />
      <h1>Prijava</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tip korisnika:</label>
          <select value={loginType} onChange={(e) => setLoginType(e.target.value)}>
            <option value="student">Student</option>
            <option value="profesor">Profesor</option>
            <option value="admin">Administrator</option>
          </select>
        </div>
        <div>
          <input
            type="text"
            placeholder={loginType === "student" ? "Broj indeksa" : "Korisničko ime"}
            value={usernameOrIndex}
            onChange={(e) => setUsernameOrIndex(e.target.value)}
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
        <p className="forgot-password">Zaboravili ste lozinku?</p>
      </form>
    </div>
  );
};

export default LoginPage;