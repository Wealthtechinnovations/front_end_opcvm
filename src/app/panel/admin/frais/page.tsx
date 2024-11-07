"use client";
import { urlconstant } from "@/app/constants";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';


import Select from 'react-select';
//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import Header from '@/app/Header';
import Headermenu from "@/app/Headermenu";
import Sidebar from "@/app/sidebaradmin";
interface Funds {
  data: {
    frais: any[]; // ou un type spécifique pour les éléments du tableau 'funds'
  };
}

async function getFonds() {
  const data = (

    await fetch(`${urlconstant}/api/getfraisbyadmin`, {
      method: 'GET', // Assurez-vous que la méthode HTTP correspond à votre API
    })
  ).json();
  return data;
}
interface PageProps {
  searchParams: {
    selectedRows: any;
    id: any;
  };
}
export default function Fonds(props: PageProps) {
  let id = props.searchParams.id;
  const router = useRouter();

  const [funds, setFunds] = useState<Funds | null>(null);
  const [activeTab, setActiveTab] = useState("tabAccueil");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [base100Data, setBase100Data] = useState([]); // Nouvel état pour les données en base 100



  useEffect(() => {
    // Appel à l'API lors du premier rendu du composant
    async function fetchData() {
      try {

        const data = await getFonds();

        setFunds(data);




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

            <br />
            <div className="col-12">
              <div className="box ">
                <div className="box-body">
                  <div className="d-md justify-content-between align-items-center">
                    <div className="panel-heading p-b-0">
                      <div className="row row-no-gutters">
                        <div className="col-lg-12  text-center-xs p-t-1">
                          <h3>


                          </h3>
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
                      <p><span className="text-primary">Liste des frais</span> | <span className="text-fade"></span></p>

                    </div>
                    <div className="text-right">
                      <Link href={`/panel/admin/frais/createfrais?id=${id}`} style={{
                        textDecoration: 'none',
                        backgroundColor: '#6366f1',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '5px',
                      }}  >
                        Ajouter un frais

                      </Link>
                      <button

                      >
                      </button>
                    </div>


                  </div>
                  <hr />

                  <br />
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Nom du fond</th>
                        <th>Frais transaction Achat</th>
                        <th>Frais transaction Vente</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {funds?.data?.frais.map((item: any) => (
                        <tr key={item.id}>
                          <td>{item?.fond}</td>
                          <td>{item?.frais_transa_achat}</td>
                          <td>{item?.frais_transa_vente}</td>
                          <td>
                            <Link
                              className="btn btn-main active"
                              style={{ backgroundColor: "#3b82f6", color: "white", width: "150px" }} // Largeur fixe définie ici
                              href={{
                                pathname: '/admin/frais/updatefrais',
                                query: { fondId: item?.fond_id, id: id, fond: item?.fond },
                              }}
                            >
                              Mise à jour
                            </Link> &nbsp;


                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* <div className="table-responsive">

                    <table
                      id="example11"
                      className="table text-fade table-bordered table-hover display nowrap margin-top-10 w-p100">
                      <thead className="table-header">
                        <tr className="text-right">
                          <th className="text-right">Nom du fond </th>
                          <th className="text-right">Code ISIN</th>
                          <th className="text-right">Montant derniere VL</th>
                          <th className="text-right">Date de la derniere VL (Vl initiale)</th>
                          <th className="text-right">Date de création du fonds</th>
                          <th className="text-right">Periodicité</th>
                          <th className="text-right">Categorie</th>
                          <th className="text-right">Devise</th>
                          <th className="text-right">Action</th>



                        </tr>
                      </thead>
                      <tbody>
                        {funds?.data?.funds.map((item: any) => (
                          <tr className="text-right" key={item.id}>

                            <td className="text-left">{item?.nom_fond}</td>
                            <td>{item?.code_ISIN}</td>
                            <td>{item?.categorie_libelle}</td>
                            <td>{item?.dev_libelle}</td>

                            <td>{item?.datejour}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td> </td>

                          </tr>
                        ))}

                      </tbody>
                    </table>
                  </div>*/}



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