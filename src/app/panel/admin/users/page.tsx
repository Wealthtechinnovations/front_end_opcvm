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
import Swal from "sweetalert2";
import Headermenu from "@/app/Headermenu";
import Sidebar from "@/app/sidebaradmin";
interface Funds {
  data: {
    userss: any[]; // ou un type spécifique pour les éléments du tableau 'funds'
  };
}

async function getFonds() {
  const data = (

    await fetch(`${urlconstant}/api/getusersbyadmin`, {
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

  // Fonction pour gérer l'activation de l'utilisateur
  const handleActivateUser = async (userId: number) => {
    // Afficher une popup de confirmation avec SweetAlert2
    Swal.fire({
      title: 'Voulez-vous activer cet utilisateur ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, activer',
      cancelButtonText: 'Annuler',
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Appel API pour activer l'utilisateur
        try {
          const response = await fetch(`${urlconstant}/api/activate-user/${userId}`, {
            method: 'POST',
          });

          if (response.ok) {
            // Afficher une alerte de succès
            Swal.fire({
              title: 'Activé !',
              text: "L'utilisateur a été activé avec succès.",
              icon: 'success',
              confirmButtonText: 'OK',
            }).then(() => {
              router.refresh(); // Recharger la page actuelle
            });
          } else {
            throw new Error('Erreur lors de l\'activation');
          }
        } catch (error) {
          Swal.fire({
            title: 'Erreur',
            text: 'Une erreur est survenue lors de l\'activation de l\'utilisateur.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      }
    });
  };

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
                      <p><span className="text-primary">Liste des Utilisateurs</span> | <span className="text-fade"></span></p>

                    </div>
                   


                  </div>
                  <hr />

                  <br />
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Active</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {funds?.data?.userss.map((item: any) => (
                        <tr key={item.id}>
                          <td>{item?.email}</td>
                         
                          <td>{item?.active}</td>
                          <td>
                            {/* Bouton pour activer l'utilisateur */}
                            {item?.active === 0 && (
  <button
    className="btn btn-success"
    style={{ width: '150px' }}
    onClick={() => handleActivateUser(item.id)}
  >
    Activer
  </button>
)}

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