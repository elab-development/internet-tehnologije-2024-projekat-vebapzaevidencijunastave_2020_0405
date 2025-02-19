import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./EvidencijaPage.css";
import rasporedPozadina from "../assets/rasporedPozadina.png";
 
const EvidencijaPage = () => {
  const { user } = useContext(AuthContext);
  const [evidencije, setEvidencije] = useState([]);
  const [filterPredmet, setFilterPredmet] = useState("");
  const [filterDatum, setFilterDatum] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
 
  useEffect(() => {
    const testEvidencije = [
      { id: 1, ime: "Ana", prezime: "Jovanović", broj_indeksa: "2021/001", predmet: "Matematika", datum: "2024-02-10", vreme: "08:00", sala: "A1", status: "Prisutan" },
      { id: 2, ime: "Marko", prezime: "Petrović", broj_indeksa: "2021/002", predmet: "Programiranje", datum: "2024-02-11", vreme: "10:00", sala: "B2", status: "Odsutan" },
      { id: 3, ime: "Ivana", prezime: "Nikolić", broj_indeksa: "2021/003", predmet: "Baze podataka", datum: "2024-02-12", vreme: "12:00", sala: "C3", status: "Prisutan" }
    ];
   
    setEvidencije(
      user?.role === "student"
        ? testEvidencije.filter(item => item.broj_indeksa === user.broj_indeksa)
        : testEvidencije
    );
  }, [user]);
 
  const filtriraneEvidencije = evidencije.filter(item =>
    (filterPredmet ? item.predmet === filterPredmet : true) &&
    (filterDatum ? item.datum === filterDatum : true) &&
    (filterStatus ? item.status === filterStatus : true)
  );
 
  return (
    <div className="evidencija-container" style={{ backgroundImage: `url(${rasporedPozadina})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <h1>Evidencije prisustva</h1>
      <div className="filter-container">
        <select value={filterPredmet} onChange={(e) => setFilterPredmet(e.target.value)}>
          <option value="">Svi predmeti</option>
          {[...new Set(evidencije.map(item => item.predmet))].map(predmet => (
            <option key={predmet} value={predmet}>{predmet}</option>
          ))}
        </select>
        <input type="date" value={filterDatum} onChange={(e) => setFilterDatum(e.target.value)} />
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
              <th>Ime</th>
              <th>Prezime</th>
              <th>Broj indeksa</th>
              <th>Predmet</th>
              <th>Datum</th>
              <th>Vreme</th>
              <th>Sala</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtriraneEvidencije.map((item, index) => (
              <tr key={index} className={item.status === "Prisutan" ? "prisutan" : "odsutan"}>
                <td>{item.ime}</td>
                <td>{item.prezime}</td>
                <td>{item.broj_indeksa}</td>
                <td>{item.predmet}</td>
                <td>{item.datum}</td>
                <td>{item.vreme}</td>
                <td>{item.sala}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
 
export default EvidencijaPage;
 