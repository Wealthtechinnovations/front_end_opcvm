"use client";
import { urlconstant, urlstableconstant, API_KEY_STABLECOIN } from "@/app/constants";

import React, { useState, useEffect, Fragment } from 'react';
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';
//import ProgressBar from 'react-bootstrap/ProgressBar';
import ProgressBar from '../../../ProgressBar';
import Header from "@/app/Header";

import 'react-step-progress-bar/styles.css'; // Assurez-vous d'importer les styles CSS si nécessaire
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
  const [quizPartOne, setQuizPartOne] = useState<any[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

  // Effet pour récupérer les questionnaires de la partie 1
  useEffect(() => {
    // Appel à l'API lors du premier rendu du composant
    async function fetchData() {
      try {
        const token = localStorage.getItem('tokenEnCours');
        //const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQ4LCJpc0FkbWluIjowLCJpYXQiOjE3MTE5NjI2ODcsImV4cCI6MTcxMjEzNTQ4N30.wiEHhYxqY0NtgxwUVGUYOD2vHih381Qf3KQh4_2CU2w";
        const result = await fetch(`${urlstableconstant}/api/mifid/find-quiz-part-height`, {
          headers: {
            'x-api-key': API_KEY_STABLECOIN, // Utiliser directement la variable sans ${}
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await result.json();
        setQuizPartOne(data.questions);
        setSelectedOptions(Array(data.questions.length).fill({ reponse: '', points: 0 }));
      } catch (error) {
        console.error('Error fetching quiz part one:', error);
      }
    }

    fetchData();
  }, []); // Dépendance vide pour n'exécuter l'effet qu'une seule fois


  // Effet pour récupérer les questionnaires de l'utilisateur connecté

  // Fonction pour gérer le changement d'option
  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>, questionIndex: number) => {
    const newSelectedOptions = [...selectedOptions];
    const selectedOption = quizPartOne[questionIndex].reponses.find(
      (reponse: { reponse: string; }) => reponse.reponse === event.target.value
    );

    newSelectedOptions[questionIndex] = selectedOption;
    setSelectedOptions(newSelectedOptions);
  };



  // Fonction pour gérer la mise à jour des données de la partie 1
  const updatePartOne = async (event: { preventDefault: () => void; }) => {
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

      let categoryProfilePartHeight = "";
      let commentPartHeight = "";

      if (totalPoint >= -8 && totalPoint <= -4) {
        categoryProfilePartHeight = "Faible";
        commentPartHeight = ": Vous avez une attitude négative ou défavorable face à la perte et au risque. Vous paniquez, vous fuyez, vous ne décidez pas ou vous ne tolérez pas la moindre perte financière. Vous êtes exposé(e) au risque de subir des pertes importantes, de passer à côté des opportunités ou de renoncer à vos objectifs. Vous devriez travailler sur votre confiance en vous, sur votre gestion des émotions et sur votre prise de recul. Vous devriez également vous informer sur les principes et les outils de gestion du risque.";
      } else if (totalPoint >= -3 && totalPoint <= 3) {
        categoryProfilePartHeight = "Moyenne";
        commentPartHeight = "Vous avez une attitude neutre ou mitigée face à la perte et au risque. Vous vous inquiétez, vous subissez, vous décidez vite ou vous tolérez une perte financière modérée. Vous êtes capable de faire face aux fluctuations du marché, mais pas toujours avec sérénité ou efficacité. Vous devriez travailler sur votre connaissance de vous-même, sur votre gestion du stress et sur votre prise de décision. Vous devriez également vous renseigner sur les stratégies et les techniques de gestion du risque.";
      } else if (totalPoint >= 4 && totalPoint <= 12) {
        categoryProfilePartHeight = "Elevée";
        commentPartHeight = "Vous avez une attitude positive ou favorable face à la perte et au risque. Vous vous renseignez, vous maîtrisez, vous décidez rationnellement ou vous tolérez une perte financière élevée. Vous êtes capable de tirer parti des fluctuations du marché, avec confiance et performance. Vous devriez travailler sur votre adaptation au changement, sur votre gestion de la performance et sur votre prise de risque. Vous devriez également vous appuyer sur votre expérience et votre connaissance pour optimiser le couple rendement/risque.";
      }
      // Stockage dans le localStorage
      localStorage.setItem("categoryProfilePartHeight", categoryProfilePartHeight);
      localStorage.setItem("commentPartHeight", commentPartHeight);

      const total1 = localStorage.getItem('totalPoint1');
      const total2 = localStorage.getItem('totalPoint2');
      const total3 = localStorage.getItem('totalPoint3');
      const total4 = localStorage.getItem('totalPoint4');
      const total5 = localStorage.getItem('totalPoint5');
      const total6 = localStorage.getItem('totalPoint6');
      const total7 = localStorage.getItem('totalPoint7');

      const totalPointGlobal =
        (Number(total1) || 0) +
        (Number(total2) || 0) +
        (Number(total3) || 0) +
        (Number(total4) || 0) +
        (Number(total5) || 0) +
        (Number(total6) || 0) +
        (Number(total7) || 0) +
        (Number(totalPoint) || 0);
      console.log(total7);

      console.log(totalPointGlobal);

      let categoryProfileGlobal = "";
      let fundtype = "";
      let durationInvestment = "";
      let volatilityPortfolioTarget = "";
      let commentGlobal = "";

      // Définir la catégorie de profil global de l'utilisateur
      if (totalPointGlobal >= -64 && totalPointGlobal <= -24) {
        categoryProfileGlobal = "Sécuritaire";
        fundtype = "Vous devriez investir principalement sur des fonds monétaires ou obligataires, qui offrent une faible volatilité (inférieure à 5%) et une faible rentabilité, mais qui garantissent la préservation du capital et la liquidité du placement.";
        durationInvestment = "Vous devriez investir sur une durée courte (MOINS D UN AN) ou moyenne (entre un et cinq ans), en fonction de vos projets financiers à court ou moyen terme.";
        volatilityPortfolioTarget = "Inférieure à 5%";
        commentGlobal = "Vous avez un profil d'investisseur sécuritaire, qui privilégie la préservation du capital et la stabilité du rendement. Vous avez une faible capacité d'investissement, une faible connaissance des instruments financiers, une faible expérience en matière d'investissement, des besoins limités ou variés en termes d'investissement, des objectifs modérés ou variés pour l'investissement, des préférences limitées ou variées en matière d'investissement et une faible tolérance au risque. Vous devriez investir principalement sur des supports garantis ou peu risqués, tels que les livrets, les fonds euros ou les obligations.";
      } else if (totalPointGlobal >= -23 && totalPointGlobal <= -8) {
        categoryProfileGlobal = "Prudent";
        fundtype = "vous devriez investir sur des fonds diversifiés ou patrimoniaux, qui offrent une volatilité modérée (entre 5% et 10%) et une rentabilité moyenne, mais qui permettent de concilier la sécurité du capital et la recherche de rendement.";
        durationInvestment = "Vous devriez investir sur une durée moyenne (entre un et cinq ans) ou longue (plus de cinq ans), en fonction de vos projets financiers à moyen ou long terme.";
        volatilityPortfolioTarget = "Entre 5% et 10%)";
        commentGlobal = "Vous avez un profil d'investisseur prudent, qui cherche à concilier la sécurité du capital et la recherche de rendement. Vous avez une capacité d'investissement moyenne, une connaissance générale des instruments financiers, une expérience modérée en matière d'investissement, des besoins diversifiés ou modérés en termes d'investissement, des objectifs raisonnables ou satisfaisants pour l'investissement, des préférences diversifiées ou modérées en matière d'investissement et une tolérance modérée au risque. Vous devriez investir sur des supports équilibrés ou modérément risqués, tels que les fonds diversifiés, les actions ou les ETF.";
      } else if (totalPointGlobal >= -7 && totalPointGlobal <= 7) {
        categoryProfileGlobal = "Equilibré";
        fundtype = "Vous devriez investir sur des fonds actions ou thématiques, qui offrent une volatilité élevée (entre 10% et 20%) et une rentabilité élevée, mais qui impliquent de maîtriser le risque et d'optimiser le couple rendement/risque.";
        durationInvestment = "Vous devriez investir sur une durée longue (plus de cinq ans) ou très longue (plus de dix ans), en fonction de vos projets financiers à long ou très long terme.";
        volatilityPortfolioTarget = "Entre 10% et 20%";
        commentGlobal = "Vous avez un profil d'investisseur équilibré, qui vise à optimiser le rendement du capital tout en maîtrisant le risque. Vous avez une capacité d'investissement élevée, une connaissance solide des instruments financiers, une expérience solide en matière d'investissement, des besoins importants ou spécifiques en termes d'investissement, des objectifs judicieux ou optimisés pour l'investissement, des préférences importantes ou spécifiques en matière d'investissement et une tolérance élevée au risque. Vous devriez investir sur des supports dynamiques ou très risqués, tels que les produits dérivés, les options ou les warrants.";
      } else if (totalPointGlobal >= 8 && totalPointGlobal <= 64) {
        categoryProfileGlobal = "Dynamique";
        fundtype = "vous devriez investir sur des fonds alternatifs ou spéculatifs, qui offrent une volatilité très élevée (supérieure à 20%) et une rentabilité très élevée, mais qui exposent à des pertes importantes ou totales.";
        durationInvestment = "Vous devriez investir sur une durée très longue (plus de dix ans) ou indéterminée, en fonction de vos projets financiers à très long terme ou sans échéance ";
        volatilityPortfolioTarget = "Supérieure à 20%";
        commentGlobal = "Vous avez un profil d'investisseur dynamique, qui privilégie la valorisation du capital et la performance du rendement. Vous avez une capacité d'investissement très élevée, une connaissance complète des instruments financiers, une expérience étendue en matière d'investissement, des besoins spécifiques ou importants en termes d'investissement, des objectifs ambitieux ou exigeants pour l'investissement, des préférences spécifiques ou importantes en matière d'investissement et une tolérance très élevée au risque. Vous devriez investir sur des supports innovants ou extrêmement risqués, tels que l'art, le vin, les crypto-monnaies ou les marchés exotiques.";
      }
      else if (totalPointGlobal > 64) {
        categoryProfileGlobal = "Dynamique";
        fundtype = "vous devriez investir sur des fonds alternatifs ou spéculatifs, qui offrent une volatilité très élevée (supérieure à 20%) et une rentabilité très élevée, mais qui exposent à des pertes importantes ou totales.";
        durationInvestment = "Vous devriez investir sur une durée très longue (plus de dix ans) ou indéterminée, en fonction de vos projets financiers à très long terme ou sans échéance ";
        volatilityPortfolioTarget = "Supérieure à 20%";
        commentGlobal = "Vous avez un profil d'investisseur dynamique, qui privilégie la valorisation du capital et la performance du rendement. Vous avez une capacité d'investissement très élevée, une connaissance complète des instruments financiers, une expérience étendue en matière d'investissement, des besoins spécifiques ou importants en termes d'investissement, des objectifs ambitieux ou exigeants pour l'investissement, des préférences spécifiques ou importantes en matière d'investissement et une tolérance très élevée au risque. Vous devriez investir sur des supports innovants ou extrêmement risqués, tels que l'art, le vin, les crypto-monnaies ou les marchés exotiques.";
      }

      // variable qui contient les données du questionnaire
      const quiz = {
        totalPointPartHeight: totalPoint,
        categoryPartHeight: categoryProfilePartHeight,
        commentPartHeight: commentPartHeight,
        totalPoint: totalPointGlobal,
        categoryProfileGlobal: categoryProfileGlobal,
        commentGlobal: commentGlobal,
        fundtype: fundtype,
        durationInvestment: durationInvestment,
        volatilityPortfolioTarget: volatilityPortfolioTarget,
        status: true,
      };

      const quizJSON = JSON.stringify(quiz);

      // Stocker la chaîne JSON dans le localStorage avec une clé spécifique
      localStorage.setItem('quizData', quizJSON);


      Swal.fire({
        position: 'center',
        icon: 'success',
        html: `<p> Vos réponses ont été sauvegardées avec succès.</p>`,
        showConfirmButton: false,
        timer: 5000,
      });

      setTimeout(() => {
        router.push("/questionnaire/profile");
      }, 5000);

    } catch (error) {
      console.error('Error updating part one:', error);
      setIsLoggingIn(false);
    }
  };

  // La barre de progression de KYC du profil entreprise
  const stepsQuizMifid = ['Partie 1', 'Partie 2', 'Partie 3', 'Partie 4', 'Partie 5', 'Partie 6', 'Partie 7', 'Partie 8'];

  const activeStepQuizMifid = 6;

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
              {showProgressBar && <ProgressBar steps={stepsQuizMifid} activeStep={activeStepQuizMifid} />}

              <div className='mt-15' >


                {/* Les cards */}
                <div className='row mt-5'>
                  <div className='row mt-5' style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className='m-4 p-5 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg rounded-xl bg-white cryptocurrency-search-box login-form col-lg-8 col-md-12'>
                      <form className="m-5" onSubmit={updatePartOne}>
                        <h4>L’attitude face à la perte et l’aversion aux risques.</h4>
                        <p>Cette partie vise à mesurer votre attitude face à la perte et votre aversion aux risques, en tenant compte de vos réactions, de vos comportements, de vos décisions et de votre tolérance. Ces informations sont utiles pour apprécier votre capacité à supporter les fluctuations du marché, à gérer le stress et à optimiser le couple rendement/risque.</p>
                        {quizPartOne.map((questionData, index) => (
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

