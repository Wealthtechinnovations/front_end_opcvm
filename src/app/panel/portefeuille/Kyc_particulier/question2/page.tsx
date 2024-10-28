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
interface Country {
    id: React.Key | null | undefined;
    code: string | number | readonly string[] | undefined;
    libelle: string | number | boolean | React.ReactElement | Iterable<React.ReactNode> | React.ReactPortal | React.ReactNode | null | undefined;
}
interface Bank {
    id: React.Key | null | undefined;
    countryIso: string | number | readonly string[] | undefined;
    bankName: any;
}
interface Operator {
    id: React.Key | null | undefined;
    countryIso: string | number | readonly string[] | undefined;
    operatorName: any;
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

export default function Profile(props: PageProps): JSX.Element {
    // Variable de l'url de l'api
    let id = props.searchParams.id;
    const router = useRouter();
    // Variable de l'url de l'api
    // Variable de l'api key de stablecoin

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [messageError, setMessageError] = useState();


    // AVEC UNE MISE A JOUR
    // incomeMonthly
    // annualIncome
    // otherBankAccount
    // savingsAccount
    // currentAccount
    // titleAccount
    // bankReferencesSavings
    // otherBankNameSavings
    // otherBankCountrySavings
    // bankReferencesCurrent
    // otherBankNameCurrent
    // otherBankCountryCurrent
    // bankReferencesTitle
    // otherBankNameTitle
    // otherBankCountryTitle
    // mobileAccount
    // mobileCountry
    // operator
    // salaries
    // rents
    // businessReceipts
    // allowances
    const [salaries, setSalaries] = useState('');
    const [rents, setRents] = useState('');
    const [businessReceipts, setBusinessReceipts] = useState('');
    const [allowances, setAllowances] = useState('');
    //   ***************************************
    const [incomeMonthly, setIncomeMonthly] = useState('');
    const [annualIncome, setAnnualIncome] = useState('');
    const [otherBankAccount, setOtherBankAccount] = useState('');
    const [savingsAccount, setSavingsAccount] = useState<string[]>([]);
    const [currentAccount, setCurrentAccount] = useState<string[]>([]);
    const [titleAccount, setTitleAccount] = useState<string[]>([]);
    const [bankReferencesSavings, setBankReferencesSavings] = useState('');
    const [otherBankNameSavings, setOtherBankNameSavings] = useState('');
    const [otherBankCountrySavings, setOtherBankCountrySavings] = useState('');
    const [bankReferencesCurrent, setBankReferencesCurrent] = useState('');
    const [otherBankNameCurrent, setOtherBankNameCurrent] = useState('');
    const [otherBankCountryCurrent, setOtherBankCountryCurrent] = useState('');

    const [bankReferencesTitle, setBankReferencesTitle] = useState('');
    const [otherBankNameTitle, setOtherBankNameTitle] = useState('');
    const [otherBankCountryTitle, setOtherBankCountryTitle] = useState('');

    const [mobileAccount, setMobileAccount] = useState('');
    const [mobileCountry, setMobileCountry] = useState('');
    const [operator, setOperator] = useState('');
    const [sourceIncome, setSourceIncome] = useState('');

    const [allCountry, setAllCountry] = useState<Country[]>([]); // Initialize as an array of Country objects
    // Operateurs
    const [allOperators, setAllOperators] = useState<Operator[]>([]);
    // Banques
    const [allBank, setAllBank] = useState<Bank[]>([]);
    const [dataBankOfCountry, setDataBankOfCountry] = useState('');





    // Fonction d'envoie des informations du questionnaire AML 2
    const updateQuestionnaireAml2 = async (event: { preventDefault: () => void; }) => {
        setIsLoggingIn(true);
        event.preventDefault();

        try {
            const dataTable = {
                savingsAccount: Object.assign({}, savingsAccount),
                currentAccount: Object.assign({}, currentAccount),
                titleAccount: Object.assign({}, titleAccount),

            }

            const dataa = {
                incomeMonthly: incomeMonthly,
                annualIncome: annualIncome,
                otherBankAccount: otherBankAccount,
                savingsAccount: dataTable?.savingsAccount[0],
                currentAccount: dataTable?.currentAccount[0],
                titleAccount: dataTable?.titleAccount[0],
                bankReferencesSavings: bankReferencesSavings,
                otherBankNameSavings: otherBankNameSavings,
                otherBankCountrySavings: otherBankCountrySavings,
                bankReferencesCurrent: bankReferencesCurrent,
                otherBankNameCurrent: otherBankNameCurrent,
                otherBankCountryCurrent: otherBankCountryCurrent,
                bankReferencesTitle: bankReferencesTitle,
                otherBankNameTitle: otherBankNameTitle,
                otherBankCountryTitle: otherBankCountryTitle,
                mobileAccount: mobileAccount,
                mobileCountry: mobileCountry,
                operator: operator,
                salaries: salaries,
                rents: rents,
                businessReceipts: businessReceipts,
                allowances: allowances

            }

            const token = localStorage.getItem('tokenEnCours') //Le token récuperé

            const result = await fetch(`${urlstableconstant}/api/kyc/particular/update-kyc-questionnaire-two`, {
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
                            router.push("/portefeuille/Kyc_particulier/question3");
                        }
                    }, 5000)
            }
            // Fin condition 

        } catch {
            setIsLoggingIn(false);
        }

    };
    // Fin                           

    // RECUPERER TOUS LES OPERATEURS
    useEffect(() => {
        // Appel à l'API lors du premier rendu du composant
        async function fetchData() {
            try {
                const token = localStorage.getItem('tokenEnCours')


                const resOperator = await fetch(`${urlstableconstant}/api/operator/find-all-Operators`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': `${API_KEY_STABLECOIN}`,
                        Authorization: `Bearer ${token}`,
                    },
                })
                    .then((resOperator) => resOperator.json())
                    .then((data) => {
                        setAllOperators(data)
                    })

            } catch (error) {
                console.error('Error fetching quiz part one:', error);
            }
        }

        fetchData();
    }, []);
    // FIN

    // RECUPERER TOUTES LES BANQUES 
    useEffect(() => {
        // Appel à l'API lors du premier rendu du composant
        async function fetchData() {
            try {
                const resBank = await fetch(`${urlstableconstant}/api/bank/find-all`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': `${API_KEY_STABLECOIN}`,
                    },
                })
                    .then((resBank) => resBank.json())
                    .then((data) => {
                        setAllBank(data)

                    })
            }
            catch (error) {
                console.error('Error fetching quiz part one:', error);
            }
        }

        fetchData();
    }, []);
    // FIN






    // FIN

    const [kycForParticular, setKycForParticular] = useState<KycForParticular | null>(null); // Initialize as KycForParticular or null



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












    // Les handles de la 2è question
    const handleOptionSavingsAccount = (event: { target: { value: any; checked: any; }; }) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setSavingsAccount([...savingsAccount, value]);
        } else {
            setSavingsAccount([]);
        }
    };

    const handleOptionCurrentAccount = (event: { target: { value: any; checked: any; }; }) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setCurrentAccount([...currentAccount, value]);
        } else {
            setCurrentAccount([]);
        }
    };

    const handleOptionTitleAccount = (event: { target: { value: any; checked: any; }; }) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setTitleAccount([...titleAccount, value]);
        } else {
            setTitleAccount([]);
        }
    };


    useEffect(() => {
        // Appel à l'API lors du premier rendu du composant
        async function fetchData() {
            try {
                const resCountry = await fetch(`${urlstableconstant}/api/country/find-all`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': `${API_KEY_STABLECOIN}`,
                    },
                })
                    .then((resCountry) => resCountry.json())
                    .then((allCountry) => {
                        setAllCountry(allCountry)
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
                        <br /><br /><h1 className='text-center '>Questionnaires AML & REVENU</h1>
                    </div>
                </div>


                {/* Les cards */}
                <div className='row'>
                    <div className='col-lg-3 col-md-12'></div>

                    <div className='m-4 p-3 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg rounded-xl bg-white cryptocurrency-search-box login-form col-lg-8 col-md-12'>
                        <form className='' onSubmit={updateQuestionnaireAml2}>
                            {/* Question 1 */}
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="incomeMonthly"
                                    className="text-blackish-blue mb-2"
                                >
                                    Quelle est l estimation de vos revenus mensuels en CFA?
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='number'
                                        className='form-control'
                                        placeholder='Montant des revenus mensuels en CFA'
                                        defaultValue={incomeMonthly}
                                        onChange={(event) => setIncomeMonthly(event.target.value)}
                                    />
                                </div>
                            </div >
                            {/* Fin */}
                            {/* Question 2 */}
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="Q1"
                                    className="text-blackish-blue mb-2"
                                >
                                    Quelle est l estimation de vos revenus annuels en CFA?
                                </label>
                                <div className='form-group'>
                                    <input
                                        type='number'
                                        className='form-control'
                                        placeholder='Montant des revenus annuels en CFA'
                                        defaultValue={annualIncome}
                                        onChange={(event) => setAnnualIncome(event.target.value)}
                                    />
                                </div>
                            </div >
                            {/* Fin */}

                            {/* PARTIE SOURCE DE REVENUS */}
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="sourceIncome"
                                    className="text-blackish-blue mb-2"
                                >
                                    Source des revenus
                                </label>
                                <select
                                    className="form-control"
                                    id="sourceIncome"
                                    required
                                    defaultValue={sourceIncome}
                                    onChange={(event) => setSourceIncome(event.target.value)}
                                >
                                    <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                        <option value="Salaires">Salaires</option>
                                        <option value="Rentes">Rentes</option>
                                        <option value="Recettes activités commerciales">Recettes activités commerciales</option>
                                        <option value="Indemnités">Indemnités</option>
                                    </optgroup>
                                </select>
                            </div >

                            {sourceIncome === "Salaires" ? (
                                <div className='mt-3'>
                                    <label htmlFor="salaries">Salaires:</label>
                                    <input
                                        type="number"
                                        id="salaries"
                                        placeholder='Montant en CFA'
                                        value={salaries}
                                        onChange={(e) => setSalaries(e.target.value)}
                                    />
                                </div>
                            ) : sourceIncome === "Rentes" ? (
                                <div className='mt-3'>
                                    <label htmlFor="rents">Rentes:</label>
                                    <input
                                        type="number"
                                        id="rents"
                                        placeholder='Montant en CFA'
                                        value={rents}
                                        onChange={(e) => setRents(e.target.value)}
                                    />
                                </div>
                            ) : sourceIncome === "Recettes activités commerciales" ? (
                                <div className='mt-3'>
                                    <label htmlFor="businessReceipts">Recettes activités commerciales:</label>
                                    <input
                                        type="number"
                                        id="businessReceipts"
                                        placeholder='Montant en CFA'
                                        value={businessReceipts}
                                        onChange={(e) => setBusinessReceipts(e.target.value)}
                                    />
                                </div>
                            ) : sourceIncome === "Indemnités" ? (
                                <div className='mt-3'>
                                    <label htmlFor="allowances">Indemnités:</label>
                                    <input
                                        type="number"
                                        id="allowances"
                                        placeholder='Montant en CFA'
                                        value={allowances}
                                        onChange={(e) => setAllowances(e.target.value)}
                                    />
                                </div>
                            ) : ("")}

                            {/* FIN SOURCE DE REVENUS */}

                            {/* **************SECTION BANQUE************** */}
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="otherBankAccount"
                                    className="text-blackish-blue mb-2"
                                >
                                    Avez-vous un compte bancaire ?
                                </label>
                                <select
                                    className="form-control"
                                    id="otherBankAccount"
                                    required
                                    defaultValue={otherBankAccount}
                                    onChange={(event) => setOtherBankAccount(event.target.value)}
                                >
                                    <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                        <option value="Oui">Oui</option>
                                        <option value="Non">Non</option>
                                    </optgroup>
                                </select>
                            </div >

                            {/* **************SI L'UTILISATEUR A UN COMPTE************ */}
                            {otherBankAccount === "Oui" ? (
                                <>

                                    {/* Question 3 */}
                                    <div className="form-group mb-6 mt-3">
                                        <label
                                            htmlFor="natureAccount"
                                            className="text-blackish-blue mb-2"
                                        >
                                            Nature du ou des comptes
                                        </label>
                                        {/* Compte épargne */}
                                        <div className="form-group ">
                                            <label
                                                htmlFor="savingsAccount-check"
                                                className="gr-check-input mb-7 d-flex"
                                            >
                                                <input
                                                    type="checkbox"
                                                    name="Compte épargne"
                                                    value="Compte épargne"
                                                    id='savingsAccount-check'
                                                    checked={savingsAccount.includes("Compte épargne")}
                                                    onChange={handleOptionSavingsAccount}
                                                />
                                                <p className=" mx-2 mb-0 text-center">
                                                    Compte épargne
                                                </p>
                                            </label>
                                        </div>

                                        <div className="form-group ">
                                            <label
                                                htmlFor="currentAccount-check"
                                                className="gr-check-input mb-7 d-flex"
                                            >
                                                {/* savingsAccount
                                    currentAccount */}
                                                <input
                                                    type="checkbox"
                                                    name="Compte courant"
                                                    value="Compte courant"
                                                    id='currentAccount-check'
                                                    checked={currentAccount.includes("Compte courant")}
                                                    onChange={handleOptionCurrentAccount}
                                                />
                                                <p className=" mx-2 mb-0 text-center">
                                                    Compte courant
                                                </p>
                                            </label>
                                        </div>

                                        <div className="form-group ">
                                            <label
                                                htmlFor="titleAccount-check"
                                                className="gr-check-input mb-7 d-flex"
                                            >
                                                {/* savingsAccount
                                    currentAccount */}
                                                <input
                                                    type="checkbox"
                                                    name="Compte titre"
                                                    value="Compte titre"
                                                    id='titleAccount-check'
                                                    checked={titleAccount.includes("Compte titre")}
                                                    onChange={handleOptionTitleAccount}
                                                />
                                                <p className=" mx-2 mb-0 text-center">
                                                    Compte titre
                                                </p>
                                            </label>
                                        </div>
                                    </div >
                                    {/* Fin */}

                                    {/* LES CHAMPS A RENSEIGNER QUAND L'UTISATEUR A UN COMPTE BANCAIRE D'EPARGNE*/}
                                    {savingsAccount[0] === "Compte épargne" ? (
                                        <>
                                            <label className="text-center mb-2 colorRed">
                                                Les informations du compte d épargne
                                            </label>
                                            {/* Question 7 */}
                                            <div className="form-group mb-6 mt-3">
                                                <label
                                                    htmlFor="otherBankCountrySavings"
                                                    className="text-blackish-blue mb-2"
                                                >
                                                    Pays de la banque de votre compte d épargne existant
                                                </label>
                                                <select
                                                    className="form-control"
                                                    id="otherBankCountrySavings"
                                                    required
                                                    defaultValue={otherBankCountrySavings}
                                                    onChange={(event) => setOtherBankCountrySavings(event.target.value)}
                                                >
                                                    <option defaultValue="">Choisissez</option>
                                                    {allCountry ? (
                                                        allCountry.map((data: { id: React.Key | null | undefined; code: string | number | readonly string[] | undefined; libelle: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.ReactNode | null | undefined; }) => (
                                                            <optgroup className='single-cryptocurrency-box'
                                                                key={data.id}>
                                                                <option value={data.code}>{data.libelle}</option>
                                                            </optgroup>
                                                        ))) : ("")}
                                                </select>
                                            </div >

                                            {otherBankCountrySavings === "CI" || otherBankCountrySavings === "TG" || otherBankCountrySavings === "BJ" || otherBankCountrySavings === "BF" || otherBankCountrySavings === "TD" || otherBankCountrySavings === "GA" || otherBankCountrySavings === "CG" || otherBankCountrySavings === "CF" || otherBankCountrySavings === "GQ" || otherBankCountrySavings === "CM" || otherBankCountrySavings === "GW" || otherBankCountrySavings === "ML" || otherBankCountrySavings === "NE" || otherBankCountrySavings === "SN" ? (

                                                <div className='form-group mb-6 mt-3'>
                                                    <label
                                                        htmlFor="bankNameSavings"
                                                        className="text-blackish-blue mb-2"
                                                    >
                                                        Nom de la banque de votre compte d épargne
                                                    </label>
                                                    <select
                                                        placeholder='Banque'
                                                        className='form-control'
                                                        defaultValue={otherBankNameSavings}
                                                        onChange={(event) => setOtherBankNameSavings(event.target.value)}
                                                    >
                                                        <option>Choisissez</option>
                                                        {/* Afficher les Banques d'un pays */}
                                                        {allBank.map((data) => (
                                                            data.countryIso === otherBankCountrySavings ?
                                                                <optgroup className='single-cryptocurrency-box' key={data.id}>
                                                                    <option value={data.bankName}>{data.bankName}</option>
                                                                </optgroup>
                                                                : " "
                                                        ))}
                                                        {/* Fin */}
                                                    </select>
                                                </div>
                                            ) : (
                                                <div className="form-group mb-6 mt-3">
                                                    <label
                                                        htmlFor="bankNameSavings"
                                                        className="text-blackish-blue mb-2"
                                                    >
                                                        Nom de la banque de votre compte d épargne
                                                    </label>
                                                    <div className='form-group '>
                                                        <input
                                                            type='text'
                                                            id='bankNameSavings'
                                                            className='form-control'
                                                            placeholder="Nom de la banque de votre compte d'épargne"
                                                            defaultValue={otherBankNameSavings}
                                                            onChange={(event) => setOtherBankNameSavings(event.target.value)}
                                                        />
                                                    </div>
                                                </div >
                                            )}

                                            {/* Fin Q3 */}

                                            {/* Question 6 */}
                                            <div className="form-group mb-6 mt-3">
                                                <label
                                                    htmlFor="bankReferencesSavings"
                                                    className="text-blackish-blue mb-2"
                                                >
                                                    Références de la banque de votre compte d épargne
                                                </label>
                                                <div className='form-group'>
                                                    <input
                                                        type='text'
                                                        id='bankReferencesSavings'
                                                        className='form-control'
                                                        placeholder=" Références de la banque de votre compte d'épargne"
                                                        defaultValue={bankReferencesSavings}
                                                        onChange={(event) => setBankReferencesSavings(event.target.value)}
                                                    />
                                                </div>
                                            </div>


                                            {/* Fin */}


                                        </>
                                    ) : ("")}
                                    {/* **********FIN CONDITION DE COMPTE BANCAIRE D'EPARGNE******** */}

                                    {/* LES CHAMPS A RENSEIGNER QUAND L'UTISATEUR A UN COMPTE BANCAIRE COURANT*/}
                                    {currentAccount[0] === "Compte courant" ? (
                                        <>
                                            <label className="text-center mb-2 colorRed">
                                                Les informations du compte courant
                                            </label>
                                            {/* Question 7 */}
                                            <div className="form-group mb-6 mt-3">
                                                <label
                                                    htmlFor="otherBankCountryCurrent"
                                                    className="text-blackish-blue mb-2"
                                                >
                                                    Pays de la banque de votre compte courant existant
                                                </label>
                                                <select
                                                    className="form-control  bgColorRed"
                                                    id="otherBankCountryCurrent"
                                                    required
                                                    defaultValue={otherBankCountryCurrent}
                                                    onChange={(event) => setOtherBankCountryCurrent(event.target.value)}
                                                >
                                                    <option defaultValue="">Choisissez</option>
                                                    {allCountry ? (
                                                        allCountry.map((data) => (
                                                            <optgroup className='single-cryptocurrency-box'
                                                                key={data.id}>
                                                                <option value={data.code}>{data.libelle}</option>
                                                            </optgroup>
                                                        ))
                                                    ) : ("")}
                                                </select>
                                            </div >

                                            {otherBankCountryCurrent === "CI" || otherBankCountryCurrent === "TG" || otherBankCountryCurrent === "BJ" || otherBankCountryCurrent === "BF" || otherBankCountryCurrent === "TD" || otherBankCountryCurrent === "GA" || otherBankCountryCurrent === "CG" || otherBankCountryCurrent === "CF" || otherBankCountryCurrent === "GQ" || otherBankCountryCurrent === "CM" || otherBankCountryCurrent === "GW" || otherBankCountryCurrent === "ML" || otherBankCountryCurrent === "NE" || otherBankCountryCurrent === "SN" ? (
                                                <div className='form-group mb-6 mt-3'>
                                                    <label
                                                        htmlFor="bankNameSavings"
                                                        className="text-blackish-blue mb-2"
                                                    >
                                                        Nom de la banque de votre compte courant
                                                    </label>
                                                    <select
                                                        placeholder='Banque'
                                                        className='form-control'
                                                        defaultValue={otherBankNameCurrent}
                                                        onChange={(event) => setOtherBankNameCurrent(event.target.value)}
                                                    >
                                                        <option>Choisissez</option>
                                                        {/* Afficher les Banques d'un pays */}
                                                        {allBank.map((data) => (
                                                            data.countryIso === otherBankCountryCurrent ?
                                                                <optgroup className='single-cryptocurrency-box' key={data.id}>
                                                                    <option value={data.bankName}>{data.bankName}</option>
                                                                </optgroup>
                                                                : " "
                                                        ))}
                                                        {/* Fin */}
                                                    </select>
                                                </div>
                                            ) : (
                                                <div className="form-group mb-6 mt-3">
                                                    <label
                                                        htmlFor="bankNameCurrent"
                                                        className="text-blackish-blue mb-2"
                                                    >
                                                        Nom de la banque de votre compte courant
                                                    </label>
                                                    <div className='form-group '>
                                                        <input
                                                            type='text'
                                                            id='bankNameCurrentCurrent'
                                                            className='form-control'
                                                            placeholder='Nom de la banque de votre compte courant'
                                                            defaultValue={otherBankNameCurrent}
                                                            onChange={(event) => setOtherBankNameCurrent(event.target.value)}
                                                        />
                                                    </div>
                                                </div >
                                            )}

                                            {/* Question 6 */}
                                            <div className="form-group mb-6 mt-3">
                                                <label
                                                    htmlFor="bankReferencesCurrent"
                                                    className="text-blackish-blue mb-2"
                                                >
                                                    Références de la banque de votre compte courant
                                                </label>
                                                <div className='form-group'>
                                                    <input
                                                        type='text'
                                                        id='bankReferencesCurrent'
                                                        className='form-control'
                                                        placeholder='Références de la banque de votre compte courant'
                                                        defaultValue={bankReferencesCurrent}
                                                        onChange={(event) => setBankReferencesCurrent(event.target.value)}
                                                    />
                                                </div>
                                            </div>


                                            {/* Fin */}

                                        </>
                                    ) : ("")}
                                    {/* ***********FIN CONDITION S'IL A UN COMPTE BANCAIRE COURANT**** */}

                                    {/* LES CHAMPS A RENSEIGNER QUAND L'UTISATEUR A UN COMPTE BANCAIRE TITRE*/}
                                    {titleAccount[0] === "Compte titre" ? (
                                        <>
                                            <label className="text-center mb-2 colorRed">
                                                Les informations du compte titre
                                            </label>
                                            {/* Question 7 */}
                                            <div className="form-group mb-6 mt-3">
                                                <label
                                                    htmlFor="otherBankCountryTitle"
                                                    className="text-blackish-blue mb-2"
                                                >
                                                    Pays de la banque de votre compte titre existant
                                                </label>
                                                <select
                                                    className="form-control"
                                                    id="otherBankCountryTitle"
                                                    required
                                                    defaultValue={otherBankCountryTitle}
                                                    onChange={(event) => setOtherBankCountryTitle(event.target.value)}
                                                >
                                                    <option defaultValue="">Choisissez</option>
                                                    {allCountry ? (
                                                        allCountry.map((data) => (
                                                            <optgroup className='single-cryptocurrency-box'
                                                                key={data.id}>
                                                                <option value={data.code}>{data.libelle}</option>
                                                            </optgroup>
                                                        ))
                                                    ) : ("")}
                                                </select>
                                            </div >

                                            {otherBankCountryTitle === "CI" || otherBankCountryTitle === "TG" || otherBankCountryTitle === "BJ" || otherBankCountryTitle === "BF" || otherBankCountryTitle === "TD" || otherBankCountryTitle === "GA" || otherBankCountryTitle === "CG" || otherBankCountryTitle === "CF" || otherBankCountryTitle === "GQ" || otherBankCountryTitle === "CM" || otherBankCountryTitle === "GW" || otherBankCountryTitle === "ML" || otherBankCountryTitle === "NE" || otherBankCountryTitle === "SN" ? (
                                                <div className='form-group mb-6 mt-3'>
                                                    <label
                                                        htmlFor="bankNameSavings"
                                                        className="text-blackish-blue mb-2"
                                                    >
                                                        Nom de la banque de votre compte titre

                                                    </label>
                                                    <select
                                                        placeholder='Banque'
                                                        className='form-control'
                                                        defaultValue={otherBankNameTitle}
                                                        onChange={(event) => setOtherBankNameTitle(event.target.value)}
                                                    >
                                                        <option>Choisissez</option>
                                                        {/* Afficher les Banques d'un pays */}
                                                        {allBank.map((data) => (
                                                            data.countryIso === otherBankCountryTitle ?
                                                                <optgroup className='single-cryptocurrency-box' key={data.id}>
                                                                    <option value={data.bankName}>{data.bankName}</option>
                                                                </optgroup>
                                                                : " "
                                                        ))}
                                                        {/* Fin */}
                                                    </select>
                                                </div>
                                            ) : (
                                                <div className="form-group mb-6 mt-3">
                                                    <label
                                                        htmlFor="bankNameTitle"
                                                        className="text-blackish-blue mb-2"
                                                    >
                                                        Nom de la banque de votre compte titre
                                                    </label>
                                                    <div className='form-group '>
                                                        <input
                                                            type='text'
                                                            id='bankNameCurrentTitle'
                                                            className='form-control'
                                                            placeholder='Nom de la banque de votre compte titre'
                                                            defaultValue={otherBankNameTitle}
                                                            onChange={(event) => setOtherBankNameTitle(event.target.value)}
                                                        />
                                                    </div>
                                                </div >
                                            )}



                                            {/* Fin Q3 */}
                                            {/* Question 6 */}
                                            <div className="form-group mb-6 mt-3">
                                                <label
                                                    htmlFor="bankReferencesTitle"
                                                    className="text-blackish-blue mb-2"
                                                >
                                                    Références de la banque de votre compte titre
                                                </label>
                                                <div className='form-group'>
                                                    <input
                                                        type='text'
                                                        id='bankReferencesTitle'
                                                        className='form-control'
                                                        placeholder='Références de la banque de votre compte titre'
                                                        defaultValue={bankReferencesTitle}
                                                        onChange={(event) => setBankReferencesTitle(event.target.value)}
                                                    />
                                                </div>
                                            </div>


                                            {/* Fin */}


                                        </>
                                    ) : ("")}
                                    {/* **************FIN CONDITION COMPTE TITRE*********** */}
                                </>
                            ) : ("")}
                            {/* ***********************FIN SECTION BANQUE*************** */}

                            {/* ***************FIN CONDITION***************** */}





                            {/* ********SECTION MOBILE MONEY****************** */}
                            <div className="form-group mb-6 mt-3">
                                <label
                                    htmlFor="mobileAccount"
                                    className="text-blackish-blue mb-2"
                                >
                                    Avez-vous un compte de monnaie électronique (Mobile money)?
                                </label>
                                <select
                                    className="form-control"
                                    id="mobileAccount"
                                    required
                                    defaultValue={mobileAccount}
                                    onChange={(event) => setMobileAccount(event.target.value)}
                                >
                                    <option defaultValue="">Choisissez</option>
                                    <optgroup className='single-cryptocurrency-box'>
                                        <option value="Oui">Oui</option>
                                        <option value="Non">Non</option>
                                    </optgroup>
                                </select>
                            </div >

                            {/* ****************SI L'UTISATEUR A UN COMPTE MOBILE MONEY******** */}
                            {mobileAccount === "Oui" ? (
                                <>

                                    {/* Question 7 */}
                                    <div className="form-group mb-6 mt-3">
                                        <label
                                            htmlFor="mobileCountry"
                                            className="text-blackish-blue mb-2"
                                        >
                                            Pays de votre compte de la monnaie électronique existant
                                        </label>
                                        <select
                                            className="form-control"
                                            id="mobileCountry"
                                            required
                                            defaultValue={mobileCountry}
                                            onChange={(event) => setMobileCountry(event.target.value)}
                                        >
                                            <option defaultValue="">Choisissez</option>
                                            {allCountry ? (
                                                allCountry.map((data) => (
                                                    <optgroup className='single-cryptocurrency-box'
                                                        key={data.id}>
                                                        <option value={data.code}>{data.libelle}</option>
                                                    </optgroup>
                                                ))
                                            ) : ("")}
                                        </select>
                                    </div >
                                    {/* Fin Q3 */}

                                    {/* Question 7 */}
                                    {mobileCountry === "CI" || mobileCountry === "BF" || mobileCountry === "SN" || mobileCountry === "CM" || mobileCountry === "GN" || mobileCountry === "ML" || mobileCountry === "TG" || mobileCountry === "BJ" ? (
                                        <>
                                            <div className="form-group mb-6 mt-3">
                                                <label
                                                    htmlFor="Operator"
                                                    className="text-blackish-blue mb-2"
                                                >
                                                    Opérateur de votre compte de la monnaie électronique existant
                                                </label>
                                                <select
                                                    className="form-control"
                                                    id="operator"
                                                    required
                                                    defaultValue={operator}
                                                    onChange={(event) => setOperator(event.target.value)}
                                                >
                                                    <option defaultValue="">Choisissez </option>
                                                    {allOperators.map((data) => (
                                                        data.countryIso === mobileCountry ?
                                                            <optgroup className='single-cryptocurrency-box' key={data.id}>
                                                                <option value={data.operatorName}>{data.operatorName}</option>
                                                            </optgroup>
                                                            : ""
                                                    ))}

                                                </select>
                                            </div >
                                        </>
                                    ) : (

                                        <div className="form-group mb-6 mt-3">
                                            <label
                                                htmlFor="bankNameTitle"
                                                className="text-blackish-blue mb-2"
                                            >
                                                Opérateur de votre compte de la monnaie électronique existant

                                            </label>
                                            <div className='form-group '>
                                                <input
                                                    type='text'
                                                    id='bankNameCurrentTitle'
                                                    className='form-control'
                                                    placeholder='Nom de votre opérateur'
                                                    defaultValue={operator}
                                                    onChange={(event) => setOperator(event.target.value)}
                                                />
                                            </div>
                                        </div >
                                    )}
                                    {/* Fin Q3 */}
                                </>
                            ) : ("")}
                            {/* **********FIN CONDITION MOBILE************** */}
                            {/* ****************FIN SECTION MOBILE***************** */}

                            <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                                <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                    {/*   <Link href='/profil/kyc/particulier/questionnaires-revenus-one' className="align-right">
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
