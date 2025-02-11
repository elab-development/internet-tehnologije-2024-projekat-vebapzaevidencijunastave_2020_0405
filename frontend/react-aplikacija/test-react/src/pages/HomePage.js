import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  return (
    <div>
      <h1>Dobrodošli!</h1>
      <p>Izaberite opciju:</p>
      <div>
        <button onClick={() => navigate("/raspored")}>📅 Pogledaj Raspored</button>
        <button onClick={() => navigate("/evidencija")}>✅ Evidencija</button>
        <button onClick={() => navigate("/profil")}>👤 Profil</button>
        {role === "admin" && <button onClick={() => navigate("/admin")}>⚙ Admin Panel</button>}
      </div>
    </div>
  );
};

export default HomePage;

