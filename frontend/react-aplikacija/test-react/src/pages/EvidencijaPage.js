import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "../api/axios";
import "./EvidencijaPage.css";
import rasporedPozadina from "../assets/rasporedPozadina.png";
 
const EvidencijaPage = () => {
  const { user } = useContext(AuthContext);
  const [predmeti, setPredmeti] = useState([]);
  const [filterPredmet, setFilterPredmet] = useState("");
  const [filterDatum, setFilterDatum] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("prisustva"); // "prisustva" ili "aktivni-termini"
  const [aktivniTermini, setAktivniTermini] = useState([]);
 
  useEffect(() => {
    const fetchPrisustva = async () => {
      if (!user) {
        setLoading(false);
        setError("Niste ulogovani. Prijavite se da biste videli evidenciju prisustva.");
        return;
      }
      
      setLoading(true);
      try {
        const token = localStorage.getItem('auth_token');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
        
        // Dohvatanje prisustva
        const response = await axios.get('/api/student/prisustva', config);
        console.log('Prisustva sa servera:', response.data);
        
        setPredmeti(response.data);
        setError(null);
      } catch (err) {
        console.error("Greška pri dohvatanju prisustva:", err);
        setError("Došlo je do greške pri učitavanju evidencije prisustva.");
        
        // Ako nema podataka sa API-ja, koristi testne podatke
        if (user?.role === "student") {
          // Test podaci, samo ako ne dobijemo odgovor sa servera
          const testPredmeti = [
            {
              predmet: { id: 1, naziv: "Matematika" },
              prisustva: [
                { id: 1, datum: "2024-02-10", status: true, termin: { dan: "Ponedeljak", vreme: "08:00 - 10:00", sala: "A1", tip_nastave: "Predavanje" } },
                { id: 2, datum: "2024-02-17", status: false, termin: { dan: "Ponedeljak", vreme: "08:00 - 10:00", sala: "A1", tip_nastave: "Predavanje" } }
              ]
            },
            {
              predmet: { id: 2, naziv: "Programiranje" },
              prisustva: [
                { id: 3, datum: "2024-02-11", status: true, termin: { dan: "Utorak", vreme: "10:00 - 12:00", sala: "B2", tip_nastave: "Vežbe" } }
              ]
            }
          ];
          setPredmeti(testPredmeti);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrisustva();
  }, [user]);
  
  // Dohvatanje aktivnih termina
  const fetchAktivniTermini = async () => {
    if (!user || user.role !== "student") return;
    
    try {
      const token = localStorage.getItem('auth_token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      const response = await axios.get('/api/student/aktivni-termini', config);
      console.log('Aktivni termini sa servera:', response.data);
      
      setAktivniTermini(response.data);
    } catch (err) {
      console.error("Greška pri dohvatanju aktivnih termina:", err);
      setAktivniTermini([]);
    }
  };
  
  // Pozivamo fetchAktivniTermini kada korisnik klikne na tab "Aktivni termini"
  useEffect(() => {
    if (activeTab === "aktivni-termini") {
      fetchAktivniTermini();
    }
  }, [activeTab]);
  
  // Funkcija za evidentiranje prisustva
  const evidentirajPrisustvo = async (rasporedPredmetId) => {
    try {
      const token = localStorage.getItem('auth_token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      const response = await axios.post('/api/student/evidentiraj-prisustvo', {
        raspored_predmet_id: rasporedPredmetId
      }, config);
      
      console.log('Odgovor nakon evidentiranja prisustva:', response.data);
      
      // Osvežavamo listu aktivnih termina
      fetchAktivniTermini();
      
      alert("Prisustvo uspešno evidentirano!");
    } catch (err) {
      console.error("Greška pri evidentiranju prisustva:", err);
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert("Došlo je do greške pri evidentiranju prisustva.");
      }
    }
  };
  
  // Pripremamo podatke za filtriranje
  const svaEvidencija = predmeti.flatMap(predmet =>
    predmet.prisustva.map(prisustvo => ({
      predmetId: predmet.predmet.id,
      predmetNaziv: predmet.predmet.naziv,
      datum: prisustvo.datum,
      status: prisustvo.status ? "Prisutan" : "Odsutan",
      dan: prisustvo.termin.dan,
      vreme: prisustvo.termin.vreme,
      sala: prisustvo.termin.sala,
      tip_nastave: prisustvo.termin.tip_nastave
    }))
  );
  
  const filtriraneEvidencije = svaEvidencija.filter(item =>
    (filterPredmet ? item.predmetNaziv === filterPredmet : true) &&
    (filterDatum ? item.datum === filterDatum : true) &&
    (filterStatus ? item.status === filterStatus : true)
  );
  
  // Izdvajamo jedinstvene vrednosti za filtere
  const uniquePredmeti = [...new Set(svaEvidencija.map(item => item.predmetNaziv))];
  const uniqueDatumi = [...new Set(svaEvidencija.map(item => item.datum))].sort().reverse();
 
  if (loading) {
    return (
      <div className="evidencija-container" style={{ backgroundImage: `url(${rasporedPozadina})` }}>
        <div className="loading">Učitavanje evidencije prisustva...</div>
      </div>
    );
  }
 
  if (error && predmeti.length === 0) {
    return (
      <div className="evidencija-container" style={{ backgroundImage: `url(${rasporedPozadina})` }}>
        <div className="error-message">{error}</div>
      </div>
    );
  }
 
  return (
    <div className="evidencija-container" style={{ backgroundImage: `url(${rasporedPozadina})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <h1>Evidencija prisustva</h1>
      
      {user?.role === "student" && (
        <div className="tabs">
          <button 
            className={`tab-button ${activeTab === "prisustva" ? "active" : ""}`}
            onClick={() => setActiveTab("prisustva")}
          >
            Moja prisustva
          </button>
          <button 
            className={`tab-button ${activeTab === "aktivni-termini" ? "active" : ""}`}
            onClick={() => setActiveTab("aktivni-termini")}
          >
            Aktivni termini
          </button>
        </div>
      )}
      
      {activeTab === "prisustva" ? (
        <>
          <div className="filter-container">
            <select value={filterPredmet} onChange={(e) => setFilterPredmet(e.target.value)}>
              <option value="">Svi predmeti</option>
              {uniquePredmeti.map(predmet => (
                <option key={predmet} value={predmet}>{predmet}</option>
              ))}
            </select>
            <select value={filterDatum} onChange={(e) => setFilterDatum(e.target.value)}>
              <option value="">Svi datumi</option>
              {uniqueDatumi.map(datum => (
                <option key={datum} value={datum}>{new Date(datum).toLocaleDateString('sr-RS')}</option>
              ))}
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">Svi statusi</option>
              <option value="Prisutan">Prisutan</option>
              <option value="Odsutan">Odsutan</option>
            </select>
          </div>
      
          {filtriraneEvidencije.length === 0 ? (
            <p className="no-results">Nema evidencija za zadate filtere.</p>
          ) : (
            <table className="evidencija-table">
              <thead>
                <tr>
                  <th>Predmet</th>
                  <th>Datum</th>
                  <th>Dan</th>
                  <th>Vreme</th>
                  <th>Sala</th>
                  <th>Tip nastave</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtriraneEvidencije.map((item, index) => (
                  <tr key={index} className={item.status === "Prisutan" ? "prisutan" : "odsutan"}>
                    <td>{item.predmetNaziv}</td>
                    <td>{new Date(item.datum).toLocaleDateString('sr-RS')}</td>
                    <td>{item.dan}</td>
                    <td>{item.vreme}</td>
                    <td>{item.sala}</td>
                    <td>{item.tip_nastave}</td>
                    <td>{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          
          {/* Statistika prisustva */}
          <div className="statistika">
            <h3>Statistika prisustva</h3>
            {predmeti.map(predmet => {
              const ukupnoPrisutnih = predmet.prisustva.filter(p => p.status).length;
              const ukupno = predmet.prisustva.length;
              const procenat = ukupno > 0 ? Math.round((ukupnoPrisutnih / ukupno) * 100) : 0;
              
              return (
                <div key={predmet.predmet.id} className="predmet-statistika">
                  <h4>{predmet.predmet.naziv}</h4>
                  <div className="progress-bar">
                    <div 
                      className="progress" 
                      style={{ width: `${procenat}%` }}
                    ></div>
                  </div>
                  <p>{ukupnoPrisutnih} od {ukupno} časova ({procenat}%)</p>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        // Prikaz aktivnih termina
        <div className="aktivni-termini">
          <h2>Aktivni termini za danas</h2>
          
          {aktivniTermini.length === 0 ? (
            <p className="no-results">Trenutno nema aktivnih termina.</p>
          ) : (
            <div className="termini-lista">
              {aktivniTermini.map(termin => (
                <div key={termin.id} className="termin-kartica">
                  <h3>{termin.predmet.naziv}</h3>
                  <p><strong>Vreme:</strong> {termin.vreme_pocetka.substring(0, 5)} - {termin.vreme_zavrsetka.substring(0, 5)}</p>
                  <p><strong>Sala:</strong> {termin.sala}</p>
                  <p><strong>Tip nastave:</strong> {termin.tip_nastave}</p>
                  
                  {termin.evidentiran ? (
                    <button className="evidentirano-btn" disabled>Evidentirano</button>
                  ) : (
                    <button 
                      className="evidentiraj-btn" 
                      onClick={() => evidentirajPrisustvo(termin.id)}
                    >
                      Evidentiraj prisustvo
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
          
          <button className="refresh-btn" onClick={fetchAktivniTermini}>
            Osveži listu termina
          </button>
        </div>
      )}
    </div>
  );
};
 
export default EvidencijaPage;
 