"use client";
import { urlconstant, urlstableconstant, API_KEY_STABLECOIN } from "@/app/constants";

import React, { useState, useEffect, Fragment } from 'react';
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';
//import ProgressBar from 'react-bootstrap/ProgressBar';
import ProgressBar from '../../../../ProgressBar';
import 'react-step-progress-bar/styles.css'; // Assurez-vous d'importer les styles CSS si nécessaire
import Header from "@/app/Header";
import Link from "next/link";
import { Dropdown } from "react-bootstrap";
// FIN

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

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [messageError, setMessageError] = useState();

  // Les states du formulaire
  const [selectedOption, setSelectedOption] = useState('');
  const [pointing, setPointing] = useState<number>();
  const [title, setTitle] = useState<string>();
  // Question
  const question = "Avec lequel des cinq portefeuilles fictifs suivants seriez-vous le plus à l’aise ?"

  // Les réponses des questions
  const answerOne = "Portefeuille A | Rendement moyen annualisé du portefeuille : 1.50%";
  const answerTwo = "Portefeuille B | Rendement moyen annualisé du portefeuille : 2.50%";
  const answerThree = "Portefeuille C	| Rendement moyen annualisé du portefeuille : 5.00%";
  const answerFour = "Portefeuille D | Rendement moyen annualisé du portefeuille : 7.00%";
  const answerFive = "Portefeuille E | Rendement moyen annualisé du portefeuille : 9.00%";


  const handleOptionChange = (event: { target: { value: any; }; }) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);

    // Attribution des points en fonction de la sélection
    switch (selectedValue) {
      case answerOne:
        setPointing(0);
        break;
      case answerTwo:
        setPointing(2);
        break;
      case answerThree:
        setPointing(4);
        break;
      case answerFour:
        setPointing(6);
        break;
      case answerFive:
        setPointing(8);
        break;
      default:
        setPointing(10); // Aucune sélection
    }
  };

  // Fonction d'envoie (Modifier) des données de questionNine
  const updateQuestionNine = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    setIsLoggingIn(true);
    try {


      const total1 = localStorage.getItem('totalPointpre1');
      const total2 = localStorage.getItem('totalPointpre2');
      const total3 = localStorage.getItem('totalPointpre3');
      const total4 = localStorage.getItem('totalPointpre4');
      const total5 = localStorage.getItem('totalPointpre5');
      const total6 = localStorage.getItem('totalPointpre6');
      const total7 = localStorage.getItem('totalPointpre7');
      const total8 = localStorage.getItem('totalPointpre8');


      const dataa = {
        questionNine: question,
        answerNine: selectedOption,
        pointingNine: pointing,
      }

      const token = localStorage.getItem('tokenEnCours') //Le token récuperé
      const totalPoint = dataa.pointingNine;
      localStorage.setItem("totalPointpre8", String(totalPoint));

      const totalPointGlobal =
        (Number(total1) || 0) +
        (Number(total2) || 0) +
        (Number(total3) || 0) +
        (Number(total4) || 0) +
        (Number(total5) || 0) +
        (Number(total6) || 0) +
        (Number(total7) || 0) +
        (Number(total8) || 0) +
        (Number(totalPoint) || 0);


      // Calcul des buts et objectifs:Total des points pour les questions 1 et 2
      const totalGoalsAndObjectives = (Number(total1) || 0) + (Number(total2) || 0);

      // Calcul de situation financière: Total des points pour les questions 3 à 5
      const totalFinancialSituation = (Number(total3) || 0) + (Number(total4) || 0) + (Number(total5) || 0);
      // Calcul d'attitude face au risque: Total des points pour les questions 6 à 9
      const totalAttitudeTowardsRisk = (Number(total6) || 0) + (Number(total7) || 0) + (Number(total8) || 0) + (Number(totalPoint) || 0);

      // Calcul d'obtention du type de profil 
      var typeProfile = "";
      var percentage = ""
      if (totalPointGlobal >= 0 && totalPointGlobal <= 9) {
        typeProfile = "Sécurité";
        percentage = "100% revenu fixe";
      } else if (totalPointGlobal >= 10 && totalPointGlobal <= 27) {
        typeProfile = "Conservateur";
        percentage = "25% actions / 75% revenu fixe";
      } else if (totalPointGlobal >= 28 && totalPointGlobal <= 44) {
        typeProfile = "Equilibré";
        percentage = "50% action / 50% revenu fixe";
      } else if (totalPointGlobal >= 45 && totalPointGlobal <= 62) {
        typeProfile = "Croissance équilibrée";
        percentage = "75% actions / 25% revenu fixe";
      } else if (totalPointGlobal >= 63 && totalPointGlobal <= 72) {
        typeProfile = "Croissance";
        percentage = "100% actions";
      }

      // variable qui contient les données du questionnaire
      const questionnairepre = {
        questionNine: dataa.questionNine,
        answerNine: dataa.answerNine,
        pointingNine: dataa.pointingNine,
        totalPoints: totalPointGlobal,
        totalGoalsAndObjectives: totalGoalsAndObjectives,
        totalFinancialSituation: totalFinancialSituation,
        totalAttitudeTowardsRisk: totalAttitudeTowardsRisk,
        typeProfile: typeProfile,
        percentage: percentage,
        status: true
      };

      const quizJSONpre = JSON.stringify(questionnairepre);

      // Stocker la chaîne JSON dans le localStorage avec une clé spécifique
      localStorage.setItem('quizDatapre', quizJSONpre);

      Swal.fire({
        position: 'center',
        icon: 'success',
        html: `<p> Vos réponses ont été sauvegardées avec succès.</p>`,
        showConfirmButton: false,
        timer: 5000
      }),
        setTimeout(() => {
          router.push("/questionnaire/questionnaire");
        }, 5000)

      // Fin condition 
    } catch {
      setIsLoggingIn(false);
    }
  };
  // Fin


  // La barre de progression de KYC du profil entreprise
  const stepsOpcvm = ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5", "Question 6", "Question 7", "Question 8", "Question 9"];

  const activeStepOpcvm = 7;
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
  const [userConnected, setUserConnected] = useState<number | null>(null);
  const handleLinkClick = () => {

    if (userConnected !== null) {
      setTimeout(() => {
        const redirectUrl = `/panel/portefeuille/home?id=${userConnected}`;

        router.push(redirectUrl);
      }, 5);

    } else {
      setTimeout(() => {
        // const redirectUrl = `/panel/portefeuille/home?id=${userConnected}`;

        router.push('/portefeuille/login');
      }, 5);
    }
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
              {showProgressBar && <ProgressBar steps={stepsOpcvm} activeStep={activeStepOpcvm} />}

              <div className='mt-15' >




                {/* Les cards */}
                <div className='row mt-5'>
                  <div className='row mt-5' style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className='m-4 p-5 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg rounded-xl bg-white cryptocurrency-search-box login-form col-lg-7 col-md-12'>

                      <label className='mb-3'>
                        {question}
                      </label>
                      <div className=' mb-5'>
                        <img src='/images/question9.jpg' alt='image' />
                      </div>
                      {/* FORM  */}
                      <form onSubmit={updateQuestionNine}>
                        <div className='form-group'>
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
                            <button className="btn btn-primary" type='submit' disabled={isLoggingIn}> Soumettre </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

      </Fragment >
    </>
  );
};

