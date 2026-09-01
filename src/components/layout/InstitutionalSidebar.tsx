"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname } from 'next/navigation';

interface SidebarLinkProps {
  href: string;
  label: string;
  pathMatch: string;
}

const SidebarLink = ({ href, label, pathMatch }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname?.includes(pathMatch);
  return (
    <li>
      <Link href={href} style={{
        display: 'block',
        padding: '10px 16px',
        fontSize: '14px',
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

export default function InstitutionalSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    localStorage.removeItem('tokenEnCours');
    document.cookie = 'isLoggedIn=; path=/; max-age=0';
    document.cookie = 'tokenEnCours=; path=/; max-age=0';
    setTimeout(() => { router.push('/home'); }, 200);
  };

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
          <SidebarLink href="/panel/institutional/dashboard" label="Dashboard" pathMatch="/panel/institutional/dashboard" />
          <SidebarLink href="/panel/institutional/favorites" label="Favoris" pathMatch="/panel/institutional/favorites" />
          <SidebarLink href="/panel/institutional/profile" label="Profil" pathMatch="/panel/institutional/profile" />
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
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'white', margin: 0 }}>Panel Institutionnel</h4>
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
