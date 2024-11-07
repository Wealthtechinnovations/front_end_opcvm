// components/Sidebar.tsx
"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from 'next/navigation';
import router from "next/router";
import { magic } from "../../magic";
import Swal from "sweetalert2";

export default function Sidebar({ id }: { id: string }) {
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname(); // Obtenir le chemin actuel
const router=useRouter();
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userConnected, setUserConnected] = useState<number | null>(null);

  const timeoutRef = useRef(null); // Pour stocker l'ID du timer d'inactivité
  let timerInterval: string | number | NodeJS.Timeout | undefined; // Pour stocker l'ID du timer de compte à rebours de SweetAlert

  // Fonction pour réinitialiser le timer d'inactivité
  const resetInactivityTimeout = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current); // Annuler le précédent timer d'inactivité si existant
    timeoutRef.current = setTimeout(handleInactive, 360000) as unknown as null; // 6 minutes (360000ms)
  }, []);

  // Fonction appelée après 6 minutes d'inactivité
  const handleInactive = () => {
    Swal.fire({
      title: 'Déconnexion automatique',
      html: 'Vous serez déconnecté dans <b>60</b> secondes si vous ne cliquez pas sur le bouton pour rester connecté.<br><br><br><button id="stayConnected" >Rester connecté</button>',
      timer: 60000, // 1 minute de compte à rebours
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const b = Swal.getHtmlContainer()?.querySelector('b');
        const stayConnectedButton = document.getElementById('stayConnected');
        // Si l'utilisateur clique sur "Rester connecté"
        if (stayConnectedButton) {
          stayConnectedButton.addEventListener('click', () => {
            clearInterval(timerInterval); // Arrêtez également le timer de compte à rebours
            Swal.close(); // Fermer le pop-up SweetAlert
            resetInactivityTimeout(); // Réinitialiser le délai d'inactivité
          });
        }

        // Démarrer le compte à rebours visuel
        timerInterval = setInterval(() => {
          const timeLeft = Swal.getTimerLeft();
          if (timeLeft !== undefined && timeLeft > 0) {
            if (b) {
              b.textContent = (timeLeft / 1000).toFixed(0); // Affiche le temps restant en secondes
            }
          } else {
            clearInterval(timerInterval); // Nettoyage du timer une fois terminé
            handleLogout(); // Appeler la fonction de déconnexion ici
          }
        }, 1000);
      },
      willClose: () => {
        clearInterval(timerInterval); // Nettoyage si l'utilisateur ferme le pop-up manuellement
      }
    });
  };
  
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userId = localStorage.getItem('userId');

    console.log("isLoggedIn")
    if (isLoggedIn === 'true' && userId !== null) {
      // const userIdNumber = parseInt(userId, 10);
      // setIsLoggedIn(true);
      // setUserConnected(userIdNumber)
    } else {
      // If storedIsLoggedIn is null or any other value, set the state to false
      setIsLoggedIn(false);
    } console.log(isLoggedIn)
    if (!isLoggedIn) {
      router.push('/panel/societegestionpanel/login');
    }
   
  }, []);
  
  const handleLogout = async () => {
    // Remove items from localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    console.log("Utilisateur déconnecté avec succès.");

    if (magic && magic.auth) {
      await magic.user.logout();
      console.log("Utilisateur déconnecté avec succès.");
      // Si vous avez stocké le jeton quelque part (comme dans le localStorage), vous pouvez l'effacer ici.
    // localStorage.removeItem('didToken');
}
    
    setTimeout(() => {
      
      router.push('/accueil'); // Replace '/other-page' with your desired page URL
    }, 200);
  };

   // State pour gérer l'affichage de la sidebar
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const [isSidebarOpenanomalie, setIsSidebarOpenanomalie] = useState(false);

   // Fonction pour basculer l'affichage de la sidebar
   const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
   const toggleSidebaranomalie = () => setIsSidebarOpenanomalie(!isSidebarOpenanomalie);

   // Chemin de l'URL actuel
 
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
       <li>
    <Link href={`/panel/admin/home?id=${id}`}>
      <button
        className={`block w-full py-3 px-4 ${
          pathname.includes('/admin/home') ? 'bg-purple-500' : 'bg-indigo-500'
        } hover:bg-blue-500 text-white font-semibold rounded-lg shadow-md transition duration-300`}
      >
        Tableau de bord
      </button>
    </Link>
  </li>
  {/* Fonds Anomalies */}
     {/* Anomalies */}
     <li>
            <button
              onClick={toggleSidebaranomalie}
              className={`w-full text-left py-3 px-4 ${
                pathname.includes('/anomalie') ? 'bg-purple-500' : 'bg-indigo-500'
              } hover:bg-blue-500 text-white font-semibold rounded-lg flex justify-between items-center transition duration-300 shadow-md`}
            >
              <span>Anomalies</span>
              <span>{isSidebarOpenanomalie ? '▲' : '▼'}</span>
            </button>
            {/* Sous-menu (Dropdown) */}
            {isSidebarOpenanomalie && (
              <ul className="pl-4 mt-2 space-y-2 text-sm">
                <li>
                  <Link href={`/panel/admin/anomalie/vlanomalie?id=${id}`}>
                    <button
                      className={`block w-full py-2 px-2 ${
                        pathname.includes('/anomalie/vlanomalie') ? 'bg-purple-500' : 'bg-indigo-500'
                      } hover:bg-blue-500 text-white font-semibold rounded-lg shadow-md transition duration-300`}
                    >
                      Anomalies VL
                    </button>
                  </Link>
                </li>
                <li>
                  <Link href={`/panel/admin/anomalie/vlmanquante?id=${id}`}>
                    <button
                      className={`block w-full py-2 px-2 ${
                        pathname.includes('/anomalie/vlmanquante') ? 'bg-purple-500' : 'bg-indigo-500'
                      } hover:bg-blue-500 text-white font-semibold rounded-lg shadow-md transition duration-300`}
                    >
                      VL manquantes
                    </button>
                  </Link>
                </li>
              
              </ul>
            )}
          </li>

  {/* Fonds à valider */}
  <li>
    <Link href={`/panel/admin/fondsavalide?id=${id}`}>
      <button
        className={`block w-full py-3 px-4 ${
          pathname.includes('/admin/fondsavalide') ? 'bg-purple-500' : 'bg-indigo-500'
        } hover:bg-blue-500 text-white font-semibold rounded-lg shadow-md transition duration-300`}
      >
        Fonds à valider
      </button>
    </Link>
  </li>

  {/* Frais */}
  <li>
    <Link href={`/panel/admin/frais?id=${id}`}>
      <button
        className={`block w-full py-3 px-4 ${
          pathname.includes('/admin/frais') ? 'bg-purple-500' : 'bg-indigo-500'
        } hover:bg-blue-500 text-white font-semibold rounded-lg shadow-md transition duration-300`}
      >
        Frais
      </button>
    </Link>
  </li>

  {/* Users */}
  <li>
    <Link href={`/panel/admin/users?id=${id}`}>
      <button
        className={`block w-full py-3 px-4 ${
          pathname.includes('/admin/users') ? 'bg-purple-500' : 'bg-indigo-500'
        } hover:bg-blue-500 text-white font-semibold rounded-lg shadow-md transition duration-300`}
      >
        Users
      </button>
    </Link>
  </li>

  {/* Gestion des API */}
  <li>
    <Link href={`/panel/admin/gestionapi?id=${id}`}>
      <button
        className={`block w-full py-3 px-4 ${
          pathname.includes('/admin/gestionapi') ? 'bg-purple-500' : 'bg-indigo-500'
        } hover:bg-blue-500 text-white font-semibold rounded-lg shadow-md transition duration-300`}
      >
        Gestion des API
      </button>
    </Link>
  </li>

  {/* Mon compte */}
 
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
            <h4 className="text-lg font-bold mt-4">Panel Admin</h4>
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