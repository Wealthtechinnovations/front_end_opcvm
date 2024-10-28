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
    const [messageError, setMessageError] = useState();

    // State Pour Camera photo
    const webcamRef = useRef<Webcam>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    // Fin

    //    State de l'envoie du selfie
    const [userPicture, setUserPicture] = useState()



    const [currentUser, setCurrentUser] = useState();
    const [provider, setProvider] = useState(null);

    const [currentKycStatut, setCurrentKycStatut] = useState<string | null>(null); // Initialize as string or null

    //localStorage pour récupérer une valeur en cliquant sur un bouton Recompleter qui indique qu'on veut modifier une partie Kyc 
    useEffect(() => {
        const kycStatut = localStorage.getItem('currentUpdateKycStatut')
        setCurrentKycStatut(kycStatut)
    }, [currentKycStatut]);
    // Fin






    // Fonction pour prendre photo
    const capture = () => {
        if (webcamRef.current !== null) {
            const image = webcamRef.current.getScreenshot()
            setImageSrc(image)

        }
    };
    // Fin


    // Fonction d'envoie des informations du fichiers en photo pour le profil particulier
    const addUserPicture = useCallback(async () => {
        setIsLoggingIn(true);
        try {

            const dataa = {
                userPicture: imageSrc,
            }

            const token = localStorage.getItem('tokenEnCours') //Le token récuperé

            const result = await fetch(`${urlstableconstant}/api/kyc/particular/add-kyc-selfie`, {
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
                    html: `<p> Votre photo a été sauvegardée avec succès.</p>`,
                    showConfirmButton: false,
                    timer: 5000
                }),
                    setTimeout(() => {
                        if (currentKycStatut === "1") {
                            router.push("/portefeuille/Kyc_particulier/resultat-kyc");

                        } else {
                            router.push("/portefeuille/Kyc_particulier/question9");
                        }

                    }, 5000)

            } else {
                setMessageError(data.message)

                setIsLoggingIn(false);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    html: `<p> ${messageError} </p>`,
                    showConfirmButton: false,
                    timer: 10000
                })

            }
            // Fin condition 

        } catch {
            setIsLoggingIn(false);
        }

    }, [userPicture, imageSrc]);
    // Fin

    // La barre de progression de KYC du profil particulier
    const steps = ["AML 1 & 2", "FATCA", "Identité 1 & 2", "Selfie", "Domicile", "Photo", "Signature"];
    const activeStep = 4;
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
                        <br /><br /><h1 className='text-center'>Photo</h1>
                    </div>
                </div>



                {/* Les cards */}
                <div className='row'>
                    <div className='col-lg-3 col-md-3 text-center'>

                    </div>

                    <div className='m-4 p-3 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg rounded-xl bg-white cryptocurrency-search-box login-form col-lg-8 col-md-12'>
                        <form className=''>
                            <div className='row'>
                                <div className='col-4'>
                                    <p className=''>Suivez cet exemple</p>
                                    <img src="/images/selfie.png" alt="Selfie" />
                                </div>
                                <div className="form-group row mt-3 text-center col-8">
                                    <label
                                        htmlFor="Q1"
                                        className="text-blackish-blue mb-2"
                                    >
                                        Merci de prendre une photo de vous
                                    </label>
                                    <div className="form-group col-lg-3 col-md-3"></div>

                                    <div className="form-group col-lg-6 col-md-6 ">
                                        {/* Si on a pas encore pris la photo on affiche la camera */}
                                        {!imageSrc ? (
                                            <Webcam
                                                audio={false}
                                                height={350}
                                                ref={webcamRef}
                                                screenshotFormat="image/jpeg"
                                                width={350}
                                            />
                                        ) : ("")}
                                        {/* Fin */}

                                        {/* Si on a pas encore pris la photo on affiche ce bouton */}
                                        {!imageSrc ? (
                                            <button type='button' onClick={capture}>Sauvegarder</button>
                                        ) : ("")}
                                        {/* Fin */}


                                        {/* Si on a pris la photo et qu'on veut reprende on affiche on clique sur ce bouton */}
                                        {imageSrc ? (
                                            <button type='button' onClick={() => setImageSrc("")}>Reprendre la photo</button>
                                        ) : ("")}
                                        {/* Fin */}

                                        {/* Pour afficher l'image qui a été prise        */}
                                        {imageSrc && <img src={imageSrc} alt="Selfie" />}
                                        {/* Fin*/}

                                    </div>
                                    <div className="form-group col-lg-3 col-md-3"></div>

                                </div>
                                {/* Fin */}
                                {imageSrc ? (
                                    <>


                                        <div className="form-group mb-6 mt-3 col-lg-12 col-md-12  row justify-content-between">
                                            <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">

                                            </div>

                                            <div className="form-group mb-6 mt-3 col-lg-6 col-md-6">
                                                <button className="btn btn-primary " onClick={addUserPicture} type='button' disabled={isLoggingIn}>Suivant</button>
                                            </div>
                                        </div>
                                    </>
                                ) : ("")}


                                {/* </Link> */}
                            </div>

                        </form>

                    </div>
                    <div className='col-lg-3 col-md-3'></div>
                </div>
            </div>
        </>
    );
};



