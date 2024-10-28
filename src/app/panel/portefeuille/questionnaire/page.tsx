"use client";
import { urlconstant, urlstableconstant, API_KEY_STABLECOIN } from "@/app/constants";

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';
//import ProgressBar from 'react-bootstrap/ProgressBar';
import ProgressBar from '../../../ProgressBar';
import 'react-step-progress-bar/styles.css'; // Assurez-vous d'importer les styles CSS si nécessaire
import Header from "@/app/Header";
import Link from "next/link";
import { Button } from "react-bootstrap";
/**
 * Composant pour la première partie du quiz MIFID.
 * @component
 * @return {JSX.Element} Composant de la première partie du quiz MIFID.
 */

interface QuizMifidOfUser {
  userId: string;
  typeProfile: any;
  percentage: any;
  status: any;
  conditions: any;
  // Autres propriétés...
}
interface MifidForUser {
  userId: string;
  typeProfile: any;
  percentage: any;
  status: any;
  conditions: any;
  // Autres propriétés...
}



interface PageProps {
  searchParams: {
    selectedfund: any;
    portefeuille: any;
    selectedValuename: any;
    id: any
  };
}

// FIN

export default function TypeProfil(props: PageProps): JSX.Element {
  // Variable de l'url de l'api
  let id = props.searchParams.id;

  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [questionnaireForUser, setQuestionnaireForUser] = useState<QuizMifidOfUser | null>(null);
  const [mifidForUser, setMifidForUser] = useState<MifidForUser | null>(null);

  // Recuperer les donnees du questionnaire de l'utilisateur connecté
  useEffect(() => {
    // Appel à l'API lors du premier rendu du composant
    async function getQuestionnaireForUser() {
      try {
        const token = localStorage.getItem('tokenEnCours');
        const response = await fetch(`${urlstableconstant}/api/profile/opcvm/find-profile-opcvm-questionnaire-of-user-signIn`, {
          headers: {
            'x-api-key': API_KEY_STABLECOIN, // Utiliser directement la variable sans ${}
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        setQuestionnaireForUser(responseData);
      } catch (error) {
        console.error('Error fetching questionnaire for user:', error);
      }
    }

    getQuestionnaireForUser();
  }, []);

  // FIN


  // Recuperer les donnees du questionnaire MIFID de l'utilisateur connecté
  useEffect(() => {
    // Appel à l'API lors du premier rendu du composant
    async function getMifidForUser() {
      try {
        const token = localStorage.getItem('tokenEnCours');
        const response = await fetch(`${urlstableconstant}/api/mifid/find-quiz-mifid-of-user`, {
          headers: {
            'x-api-key': API_KEY_STABLECOIN, // Utiliser directement la variable sans ${}
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        setMifidForUser(responseData);
      } catch (error) {
        console.error('Error fetching Mifid for user:', error);
      }
    }

    getMifidForUser();
  }, []);

  // FIN

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  return (
    <>
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
                  <Link href={`/panel/portefeuille/fondfavoris?id=${id}`}>
                    <i data-feather="user"></i>
                    <span>Favoris</span>
                  </Link>
                </li>
                <li className={`dropdown ${isDropdownOpen ? 'open' : ''}`}>
                  <a href="#" onClick={toggleDropdown} className="dropdown-toggle" data-toggle="dropdown" style={{ backgroundColor: "#3b82f6", color: "white" }}>
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
                  <a href={`/panel/portefeuille/kyc?id=${id}`}>
                    <span style={{ marginLeft: '55px' }}>KYC</span></a>
                </li>
                <li>
                  <Link href={`/accueil`}>
                    <i data-feather="user"></i>
                    <span>Se deconnecter</span>
                  </Link>
                </li>




                {/* ... (autres éléments du menu) */}
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
      <div className='mt-100' >


        {/* Les cards */}
        <div className='row '>
          <div className='col-lg-3 col-md-12'></div>
          <div className='py-10'>
            <h1 className='text-center'>Votre profil investisseur provisoire </h1>
          </div>
        </div>



        {/* Les cards */}
        <div className='row '>
          <div className='col-lg-3 col-md-12'></div>
          <div className='m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white cryptocurrency-search-box login-form col-lg-8 col-md-12'>
            <div className='row'>
              <div className='col-lg-1 col-md-1'></div>

              <div className='col-lg-10 col-md-10'>
                <div className='currency-selection'>
                  <div className="">
                    <div className='col-lg-12 col-md-12 row justify-content-between'>
                      <div className='col-lg-6 col-md-6'>
                        {/* Si le profil est : Sécurité */}
                        {questionnaireForUser?.typeProfile === "Sécurité" ? (
                          <div className='d-flex align-items-center'>
                            <div className='bestseller-coin-image mx-3 my-3'>
                              <img src="/images/ecfa/opcvm/profil1.jpg" className="rounded-circle" alt='image' />
                            </div>
                            <div className='title'>
                              <h3>{questionnaireForUser?.typeProfile}</h3>
                              <p>{questionnaireForUser?.percentage}</p>
                            </div>
                          </div>
                        ) : ("")}


                        {/* Si le profil est : Conservateur */}
                        {questionnaireForUser?.typeProfile === "Conservateur" ? (
                          <div className='d-flex align-items-center'>
                            <div className='bestseller-coin-image mx-3 my-3'>
                              <img src="/images/ecfa/opcvm/profil2.jpg" className="rounded-circle" alt='image' />
                            </div>
                            <div className='title'>
                              <h3>{questionnaireForUser?.typeProfile}</h3>
                              <p>{questionnaireForUser?.percentage}</p>
                            </div>
                          </div>
                        ) : ("")}

                        {/* Si le profil est : Equilibré */}
                        {questionnaireForUser?.typeProfile === "Equilibré" ? (
                          <div className='d-flex align-items-center'>
                            <div className='bestseller-coin-image mx-3 my-3'>
                              <img src="/images/ecfa/opcvm/profil3.jpg" className="rounded-circle" alt='image' />
                            </div>
                            <div className='title'>
                              <h3>{questionnaireForUser?.typeProfile}</h3>
                              <p>{questionnaireForUser?.percentage}</p>
                            </div>
                          </div>
                        ) : ("")}

                        {/* Si le profil est : Croissance équilibrée */}
                        {questionnaireForUser?.typeProfile === "Croissance équilibrée" ? (
                          <div className='d-flex align-items-center'>
                            <div className='bestseller-coin-image mx-3 my-3'>
                              <img src="/images/ecfa/opcvm/profil4.jpg" className="rounded-circle" alt='image' />
                            </div>
                            <div className='title'>
                              <h3>{questionnaireForUser?.typeProfile}</h3>
                              <p>{questionnaireForUser?.percentage}</p>
                            </div>
                          </div>
                        ) : ("")}

                        {/* Si le profil est : Croissance */}
                        {questionnaireForUser?.typeProfile === "Croissance" ? (
                          <div className='d-flex align-items-center'>
                            <div className='bestseller-coin-image mx-3 my-3'>
                              <img src="/images/ecfa/opcvm/profil5.jpg" className="rounded-circle" alt='image' />
                            </div>
                            <div className='title'>
                              <h3>{questionnaireForUser?.typeProfile}</h3>
                              <p>{questionnaireForUser?.percentage}</p>
                            </div>
                          </div>
                        ) : ("")}

                        {/* Ce bouton s'affiche si l'utilisateur n'a pas encore donné son avis  */}
                        {questionnaireForUser?.status === true && !questionnaireForUser?.conditions ? (
                          <div className=''>
                            <Button
                              color="primary"
                              type="button"
                              href='/portefeuille/questionnaire/first'
                            >
                              Cliquez ici pour nous donner votre avis sur votre résultat
                            </Button>
                          </div>
                        ) : null}
                        <div className='btn-box mt-3'>
                          {mifidForUser?.status === true ? (
                            <Button
                              color="primary"
                              type="button"
                              href='/portefeuille/profile'
                            >
                              Voir profil MIFID
                            </Button>
                          ) : (
                            <Button

                              color="primary"
                              type="button"
                              href='/portefeuille/questionnaire/question1'
                            >
                              Questionnaire MIFID
                            </Button>
                          )}
                        </div>

                      </div>
                      <div className='col-lg-6 col-md-6 my-3'>
                        <p>Votre profil d’investisseur est fondé sur vos réponses à propos de votre situation financière actuelle, de vos buts et objectifs de placement ainsi que de votre attitude à l’égard du risque. Veuillez lire les énoncés suivants et confirmer votre accord et en sélectionnant si nécessaire un profil qui pourrait vous convenir.</p>
                        {/* Si le profil est : Sécurité */}
                        {questionnaireForUser?.typeProfile === "Sécurité" ? (
                          <div className='my-3'>
                            <p>• Votre objectif principal est de conserver votre capital</p>
                            <p>• Vous ne tolérez pas de fluctuations de rendement</p>
                            <p>• Vous investissez pour une courte période de temps</p>
                          </div>
                        ) : ("")}

                        {/* Si le profil est : Conservateur */}
                        {questionnaireForUser?.typeProfile === "Conservateur" ? (
                          <div className='my-3'>
                            <p>• Vous vous préoccupez de la conservation de votre capital</p>
                            <p>• Vous désirez un revenu de placement relativement stable</p>
                            <p>• Vous êtes prêt à tolérer des fluctuations limitées</p>
                            <p>• La période de croissance de vos placements est plutôt courte</p>
                          </div>
                        ) : ("")}


                        {/* Si le profil est : Equilibré */}
                        {questionnaireForUser?.typeProfile === "Equilibré" ? (
                          <div className='my-3'>
                            <p>• Vous souhaitez obtenir de bons rendements en réduisant le risque global de votre portefeuille</p>
                            <p>• Vous êtes prêt à tolérer certaines fluctuations</p>
                            <p>• Vous n’avez pas besoin de recourir à des retraits au cours des quelques prochaines années</p>
                          </div>
                        ) : ("")}


                        {/* Si le profil est : Croissance équilibrée */}
                        {questionnaireForUser?.typeProfile === "Croissance équilibrée" ? (
                          <div className='my-3'>
                            <p>• Vous êtes un investisseur axé sur la croissance</p>
                            <p>• Vous désirez obtenir un bon rendement sur votre portefeuille</p>
                            <p>• Vous êtes prêt à accepter des fluctuations de marché</p>
                            <p>• Vous disposez d’une période de temps relativement longue</p>
                            <p>• Vous n’avez pas besoin de recourir à des retraits au cours des 10 prochaines années</p>
                          </div>
                        ) : ("")}

                        {/* Si le profil est : Croissance */}
                        {questionnaireForUser?.typeProfile === "Croissance" ? (
                          <div className='my-3'>
                            <p>• Votre objectif principal est de réaliser le meilleur rendement possible</p>
                            <p>• Vous êtes prêt à accepter d’importantes fluctuations de marché</p>
                            <p>• Vous n’aurez pas besoin de toucher à ces pl acements pendant les 15 prochaines années.</p>
                          </div>
                        ) : ("")}


                      </div>

                    </div>
                  </div>
                </div>
              </div>
              <div className='col-lg-1 col-md-1'></div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

