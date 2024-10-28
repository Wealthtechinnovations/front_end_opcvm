"use client";
import { urlconstant } from "@/app/constants";
import { useSession } from 'next-auth/react';

import Link from "next/link";
import { Fragment, SetStateAction, useEffect, useState } from "react";
import Select from 'react-select';
//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import Header from "@/app/Header";
import { useRouter } from 'next/navigation';
import React from "react";
import Swal from "sweetalert2";
import ReactPaginate from 'react-paginate';

interface Funds {
  data: {
    portefeuille: any[]; // ou un type spécifique pour les éléments du tableau 'portefeuille'
  };
}

async function getAnomalie(societegestionParam: any) {
  const data = (

    await fetch(`${urlconstant}/api/getallfondsanomalie?pays=${societegestionParam}`, {
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
interface Fund {
  map(arg0: (fund: { id: any; societe_gestion: string | number | boolean | React.ReactPortal | React.PromiseLikeOfReactNode | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined; nom_fond: string | number | boolean | React.ReactPortal | React.PromiseLikeOfReactNode | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined; code_ISIN: string | number | boolean | React.ReactPortal | React.PromiseLikeOfReactNode | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined; dev_libelle: string | number | boolean | React.ReactPortal | React.PromiseLikeOfReactNode | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined; type_anomalie: string | number | boolean | React.ReactPortal | React.PromiseLikeOfReactNode | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined; }, idx: React.Key | null | undefined) => React.JSX.Element): React.ReactNode;
  dev_libelle: any;
  datejour: any;
  lastValue: any;
  categorie_national: any;
  id: any;
  code_ISIN: any;
  nom_fond: any;
  societe_gestion: any;
  type_anomalie: any;
  data: {
    ratios3a: {
      data: {
        volatility: any;
        maxDrawdown: any;
        betaBaiss: any;
        VAR95: any;
        info: any;
        perfAnnualisee: any
      };

    };
    performances: {
      data: {
        perfVeille: any;
        perf4Semaines: any;
        perf1erJanvier: any;
        perf1An: any;
        perf3Ans: any;
        perf5Ans: any;
        perf10Ans: any;
        adaptValues1: any;
        perfAnnualisee: any;
      }
    };
    funds: any[]; // ou un type spécifique pour les éléments du tableau 'funds'
    fundname: any;
    libelle_indice: any;
    lastDate: any;
    lastValue: any;
    lastdatepreviousmonth: any;
    libelle_fond: any;
    regulateur: any;
    sitewebregulateur: any;
    nomdelabourse: any;
    URLdelabourse: any;
    symboledevise: any;
    categorie_libelle: any;
    categorie_national: any;
    nom_gerant: any;
    categorie_globale: any;
    societe_gestion: any;
    categorie_regional: any;
    classification: any;
    type_investissement: any;
    pays: any;

  };
}
export default function Home(props: PageProps) {
  let societeconneted = props.searchParams.id;

  const router = useRouter();
  let id = props.searchParams.id;
  const [portefeuille, setPortefeuille] = useState<Funds | null>(null);
  const [activeTab, setActiveTab] = useState("tabAccueil");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [base100Data, setBase100Data] = useState([]); // Nouvel état pour les données en base 100


  const handleLinkClick = (item: any, typeAnomalie: any) => {
    let href;
    if (typeAnomalie === 'ANOMALIE VL') {
      // Rediriger l'utilisateur vers la page des détails pour les VL manquantes
      href = `/payspanel/anomalie/vlanomalie?id=${id}&fond=${item}`;
    } else {
      // Rediriger l'utilisateur vers une autre page pour d'autres types d'anomalies
      href = `/payspanel/fonds/detailsfond?societeconneted=${id}&Id=${item}`;
    }

    // Use the router.push method to navigate
    router.push(href);
  };




  const [performanceData, setPerformanceData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userConnected, setUserConnected] = useState<number | null>(null);
  const [fundsData, setFundsData] = useState<Fund[]>([]);


  useEffect(() => {
    // Appel à l'API lors du premier rendu du composant
    async function fetchData() {
      try {
        Swal.fire({
          title: 'Veuillez patienter',
          html: 'Chargement des résultats en cours...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        const data = await getAnomalie(societeconneted);


        setFundsData(data.data);

        console.log(data.data)

        Swal.close(); // Close the loading popup


      } catch (error) {
        Swal.close(); // Close the loading popup

        console.error("Erreur lors de l'appel à l'API :", error);
      }
    }
    fetchData();
  }, []);
  console.log("performanceData")

  console.log(performanceData)

  const handleLogout = () => {
    // Remove items from localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');

    // Optionally, perform any additional logout-related tasks

    // Redirect to the homepage or login page, assuming you are using React Router
    // You may need to adjust the route based on your application structure
    setTimeout(() => {
      router.push('/accueil'); // Replace '/other-page' with your desired page URL
    }, 200);
  };
  type ActiveSociete = string | null;

  // Initialize activeSociete with null
  const initialActiveSociete: ActiveSociete = null;

  // Use useState hook to manage the state
  const [activeSociete, setActiveSociete] = useState<ActiveSociete>(initialActiveSociete);


  const IconOpen = () => <span>&#x25BC;</span>; // Flèche vers le bas
  const IconClosed = () => <span>&#x25B6;</span>; // Flèche vers la droite
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Nombre d'éléments par page

  const pageCount = Math.ceil(fundsData.length / itemsPerPage);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * itemsPerPage;
  return (



    < Fragment >
      <Header />

      <aside className="main-sidebar">
        <section className="sidebar position-relative">
          <div className="multinav">
            <div className="multinav-scroll" style={{ height: '97%' }}>
              <ul className="sidebar-menu" data-widget="tree">

                <li>
                  <Link href={`/payspanel/pagehome?id=${societeconneted}`} >
                    <i data-feather="plus-square"></i>
                    <span>Tableau de bord</span>
                  </Link>
                </li>
                <li className={`dropdown ${isDropdownOpen ? 'open' : ''}`}>
                  <a href="#" onClick={toggleDropdown} className="dropdown-toggle" data-toggle="dropdown">
                    <i data-feather={isDropdownOpen ? "minus-square" : "plus-square"}></i>
                    <span>Fonds</span>
                  </a>
                  {isDropdownOpen && (
                    <>
                      <li>
                        <a href={`/payspanel/fondsvalide?id=${societeconneted}`}>   <i className="bi bi-check2"></i>
                          <span style={{ marginLeft: '55px' }}>Fonds validés</span></a>
                      </li>
                      <li>
                        <a href={`/payspanel/fonds?id=${societeconneted}`}>
                          <span style={{ marginLeft: '55px' }}>Fonds à validés</span></a>
                      </li>
                      <li>
                        <a href={`/payspanel/ajoutvl?id=${societeconneted}`}> <i data-feather={isDropdownOpen ? "minus-square" : "plus-square"}></i>
                          <span style={{ marginLeft: '55px' }}>Ajouter un fond</span></a>
                      </li>
                      <li>
                        <a href={`/payspanel/importfondvl?id=${societeconneted}`}> <i data-feather={isDropdownOpen ? "minus-square" : "plus-square"}></i>
                          <span style={{ marginLeft: '55px' }}>Importer Fonds et Vl</span></a>
                      </li>
                    </>
                  )}
                </li>


                <li>
                  <Link href={`/payspanel/anomalie?id=${societeconneted}`} style={{ backgroundColor: "#3b82f6", color: "white" }} >
                    <i data-feather="plus-square"></i>
                    <span>Anomalies</span>
                  </Link>
                </li>

                <li>
                  <Link href={`/payspanel/actualite?id=${societeconneted}`} >
                    <i data-feather="user"></i>
                    <span>Actualités</span>
                  </Link>
                </li>

                <li>
                  <Link href={`/accueil`}>
                    <i data-feather="user"></i>
                    <span>Se deconnecter</span>
                  </Link>
                </li>

                {/* <li>
                 On vérifie si l'utilisateur n'est pas connecté on affiche login sinon on affiche le bouton de deconnexion
                  {!userMetadata ? (
                    <a href="/auth/login">Login</a>
                  ) : (
                    <button onClick={logout} className='mt-2'>Deconnexion {currentUserEmail}</button>
                  )}


                </li>
 */}
                {/* ... (autres éléments du menu) */}
              </ul>

              <div className="sidebar-widgets">
                <div className="mx-25 mb-30 pb-20 side-bx bg-primary-light rounded20">
                  <div className="text-center">
                    <img src="../../../images/svg-icon/color-svg/custom-32.svg" className="sideimg p-5" alt="" />
                    <h4 className="title-bx text-primary">Panel Societe de gestion</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </aside>
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
                      <p><span className="text-primary">Liste des fonds avec anomalies</span> | <span className="text-fade"></span></p>

                    </div>

                  </div>
                  <hr />

                  <br />
                  <div className="box  text-align-center">
                    <div className="text-center">
                      <br />
                      <h4><span className="text-primary">Liste des Fonds</span></h4>
                    </div>
                    <div>

                      <table className="table">
                        <thead>
                          <tr>
                            <th>Nom du Fonds</th>
                            <th>Code ISIN</th>
                            <th>Devise</th>
                            <th>Type Anomaie</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fundsData.slice(offset, offset + itemsPerPage).map((fund, index) => (
                            <React.Fragment key={index}>

                              <tr key={index}>
                                <td>
                                  <Link href={`/Opcvm/${fund.id}`}>
                                    <p><span className="text-primary">{fund.nom_fond}</span></p>
                                  </Link>
                                </td>

                                <td><p><span className="text-fade">{fund.code_ISIN}</span></p></td>
                                <td><p className="mb-0">{fund.dev_libelle}</p></td>
                                <td><p className="mb-0">{fund.type_anomalie}</p></td>
                                <td>
                                  <button
                                    className="reconstitution-button"
                                    onClick={() => handleLinkClick(fund.id, fund.type_anomalie)}
                                  >
                                    Details
                                  </button>
                                </td>
                              </tr>
                            </React.Fragment>
                          ))}
                        </tbody>


                      </table>
                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>

                        <ReactPaginate
                          previousLabel={"Previous"}
                          nextLabel={"Next"}
                          breakLabel={"..."}
                          pageCount={pageCount}
                          marginPagesDisplayed={2}
                          pageRangeDisplayed={5}
                          onPageChange={handlePageClick}
                          containerClassName={"pagination"}
                          activeClassName={"active"}
                        />
                      </div>
                    </div>
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

    </Fragment >
  );
}