"use client";
import moment from 'moment';
import { urlconstant, urlstableconstant, API_KEY_STABLECOIN } from "@/app/constants";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';
//import ProgressBar from 'react-bootstrap/ProgressBar';
import ProgressBar from '../../../../ProgressBar';
import 'react-step-progress-bar/styles.css'; // Assurez-vous d'importer les styles CSS si nécessaire
import Header from "@/app/Header";
import Link from "next/link";
import { useCallback, useState, useEffect } from 'react';
import React from "react";
import axios from 'axios';


// Pour Magic
import { magic } from "../../../../../../magic";
import { ethers } from "ethers";
import Router from "next/router";
interface KycForParticular {
    userId: string;
    // Add other properties as needed
}

interface PageProps {
    searchParams: {
        selectedfund: any;
        portefeuille: any;
        selectedValuename: any;
        id: any
    };
}
interface User {
    nativeCountry: string;
    lastName: string;
    birthday: any;
    nationality: any;
    firstName: any
    // Add other properties as needed
}
interface CurrentUserCountry {
    libelle: any;
}
export default function Profile(props: PageProps): JSX.Element {
    // Variable de l'url de l'api
    let id = props.searchParams.id;
    const router = useRouter();

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [messageError, setMessageError] = useState();
    const [currentUser, setCurrentUser] = useState<User | null>(null); // Initialize as User or null
    const [currentUserCountry, setCurrentUserCountry] = useState<CurrentUserCountry | null>(null);


    // States du formulaire

    const [civility, setCivility] = useState<string | undefined>(undefined);
    const [fatherName, setFatherName] = useState<string | undefined>(undefined);
    const [motherName, setMotherName] = useState<string | undefined>(undefined);
    const [familyStatus, setFamilyStatus] = useState<string | undefined>(undefined);
    const [language, setLanguage] = useState<string | undefined>(undefined);

    // Pour les infos qui existent déjà dans la table Users
    const [firstName, setFirstName] = useState<string | undefined>(undefined);
    const [lastName, setLastName] = useState<string | undefined>(undefined);
    const [nationality, setNationality] = useState<string | undefined>(undefined);
    const [nativeCountry, setNativeCountry] = useState<string | undefined>(undefined);
    const [birthday, setBirthday] = useState<string | undefined>(undefined);





    useEffect(() => {
        (async () => {
            const token = localStorage.getItem('tokenEnCours') //Le token récuperé

            // Obtenir l'utilisateur qui est connecté
            const getUser = async () => {
                const result = await fetch(`${urlstableconstant}/api/user/find-user-sign-in`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': `${API_KEY_STABLECOIN}`,
                        Authorization: `Bearer ${token}`

                    },
                })
                    .then((result) => result.json())
                    .then((user) => {
                        setCurrentUser(user)

                    })
            };
            await getUser();
            // Fin


            // Obtenir le pays de l'utilisateur connecté
            if (currentUser?.nativeCountry) {
                const getUserCountry = async () => {
                    const resultCountry = await fetch(`${urlstableconstant}/api/country/find-one/${currentUser?.nativeCountry}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': `${API_KEY_STABLECOIN}`,
                        },
                    })

                        .then((resultCountry) => resultCountry.json())
                        .then((userCountry) => {
                            setCurrentUserCountry(userCountry)
                        })
                };
                await getUserCountry();

            }
            // Fin

        })();
    }, [currentUser]);
    // Fin



    // Fonction d'envoie des informations du justificatif d'identité
    const updateJustificatifIdentite = async (event: { preventDefault: () => void; }) => {
        setIsLoggingIn(true);
        event.preventDefault();

        try {

            const dataa = {
                civility: civility,
                fatherName: fatherName,
                motherName: motherName,
                familyStatus: familyStatus,
                language: language,
            }
            // Condition pour forcer l'utilisateur à choisir au moins une reponse
            // if () {


            const token = localStorage.getItem('tokenEnCours') //Le token récuperé

            const result = await fetch(`${urlstableconstant}/api/kyc/particular/add-kyc-identity`, {
                method: "PUT",
                body: JSON.stringify(dataa),
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
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
                updateInfosUser() //Appel de la fonction updateInfosUser() 



            }
            // Fin condition 
        } catch {
            setIsLoggingIn(false);
        }

    };
    // Fin              


    // Fonction de modification des infos de l'utisateur qui sont dans justificatif d'identité
    const updateInfosUser = useCallback(async () => {
        setIsLoggingIn(true);

        try {

            const dataInfosUser = {
                firstName: firstName,
                lastName: lastName,
                nationality: nationality,
                nativeCountry: nativeCountry,
                birthday: birthday,

            }
            const token = localStorage.getItem('tokenEnCours') //Le token récuperé

            const result = await fetch(`${urlstableconstant}/api/kyc/particular/update-user-kyc-identity`, {
                method: "PUT",
                body: JSON.stringify(dataInfosUser),
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': `${API_KEY_STABLECOIN}`,
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
                        if (currentKycStatut === "1") {
                            router.push("/panel/portefeuille/Kyc_particulier/resultat-kyc");

                        } else {
                            router.push("/panel/portefeuille/Kyc_particulier/question5");
                        }
                    }, 5000)
            }
            // Fin condition 

        } catch {
            setIsLoggingIn(false);
        }

    }, [firstName, lastName, nationality, nativeCountry, birthday]);
    // Fin 







    // State de la question 1 et 3
    const [statutQ1, setStatutQ1] = useState();
    const [statutQ3, setStatutQ3] = useState();
    // FIN

    const [kycForParticular, setKycForParticular] = useState();
    const [currentKycStatut, setCurrentKycStatut] = useState<string | null>(null); // Initialize as string or null

    //localStorage pour récupérer une valeur en cliquant sur un bouton Recompleter qui indique qu'on veut modifier une partie Kyc 
    useEffect(() => {
        const kycStatut = localStorage.getItem('currentUpdateKycStatut')
        setCurrentKycStatut(kycStatut)
    }, [currentKycStatut]);
    // Fin


    // RECUPERER KYC DE L'UTILISATEUR
    useEffect(() => {
        // Appel à l'API lors du premier rendu du composant
        async function fetchData() {
            try {
                const token = localStorage.getItem('tokenEnCours')

                const resKyc = await fetch(`${urlstableconstant}/api/kyc/particular/find-kyc-particular-for-user`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': `${API_KEY_STABLECOIN}`,
                        Authorization: `Bearer ${token}`,
                    },
                })
                    .then((resKyc) => resKyc.json())
                    .then((data) => {
                        setKycForParticular(data)
                    })
            } catch (error) {
                console.error('Error fetching quiz part one:', error);
            }
        }

        fetchData();
    }, []);
    // FIN


    // FONCTION POUR FORMATER LA DATE
    const formatDate = (_updatedAt: moment.MomentInput) => {
        const maDate = moment(_updatedAt).format('DD/MM/YYYY');
        return maDate
    }
    //  FIN

    // La barre de progression de KYC
    const steps = ["AML 1 & 2", "FATCA", "Identité 1 & 2", "Selfie", "Domicile", "Photo", "Signature"];
    const activeStep = 1;
    // Fin



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
            <ProgressBar steps={steps} activeStep={activeStep} />

            <div className='mt-15' >
                <div className=' mx-15'>
                    <div className='py-10'>
                        <br /><br /><h1 className='text-center '>Justificatif d identité</h1>
                    </div>
                </div>



                {/* Les cards */}
                <div className='row'>
                    <div className='col-lg-3 col-md-12'></div>

                    <div className='m-4 p-3 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg rounded-xl bg-white cryptocurrency-search-box login-form col-lg-8 col-md-12'>
                        <form className='' onSubmit={updateJustificatifIdentite}>
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="civility"
                                    className="text-blackish-blue mb-2"
                                >
                                    Civilité
                                </label>
                                <select
                                    className="form-control"
                                    id="civility"
                                    required
                                    defaultValue={civility}
                                    onChange={(event) => setCivility(event.target.value)}
                                >
                                    <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                        <option value="M.">M.</option>
                                        <option value="Mme">Mme</option>
                                        <option value="Mlle">Mlle</option>
                                    </optgroup>
                                </select>
                            </div >

                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="lastName"
                                    className="text-blackish-blue mb-2"
                                >
                                    Votre nom
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='lastName'
                                        className='form-control'
                                        placeholder='Votre nom'
                                        defaultValue={currentUser?.lastName}
                                        onChange={(event) => setLastName(event.target.value)}
                                    />
                                </div>
                            </div >
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="firstName"
                                    className="text-blackish-blue mb-2"
                                >
                                    Vos prénoms
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='firstName'
                                        className='form-control'
                                        placeholder='Vos prénoms'
                                        defaultValue={currentUser?.firstName}
                                        onChange={(event) => setFirstName(event.target.value)}

                                    />
                                </div>
                            </div >
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="fatherName"
                                    className="text-blackish-blue mb-2"
                                >
                                    Nom et prénoms du père
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='fatherName'
                                        className='form-control'
                                        placeholder='Nom et prénoms du père'
                                        defaultValue={fatherName}
                                        onChange={(event) => setFatherName(event.target.value)}
                                    />
                                </div>
                            </div >
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="motherName"
                                    className="text-blackish-blue mb-2"
                                >
                                    Nom et prénoms de la mère
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='motherName'
                                        className='form-control'
                                        placeholder='Nom et prénoms de la mère'
                                        defaultValue={motherName}
                                        onChange={(event) => setMotherName(event.target.value)}
                                    />
                                </div>
                            </div >
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="familyStatus"
                                    className="text-blackish-blue mb-2"
                                >
                                    Situation familiale
                                </label>
                                <select
                                    className="form-control"
                                    id="familyStatus"
                                    required
                                    defaultValue={familyStatus}
                                    onChange={(event) => setFamilyStatus(event.target.value)}
                                >
                                    <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                        <option value="Célibataire">Célibataire</option>
                                        <option value="Marié(e)">Marié(e)</option>
                                        <option value="Divorcé(e)">Divorcé(e)</option>
                                        <option value="Veuf(ve)">Veuf(ve)</option>
                                    </optgroup>
                                </select>
                            </div >
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="language"
                                    className="text-blackish-blue mb-2"
                                >
                                    Langue
                                </label>
                                <select
                                    className="form-control"
                                    id="language"
                                    required
                                    defaultValue={language}
                                    onChange={(event) => setLanguage(event.target.value)}
                                >
                                    <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                        <option value="Français">Français</option>
                                        <option value="Anglais">Anglais</option>
                                        <option value="Autre">Autre</option>
                                    </optgroup>
                                </select>
                            </div >

                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="nationality"
                                    className="text-blackish-blue mb-2"
                                >
                                    Nationalité
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='nationality'
                                        className='form-control'
                                        defaultValue={currentUser?.nationality}
                                        onChange={(event) => setNationality(event.target.value)}
                                    />
                                </div>
                            </div >
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="nativeCountry"
                                    className="text-blackish-blue mb-2"
                                >
                                    Pays de Naissance
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='text'
                                        id='nativeCountry'
                                        className='form-control'
                                        placeholder='Pays de Naissance'
                                        defaultValue={currentUserCountry?.libelle}
                                        onChange={(event) => setNativeCountry(event.target.value)}
                                    />
                                </div>
                            </div >
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="dateBirth"
                                    className="text-blackish-blue mb-2"
                                >
                                    Date de naissance ({formatDate(currentUser?.birthday)}) si cette date est incorrecte veuillez saisir la bonne sinon laissez le champ vide.
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='date'
                                        id='dateBirth'
                                        className='form-control'
                                        placeholder='Date de naissance'
                                        defaultValue={formatDate(currentUser?.birthday)}
                                        onChange={(event) => setBirthday(event.target.value)}
                                    />
                                </div>
                            </div >



                            {/* <p className="colorRed mb-7 ">
                                NB : Aucun retour n'est permis sur cette page donc, répondez correctement aux questions
                            </p> */}

                            {/* {kycForParticular?.userId ? (
                                <button className="btn btn-primary " type='button' onClick={updateQuestionnaire}  disabled={isLoggingIn}>Suivant</button>
                            ) : (
                                <button className="btn btn-primary " type='button' onClick={addQuestionnaire}  disabled={isLoggingIn}>Suivant</button>
                            )} */}

                            <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                                <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">

                                </div>
                                <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">

                                    <button className="btn btn-primary " type='submit'  > Suivant </button>

                                </div>
                            </div>
                            {/* <button className="btn btn-primary "  disabled={isLoggingIn}>Suivant</button> */}
                        </form>
                    </div>
                    <div className='col-lg-3 col-md-12'></div>
                </div>
            </div>
        </>
    );
};

