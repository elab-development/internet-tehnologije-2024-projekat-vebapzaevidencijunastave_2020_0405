import React, { useState } from 'react';
import './AdminPage.css';
import StudentiManager from '../components/admin/StudentiManager';
import ProfesoriManager from '../components/admin/ProfesoriManager';
import PredmetiManager from '../components/admin/PredmetiManager';
import RasporediManager from '../components/admin/RasporediManager';
import TerminiManager from '../components/admin/TerminiManager';

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderSection = () => {
    switch (activeSection) {
      case 'studenti':
        return <StudentiManager />;
      case 'profesori':
        return <ProfesoriManager />;
      case 'predmeti':
        return <PredmetiManager />;
      case 'rasporedi':
        return <RasporediManager />;
      default:
        return <Dashboard setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="nav-brand">Admin Panel</div>
      </div>
      <nav className="admin-nav-horizontal">
        <button 
          className={activeSection === 'dashboard' ? 'active' : ''} 
          onClick={() => setActiveSection('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={activeSection === 'studenti' ? 'active' : ''} 
          onClick={() => setActiveSection('studenti')}
        >
          Studenti
        </button>
        <button 
          className={activeSection === 'profesori' ? 'active' : ''} 
          onClick={() => setActiveSection('profesori')}
        >
          Profesori
        </button>
        <button 
          className={activeSection === 'predmeti' ? 'active' : ''} 
          onClick={() => setActiveSection('predmeti')}
        >
          Predmeti
        </button>
        <button 
          className={activeSection === 'rasporedi' ? 'active' : ''} 
          onClick={() => setActiveSection('rasporedi')}
        >
          Rasporedi
        </button>
      </nav>
      <main className="admin-content">
        {renderSection()}
      </main>
    </div>
  );
};

// Dashboard komponenta sa karticama
const Dashboard = ({ setActiveSection }) => {
  const cards = [
    { title: 'Studenti', icon: '👨‍🎓', section: 'studenti' },
    { title: 'Profesori', icon: '👨‍🏫', section: 'profesori' },
    { title: 'Predmeti', icon: '📚', section: 'predmeti' },
    { title: 'Rasporedi', icon: '📅', section: 'rasporedi' }
  ];

  return (
    <div className="dashboard">
      <h1>Dobrodošli u Admin Panel</h1>
      <div className="dashboard-cards">
        {cards.map(card => (
          <div 
            key={card.section} 
            className="dashboard-card"
            onClick={() => setActiveSection(card.section)}
          >
            <div className="card-icon">{card.icon}</div>
            <h3>{card.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
