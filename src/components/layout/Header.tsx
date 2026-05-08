'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dropdown } from 'react-bootstrap';

interface NavLinkProps {
  label: string;
  pathMatch: string;
  href: string;
}

const NavLink: React.FC<NavLinkProps> = ({ label, pathMatch, href }) => {
  const pathname = usePathname();
  const isActive = pathname?.includes(pathMatch);

  return (
    <li>
      <Link
        href={href}
        style={{
          padding: '8px 14px',
          fontSize: '14px',
          fontWeight: isActive ? 600 : 500,
          color: isActive ? '#1B3A5C' : '#4A5568',
          textDecoration: 'none',
          borderRadius: '6px',
          transition: 'all 0.2s ease',
          position: 'relative',
          display: 'block',
          background: isActive ? '#EBF0F5' : 'transparent',
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
    <li>
      <Dropdown>
        <Dropdown.Toggle
          id={`dropdown-${pathMatch}`}
          style={{
            border: 'none',
            borderRadius: '6px',
            backgroundColor: isActive ? '#EBF0F5' : 'transparent',
            color: isActive ? '#1B3A5C' : '#4A5568',
            padding: '8px 14px',
            fontSize: '14px',
            fontWeight: isActive ? 600 : 500,
            boxShadow: 'none',
            transition: 'all 0.2s ease',
          }}
        >
          {label}
        </Dropdown.Toggle>
        <Dropdown.Menu style={{
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.06), 0 4px 10px rgba(0,0,0,0.04)',
          padding: '4px',
          marginTop: '4px',
        }}>
          {items.map((item, idx) => (
            <Dropdown.Item
              key={idx}
              href={item.href}
              style={{
                borderRadius: '4px',
                padding: '8px 12px',
                fontSize: '14px',
                color: '#4A5568',
              }}
            >
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

  React.useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setUserConnected(parseInt(userId, 10));
    }
  }, []);

  return (
    <header style={{
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #E2E8F0',
      padding: '0 32px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      {/* Logo */}
      <Link href="/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{
          width: '32px',
          height: '32px',
          background: 'linear-gradient(135deg, #1B3A5C, #2A5A8C)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 700,
          fontSize: '15px',
          fontFamily: 'Inter, sans-serif',
        }}>
          F
        </span>
        <span style={{
          fontSize: '18px',
          fontWeight: 700,
          fontFamily: 'Inter, sans-serif',
          color: '#1B3A5C',
          letterSpacing: '-0.01em',
        }}>
          Fund<span style={{ color: '#B8860B' }}>afrique</span>
        </span>
      </Link>

      {/* Desktop Navigation */}
      <nav role="navigation" className="hidden md:block">
        <ul style={{
          display: 'flex',
          listStyle: 'none',
          gap: '2px',
          margin: 0,
          padding: 0,
          alignItems: 'center',
        }}>
          <NavLink label="Accueil" pathMatch="/home" href="/home" />
          <NavLink label="OPCVM" pathMatch="/funds" href="/funds/search" />
          <NavLink label="Soc. de gestion" pathMatch="/fund-managers" href="/fund-managers/search" />
          <NavLink label="Pays" pathMatch="/pays" href="/pays" />
          <NavDropdownMenu
            label="Services"
            pathMatch="/questionnaire"
            items={[
              { label: 'Questionnaire court', href: '/questionnaire/questionnaire/pre/question1' },
              { label: 'Profil investisseur (MIFID)', href: '/questionnaire/questionnaire/question1' },
              { label: 'KYC Particulier', href: '/panel/investor/questionnaire/Kyc_particulier/question1' },
            ]}
          />
          <NavDropdownMenu
            label="Outils"
            pathMatch="/tools"
            items={[
              { label: 'Comparaison de fonds', href: '/tools/comparison' },
              { label: 'Sélection OPCVM', href: '/tools/search' },
              { label: 'Robot Advisor', href: '/panel/investor/questionnaire/robotadvisor' },
            ]}
          />
          <NavLink label="Actualités" pathMatch="/news" href="/news" />
          <NavDropdownMenu
            label="Connexion"
            pathMatch="/panel"
            items={
              userConnected
                ? [
                    { label: 'Mon espace', href: '/panel/investor/dashboard' },
                    { label: 'Espace société de gestion', href: '/panel/management/login' },
                  ]
                : [
                    { label: 'Espace investisseur', href: '/panel/investor/login' },
                    { label: 'Espace société de gestion', href: '/panel/management/login' },
                  ]
            }
          />
          <NavLink label="Contact" pathMatch="/contact" href="/contact" />
        </ul>
      </nav>

      {/* Mobile menu toggle */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{
            background: 'none',
            border: '1px solid #E2E8F0',
            borderRadius: '6px',
            padding: '8px 12px',
            cursor: 'pointer',
            fontSize: '18px',
            color: '#1B3A5C',
          }}
        >
          {menuOpen ? '✕' : '☰'}
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
            boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
            padding: '16px',
            zIndex: 100,
            borderBottom: '1px solid #E2E8F0',
          }}
        >
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <NavLink label="Accueil" pathMatch="/home" href="/home" />
            <NavLink label="OPCVM" pathMatch="/funds" href="/funds/search" />
            <NavLink label="Sociétés de gestion" pathMatch="/fund-managers" href="/fund-managers/search" />
            <NavLink label="Pays" pathMatch="/pays" href="/pays" />
            <NavLink label="Outils" pathMatch="/tools" href="/tools/comparison" />
            <NavLink label="Actualités" pathMatch="/news" href="/news" />
            <NavLink label="Connexion" pathMatch="/panel" href="/panel/investor/login" />
            <NavLink label="Contact" pathMatch="/contact" href="/contact" />
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
