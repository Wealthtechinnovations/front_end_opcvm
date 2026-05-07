"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname } from 'next/navigation';

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

    setTimeout(() => {
      router.push('/home');
    }, 200);
  };

  return (
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
        <ul className="space-y-4 mt-16 lg:mt-4">
          {/* Dashboard */}
          <li>
            <Link href="/panel/institutional/dashboard">
              <button
                className={`block w-full py-3 px-4 ${
                  pathname.includes('/panel/institutional/dashboard') ? 'bg-purple-500' : 'bg-indigo-500'
                } hover:bg-blue-500 text-white font-semibold rounded-lg shadow-md transition duration-300`}
              >
                Dashboard
              </button>
            </Link>
          </li>

          {/* Favoris */}
          <li>
            <Link href="/panel/institutional/favorites">
              <button
                className={`block w-full py-3 px-4 ${
                  pathname.includes('/panel/institutional/favorites') ? 'bg-purple-500' : 'bg-indigo-500'
                } hover:bg-blue-500 text-white font-semibold rounded-lg shadow-md transition duration-300`}
              >
                Favoris
              </button>
            </Link>
          </li>

          {/* Profil */}
          <li>
            <Link href="/panel/institutional/profile">
              <button
                className={`block w-full py-3 px-4 ${
                  pathname.includes('/panel/institutional/profile') ? 'bg-purple-500' : 'bg-indigo-500'
                } hover:bg-blue-500 text-white font-semibold rounded-lg shadow-md transition duration-300`}
              >
                Profil
              </button>
            </Link>
          </li>

          {/* Se deconnecter */}
          <li>
            <button
              onClick={handleLogout}
              className="block w-full py-3 px-4 bg-indigo-500 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-md transition duration-300"
            >
              Se déconnecter
            </button>
          </li>
        </ul>

        {/* Widget bottom */}
        <div className="sidebar-widgets mt-10">
          <div className="p-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg text-center text-white shadow-lg">
            <h4 className="text-lg font-bold mt-4">Panel Institutionnel</h4>
          </div>
        </div>
      </aside>

      {/* Background overlay pour masquer la Sidebar en cliquant à l'extérieur */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
}
