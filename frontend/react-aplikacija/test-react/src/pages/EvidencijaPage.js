import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "../api/axios";
import "./EvidencijaPage.css";
import rasporedPozadina from "../assets/rasporedPozadina.png";

const EvidencijaPage = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State za studentski prikaz
  const [predmeti, setPredmeti] = useState([]);
  const [filterPredmet, setFilterPredmet] = useState("");
  const [filterDatum, setFilterDatum] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [activeTab, setActiveTab] = useState("prisustva");
  const [aktivniTermini, setAktivniTermini] = useState([]);

  // State za profesorski prikaz
  const [profesorPredmeti, setProfesorPredmeti] = useState([]);
  const [selectedPredmet, setSelectedPredmet] = useState(null);
  const [selectedTermin, setSelectedTermin] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setError("Niste ulogovani.");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('auth_token');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        if (user.role === "student") {
          const response = await axios.get('/api/student/prisustva', config);
          setPredmeti(response.data);
        } else if (user.role === "profesor") {
          const response = await axios.get('/api/profesor/prisustva', config);
          setProfesorPredmeti(response.data);
          if (response.data.length > 0) {
            setSelectedPredmet(response.data[0].id);
          }
        }
      } catch (err) {
        console.error("Greška pri dohvatanju podataka:", err);
        setError("Došlo je do greške pri učitavanju podataka.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Funkcije za studentski prikaz
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
      setAktivniTermini(response.data);
    } catch (err) {
      console.error("Greška pri dohvatanju aktivnih termina:", err);
      setAktivniTermini([]);
    }
  };

  useEffect(() => {
    if (activeTab === "aktivni-termini") {
      fetchAktivniTermini();
    }
  }, [activeTab]);

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
      
      fetchAktivniTermini();
      alert("Prisustvo uspešno evidentirano!");
    } catch (err) {
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Došlo je do greške pri evidentiranju prisustva.");
      }
    }
  };

  // Komponenta za prikaz prisustva profesora
  const ProfesorEvidencija = () => {
    if (!profesorPredmeti.length) {
      return <p className="no-results">Nema dostupnih predmeta.</p>;
    }

    const trenutniPredmet = profesorPredmeti.find(p => p.id === selectedPredmet);
    
    if (!trenutniPredmet) {
      return <p className="no-results">Izaberite predmet.</p>;
    }

    return (
      <div className="profesor-evidencija">
        <div className="filter-container">
          <select 
            value={selectedPredmet} 
            onChange={(e) => setSelectedPredmet(Number(e.target.value))}
            className="filter-select"
          >
            {profesorPredmeti.map(predmet => (
              <option key={predmet.id} value={predmet.id}>
                {predmet.naziv}
              </option>
            ))}
          </select>
        </div>

        <div className="termini-container">
          {trenutniPredmet.termini.map(termin => (
            <div key={termin.id} className="termin-card">
              <h3>{termin.dan} {termin.vreme}</h3>
              <p>{termin.sala} - {termin.tip_nastave}</p>
              
              <table className="prisustvo-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Broj indeksa</th>
                    <th>Status</th>
                    <th>Datum</th>
                  </tr>
                </thead>
                <tbody>
                  {termin.prisustva.map(p => (
                    p.evidencije.map((evidencija, index) => (
                      <tr key={`${p.student.id}-${index}`} className={evidencija.status ? "prisutan" : "odsutan"}>
                        <td>{p.student.ime} {p.student.prezime}</td>
                        <td>{p.student.broj_indeksa}</td>
                        <td>{evidencija.status ? "Prisutan" : "Odsutan"}</td>
                        <td>{evidencija.datum}</td>
                      </tr>
                    ))
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Komponenta za prikaz prisustva studenta
  const StudentEvidencija = () => {
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

    const uniquePredmeti = [...new Set(svaEvidencija.map(item => item.predmetNaziv))];
    const uniqueDatumi = [...new Set(svaEvidencija.map(item => item.datum))].sort().reverse();

    return (
      <>
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
          <div className="aktivni-termini-container">
            <h2>Aktivni termini za danas</h2>
            <button className="refresh-btn" onClick={fetchAktivniTermini}>
              Osveži listu termina
            </button>
            
            {aktivniTermini.length === 0 ? (
              <p className="no-results">Nema aktivnih termina za danas.</p>
            ) : (
              <table className="evidencija-table">
                <thead>
                  <tr>
                    <th>Predmet</th>
                    <th>Dan</th>
                    <th>Vreme</th>
                    <th>Sala</th>
                    <th>Tip nastave</th>
                    <th>Status</th>
                    <th>Akcija</th>
                  </tr>
                </thead>
                <tbody>
                  {aktivniTermini.map((termin) => (
                    <tr key={termin.id} className={termin.evidentiran ? "evidentiran" : ""}>
                      <td>{termin.naziv}</td>
                      <td>{termin.dan_u_nedelji}</td>
                      <td>{`${termin.vreme_pocetka.substring(0, 5)} - ${termin.vreme_zavrsetka.substring(0, 5)}`}</td>
                      <td>{termin.sala}</td>
                      <td>{termin.tip_nastave}</td>
                      <td>{termin.evidentiran ? "Evidentirano" : "Nije evidentirano"}</td>
                      <td>
                        {termin.evidentiran ? (
                          <button className="evidentirano-btn" disabled>
                            Evidentirano
                          </button>
                        ) : (
                          <button 
                            className="evidentiraj-btn"
                            onClick={() => evidentirajPrisustvo(termin.id)}
                          >
                            Evidentiraj prisustvo
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </>
    );
  };

  if (loading) {
    return (
      <div className="evidencija-container" style={{ backgroundImage: `url(${rasporedPozadina})` }}>
        <div className="loading">Učitavanje evidencije prisustva...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="evidencija-container" style={{ backgroundImage: `url(${rasporedPozadina})` }}>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="evidencija-container" style={{ backgroundImage: `url(${rasporedPozadina})` }}>
      <h1>Evidencija prisustva</h1>
      {user?.role === "student" ? <StudentEvidencija /> : <ProfesorEvidencija />}
    </div>
  );
};

export default EvidencijaPage;
 