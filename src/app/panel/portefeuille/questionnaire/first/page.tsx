"use client";
import { urlconstant, urlstableconstant, API_KEY_STABLECOIN } from "@/app/constants";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';
//import ProgressBar from 'react-bootstrap/ProgressBar';
import ProgressBar from '../../../../ProgressBar';
import 'react-step-progress-bar/styles.css'; // Assurez-vous d'importer les styles CSS si nécessaire
import Header from "@/app/Header";
import Link from "next/link";
import { Button } from "react-bootstrap";

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
  typeProfile: any;
  percentage: any;
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

export default function CConditionsProfil(props: PageProps): JSX.Element {
  // Variable de l'url de l'api
  let id = props.searchParams.id;

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [messageError, setMessageError] = useState();

  // Les states du formualaire du modal
  const [selectedOption, setSelectedOption] = useState('');

  // Les réponses des questions du modal
  const answerOne = "Je suis d’accord que mon profil d’investisseur est conforme au profil précisé ci-dessus. J ’aimerais sélectionner une stratégie de répartition de l’actif qui correspond à ce profil. Je comprends les risques associés à ce profil d’investissement et suis conscient(e) que ces risques ont une incidence sur la valeur de mon portefeuille de placement. J’aviserai mon conseiller de tout changement susc eptible d’avoir une incidenc e sur mes objectifs de placement et du profil d’investisseur qui en découle.";
  const answerTwo = "Je préfère ne pas sélectionner parmi les options de placement qui correspondent à la catégorie de profil d’investisseur précisée ci-dessus pour mon portefeuille de placement, et je vais sélectionner une combinaison différente d’options de placement.";
  const answerThree = "Le choix d’une répartition de l’actif qui correspond à votre profil d’investisseur ne garantit pas que vous atteigniez vos objectifs financiers. D’autres facteurs, tels que les sommes nécessaires pour financer vos objectifs et vos habitudes d’épargne, doivent également être pris en compte. Votre conseiller peut vous aider à planifier les mesures à prendre pour atteindre vos objectifs.";
  const answerFour = "La notice explicative comprend des renseignements importants touchant les fonds. Vous devez la lire attentivement avant de prendre toute décision. Sauf et exceptée la garantie s’appliquant au décès ou à l’échéance, toute fraction de la cotisation ou toute somme affectée à un fonds distinct est déposée aux risques de l’investisseur. Sa valeur peut augmenter ou décroître en fonction des fluctuations des actifs du fonds sur les marchés. L’information sur le rendement est un reflet des rendements antérieurs et ne garantit pas les rendements futurs.";


  const handleOptionChange = (event: { target: { value: any; }; }) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
  };

  const router = useRouter();


  // Fonction d'envoie (Modifier) des données du champ conditions
  const updateFieldConditions = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    setIsLoggingIn(true);
    try {

      const dataa = {
        conditions: selectedOption,
      }

      const token = localStorage.getItem('tokenEnCours') //Le token récuperé
      console.log(token)
      const result = await fetch(`${urlstableconstant}/api/profile/opcvm/update-field-conditions`, {
        method: "PUT",
        body: JSON.stringify(dataa),
        headers: {
          'x-api-key': API_KEY_STABLECOIN, // Utiliser directement la variable sans ${}
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
          html: `<p> Votre réponse a été sauvegardée avec succès.</p>`,
          showConfirmButton: false,
          timer: 5000
        }),
          setTimeout(() => {
            router.push("/panel/portefeuille/questionnaire/typeprofil");
          }, 3000)
      }
      // Fin condition 
    } catch {
      setIsLoggingIn(false);
    }
  };
  // Fin



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

      <div className='mt-100' >


        {/* Les cards */}
        <div className='row '>
          <div className='col-lg-3 col-md-12'></div>
          <div className='m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg  rounded-xl bg-white cryptocurrency-search-box login-form col-lg-8 col-md-12'>
            <h3 className='mb-3 m-5'>
              Cochez l’énoncé qui s’applique à vous :
            </h3>
            {/* FORM  */}
            <form onSubmit={updateFieldConditions}>
              <div className='form-group my-3'>
                <label className='gr-check-input d-flex'>
                  <input
                    type='checkbox'
                    className='mx-3'
                    checked={selectedOption === answerOne}
                    onChange={handleOptionChange}
                  />
                  {answerOne}
                </label>
              </div>
              <div className='form-group my-3'>
                <label className='gr-check-input d-flex'>
                  <input
                    type='checkbox'
                    value={answerTwo}
                    className='mx-3'
                    checked={selectedOption === answerTwo}
                    onChange={handleOptionChange}
                  />
                  {answerTwo}
                </label>
              </div>
              <div className='form-group my-3'>
                <label className='gr-check-input d-flex'>
                  <input
                    type='checkbox'
                    value={answerThree}
                    className='mx-3'
                    checked={selectedOption === answerThree}
                    onChange={handleOptionChange}
                  />
                  {answerThree}
                </label>
              </div>
              <div className='form-group my-3'>
                <label className='gr-check-input d-flex'>
                  <input
                    type='checkbox'
                    value={answerFour}
                    className='mx-3'
                    checked={selectedOption === answerFour}
                    onChange={handleOptionChange}
                  />
                  {answerFour}
                </label>
              </div>

              {/* Les boutons */}
              <div className='form-group mb-6 mt-3 col-lg-12 col-md-12'>
                <button className="btn btn-primary" type='submit' disabled={isLoggingIn}> Soumettre </button>
              </div>
            </form>
          </div>
          <div className='col-lg-3 col-md-12'></div>
        </div>
      </div>
    </>
  );
};


