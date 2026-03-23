'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button, Dropdown } from 'react-bootstrap';

interface NavButtonProps {
  label: string;
  pathMatch: string;
  href: string;
}

const NavButton: React.FC<NavButtonProps> = ({ label, pathMatch, href }) => {
  const pathname = usePathname();
  const isActive = pathname?.includes(pathMatch);

  return (
    <li className="nav-item">
      <Link
        href={href}
        className={`nav-btn ${isActive ? 'nav-btn-active' : ''}`}
        style={{
          width: '150px',
          backgroundColor: isActive ? '#3b82f6' : 'white',
          color: isActive ? 'white' : 'black',
          display: 'block',
          height: '100%',
          padding: '10px',
          textAlign: 'center',
          textDecoration: 'none',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          fontSize: '14px',
          fontWeight: 500,
        }}
      >
        {label}
      </Link>
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
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            width: '150px',
            backgroundColor: isActive ? '#3b82f6' : 'white',
            color: isActive ? 'white' : 'black',
            display: 'block',
            height: '100%',
            padding: '10px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 500,
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
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [userConnected, setUserConnected] = React.useState<number | null>(null);

  // Check user connection status from localStorage
  React.useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setUserConnected(parseInt(userId, 10));
    }
  }, []);

  return (
    <header className="bg-white text-white p-4 shadow-lg flex justify-between items-center sticky top-0 z-50">
      {/* Logo */}
      <Link href="/accueil" style={{ textDecoration: 'none', marginRight: '16px' }}>
        <span style={{ fontSize: '20px', fontWeight: 700, color: '#3b82f6' }}>
          Fund<span style={{ color: '#1e3a5f' }}>afrique</span>
        </span>
      </Link>

      {/* Desktop Navigation */}
      <nav role="navigation" className={menuOpen ? 'hidden md:block' : ''}>
        <ul
          className="sm sm-blue"
          style={{
            display: 'flex',
            listStyle: 'none',
            gap: '4px',
            margin: 0,
            padding: 0,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <NavButton
            label="Accueil"
            pathMatch="/accueil"
            href="/accueil"
          />
          <NavButton
            label="Fonds"
            pathMatch="/Opcvm"
            href="/Opcvm/recherche"
          />
          <NavButton
            label="Sociétés de gestion"
            pathMatch="/Fundmanager"
            href="/Fundmanager/recherche"
          />
          <NavButton
            label="Pays"
            pathMatch="/pays"
            href="/pays"
          />
          <NavDropdownMenu
            label="Services"
            pathMatch="/questionnaire"
            items={[
              { label: 'Questionnaire court', href: '/questionnaire/questionnaire/pre/question1' },
              { label: 'Profil investisseur (MIFID)', href: '/questionnaire/questionnaire/question1' },
              { label: 'KYC Particulier', href: '/panel/portefeuille/questionnaire/Kyc_particulier/question1' },
            ]}
          />
          <NavDropdownMenu
            label="Outils"
            pathMatch="/Outils"
            items={[
              { label: 'Comparaison de fonds', href: '/Outils/comparaison' },
              { label: 'Sélection OPCVM', href: '/Outils/recherche' },
              { label: 'Robot Advisor', href: '/panel/portefeuille/questionnaire/robotadvisor' },
            ]}
          />
          <NavButton
            label="Actualités"
            pathMatch="/actualite"
            href="/actualite"
          />
          <NavDropdownMenu
            label="Connexion"
            pathMatch="/panel"
            items={
              userConnected
                ? [
                    { label: 'Mon espace', href: `/panel/portefeuille/home?id=${userConnected}` },
                    { label: 'Espace société de gestion', href: '/panel/societegestionpanel/login' },
                  ]
                : [
                    { label: 'Espace investisseur', href: '/panel/portefeuille/login' },
                    { label: 'Espace société de gestion', href: '/panel/societegestionpanel/login' },
                  ]
            }
          />
          <NavButton
            label="Contact"
            pathMatch="/contact"
            href="/contact"
          />
        </ul>
      </nav>

      {/* Mobile menu toggle */}
      <div className="align-right md:hidden">
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{
            background: 'none',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            padding: '8px 12px',
            cursor: 'pointer',
            fontSize: '18px',
          }}
        >
          {menuOpen ? '\u2715' : '\u2630'}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav
          role="navigation"
          className="md:hidden"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            padding: '16px',
            zIndex: 100,
          }}
        >
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <NavButton label="Accueil" pathMatch="/accueil" href="/accueil" />
            <NavButton label="Fonds" pathMatch="/Opcvm" href="/Opcvm/recherche" />
            <NavButton label="Sociétés de gestion" pathMatch="/Fundmanager" href="/Fundmanager/recherche" />
            <NavButton label="Pays" pathMatch="/pays" href="/pays" />
            <NavButton label="Outils" pathMatch="/Outils" href="/Outils/comparaison" />
            <NavButton label="Actualités" pathMatch="/actualite" href="/actualite" />
            <NavButton label="Connexion" pathMatch="/panel" href="/panel/portefeuille/login" />
            <NavButton label="Contact" pathMatch="/contact" href="/contact" />
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
