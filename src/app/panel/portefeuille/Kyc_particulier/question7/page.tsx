"use client";
import moment from 'moment';
import { urlconstant, urlstableconstant, API_KEY_STABLECOIN } from "@/app/constants";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';
//import ProgressBar from 'react-bootstrap/ProgressBar';
import ProgressBar from '../../../../ProgressBar';
import 'react-step-progress-bar/styles.css'; // Assurez-vous d'importer les styles CSS si nécessaire
import Header from "@/app/Header";
import React from "react";
import axios from 'axios';


// Pour Magic
import { magic } from "../../../../../../magic";
import { ethers } from "ethers";
import { useCallback, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
// MODALS 
// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    InputGroupText,
    InputGroup,
    Modal,
    Row,
    Col,
} from "reactstrap";
import Webcam from 'react-webcam'

// FIN


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

    const [modalFile, setModalFile] = React.useState(false);


    const [statut, setStatut] = React.useState("0");
    const [statutRecto, setStatutRecto] = React.useState("0");
    const [statutVerso, setStatutVerso] = React.useState("0");

    // State de question 0
    const [typeJustificatif, setTypeJustificatif] = useState('default');

    // Fin
    const [selected, setSelected] = useState('file');



    // State Pour Camera photo
    const webcamRefRecto = useRef<Webcam>(null);
    const webcamRefVerso = useRef<Webcam>(null);
    const [imageRecto, setImageRecto] = useState<string | null>(null);
    const [imageVerso, setImageVerso] = useState<string | null>(null);
    // Fin

    // State de la géolocalisation
    const [latitude, setLatitude] = useState<string | undefined>(undefined);
    const [longitude, setLongitude] = useState<string | undefined>(undefined);

    // State pour les fichiers du justificatif de domicile
    const [frontProofResidence, setFrontProofResidence] = React.useState<File | null>(null);
    const [backProofResidence, setBackProofResidence] = React.useState<File | null>(null);

    const [currentKycStatut, setCurrentKycStatut] = useState<string | null>(null); // Initialize as string or null
    const [howImportDoc, setHowImportDoc] = useState<string | null>(null); // Initialize as string or null


    //localStorage pour récupérer une valeur en cliquant sur un bouton Recompleter qui indique qu'on veut modifier une partie Kyc 
    useEffect(() => {
        const kycStatut = localStorage.getItem('currentUpdateKycStatut')
        setCurrentKycStatut(kycStatut)
    }, [currentKycStatut]);
    // Fin

    // Fonction pour prendre photo du Recto
    const captureRecto = () => {
        if (webcamRefRecto.current !== null) {
            const image = webcamRefRecto.current.getScreenshot();
            setImageRecto(image)

        }
    }
    // Fin

    // Fonction pour prendre photo du verso
    const captureVerso = () => {
        if (webcamRefVerso.current !== null) {
            const image = webcamRefVerso.current.getScreenshot();
            setImageVerso(image);
        }
    }
    // Fin




    // FONCTION POUR UPLOADER LES FICHIERS
    // const [image, setImage] = useState(null);
    const [createObjectURL, setCreateObjectURL] = React.useState<string | null>(null);
    const uploadToClient: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];

            if (event.target.name === "recto") {
                setFrontProofResidence(file);
            } else if (event.target.name === "verso") {
                setBackProofResidence(file);
            }

            setCreateObjectURL(URL.createObjectURL(file));
        }
    };


    // Fonction d'envoie des informations du fichiers en photo
    const AddJustificationDomicilePhoto = async () => {
        setIsLoggingIn(true);

        try {

            const dataa = {
                latitude: latitude,
                longitude: longitude,
                frontProofResidencePhoto: imageRecto,
                backProofResidencePhoto: imageVerso
            }

            const token = localStorage.getItem('tokenEnCours') //Le token récuperé

            const result = await fetch(`${urlstableconstant}/api/kyc/particular/add-kyc-domicile-photo`, {
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
            if (data.message === 200) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    html: `<p> Vos fichiers ont été sauvegardés avec succès.</p>`,
                    showConfirmButton: false,
                    timer: 5000
                }),
                    setTimeout(() => {
                        if (currentKycStatut === "1") {
                            router.push("/portefeuille/Kyc_particulier/resultat-kyc");

                        } else {
                            router.push("/portefeuille/Kyc_particulier/question8");
                        }
                    }, 5000)
            } else {
                // setMessageError(data.message)

                setIsLoggingIn(false);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    html: `<p>Désolé une erreur s'est produite,Veuillez réessayer svp.  </p>`,
                    showConfirmButton: false,
                    timer: 10000
                })

            }
            // Fin condition 

        } catch {
            setIsLoggingIn(false);
        }
    }
    // Fin

    // FONCTION POUR OBTENIR LES INFOS SUR LA POSITION EXACTE DE L'UTILISATEUR
    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(saveUserLocation);
        } else {
            Swal.fire({
                position: 'center',
                icon: 'error',
                html: `<p> La géolocalisation n'est pas prise en charge par ce navigateur.</p>`,
                showConfirmButton: false,
                timer: 5000
            })
        }
    }
    // FIN
    // FONCTION POUR SAUVEGARDER LES INFOS DE GEAOLOCATION DE USER
    function saveUserLocation(position: { coords: { latitude: any; longitude: any; }; }) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setLatitude(latitude)
        setLongitude(longitude)
    }
    // FIN

    // FONCTION D'AJOUT DES FICHIERS DE LA RESIDENSE DANS LA BASE DE DONNEE
    const AddJustificationDomicile = async () => {
        const token = localStorage.getItem('tokenEnCours')
        const body = new FormData();

        if (latitude !== undefined)
            body.append("latitude", latitude);

        if (longitude !== undefined)
            body.append("longitude", longitude);

        if (frontProofResidence !== null) {
            body.append("frontProofResidence", frontProofResidence);
        }

        if (backProofResidence !== null) {
            body.append("backProofResidence", backProofResidence);
        }

        const result = await fetch(`${urlstableconstant}/api/kyc/particular/add-kyc-domicile`, {
            method: "PUT",
            body,
            headers: {
                // 'Content-Type': 'application/json',
                'x-api-key': `${API_KEY_STABLECOIN}`,
                Authorization: `Bearer ${token}`,
            },
        })

        /* Verifier s'il y a un messsage d'erreur on l'affiche dans SWAL 
                * sinon on affiche le message de succès
                */
        if (result?.status === 200) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                html: `<p> Vos fichers de justificatif de domicile ont été sauvegardés avec succès.</p>`,
                showConfirmButton: false,
                timer: 5000
            }),
                setTimeout(() => {
                    if (currentKycStatut === "1") {
                        router.push("/portefeuille/Kyc_particulier/resultat-kyc");

                    } else {
                        router.push("/portefeuille/Kyc_particulier/question8");
                    }
                }, 5000)


        } else {
            // setMessageError(data.message)
            setIsLoggingIn(false);
            Swal.fire({
                position: 'center',
                icon: 'error',
                html: `<p> Désolé une erreur s'est produite,Veuillez réessayer svp. </p>`,
                showConfirmButton: false,
                timer: 10000
            })
        }
        // Fin condition 
    }
    // FIN

    // La barre de progression de KYC
    const steps = ["AML 1 & 2", "FATCA", "Identité 1 & 2", "Selfie", "Domicile", "Photo", "Signature"];
    const activeStep = 3;
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
                        <br /><br /><h1 className='text-center'>Justificatif de domicile</h1>
                    </div>
                </div>



                {/* Les cards */}
                <div className='row'>
                    <div className='col-lg-3 col-md-12'></div>

                    <div className='m-4 p-3 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg rounded-xl bg-white cryptocurrency-search-box login-form col-lg-8 col-md-12'>
                        <form className=''>
                            <label className='colorRed'>
                                NB: Notez que vous devez être chez vous, à domicile, avant de cliquer sur le bouton ci-dessous pour enregistrer votre situation géographique.
                            </label>
                            <div className="form-group row">

                                <div className='row '>
                                    <div className="form-group mb-6 mt-3 col-lg-3 col-md-3"></div>
                                    <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                        {latitude && longitude ? (
                                            <label className='colorGreen'>
                                                Félicitations ! Vos informations ont été enregistrées avec succès. Nous vous remercions d avoir partagé votre situation géographique.
                                            </label>
                                        ) : (
                                            <button className="btn btn-primary" type='button' onClick={getUserLocation}>Enregistrer </button>
                                        )}
                                    </div>
                                    <div className="form-group mb-6 mt-3 col-lg-3 col-md-3"></div>
                                </div>
                                <div className="form-group my-6">
                                    <label
                                        htmlFor="picture"
                                        className='mb-6'
                                    >
                                        Merci de joindre soit (votre facture de l électricité ou votre attestation de résidence ou votre relevé de compte bancaire)
                                    </label>
                                </div><br />

                                {/* PARTIE DE LA MANIERE A ENVOYER LES FICHIERS */}
                                <div className="form-group mb-6 mt-3">
                                    <label
                                        htmlFor="Q1"
                                        className="text-blackish-blue mb-2"
                                    >
                                        Comment voulez-vous importer vos fichiers ?
                                        <br />
                                    </label>

                                    <div className='row'>
                                        {/* Imoporter*/}
                                        <div className="form-group col-lg-6  mt-3 ">
                                            <label
                                                htmlFor="importer-check"
                                                className="gr-check-input mb-7 d-flex"
                                            >

                                                <input
                                                    type="radio"
                                                    name="0"
                                                    value='0'
                                                    id='importer-check'
                                                    checked={howImportDoc === "0"}
                                                    onChange={() => setHowImportDoc("0")}
                                                />
                                                <p className=" mx-2 mb-0 text-center">
                                                    Importer les fichiers pdf ou image
                                                </p>
                                            </label>
                                        </div>
                                        {/* Photo */}
                                        <div className="form-group col-lg-6  mt-3 ">
                                            <label
                                                htmlFor="photo-check"
                                                className="gr-check-input mb-7 d-flex"
                                            >
                                                <input
                                                    type="radio"
                                                    name="photo"
                                                    value="1"
                                                    id='photo-check'
                                                    checked={howImportDoc === "1"}
                                                    onChange={() => setHowImportDoc("1")}
                                                />
                                                <p className=" mx-2 mb-0 text-center">
                                                    Prendre les fichiers en photo
                                                </p>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                {/* FIN */}

                                {/* SI L'UTILISATEUR CHOISIT D'IMPORTER LES DOCUMENTS */}

                                {howImportDoc === "0" ? (
                                    <>
                                        <div className="form-group my-6">
                                            <label
                                                htmlFor="picture"
                                            >
                                                Recto de votre justificatif de domicile
                                            </label>
                                            <input
                                                className="form-control border mt-3 bg-white"
                                                type="file"
                                                name="myImage"
                                                id='picture'
                                                accept="application/pdf, image/*"
                                                onChange={uploadToClient}
                                            />
                                        </div>
                                        <div className="form-group mb-6">
                                            <label
                                                htmlFor="picture"
                                            >
                                                Verso de votre justificatif de domicile (Facultatif si le fichier ne contient pas de verso)
                                            </label>
                                            <input
                                                className="form-control  border mt-3"
                                                type="file"
                                                name="myImage"
                                                id='picture'
                                                accept="application/pdf, image/*"
                                                onChange={uploadToClient}
                                            />
                                        </div>
                                    </>
                                ) : ("")}
                                {/* FIN IMPORTATION */}
                                {/* SI L'UTILISATEUR CHOISIT DE PRENDRE LES DOCUMENTS EN PHOTO */}
                                {howImportDoc === "1" ? (
                                    <>
                                        <div className='row'>
                                            <div className="form-group col-lg-3 col-md-3 "></div>

                                            <div className="form-group col-lg-6 col-md-6 ">
                                                {statutRecto === "0" ? (
                                                    <button className="btn btn-primary "
                                                        type='button'
                                                        disabled={isLoggingIn}
                                                        onClick={() => setStatutRecto("1")}
                                                    >
                                                        Déclencher la caméra pour prendre la photo du Recto
                                                    </button>
                                                ) : ("")}


                                                {/* Cette partie s'affciche lorsqu'on clique sur le bouton ci-dessus */}
                                                {/* Recto */}
                                                {statutRecto === "1" ? (
                                                    <>
                                                        <label
                                                            htmlFor="picture"
                                                            className='text-center'
                                                        >
                                                            Recto de votre justificatif de domicile
                                                        </label>
                                                        {/* Si on a pas encore pris la photo on affiche la camera */}
                                                        {!imageRecto ? (
                                                            <Webcam
                                                                audio={false}
                                                                height={350}
                                                                ref={webcamRefRecto}
                                                                screenshotFormat="image/jpeg"
                                                                width={350}
                                                            />
                                                        ) : ("")}
                                                        {/* Fin */}

                                                        {/* Si on a pas encore pris la photo on affiche ce bouton */}
                                                        {!imageRecto ? (
                                                            <button type='button' onClick={captureRecto}>Sauvegarder</button>
                                                        ) : ("")}
                                                        {/* Fin */}


                                                        {/* Si on a pris la photo et qu'on veut reprende on affiche on clique sur ce bouton */}
                                                        {imageRecto ? (
                                                            <button type='button' onClick={() => setImageRecto("")}>Reprendre la photo</button>
                                                        ) : ("")}
                                                        {/* Fin */}

                                                        {/* Pour afficher l'image qui a été prise        */}
                                                        <div className='text-center'>
                                                            {imageRecto && <img src={imageRecto} alt="Selfie" />}
                                                        </div>
                                                        {/* Fin*/}
                                                    </>
                                                ) : ("")}
                                                {/* Fin Recto */}

                                                {/* Verso */}
                                                {imageRecto ? (
                                                    statutVerso === "0" ? (

                                                        <button className="btn btn-primary "
                                                            type='button'
                                                            disabled={isLoggingIn}
                                                            onClick={() => setStatutVerso("1")}
                                                        >
                                                            Déclencher la caméra pour prendre la photo du verso
                                                        </button>
                                                    ) : ("")
                                                ) : ("")}

                                                {statutVerso === "1" ? (
                                                    <>
                                                        <br /><br />
                                                        <label
                                                            htmlFor="picture"
                                                            className='text-center'
                                                        >
                                                            Verso de votre justificatif de domicile
                                                        </label>
                                                        {/* Si on a pas encore pris la photo on affiche la camera */}
                                                        {!imageVerso ? (
                                                            <Webcam
                                                                audio={false}
                                                                height={350}
                                                                ref={webcamRefVerso}
                                                                screenshotFormat="image/jpeg"
                                                                width={350}
                                                            />
                                                        ) : ("")}
                                                        {/* Fin */}

                                                        {/* Si on a pas encore pris la photo on affiche ce bouton */}
                                                        {!imageVerso ? (
                                                            <button type='button' onClick={captureVerso}>Sauvegarder</button>
                                                        ) : ("")}
                                                        {/* Fin */}


                                                        {/* Si on a pris la photo et qu'on veut reprende on affiche on clique sur ce bouton */}
                                                        {imageVerso ? (
                                                            <button type='button' onClick={() => setImageVerso("")}>Reprendre la photo</button>
                                                        ) : ("")}
                                                        {/* Fin */}

                                                        {/* Pour afficher l'image qui a été prise        */}
                                                        <div className='text-center'>
                                                            {imageVerso && <img src={imageVerso} alt="Selfie" />}
                                                        </div>
                                                        {/* Fin*/}
                                                    </>
                                                ) : ("")}
                                                {/* Fin verso */}
                                            </div>
                                        </div>
                                    </>
                                ) : ("")}
                                {/* ****************FIN PRENDRE PHOTO**************** */}

                            </div>
                            {/* Fin */}
                            <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                                <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">

                                </div>

                                <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                    {howImportDoc === "0" ? (
                                        <button className="btn btn-primary " type='button' onClick={AddJustificationDomicile} disabled={isLoggingIn}>Suivant</button>
                                    ) : ("")}

                                    {howImportDoc === "1" ? (
                                        <button className="btn btn-primary " type='button' onClick={AddJustificationDomicilePhoto} disabled={isLoggingIn}>Suivant</button>
                                    ) : ("")}

                                </div>
                                <div className="form-group col-lg-3 col-md-3 "></div>

                            </div>


                        </form>

                    </div>
                    <div className='col-lg-3 col-md-12'></div>
                </div>
            </div>



        </>
    );
};

