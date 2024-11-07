"use client";
import { urlconstant, urlstableconstant, API_KEY_STABLECOIN } from "@/app/constants";

import React, { useState, useEffect, Fragment } from 'react';
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';
//import ProgressBar from 'react-bootstrap/ProgressBar';
import 'react-step-progress-bar/styles.css'; // Assurez-vous d'importer les styles CSS si nécessaire
import Header from "@/app/Header";
import Link from "next/link";
import { Button } from "react-bootstrap";
import { DropdownButton, Dropdown } from 'react-bootstrap';

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



  // FIN


  // Recuperer les donnees du questionnaire MIFID de l'utilisateur connecté
  useEffect(() => {
    // Appel à l'API lors du premier rendu du composant
    async function getMifidForUser() {
      try {

        let quiz;
        const quizData = localStorage.getItem('quizDatapre');


        // Vérifier si les données existent dans le localStorage
        if (quizData) {
          // Convertir les données JSON en un objet JavaScript
          const quiz = JSON.parse(quizData);
          console.log(quiz);
          // Mettre à jour l'état mifidForUser avec les données récupérées
          setQuestionnaireForUser({
            userId: "user_id",
            typeProfile: quiz.typeProfile,
            percentage: quiz.percentage,
            status: true,
            conditions: "any"
          });
        }
      } catch (error) {
        console.error('Error fetching Mifid for user:', error);
      }
    }

    getMifidForUser();
  }, []);

  // FIN
  const [userConnected, setUserConnected] = useState<number | null>(null);
  console.log(questionnaireForUser);
  const handleLinkClick = () => {

    if (userConnected !== null) {
      setTimeout(() => {
        const redirectUrl = `/panel/portefeuille/home?id=${userConnected}`;

        router.push(redirectUrl);
      }, 5);

    } else {
      setTimeout(() => {
        // const redirectUrl = `/panel/portefeuille/home?id=${userConnected}`;

        router.push('/panel/portefeuille/login');
      }, 5);
    }
  };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLinksociete = () => {


    setTimeout(() => {
      const redirectUrl = `/Fundmanager/recherche`;

      router.push(redirectUrl);
    }, 1);


  };
  const [isHovered, setIsHovered] = useState(false);


  const handleMouseEnters = () => {
    setIsHovered(true);
  };

  const handleMouseLeaves = () => {
    setIsHovered(false);
  };
  const handleLinkaccueil = () => {


    setTimeout(() => {
      const redirectUrl = `/accueil`;

      router.push(redirectUrl);
    }, 1);


  };
  const [isHovereda, setIsHovereda] = useState(false);


  const handleMouseEntersa = () => {
    setIsHovereda(true);
  };

  const handleMouseLeavesa = () => {
    setIsHovereda(false);
  };

  const [isHoveredaa, setIsHoveredaa] = useState(false);

  const handleMouseEnteraa = () => {
    setIsHoveredaa(true);
  };

  const handleMouseLeaveaa = () => {
    setIsHoveredaa(false);
  };
  const handleLinkactualite = () => {


    setTimeout(() => {
      const redirectUrl = `/actualite`;

      router.push(redirectUrl);
    }, 1);


  };

  const [isHoveredp, setIsHoveredp] = useState(false);

  const handleMouseEnterp = () => {
    setIsHoveredp(true);
  };

  const handleMouseLeavep = () => {
    setIsHoveredp(false);
  };
  const handleLinkpays = () => {


    setTimeout(() => {
      const redirectUrl = `/pays`;

      router.push(redirectUrl);
    }, 1);


  };
  return (
    <>
      < Fragment >
        <Header />
        <br />

       
        <div className="">
          <div className="container-full">
            {/* Main content */}
            <section className="content">
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
                  <div className='row mt-5' style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className='m-4 p-5 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg rounded-xl bg-white cryptocurrency-search-box login-form col-lg-7 col-md-12'>

                      <div className='row'>
                        <div className='col-lg-1 col-md-1'></div>

                        <div className='col-lg-10 col-md-10'>
                          <div className='currency-selection'>
                            <div className="">
                              <div className='col-lg-12 col-md-12'>
                                <div className='col-lg-6 col-md-6 d-flex justify-content-center align-items-center'>
                                  {questionnaireForUser?.typeProfile === "Sécurité" ? (
                                    <div className='d-flex align-items-center'>
                                      <div className='bestseller-coin-image mx-3 my-3'>
                                        <img src="/images/profil1.jpg" className="rounded-circle" alt='image' />
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
                                        <img src="/images/profil2.jpg" className="rounded-circle" alt='image' />
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
                                        <img src="/images/profil3.jpg" className="rounded-circle" alt='image' />
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
                                        <img src="/images/profil4.jpg" className="rounded-circle" alt='image' />
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
                                        <img src="/images/profil5.jpg" className="rounded-circle" alt='image' />
                                      </div>
                                      <div className='title'>
                                        <h3>{questionnaireForUser?.typeProfile}</h3>
                                        <p>{questionnaireForUser?.percentage}</p>
                                      </div>
                                    </div>
                                  ) : ("")}



                                </div>
                                <div className="row">
                                  <div className="d-flex justify-content-between w-100 mt-3">

                                    <div className='btn-box mt-3 col-6'>
                                      <Button
                                        color="primary"
                                        type="button"
                                        href='/questionnaire/questionnaire/pre/question1'
                                      >
                                        Reprendre le questionnaire
                                      </Button>
                                    </div>
                                    <div className='btn-box mt-3 col-6' >
                                      <Button
                                        color="primary"
                                        type="button"
                                        href='/questionnaire/questionnaire/question1'
                                      >
                                        &nbsp;&nbsp;&nbsp;  Questionnaire MIFID &nbsp;&nbsp;&nbsp;
                                      </Button>
                                    </div>
                                  </div>

                                </div>
                                <div className='col-lg-12 col-md-12 my-3'>
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


                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div >

      </Fragment >
    </>
  );
};

