"use client";
import { urlconstant } from "@/app/constants";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";


import Select from 'react-select';
//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import Header from '@/app/Header';
import Headermenu from "@/app/Headermenu";
import Sidebar from "@/app/sidebar";
interface Funds {
  data: {
    funds: any[]; // ou un type spécifique pour les éléments du tableau 'funds'
  };
}

async function getFonds(id: string) {
  const data = (

    await fetch(`${urlconstant}/api/getfondbyuser/${id}`, {
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
interface UserAndFund {
  nom: string;
  prenom: string;
  fond: string;
}
export default function Fonds(props: PageProps) {
  let societeconneted = props.searchParams.id;
  const [usersAndFunds, setUsersAndFunds] = useState<UserAndFund[]>([]);

  const [funds, setFunds] = useState<Funds | null>(null);



  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${urlconstant}/api/usersWithFunds`);
        const data = await response.json();
        setUsersAndFunds(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    }
    fetchData();
  }, []);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  return (




< Fragment >
      <div className="flex bg-gray-100">
        <Sidebar societeconneted={societeconneted} />
        <div className="flex-1 ml-64">
          <Headermenu />


          <div className="content-wrapper2">
            <div className="container-full">
              {/* Main content */}
              <section className="content">
                <div className="row">
                  <div className="col-xl-12 col-lg-12 mb-4">
                    <div className="card text-center shadow-lg border-0 rounded-lg overflow-hidden">
                      <div className="card-body bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-500 text-white">
                        <img src="/images/avatar/avatar-13.png" className="bg-light rounded-circle avatar-lg img-thumbnail border-4 border-white mb-3" alt="profile-image" />
                        <h4 className="mb-0 mt-2">{societeconneted}</h4>



                        <ul className="social-list list-inline mt-3 mb-0">
                          <li className="list-inline-item">
                            <a href="#" className="btn btn-social-icon btn-circle text-white bg-facebook hover:bg-facebook-dark">
                              <i className="fa fa-facebook"></i>
                            </a>
                          </li>
                          <li className="list-inline-item">
                            <a href="#" className="btn btn-social-icon btn-circle text-white bg-twitter hover:bg-twitter-dark">
                              <i className="fa fa-twitter"></i>
                            </a>
                          </li>
                          <li className="list-inline-item">
                            <a href="#" className="btn btn-social-icon btn-circle text-white bg-google hover:bg-google-dark">
                              <i className="fa fa-google"></i>
                            </a>
                          </li>
                          <li className="list-inline-item">
                            <a href="#" className="btn btn-social-icon btn-circle text-white bg-instagram hover:bg-instagram-dark">
                              <i className="fa fa-instagram"></i>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
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
                      <p><span className="text-primary">Liste des clients pour les fonds de la societé</span> | <span className="text-fade"></span></p>

                    </div>

                  </div>
                  <hr />

                  <br />
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Nom </th>
                        <th>Prenoms</th>
                        <th>Fonds</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersAndFunds.map((userAndFund, index) => (
                        <tr key={index}>
                          <td>{userAndFund.nom}</td>
                          <td>{userAndFund.prenom}</td>
                          <td>{userAndFund.fond}</td>
                          <td>Actions...</td>
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



            </div>

          </section>
        </div>

      </div >

      </div>
      </div>  </Fragment >
  );
}