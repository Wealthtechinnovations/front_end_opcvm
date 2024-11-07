"use client";
import { urlconstant, urlstableconstant, API_KEY_STABLECOIN } from "@/app/constants";


import Link from "next/link";
import { Fragment, SetStateAction, useEffect, useState } from "react";
import Select from 'react-select';


//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
//import { router } from 'next/router';
import Header from '@/app/Header';
import Router from 'next/router';
import { magic } from "../../../../../magic";
import Sidebar from "@/app/sidebarportefeuille";
import Headermenu from "@/app/Headermenu";

const options = [
  { value: 1, label: 'Option 1' },
  { value: 2, label: 'Option 2' },
  { value: 3, label: 'Option 3' },
  // Ajoutez plus d'options au besoin
];

interface Pays {
  value: any[]; // ou un type spécifique pour les éléments du tableau 'funds'

}

interface PageProps {
  searchParams: {
    selectedfund: any;
    portefeuille: any;
    selectedValuename: any;
    id: any
  };
}
async function getlastvl1() {

  const data = (
    await fetch(`${urlconstant}/api/searchFunds`)
  ).json();
  return data;
}
interface Option {
  value: string;
}
interface QuizMifidOfUser {
  userId: string;
  commentGlobal: any;
  commentPartOne: any;
  commentPartTwo: any;
  categoryPartOne: any;
  commentPartFive: any;
  categoryPartFive: any;
  categoryPartTwo: any;
  commentPartThree: any;
  categoryPartThree: any;
  commentPartFour: any;
  categoryPartFour: any;
  commentPartSix: any;
  categoryPartSix: any;
  commentPartSeven: any;
  categoryPartSeven: any;
  commentPartHeight: any;
  categoryPartHeight: any;


  durationInvestment: any;
  fundtype: any;
  volatilityPortfolioTarget: any;
  // Autres propriétés...
}
export default function Profile(props: PageProps) {
  let id = props.searchParams.id;

  let response: globalThis.Response;
  const handleSearch = (e: any) => {
    e.preventDefault();
    // Effectuez votre recherche ici si nécessaire
  };

  const [mifidForUser, setQuizMifidOfUser] = useState<QuizMifidOfUser | null>(null);

  // States de tab
  const [toggleState, setToggleState] = useState(1);
  const toggleTab = (index: SetStateAction<number>) => {
    setToggleState(index);
  };


  useEffect(() => {
    // Appel à l'API lors du premier rendu du composant
    async function fetchData() {
      try {
        const token = localStorage.getItem('tokenEnCours');
        //const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQ4LCJpc0FkbWluIjowLCJpYXQiOjE3MTE5NjI2ODcsImV4cCI6MTcxMjEzNTQ4N30.wiEHhYxqY0NtgxwUVGUYOD2vHih381Qf3KQh4_2CU2w";

        const result = await fetch(`${urlstableconstant}/api/mifid/find-quiz-mifid-of-user`, {
          headers: {
            'x-api-key': API_KEY_STABLECOIN, // Utiliser directement la variable sans ${}
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await result.json();
        setQuizMifidOfUser(data);
      } catch (error) {
        console.error('Error fetching user quiz:', error);
      }
    }

    fetchData();
  }, []); // Dépendance vide pour n'exécuter l'effet qu'une seule fois lors du premier rendu



  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const [toggleState1, setToggleState1] = useState(5);
  const toggleTab1 = (index: SetStateAction<number>) => {
    setToggleState1(index);
  };
  return (



    < Fragment >
    <div className="flex bg-gray-100">
      <Sidebar id={id} />
      <div className="flex-1 ml-64">
        <Headermenu />
      <div className="content-wrapper2">
        {/* Main content */}
        <section className="content">

          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Portefeuille</h5>
                <div className="card-actions float-end">
                  <div className="dropdown show">
                    <a href="#" data-bs-toggle="dropdown" data-bs-display="static">
                      <i className="align-middle" data-feather="more-horizontal"></i>
                    </a>
                    <div className="dropdown-menu dropdown-menu-end">
                      <a className="dropdown-item" href="#">
                        Action
                      </a>
                      <a className="dropdown-item" href="#">
                        Another action
                      </a>
                      <a className="dropdown-item" href="#">
                        Something else here
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body">
                {/* <div className='col-lg-1 col-md-1'></div> */}
                <div className='row'>

                  <div className='col-lg-12 col-md-12'>
                    <div className='currency-selection'>
                      <div className=" rounded-xl bg-white">
                        <div className='col-lg-12 col-md-12 row justify-content-between'>
                          <h3 className='text-center my-3'><b>Profil Global</b></h3>
                          <div className='col-lg-6 col-md-6'>
                            {/* Si le profil est : Sécurité */}
                            <div className='d-flex align-items-center'>
                              <div className='bestseller-coin-image mx-3 my-3'>
                                <img src="/images/ecfa/opcvm/mifid/mifid1.jpg" className="rounded-circle" alt='image' />
                              </div>
                              <div className='title mt-4'>

                                <h5>Volatilité du portefeuille</h5>
                                <p>{mifidForUser?.volatilityPortfolioTarget}</p>
                              </div>
                            </div>

                          </div>
                          <div className='col-lg-6 col-md-6 my-3'>
                            <div className='my-3'>
                              <h5 className='mx-3'>Type de fond</h5>
                              <p className='mx-3'>{mifidForUser?.fundtype}</p>

                              <h5 className='mx-3'>Durée d investissement</h5>
                              <p className='mx-3'>{mifidForUser?.durationInvestment}</p>
                            </div>
                          </div>

                        </div>

                        <div>
                          <h5 className='mx-3'>Commentaire</h5>

                          <p className=' mx-3 mb-5'>{mifidForUser?.commentGlobal}</p>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
                <div className='row '>
                  <div className='currency-selection '>
                    <div className="m-4 credit-card w-full lg:w-4/4 sm:w-auto shadow-lg  rounded-xl bg-white">
                      <div className='cryptocurrency-slides'>
                        <div className='single-cryptocurrency-box'>
                          <div className="bloc-tabs-utilite" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button
                              className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
                              onClick={() => setToggleState(1)}
                              style={{ backgroundColor: toggleState === 1 ? '#f00' : '#ccc', border: 'none', padding: '10px 20px', borderRadius: '5px', color: '#fff', cursor: 'pointer' }}
                            >
                              <span className=''>profil investisseur</span>
                            </button>

                            <button
                              className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
                              onClick={() => setToggleState(2)}
                              style={{ backgroundColor: toggleState === 2 ? '#f00' : '#ccc', border: 'none', padding: '10px 20px', borderRadius: '5px', color: '#fff', cursor: 'pointer' }}
                            >
                              <span className=''>Capacité financière</span>
                            </button>

                            <button
                              className={toggleState === 3 ? "tabs active-tabs" : "tabs"}
                              onClick={() => setToggleState(3)}
                              style={{ backgroundColor: toggleState === 3 ? '#f00' : '#ccc', border: 'none', padding: '10px 20px', borderRadius: '5px', color: '#fff', cursor: 'pointer' }}
                            >
                              <span className=''>Connaissances financières</span>
                            </button>

                            <button
                              className={toggleState === 4 ? "tabs active-tabs" : "tabs"}
                              onClick={() => setToggleState(4)}
                              style={{ backgroundColor: toggleState === 4 ? '#f00' : '#ccc', border: 'none', padding: '10px 20px', borderRadius: '5px', color: '#fff', cursor: 'pointer' }}
                            >
                              <span className=''>Expérience en investissement</span>
                            </button>
                          </div>

                          <div className="content-tabs">
                            {toggleState === 1 && (
                              <>
                                <div className="content active-content">
                                  <div className='cryptocurrency-search-box'>
                                    <h5 className='d-flex'>Catégorie: <p className='colorRed mx-2'>{mifidForUser?.categoryPartOne}</p></h5>
                                    <p className='text-left'>{mifidForUser?.commentPartOne}</p>
                                  </div>
                                </div>
                              </>
                            )}
                            {toggleState === 2 && (
                              <>
                                <div className="content active-content">
                                  <div className='cryptocurrency-search-box'>
                                    <h5 className='d-flex'>Catégorie: <p className='colorRed mx-2'>{mifidForUser?.categoryPartTwo}</p></h5>
                                    <p className='text-left'>{mifidForUser?.commentPartTwo}</p>
                                  </div>
                                </div>
                              </>
                            )}

                            {toggleState === 3 && (
                              <>
                                <div className="content active-content">
                                  <div className='cryptocurrency-search-box'>
                                    <h5 className='d-flex'>Catégorie: <p className='colorRed mx-2'>{mifidForUser?.categoryPartThree}</p></h5>
                                    <p className='text-left'>{mifidForUser?.commentPartThree}</p>
                                  </div>
                                </div>
                              </>
                            )}
                            {toggleState === 4 && (
                              <>
                                <div className="content active-content">
                                  <div className='cryptocurrency-search-box'>
                                    <h5 className='d-flex'>Catégorie: <p className='colorRed mx-2'>{mifidForUser?.categoryPartFour}</p></h5>
                                    <p className='text-left'>{mifidForUser?.commentPartFour}</p>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>


                    </div>


                    {/* 2 è BLOGS */}
                    <div className="m-4 credit-card w-full lg:w-4/4 sm:w-auto shadow-lg  rounded-xl bg-white">

                      <div className='cryptocurrency-slides'>
                        <div className='single-cryptocurrency-box'>
                          {/* L'entête des tabs */}

                          <div className="bloc-tabs-utilite" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button
                              className={toggleState1 === 5 ? "tabs active-tabs gr-text-8 text-color-opacity" : "tabs gr-text-8 text-color-opacity"}
                              onClick={() => toggleTab1(5)}
                              style={{ backgroundColor: toggleState1 === 5 ? '#f00' : '#ccc', border: 'none', padding: '10px 20px', borderRadius: '5px', color: '#fff', cursor: 'pointer' }}
                            >
                              <span className=''>Besoin d investissement</span>
                            </button>

                            <button
                              className={toggleState1 === 6 ? "tabs active-tabs gr-text-8 text-color-opacity" : "tabs gr-text-8 text-color-opacity"}
                              onClick={() => toggleTab1(6)}
                              style={{ backgroundColor: toggleState1 === 6 ? '#f00' : '#ccc', border: 'none', padding: '10px 20px', borderRadius: '5px', color: '#fff', cursor: 'pointer' }}
                            >
                              <span className=''>Objectifs et motivations</span>
                            </button>

                            <button
                              className={toggleState1 === 7 ? "tabs active-tabs gr-text-8 text-color-opacity" : "tabs gr-text-8 text-color-opacity"}
                              onClick={() => toggleTab1(7)}
                              style={{ backgroundColor: toggleState1 === 7 ? '#f00' : '#ccc', border: 'none', padding: '10px 20px', borderRadius: '5px', color: '#fff', cursor: 'pointer' }}
                            >
                              <span className=''>Préférence en matière d investissement</span>
                            </button>

                            <button
                              className={toggleState1 === 8 ? "tabs active-tabs gr-text-8 text-color-opacity" : "tabs gr-text-8 text-color-opacity"}
                              onClick={() => toggleTab1(8)}
                              style={{ backgroundColor: toggleState1 === 8 ? '#f00' : '#ccc', border: 'none', padding: '10px 20px', borderRadius: '5px', color: '#fff', cursor: 'pointer' }}
                            >
                              <span className=''>Aversion au risque</span>
                            </button>
                          </div>


                          {/* Le corps de tab */}
                          <div className="content-tabs">
                            {/* Les besoins en termes d’investissement */}
                            {toggleState1 === 5 && (
                              <>
                                <div className={toggleState === 5 ? "content  active-content" : "content"}>
                                  <div className='cryptocurrency-search-box'>
                                    <h5 className='d-flex'>Catégorie: <p className='colorRed mx-2'>{mifidForUser?.categoryPartFive}</p></h5>
                                    <p className='text-left'>{mifidForUser?.commentPartFive}</p>
                                  </div>
                                </div>
                              </>
                            )}
                            {/* Fin */}

                            {/* Les objectifs attendus et les motivations de l’investissement */}
                            {toggleState1 === 6 && (
                              <>
                                <div className={toggleState === 6 ? "content  active-content" : "content"}>
                                  <div className='cryptocurrency-search-box'>
                                    <h5 className='d-flex'>Catégorie: <p className='colorRed mx-2'>{mifidForUser?.categoryPartSix}</p></h5>
                                    <p className='text-left'>{mifidForUser?.commentPartSix}</p>
                                  </div>
                                </div>
                              </>
                            )}
                            {/* Fin */}

                            {/* Les préférences en matière d’investissement */}
                            {toggleState1 === 7 && (
                              <>
                                <div className={toggleState === 7 ? "content  active-content" : "content"}>
                                  <div className='cryptocurrency-search-box'>
                                    <h5 className='d-flex'>Catégorie: <p className='colorRed mx-2'>{mifidForUser?.categoryPartSeven}</p></h5>
                                    <p className='text-left'>{mifidForUser?.commentPartSeven}</p>
                                  </div>
                                </div>
                              </>
                            )}
                            {/* Fin */}

                            {/* L’attitude face à la perte et l’aversion aux risques */}
                            {toggleState1 === 8 && (
                              <>
                                <div className={toggleState === 8 ? "content  active-content" : "content"}>
                                  <div className='cryptocurrency-search-box'>
                                    <h5 className='d-flex'>Catégorie: <p className='colorRed mx-2'>{mifidForUser?.categoryPartHeight}</p></h5>
                                    <p className='text-left'>{mifidForUser?.commentPartHeight}</p>
                                  </div>
                                </div>
                              </>
                            )}
                            {/* Fin */}
                          </div>
                          {/* Fin le corps de tab */}
                        </div>
                      </div>
                    </div>
                  </div>


                </div>
                {/* <div className='col-lg-1 col-md-1'></div> */}
              </div>
            </div>
          </div>
        </section>
      </div>
      </div >
      </div >
    </Fragment >
  );
}