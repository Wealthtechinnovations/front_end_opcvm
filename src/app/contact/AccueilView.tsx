"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import Header from '../Header';
import { urlconstant, urlsite } from "@/app/constants";
import Slider from "react-slick";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faMapMarkerAlt, faPhoneAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { useRouter } from 'next/navigation';

library.add(faMapMarkerAlt, faPhoneAlt, faEnvelope);
import '@fortawesome/fontawesome-svg-core/styles.css'; // Import the styles
import { config } from '@fortawesome/fontawesome-svg-core';
import Head from "next/head";
import Swal from "sweetalert2";
config.autoAddCss = false; // Disable the automatic styles insertion




async function getclassement(id: number) {
    try {
        const response = await fetch(`${urlconstant}/api/classementquartilemysql/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erreur ${response.status}: ${errorData.message || 'Erreur inconnue'}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des données de classement:', error);
        // Affichez un message d'erreur à l'utilisateur si nécessaire
    }
}

export default function Accueil(props: any) {
    const [userConnected, setUserConnected] = useState<number | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    // useEffect(() => {
    //     // Désactiver le clic droit
    //     const handleContextMenu = (e: { preventDefault: () => void; }) => {
    //       e.preventDefault();
    //     };
    //     // Désactiver les raccourcis clavier (F12, Ctrl+Shift+I, Ctrl+U, etc.)
    //     const handleKeyDown = (e: { ctrlKey: any; shiftKey: any; keyCode: number; preventDefault: () => void; }) => {
    //       if (
    //         (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
    //         (e.ctrlKey && e.shiftKey && e.keyCode === 67) || // Ctrl+Shift+C
    //         (e.ctrlKey && e.keyCode === 85) || // Ctrl+U
    //         (e.keyCode === 123) // F12
    //       ) {
    //         e.preventDefault();
    //       }
    //     };
    //     document.addEventListener('contextmenu', handleContextMenu);
    //     document.addEventListener('keydown', handleKeyDown);

    //     return () => {
    //       document.removeEventListener('contextmenu', handleContextMenu);
    //       document.removeEventListener('keydown', handleKeyDown);
    //     };
    //   }, []);

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

    const [isHoveredc, setIsHoveredc] = useState(false);

    const handleMouseEnterc = () => {
        setIsHoveredc(true);
    };

    const handleMouseLeavec = () => {
        setIsHoveredc(false);
    };

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

    const handleLinkcontact = () => {


        setTimeout(() => {
            const redirectUrl = `/contact`;

            router.push(redirectUrl);
        }, 1);


    };



    const handleMouseEntersa = () => {
        setIsHovereda(true);
    };

    const handleMouseLeavesa = () => {
        setIsHovereda(false);
    };
    const [isHoveredaa, setIsHoveredaa] = useState(false);

    const handleMouseEnteraa = () => {
        setIsHoveredaa(true);
    };

    const handleMouseLeaveaa = () => {
        setIsHoveredaa(false);
    };

    const [isHoveredcontact, setIsHoveredcontact] = useState(false);

    const handleMouseEntercontact = () => {
        setIsHoveredcontact(true);
    };

    const handleMouseLeavecontact = () => {
        setIsHoveredcontact(false);
    };


    const [formData, setFormData] = useState({
        name: '',
        email: '',
        description: '',
    });
    const [message, setMessage] = useState('');

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        // Send form data to backend
        const res = await fetch(`${urlconstant}/api/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const result = await res.json();
        if (result.success) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                html: `<p> Message envoyé.</p>`,
                showConfirmButton: false,
                timer: 5000,
              });
            setFormData({ name: '', email: '', description: '' });
        } else {
            setMessage('There was an error. Please try again.');
        }
    };


    return (
        <Fragment>
            <Header />
            <Head>

                <link rel="canonical" href="https://funds.chainsolutions.fr/Opcvm/accueil" />

            </Head>
            <br />

          
            <div className="">
                <div className="container-full">
                    <section className="content">
                        <div className="row">
                        <div className="flex justify-center items-center ">

                            <div className="bg-white col-6 p-10 rounded shadow-md w-full max-w-md ">
                                <h1 className="text-2xl font-bold mb-6 text-center">Nous contacter</h1>
                                {message && <p className="mb-4 text-green-600">{message}</p>}
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="mb-4 col-6">
                                            <label className="block text-sm font-bold mb-2" htmlFor="name">
                                                Name
                                            </label>
                                            <input
                                                className="w-full p-2 border border-gray-300 rounded"
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-4 col-6">
                                            <label className="block text-sm font-bold mb-2" htmlFor="email">
                                                Email
                                            </label>
                                            <input
                                                className="w-full p-2 border border-gray-300 rounded"
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-bold mb-2" htmlFor="description">
                                            Message
                                        </label>
                                        <textarea
                                            className="w-full p-2 border border-gray-300 rounded"
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows={4}
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-center w-full">
                                        <button
                                            type="submit"
                                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        >
                                            Envoyer
                                        </button>
                                    </div>


                                </form>
                            </div>
                            </div>


                            <br />
                            <br />



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
