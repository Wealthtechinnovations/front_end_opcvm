// components/Sidebar.tsx
import Link from "next/link";
import { useState } from "react";

export default function Sidebar({ societeconneted }: { societeconneted: string }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <aside className="w-64 bg-blue-800 h-screen border-r border-gray-200 p-4 text-white fixed">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Gestion Panel</h1>
        <p className="text-sm text-gray-300">Bienvenue, <span className="font-semibold">Utilisateur</span></p>
      </div>
      <ul className="space-y-4">
        <li>
          <Link href={`/panel/societegestionpanel/pagehome?id=${societeconneted}`}>
            <button className="block py-3 px-4 bg-blue-700 rounded-lg hover:bg-blue-600 transition duration-300 shadow-md">
              Tableau de bord
            </button>
          </Link>
        </li>
        <li>
          <button
            onClick={toggleDropdown}
            className="w-full text-left py-3 px-4 bg-blue-700 rounded-lg hover:bg-blue-600 flex justify-between items-center transition duration-300 shadow-md"
          >
            <span>Fonds</span>
            <span>{isDropdownOpen ? '▲' : '▼'}</span>
          </button>
          {isDropdownOpen && (
            <ul className="pl-4 mt-2 space-y-2 text-sm">
              <li>
                <Link href={`/panel/societegestionpanel/fondsvalide?id=${societeconneted}`}>
                  <button className="block py-2 px-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition duration-300">Fonds validés</button>
                </Link>
              </li>
              <li>
                <Link href={`/panel/societegestionpanel/fonds?id=${societeconneted}`}>
                  <button className="block py-2 px-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition duration-300">Fonds à valider</button>
                </Link>
              </li>
              <li>
                <Link href={`/panel/societegestionpanel/ajoutvl?id=${societeconneted}`}>
                  <button className="block py-2 px-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition duration-300">Ajouter un fond</button>
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li>
          <Link href={`/panel/societegestionpanel/personnel?id=${societeconneted}`}>
            <button className="block py-3 px-4 bg-blue-700 rounded-lg hover:bg-blue-600 transition duration-300 shadow-md">
              Personnels
            </button>
          </Link>
        </li>
        {/* Ajoutez d'autres sections ici */}
      </ul>
    </aside>
  );
}
