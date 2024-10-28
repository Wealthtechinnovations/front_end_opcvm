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
export default function Profile(props: PageProps): JSX.Element {
    // Variable de l'url de l'api
    let id = props.searchParams.id;
    const router = useRouter();

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [messageError, setMessageError] = useState();

    // States du formulaire
    // usPerson
    // address
    // mailbox
    // profession
    // professionStatus
    // bankReferences
    // motivation
    // employerCorporate
    // employerAddress
    // sourceIncome
    // natureAccount
    // directorship
    // whatBoard
    // shareholder
    // whatHareholder
    const [usPerson, setUsPerson] = useState<string | undefined>(undefined);
    const [mailbox, setMailbox] = useState<string | undefined>(undefined);
    const [profession, setProfession] = useState<string | undefined>(undefined);
    const [professionStatus, setProfessionStatus] = useState<string | undefined>(undefined);
    const [motivation, setMotivation] = useState<string[]>([]);
    const [motivationA, setMotivationA] = useState<string[]>([]);
    const [motivationB, setMotivationB] = useState<string[]>([]);
    const [motivationC, setMotivationC] = useState<string[]>([]);
    const [motivationD, setMotivationD] = useState<string[]>([]);
    const [motivationE, setMotivationE] = useState<string[]>([]);
    const [motivationF, setMotivationF] = useState<string[]>([]);
    const [employerCorporate, setEmployerCorporate] = useState<string | undefined>(undefined);
    const [employerAddress, setEmployerAddress] = useState<string | undefined>(undefined);
    const [directorship, setDirectorship] = useState<string | undefined>(undefined);
    const [whatBoard, setWhatBoard] = useState<string | undefined>(undefined);
    const [shareholder, setShareholder] = useState<string | undefined>(undefined);
    const [whatHareholder, setWhatHareholder] = useState<string | undefined>(undefined);



    const handleOptionMotivation = (event: { target: { value: any; checked: any; }; }) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setMotivation([...motivation, value]);
        } else {
            setMotivation([]);
        }
    };

    const handleOptionMotivationA = (event: { target: { value: any; checked: any; }; }) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setMotivationA([...motivationA, value]);
        } else {
            setMotivationA([]);
        }
    };

    const handleOptionMotivationB = (event: { target: { value: any; checked: any; }; }) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setMotivationB([...motivationB, value]);
        } else {
            setMotivationB([]);
        }
    };

    const handleOptionMotivationC = (event: { target: { value: any; checked: any; }; }) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setMotivationC([...motivationC, value]);
        } else {
            setMotivationC([]);
        }
    };

    const handleOptionMotivationD = (event: { target: { value: any; checked: any; }; }) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setMotivationD([...motivationD, value]);
        } else {
            setMotivationD([]);
        }
    };







    // Fonction d'envoie des informations du questionnaire FATCA
    const updateQuestionnaireFatca = async (event: { preventDefault: () => void; }) => {
        setIsLoggingIn(true);
        event.preventDefault();

        try {
            const dataTable = {
                motivation: Object.assign({}, motivation),
                motivationA: Object.assign({}, motivationA),
                motivationB: Object.assign({}, motivationB),
                motivationC: Object.assign({}, motivationC),
                motivationD: Object.assign({}, motivationD),

            }

            const dataa = {
                motivation: dataTable?.motivation[0],
                motivationA: dataTable?.motivationA[0],
                motivationB: dataTable?.motivationB[0],
                motivationC: dataTable?.motivationC[0],
                motivationD: dataTable?.motivationD[0],


                usPerson: usPerson,
                mailbox: mailbox,
                profession: profession,
                professionStatus: professionStatus,
                employerCorporate: employerCorporate,
                employerAddress: employerAddress,
                directorship: directorship,
                whatBoard: whatBoard,
                shareholder: shareholder,
                whatHareholder: whatHareholder
            }
            // Condition pour forcer l'utilisateur à choisir au moins une reponse
            // if () {


            const token = localStorage.getItem('tokenEnCours') //Le token récuperé

            const result = await fetch(`${urlstableconstant}/api/kyc/particular/update-kyc-questionnaire-fatca`, {
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
                            router.push("/portefeuille/Kyc_particulier/question4");
                        }
                    }, 5000)
            }
            // Fin condition 
            // }else{
            //     setIsLoggingIn(false);
            //     Swal.fire({
            //         position: 'center',
            //         icon: 'error',
            //         html: `<p> Désolé, vous devez repondre à une question au moins. </p>` ,
            //         showConfirmButton: false,
            //         timer: 10000
            //     })
            // }

        } catch {
            setIsLoggingIn(false);
        }

    };
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


    // La barre de progression de KYC
    const steps = ["AML 1 & 2", "FATCA", "Identité 1 & 2", "Selfie", "Domicile", "Photo", "Signature"];
    const activeStep = 0;
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
                        <br /><br /><h1 className='text-center '>Questionnaires ID & FATCA </h1>
                    </div>
                </div>


                {/* Les cards */}
                <div className='row'>
                    <div className='col-lg-3 col-md-12'></div>

                    <div className='m-4 p-3 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg rounded-xl bg-white cryptocurrency-search-box login-form col-lg-8 col-md-12'>
                        <form className='' onSubmit={updateQuestionnaireFatca}>
                            {/* Question 1 */}
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="usPerson"
                                    className="text-blackish-blue mb-2"
                                >
                                    Etes-vous une US PERSON? (Citoyenneté Américaine (Passeport américain) / Résidence aux USA /Présence significative ou permanente (green card) / Lieu de naissance aux USA)
                                </label>
                                <select
                                    className="form-control"
                                    id="usPerson"
                                    required
                                    defaultValue={usPerson}
                                    onChange={(event) => setUsPerson(event.target.value)}
                                >
                                    <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                        <option value="Oui">Oui</option>
                                        <option value="Non">Non</option>
                                    </optgroup>
                                </select>
                            </div >
                            {/* Fin */}

                            {/* Question 1 */}
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="mailbox"
                                    className="text-blackish-blue mb-2"
                                >

                                    Adresse ou boîte postale
                                </label>
                                <div className='form-group mt-3'>
                                    <input
                                        type='text'
                                        id='mailbox'
                                        className='form-control'
                                        placeholder='Adresse ou boîte postale'
                                        defaultValue={mailbox}
                                        onChange={(event) => setMailbox(event.target.value)}
                                    />
                                </div>
                            </div >
                            {/* Fin */}

                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="professionStatus"
                                    className="text-blackish-blue mb-2"
                                >
                                    Statut professionnel
                                </label>
                                <select
                                    className="form-control"
                                    id="professionStatus"
                                    required
                                    defaultValue={professionStatus}
                                    onChange={(event) => setProfessionStatus(event.target.value)}
                                >
                                    <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                        <option value="Salarié">Salarié</option>
                                        <option value="Profession libérale">Profession libérale</option>
                                        <option value="Retraité">Retraité</option>
                                        <option value="Activité commerciale">Activité commerciale</option>
                                    </optgroup>
                                </select>
                            </div >
                            {/* SI Statut professionnel EST SALRIE */}
                            {professionStatus === "Salarié" ? (
                                <>

                                    <div className="form-group mb-6 mt-3">
                                        <label
                                            htmlFor="employerCorporate"
                                            className="text-blackish-blue mb-2"
                                        >
                                            Nom de l employeur
                                        </label>
                                        <div className='form-group mt-3'>
                                            <input
                                                type='text'
                                                id='employerCorporate'
                                                className='form-control'
                                                placeholder="Nom de l'employeur"
                                                defaultValue={employerCorporate}
                                                onChange={(event) => setEmployerCorporate(event.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group mb-6 mt-3">
                                        <label
                                            htmlFor="employerAddress"
                                            className="text-blackish-blue mb-2"
                                        >
                                            Adresse de l employeur
                                        </label>
                                        <div className='form-group mt-3'>
                                            <input
                                                type='text'
                                                id='employerAddress'
                                                className='form-control'
                                                placeholder="Adresse de l'employeur"
                                                defaultValue={employerAddress}
                                                onChange={(event) => setEmployerAddress(event.target.value)}
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : ('')}

                            {/* Question 1*/}
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="profession"
                                    className="text-blackish-blue mb-2"
                                >
                                    Profession/fonction/activité
                                </label>
                                <div className='form-group mt-3'>
                                    <input
                                        type='text'
                                        id='profession'
                                        className='form-control'
                                        placeholder='Profession, fonction, activité'
                                        defaultValue={profession}
                                        onChange={(event) => setProfession(event.target.value)}
                                    />
                                </div>
                            </div >
                            {/* Fin */}




                            {/* PARTIE MOTIVATION */}
                            <label
                                htmlFor="Q1"
                                className="text-blackish-blue mb-2"
                            >
                                Motivation de l’ouverture de compte.
                            </label>
                            <div className="form-group  mt-3 ">
                                <label
                                    htmlFor="Salaire-check"
                                    className="gr-check-input mb-7 d-flex"
                                >
                                    <input
                                        type="checkbox"
                                        name="Salaire"
                                        id='Salaire-check'
                                        value='Pour recevoir mon salaire'
                                        checked={motivation.includes('Pour recevoir mon salaire')}
                                        onChange={handleOptionMotivation}
                                    />
                                    <p className=" mx-2 mb-0 text-center">
                                        Pour recevoir mon salaire
                                    </p>
                                </label>
                            </div>

                            <div className="form-group  mt-3 ">
                                <label
                                    htmlFor="commerciale-check"
                                    className="gr-check-input mb-7 d-flex"
                                >
                                    <input
                                        type="checkbox"
                                        name="commerciale"
                                        id='commerciale-check'
                                        value='Pour mon activité commerciale'
                                        checked={motivationA.includes('Pour mon activité commerciale')}
                                        onChange={handleOptionMotivationA}
                                    />
                                    <p className=" mx-2 mb-0 text-center">
                                        Pour mon activité commerciale
                                    </p>
                                </label>
                            </div>

                            <div className="form-group  mt-3 ">
                                <label
                                    htmlFor="paiement-check"
                                    className="gr-check-input mb-7 d-flex"
                                >
                                    <input
                                        type="checkbox"
                                        name="paiement"
                                        id='paiement-check'
                                        value='Pour faire des achats et des paiement'
                                        checked={motivationB.includes('Pour faire des achats et des paiement')}
                                        onChange={handleOptionMotivationB}
                                    />
                                    <p className=" mx-2 mb-0 text-center">
                                        Pour faire des achats et des paiement
                                    </p>
                                </label>
                            </div>

                            <div className="form-group  mt-3 ">
                                <label
                                    htmlFor="epargner-check"
                                    className="gr-check-input mb-7 d-flex"
                                >
                                    <input
                                        type="checkbox"
                                        name="epargner"
                                        id='epargner-check'
                                        value='Pour épargner'
                                        checked={motivationC.includes('Pour épargner')}
                                        onChange={handleOptionMotivationC}
                                    />
                                    <p className=" mx-2 mb-0 text-center">
                                        Pour épargner
                                    </p>
                                </label>
                            </div>
                            <div className="form-group  mt-3 ">
                                <label
                                    htmlFor="autre-check"
                                    className="gr-check-input mb-7 d-flex"
                                >
                                    <input
                                        type="checkbox"
                                        name="autre"
                                        id='autre-check'
                                        value='Autre'
                                        checked={motivationD.includes('Autre')}
                                        onChange={handleOptionMotivationD}
                                    />
                                    <p className=" mx-2 mb-0 text-center">
                                        Autre
                                    </p>
                                </label>
                            </div>
                            {/* FIN MOTIVATION */}


















                            {/* <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="motivation"
                                    className="text-blackish-blue mb-2"
                                >
                                    Motivation de l’ouverture de compte.
                                </label>
                                <select 
                                className="form-control"
                                id="motivation"
                                required
                                defaultValue={motivation} 
                                onChange={(event)=>setMotivation(event.target.value)}
                                >
                                <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                    <option  value="Pour recevoir mon salaire">Pour recevoir mon salaire</option>
                                    <option  value="Pour mon activité commerciale">Pour mon activité commerciale</option>
                                    <option  value="Pour faire des achats et des paiement">Pour faire des achats et des paiement</option>
                                    <option  value="Pour épargner">Pour épargner</option>
                                    <option  value="Pour transférer de l'argent">Pour transférer de l'argent</option>
                                    <option  value="Pour encaisser des paiements">Pour encaisser des paiements</option>
                                    <option  value="Autre">Autre</option>
                                    </optgroup>
                                </select>
                            </div > */}

                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="directorship"
                                    className="text-blackish-blue mb-2"
                                >
                                    Bénéficiez-vous d’un mandat d’administrateur dans le Conseil d’Administration d’une société ?
                                </label>
                                <select
                                    className="form-control"
                                    id="directorship"
                                    required
                                    defaultValue={directorship}
                                    onChange={(event) => setDirectorship(event.target.value)}
                                >
                                    <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                        <option value="Oui">Oui</option>
                                        <option value="Non">Non</option>
                                    </optgroup>
                                </select>
                            </div>

                            {/* SI L'UTISATEUR BENEFICIE D'UN MENDAT D'ADMINISTRATEUR */}
                            {directorship === "Oui" ? (
                                <>

                                    <div className="form-group mb-6 mt-3">
                                        <label
                                            htmlFor="employerCorporate"
                                            className="text-blackish-blue mb-2"
                                        >
                                            La (les)quelle(s)

                                        </label>
                                        <div className='form-group mt-3'>
                                            <input
                                                type='text'
                                                id='employerCorporate'
                                                className='form-control'
                                                placeholder='précisez le nom de la société'
                                                defaultValue={whatBoard}
                                                onChange={(event) => setWhatBoard(event.target.value)}
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : ("")}
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="shareholder"
                                    className="text-blackish-blue mb-2"
                                >
                                    Etes-vous actionnaire, fondateur ou co-fondateur d une société ?
                                </label>
                                <select
                                    className="form-control"
                                    id="shareholder"
                                    required
                                    defaultValue={shareholder}
                                    onChange={(event) => setShareholder(event.target.value)}
                                >
                                    <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                        <option value="Oui">Oui</option>
                                        <option value="Non">Non</option>
                                    </optgroup>
                                </select>
                            </div>

                            {/* SI L'UTILISATEUR EST ACTIONNAIRE DANS UNE SOCIETE */}
                            {shareholder === "Oui" ? (
                                <>

                                    <div className="form-group mb-6 mt-3">
                                        <label
                                            htmlFor="whatHareholder"
                                            className="text-blackish-blue mb-2"
                                        >
                                            La (les)quelle(s)

                                        </label>
                                        <div className='form-group mt-3'>
                                            <input
                                                type='text'
                                                id='whatHareholder'
                                                className='form-control'
                                                placeholder='précisez le nom de la société'
                                                defaultValue={whatHareholder}
                                                onChange={(event) => setWhatHareholder(event.target.value)}
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : ("")}













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
                                    {/*   <Link href='/profil/kyc/particulier/questionnaires-revenus-two/' className="align-right">
                                        <a
                                            className=""
                                        >
                                            <button className="btn btn-primary " type='button'  > Précédente </button>
                                        </a>
                                    </Link>*/}
                                </div>
                                <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">

                                    <button className="btn btn-primary " type='submit' disabled={isLoggingIn} > Suivant </button>

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

