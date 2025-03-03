"use client";
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
interface QuizMifidOfUser {
    userId: string;
    // Autres propriétés...
}
export default function Profile(props: PageProps): JSX.Element {
    // Variable de l'url de l'api
    let id = props.searchParams.id;
    const router = useRouter();

    // Variable de l'api key de stablecoin

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [messageError, setMessageError] = useState();

    // State de la question 2
    const [spentA, setSpentA] = useState<string[]>([]); // Initialize spentA as an array of strings
    const [spentB, setSpentB] = useState<string[]>([]); // Initialize spentA as an array of strings
    const [spentC, setSpentC] = useState<string[]>([]); // Initialize spentA as an array of strings
    const [spentD, setSpentD] = useState<string[]>([]); // Initialize spentA as an array of strings
    const [spentE, setSpentE] = useState<string[]>([]); // Initialize spentA as an array of strings
    const [spentF, setSpentF] = useState<string[]>([]); // Initialize spentA as an array of strings

    // State de la question 4
    const [frequencyA, setFrequencyA] = useState<string[]>([]); // Initialize spentA as an array of strings
    const [frequencyB, setFrequencyB] = useState<string[]>([]); // Initialize spentA as an array of strings
    const [frequencyC, setFrequencyC] = useState<string[]>([]); // Initialize spentA as an array of strings

    // State de la question 5
    const [incomeTypeA, setIncomeTypeA] = useState<string[]>([]); // Initialize spentA as an array of strings
    const [incomeTypeB, setIncomeTypeB] = useState<string[]>([]); // Initialize spentA as an array of strings
    const [incomeTypeC, setIncomeTypeC] = useState<string[]>([]); // Initialize spentA as an array of strings

    // State de la question 1 et 3
    const [statutQ1, setStatutQ1] = useState<string | undefined>(undefined); // Initialize as string or undefined
    const [statutQ3, setStatutQ3] = useState<string | undefined>(undefined); // Initialize as string or undefined

    // FIN

    const [kycForParticular, setKycForParticular] = useState<KycForParticular | null>(null); // Initialize as KycForParticular or null



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

                const getKycForParticular = async () => {
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
                };
            } catch (error) {
                console.error('Error fetching quiz part one:', error);
            }
        }

        fetchData();
    }, []);
    // FIN








    // Fonction d'envoie des informations du questionnaire
    const addQuestionnaire = useCallback(async () => {
        setIsLoggingIn(true);

        try {
            const dataTable = {
                spentA: Object.assign({}, spentA),
                spentB: Object.assign({}, spentB),
                spentC: Object.assign({}, spentC),
                spentD: Object.assign({}, spentD),
                spentE: Object.assign({}, spentE),
                spentF: Object.assign({}, spentF),
                frequencyA: Object.assign({}, frequencyA),
                frequencyB: Object.assign({}, frequencyB),
                frequencyC: Object.assign({}, frequencyC),
                incomeTypeA: Object.assign({}, incomeTypeA),
                incomeTypeB: Object.assign({}, incomeTypeB),
                incomeTypeC: Object.assign({}, incomeTypeC)
            }

            const dataa = {
                spentA: dataTable?.spentA[0],
                spentB: dataTable?.spentB[0],
                spentC: dataTable?.spentC[0],
                spentD: dataTable?.spentD[0],
                spentE: dataTable?.spentE[0],
                spentF: dataTable?.spentF[0],
                frequencyA: dataTable?.frequencyA[0],
                frequencyB: dataTable?.frequencyB[0],
                frequencyC: dataTable?.frequencyC[0],
                incomeTypeA: dataTable?.incomeTypeA[0],
                incomeTypeB: dataTable?.incomeTypeB[0],
                incomeTypeC: dataTable?.incomeTypeC[0],

            }
            // Condition pour forcer l'utilisateur à choisir au moins une reponse
            if (dataa?.spentA || dataa?.spentB || dataa?.spentC || dataa?.spentD || dataa?.spentE || dataa?.spentF || dataa?.frequencyA || dataa?.frequencyB || dataa?.frequencyC || dataa?.incomeTypeA || dataa?.incomeTypeB || dataa?.incomeTypeC) {


                const token = localStorage.getItem('tokenEnCours') //Le token récuperé

                const result = await fetch(`${urlstableconstant}/api/kyc/particular/add-kyc-questionnaires`, {
                    method: "POST",
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
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        html: `<p> Vos réponses ont été sauvegardées avec succès.</p>`,
                        showConfirmButton: false,
                        timer: 5000
                    }),
                        setTimeout(() => {
                            router.push("/portefeuille/Kyc_particulier/question2");
                            // Router.push("/profil/kyc/particulier/seconde-phase");

                        }, 5000)
                }
                // Fin condition 
            } else {
                setIsLoggingIn(false);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    html: `<p> Désolé, vous devez repondre à une question au moins. </p>`,
                    showConfirmButton: false,
                    timer: 10000
                })
            }

        } catch {
            setIsLoggingIn(false);
        }

    }, [spentA, spentB, spentC, spentD, spentE, spentF, frequencyA, frequencyB, frequencyC, incomeTypeA, incomeTypeB, incomeTypeC]);
    // Fin


    // Fonction d'envoie des informations du questionnaire
    const updateQuestionnaire = useCallback(async () => {
        setIsLoggingIn(true);

        try {
            const dataTable = {
                spentA: Object.assign({}, spentA),
                spentB: Object.assign({}, spentB),
                spentC: Object.assign({}, spentC),
                spentD: Object.assign({}, spentD),
                spentE: Object.assign({}, spentE),
                spentF: Object.assign({}, spentF),
                frequencyA: Object.assign({}, frequencyA),
                frequencyB: Object.assign({}, frequencyB),
                frequencyC: Object.assign({}, frequencyC),
                // incomeTypeA:Object.assign({}, incomeTypeA),
                // incomeTypeB:Object.assign({},incomeTypeB),
                // incomeTypeC:Object.assign({},incomeTypeC)
            }

            const dataa = {
                spentA: dataTable?.spentA[0],
                spentB: dataTable?.spentB[0],
                spentC: dataTable?.spentC[0],
                spentD: dataTable?.spentD[0],
                spentE: dataTable?.spentE[0],
                spentF: dataTable?.spentF[0],
                frequencyA: dataTable?.frequencyA[0],
                frequencyB: dataTable?.frequencyB[0],
                frequencyC: dataTable?.frequencyC[0],


            }
            // Condition pour forcer l'utilisateur à choisir au moins une reponse
            if (dataa?.spentA || dataa?.spentB || dataa?.spentC || dataa?.spentD || dataa?.spentE || dataa?.spentF || dataa?.frequencyA || dataa?.frequencyB || dataa?.frequencyC) {


                const token = localStorage.getItem('tokenEnCours') //Le token récuperé

                const result = await fetch(`${urlstableconstant}/api/kyc/particular/update-kyc-questionnaires`, {
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
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        html: `<p> Vos réponses ont été sauvegardées avec succès.</p>`,
                        showConfirmButton: false,
                        timer: 5000
                    }),
                        setTimeout(() => {
                            if (currentKycStatut === "1") {
                                router.push("/portefeuille/Kyc_particulier/resultat-kyc");

                            } else {
                                router.push("/portefeuille/Kyc_particulier/question2");
                            }
                        }, 5000)
                }
                // Fin condition 
            } else {
                setIsLoggingIn(false);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    html: `<p> Désolé, vous devez repondre à une question au moins. </p>`,
                    showConfirmButton: false,
                    timer: 10000
                })
            }

        } catch {
            setIsLoggingIn(false);
        }

    }, [spentA, spentB, spentC, spentD, spentE, spentF, frequencyA, frequencyB, frequencyC, incomeTypeA, incomeTypeB, incomeTypeC]);
    // Fin

    // Les handles de la 2è question
    const handleOptionSpentA = (event: { target: { value: any; checked: any; }; }) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setSpentA([...spentA, value]);
        } else {
            setSpentA([]); // Reset spentA to an empty array
        }
    };

    const handleOptionSpentB = (event: { target: { value: any; checked: any; }; }) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setSpentB([...spentB, value]);
        } else {
            setSpentB([]);
        }
    };

    const handleOptionSpentC = (event: { target: { value: any; checked: any; }; }) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setSpentC([...spentC, value]);
        } else {
            setSpentC([]);
        }
    };

    const handleOptionSpentD = (event: { target: { value: any; checked: any; }; }) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setSpentD([...spentD, value]);
        } else {
            setSpentD([]);
        }
    };

    const handleOptionSpentE = (event: { target: { value: any; checked: any; }; }) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setSpentE([...spentE, value]);
        } else {
            setSpentE([]);
        }
    };

    const handleOptionSpentF = (event: { target: { value: any; checked: any; }; }) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setSpentF([...spentF, value]);
        } else {
            setSpentF([]);
        }
    };

    // FIN


    // Les handles de la 4è question
    const handleOptionFrequencyA = (event: { target: { value: any; checked: any; }; }) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setFrequencyA([...frequencyA, value]);
        } else {
            setFrequencyA([]);
        }
    };

    const handleOptionFrequencyB = (event: { target: { value: any; checked: any; }; }) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setFrequencyB([...frequencyB, value]);
        } else {
            setFrequencyB([]);
        }
    };

    const handleOptionFrequencyC = (event: { target: { value: any; checked: any; }; }) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setFrequencyC([...frequencyC, value]);
        } else {
            setFrequencyC([]);
        }
    };
    // FIN

    // Les handles de la 5è question
    const handleOptionIncomeTypeA = (event: { target: { value: any; checked: any; }; }) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setIncomeTypeA([...incomeTypeA, value]);
        } else {
            setIncomeTypeA([]);
        }
    };

    const handleOptionIncomeTypeB = (event: { target: { value: any; checked: any; }; }) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setIncomeTypeB([...incomeTypeB, value]);
        } else {
            setIncomeTypeB([]);
        }
    };

    const handleOptionIncomeTypeC = (event: { target: { value: any; checked: any; }; }) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setIncomeTypeC([...incomeTypeC, value]);
        } else {
            setIncomeTypeC([]);
        }
    };

    // La barre de progression de KYC
    const steps = ["AML 1 & 2", "FATCA", "Identité 1 & 2", "Selfie", "Domicile", "Photo", "Signature"];
    const activeStep = -1;
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
                        <br /><br /><h1 className='text-center '>Questionnaires AML & REVENU </h1>
                    </div>
                </div>



                {/* Les cards */}
                <div className='row'>
                    <div className='col-lg-3 col-md-12'></div>

                    <div className='m-4 p-3 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg rounded-xl bg-white cryptocurrency-search-box login-form col-lg-8 col-md-12'>
                        <form className=''>
                            {/* Question 1 */}
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="Q1"
                                    className="text-blackish-blue mb-2"
                                >
                                    Avez-vous des dépenses ou payez vous des charges récurrentes mensuelles ou annuelles ?( Assurances, loyers, abonnement internet, eau, courant, transports remboursement crédit)
                                </label>
                                <select
                                    className="form-control"
                                    id="Q1"
                                    required
                                    defaultValue={statutQ1}
                                    onChange={(event) => setStatutQ1(event.target.value)}
                                >
                                    <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                        <option value="Oui">Oui</option>
                                        <option value="Non">Non</option>
                                    </optgroup>
                                </select>
                            </div >
                            {/* Fin */}

                            {/* Question 2 */}
                            {statutQ1 === "Oui" ? (
                                <>

                                    <label
                                        htmlFor="Q1"
                                        className="text-blackish-blue mb-2"
                                    >
                                        Choisissez vos dépenses récurrentes parmi les catégories ci-dessous
                                    </label>
                                    {/* Loyer */}
                                    <div className="form-group  mt-3 ">
                                        <label
                                            htmlFor="terms-check"
                                            className="gr-check-input mb-7 d-flex"
                                        >
                                            <input
                                                type="checkbox"
                                                name="loyer"
                                                value="Loyer"
                                                id='terms-check'
                                                checked={spentA.includes("Loyer")}
                                                onChange={handleOptionSpentA}
                                            />
                                            <p className=" mx-2 mb-0 text-center">
                                                Loyer
                                            </p>
                                        </label>
                                    </div>
                                    {/* Assurances */}
                                    <div className="form-group  mt-3 ">
                                        <label
                                            htmlFor="Assurances-check"
                                            className="gr-check-input mb-7 d-flex"
                                        >
                                            <input
                                                type="checkbox"
                                                name="transport"
                                                id='Assurances-check'
                                                value='Assurances'
                                                checked={spentB.includes("Assurances")}
                                                onChange={handleOptionSpentB}
                                            />
                                            <p className=" mx-2 mb-0 text-center" >
                                                Assurances
                                            </p>
                                        </label>
                                    </div>
                                    {/* Crédit bancaire */}
                                    <div className="form-group  mt-3 ">
                                        <label
                                            htmlFor="bancaire-check"
                                            className="gr-check-input mb-7 d-flex"
                                        >
                                            <input
                                                type="checkbox"
                                                name="transport"
                                                id='bancaire-check'
                                                value='Crédit bancaire'
                                                checked={spentC.includes("Crédit bancaire")}
                                                onChange={handleOptionSpentC}
                                            />
                                            <p className=" mx-2 mb-0 text-center">
                                                Crédit bancaire
                                            </p>
                                        </label>
                                    </div>
                                    {/* Transport */}
                                    <div className="form-group  mt-3 ">
                                        <label
                                            htmlFor="Transport-check"
                                            className="gr-check-input mb-7 d-flex"
                                        >
                                            <input
                                                type="checkbox"
                                                name="transport"
                                                id='Transport-check'
                                                value='Transport'
                                                checked={spentD.includes("Transport")}
                                                onChange={handleOptionSpentD}
                                            />
                                            <p className=" mx-2 mb-0 text-center">
                                                Transport
                                            </p>
                                        </label>
                                    </div>
                                    {/* Abonnement & factures */}
                                    <div className="form-group  mt-3 ">
                                        <label
                                            htmlFor="factures-check"
                                            className="gr-check-input mb-7 d-flex"
                                        >
                                            <input
                                                type="checkbox"
                                                name="transport"
                                                id='terms-check'
                                                value='Abonnement & factures'
                                                checked={spentE.includes("Abonnement & factures")}
                                                onChange={handleOptionSpentE}
                                            />
                                            <p className=" mx-2 mb-0 text-center">
                                                Abonnement & factures
                                            </p>
                                        </label>
                                    </div>
                                    {/* Scolarité */}
                                    <div className="form-group  mt-3 ">
                                        <label
                                            htmlFor="Scolarite-check"
                                            className="gr-check-input mb-7 d-flex"
                                        >
                                            <input
                                                type="checkbox"
                                                name="scolarite"
                                                id='terms-check'
                                                value='Scolarité'
                                                checked={spentF.includes('Scolarité')}
                                                onChange={handleOptionSpentF}
                                            />
                                            <p className=" mx-2 mb-0 text-center">
                                                Scolarité
                                            </p>
                                        </label>
                                    </div>
                                </>
                            ) : ("")}
                            {/* Fin Q2 */}

                            {/* Question 3 */}
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="Q1"
                                    className="text-blackish-blue mb-2"
                                >
                                    Avez-vous une source récurrente de revenus financiers ? soit mensuelle, trimestrielle ou annuelle ?
                                </label>
                                <select
                                    className="form-control"
                                    id="Q3"
                                    required
                                    defaultValue={statutQ3}
                                    onChange={(event) => setStatutQ3(event.target.value)}
                                >
                                    <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                        <option value="Oui">Oui - J ai des revenus financiers récurrents</option>
                                        <option value="Non">Non - mes revenus ne sont pas récurrents</option>
                                    </optgroup>
                                </select>
                            </div >
                            {/* Fin Q3 */}

                            {/* Question 4 */}
                            {statutQ3 === "Oui" ? (
                                <>

                                    <label
                                        htmlFor="Q1"
                                        className="text-blackish-blue mb-2"
                                    >
                                        Choisissez la ou les fréquences de vos revenus
                                    </label>
                                    {/* Revenus mensuels*/}
                                    <div className="form-group  mt-3 ">
                                        <label
                                            htmlFor="mensuels-check"
                                            className="gr-check-input mb-7 d-flex"
                                        >
                                            <input
                                                type="checkbox"
                                                name="mensuels"
                                                id='mensuels-check'
                                                value='Revenus mensuels'
                                                checked={frequencyA.includes('Revenus mensuels')}
                                                onChange={handleOptionFrequencyA}
                                            />
                                            <p className=" mx-2 mb-0 text-center">
                                                Revenus mensuels
                                            </p>
                                        </label>
                                    </div>
                                    {/* Revenus Trimestriels */}
                                    <div className="form-group  mt-3 ">
                                        <label
                                            htmlFor="trimestriels-check"
                                            className="gr-check-input mb-7 d-flex"
                                        >
                                            <input
                                                type="checkbox"
                                                name="trimestriels"
                                                id='trimestriels-check'
                                                value='Revenus trimestriels'
                                                checked={frequencyB.includes('Revenus trimestriels')}
                                                onChange={handleOptionFrequencyB}
                                            />
                                            <p className=" mx-2 mb-0 text-center">
                                                Revenus trimestriels
                                            </p>
                                        </label>
                                    </div>
                                    {/* Revenus annuels */}
                                    <div className="form-group  mt-3 ">
                                        <label
                                            htmlFor="annuels-check"
                                            className="gr-check-input mb-7 d-flex"
                                        >
                                            <input
                                                type="checkbox"
                                                name="annuels"
                                                id='annuels-check'
                                                value='Revenus annuels'
                                                checked={frequencyC.includes('Revenus annuels')}
                                                onChange={handleOptionFrequencyC}
                                            />
                                            <p className=" mx-2 mb-0 text-center">
                                                Revenus annuels
                                            </p>
                                        </label>
                                    </div>
                                </>
                            ) : ("")}
                            {/* Fin Q4 */}

                            {/* Question 5 */}
                            {/* <label
                                htmlFor="Q1"
                                className="text-blackish-blue mb-2"
                            >
                                Dans quel cadre touchez vous ces revenus ?
                            </label> */}
                            {/* Salaire mensuels*/}
                            {/* <div className="form-group  mt-3 ">
                                <label
                                    htmlFor="SalaireMensuels-check"
                                    className="gr-check-input mb-7 d-flex"
                                >
                                    <input 
                                    type="checkbox" 
                                    name="SalaireMensuels"
                                    id='SalaireMensuels-check' 
                                    value='Salaire mensuels'
                                    checked={incomeTypeA.includes('Salaire mensuels')}
                                    onChange={handleOptionIncomeTypeA}
                                    />
                                <p className=" mx-2 mb-0 text-center">
                                    Salaire mensuels (Vous êtes salariés)
                                </p>
                                </label>
                            </div> */}
                            {/* Revenus Trimestriels */}
                            {/* <div className="form-group  mt-3 ">
                                <label
                                    htmlFor="trimestriels-check"
                                    className="gr-check-input mb-7 d-flex"
                                >
                                    <input 
                                    type="checkbox" 
                                    name="trimestriels"
                                    id='trimestriels-check' 
                                    value='Revenus trimestriels'
                                    checked={incomeTypeB.includes('Revenus trimestriels')}
                                    onChange={handleOptionIncomeTypeB}
                                    />
                                <p className=" mx-2 mb-0 text-center">
                                    Revenus trimestriels
                                </p>
                                </label>
                            </div> */}
                            {/* Rentes immobilières (Vous percevez des loyers) */}
                            {/* <div className="form-group  mt-3 ">
                                <label
                                    htmlFor="immobilieres-check"
                                    className="gr-check-input mb-7 d-flex"
                                >
                                    <input 
                                    type="checkbox" 
                                    name="immobilieres"
                                    id='immobilieres' 
                                    value='Rentes immobilières'
                                    checked={incomeTypeC.includes('Rentes immobilières')}
                                    onChange={handleOptionIncomeTypeC}
                                    />
                                <p className=" mx-2 mb-0 text-center">
                                    Rentes immobilières (Vous percevez des loyers)
                                </p>
                                </label>
                            </div> */}
                            {/* Fin Q5 */}


                            {/* <p className="colorRed mb-7 ">
                                NB : Aucun retour n'est permis sur cette page donc, répondez correctement aux questions
                            </p> */}

                            {kycForParticular?.userId ? (
                                <button className="btn btn-primary " type='button' onClick={updateQuestionnaire} disabled={isLoggingIn}>Suivant</button>
                            ) : (
                                <button className="btn btn-primary " type='button' onClick={addQuestionnaire} disabled={isLoggingIn}>Suivant</button>
                            )}
                            {/* <button className="btn btn-primary "  disabled={isLoggingIn}>Suivant</button> */}
                        </form>
                    </div>
                    <div className='col-lg-3 col-md-12'></div>
                </div>
            </div>
        </>
    );
};