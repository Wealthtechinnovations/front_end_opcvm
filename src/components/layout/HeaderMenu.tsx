'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Dropdown } from 'react-bootstrap';

interface PanelNavLinkProps {
  label: string;
  pathMatch: string;
  onClick: () => void;
}

const PanelNavLink: React.FC<PanelNavLinkProps> = ({ label, pathMatch, onClick }) => {
  const pathname = usePathname();
  const isActive = pathname?.includes(pathMatch);

  return (
    <li>
      <button
        onClick={onClick}
        style={{
          padding: '6px 14px',
          fontSize: '13px',
          fontWeight: isActive ? 600 : 500,
          color: isActive ? '#FFFFFF' : '#4A5568',
          backgroundColor: isActive ? '#1B3A5C' : 'transparent',
          border: '1px solid',
          borderColor: isActive ? '#1B3A5C' : '#E2E8F0',
          borderRadius: '6px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          whiteSpace: 'nowrap' as const,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        }}
      >
        {label}
      </button>
    </li>
  );
};

const Headermenu = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [userConnected, setUserConnected] = useState<number | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setUserConnected(parseInt(userId, 10));
    }
  }, []);

  const handleLinkClick = () => {
    if (userConnected !== null) {
      router.push('/panel/investor/dashboard');
    } else {
      router.push('/panel/management/login');
    }
  };

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 1000,
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #E2E8F0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: '280px',
      paddingRight: '24px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    }}>
      <nav role="navigation" style={{ width: '100%' }}>
        <ul style={{
          display: 'flex',
          listStyle: 'none',
          gap: '6px',
          margin: 0,
          padding: 0,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
          <PanelNavLink label="Accueil" pathMatch="/home" onClick={() => router.push('/home')} />
          <PanelNavLink label="Fonds" pathMatch="/funds/search" onClick={() => router.push('/funds/search')} />
          <PanelNavLink label="Soc. de gestion" pathMatch="/fund-managers" onClick={() => router.push('/fund-managers/search')} />
          <PanelNavLink label="Pays" pathMatch="/pays" onClick={() => router.push('/pays')} />
          <li>
            <Dropdown>
              <Dropdown.Toggle
                id="dropdown-services-panel"
                style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: '6px',
                  backgroundColor: pathname?.includes('/questionnaire') ? '#1B3A5C' : 'transparent',
                  color: pathname?.includes('/questionnaire') ? '#FFFFFF' : '#4A5568',
                  padding: '6px 14px',
                  fontSize: '13px',
                  fontWeight: pathname?.includes('/questionnaire') ? 600 : 500,
                  boxShadow: 'none',
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                Services
              </Dropdown.Toggle>
              <Dropdown.Menu style={{
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
                padding: '4px',
              }}>
                <Dropdown.Item href="/questionnaire/questionnaire/pre/question1" style={{ borderRadius: '4px', fontSize: '13px', color: '#4A5568' }}>Questionnaire court</Dropdown.Item>
                <Dropdown.Item href="/questionnaire/questionnaire/question1" style={{ borderRadius: '4px', fontSize: '13px', color: '#4A5568' }}>Profil investisseur (MIFID)</Dropdown.Item>
                <Dropdown.Item href="/panel/investor/questionnaire/Kyc_particulier/question1" style={{ borderRadius: '4px', fontSize: '13px', color: '#4A5568' }}>KYC</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
          <li>
            <Dropdown>
              <Dropdown.Toggle
                id="dropdown-tools-panel"
                style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: '6px',
                  backgroundColor: pathname?.includes('/tools') ? '#1B3A5C' : 'transparent',
                  color: pathname?.includes('/tools') ? '#FFFFFF' : '#4A5568',
                  padding: '6px 14px',
                  fontSize: '13px',
                  fontWeight: pathname?.includes('/tools') ? 600 : 500,
                  boxShadow: 'none',
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                Outils
              </Dropdown.Toggle>
              <Dropdown.Menu style={{
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
                padding: '4px',
              }}>
                <Dropdown.Item href="/tools/comparison" style={{ borderRadius: '4px', fontSize: '13px', color: '#4A5568' }}>Comparaison</Dropdown.Item>
                <Dropdown.Item href="/tools/search" style={{ borderRadius: '4px', fontSize: '13px', color: '#4A5568' }}>Sélection OPCVM</Dropdown.Item>
                <Dropdown.Item href="/tools/robot" style={{ borderRadius: '4px', fontSize: '13px', color: '#4A5568' }}>Robot Advisor</Dropdown.Item>
                <Dropdown.Item href="/tools/profile" style={{ borderRadius: '4px', fontSize: '13px', color: '#4A5568' }}>Profil investisseurs</Dropdown.Item>
                <Dropdown.Item href="/tools/education" style={{ borderRadius: '4px', fontSize: '13px', color: '#4A5568' }}>Éducation financière</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
          <PanelNavLink label="Actualités" pathMatch="/news" onClick={() => router.push('/news')} />
          <li>
            <Dropdown>
              <Dropdown.Toggle
                id="dropdown-connexion-panel"
                style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: '6px',
                  backgroundColor: pathname?.includes('/panel/management') ? '#1B3A5C' : 'transparent',
                  color: pathname?.includes('/panel/management') ? '#FFFFFF' : '#4A5568',
                  padding: '6px 14px',
                  fontSize: '13px',
                  fontWeight: pathname?.includes('/panel/management') ? 600 : 500,
                  boxShadow: 'none',
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                Connexion
              </Dropdown.Toggle>
              <Dropdown.Menu style={{
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
                padding: '4px',
              }}>
                <Dropdown.Item onClick={handleLinkClick} style={{ borderRadius: '4px', fontSize: '13px', color: '#4A5568' }}>Espace Membre</Dropdown.Item>
                <Dropdown.Item href="/panel/management/login" style={{ borderRadius: '4px', fontSize: '13px', color: '#4A5568' }}>Espace client</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
          <PanelNavLink label="Contact" pathMatch="/contact" onClick={() => router.push('/contact')} />
        </ul>
      </nav>
    </header>
  );
};

export default Headermenu;
