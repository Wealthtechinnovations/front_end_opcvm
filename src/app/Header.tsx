'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button, Dropdown } from 'react-bootstrap';
import { urlsite } from './constants';

interface NavButtonProps {
  label: string;
  pathMatch: string;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ label, pathMatch, onClick }) => {
  const pathname = usePathname();
  const isActive = pathname?.includes(pathMatch);

  return (
    <li className="nav-item">
      <Button
        onClick={onClick}
        className={`nav-btn ${isActive ? 'nav-btn-active' : ''}`}
        style={{
          width: '150px',
          backgroundColor: isActive ? '#3b82f6' : 'white',
          color: isActive ? 'white' : 'black',
          display: 'block',
          height: '100%',
          padding: '10px',
          textDecoration: 'none',
          border: '1px solid #000',
          borderRadius: '5px',
          cursor: 'pointer',
          transition: 'background-color 0.3s',
        }}
      >
        {label}
      </Button>
    </li>
  );
};

interface NavDropdownProps {
  label: string;
  pathMatch: string;
  items: { label: string; href: string }[];
}

const NavDropdownMenu: React.FC<NavDropdownProps> = ({ label, pathMatch, items }) => {
  const pathname = usePathname();
  const isActive = pathname?.includes(pathMatch);

  return (
    <li className="nav-item">
      <Dropdown>
        <Dropdown.Toggle
          id={`dropdown-${pathMatch}`}
          style={{
            border: '1px solid #000',
            borderRadius: '5px',
            width: '150px',
            backgroundColor: isActive ? '#3b82f6' : 'white',
            color: isActive ? 'white' : 'black',
            display: 'block',
            height: '100%',
            padding: '10px',
            textDecoration: 'none',
          }}
        >
          {label}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {items.map((item, idx) => (
            <Dropdown.Item key={idx} href={item.href}>
              {item.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </li>
  );
};

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = React.useState(false);
  const [userConnected, setUserConnected] = React.useState<number | null>(null);

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const handleLinkClick = () => {
    if (userConnected !== null) {
      navigateTo(`/panel/portefeuille/home?id=${userConnected}`);
    } else {
      navigateTo('/panel/societegestionpanel/login');
    }
  };

  return (
    <header className="bg-white text-white p-6 shadow-lg flex justify-between items-center sticky top-0 z-50">
      <nav role="navigation" className={menuOpen ? 'hidden' : ''}>
        <ul className={`sm sm-blue ${menuOpen ? 'open' : ''}`} style={{ display: 'flex', listStyle: 'none', gap: '4px', margin: 0, padding: 0 }}>
          <NavButton
            label="Accueil"
            pathMatch="/accueil"
            onClick={() => navigateTo('/accueil')}
          />
          <NavButton
            label="Fonds"
            pathMatch="/Opcvm"
            onClick={() => navigateTo(`${urlsite}/Opcvm/recherche`)}
          />
          <NavButton
            label="Societe de gestion"
            pathMatch="/Fundmanager"
            onClick={() => navigateTo('/Fundmanager/recherche')}
          />
          <NavButton
            label="Pays"
            pathMatch="/pays"
            onClick={() => navigateTo('/pays')}
          />
          <NavDropdownMenu
            label="Services"
            pathMatch="/Service"
            items={[
              { label: 'Questionnaire cours', href: '/questionnaire/questionnaire/pre/question1' },
              { label: 'Profil investisseur (MIFID)', href: '/questionnaire/questionnaire/question1' },
              { label: 'KYC', href: '#' },
            ]}
          />
          <NavDropdownMenu
            label="Outils"
            pathMatch="/Outils"
            items={[
              { label: 'Comparaison', href: '/Outils/comparaison' },
              { label: 'Selection OPCVM', href: '/Outils/recherche' },
              { label: 'Robot Advisor', href: '/Outils/robot' },
              { label: 'Profil investisseurs', href: '/Outils/profil' },
              { label: 'Éducation financière', href: '/Outils/education' },
            ]}
          />
          <NavButton
            label="Actualités"
            pathMatch="/actualite"
            onClick={() => navigateTo('/actualite')}
          />
          <NavDropdownMenu
            label="Connexion"
            pathMatch="/societegestionpanel"
            items={[
              { label: 'Espace Membre', href: '#' },
              { label: 'Espace client', href: '/societegestionpanel/login' },
            ]}
          />
          <NavButton
            label="Contact"
            pathMatch="/contact"
            onClick={() => navigateTo('/contact')}
          />
        </ul>
      </nav>
      <div className="align-right">
        <input
          id="main-menu-state"
          type="checkbox"
          checked={menuOpen}
          onChange={() => setMenuOpen(!menuOpen)}
        />
        <label className="main-menu-btn" htmlFor="main-menu-state">
          <span className="main-menu-btn-icon"></span> Toggle main menu visibility
        </label>
      </div>
    </header>
  );
};

export default Header;
