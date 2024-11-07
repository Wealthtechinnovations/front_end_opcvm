"use client";
import { urlconstant, urlstableconstant, API_KEY_STABLECOIN } from "@/app/constants";

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';
//import ProgressBar from 'react-bootstrap/ProgressBar';
import ProgressBar from '../../../../ProgressBar';

import 'react-step-progress-bar/styles.css'; // Assurez-vous d'importer les styles CSS si nécessaire
import Header from "@/app/Header";
import Link from "next/link";
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

        const result = await fetch(`${urlstableconstant}/api/mifid/find-quiz-part-five`, {
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
      const dataToUpdate = {
        pointOnePartOne: selectedOptions[0].points,
        pointTwoPartOne: selectedOptions[1].points,
        pointThreePartOne: selectedOptions[2].points,
        pointFourPartOne: selectedOptions[3].points,
      };

      const token = localStorage.getItem('tokenEnCours');
      //const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQ4LCJpc0FkbWluIjowLCJpYXQiOjE3MTE5NjI2ODcsImV4cCI6MTcxMjEzNTQ4N30.wiEHhYxqY0NtgxwUVGUYOD2vHih381Qf3KQh4_2CU2w";

      const result = await fetch(`${urlstableconstant}/api/mifid/update-part-five`, {
        method: 'PUT',
        body: JSON.stringify(dataToUpdate),
        headers: {
          'x-api-key': API_KEY_STABLECOIN, // Utiliser directement la variable sans ${}
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await result.json();

      if (data.message) {
        setMessageError(data.message);
        setIsLoggingIn(false);

        Swal.fire({
          position: 'center',
          icon: 'error',
          html: `<p> ${messageError} </p>`,
          showConfirmButton: false,
          timer: 10000,
        });
      } else {
        Swal.fire({
          position: 'center',
          icon: 'success',
          html: `<p> Vos réponses ont été sauvegardées avec succès.</p>`,
          showConfirmButton: false,
          timer: 5000,
        });

        setTimeout(() => {
          router.push('/portefeuille/questionnaire/question6');
        }, 5000);
      }
    } catch (error) {
      console.error('Error updating part one:', error);
      setIsLoggingIn(false);
    }
  };

  // La barre de progression de KYC du profil entreprise
  const stepsQuizMifid = ['Partie 1', 'Partie 2', 'Partie 3', 'Partie 4', 'Partie 5', 'Partie 6', 'Partie 7', 'Partie 8'];

  const activeStepQuizMifid = 3;

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
      {showProgressBar && <ProgressBar steps={stepsQuizMifid} activeStep={activeStepQuizMifid} />}

      <div className='mt-15' >
        {/* Les images de fond */}
        <div className='shape1'></div>
        <div className='shape2 mb-5'><br /></div>
        <div className='shape3'></div>
        <div className='shape4'><img src='/images/shape/shape4.png' alt='image' /></div>
        {/* Fin des images de fond */}

        {/* Les cards */}
        <div className='row mt-5'>
          <div className='col-lg-3 col-md-12'></div>
          <div className='m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg rounded-xl bg-white cryptocurrency-search-box login-form col-lg-8 col-md-12'>
            <form className="m-5" onSubmit={updatePartOne}>
              <h4>Les besoins en termes d investissement.</h4>
              <p>Cette partie vise à identifier vos besoins en matière d investissement, en tenant compte de vos projets, de vos contraintes, de vos attentes et de vos priorités. Ces informations sont utiles pour apprécier votre capacité à adapter votre portefeuille à votre situation personnelle et à vos objectifs financiers.</p>
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
          <div className='col-lg-3 col-md-12'></div>
        </div>
      </div>
    </>
  );
};

