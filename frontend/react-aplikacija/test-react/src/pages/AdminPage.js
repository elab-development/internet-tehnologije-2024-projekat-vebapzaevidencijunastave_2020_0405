import React, { useState } from 'react';
import './AdminPage.css';
import StudentiManager from '../components/admin/StudentiManager';
import ProfesoriManager from '../components/admin/ProfesoriManager';
import PredmetiManager from '../components/admin/PredmetiManager';
import RasporediManager from '../components/admin/RasporediManager';
import TerminiManager from '../components/admin/TerminiManager';
import Card from '../components/Card';
import Button from '../components/Button';

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
        <Button 
          className={activeSection === 'dashboard' ? 'active' : ''} 
          onClick={() => setActiveSection('dashboard')}
          variant={activeSection === 'dashboard' ? 'primary' : 'secondary'}
        >
          Dashboard
        </Button>
        <Button 
          className={activeSection === 'studenti' ? 'active' : ''} 
          onClick={() => setActiveSection('studenti')}
          variant={activeSection === 'studenti' ? 'primary' : 'secondary'}
        >
          Studenti
        </Button>
        <Button 
          className={activeSection === 'profesori' ? 'active' : ''} 
          onClick={() => setActiveSection('profesori')}
          variant={activeSection === 'profesori' ? 'primary' : 'secondary'}
        >
          Profesori
        </Button>
        <Button 
          className={activeSection === 'predmeti' ? 'active' : ''} 
          onClick={() => setActiveSection('predmeti')}
          variant={activeSection === 'predmeti' ? 'primary' : 'secondary'}
        >
          Predmeti
        </Button>
        <Button 
          className={activeSection === 'rasporedi' ? 'active' : ''} 
          onClick={() => setActiveSection('rasporedi')}
          variant={activeSection === 'rasporedi' ? 'primary' : 'secondary'}
        >
          Rasporedi
        </Button>
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
          <Card 
            key={card.section} 
            className="dashboard-card"
            onClick={() => setActiveSection(card.section)}
          >
            <div className="card-icon">{card.icon}</div>
            <h3>{card.title}</h3>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
