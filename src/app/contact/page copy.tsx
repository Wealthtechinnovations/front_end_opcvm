"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import Header from '../Header';
import { urlconstant } from "@/app/constants";
import Slider from "react-slick";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faMapMarkerAlt, faPhoneAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { useRouter } from 'next/navigation';
import { Metadata } from "next";

library.add(faMapMarkerAlt, faPhoneAlt, faEnvelope);
import '@fortawesome/fontawesome-svg-core/styles.css'; // Import the styles
import { config } from '@fortawesome/fontawesome-svg-core';
import Head from "next/head";
config.autoAddCss = false; // Disable the automatic styles insertion

export default function Accueil() {
    const [userConnected, setUserConnected] = useState<number | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const isLoggedIn = localStorage.getItem('isLoggedIn');
                const userId = localStorage.getItem('userId');

                console.log("isLoggedIn")
                if (isLoggedIn === 'true' && userId !== null) {
                    const userIdNumber = parseInt(userId, 10);
                    setIsLoggedIn(true);
                    setUserConnected(userIdNumber)
                } else {
                    // If storedIsLoggedIn is null or any other value, set the state to false
                    setIsLoggedIn(false);
                } console.log(isLoggedIn)
            } catch (error) {
                console.error('Erreur lors de l’appel à l’API :', error);
            }
        };
        fetchData();
    }, []);
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };
    const textArray = ["Bénéficiez de l'expertise du Conseil Institutionnel. Nos professionnels chevronnés fournissent des conseils stratégiques et personnalisés pour optimiser votre stratégie d'investissement", "Votre sécurité est notre priorité. Nous respectons les normes les plus élevées de la conformité Know Your Customer (KYC), assurant un environnement d'investissement sûr et transparent.", "Explorez le monde des OPCVM - Organisme de Placement Collectif en Valeurs Mobilières, géré intelligemment avec la technologie de Robo-Advisor pour des rendements optimaux.", /* Add more texts as needed */];
    const [showQuiSommesNous, setShowQuiSommesNous] = useState(true);
    const [showNotreVision, setShowNotreVision] = useState(false);
    const images = [
        '/images/new/accueilafri.jfif',
        '/images/new/KYC.jfif',
        '/images/new/robot2.jfif',
        // Add more image paths as needed
    ];

    const carouselSettings = {
        showThumbs: false, // Hide small images at the bottom
        autoPlay: true, // Enable automatic scrolling
        interval: 5000, // Set the interval for automatic scrolling (in milliseconds)
        infiniteLoop: true, // Loop back to the beginning after the last slide
    };
    const smoothScroll = (e: any) => {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('data-target');
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            console.log(targetElement);

            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest', // Adjust as needed: 'start', 'center', 'end', or 'nearest'
                inline: 'nearest', // Adjust as needed: 'start', 'center', 'end', or 'nearest'
            });

            console.log('After scroll');
        }
    };
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    const router = useRouter();


    const handleLinkClick = () => {

        if (userConnected !== null) {
            setTimeout(() => {
                const redirectUrl = `/panel/portefeuille/home?id=${userConnected}`;

                router.push(redirectUrl);
            }, 5);

        } else {
            setTimeout(() => {
                // const redirectUrl = `/panel/portefeuille/home?id=${userConnected}`;

                router.push('/panel/societegestionpanel/login');
            }, 5);
        }
    };

    const handleLinksociete = () => {


        setTimeout(() => {
            const redirectUrl = `/Fundmanager/recherche`;

            router.push(redirectUrl);
        }, 1);


    };
    const handleLinkquestionnaire = () => {


        setTimeout(() => {
            const redirectUrl = `/Opcvm/questionnaire`;

            router.push(redirectUrl);
        }, 1);


    };

    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const [isHoveredq, setIsHoveredq] = useState(false);

    const handleMouseEnterq = () => {
        setIsHoveredq(true);
    };

    const handleMouseLeaveq = () => {
        setIsHoveredq(false);
    };

    const [isHovereda, setIsHovereda] = useState(false);

    const handleMouseEntera = () => {
        setIsHovereda(true);
    };

    const handleMouseLeavea = () => {
        setIsHovereda(false);
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
        <Fragment>
            <Header />
            <Head>
                <title>Opcvm Afrique: Guide Complet</title>
                <meta name="description" content="Découvrez notre sélection d'Opcvm en Afrique pour optimiser votre portefeuille d'investissement." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="canonical" href="https://funds.chainsolutions.fr/Opcvm/576" />
                <meta property="og:title" content="Opcvm Afrique: Guide Complet" />
                <meta property="og:description" content="Découvrez notre sélection d'Opcvm en Afrique pour optimiser votre portefeuille d'investissement." />
                <meta property="og:url" content="https://funds.chainsolutions.fr/Opcvm/576" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            <br />

            <nav className="main-nav bg-white" role="navigation">
                <input id="main-menu-state" type="checkbox" checked={menuOpen} onChange={toggleMenu} />
                <label className="main-menu-btn" htmlFor="main-menu-state">
                    <span className="main-menu-btn-icon"></span> Toggle main menu visibility
                </label>
                <ul id="main-menu" className={`sm sm-blue ${menuOpen ? 'open' : ''}`}>
                    <li style={{ height: '40px' }}>
                        <Link className="link-style" style={{ width: '150px', backgroundColor: "#3b82f6", color: "white", display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', padding: '10px', textDecoration: 'none' }} href="/accueil">Accueil</Link>
                    </li>
                    <li style={{ height: '40px' }}>
                        <Dropdown>
                            <Dropdown.Toggle id="dropdown-basic" style={{ width: '150px', backgroundColor: 'white', color: 'black', display: 'block', height: '100%', padding: '10px', textDecoration: 'none' }}>
                                Gestion Fonds
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item href="/comparaison">Comparaison</Dropdown.Item>
                                <Dropdown.Item href="/Opcvm/recherche">Fonds</Dropdown.Item>
                                <Dropdown.Item href="/recherche">Selection OPCVM</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </li>
                    <li style={{ height: '40px' }}>
                        <Dropdown>
                            <Dropdown.Toggle id="dropdown-basic" style={{ width: '150px', backgroundColor: 'white', color: 'black', display: 'block', height: '100%', padding: '10px', textDecoration: 'none' }}>
                                Connexion
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={handleLinkClick} href="#">Espace Membre</Dropdown.Item>
                                <Dropdown.Item href="/panel/societegestionpanel/login">Espace client</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </li>
                    <li style={{ height: '40px' }}>
                        <button
                            onClick={handleLinksociete}
                            style={{
                                backgroundColor: isHovered ? 'blue' : 'white',
                                color: isHovered ? 'white' : 'black',
                                display: 'block',
                                height: '100%',
                                padding: '10px',
                                textDecoration: 'none',
                                border: '1px solid #000',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                width: '150px',
                                transition: 'background-color 0.3s'
                            }}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            Societe de gestion
                        </button>
                    </li>
                    <li style={{ height: '40px' }}>
                        <Dropdown>
                            <Dropdown.Toggle id="dropdown-basic" style={{ width: '150px', backgroundColor: 'white', color: 'black', display: 'block', height: '100%', padding: '10px', textDecoration: 'none' }}>
                                Profil Investisseur
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item href="/questionnaire/questionnaire/pre/question1">Questionnaire cours</Dropdown.Item>
                                <Dropdown.Item href="/questionnaire/questionnaire/question1">Profil investisseur (MIFID)</Dropdown.Item>
                                <Dropdown.Item href="#">KYC</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </li>
                    <li style={{ height: '40px' }}>
                        <button
                            onClick={handleLinkactualite}
                            style={{
                                width: '150px',
                                backgroundColor: isHovereda ? 'blue' : 'white',
                                color: isHovereda ? 'white' : 'black',
                                display: 'block',
                                height: '100%',
                                padding: '10px',
                                textDecoration: 'none',
                                border: '1px solid #000',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s'
                            }}
                            onMouseEnter={handleMouseEntera}
                            onMouseLeave={handleMouseLeavea}
                        >
                            &nbsp;&nbsp;&nbsp;   Actualités &nbsp;&nbsp;&nbsp;
                        </button>
                    </li>
                    <li style={{ height: '40px', }}>
                        <button
                            onClick={handleLinkpays}
                            style={{
                                width: '150px',
                                backgroundColor: isHoveredp ? 'blue' : 'white',
                                color: isHoveredp ? 'white' : 'black',
                                display: 'block',
                                height: '100%',
                                padding: '10px',
                                textDecoration: 'none',
                                border: '1px solid #000',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s'
                            }}
                            onMouseEnter={handleMouseEnterp}
                            onMouseLeave={handleMouseLeavep}
                        >
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;     Pays &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </button>
                    </li>
                </ul>

            </nav>
            { /*     <h1 hidden>Guide Complet sur les Fonds OPCVM en Afrique</h1>

            <h2 hidden>Introduction aux Fonds OPCVM</h2>
            <p hidden>Le contenu explique ce que sont les OPCVM, leur importance, et comment ils fonctionnent en Afrique.</p>

            <h3 hidden>Historique des Fonds OPCVM en Afrique</h3>
            <p hidden>Une section dédiée à l histoire et à l'évolution des fonds OPCVM sur le continent africain.</p>

            <h2 hidden>Types de Fonds OPCVM Disponibles en Afrique</h2>
            <p hidden>Cette section couvre les différents types de fonds OPCVM disponibles pour les investisseurs en Afrique.</p>

            <h3 hidden>Fonds d Actions</h3>
            <p hidden>Description des fonds d'actions, avec des exemples spécifiques disponibles en Afrique.</p>

            <h4 hidden>Critères de Sélection d'un Fonds d'Actions</h4>
            <p hidden>Conseils et critères à considérer lors de la sélection d'un fonds d'actions OPCVM.</p>

            <h3 hidden>Fonds Obligataires</h3>
            <p hidden>Explication des fonds obligataires et de leur fonctionnement en Afrique.</p>

            <h4 hidden>Avantages des Fonds Obligataires</h4>
            <p hidden>Discussion sur les avantages des fonds obligataires pour les investisseurs africains.</p>

            <h5 hidden>Étude de Cas : Le Fonds Obligataire XYZ</h5>
            <p hidden>Une étude de cas sur le succès d'un fonds obligataire spécifique en Afrique.</p>

            <h2 hidden>Conclusion et Perspectives d'Avenir pour les Fonds OPCVM en Afrique</h2>
            <p hidden>Un résumé des points clés abordés et une discussion sur l'avenir des fonds OPCVM en Afrique.</p>
 */}
            <div className="">
                <div className="container-full">
                    <section className="content">
                        <div className="row">
                            <Carousel {...carouselSettings} className="carouselContainer">
                                {images.map((image, index) => (
                                    <div key={index} className="row">
                                        <div className="col-md-6">
                                            <div key={index} className="carouselSlide">
                                                <div className="imageContainer">
                                                    <img
                                                        src={image}
                                                        alt={`Slide ${index + 1}`}
                                                        className="img-fluid"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 d-flex align-items-start"> {/* Utiliser align-items-start pour aligner le contenu en haut verticalement */}
                                            <div className="carouselSlide1">
                                                <div className="">
                                                    <p className="textstyle">{textArray[index]}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Carousel>


                            <section className="content">
                                <div className="section-center-heading">
                                    <h2>
                                        <span>A PROPOS DE NOUS</span>
                                    </h2>
                                    <button style={{
                                        textDecoration: 'none',
                                        backgroundColor: '#6366f1',
                                        color: 'white',
                                        padding: '10px 20px',
                                        borderRadius: '5px',
                                    }} onClick={() => { setShowNotreVision(false); setShowQuiSommesNous(true); }}>Qui sommes-nous?</button>

                                    &nbsp;  <button style={{
                                        textDecoration: 'none',
                                        backgroundColor: '#6366f1',
                                        color: 'white',
                                        padding: '10px 20px',
                                        borderRadius: '5px',
                                    }} onClick={() => { setShowNotreVision(true); setShowQuiSommesNous(false); }}>&nbsp;&nbsp;&nbsp;Notre vision  &nbsp; &nbsp; &nbsp;</button>
                                </div>


                                {showQuiSommesNous && (
                                    <div className="row">
                                        <div className="col-lg-12 col-12">
                                            <div className="box">
                                                <div className="box-body">
                                                    <div className="d-flex flex-wrap align-items-center">
                                                        <div className="me-25 bg-danger-light h-60 w-60 rounded text-center b-1">
                                                            <img src="../../../images/logo/logo-1.jpg" className="align-self-center" alt="" />
                                                        </div>

                                                        <div className="d-flex flex-column flex-grow-1 my-lg-0 my-10 pe-15">

                                                            <a href="#" className="text-dark fw-600 hover-danger fs-18">
                                                                Description
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div className="mt-20">
                                                        <h4 className="text-primary mb-20">OPCVM</h4>
                                                        <p className="text-fade">Nous sommes une plateforme dynamique spécialisée dans la fourniture de services financiers en Afrique, alliant expertise locale et technologie de pointe. Notre mission est d offrir des services de gestion d actifs, de conseil financier, et de solutions technologiques de premier ordre pour stimuler la croissance et la prospérité en Afrique.
                                                        </p>
                                                        <p className="text-fade">Notre expertise en matière de conseil institutionnel est inégalée. Nous offrons :Analyse de Portefeuille: Nos spécialistes évaluent minutieusement votre portefeuille pour identifier les opportunités d optimisation.Mise en Concurrence des Gérants: Sélectionnez le meilleur pour votre institution grâce à notre réseau élargi de gérants.Accès Stratégies Globales: Nous ouvrons les portes à des stratégies non-africaines pour diversifier votre portefeuille.Fonds Dédiés & Stratégies Diversifiées: Au-delà des fonds actions et obligations, nous introduisons des investissements innovants tels que l immobilier et les ETF. <br />

                                                        </p>
                                                        <p className="text-fade">Cette plateforme est conçue pour être une force motrice dans l évolution du secteur financier africain, en utilisant l innovation et l expertise pour créer des opportunités de croissance et de développement durable pour nos clients et partenaires.</p>



                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {showNotreVision && (
                                    <div className="row">
                                        <div className="col-lg-12 col-12">
                                            <div className="box">
                                                <div className="box-body">
                                                    <div className="d-flex flex-wrap align-items-center">
                                                        <div className="me-25 bg-danger-light h-60 w-60 rounded text-center b-1">
                                                            <img src="../../../images/logo/logo-1.jpg" className="align-self-center" alt="" />
                                                        </div>

                                                        <div className="d-flex flex-column flex-grow-1 my-lg-0 my-10 pe-15">

                                                            <a href="#" className="text-dark fw-600 hover-danger fs-18">
                                                                Notre vision
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div className="mt-20">
                                                        <h4 className="text-primary mb-20">OPCVM</h4>
                                                        <p className="text-fade"> Technologie & Innovation:Texte: L avenir de la finance est numérique et nous sommes en première ligne :Robot Advisor: Optimisez la gestion financière avec notre conseiller automatisé alimenté par l IA.KYC Digitalisé: Réduisez le temps d onboarding et assurez une conformité irréprochable grâce à notre processus digitalisé.Profilage Client: Personnalisez les solutions pour chaque client grâce à notre système avancé de profilage.Blockchain: Redéfinissez les transactions et la distribution grâce à notre expertise en blockchain. <br />

                                                            Distribution & Visibilité Internationale:Texte: Propulsez votre fonds sur la scène internationale :Distribution via Blockchain: Distribuez efficacement à travers les frontières grâce à la technologie blockchain.Comparaison de Fonds & Benchmarks: Positionnez votre fonds par rapport à ses pairs et identifiez des opportunités grâce à nos analyses rigoureuses.Solutions pour Gérants: Nous offrons des outils et des stratégies pour maximiser le potentiel de chaque gérant.Dynamisation du Marché: Notre vision est de dynamiser le marché africain en introduisant de nouvelles stratégies et en établissant des normes plus élevées.
                                                        </p>



                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </section>

                            <section className="content">
                                <div className="section-center-heading">
                                    <h2>
                                        <span>Services Principaux</span>
                                    </h2>
                                    <p>Nos services.</p>
                                    <div className="service-links row">
                                        <div className="col-12 mb-2">
                                            <a href="#" data-target="service1" style={{
                                                textDecoration: 'none',
                                                backgroundColor: '#6366f1',
                                                color: 'white',
                                                padding: '10px 20px',
                                                borderRadius: '5px',
                                            }} onClick={smoothScroll}>Service 1   </a>&nbsp;
                                            <a href="#" data-target="service2" style={{
                                                textDecoration: 'none',
                                                backgroundColor: '#6366f1',
                                                color: 'white',
                                                padding: '10px 20px',
                                                borderRadius: '5px',
                                            }} onClick={smoothScroll}>Service 2   </a>&nbsp;
                                            <a href="#" data-target="service2" style={{
                                                textDecoration: 'none',
                                                backgroundColor: '#6366f1',
                                                color: 'white',
                                                padding: '10px 20px',
                                                borderRadius: '5px',
                                            }} onClick={smoothScroll}>Service 3
                                            </a>&nbsp;
                                        </div>
                                        <br />
                                        <br />
                                        <div className="col-12 mb-2">
                                            <a href="#" data-target="service3" style={{
                                                textDecoration: 'none',
                                                backgroundColor: '#6366f1',
                                                color: 'white',
                                                padding: '10px 20px',
                                                borderRadius: '5px',
                                            }} onClick={smoothScroll}>Service 4   </a>&nbsp;


                                            <a href="#" data-target="service4" style={{
                                                textDecoration: 'none',
                                                backgroundColor: '#6366f1',
                                                color: 'white',
                                                padding: '10px 20px',
                                                borderRadius: '5px',
                                            }} onClick={smoothScroll}>Service 5   </a>&nbsp;
                                            <a href="#" data-target="service5" style={{
                                                textDecoration: 'none',
                                                backgroundColor: '#6366f1',
                                                color: 'white',
                                                padding: '10px 20px',
                                                borderRadius: '5px',
                                            }} onClick={smoothScroll}>Service 6   </a>
                                        </div>
                                        {/* Add links for other services */}
                                    </div>
                                </div>
                                <div className="row">
                                    {/* Repeat the following structure for each user */}
                                    <div id="service1" className="row">
                                        {/* Image Column */}
                                        <div className="col-12 col-lg-4">
                                            <div className="box-header no-border p-0">
                                                <a href="#">
                                                    <img className="img-fluid" src="../../../images/new/opc.jfif" style={{ height: '200px', width: '300px' }} alt="" />
                                                </a>
                                            </div>
                                        </div>

                                        <div className="col-12 col-lg-8">
                                            <div className="box ribbon-box" style={{ height: '200px' }} >
                                                <div className="ribbon-two ribbon-two-primary"><span>Service 1</span></div>

                                                <div className="box-body">
                                                    <div className="text-center" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                        <h3 className="my-10"><a href="#">Analyse et Comparaison de Fonds (OPCVM) Africains</a></h3>
                                                        <h6 className="user-info mt-0 mb-10 text-fade">Nous offrons une analyse détaillée des OPCVM, combinant des méthodes quantitatives et qualitatives pour évaluer et comparer les fonds, fournissant ainsi des insights essentiels aux investisseurs.</h6>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>


                                    <div id="service2" className="row">
                                        <div className="col-12 col-lg-4">
                                            <div className="box-header no-border p-0">
                                                <a href="#">
                                                    <img className="img-fluid" src="../../../images/new/decision.jpeg" style={{ height: '200px', width: '300px' }} alt="" />
                                                </a>
                                            </div>
                                        </div>
                                        <div className="col-12 col-lg-8">

                                            <div className="box ribbon-box" style={{ height: '200px' }}>
                                                {/* Ribbon */}
                                                <div className="ribbon-two ribbon-two-primary"><span>Service 2</span></div>

                                                {/* User Image */}

                                                {/* User Information */}
                                                <div className="box-body">

                                                    <div className="text-center" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                        {/* User Name and Role */}
                                                        <h3 className="my-10"><a href="#">Conseil Institutionnel et Gestion de Portefeuille (OPCVM) Africains</a></h3>
                                                        <h6 className="user-info mt-0 mb-10 text-fade">Service dédié aux investisseurs institutionnels pour optimiser leurs stratégies de placement, incluant la due diligence, la sélection de fonds, et l analyse de portefeuille.
                                                        </h6>

                                                        {/* User Address */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="service3" className="row">
                                        <div className="col-12 col-lg-4">
                                            <div className="box-header no-border p-0">
                                                <a href="#">
                                                    <img className="img-fluid" src="../../../images/new/globestats.jpeg" style={{ height: '200px', width: '300px' }} alt="" />
                                                </a>
                                            </div>
                                        </div>
                                        <div className="col-12 col-lg-8">

                                            <div className="box ribbon-box" style={{ height: '200px' }}>
                                                {/* Ribbon */}
                                                <div className="ribbon-two ribbon-two-primary"><span>Service 3</span></div>



                                                {/* User Information */}
                                                <div className="box-body">

                                                    <div className="text-center" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                        {/* User Name and Role */}
                                                        <h3 className="my-10"><a href="#">Technologie Financière et Innovation (Fintech)</a></h3>
                                                        <h6 className="user-info mt-0 mb-10 text-fade">L innovation technologique est au cœur de nos services, incluant le développement de la blockchain, des solutions de KYC digitalisées, et un robot advisor sophistiqué.
                                                        </h6>

                                                        {/* User Address */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="service4" className="row">
                                        <div className="col-12 col-lg-4">
                                            <div className="box-header no-border p-0">
                                                <a href="#">
                                                    <img className="img-fluid" src="../../../images/new/glob2.jfif" style={{ height: '200px', width: '300px' }} alt="" />
                                                </a>
                                            </div>
                                        </div>
                                        <div className="col-12 col-lg-8">

                                            <div className="box ribbon-box" style={{ height: '200px' }}>
                                                {/* Ribbon */}
                                                <div className="ribbon-two ribbon-two-primary"><span>Service 4</span></div>

                                                {/* User Image */}


                                                {/* User Information */}
                                                <div className="box-body">

                                                    <div className="text-center" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                        {/* User Name and Role */}
                                                        <h3 className="my-10"><a href="#">Distribution Internationale et Visibilité des Fonds</a></h3>
                                                        <h6 className="user-info mt-0 mb-10 text-fade">Nous facilitons la distribution transfrontalière de fonds en utilisant la blockchain pour maximiser la visibilité et l efficacité des fonds sur les marchés mondiaux.
                                                        </h6>

                                                        {/* User Address */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="service5" className="row">
                                        <div className="col-12 col-lg-4">
                                            <div className="box-header no-border p-0">
                                                <a href="#">
                                                    <img className="img-fluid" src="../../../images/new/BALANCE.jfif" style={{ height: '200px', width: '300px' }} alt="" />
                                                </a>
                                            </div>
                                        </div>
                                        <div className="col-12 col-lg-8">

                                            <div className="box ribbon-box" style={{ height: '200px' }}>
                                                {/* Ribbon */}
                                                <div className="ribbon-two ribbon-two-primary"><span>Service 5</span></div>


                                                {/* User Information */}
                                                <div className="box-body">

                                                    <div className="text-center" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                        {/* User Name and Role */}
                                                        <h3 className="my-10"><a href="#">Collaboration avec les Régulateurs et Conformité</a></h3>
                                                        <h6 className="user-info mt-0 mb-10 text-fade">Notre collaboration étroite avec les régulateurs garantit que nos services sont non seulement innovants mais aussi conformes aux normes réglementaires.
                                                        </h6>

                                                        {/* User Address */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="service6" className="row">
                                        <div className="col-12 col-lg-4">
                                            <div className="box-header no-border p-0">
                                                <a href="#">
                                                    <img className="img-fluid" src="../../../images/new/BALANCE.jfif" style={{ height: '200px', width: '300px' }} alt="" />
                                                </a>
                                            </div>
                                        </div>
                                        <div className="col-12 col-lg-8">

                                            <div className="box ribbon-box" style={{ height: '200px' }}>
                                                {/* Ribbon */}
                                                <div className="ribbon-two ribbon-two-primary"><span>Service 6</span></div>


                                                {/* User Information */}
                                                <div className="box-body">

                                                    <div className="text-center" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                        {/* User Name and Role */}
                                                        <h3 className="my-10"><a href="#">Collaboration avec les Régulateurs et Conformité</a></h3>
                                                        <h6 className="user-info mt-0 mb-10 text-fade">Notre collaboration étroite avec les régulateurs garantit que nos services sont non seulement innovants mais aussi conformes aux normes réglementaires.
                                                        </h6>

                                                        {/* User Address */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Repeat the above structure for other users */}
                                </div>
                            </section>
                            <section className="content">
                                <div className="section-center-heading">
                                    <h2>
                                        <span>Technologies Innovantes</span>
                                    </h2>
                                    <p>Nos Technologies Innovantes.</p>
                                </div>
                                <div className="row">
                                    {/* Repeat the following structure for each user */}
                                    <div className="row">
                                        <div className="col-12 col-lg-4">
                                            <div className="box-header no-border p-0">
                                                <a href="#">
                                                    <img className="img-fluid" src="../../../images/new/robot2.jfif" style={{ height: '300px' }} alt="" />
                                                </a>
                                            </div>
                                        </div>
                                        <div className="col-12 col-lg-8">

                                            <div className="box ribbon-box" style={{ height: '300px' }}>
                                                {/* Ribbon */}
                                                <div className="ribbon-two ribbon-two-primary"><span>Technologie 1</span></div>

                                                {/* User Image */}


                                                {/* User Information */}
                                                <div className="box-body">

                                                    <div className="text-center" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                        {/* User Name and Role */}
                                                        <h3 className="my-10"><a href="#">Robot Advisor : Conseil Financier Automatisé</a></h3>
                                                        <h6 className="user-info mt-0 mb-10 text-fade">Le Robot Advisor est une innovation clé de notre plateforme, représentant l avenir du conseil financier. Grâce à une intelligence artificielle avancée, il fournit des analyses personnalisées et des recommandations d investissement adaptées aux profils spécifiques de nos clients.
                                                        </h6>

                                                        {/* User Address */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">

                                        <div className="col-12 col-lg-4">
                                            <div className="box-header no-border p-0">
                                                <a href="#">
                                                    <img className="img-fluid" src="../../../images/new/KYC.jfif" style={{ height: '300px' }} alt="" />
                                                </a>
                                            </div>
                                        </div>
                                        <div className="col-12 col-lg-8">
                                            <div className="box ribbon-box" style={{ height: '300px' }}>
                                                {/* Ribbon */}
                                                <div className="ribbon-two ribbon-two-primary"><span>Technologie 2</span></div>

                                                {/* User Image */}


                                                {/* User Information */}
                                                <div className="box-body">

                                                    <div className="text-center" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                        {/* User Name and Role */}
                                                        <h3 className="my-10"><a href="#">KYC Digitalisé : Modernisation de l Onboarding</a></h3>
                                                        <h6 className="user-info mt-0 mb-10 text-fade">Dans un effort pour améliorer l efficacité et la conformité, notre plateforme intègre un processus de Connaissance du Client (KYC) entièrement digitalisé. Ce système permet une vérification rapide et sécurisée de l identité des clients, essentielle pour la prévention de la fraude et le respect des réglementations financières. En utilisant la technologie de pointe
                                                        </h6>

                                                        {/* User Address */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>



                                    {/* Repeat the above structure for other users */}
                                </div>
                            </section>

                            <section className="content">
                                <div className="section-center-heading">
                                    <h2>
                                        <span> Distribution & Régulateur</span>
                                    </h2>
                                    <p> Distribution & Visibilité Internationale & Régulateur & Innovation</p>
                                </div>
                                <div className="row">
                                    {/* Repeat the following structure for each user */}
                                    <div className="row">

                                        <div className="col-12 col-lg-4">
                                            <div className="box-header no-border p-0">
                                                <a href="#">
                                                    <img className="img-fluid" src="../../../images/new/globestats.jpeg" style={{ height: '300px' }} alt="" />
                                                </a>
                                            </div>
                                        </div>
                                        <div className="col-12 col-lg-8">
                                            <div className="box ribbon-box" style={{ height: '300px' }} >
                                                {/* Ribbon */}
                                                <div className="ribbon-two ribbon-two-primary"><span>Distribution 1</span></div>

                                                {/* User Image */}


                                                {/* User Information */}
                                                <div className="box-body">

                                                    <div className="text-center" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                        {/* User Name and Role */}
                                                        <h3 className="my-10"><a href="#">Distribution & Visibilité Internationale</a></h3>
                                                        <h6 className="user-info mt-0 mb-10 text-fade">Nous offrons une plateforme pour la distribution internationale des fonds, employant des technologies innovantes comme la blockchain pour assurer une distribution efficace et transparente, tout en offrant une visibilité sans précédent sur les marchés mondiaux.
                                                        </h6>

                                                        {/* User Address */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">

                                        <div className="col-12 col-lg-4">
                                            {/* User Image */}
                                            <div className="box-header no-border p-0  ">
                                                <a href="#">
                                                    <img className="img-fluid" src="../../../images/new/BALANCE.jfif" style={{ height: '300px' }} alt="" />
                                                </a>
                                            </div>
                                        </div>
                                        <div className="col-12 col-lg-8">
                                            <div className="box ribbon-box" style={{ height: '300px' }} >
                                                {/* Ribbon */}
                                                <div className="ribbon-two ribbon-two-primary"><span>Régulateur 1</span></div>



                                                {/* User Information */}
                                                <div className="box-body">

                                                    <div className="text-center" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                        {/* User Name and Role */}
                                                        <h3 className="my-10"><a href="#">Régulateur & Innovation</a></h3>
                                                        <br />
                                                        <h6 className="user-info mt-0 mb-10 text-fade">Notre engagement à collaborer avec les régulateurs est fondamental pour notre plateforme, assurant que chaque innovation respecte et redéfinit les normes de la finance moderne.
                                                        </h6>

                                                        {/* User Address */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>


                                {/* Repeat the above structure for other users */}

                            </section>

                            <section className="content">
                                <div className="section-center-heading">
                                    <h2>
                                        <span>NOUS CONTACTER</span>
                                    </h2>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4">
                                        <div className="contact-info">
                                            <FontAwesomeIcon icon="map-marker-alt" style={{ color: '#3b82f6' }} />                                            <h3 style={{ color: '#3b82f6' }}>Localisation</h3>
                                            <h6  >Abidjan, cocody, riviera palmeraie Immeuble Gold Africa Côte d ivoire <span> </span></h6>
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="contact-info">
                                            <FontAwesomeIcon icon="phone-alt" style={{ color: '#3b82f6' }} />                                            <h3 style={{ color: '#3b82f6' }}>Tel</h3>
                                            <p   >(+225) 25 21 00 61 21 </p>
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="contact-info">
                                            <FontAwesomeIcon icon="envelope" style={{ color: '#3b82f6' }} />
                                            <h3 style={{ color: '#3b82f6' }} > Mail</h3>
                                            <p> Contact@Wealthtechinnovations.Com </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                        </div>
                    </section >
                </div >
            </div >

        </Fragment >
    );
}
