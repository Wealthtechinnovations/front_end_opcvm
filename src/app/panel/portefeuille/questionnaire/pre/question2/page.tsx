"use client";
import { urlconstant, urlstableconstant, API_KEY_STABLECOIN } from "@/app/constants";

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';
//import ProgressBar from 'react-bootstrap/ProgressBar';
import ProgressBar from '../../../../../ProgressBar';
import 'react-step-progress-bar/styles.css'; // Assurez-vous d'importer les styles CSS si nécessaire
import Header from "@/app/Header";
import Link from "next/link";
// FIN

interface PageProps {
  searchParams: {
    selectedfund: any;
    portefeuille: any;
    selectedValuename: any;
    id: any
  };
}
interface QuizMifidOfUser {
  userId: string;
  // Autres propriétés...
}
export default function Profile(props: PageProps): JSX.Element {
  let id = props.searchParams.id;

  var router = useRouter();
  // Variable de l'url de l'api

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [messageError, setMessageError] = useState();


  // States du formulaire
  const [selectedOption, setSelectedOption] = useState('');
  const [pointing, setPointing] = useState<number>();
  const [title, setTitle] = useState<string>();

  // Question
  const question = "Choisissez l’énoncé qui décrit le mieux l’objectif principal de vos investissements";

  // Les réponses des questions
  const answerOne = "Je veux que mes placements soient sûrs à 100 % même si cela signifie qu'ils ne suivront pas le cours de l'inflation.";
  const answerTwo = "Je suis mal à l'aise face aux fluctuations de rendement , mais je suis prêt à accepter un faible niveau de fluctuation pour tenter de suivre le cours de l'inflation";
  const answerThree = "Je recherche un équilibre entre la croissance et la sécurité.";
  const answerFour = "C'est principalement la croissance qui m'intéresse, et je me préoccupe moins des fluctuations de rendement.";
  const answerFive = "Mon seul objectif est la croissance maximale, et je ne me préoccupe pas des fluctuations de rendement.";

  // Les titres
  const titleOne = "Sécurité";
  const titleTwo = "Protection contre l'inflation";
  const titleThree = "Croissance et sécurité";
  const titleFour = "Croissance";
  const titleFive = "Croissance maximale";

  const handleOptionChange = (event: { target: { value: any; }; }) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);

    // Attribution des points en fonction de la sélection
    switch (selectedValue) {
      case answerOne:
        setPointing(0);
        setTitle(titleOne);
        break;
      case answerTwo:
        setPointing(2);
        setTitle(titleTwo);
        break;
      case answerThree:
        setPointing(4);
        setTitle(titleThree);
        break;
      case answerFour:
        setPointing(6);
        setTitle(titleFour);
        break;
      case answerFive:
        setPointing(8);
        setTitle(titleFive);
        break;
      default:
        setPointing(0); // Aucune sélection
        setTitle("");
    }
  };

  // Fonction d'envoie (Modifier) des données de questionTwo
  const updateQuestionTwo = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    setIsLoggingIn(true);
    try {

      const dataa = {
        questionTwo: question,
        titleOne: title,
        answerTwo: selectedOption,
        pointingTwo: pointing,
      }

      const token = localStorage.getItem('tokenEnCours') //Le token récuperé

      const result = await fetch(`${urlstableconstant}/api/profile/opcvm/update-questionTwo`, {
        method: "PUT",
        body: JSON.stringify(dataa),
        headers: {
          'x-api-key': API_KEY_STABLECOIN,

          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      const data = await result.json();

      /* Verifier s'il y a un messsage d'erreur on l'affiche dans SWAL 
      * sinon on affiche le message de succès
      */
      if (data.message) {
        setMessageError(data.message)
        setIsLoggingIn(false);
        Swal.fire({
          position: 'center',
          icon: 'error',
          html: `<p> ${messageError} </p>`,
          showConfirmButton: false,
          timer: 10000
        })
      } else {
        Swal.fire({
          position: 'center',
          icon: 'success',
          html: `<p> Vos réponses ont été sauvegardées avec succès.</p>`,
          showConfirmButton: false,
          timer: 5000
        }),
          setTimeout(() => {
            router.push("/panel/portefeuille/questionnaire/pre/question3");
          }, 5000)
      }
      // Fin condition 
    } catch {
      setIsLoggingIn(false);
    }
  };
  // Fin


  // La barre de progression de KYC du profil entreprise
  const stepsOpcvm = ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5", "Question 6", "Question 7", "Question 8", "Question 9"];

  const activeStepOpcvm = 0;
  // Fin

  // ********************************************************************************
  // LA PARTIE POUR EVITER L'AFFICHAGE DES LA BARRE DE PROGRSSION SUR MOBILE
  // ********************************************************************************

  // Utilisez un état local pour stocker la largeur de l'écran
  const [windowWidth, setWindowWidth] = useState(0);
  // Utilisez useEffect pour obtenir la largeur de l'écran une fois que le composant est monté
  useEffect(() => {
    // Obtenez la largeur de l'écran et mettez à jour l'état local
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Ajoutez un gestionnaire d'événement pour redimensionner la fenêtre
    window.addEventListener('resize', handleResize);

    // Appelez handleResize une fois pour obtenir la largeur initiale
    handleResize();

    // Nettoyez le gestionnaire d'événement lors du démontage du composant
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Conditionnez l'affichage de ProgressBar en fonction de la largeur de l'écran
  const showProgressBar = windowWidth >= 1180; // Par exemple, considérez les écrans de 768 pixels ou plus comme des ordinateurs

  // *****************FIN LA PARTIE POUR EVITER L'AFFICHAGE DES LA BARRE DE PROGRSSION SUR MOBILE*****

  // *****************FIN LA PARTIE POUR EVITER L'AFFICHAGE DES LA BARRE DE PROGRSSION SUR MOBILE*****

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
                      <li>
                        <a href={`/panel/portefeuille/kyc?id=${id}`}>
                          <span style={{ marginLeft: '55px' }}>KYC</span></a>
                      </li>
                    </>
                  )}
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
      {showProgressBar && <ProgressBar steps={stepsOpcvm} activeStep={activeStepOpcvm} />}

      <div className='mt-15' >


        {/* Les images de fond */}
        <div className='shape1'>
          {/* <img src='/images/shape/shape1.png' alt='image' /> */}
        </div>
        <div className='shape2 mb-5'><br />
          <img src='/images/shape/shape2.png' alt='image' />
        </div>
        <div className='shape3'>
          {/* <img src='/images/shape/shape3.png' alt='image' /> */}
        </div>
        <div className='shape4'>
          <img src='/images/shape/shape4.png' alt='image' />
        </div>
        {/* Fin des images de fond */}

        {/* Les cards */}
        <div className='row mt-5'>
          <div className='col-lg-3 col-md-12'></div>
          <div className='m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg rounded-xl bg-white cryptocurrency-search-box login-form col-lg-8 col-md-12'>
            <label className='mb-3'>
              {question}
            </label>
            {/* FORM  */}
            <form onSubmit={updateQuestionTwo}>
              <div className='form-group'>
                <label className='mx-5'><b>{titleOne}</b></label>
                <label className='gr-check-input d-flex'>
                  <input
                    type="checkbox"
                    value={answerOne}
                    className='mx-3'
                    checked={selectedOption === answerOne}
                    onChange={handleOptionChange}
                  />
                  {answerOne}
                </label>
              </div>
              <div className='form-group'>
                <label className='mx-5'><b>{titleTwo}</b></label>

                <label className='gr-check-input d-flex'>
                  <input
                    type="checkbox"
                    value={answerTwo}
                    className='mx-3'
                    checked={selectedOption === answerTwo}
                    onChange={handleOptionChange}
                  />
                  {answerTwo}
                </label>
              </div>
              <div className='form-group'>
                <label className='mx-5'><b>{titleThree}</b></label>
                <label className='gr-check-input d-flex'>
                  <input
                    type="checkbox"
                    value={answerThree}
                    className='mx-3'
                    checked={selectedOption === answerThree}
                    onChange={handleOptionChange}
                  />
                  {answerThree}
                </label>
              </div>
              <div className='form-group'>
                <label className='mx-5'><b>{titleFour}</b></label>
                <label className='gr-check-input d-flex'>
                  <input
                    type="checkbox"
                    value={answerFour}
                    className='mx-3'
                    checked={selectedOption === answerFour}
                    onChange={handleOptionChange}
                  />
                  {answerFour}
                </label>
              </div>
              <div className='form-group'>
                <label className='mx-5'><b>{titleFive}</b></label>
                <label className='gr-check-input d-flex'>
                  <input
                    type="checkbox"
                    value={answerFive}
                    className='mx-3'
                    checked={selectedOption === answerFive}
                    onChange={handleOptionChange}
                  />
                  {answerFive}
                </label>
              </div>

              {/* Les boutons */}
              <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">


                <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                  <button className="btn btn-primary" type='submit' disabled={isLoggingIn}> Suivante </button>
                </div>
              </div>
            </form>
          </div>
          <div className='col-lg-3 col-md-12'></div>
        </div>
      </div>
    </>
  );
};

