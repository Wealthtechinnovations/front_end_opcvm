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

  //Les states du formulaire
  const [selectedOption, setSelectedOption] = useState('');
  const [pointing, setPointing] = useState<number>();
  const [title, setTitle] = useState<string>();
  // Question
  const question = "Supposez que vous avez une somme de 10 000 000 FCFA (15 000 €) et que vous pouvez choisir parmi n’importe lesquelles des options de placement ci-dessous. Les valeurs minimales et maximales après un an sont indiquées pour chaque option. Avec quelle option seriez- vous le plus à l’aise ?"

  // Les réponses des questions
  const answerOne = "10 000 000 FCFA (min) 10 400 000 FCFA (max)";
  const answerTwo = "9 500 000 FCFA (min) 10 400 000 FCFA (max)";
  const answerThree = "9 000 000 FCFA (min) 11 500 000 FCFA (max)";
  const answerFour = "8 500 000 FCFA (min) 12 000 000 FCFA (max)";
  const answerFive = "7 500 000 FCFA (min) 13 000 000 FCFA (max)";


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


  // Fonction d'envoie (Modifier) des données de questionSix
  const updateQuestionSix = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    setIsLoggingIn(true);
    try {

      const dataa = {
        questionSix: question,
        answerSix: selectedOption,
        pointingSix: pointing,
      }

      const token = localStorage.getItem('tokenEnCours') //Le token récuperé

      const totalPoint = dataa.pointingSix;
      localStorage.setItem("totalPointpre6", String(totalPoint));

      Swal.fire({
        position: 'center',
        icon: 'success',
        html: `<p> Vos réponses ont été sauvegardées avec succès.</p>`,
        showConfirmButton: false,
        timer: 5000
      }),
        setTimeout(() => {
          router.push("/questionnaire/questionnaire/pre/question7");
        }, 5000)

      // Fin condition 
    } catch {
      setIsLoggingIn(false);
    }
  };
  // Fin

  // La barre de progression de KYC du profil entreprise
  const stepsOpcvm = ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5", "Question 6", "Question 7", "Question 8", "Question 9"];

  const activeStepOpcvm = 4;
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
                      {/* FORM  */}
                      <form onSubmit={updateQuestionSix}>
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

                            <button className="btn btn-primary" type='submit' disabled={isLoggingIn}> Suivante </button>
                          </div>
                        </div>
                      </form>
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

