"use client";
import { urlconstant } from "@/lib/constants";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import Select from 'react-select';
//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import Headermenu from '@/components/layout/HeaderMenu';
import { useRouter } from 'next/navigation';
import { useUserId } from '@/hooks/useUserId';
import Sidebar from '@/components/layout/PortfolioSidebar';

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
export default function RobotAdvisor() {

  const router = useRouter();
  const id = useUserId();
  const [portefeuille, setPortefeuille] = useState<Funds | null>(null);


  const handleLinkClick = (item: any) => {
    const href = `/panel/portfolio/robot-advisor/portefeuillerobot?simulation=${item.id}`;

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
                      <p><span className="text-primary">Liste de mes  simulations</span> | <span className="text-fade"></span></p>

                    </div>

                  </div>
                  <hr />
                  <div className="text-right">
                    <Link
                      className={`btn btn-main active}`}
                      style={{ backgroundColor: "#1B3A5C", color: "white" }}
                      href={`/panel/portfolio/robot-advisor/add-simulation`}
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
      </div>
      </div >
      </div >
    </Fragment >
  );
}