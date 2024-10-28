"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import Select from 'react-select';
//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import Head from 'next/head';
import { urlconstant, urlstableconstant, API_KEY_STABLECOIN, urlsite } from "@/app/constants";

import { useRouter } from 'next/navigation';
import { magic } from '../../../../../../magic'; // Importer correctement le module
import { Dropdown } from "react-bootstrap";

async function login(email: string, password: any) {
  console.log(password);
  const data = (
    await fetch(`${urlconstant}/api/userlogin?email=${email}&password=${password}`)
  ).json();
  return data;
}
async function emailexist(email: string) {
  const response = await fetch(`${urlstableconstant}/api/user/find-user-by-email?email=${email}`, {
    method: 'GET',
    headers: {
      'x-api-key': API_KEY_STABLECOIN, // Ajouter votre en-tête personnalisé
      'Content-Type': 'application/json', // Vous pouvez également ajouter d'autres en-têtes si nécessaire
    },
  });

  const data = await response.json();
  return data;
}
interface Res {
  message: string;

}

interface Pays {
  value: string; // ou un type spécifique pour les éléments du tableau 'funds'

}

interface Societe {
  value: string; // ou un type spécifique pour les éléments du tableau 'funds'

}

async function getpays() {
  const data = (
    await fetch(`${urlconstant}/api/getPays`)
  ).json();
  return data;
}

async function getsociete(pays: string) {
  const data = (
    await fetch(`${urlconstant}/api/getSocietesbypays/${pays}`)
  ).json();
  return data;
}
export default function Logins() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  // Fonction de connexion à magic

  const router = useRouter();
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);



  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const [userConnected, setUserConnected] = useState(null);
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
  const handleLinkaccueil = () => {


    setTimeout(() => {
      const redirectUrl = `/accueil`;

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


  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

      const res = await fetch(`${urlconstant}/api/forgot-password`, {
        method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setMessage('Un email de réinitialisation a été envoyé.');
    } else {
      setMessage('Erreur, veuillez réessayer.');
    }
  };

  return (



    < Fragment >
      <nav className="main-nav bg-white" role="navigation">


        <input id="main-menu-state" type="checkbox" checked={menuOpen} onChange={toggleMenu} />
        <label className="main-menu-btn" htmlFor="main-menu-state">
          <span className="main-menu-btn-icon"></span> Toggle main menu visibility
        </label>

        <ul id="main-menu" className={`sm sm-blue ${menuOpen ? 'open' : ''}`}>
          <li style={{ height: '40px' }}>
            <button
              onClick={handleLinkaccueil}
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
              onMouseEnter={handleMouseEntersa}
              onMouseLeave={handleMouseLeavesa}
            >
              Accueil
            </button>
          </li>
          <li style={{ height: '40px' }}>
            <button
              onClick={() => router.push(`${urlsite}/Opcvm/recherche`)}
              style={{
                width: '150px',
                backgroundColor: isHoveredc ? 'blue' : 'white',
                color: isHoveredc ? 'white' : 'black',
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
            </button>
          </li>
          <li style={{ height: '40px' }}>
            <button
              onClick={handleLinksociete}
              style={{
                width: '150px',
                backgroundColor: isHovered ? 'blue' : 'white',
                color: isHovered ? 'white' : 'black',
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
          <li style={{ height: '40px' }}>
            <Dropdown>
              <Dropdown.Toggle id="dropdown-basic" style={{ width: '150px', backgroundColor: 'white', color: 'black', display: 'block', height: '100%', padding: '10px', textDecoration: 'none' }}>
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
              <Dropdown.Toggle id="dropdown-basic" style={{ width: '150px', backgroundColor: 'white', color: 'black', display: 'block', height: '100%', padding: '10px', textDecoration: 'none' }}>
                Outils
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="/Outils/comparaison">Comparaison</Dropdown.Item>
                <Dropdown.Item href="/Outils/recherche">Selection OPCVM</Dropdown.Item>
                <Dropdown.Item href="/Outils/robot">Robot Advisor</Dropdown.Item>
                <Dropdown.Item href="/Outils/profil">Profil investisseurs</Dropdown.Item>
                <Dropdown.Item href="/Outils/education">Éducation financière</Dropdown.Item>

              </Dropdown.Menu>
            </Dropdown>
          </li>



          <li style={{ height: '40px' }}>
            <button
              onClick={handleLinkactualite}
              style={{
                width: '150px',
                backgroundColor: isHoveredaa ? 'blue' : 'white',
                color: isHoveredaa ? 'white' : 'black',
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
            </button>
          </li>
          <li style={{ height: '40px' }}>
            <Dropdown>
              <Dropdown.Toggle id="dropdown-basic" style={{
                width: '150px', backgroundColor: '#3b82f6',
                color: 'white', display: 'block', height: '100%', padding: '10px', textDecoration: 'none'
              }}>
                Connexion
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={handleLinkClick} href="#">Espace Membre</Dropdown.Item>
                <Dropdown.Item href="/societegestionpanel/login">Espace client</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>

        </ul>
      </nav>
      <br />
      <br /><br /><br /><br /><br />
      <div className="col-12 mt-3">

        <div className="container h-p100">
          <div className="row align-items-center justify-content-md-center h-p100">
            <div className="col-12">
              <div className="row justify-content-center g-0">
                <div className="col-lg-5 col-md-5 col-12">
                  <div className="bg-white rounded10 shadow-lg">
                    <div className="content-top-agile p-20 pb-0">
                      <h2 className="text-primary fw-600">Mot de passe oublié </h2>
                      <br /><br />
                    </div>
                    <div className="container">
                      <form onSubmit={handleSubmit}>
                        <div className="form-group">
                          <label htmlFor="email">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Entrez votre email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                          <br />
                          <br />
 <div className="text-center">
                            <button className="text-right" style={{
                              textDecoration: 'none', // Remove underline
                              backgroundColor: '#6366f1', // Background color
                              color: 'white', // Text color
                              padding: '10px 20px', // Padding
                              borderRadius: '5px', // Rounded corners
                            }} type="submit">Envoyer</button></div>                        </div>
                            <br />
                        {message && <p>{message}</p>}
                        <br />
                      </form>
                    </div>
                  </div>
                </div>
                       
                 
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment >
  );
}
Logins.layout = false; // Désactive le layout par défaut pour cette page
