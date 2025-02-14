// import React, { useState, useEffect, useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import "./RasporedPage.css";
// import rasporedPozadina from "../assets/rasporedPozadina.png";

// const RasporedPage = () => {
//   const { user } = useContext(AuthContext);
//   const [raspored, setRaspored] = useState([]);
//   const [predmeti, setPredmeti] = useState([]);
//   const [dani] = useState(["Ponedeljak", "Utorak", "Sreda", "Četvrtak", "Petak"]);
//   const [filterPredmet, setFilterPredmet] = useState("");
//   const [filterDan, setFilterDan] = useState("");
//   const [filterSala, setFilterSala] = useState("");
//   const [selectedTermin, setSelectedTermin] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     const testPodaci = [
//       { id: 1, predmet: "Matematika", dan: "Ponedeljak", vreme_pocetka: "08:00", vreme_zavrsetka: "10:00", sala: "A1" },
//       { id: 2, predmet: "Programiranje", dan: "Utorak", vreme_pocetka: "10:00", vreme_zavrsetka: "12:00", sala: "B2" },
//       { id: 3, predmet: "Baze podataka", dan: "Sreda", vreme_pocetka: "12:00", vreme_zavrsetka: "14:00", sala: "C3" }
//     ];
    
//     setRaspored(testPodaci);
//     const uniquePredmeti = [...new Set(testPodaci.map(item => item.predmet))];
//     setPredmeti(uniquePredmeti);
//   }, []);



//   const handleRowClick = (termin) => {
//     setSelectedTermin(termin);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedTermin(null);
//   };

//   const handlePrijava = () => {
//     alert(`Uspešno ste se prijavili na termin: ${selectedTermin.predmet} (${selectedTermin.dan}, ${selectedTermin.vreme_pocetka})`);
//     setIsModalOpen(false);
//   };

//   const filtriraniRaspored = raspored.filter(item => 
//     (filterPredmet ? item.predmet === filterPredmet : true) &&
//     (filterDan ? item.dan === filterDan : true) &&
//     (filterSala ? item.sala.includes(filterSala) : true)
//   );

//   return (
//     <div className="raspored-container">
//       <div className="background-overlay" style={{ backgroundImage: `url(${rasporedPozadina})` }}></div>
//       <div className="content-wrapper">
//         <h1>Raspored predavanja</h1>
//         <div className="filter-container">
//           <select value={filterPredmet} onChange={(e) => setFilterPredmet(e.target.value)}>
//             <option value="">Svi predmeti</option>
//             {predmeti.map(predmet => (
//               <option key={predmet} value={predmet}>{predmet}</option>
//             ))}
//           </select>
//           <select value={filterDan} onChange={(e) => setFilterDan(e.target.value)}>
//             <option value="">Svi dani</option>
//             {dani.map(dan => (
//               <option key={dan} value={dan}>{dan}</option>
//             ))}
//           </select>
//           <input type="text" placeholder="Pretraga po sali" value={filterSala} onChange={(e) => setFilterSala(e.target.value)} />
//         </div>

//         {filtriraniRaspored.length === 0 ? (
//           <p className="no-results">Nema rezultata za zadate filtere.</p>
//         ) : (
//           <table className="raspored-table">
//             <thead>
//               <tr>
//                 <th>Predmet</th>
//                 <th>Dan</th>
//                 <th>Početak</th>
//                 <th>Kraj</th>
//                 <th>Sala</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtriraniRaspored.map((item, index) => (
//                 <tr key={index} onClick={() => handleRowClick(item)} className="clickable-row">
//                   <td>{item.predmet}</td>
//                   <td>{item.dan}</td>
//                   <td>{item.vreme_pocetka}</td>
//                   <td>{item.vreme_zavrsetka}</td>
//                   <td>{item.sala}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}

//         {isModalOpen && selectedTermin && (
//           <div className="modal-overlay">
//             <div className="modal-content">
//               <h2>Prijava na termin</h2>
//               <p><strong>Predmet:</strong> {selectedTermin.predmet}</p>
//               <p><strong>Dan:</strong> {selectedTermin.dan}</p>
//               <p><strong>Vreme:</strong> {selectedTermin.vreme_pocetka} - {selectedTermin.vreme_zavrsetka}</p>
//               <p><strong>Sala:</strong> {selectedTermin.sala}</p>
//               <hr />
//               <h3>Podaci o studentu</h3>
//               <p><strong>Ime i prezime:</strong> {user?.ime} {user?.prezime}</p>
//               <p><strong>Broj indeksa:</strong> {user?.broj_indeksa}</p>
//               <button className="prijava-button" onClick={handlePrijava}>Prijavi se</button>
//               <button className="close-button" onClick={handleCloseModal}>Zatvori</button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RasporedPage;

// import React, { useState, useEffect, useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import "./RasporedPage.css";
// import rasporedPozadina from "../assets/rasporedPozadina.png";

// const RasporedPage = () => {
//   const { user } = useContext(AuthContext);
//   const [raspored, setRaspored] = useState([]);
//   const [predmeti, setPredmeti] = useState([]);
//   const [dani] = useState(["Ponedeljak", "Utorak", "Sreda", "Četvrtak", "Petak"]);
//   const [filterPredmet, setFilterPredmet] = useState("");
//   const [filterDan, setFilterDan] = useState("");
//   const [filterSala, setFilterSala] = useState("");
//   const [selectedTermin, setSelectedTermin] = useState(null);

//   useEffect(() => {
//     const testPodaci = [
//       { id: 1, predmet: "Matematika", dan: "Ponedeljak", vreme_pocetka: "08:00", vreme_zavrsetka: "10:00", sala: "A1" },
//       { id: 2, predmet: "Programiranje", dan: "Utorak", vreme_pocetka: "10:00", vreme_zavrsetka: "12:00", sala: "B2" },
//       { id: 3, predmet: "Baze podataka", dan: "Sreda", vreme_pocetka: "12:00", vreme_zavrsetka: "14:00", sala: "C3" }
//     ];
    
//     setRaspored(testPodaci);
//     const uniquePredmeti = [...new Set(testPodaci.map(item => item.predmet))];
//     setPredmeti(uniquePredmeti);
//   }, []);

//   const handleRowClick = (termin) => {
//     setSelectedTermin(termin);
//     const popUp = window.open("", "_blank", "width=400,height=500");
//     if (popUp) {
//       popUp.document.write(`
//         <html>
//         <head>
//           <title>Prijava na termin</title>
//           <style>
//             body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
//             .container { width: 100%; }
//             h2 { color: #4CAF50; }
//             .info { margin-bottom: 15px; }
//             .prijava-button {
//               background-color: #4CAF50; color: white; padding: 10px 15px; border: none;
//               cursor: pointer; border-radius: 5px; margin-top: 10px;
//             }
//             .prijava-button:hover { background-color: #3e8e41; }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <h2>Prijava na termin</h2>
//             <p class="info"><strong>Predmet:</strong> ${termin.predmet}</p>
//             <p class="info"><strong>Dan:</strong> ${termin.dan}</p>
//             <p class="info"><strong>Vreme:</strong> ${termin.vreme_pocetka} - ${termin.vreme_zavrsetka}</p>
//             <p class="info"><strong>Sala:</strong> ${termin.sala}</p>
//             <hr />
//             <h3>Student:</h3>
//             <p class="info"><strong>Ime i prezime:</strong> ${user?.ime} ${user?.prezime}</p>
//             <p class="info"><strong>Broj indeksa:</strong> ${user?.broj_indeksa}</p>
//             <button class="prijava-button" onclick="alert('Uspešno ste se prijavili!'); window.close();">Prijavi se</button>
//           </div>
//         </body>
//         </html>
//       `);
//     }
//   };

//   const filtriraniRaspored = raspored.filter(item => 
//     (filterPredmet ? item.predmet === filterPredmet : true) &&
//     (filterDan ? item.dan === filterDan : true) &&
//     (filterSala ? item.sala.toLowerCase().includes(filterSala.toLowerCase()) : true)
//   );

//   return (
//     <div className="raspored-container">
//       <div className="background-overlay" style={{ backgroundImage: `url(${rasporedPozadina})` }}></div>
//       <div className="content-wrapper">
//         <h1>Raspored predavanja</h1>
//         <div className="filter-container">
//           <select value={filterPredmet} onChange={(e) => setFilterPredmet(e.target.value)}>
//             <option value="">Svi predmeti</option>
//             {predmeti.map(predmet => (
//               <option key={predmet} value={predmet}>{predmet}</option>
//             ))}
//           </select>
//           <select value={filterDan} onChange={(e) => setFilterDan(e.target.value)}>
//             <option value="">Svi dani</option>
//             {dani.map(dan => (
//               <option key={dan} value={dan}>{dan}</option>
//             ))}
//           </select>
//           <input type="text" placeholder="Pretraga po sali" value={filterSala} onChange={(e) => setFilterSala(e.target.value)} />
//         </div>

//         {filtriraniRaspored.length === 0 ? (
//           <p className="no-results">Nema rezultata za zadate filtere.</p>
//         ) : (
//           <table className="raspored-table">
//             <thead>
//               <tr>
//                 <th>Predmet</th>
//                 <th>Dan</th>
//                 <th>Početak</th>
//                 <th>Kraj</th>
//                 <th>Sala</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtriraniRaspored.map((item, index) => (
//                 <tr key={index} onClick={() => handleRowClick(item)} className="clickable-row">
//                   <td>{item.predmet}</td>
//                   <td>{item.dan}</td>
//                   <td>{item.vreme_pocetka}</td>
//                   <td>{item.vreme_zavrsetka}</td>
//                   <td>{item.sala}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RasporedPage;

import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./RasporedPage.css";
import rasporedPozadina from "../assets/rasporedPozadina.png";

const RasporedPage = () => {
  const { user } = useContext(AuthContext);
  const [raspored, setRaspored] = useState([]);
  const [predmeti, setPredmeti] = useState([]);
  const [dani] = useState(["Ponedeljak", "Utorak", "Sreda", "Četvrtak", "Petak"]);
  const [filterPredmet, setFilterPredmet] = useState("");
  const [filterDan, setFilterDan] = useState("");
  const [filterSala, setFilterSala] = useState("");
  const [selectedTermin, setSelectedTermin] = useState(null);

  useEffect(() => {
    const testPodaci = [
      { id: 1, predmet: "Matematika", dan: "Ponedeljak", vreme_pocetka: "08:00", vreme_zavrsetka: "10:00", sala: "A1" },
      { id: 2, predmet: "Programiranje", dan: "Utorak", vreme_pocetka: "10:00", vreme_zavrsetka: "12:00", sala: "B2" },
      { id: 3, predmet: "Baze podataka", dan: "Sreda", vreme_pocetka: "12:00", vreme_zavrsetka: "14:00", sala: "C3" }
    ];
    
    setRaspored(testPodaci);
    const uniquePredmeti = [...new Set(testPodaci.map(item => item.predmet))];
    setPredmeti(uniquePredmeti);
  }, []);

  const filtriraniRaspored = raspored.filter(item => 
    (filterPredmet ? item.predmet === filterPredmet : true) &&
    (filterDan ? item.dan === filterDan : true) &&
    (filterSala ? item.sala.toLowerCase().includes(filterSala.toLowerCase()) : true)
  );

  const handleRowClick = (termin) => {
    setSelectedTermin(termin);
    const popUp = window.open("", "_blank", "width=400,height=500,left=500,top=200");
    if (popUp) {
      popUp.document.write(`
        <html>
        <head>
          <title>Prijava na termin</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 20px; background-size: cover; }
            .container { width: 100%; background: rgba(255, 255, 255, 0.95); padding: 20px; border-radius: 10px; background-image: url('${rasporedPozadina}'); background-size: cover; background-position: center; }
            h2 { color: #4CAF50; }
            .info { margin-bottom: 15px; }
            .prijava-button {
              background-color: #4CAF50; color: white; padding: 10px 15px; border: none;
              cursor: pointer; border-radius: 5px; margin-top: 10px;
            }
            .prijava-button:hover { background-color: #3e8e41; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Prijava na termin</h2>
            <p class="info"><strong>Predmet:</strong> ${termin.predmet}</p>
            <p class="info"><strong>Dan:</strong> ${termin.dan}</p>
            <p class="info"><strong>Vreme:</strong> ${termin.vreme_pocetka} - ${termin.vreme_zavrsetka}</p>
            <p class="info"><strong>Sala:</strong> ${termin.sala}</p>
            <hr />
            <h3>Student:</h3>
            <p class="info"><strong>Ime i prezime:</strong> ${user?.ime} ${user?.prezime}</p>
            <p class="info"><strong>Broj indeksa:</strong> ${user?.broj_indeksa}</p>
            <button class="prijava-button" onclick="alert('Uspešno ste se prijavili!'); window.close();">Prijavi se</button>
          </div>
        </body>
        </html>
      `);
    }
  };

  return (
    <div className="raspored-container" style={{ backgroundColor: "#d0dfd3" }}>
      <div className="content-wrapper" style={{ backgroundImage: `url(${rasporedPozadina})`, backgroundSize: "cover", backgroundPosition: "center" }}>
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
          <input type="text" placeholder="Pretraga po sali" value={filterSala} onChange={(e) => setFilterSala(e.target.value)} />
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
                <tr key={index} onClick={() => handleRowClick(item)} className="clickable-row">
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
    </div>
  );
};

export default RasporedPage;
