"use client";
import { urlconstant, urlstableconstant, API_KEY_STABLECOIN } from "@/app/constants";

import React, { useState, useEffect, Fragment } from 'react';
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';
//import ProgressBar from 'react-bootstrap/ProgressBar';
import ProgressBar from '../../../ProgressBar';

import 'react-step-progress-bar/styles.css'; // Assurez-vous d'importer les styles CSS si nécessaire
import Header from "@/app/Header";
import Link from "next/link";
import { Dropdown } from "react-bootstrap";
/**
 * Composant pour la première partie du quiz MIFID.
 * @component
 * @return {JSX.Element} Composant de la première partie du quiz MIFID.
 */
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
  // Variable de l'url de l'api
  const API_URL = process.env.NEXT_PUBLIC_URL_API;
  const router = useRouter();
  let id = props.searchParams.id;

  // États pour gérer l'état du formulaire
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [messageError, setMessageError] = useState('');
  const [quizMifidOfUser, setQuizMifidOfUser] = useState<QuizMifidOfUser | null>(null);

  // States de MIFID
  const [quizPartTwo, setQuizPartTwo] = useState<any[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

  // Effet pour récupérer les questionnaires de la partie 1
  useEffect(() => {
    // Appel à l'API lors du premier rendu du composant
    async function fetchData() {
      try {
        const token = localStorage.getItem('tokenEnCours');
        //const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQ4LCJpc0FkbWluIjowLCJpYXQiOjE3MTE5NjI2ODcsImV4cCI6MTcxMjEzNTQ4N30.wiEHhYxqY0NtgxwUVGUYOD2vHih381Qf3KQh4_2CU2w";

        const result = await fetch(`${urlstableconstant}/api/mifid/find-quiz-part-two`, {
          headers: {
            'x-api-key': API_KEY_STABLECOIN, // Utiliser directement la variable sans ${}
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await result.json();
        setQuizPartTwo(data.questions);
        setSelectedOptions(Array(data.questions.length).fill({ reponse: '', points: 0 }));
      } catch (error) {
        console.error('Error fetching quiz part one:', error);
      }
    }

    fetchData();
  }, []); // Dépendance vide pour n'exécuter l'effet qu'une seule fois



  // Fonction pour gérer le changement d'option
  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>, questionIndex: number) => {
    const newSelectedOptions = [...selectedOptions];
    const selectedOption = quizPartTwo[questionIndex].reponses.find(
      (reponse: { reponse: string; }) => reponse.reponse === event.target.value
    );

    newSelectedOptions[questionIndex] = selectedOption;
    setSelectedOptions(newSelectedOptions);
  };



  // Fonction pour gérer la mise à jour des données de la partie 1
  const updatePartTwo = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    setIsLoggingIn(true);

    try {
      const dataToSend = {
        pointOnePartOne: selectedOptions[0].points,
        pointTwoPartOne: selectedOptions[1].points,
        pointThreePartOne: selectedOptions[2].points,
        pointFourPartOne: selectedOptions[3].points,
      };


      const totalPoint = dataToSend.pointOnePartOne +
        dataToSend.pointTwoPartOne +
        dataToSend.pointThreePartOne +
        dataToSend.pointFourPartOne;


      let categoryProfilePartTwo = "";
      let commentPartTwo = "";

      if (totalPoint >= -10 && totalPoint <= -4) {
        categoryProfilePartTwo = "Faible";
        commentPartTwo = ": Vous avez des revenus faibles ou irréguliers, des dépenses importantes ou imprévisibles, une épargne insuffisante ou inexistante, un endettement élevé ou excessif, un patrimoine immobilier nul ou limité. Vous avez probablement une capacité d'investissement faible ou négative, c'est-à-dire que vous ne pouvez pas ou difficilement épargner sans mettre en péril votre situation financière. Vous devriez réduire vos dépenses, rembourser vos dettes, constituer une épargne de précaution et éviter les placements risqués ou bloqués.";
      } else if (totalPoint >= -3 && totalPoint <= 3) {
        categoryProfilePartTwo = "Moyenne";
        commentPartTwo = "Vous avez des revenus stables ou modérés, des dépenses maîtrisées ou raisonnables, une épargne disponible ou régulière, un endettement modéré ou supportable, un patrimoine immobilier moyen ou diversifié. Vous avez probablement une capacité d'investissement moyenne ou positive, c'est-à-dire que vous pouvez épargner sans compromettre votre équilibre financier. Vous devriez maintenir votre niveau de vie, optimiser votre fiscalité, renforcer votre épargne et diversifier vos placements entre des supports sécurisés et des supports plus rentables.";
      } else if (totalPoint >= 4 && totalPoint <= 15) {
        categoryProfilePartTwo = "Elevée";
        commentPartTwo = "Vous avez des revenus élevés ou croissants, des dépenses faibles ou optimisées, une épargne importante ou abondante, un endettement faible ou nul, un patrimoine immobilier conséquent ou valorisé. Vous avez probablement une capacité d'investissement élevée ou très positive, c'est-à-dire que vous pouvez épargner largement sans nuire à votre niveau de vie. Vous devriez profiter de votre situation, anticiper votre succession, augmenter votre épargne et investir sur des supports dynamiques ou innovants.";
      }

      // Stockage dans le localStorage
      localStorage.setItem("categoryProfilePartTwo", categoryProfilePartTwo);
      localStorage.setItem("commentPartTwo", commentPartTwo);
      localStorage.setItem("totalPoint2", totalPoint);

      Swal.fire({
        position: 'center',
        icon: 'success',
        html: `<p> Vos réponses ont été sauvegardées avec succès.</p>`,
        showConfirmButton: false,
        timer: 5000,
      });

      setTimeout(() => {
        router.push("/questionnaire/questionnaire/question3");
      }, 5000);

    } catch (error) {
      console.error('Error updating part one:', error);
      setIsLoggingIn(false);
    }
  };

  // La barre de progression de KYC du profil entreprise
  const stepsQuizMifid = ['Partie 1', 'Partie 2', 'Partie 3', 'Partie 4', 'Partie 5', 'Partie 6', 'Partie 7', 'Partie 8'];

  const activeStepQuizMifid = 0;

  // Conditionnez l'affichage de ProgressBar en fonction de la largeur de l'écran
  const [windowWidth, setWindowWidth] = useState(0);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const showProgressBar = windowWidth >= 1180;

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

        router.push('/panel/portefeuille/login');
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
              {showProgressBar && <ProgressBar steps={stepsQuizMifid} activeStep={activeStepQuizMifid} />}

              <div className='mt-15' >

                {/* Les cards */}
                <div className='row mt-5'>
                  <div className='row mt-5' style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className='m-4 p-5 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg rounded-xl bg-white cryptocurrency-search-box login-form col-lg-8 col-md-12'>
                      <form className="m-5" onSubmit={updatePartTwo}>
                        <h4> La situation financière et la capacité d investissement.</h4>
                        <p>Cette partie vise à évaluer votre situation financière actuelle et future, en tenant compte de vos revenus, de vos dépenses, de votre épargne, de votre endettement et de votre patrimoine. Ces informations sont utiles pour apprécier votre capacité d investissement, c est-à-dire le montant que vous pouvez consacrer à votre épargne sans compromettre votre équilibre budgétaire et votre niveau de vie. </p>
                        {quizPartTwo.map((questionData, index) => (
                          <div key={index}>
                            <label className='mb-3'>{questionData.question}</label>
                            {questionData.reponses.map((reponse: { reponse: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactNode | null | undefined; }, idx: React.Key | null | undefined) => (
                              <div key={idx} className='form-group'>
                                <label className='d-flex'>
                                  <input
                                    type='checkbox'
                                    value={reponse.reponse !== null && reponse.reponse !== false ? String(reponse.reponse) : ''}
                                    className='mx-3'
                                    checked={selectedOptions[index]?.reponse === reponse.reponse}
                                    onChange={(event) => handleOptionChange(event, index)}
                                  />
                                  <p className=" mx-2 mb-0">
                                    {reponse.reponse}
                                  </p>
                                </label>
                              </div>
                            ))}

                          </div>
                        ))}
                        {/* Les boutons */}
                        <div className='form-group mb-6 mt-3 col-lg-12 col-md-12'>
                          <button className='btn btn-primary' type='submit' disabled={isLoggingIn}>
                            Suivante
                          </button>
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

