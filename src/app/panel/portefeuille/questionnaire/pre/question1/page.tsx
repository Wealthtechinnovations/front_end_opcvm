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
  const [questionnaireForUser, setQuestionnaireForUser] = useState<QuizMifidOfUser | null>(null);;

  // State du formulaire
  const [selectedOption, setSelectedOption] = useState('');
  const [pointing, setPointing] = useState<number>();

  // Question
  const question = "Si vous détenez des investissements financiers dans des OPCVM, quand aurez-vous besoin de toucher à votre portefeuille d’investissement que ce soit au moyen de retraits réguliers ou du retrait d’une somme forfaitaire importante ?"

  const handleOptionChange = (event: { target: { value: any; }; }) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);

    // Attribution des points en fonction de la sélection
    switch (selectedValue) {
      case 'Moins de 5 ans':
        setPointing(0);
        break;
      case 'De 6 à 10 ans':
        setPointing(2);
        break;
      case 'De 11 à 15 ans':
        setPointing(4);
        break;
      case 'De 16 à 20 ans':
        setPointing(6);
        break;
      case 'Plus de 20 ans':
        setPointing(8);
        break;
      default:
        setPointing(10); // Aucune sélection
    }
  };

  // Fonction d'envoie des données de questionOne
  const addQuestionOne = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    setIsLoggingIn(true);
    try {

      const dataa = {
        questionOne: question,
        answerOne: selectedOption,
        pointingOne: pointing,
      }

      const token = localStorage.getItem('tokenEnCours') //Le token récuperé

      const result = await fetch(`${urlstableconstant}/api/profile/opcvm/add-questionOne`, {
        method: "POST",
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
            router.push("/panel/portefeuille/questionnaire/pre/question2");
          }, 5000)
      }
      // Fin condition 
    } catch {
      setIsLoggingIn(false);
    }
  };
  // Fin

  // Fonction d'envoie (Modifier) des données de questionOne
  const updateQuestionOne = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    setIsLoggingIn(true);
    try {

      const dataa = {
        questionOne: question,
        answerOne: selectedOption,
        pointingOne: pointing,
      }

      const token = localStorage.getItem('tokenEnCours') //Le token récuperé

      const result = await fetch(`${urlstableconstant}/api/profile/opcvm/update-questionOne`, {
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
            router.push("/panel/portefeuille/questionnaire/pre/question2");
          }, 5000)
      }
      // Fin condition 
    } catch {
      setIsLoggingIn(false);
    }
  };
  // Fin
  useEffect(() => {
    // Appel à l'API lors du premier rendu du composant
    async function fetchData() {
      try {
        const token = localStorage.getItem('tokenEnCours');
        const result = await fetch(`${urlstableconstant}/api/profile/opcvm/find-profile-opcvm-questionnaire-of-user-signIn`, {
          headers: {
            'x-api-key': API_KEY_STABLECOIN,
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        // Vérification du statut de la réponse
        if (result.ok) {
          const data = await result.json();
          setQuestionnaireForUser(data);
          console.log("Data=>", data?.userId);
        } else {
          throw new Error('Erreur lors de la requête à l\'API');
        }
      } catch (error) {
        console.error('Error fetching quiz part one:', error);
      }
    }

    fetchData();
  }, []);
  // Recuperer les donnees du questionnaire de l'utilisateur connecté

  // FIN


  // La barre de progression de KYC du profil entreprise
  const stepsOpcvm = ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5", "Question 6", "Question 7", "Question 8", "Question 9"];

  const activeStepOpcvm = -1;
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
            <form onSubmit={questionnaireForUser?.userId || !questionnaireForUser?.userId == undefined ? updateQuestionOne : addQuestionOne}>
              <div className='form-group'>
                <label>
                  <input
                    type="checkbox"
                    value="Moins de 5 ans"
                    className='mx-3'
                    checked={selectedOption === "Moins de 5 ans"}
                    onChange={handleOptionChange}
                  />
                  Moins de 5 ans
                </label>
              </div>
              <div className='form-group'>
                <label>
                  <input
                    type="checkbox"
                    value="De 6 à 10 ans"
                    className='mx-3'
                    checked={selectedOption === "De 6 à 10 ans"}
                    onChange={handleOptionChange}
                  />
                  De 6 à 10 ans
                </label>
              </div>
              <div className='form-group'>
                <label>
                  <input
                    type="checkbox"
                    value="De 11 à 15 ans"
                    className='mx-3'
                    checked={selectedOption === "De 11 à 15 ans"}
                    onChange={handleOptionChange}
                  />
                  De 11 à 15 ans
                </label>
              </div>
              <div className='form-group'>
                <label>
                  <input
                    type="checkbox"
                    value="De 16 à 20 ans"
                    className='mx-3'
                    checked={selectedOption === "De 16 à 20 ans"}
                    onChange={handleOptionChange}
                  />
                  De 16 à 20 ans
                </label>
              </div>
              <div className='form-group'>
                <label>
                  <input
                    type="checkbox"
                    value="Plus de 20 ans"
                    className='mx-3'
                    checked={selectedOption === "Plus de 20 ans"}
                    onChange={handleOptionChange}
                  />
                  Plus de 20 ans
                </label>
              </div>

              {/* Les boutons */}
              <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                <button className="btn btn-primary" type='submit' disabled={isLoggingIn}> Suivante </button>
              </div>
            </form>
          </div>
          <div className='col-lg-3 col-md-12'></div>
        </div>
      </div>
    </>
  );
};


