"use client";
import { urlconstant } from "@/app/constants";
import { useSession } from 'next-auth/react';
import {Fragment, useState, useEffect, useCallback, useRef } from 'react';
import Swal from 'sweetalert2';
import Link from "next/link";
import Select from 'react-select';
//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import Header from "@/app/Header";
import { useRouter } from 'next/navigation';
import { Dropdown } from "react-bootstrap";
import { magic } from "../../../../../magic";
import Sidebar from "@/app/sidebarportefeuille";
import Headermenu from "@/app/Headermenu";

interface Funds {
  data: {
    portefeuille: any[]; // ou un type spécifique pour les éléments du tableau 'portefeuille'
  };
}

async function getPortefeuille(id: any) {
  const data = (

    await fetch(`${urlconstant}/api/getportefeuillebyuser/${id}`, {
      method: 'GET', // Assurez-vous que la méthode HTTP correspond à votre API
    })
  ).json();
  return data;
}
interface PageProps {
  searchParams: {
    id: any;
  };
}
export default function Home(props: PageProps) {

  const router = useRouter();
  let id = props.searchParams.id;
  const [portefeuille, setPortefeuille] = useState<Funds | null>(null);
  const [activeTab, setActiveTab] = useState("tabAccueil");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [base100Data, setBase100Data] = useState([]); // Nouvel état pour les données en base 100

  const handleLinkClick = (item: any) => {
    const href = `/panel/portefeuille/portefeuillereconstitution?id=${id}&selectedValuename=${item?.funds}&selectedfund=${item?.fundids}&portefeuille=${item.id}`;

    // Use the router.push method to navigate
    router.push(href);
  };

  const handleLinkClickrobot = (item: any) => {
    const href = `/panel/portefeuille/portefeuillerobot?id=${id}&selectedValuename=${item?.funds}&selectedfund=${item?.fundids}&portefeuille=${item.id}`;

    // Use the router.push method to navigate
    router.push(href);
  };


  const getperformancep = async (portefeuilleId: any) => {
    try {
      // Use transactionData to filter transactions with the given fundId
      const response6 = await fetch(`${urlconstant}/api/portefeuillebase100/${portefeuilleId}`);
      const data6 = await response6.json();
      const totalinvest = data6?.data.investissement;
      const plusmoinsvalue = data6?.data.plusmoinsvalue
      return ((plusmoinsvalue.toFixed(2)) / totalinvest.toFixed(2)) * 100;
    } catch (error) {
      console.error('Error fetching performance data:', error);
      throw error; // Propagate the error if needed
    }
  };

  const [performanceData, setPerformanceData] = useState([]);
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
            logout(); // Appeler la fonction de déconnexion ici
          }
        }, 1000);
      },
      willClose: () => {
        clearInterval(timerInterval); // Nettoyage si l'utilisateur ferme le pop-up manuellement
      }
    });
  };

  // Fonction de déconnexion (à personnaliser selon votre logique de déconnexion)
  const logout = async () => {
    // Implémentez ici la logique de déconnexion
       // Remove items from localStorage
       localStorage.removeItem('isLoggedIn');
       localStorage.removeItem('userId');
        if (magic && magic.auth) {
          await magic.user.logout();
          console.log("Utilisateur déconnecté avec succès.");
          // Si vous avez stocké le jeton quelque part (comme dans le localStorage), vous pouvez l'effacer ici.
        // localStorage.removeItem('didToken');
    }
       // Optionally, perform any additional logout-related tasks
   
       // Redirect to the homepage or login page, assuming you are using React Router
       // You may need to adjust the route based on your application structure
       setTimeout(() => {
         router.push('/accueil'); // Replace '/other-page' with your desired page URL
       }, 200);
    // Rediriger ou déconnecter l'utilisateur
  };

  // Effet qui démarre le timer d'inactivité à l'initialisation et réinitialise le timer à chaque mouvement ou touche
  useEffect(() => {
    resetInactivityTimeout(); // Démarrer le délai initial lors du rendu initial

    document.addEventListener('mousemove', resetInactivityTimeout); // Détecter l'activité de la souris
    document.addEventListener('keydown', resetInactivityTimeout); // Détecter l'activité du clavier

    return () => {
      // Nettoyer les événements et les timers lorsque le composant est démonté
      document.removeEventListener('mousemove', resetInactivityTimeout);
      document.removeEventListener('keydown', resetInactivityTimeout);
      if (timeoutRef.current) clearTimeout(timeoutRef.current); // Nettoyer le timer d'inactivité
      if (timerInterval) clearInterval(timerInterval); // Nettoyer le timer de compte à rebours
    };
  }, [resetInactivityTimeout]);


  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userId = localStorage.getItem('userId');

    console.log("isLoggedIn")
    if (isLoggedIn === 'true' && userId !== null) {
      const userIdNumber = parseInt(userId, 10);
      setIsLoggedIn(true);
      setUserConnected(userIdNumber)
    } else {
      // If storedIsLoggedIn is null or any other value, set the state to false
      setIsLoggedIn(false);
    } console.log(isLoggedIn)
    if (!isLoggedIn) {
      router.push('/portefeuille/login');
    }
    const fetchData = async () => {
      try {
        const response = await fetch(`${urlconstant}/api/portefeuillebase100s`);
        const data = await response.json();
        setPerformanceData(data.data.portefeuilleDatas);
      } catch (error) {
        console.error('Error fetching performance data:', error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    // Appel à l'API lors du premier rendu du composant
    async function fetchData() {
      try {

        const data = await getPortefeuille(id);

        setPortefeuille(data);




      } catch (error) {
        console.error("Erreur lors de l'appel à l'API :", error);
      }
    }
    fetchData();
  }, []);
  console.log("performanceData")

  console.log(performanceData)

  const handleLogout = async () => {
    // Remove items from localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    if (magic && magic.auth) {
      await magic.user.logout();
      console.log("Utilisateur déconnecté avec succès.");
      // Si vous avez stocké le jeton quelque part (comme dans le localStorage), vous pouvez l'effacer ici.
    // localStorage.removeItem('didToken');
}
    // Optionally, perform any additional logout-related tasks

    // Redirect to the homepage or login page, assuming you are using React Router
    // You may need to adjust the route based on your application structure
    setTimeout(() => {
      
      router.push('/accueil'); // Replace '/other-page' with your desired page URL
    }, 200);
  };


  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  //////////////////


  return (

    < Fragment >
    <div className="flex bg-gray-100">
      <Sidebar id={id} />
      <div className="flex-1 ml-64">
        <Headermenu />
      <div className="content-wrapper2">
        <div className="container-full">
          {/* Main content */}
          <section className="content">

            <div className="col-12">
              <div className="box ">
                <div className="box-body">
                  <div className="d-md justify-content-between align-items-center">
                    <div className="panel-heading p-b-0">
                      <div className="row row-no-gutters">
                        <div className="col-lg-12  text-center-xs p-t-1">

                        </div>

                        <div className="col-lg-2 col-md-2 col-sm-3 col-xs-12 text-center p-l-1 p-t-1" data-toggle="tooltip" data-placement="top" data-original-title="" title="">
                          <div style={{ display: 'inline-block' }} title="42 / 100 au 31/08/2023">
                            <div className="spritefonds sprite-3g icon-med" style={{ display: 'inline-block' }}></div>
                            <div className="notation-appix">

                            </div>
                          </div>
                        </div>


                      </div>
                    </div>
                    <div>
                      <p><span className="text-primary">Liste de mes  portefeuilles</span> | <span className="text-fade"></span></p>

                    </div>

                  </div>
                  <hr />
                  <div className="text-right">
                    <Link
                      className={`btn btn-main active}`}
                      style={{ backgroundColor: "#3b82f6", color: "white" }}
                      href={`/panel/portefeuille/ajoutportefeuille?id=${id}`}
                    >
                      Creer un portefeuille
                    </Link>
                  </div>
                  <br />
                  <div className="table-responsive">


                    <table id="example11" className="table text-fade table-bordered table-hover display nowrap margin-top-10 w-p100">
                      <thead className="table-header">
                        <tr className="">
                          <td className="text-center col-3">Nom du portefeuille </td>
                          <td className="text-center col-3">Horizon / Classe d actif </td>
                          <th className="text-center col-3">Type portefeuille </th>
                          <th className="text-center col-2">Perf origine </th>
                          <th className="text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {portefeuille?.data?.portefeuille.map((item: any) => (
                          <tr className="" key={item.id}>
                            <td className="text-center">{item?.nom_portefeuille}</td>
                            <td className="text-center">{item?.portefeuilletype == 'Robot advisor' ? item?.horizon : item?.categorie}</td>
                            <td className="text-center">{item?.portefeuilletype}</td>
                            <td className={(() => {
                              const matchingPort = [...performanceData].reverse().filter((port: { portefeuille_id: number; plusmoinsvalue: number; investissement: number }) => port.portefeuille_id === parseInt(item.id));
                              console.log(matchingPort.length);

                              if (matchingPort.length > 0) {
                                const firstPort = matchingPort[matchingPort.length - 1];
                                const lastPort = matchingPort[0];

                                const { plus_moins_value: firstPlusMoinsValue, investissement: firstInvestissement, valeur_portefeuille: firstValeurPortefeuille } = firstPort;
                                const { plus_moins_value: lastPlusMoinsValue, investissement: lastInvestissement, valeur_portefeuille: lastValeurPortefeuille } = lastPort;

                                console.log(firstValeurPortefeuille, lastValeurPortefeuille);

                                const calculatedValue = ((lastValeurPortefeuille - firstValeurPortefeuille) / firstValeurPortefeuille) * 100;
                                if (calculatedValue < 0) {
                                  return 'text-danger text-center'; // Apply a CSS class for red text
                                } else {
                                  return 'text-success text-center'; // Apply a CSS class for green text
                                }
                              } else {
                                return 'n-a'; // Apply a default class if there is no match
                              }
                            })()}>
                              {(() => {
                                console.log(performanceData);

                                const matchingPort = [...performanceData].reverse().filter((port: { portefeuille_id: number; plusmoinsvalue: number; investissement: number }) => port.portefeuille_id === parseInt(item.id));
                                console.log(matchingPort.length);

                                if (matchingPort.length > 0) {
                                  const firstPort = matchingPort[matchingPort.length - 1];
                                  const lastPort = matchingPort[0];

                                  const { plus_moins_value: firstPlusMoinsValue, investissement: firstInvestissement, base_100_bis: firstValeurPortefeuille } = firstPort;
                                  const { plus_moins_value: lastPlusMoinsValue, investissement: lastInvestissement, base_100_bis: lastValeurPortefeuille } = lastPort;

                                  console.log(firstValeurPortefeuille, lastValeurPortefeuille);

                                  const calculatedValue = ((lastValeurPortefeuille - firstValeurPortefeuille) / firstValeurPortefeuille) * 100;
                                  return calculatedValue.toFixed(2) + '%';
                                } else {
                                  return '0 %'; // or any default value if there is no match
                                }
                              })()}
                            </td>
                            <td>
                              <div className="action-buttons">
                                <Link
                                  href={{
                                    pathname: '/portefeuille/fondsselected',
                                    query: { id: id, selectedValuename: item?.funds, selectedfund: item?.fundids, portefeuille: item.id },
                                  }}
                                >
                                  <button className="select-funds-button" style={{
                                    width: '150px',
                                  }} >selectionner les fonds</button>
                                </Link>

                                {item?.fundids?.length > 0 &&
                                  (item?.portefeuilletype == 'Robot advisor' ? (
                                    <button
                                      style={{
                                        width: '150px',
                                      }}
                                      className="apply-robot-button"
                                      onClick={() => handleLinkClickrobot(item)}
                                    >
                                      Appliquer le Robot advisor
                                    </button>
                                  ) : (
                                    <button style={{
                                      width: '150px',
                                    }}
                                      className="reconstitution-button"
                                      onClick={() => handleLinkClick(item)}
                                    >
                                      Reconstitution
                                    </button>
                                  ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>


                  </div>



                  {/*<div>
                    <label htmlFor="textInput">Autre champ :</label>
                    <input
                      className="form-control"
                      type="text"
                      id="textInput"
                    />
                  </div>*/ }
                  <br></br>

                </div>


              </div>



            </div>





          </section>
        </div>

      </div >
      </div >
      </div >
    </Fragment >
  );
}