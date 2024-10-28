"use client";
import { urlconstant } from "@/app/constants";
import { useSession } from 'next-auth/react';

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import Select from 'react-select';
//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import Headermenu from '../../../Headermenu';
import Header from "@/app/Header";
import { useRouter } from 'next/navigation';
import { Dropdown } from "react-bootstrap";

interface Funds {
  data: {
    simulations: any[]; // ou un type spécifique pour les éléments du tableau 'portefeuille'
  };
}

async function getPortefeuille(id: any) {
  const data = (

    await fetch(`${urlconstant}/api/getsimulationbyuser/${id}`, {
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
export default function RobotAdvisor(props: PageProps) {

  const router = useRouter();
  let id = props.searchParams.id;
  const [portefeuille, setPortefeuille] = useState<Funds | null>(null);


  const handleLinkClick = (item: any) => {
    const href = `/panel/portefeuille/robotadvisor/portefeuillerobot?id=${id}&simulation=${item.id}`;

    // Use the router.push method to navigate
    router.push(href);
  };




  const [performanceData, setPerformanceData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userConnected, setUserConnected] = useState<number | null>(null);


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


  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  //////////////////


  return (



    < Fragment >
      <Header />

      <aside className="main-sidebar">
        <section className="sidebar position-relative">
          <div className="multinav">
            <div className="multinav-scroll" style={{ height: '97%' }}>
              <ul className="sidebar-menu" data-widget="tree">


                <li>
                  <Link href={`/panel/portefeuille/home?id=${id}`}>
                    <i data-feather="plus-square"></i>
                    <span>PorteFeuile</span>
                  </Link>
                </li>
                <li>
                  <a href={`/panel/portefeuille/robotadvisor?id=${id}`} style={{ backgroundColor: "#3b82f6", color: "white" }}>
                    <span style={{ marginLeft: '55px' }}>Robot Advisor</span></a>
                </li>
                <li>
                  <Link href={`/panel/portefeuille/fondfavoris?id=${id}`}>
                    <i data-feather="user"></i>
                    <span>Favoris</span>
                  </Link>
                </li>
                <li className={`dropdown ${isDropdownOpen ? 'open' : ''}`}>
                  <a href="#" onClick={toggleDropdown} className="dropdown-toggle" data-toggle="dropdown" >
                    <i data-feather={isDropdownOpen ? "minus-square" : "plus-square"}></i>
                    <span>Profil investisseur</span>
                  </a>
                  {isDropdownOpen && (
                    <>
                      <li>
                        <a href={`/panel/portefeuille/profile?id=${id}`}>   <i className="bi bi-check2"></i>
                          <span style={{ marginLeft: '55px' }}>Profil</span></a>
                      </li>
                      <li>
                        <a href={`/panel/portefeuille/questionnaire?id=${id}`}>
                          <span style={{ marginLeft: '55px' }}>Questionnaire</span></a>
                      </li>

                    </>
                  )}
                </li>
                <li>
                  <a href={`/panel/portefeuille/Kyc_particulier/question1?id=${id}`}>
                    <span style={{ marginLeft: '55px' }}>KYC</span></a>
                </li>
                <li>
                  <Link href="#" onClick={handleLogout}>
                    <i data-feather="user"></i>
                    <span>Se deconnecter</span>
                  </Link>
                </li>




                {/*     localStorage.removeItem('isLoggedIn');
 ... (autres éléments du menu) */}
              </ul>


              <div className="sidebar-widgets">
                <div className="mx-25 mb-30 pb-20 side-bx bg-primary-light rounded20">
                  <div className="text-center">
                    <img src="../../../images/svg-icon/color-svg/custom-32.svg" className="sideimg p-5" alt="" />
                    <h4 className="title-bx text-primary">Portefeuille Panel</h4>
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
                      <p><span className="text-primary">Liste de mes  simulations</span> | <span className="text-fade"></span></p>

                    </div>

                  </div>
                  <hr />
                  <div className="text-right">
                    <Link
                      className={`btn btn-main active}`}
                      style={{ backgroundColor: "#3b82f6", color: "white" }}
                      href={`/panel/portefeuille/robotadvisor/ajoutsimulation?id=${id}`}
                    >
                      Nouvelle simulation
                    </Link>
                  </div>
                  <br />
                  <div className="table-responsive">


                    <table id="example11" className="table text-fade table-bordered table-hover display nowrap margin-top-10 w-p100">
                      <thead className="table-header">
                        <tr className="">
                          <td className="text-center col-5">Nom </td>
                          <td className="text-center col-5">Description </td>
                          <th className="text-center col-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {portefeuille?.data?.simulations.map((item: any) => (
                          <tr className="" key={item.id}>
                            <td className="text-center">{item?.nom}</td>
                            <td className="text-center">{item?.description}</td>

                            <td>
                              <div className="action-buttons text-center">


                                <button style={{
                                  width: '150px',
                                }}
                                  className="reconstitution-button"
                                  onClick={() => handleLinkClick(item)}
                                >
                                  Voir
                                </button>

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

    </Fragment >
  );
}