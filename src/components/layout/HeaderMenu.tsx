
import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Link from 'next/link';
import { useRouter,usePathname } from 'next/navigation';
import { Button, Dropdown } from 'react-bootstrap';
import { urlsite } from '@/lib/constants';

const Headermenu = () => {
    const pathname = usePathname(); // Obtenir le chemin actuel

    useEffect(() => {
        // Configuration du graphique Highcharts ici
    }, []);

    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    const router = useRouter();

    const [userConnected, setUserConnected] = useState<number | null>(null);

    const handleLinkClick = () => {

        if (userConnected !== null) {
            setTimeout(() => {
                const redirectUrl = `/panel/portfolio/dashboard`;

                router.push(redirectUrl);
            }, 5);

        } else {
            setTimeout(() => {
                // const redirectUrl = `/panel/portfolio/dashboard`;

                router.push('/panel/management/login');
            }, 5);
        }
    };
    // const handleLinkClick = () => {

    //     if (userConnected !== null) {
    //         setTimeout(() => {
    //             const redirectUrl = `/panel/portfolio/dashboard`;

    //             router.push(redirectUrl);
    //         }, 5);

    //     } else {
    //         setTimeout(() => {
    //             // const redirectUrl = `/panel/portfolio/dashboard`;

    //             router.push('/panel/management/login');
    //         }, 5);
    //     }
    // };

    const handleLinksociete = () => {


        setTimeout(() => {
            const redirectUrl = `/fund-managers/search`;

            router.push(redirectUrl);
        }, 1);


    };
    const handleLinkquestionnaire = () => {


        setTimeout(() => {
            const redirectUrl = `/funds/questionnaire`;

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
            const redirectUrl = `/news`;

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
            const redirectUrl = `/home`;

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

    const handleLinkcontact = () => {


        setTimeout(() => {
            const redirectUrl = `/contact`;

            router.push(redirectUrl);
        }, 1);


    };
    const [isHoveredcontact, setIsHoveredcontact] = useState(false);

    const handleMouseEntercontact = () => {
        setIsHoveredcontact(true);
    };

    const handleMouseLeavecontact = () => {
        setIsHoveredcontact(false);
    };


    return (
        <>
         
        {/* <header className={`bg-gradient-to-b from-white to-blue-200 text-white p-6 shadow-lg flex justify-between items-center sticky  top-0 z-50 ml-6 `}> */}
        <header className={``}  style={{
    position: 'fixed',
    top: '0',
    width: '100%',
    zIndex: 1000, // Permet de garder le header au-dessus des autres éléments
  }}>
          <p><br /><br /></p>
          <div className='align-right'>
             <input id="main-menu-state" type="checkbox" checked={menuOpen} onChange={toggleMenu} />
                <label className="main-menu-btn" htmlFor="main-menu-state">
                    <span className="main-menu-btn-icon"></span> Toggle main menu visibility
                </label>
        </div>
            <nav role="navigation"  style={{marginLeft: '60px',marginTop:'-10px'}} className={` ${menuOpen ? 'hidden' : ''}`}>
                
                <ul id="" className={`sm sm-blue ${menuOpen ? 'open' : ''}`}>
                    <li style={{ height: '40px' }}>
                        <Button
                            onClick={handleLinkaccueil}
                            style={{
                                width: '150px',
                                backgroundColor:  pathname.includes('/home')  ? '#3b82f6' : 'white', // Dynamiser la couleur active
                                color: pathname.includes('/home') ? 'white' : 'black',
                                display: 'block',
                                height: '100%',
                                padding: '10px',
                                textDecoration: 'none',
                                border: '1px solid #000',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s'
                            }}
                            onMouseEnter={handleMouseEntersa}
                            onMouseLeave={handleMouseLeavesa}
                        >
                            Accueil
                        </Button>
                    </li>
                    <li style={{ height: '40px' }}>
                        <Button
                            onClick={() => router.push(`${urlsite}/funds/search`)}
                            style={{
                                width: '150px',
                                backgroundColor:  pathname.includes('/funds/search')  ? '#3b82f6' : 'white', // Dynamiser la couleur active
                                color: pathname.includes('/funds/search') ? 'white' : 'black',
                                display: 'block',
                                height: '100%',
                                padding: '10px',
                                textDecoration: 'none',
                                border: '1px solid #000',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s'
                            }}
                            onMouseEnter={handleMouseEnterc}
                            onMouseLeave={handleMouseLeavec}
                        >
                            Fonds
                        </Button>
                    </li>
                    <li style={{ height: '40px' }}>
                        <Button
                            onClick={handleLinksociete}
                            style={{
                                width: '150px',
                                backgroundColor:  pathname.includes('/fund-managers')  ? '#3b82f6' : 'white', // Dynamiser la couleur active
                                color: pathname.includes('/fund-managers') ? 'white' : 'black',
                                display: 'block',
                                height: '100%',
                                padding: '10px',
                                textDecoration: 'none',
                                border: '1px solid #000',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s'
                            }}
                            onMouseEnter={handleMouseEnters}
                            onMouseLeave={handleMouseLeaves}
                        >
                            Societe de gestion
                        </Button>
                    </li>
                    <li style={{ height: '40px', }}>
                        <Button
                            onClick={handleLinkpays}
                            style={{
                                width: '150px',
                                backgroundColor:  pathname.includes('/pays')  ? '#3b82f6' : 'white', // Dynamiser la couleur active
                                color: pathname.includes('/pays') ? 'white' : 'black',
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
                        </Button>
                    </li>
                    <li style={{ height: '40px' }}>
                        <Dropdown>
                            <Dropdown.Toggle id="dropdown-basic" style={{ width: '150px' ,backgroundColor:  pathname.includes('/Service')  ? '#3b82f6' : 'white', // Dynamiser la couleur active
                                color: pathname.includes('/Service') ? 'white' : 'black', display: 'block', height: '100%', padding: '10px', textDecoration: 'none' }}>
                                Services
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item href="/questionnaire/questionnaire/pre/question1">Questionnaire cours</Dropdown.Item>
                                <Dropdown.Item href="/questionnaire/questionnaire/question1">Profil investisseur (MIFID)</Dropdown.Item>
                                <Dropdown.Item href="#">KYC</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </li>
                    <li style={{ height: '40px' }}>
                        <Dropdown>
                            <Dropdown.Toggle id="dropdown-basic" style={{ width: '150px',  backgroundColor:  pathname.includes('/tools')  ? '#3b82f6' : 'white', // Dynamiser la couleur active
                                color: pathname.includes('/tools') ? 'white' : 'black', display: 'block', height: '100%', padding: '10px', textDecoration: 'none' }}>
                                Outils
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item href="/tools/comparison">Comparaison</Dropdown.Item>
                                <Dropdown.Item href="/tools/search">Selection OPCVM</Dropdown.Item>
                                <Dropdown.Item href="/tools/robot">Robot Advisor</Dropdown.Item>
                                <Dropdown.Item href="/tools/profile">Profil investisseurs</Dropdown.Item>
                                <Dropdown.Item href="/tools/education">Éducation financière</Dropdown.Item>

                            </Dropdown.Menu>
                        </Dropdown>
                    </li>



                    <li style={{ height: '40px' }}>
                        <Button
                            onClick={handleLinkactualite}
                            style={{
                                width: '150px',
                                backgroundColor:  pathname.includes('/news')  ? '#3b82f6' : 'white', // Dynamiser la couleur active
                                color: pathname.includes('/news') ? 'white' : 'black',
                                display: 'block',
                                height: '100%',
                                padding: '10px',
                                textDecoration: 'none',
                                border: '1px solid #000',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s'
                            }}
                            onMouseEnter={handleMouseEnteraa}
                            onMouseLeave={handleMouseLeaveaa}
                        >
                            &nbsp;&nbsp;&nbsp;   Actualités &nbsp;&nbsp;&nbsp;
                        </Button>
                    </li>
                    <li style={{ height: '40px' }}>
                        <Dropdown>
                            <Dropdown.Toggle id="dropdown-basic" style={{ width: '150px', backgroundColor:  pathname.includes('/panel/management')  ? '#3b82f6' : 'white', // Dynamiser la couleur active
                                color: pathname.includes('/panel/management') ? 'white' : 'black', display: 'block', height: '100%', padding: '10px', textDecoration: 'none' }}>
                                Connexion
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                 <Dropdown.Item onClick={handleLinkClick} href="#">Espace Membre</Dropdown.Item> 
                                <Dropdown.Item href="/panel/management/login">Espace client</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </li>

                    <li style={{ height: '40px' }}>
                        <Button
                            onClick={handleLinkcontact}
                            style={{
                                width: '150px',
                                backgroundColor:  pathname.includes('/contact')  ? '#3b82f6' : 'white', // Dynamiser la couleur active
                                color: pathname.includes('/contact') ? 'white' : 'black',
                                display: 'block',
                                height: '100%',
                                padding: '10px',
                                textDecoration: 'none',
                                border: '1px solid #000',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s'
                            }}
                            onMouseEnter={handleMouseEntercontact}
                            onMouseLeave={handleMouseLeavecontact}
                        >
                            Contact
                        </Button>
                    </li>

                </ul>
            </nav>
            <br />
          
           
        </header>
        
      
        </>


    );
};

export default Headermenu;