"use client";
import { urlconstant } from "@/app/constants";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";


import Select from 'react-select';
//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import Header from '@/app/Header';
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
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
export default function Fonds(props: PageProps) {
  let societeconneted = props.searchParams.id;

  let selectedValues = props.searchParams.selectedRows;
  const [funds, setFunds] = useState<Funds | null>(null);
  const [activeTab, setActiveTab] = useState("tabAccueil");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [base100Data, setBase100Data] = useState([]); // Nouvel état pour les données en base 100



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
        const data = await getFonds(societeconneted);

        setFunds(data);


        Swal.close(); // Close the loading popup


      } catch (error) {
        Swal.close(); // Close the loading popup

        console.error("Erreur lors de l'appel à l'API :", error);
      }
    }
    fetchData();
  }, []);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Nombre d'éléments par page

  const pageCount = funds?.data.funds ? Math.ceil(funds?.data.funds?.length / itemsPerPage) : 1;

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * itemsPerPage;
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
                <div className="col-xl-12 mb-4">
                    <div className="card text-center shadow-lg border-0 rounded-lg overflow-hidden">
                      <div className="card-body bg-gradient-to-b from-white to-blue-200 text-white p-5">
                        <img src="/images/avatar/avatar-13.png" className="bg-light rounded-circle avatar-lg img-thumbnail border-4 border-white mb-3" alt="profile-image" />
                        <h4 className="mb-0 mt-2 font-bold text-black-50">{societeconneted}</h4>

                      
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
                      <p><span className="text-primary">Liste de fonds</span> | <span className="text-fade"></span></p>
                      <h5 className="mb-4"><i className="mdi mdi-account-circle me-1"></i> (Completer Vos infos pour etre eligible d etre validé)</h5>

                    </div>

                  </div>
                  <hr />

                  <br />
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Nom du fond</th>
                        <th>Code ISIN</th>
                        <th>Catégorie</th>
                        <th>Devise</th>
                        <th>Date de dernière VL</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {funds?.data?.funds.slice(offset, offset + itemsPerPage).map((item: any) => (
                        <tr key={item.id}>
                          <td>{item?.nom_fond}</td>
                          <td>{item?.code_ISIN}</td>
                          <td>{item?.categorie_national}</td>
                          <td>{item?.dev_libelle}</td>
                          <td>{item?.datejour}</td>
                          <td>
                            <Link
                              className="btn btn-main active"
                              style={{ backgroundColor: "#3b82f6", color: "white", width: "150px" }} // Largeur fixe définie ici
                              href={{
                                pathname: '/panel/societegestionpanel/fondsavalide/updatefond',
                                query: { societeconneted: societeconneted, fondId: item?.id },
                              }}
                            >
                              Mise à jour du fond
                            </Link> &nbsp;
                            <Link
                              className="btn btn-main active"
                              style={{ backgroundColor: "#3b82f6", color: "white", width: "150px" }} // Largeur fixe définie ici
                              href={{
                                pathname: '/panel/societegestionpanel/fondsavalide/detailsfond',
                                query: { societeconneted: societeconneted, Id: item?.id },
                              }}
                            >
                              Détails
                            </Link>
                          </td>
                        </tr>
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
      </div>

    </Fragment >
  );
}