// components/DataRequesterSidebar.tsx
"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from 'next/navigation';
import Swal from "sweetalert2";

export default function DataRequesterSidebar() {
  const pathname = usePathname();
  const router = useRouter();
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
            if (b) {
              b.textContent = (timeLeft / 1000).toFixed(0);
            }
          } else {
            clearInterval(timerInterval);
            handleLogout();
          }
        }, 1000);
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    });
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    const userId = localStorage.getItem('userId');

    if (loggedIn === 'true' && userId !== null) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    if (!loggedIn) {
      router.push('/panel/data-requester/login');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    localStorage.removeItem('tokenEnCours');
    document.cookie = 'tokenEnCours=; path=/; max-age=0';
    document.cookie = 'isLoggedIn=; path=/; max-age=0';

    setTimeout(() => {
      router.push('/home');
    }, 200);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <aside className="bg-gradient-to-b from-white to-blue-200 h-screen border-r border-gray-300 p-4 text-white fixed z-50 ">
      <br />  <br />  <br />  <br />
      (
    <div>
      {/* Bouton hamburger pour afficher/masquer la sidebar sur mobile */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-blue-500 text-white p-3 rounded-md shadow-md"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? 'Masquer le menu' : 'Afficher le menu'}
      </button>

      {/* Sidebar */}
      <aside
        className={`bg-gradient-to-b from-white to-blue-200 h-screen border-r border-gray-300 p-2 text-white fixed z-40 transform transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:relative lg:w-64`}
      >
        <ul className="space-y-4">
          {/* Dashboard */}
          <li>
            <Link href={`/panel/data-requester/dashboard`}>
              <button
                className={`block w-full py-3 px-4 ${
                  pathname.includes('/data-requester/dashboard') ? 'bg-purple-500' : 'bg-indigo-500'
                } hover:bg-blue-500 text-white font-semibold rounded-lg shadow-md transition duration-300`}
              >
                Dashboard
              </button>
            </Link>
          </li>

          {/* Données */}
          <li>
            <Link href={`/panel/data-requester/data`}>
              <button
                className={`block w-full py-3 px-4 ${
                  pathname.includes('/data-requester/data') ? 'bg-purple-500' : 'bg-indigo-500'
                } hover:bg-blue-500 text-white font-semibold rounded-lg shadow-md transition duration-300`}
              >
                Données
              </button>
            </Link>
          </li>

          {/* Profil */}
          <li>
            <Link href={`/panel/data-requester/profile`}>
              <button
                className={`block w-full py-3 px-4 ${
                  pathname.includes('/data-requester/profile') ? 'bg-purple-500' : 'bg-indigo-500'
                } hover:bg-blue-500 text-white font-semibold rounded-lg shadow-md transition duration-300`}
              >
                Profil
              </button>
            </Link>
          </li>

          {/* Se déconnecter */}
          <li>
            <button
              onClick={handleLogout}
              className={`block w-full py-3 px-4 ${
                pathname === '/' ? 'bg-purple-500' : 'bg-indigo-500'
              } hover:bg-blue-500 text-white font-semibold rounded-lg shadow-md transition duration-300`}
            >
              Se déconnecter
            </button>
          </li>
        </ul>

        {/* Widgets supplémentaires */}
        <div className="sidebar-widgets mt-10">
          <div className="p-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg text-center text-white shadow-lg">
            <img src="../../../images/svg-icon/color-svg/custom-32.svg" className="sideimg mx-auto p-5" alt="Logo" />
            <h4 className="text-lg font-bold mt-4">Panel Data Requester</h4>
          </div>
        </div>
      </aside>
      </div>
      {/* Background overlay pour masquer la Sidebar en cliquant à l'extérieur */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </aside>
  );
}
