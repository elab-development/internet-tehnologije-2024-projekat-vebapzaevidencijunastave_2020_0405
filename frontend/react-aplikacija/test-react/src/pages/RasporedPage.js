import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RasporedPage.css";

const RasporedPage = () => {
  const [raspored, setRaspored] = useState([]);
  const [predmeti, setPredmeti] = useState([]);
  const [dani] = useState(["Ponedeljak", "Utorak", "Sreda", "Četvrtak", "Petak"]);
  const [filterPredmet, setFilterPredmet] = useState("");
  const [filterDan, setFilterDan] = useState("");
  const [filterSala, setFilterSala] = useState("");

  useEffect(() => {

    const testPodaci = [
      { predmet: "Matematika", dan: "Ponedeljak", vreme_pocetka: "08:00", vreme_zavrsetka: "10:00", sala: "A1" },
      { predmet: "Programiranje", dan: "Utorak", vreme_pocetka: "10:00", vreme_zavrsetka: "12:00", sala: "B2" },
      { predmet: "Baze podataka", dan: "Sreda", vreme_pocetka: "12:00", vreme_zavrsetka: "14:00", sala: "C3" }
    ];
    
    setRaspored(testPodaci);
  
    const uniquePredmeti = [...new Set(testPodaci.map(item => item.predmet))];
    setPredmeti(uniquePredmeti);


    // axios.get("http://localhost:8000/api/raspored")
    //   .then(response => {
    //     setRaspored(response.data);
    //     const uniquePredmeti = [...new Set(response.data.map(item => item.predmet))];
    //     setPredmeti(uniquePredmeti);
    //   })
    //   .catch(error => console.error("Greška prilikom dohvatanja podataka:", error));
  }, []);

  const filtriraniRaspored = raspored.filter(item => 
    (filterPredmet ? item.predmet === filterPredmet : true) &&
    (filterDan ? item.dan === filterDan : true) &&
    (filterSala ? item.sala.includes(filterSala) : true)
  );

  return (
    <div className="raspored-container">
      <h1>Raspored predavanja</h1>
      <div className="filter-container">
        <select value={filterPredmet} onChange={(e) => setFilterPredmet(e.target.value)}>
          <option value="">Svi predmeti</option>
          {predmeti.map(predmet => (
            <option key={predmet} value={predmet}>{predmet}</option>
          ))}
        </select>

        <select value={filterDan} onChange={(e) => setFilterDan(e.target.value)}>
          <option value="">Svi dani</option>
          {dani.map(dan => (
            <option key={dan} value={dan}>{dan}</option>
          ))}
        </select>

        <input 
          type="text" 
          placeholder="Pretraga po sali" 
          value={filterSala} 
          onChange={(e) => setFilterSala(e.target.value)}
        />
      </div>

      {filtriraniRaspored.length === 0 ? (
        <p className="no-results">Nema rezultata za zadate filtere.</p>
      ) : (
        <table className="raspored-table">
          <thead>
            <tr>
              <th>Predmet</th>
              <th>Dan</th>
              <th>Početak</th>
              <th>Kraj</th>
              <th>Sala</th>
            </tr>
          </thead>
          <tbody>
            {filtriraniRaspored.map((item, index) => (
              <tr key={index}>
                <td>{item.predmet}</td>
                <td>{item.dan}</td>
                <td>{item.vreme_pocetka}</td>
                <td>{item.vreme_zavrsetka}</td>
                <td>{item.sala}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RasporedPage;