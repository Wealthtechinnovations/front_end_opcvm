"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from 'next/navigation';
import Swal from "sweetalert2";

interface SidebarLinkProps {
  href: string;
  label: string;
  pathMatch: string;
  sub?: boolean;
}

const SidebarLink = ({ href, label, pathMatch, sub }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname?.includes(pathMatch);
  return (
    <li>
      <Link href={href} style={{
        display: 'block',
        padding: sub ? '8px 12px 8px 24px' : '10px 16px',
        fontSize: sub ? '13px' : '14px',
        fontWeight: isActive ? 600 : 500,
        color: isActive ? '#FFFFFF' : '#4A5568',
        backgroundColor: isActive ? '#1B3A5C' : 'transparent',
        borderRadius: '8px',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      }}>
        {label}
      </Link>
    </li>
  );
};

export default function Sidebar({ id }: { id: string }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const timeoutRef = useRef(null);
  let timerInterval: string | number | NodeJS.Timeout | undefined;

  const resetInactivityTimeout = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(handleInactive, 360000) as unknown as null;
  }, []);

  const handleInactive = () => {
    Swal.fire({
      title: 'Déconnexion automatique',
      html: 'Vous serez déconnecté dans <b>60</b> secondes si vous ne cliquez pas sur le bouton pour rester connecté.<br><br><br><button id="stayConnected" >Rester connecté</button>',
      timer: 60000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const b = Swal.getHtmlContainer()?.querySelector('b');
        const stayConnectedButton = document.getElementById('stayConnected');
        if (stayConnectedButton) {
          stayConnectedButton.addEventListener('click', () => {
            clearInterval(timerInterval);
            Swal.close();
            resetInactivityTimeout();
          });
        }
        timerInterval = setInterval(() => {
          const timeLeft = Swal.getTimerLeft();
          if (timeLeft !== undefined && timeLeft > 0) {
            if (b) b.textContent = (timeLeft / 1000).toFixed(0);
          } else {
            clearInterval(timerInterval);
            handleLogout();
          }
        }, 1000);
      },
      willClose: () => { clearInterval(timerInterval); }
    });
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userId = localStorage.getItem('userId');
    if (isLoggedIn === 'true' && userId !== null) {
    } else {
      setIsLoggedIn(false);
    }
    if (!isLoggedIn) {
      router.push('/panel/investor/login');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    localStorage.removeItem('tokenEnCours');
    document.cookie = 'isLoggedIn=; path=/; max-age=0';
    document.cookie = 'tokenEnCours=; path=/; max-age=0';
    setTimeout(() => { router.push('/home'); }, 200);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div>
      <button
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={toggleSidebar}
        style={{
          padding: '10px 14px',
          backgroundColor: '#1B3A5C',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(27,58,92,0.3)',
        }}
      >
        {isSidebarOpen ? 'Fermer' : 'Menu'}
      </button>

      <aside
        className={`h-screen fixed z-40 transform transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
        style={{
          width: '256px',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E2E8F0',
          padding: '80px 16px 24px',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          overflowY: 'auto',
        }}
      >
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          <SidebarLink href="/panel/investor/dashboard" label="Portefeuille" pathMatch="/panel/investor/dashboard" />
          <SidebarLink href="/panel/investor/robot-advisor" label="Robot Advisor" pathMatch="/panel/investor/robot" />
          <SidebarLink href="/panel/investor/favorites" label="Favoris" pathMatch="/panel/investor/favorites" />
          <li>
            <button
              onClick={toggleDropdown}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '10px 16px',
                fontSize: '14px',
                fontWeight: (pathname?.includes('/panel/investor/profile') || pathname?.includes('/panel/investor/questionnaire')) ? 600 : 500,
                color: (pathname?.includes('/panel/investor/profile') || pathname?.includes('/panel/investor/questionnaire')) ? '#FFFFFF' : '#4A5568',
                backgroundColor: (pathname?.includes('/panel/investor/profile') || pathname?.includes('/panel/investor/questionnaire')) ? '#1B3A5C' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.2s ease',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              <span>Profil Investisseur</span>
              <span style={{ fontSize: '10px' }}>{isDropdownOpen ? '▲' : '▼'}</span>
            </button>
            {isDropdownOpen && (
              <ul style={{ listStyle: 'none', padding: '4px 0 0', margin: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <SidebarLink href="/panel/investor/profile" label="Profil" pathMatch="/panel/investor/profile" sub />
                <SidebarLink href="/panel/investor/questionnaire" label="Questionnaire" pathMatch="/panel/investor/questionnaire" sub />
              </ul>
            )}
          </li>
          <SidebarLink href="/panel/investor/kyc" label="KYC" pathMatch="/panel/investor/kyc" />
          <li style={{ marginTop: '16px', borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '10px 16px',
                fontSize: '14px',
                fontWeight: 500,
                color: '#DC2626',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              Se déconnecter
            </button>
          </li>
        </ul>

        <div style={{
          marginTop: '24px',
          padding: '20px 16px',
          background: 'linear-gradient(135deg, #1B3A5C, #2A5A8C)',
          borderRadius: '12px',
          textAlign: 'center',
        }}>
          <div style={{
            width: '40px', height: '40px', margin: '0 auto 12px',
            background: 'rgba(255,255,255,0.15)', borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', color: '#D4A843', fontWeight: 700,
          }}>F</div>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'white', margin: 0 }}>Panel Investisseur</h4>
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 lg:hidden"
          style={{ backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 30 }}
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}
