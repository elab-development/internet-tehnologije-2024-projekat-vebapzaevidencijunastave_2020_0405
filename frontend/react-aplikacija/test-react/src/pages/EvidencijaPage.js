import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "../api/axios";
import "./EvidencijaPage.css";
import rasporedPozadina from "../assets/rasporedPozadina.png";
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import usePagination from '../hooks/usePagination';
import StatisticsChart from '../components/StatisticsChart';

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
  
  // Koristimo custom hook za paginaciju
  const {
    currentPage,
    perPage,
    lastPage,
    total,
    nextPage,
    prevPage,
    updatePaginationData
  } = usePagination(1, 10);

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
          const response = await axios.get(`/api/student/prisustva?page=${currentPage}&per_page=${perPage}`, config);
          setPredmeti(response.data.data);
          updatePaginationData({
            current_page: response.data.current_page,
            last_page: response.data.last_page,
            total: response.data.total
          });
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
  }, [user, currentPage, perPage, updatePaginationData]);

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

  // Dodajemo funkciju za pripremu podataka za statistiku
  const prepareStatisticsData = () => {
    const predmetiStats = {};
    
    predmeti.forEach(item => {
      if (!predmetiStats[item.predmet?.naziv]) {
        predmetiStats[item.predmet?.naziv] = {
          prisutan: 0,
          odsutan: 0,
          ukupno: 0
        };
      }
      
      predmetiStats[item.predmet?.naziv].ukupno++;
      if (item.status === "Prisutan") {
        predmetiStats[item.predmet?.naziv].prisutan++;
      } else {
        predmetiStats[item.predmet?.naziv].odsutan++;
      }
    });

    const chartData = {
      labels: Object.keys(predmetiStats),
      datasets: [
        {
          label: 'Prisutan',
          data: Object.values(predmetiStats).map(stat => stat.prisutan),
          backgroundColor: 'rgba(76, 175, 80, 0.5)',
          borderColor: 'rgba(76, 175, 80, 1)',
          borderWidth: 1,
        },
        {
          label: 'Odsutan',
          data: Object.values(predmetiStats).map(stat => stat.odsutan),
          backgroundColor: 'rgba(244, 67, 54, 0.5)',
          borderColor: 'rgba(244, 67, 54, 1)',
          borderWidth: 1,
        },
      ],
    };

    return chartData;
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

    // Dodajemo funkciju za pripremu podataka za statistiku
    const prepareStatisticsData = () => {
      if (!trenutniPredmet) return null;

      const terminStats = {};
      
      trenutniPredmet.termini.forEach(termin => {
        termin.prisustva.forEach(p => {
          p.evidencije.forEach(evidencija => {
            if (!terminStats[termin.dan]) {
              terminStats[termin.dan] = {
                prisutan: 0,
                odsutan: 0,
                ukupno: 0
              };
            }
            
            terminStats[termin.dan].ukupno++;
            if (evidencija.status) {
              terminStats[termin.dan].prisutan++;
            } else {
              terminStats[termin.dan].odsutan++;
            }
          });
        });
      });

      const chartData = {
        labels: Object.keys(terminStats),
        datasets: [
          {
            label: 'Prisutan',
            data: Object.values(terminStats).map(stat => stat.prisutan),
            backgroundColor: 'rgba(76, 175, 80, 0.5)',
            borderColor: 'rgba(76, 175, 80, 1)',
            borderWidth: 1,
          },
          {
            label: 'Odsutan',
            data: Object.values(terminStats).map(stat => stat.odsutan),
            backgroundColor: 'rgba(244, 67, 54, 0.5)',
            borderColor: 'rgba(244, 67, 54, 1)',
            borderWidth: 1,
          },
        ],
      };

      return chartData;
    };

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
            <Card key={termin.id} className="termin-card">
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
            </Card>
          ))}
        </div>

        <div className="statistics-container">
          <Card className="statistics-card">
            <h3>Statistika prisustva po terminima</h3>
            <StatisticsChart 
              data={prepareStatisticsData()} 
              type="bar" 
              title={`Prisustvo za predmet ${trenutniPredmet.naziv}`}
            />
          </Card>
        </div>
      </div>
    );
  };

  // Komponenta za prikaz prisustva studenta
  const StudentEvidencija = () => {
    const svaEvidencija = predmeti.flatMap(predmet =>
      (predmet?.prisustva || []).map(prisustvo => ({
        predmetId: predmet?.predmet?.id ?? '',
        predmetNaziv: predmet?.predmet?.naziv ?? 'Nepoznat predmet',
        datum: prisustvo?.datum ?? '',
        status: prisustvo?.status ? "Prisutan" : "Odsutan",
        dan: prisustvo?.termin?.dan ?? '',
        vreme: prisustvo?.termin?.vreme ?? '',
        sala: prisustvo?.termin?.sala ?? '',
        tip_nastave: prisustvo?.termin?.tip_nastave ?? ''
      }))
    );

    const filtriraneEvidencije = svaEvidencija.filter(item =>
      (filterPredmet ? item.predmetNaziv === filterPredmet : true) &&
      (filterDatum ? item.datum === filterDatum : true) &&
      (filterStatus ? item.status === filterStatus : true)
    );

    const uniquePredmeti = [...new Set(svaEvidencija.map(item => item.predmetNaziv))];
    const uniqueDatumi = [...new Set(svaEvidencija.map(item => item.datum))].sort().reverse();

    // Dodajemo funkciju za pripremu podataka za statistiku
    const prepareStatisticsData = () => {
      const predmetiStats = {};
      
      svaEvidencija.forEach(item => {
        if (!predmetiStats[item.predmetNaziv]) {
          predmetiStats[item.predmetNaziv] = {
            prisutan: 0,
            odsutan: 0,
            ukupno: 0
          };
        }
        
        predmetiStats[item.predmetNaziv].ukupno++;
        if (item.status === "Prisutan") {
          predmetiStats[item.predmetNaziv].prisutan++;
        } else {
          predmetiStats[item.predmetNaziv].odsutan++;
        }
      });

      const chartData = {
        labels: Object.keys(predmetiStats),
        datasets: [
          {
            label: 'Prisutan',
            data: Object.values(predmetiStats).map(stat => stat.prisutan),
            backgroundColor: 'rgba(76, 175, 80, 0.5)',
            borderColor: 'rgba(76, 175, 80, 1)',
            borderWidth: 1,
          },
          {
            label: 'Odsutan',
            data: Object.values(predmetiStats).map(stat => stat.odsutan),
            backgroundColor: 'rgba(244, 67, 54, 0.5)',
            borderColor: 'rgba(244, 67, 54, 1)',
            borderWidth: 1,
          },
        ],
      };

      return chartData;
    };

    return (
      <>
        <div className="tabs">
          <Button 
            className={`tab-button ${activeTab === "prisustva" ? "active" : ""}`}
            onClick={() => setActiveTab("prisustva")}
            variant={activeTab === "prisustva" ? "primary" : "secondary"}
          >
            Moja prisustva
          </Button>
          <Button 
            className={`tab-button ${activeTab === "aktivni-termini" ? "active" : ""}`}
            onClick={() => setActiveTab("aktivni-termini")}
            variant={activeTab === "aktivni-termini" ? "primary" : "secondary"}
          >
            Aktivni termini
          </Button>
          <Button 
            className={`tab-button ${activeTab === "statistika" ? "active" : ""}`}
            onClick={() => setActiveTab("statistika")}
            variant={activeTab === "statistika" ? "primary" : "secondary"}
          >
            Statistika
          </Button>
        </div>

        {activeTab === "statistika" && (
          <div className="statistics-container">
            <Card className="statistics-card">
              <h3>Statistika prisustva po predmetima</h3>
              <StatisticsChart 
                data={prepareStatisticsData()} 
                type="bar" 
                title="Prisustvo po predmetima"
              />
            </Card>
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
              <>
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
                {lastPage > 1 && (
                  <div className="pagination">
                    <Button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      variant="secondary"
                    >
                      Prethodna
                    </Button>
                    <span className="page-info">
                      Strana {currentPage} od {lastPage}
                    </span>
                    <Button
                      onClick={nextPage}
                      disabled={currentPage === lastPage}
                      variant="secondary"
                    >
                      Sledeća
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <div className="aktivni-termini">
            <Button
              className="refresh-btn"
              onClick={fetchAktivniTermini}
              variant="secondary"
            >
              Osveži listu
            </Button>

            {aktivniTermini.length === 0 ? (
              <p className="no-results">Trenutno nema aktivnih termina.</p>
            ) : (
              <div className="termini-grid">
                {aktivniTermini.map(termin => (
                  <Card key={termin.id} className="termin-card">
                    <h3>{termin.predmet?.naziv ?? termin.naziv ?? 'Nepoznat predmet'}</h3>
                    <p>{termin.dan ?? termin.dan_u_nedelji ?? ''} {termin.vreme ?? (termin.vreme_pocetka ? `${termin.vreme_pocetka} - ${termin.vreme_zavrsetka}` : '')}</p>
                    <p>{termin.sala ?? ''} - {termin.tip_nastave ?? ''}</p>
                    {termin.evidentirano ? (
                      <Button className="evidentirano-btn" disabled variant="success">
                        Evidentirano
                      </Button>
                    ) : (
                      <Button
                        className="evidentiraj-btn"
                        onClick={() => evidentirajPrisustvo(termin.id)}
                        variant="primary"
                      >
                        Evidentiraj prisustvo
                      </Button>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </>
    );
  };

  if (loading) {
    return (
      <div className="evidencija-container">
        <div className="loading">Učitavanje...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="evidencija-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="evidencija-container">
      <h1>Evidencija prisustva</h1>
      {user?.role === "profesor" ? <ProfesorEvidencija /> : <StudentEvidencija />}
    </div>
  );
};

export default EvidencijaPage;
 