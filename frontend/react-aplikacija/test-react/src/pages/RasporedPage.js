import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./RasporedPage.css";
import rasporedPozadina from "../assets/rasporedPozadina.png";
import axios from "../api/axios";
 
const RasporedPage = () => {
  const { user } = useContext(AuthContext);
  const [raspored, setRaspored] = useState(null);
  const [predmeti, setPredmeti] = useState([]);
  const [rasporedi, setRasporedi] = useState([]);
  const [selectedRasporedId, setSelectedRasporedId] = useState(null);
  const [dani] = useState(["Ponedeljak", "Utorak", "Sreda", "Četvrtak", "Petak", "Subota"]);
  const [filterPredmet, setFilterPredmet] = useState("");
  const [filterDan, setFilterDan] = useState("");
  const [filterSala, setFilterSala] = useState("");
  const [selectedTermin, setSelectedTermin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aktivniTermini, setAktivniTermini] = useState([]);
  const [showOnlyAktivni, setShowOnlyAktivni] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPrisustvoModal, setShowPrisustvoModal] = useState(false);
  const [prisustvoData, setPrisustvoData] = useState(null);
  const [showAktivniTermini, setShowAktivniTermini] = useState(false);
  const [showRefreshButton, setShowRefreshButton] = useState(false);
 
  useEffect(() => {
    const fetchRasporedi = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setError('Niste prijavljeni');
          setLoading(false);
          return;
        }

        const config = {
          headers: { 'Authorization': `Bearer ${token}` }
        };

        let endpoint = '/api/student/raspored';
        if (user?.role === "profesor") {
          endpoint = '/api/profesor/raspored';
        }

        const response = await axios.get(endpoint, config);
        console.log('Odgovor sa servera:', response.data);

        if (response.data && response.data.rasporedi && Array.isArray(response.data.rasporedi)) {
          setRasporedi(response.data.rasporedi);
          if (response.data.rasporedi.length > 0) {
            const prviRaspored = response.data.rasporedi[0];
            setSelectedRasporedId(prviRaspored.id);
            setRaspored(prviRaspored);
            setPredmeti(prviRaspored.predmeti || []);
          }
        } else {
          throw new Error('Nevalidan format podataka sa servera');
        }
        setLoading(false);
      } catch (error) {
        console.error('Greška pri učitavanju rasporeda:', error);
        setError('Došlo je do greške pri učitavanju rasporeda');
        setLoading(false);
        
        // Postavljamo testne podatke ako nema podataka sa servera
        const testPodaci = [
          { 
            id: 1, 
            naziv: "Matematika", 
            dan_u_nedelji: "Ponedeljak", 
            vreme_pocetka: "08:00:00", 
            vreme_zavrsetka: "10:00:00", 
            sala: "A1", 
            tip_nastave: "Predavanje" 
          },
          { 
            id: 2, 
            naziv: "Programiranje", 
            dan_u_nedelji: "Utorak", 
            vreme_pocetka: "10:00:00", 
            vreme_zavrsetka: "12:00:00", 
            sala: "B2", 
            tip_nastave: "Vežbe" 
          },
          { 
            id: 3, 
            naziv: "Baze podataka", 
            dan_u_nedelji: "Sreda", 
            vreme_pocetka: "12:00:00", 
            vreme_zavrsetka: "14:00:00", 
            sala: "C3", 
            tip_nastave: "Predavanje" 
          }
        ];
        setPredmeti(testPodaci);
        setRaspored({
          id: 1,
          naziv: "Test raspored",
          skolska_godina: "2023/2024",
          semestar: 1,
          godina_studija: 1
        });
      }
    };

    fetchRasporedi();
  }, [user]);

  // Učitavanje predmeta kada se promeni selektovani raspored
  useEffect(() => {
    if (!selectedRasporedId || !rasporedi.length) return;

    const selectedRaspored = rasporedi.find(r => r.id === selectedRasporedId);
    if (selectedRaspored) {
      setRaspored(selectedRaspored);
      setPredmeti(selectedRaspored.predmeti || []);
    }
  }, [selectedRasporedId, rasporedi]);

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
      
      if (response.data && Array.isArray(response.data)) {
        setAktivniTermini(response.data);
      }
    } catch (err) {
      console.error("Greška pri dohvatanju aktivnih termina:", err);
      setAktivniTermini([]);
    }
  };
  
  useEffect(() => {
    if (user && user.role === "student") {
      fetchAktivniTermini();
    }
  }, [user]);
  
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
 
  const filtriraniPredmeti = predmeti.filter(item =>
    (filterPredmet ? item.naziv === filterPredmet : true) &&
    (filterDan ? item.dan_u_nedelji === filterDan : true) &&
    (filterSala ? item.sala === filterSala : true) &&
    // Ako je uključen filter za aktivne termine, prikazujemo samo aktivne
    (showOnlyAktivni ? aktivniTermini.some(t => t.id === item.id) : true)
  );
  
  // Izvlačimo jedinstvene vrednosti za filtere
  const uniquePredmeti = [...new Set(predmeti.map(item => item.naziv))];
  const uniqueSale = [...new Set(predmeti.map(item => item.sala))];
 
  const prikaziDetalje = (termin) => {
    setSelectedTermin(termin);
    setShowModal(true);
  };
  
  // Proveravamo da li je termin aktivan
  const isTerminAktivan = (terminId) => {
    return aktivniTermini.some(t => t.id === terminId);
  };
  
  // Proveravamo da li je termin već evidentiran
  const isTerminEvidentiran = (terminId) => {
    const aktivniTermin = aktivniTermini.find(t => t.id === terminId);
    return aktivniTermin ? aktivniTermin.evidentiran : false;
  };
 
  if (loading) {
    return (
      <div className="raspored-container" style={{ backgroundImage: `url(${rasporedPozadina})` }}>
        <div className="loading">Učitavanje rasporeda...</div>
      </div>
    );
  }
 
  if (error) {
    return (
      <div className="raspored-container" style={{ backgroundImage: `url(${rasporedPozadina})` }}>
        <div className="error-message">{error}</div>
      </div>
    );
  }
 
  return (
    <div className="raspored-container" style={{ backgroundImage: `url(${rasporedPozadina})` }}>
      <h1>Raspored časova</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Učitavanje...</div>
      ) : (
        <>
          {rasporedi.length > 0 && (
            <div className="raspored-selector">
              <label htmlFor="raspored-select">Izaberite raspored:</label>
              <select 
                id="raspored-select"
                value={selectedRasporedId || ''}
                onChange={(e) => setSelectedRasporedId(Number(e.target.value))}
              >
                {rasporedi.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.naziv} ({r.godina_studija}. godina, {r.semestar}. semestar)
                    {r.aktivan ? ' (Aktivan)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="raspored-info">
            {raspored && (
              <>
                <h2>{raspored.naziv}</h2>
                <p>Školska godina: {raspored.skolska_godina}</p>
                <p>Godina studija: {raspored.godina_studija}.</p>
                <p>Semestar: {raspored.semestar}.</p>
                {raspored.aktivan && <p className="aktivan-badge">Aktivan raspored</p>}
              </>
            )}
          </div>

          <div className="filter-container">
            <select value={filterPredmet} onChange={(e) => setFilterPredmet(e.target.value)}>
              <option value="">Svi predmeti</option>
              {uniquePredmeti.map(predmet => (
                <option key={predmet} value={predmet}>{predmet}</option>
              ))}
            </select>
            <select value={filterDan} onChange={(e) => setFilterDan(e.target.value)}>
              <option value="">Svi dani</option>
              {dani.map(dan => (
                <option key={dan} value={dan}>{dan}</option>
              ))}
            </select>
            <select value={filterSala} onChange={(e) => setFilterSala(e.target.value)}>
              <option value="">Sve sale</option>
              {uniqueSale.map(sala => (
                <option key={sala} value={sala}>{sala}</option>
              ))}
            </select>
            
            {user?.role === "student" && (
              <div className="switch-container">
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={showOnlyAktivni}
                    onChange={() => setShowOnlyAktivni(!showOnlyAktivni)}
                  />
                  <span className="slider round"></span>
                </label>
                <span>Samo aktivni termini</span>
              </div>
            )}
          </div>
          
          {user?.role === "student" && aktivniTermini.length > 0 && (
            <div className="aktivni-termini-info">
              <p>Trenutno imate {aktivniTermini.length} aktivnih termina!</p>
              <button className="refresh-btn" onClick={fetchAktivniTermini}>
                Osveži aktivne termine
              </button>
            </div>
          )}
          
          <div className="raspored-table">
            <table>
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
                {filtriraniPredmeti.map(termin => (
                  <tr 
                    key={`termin-${termin.id}`} 
                    className={isTerminAktivan(termin.id) ? "aktivan-termin" : ""}
                  >
                    <td>{termin.naziv}</td>
                    <td>{termin.dan_u_nedelji}</td>
                    <td>
                      {termin.vreme_pocetka && termin.vreme_zavrsetka 
                        ? `${termin.vreme_pocetka.substring(0, 5)} - ${termin.vreme_zavrsetka.substring(0, 5)}`
                        : 'Nije definisano'}
                    </td>
                    <td>{termin.sala}</td>
                    <td>{termin.tip_nastave}</td>
                    <td>
                      <button className="details-btn" onClick={() => prikaziDetalje(termin)}>
                        Detalji
                      </button>
                      
                      {user?.role === "student" && isTerminAktivan(termin.id) && (
                        isTerminEvidentiran(termin.id) ? (
                          <button className="evidentirano-btn" disabled>Evidentirano</button>
                        ) : (
                          <button 
                            className="evidentiraj-btn"
                            onClick={() => evidentirajPrisustvo(termin.id)}
                          >
                            Evidentiraj prisustvo
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {showModal && selectedTermin && (
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                <h2>{selectedTermin.naziv}</h2>
                <p><strong>Dan:</strong> {selectedTermin.dan_u_nedelji}</p>
                <p><strong>Vreme:</strong> {
                  selectedTermin.vreme_pocetka && selectedTermin.vreme_zavrsetka 
                    ? `${selectedTermin.vreme_pocetka.substring(0, 5)} - ${selectedTermin.vreme_zavrsetka.substring(0, 5)}`
                    : 'Nije definisano'
                }</p>
                <p><strong>Sala:</strong> {selectedTermin.sala}</p>
                <p><strong>Tip nastave:</strong> {selectedTermin.tip_nastave}</p>
                {selectedTermin.profesor && (
                  <p><strong>Profesor:</strong> {selectedTermin.profesor.ime} {selectedTermin.profesor.prezime}</p>
                )}
                
                {user?.role === "student" && isTerminAktivan(selectedTermin.id) && (
                  isTerminEvidentiran(selectedTermin.id) ? (
                    <div className="modal-status evidentirano">Prisustvo je već evidentirano za ovaj termin</div>
                  ) : (
                    <button 
                      className="evidentiraj-btn modal-btn"
                      onClick={() => {
                        evidentirajPrisustvo(selectedTermin.id);
                        setSelectedTermin(null);
                      }}
                    >
                      Evidentiraj prisustvo
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
 
export default RasporedPage;
 
 