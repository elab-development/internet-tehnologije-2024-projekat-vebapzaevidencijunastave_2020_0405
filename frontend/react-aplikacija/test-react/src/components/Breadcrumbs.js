import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Breadcrumbs.css';

const routeNameMap = {
  '': 'Početna',
  'admin': 'Admin',
  'studenti': 'Studenti',
  'profesori': 'Profesori',
  'predmeti': 'Predmeti',
  'evidencija': 'Evidencija',
  'raspored': 'Raspored',
  'profil': 'Profil',
  'login': 'Prijava',
  'register': 'Registracija',
  // Dodaj ostale rute po potrebi
};

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  // Ne prikazuj breadcrumbs na / i /home
  if (location.pathname === '/' || location.pathname === '/home') return null;

  return (
    <nav className="breadcrumbs">
      <Link to="/">Početna</Link>
      {pathnames.map((value, idx) => {
        const to = '/' + pathnames.slice(0, idx + 1).join('/');
        const isLast = idx === pathnames.length - 1;
        return (
          <span key={to}>
            {' > '}
            {isLast ? (
              <span>{routeNameMap[value] || value}</span>
            ) : (
              <Link to={to}>{routeNameMap[value] || value}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
} 