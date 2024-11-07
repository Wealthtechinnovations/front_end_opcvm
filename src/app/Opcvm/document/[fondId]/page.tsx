"use client";
import Link from "next/link";
import React, { Fragment, useEffect, useState, SetStateAction, ReactNode, Key } from "react";
import { useRouter } from 'next/navigation';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import Header from '../../../Header'
import { urlconstant, urlsite, urlconstantimage } from "@/app/constants";
import ExportModal from './exportmodal';
import { Modal, Button } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Head from 'next/head';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFileDownload, faPhoneAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

/**
 * Fonction asynchrone pour obtenir les détails d'un fond.
 * @async
 * @function getclassement
 * @param {number} id - L'identifiant du fond.
 * @returns {Promise} - Les données du classement du fond.
 */
async function getfavoris(id: number) {
  const data = (
    await fetch(`${urlconstant}/api/favoritesdata/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', // Indiquer que vous envoyez du JSON
      },
    })
  ).json();
  return data;
}

const buttonStyle = {
  backgroundColor: "#3b82f6",
  color: "white",
  padding: "10px 20px", // Adjust padding to control the button size
  borderRadius: "5px", // Add rounded corners for a consistent look
  cursor: "pointer", // Add a pointer cursor on hover for better user experience
};
/**
 * Fonction asynchrone pour obtenir les dernières valeurs de fonds.
 * @async
 * @function getlastvl1
 * @returns {Promise} - Les dernières valeurs de fonds.
 */
async function getlastvl1() {
  const data = (
    await fetch(`${urlconstant}/api/searchFunds`)
  ).json();
  return data;
}
/**
 * Fonction asynchrone pour obtenir les détails d'une publication.
 * @async
 * @function getPost
 * @param {number} id - L'identifiant de la publication.
 * @returns {Promise} - Les détails de la publication.
 */
async function getPost(id: number) {
  const data = (
    await fetch(`${urlconstant}/api/valLiq/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', // Indiquer que vous envoyez du JSON
      },
    })
  ).json();
  return data;
}



const documentsall = [
  { name: 'Reporting mensuel', type: 'rapport', icon: 'fa-image' },
  { name: 'DIC', type: 'autre', icon: 'fa-video-camera' },
  { name: 'Prospectus', type: 'autre', icon: 'fa-file' },
  { name: 'Rapport annuel', type: 'rapport', icon: 'fa-user' },
  { name: 'Lettre aux porteurs', type: 'autre', icon: 'fa-trash' },
  { name: 'Reporting ISR', type: 'autre', icon: 'fa-trash' },
  { name: 'Portefeuille', type: 'autre', icon: 'fa-trash' },
  { name: 'Rapport Semestriel', type: 'rapport', icon: 'fa-trash' },
  { name: 'Reglement du fonds', type: 'autre', icon: 'fa-trash' },
  { name: 'Fiche commerciale', type: 'autre', icon: 'fa-trash' },
  { name: 'Due diligence', type: 'autre', icon: 'fa-trash' }
];
interface Option {

  name: any;

}
interface Option1 {

  value: any;

}

interface PageProps {
  params: {
    fondId: number;
  };
}
interface MyDataType {
  name: any;
  y: any;
  InRef: any; // Remplacez "number" par le type approprié
  // Autres propriétés
}

interface Document {
  nom: ReactNode;
  id: Key | null | undefined;
  type_fichier: any;
  date: any;
  annee: any;
  fichier: any;
  fond: any;
  mois: any;


}
interface Funds {
  data: {
    ratios3a: {
      data: {
        volatility: any;
        ratioSharpe: any;
        maxDrawdown: any;
        betaBaiss: any;
        VAR95: any;
        info: any;
        perfAnnualisee: any;
        calmar: any;
        sortino: any;
        omega: any
      };

    };
    performances: {
      data: {
        perfVeille: any;
        perf4Semaines: any;
        perf1erJanvier: any;
        perf1An: any;
        perf3Ans: any;
        perf5Ans: any;
        perf8Ans: any;
        perf10Ans: any;
        adaptValues1: any;
        perfAnnualisee: any;
        performancesCategorie: any
      }
    };
    funds: any[]; // ou un type spécifique pour les éléments du tableau 'funds'
    fundname: any;
    libelle_indice: any;
    ID_indice: any;
    lastDate: any;
    lastValue: any;
    lastdatepreviousmonth: any;
    performancesCategorie: any
    libelle_fond: any;
    regulateur: any;
    code_ISIN: any;
    sitewebregulateur: any;
    nomdelabourse: any;
    URLdelabourse: any;
    symboledevise: any;
    categorie_libelle: any;
    categorie_national: any;
    nom_gerant: any;
    categorie_globale: any;
    societe_gestion: any;
    periodicite: any;
    affectation: any;
    structure_fond: any;
    frais_souscription: any;
    frais_rachat: any;
    frais_gestion: any;
    frais_entree: any;
    frais_sortie: any;
    minimum_investissement: any;
    categorie_regional: any;
    classification: any;
    type_investissement: any;
    pays: any;

  };
}
type Documents = Document[];
/**
 * Composant principal représentant la page d'un fond.
 * @function Fond
 * @param {PageProps} props - Propriétés de la page.
 */
export default function Fond(props: PageProps) {
  const router = useRouter();

  const id = props.params.fondId;
  const [activeIndex, setActiveIndex] = useState(0); // Initialisation avec 0
  const [filteredDocument, setFilteredDocument] = useState<Document[] | null>(null);
  const [documents, setDocuments] = useState<Documents | null>(null);

  const handleClick = (index: number, doc: string) => {
    setActiveIndex(index);
    if (documents) {
      setFilteredDocument(documents.filter(document => document.type_fichier === doc));
    }
  };
  const [searchQuery, setSearchQuery] = useState('');


  const [post, setPost] = useState<Funds | null>(null);
  const [selectedFund, setSelectedFund] = useState<Option1>();
  const [fundsOptions, setFundsOptions] = useState([]);
  const [rating, setRating] = useState(2);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userConnected, setUserConnected] = useState<number | null>(null);

  const handleSearch = (e: any) => {
    e.preventDefault();
    // Effectuez votre recherche ici si nécessaire
  };

  useEffect(() => {
    async function fetchData() {
      try {
        Swal.fire({
          title: 'Veuillez patienter',
          html: 'Chargement des résultats en cours...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        const data = await getPost(id);
        setPost(data);
        const data1 = await getlastvl1();

        const mappedOptions = data1?.data?.funds.map((funds: any) => ({
          value: funds.value,
          label: funds.label
        }));

        setFundsOptions(mappedOptions); // Mettre à jour l'état avec les données récupérées
        Swal.close(); // Close the loading popup

      } catch (error) {
        Swal.close(); // Close the loading popup

        console.error("Erreur lors de la récupération des données :", error);
      }
    }
    fetchData(); // Appel à fetchData() lors du premier rendu
  }, []);

  const handleFundSelect = (selectedOption: any) => {
    setSelectedFund(selectedOption);
  };
  useEffect(() => {

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
    /*if (!isLoggedIn) {
      router.push('/accueil');
    }*/
  }, []);
  const [selectedDocument, setSelectedDocument] = useState(null);


  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch(`${urlconstant}/api/documentsfond/${id}`);
        if (response.ok) {
          const data = await response.json();
          setDocuments(data);
          setFilteredDocument(data);
          const data10 = await getlastvl1();

          const mappedOptions = data10?.data?.funds.map((funds: any) => ({
            value: funds.value,
            label: funds.label
          }));

          setFundsOptions(mappedOptions); // Mettre à jour l'état avec les données récupérées

        } else {
          console.error('Erreur lors de la récupération des documents:', response.statusText);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des documents:', error);
      }
    };
    if (id) {
      fetchDocuments();
    }
  }, [id]);

  const handleSearchChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setSearchQuery(e.target.value);
  };
  const handleDownload = (e: { target: { value: SetStateAction<string>; }; }) => {
    setSearchQuery(e.target.value);
  };
  const filteredDocuments = filteredDocument && filteredDocument.filter(document => {
    const searchTerms = searchQuery.toLowerCase().split(' ');
    return searchTerms.every(term =>
      Object.values(document).some(value =>
        typeof value === 'string' && value.toLowerCase().includes(term)
      )
    );
  });


  const handleClosePopup1 = () => setShowPopup1(false);
  const handleClosePopup = () => setShowPopup(false);

  const [showPopup, setShowPopup] = useState(false);

  const [showPopup1, setShowPopup1] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const handleToggleFavorite = async () => {
    try {
      console.log("eee")
      if (isFavorite) {
        // Si déjà en favori, supprime-le
        await fetch(`${urlconstant}/api/favorites/remove/${id}/${userConnected}`, { method: 'GET' });
        //  alert('Fond supprimé des favoris !');
        setShowPopup1(true);

      } else {
        // Sinon, ajoute-le
        await fetch(`${urlconstant}/api/favorites/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fund_id: id,
            user_id: userConnected,
          }),
        });
        setShowPopup(true);


        //  alert('Fond ajouté aux favoris !');
      }

      // Inversez l'état local pour refléter le changement
      setIsFavorite((prev) => !prev);
    } catch (error) {
      console.error('Erreur lors de la gestion des favoris :', error);
    }
  };
  const handleRatingClick = (selectedRating: any) => {
    setRating(selectedRating);
  };
  var options: any;










  const handleLinkClick = () => {

    if (userConnected !== null) {
      setTimeout(() => {
        const redirectUrl = `/panel/portefeuille/home?id=${userConnected}`;

        router.push(redirectUrl);
      }, 5);

    } else {
      setTimeout(() => {
        // const redirectUrl = `/panel/portefeuille/home?id=${userConnected}`;

        router.push('/panel/portefeuille/login');
      }, 5);
    }
  };
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLinksociete = () => {


    setTimeout(() => {
      const redirectUrl = `/Fundmanager/recherche`;

      router.push(redirectUrl);
    }, 1);


  };
  const [isHovered, setIsHovered] = useState(false);


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
  const [isHovereda, setIsHovereda] = useState(false);


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
  return (

    <Fragment>
      <Header />
      <Head>
        <title>{post?.data?.libelle_fond} - Informations sur le fond</title>
        <meta name="description" content={post?.data?.libelle_fond} />
        <meta property="og:title" content={`${post?.data?.libelle_fond} - Informations sur le fond`} />
        <meta property="og:description" content={post?.data?.libelle_fond} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`${urlsite}/Opcvm/${id}`} />
        {/* Ajoutez ici d'autres métadonnées spécifiques au SEO */}
      </Head>
     
      <div className="">
        <Modal show={showPopup} onHide={handleClosePopup} centered>
          <Modal.Header closeButton>
            <Modal.Title>Action</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Fonds ajouté aux favoris !
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" style={{
              textDecoration: 'none',
              backgroundColor: '#6366f1',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '5px',
            }} onClick={handleClosePopup}>
              Fermer
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showPopup1} onHide={handleClosePopup1} centered>
          <Modal.Header closeButton>
            <Modal.Title>Action</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Fonds supprimé des favoris !
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" style={{
              textDecoration: 'none',
              backgroundColor: '#6366f1',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '5px',
            }} onClick={handleClosePopup1}>
              Fermer
            </Button>
          </Modal.Footer>
        </Modal>
        <div className="container-full">
          {/* Main content */}
          <section className="content">
            <div className="row">

              <div className="col-md-12 col-12">
                <div className="box ">
                  <div className="box-body">
                    <div className="d-md-flex justify-content-between align-items-center">
                      <div className="col-2">
                        <p><span className="text-primary">Fonds</span> | <span className="text-fade"></span></p>

                      </div>
                      <div className="">
                        <p className="text-center"><strong>Rechercher un fond</strong></p>
                        <form onSubmit={handleSearch}>
                          <div className=" col-6 input-group">
                            <Select className="select-component fixed-select"
                              id="select"
                              options={fundsOptions}
                              value={selectedFund}
                              onChange={handleFundSelect}
                              placeholder="Select a fund"
                            />
                            <div className="input-group-append">

                              <Link
                                href={{
                                  pathname: '/fundview',
                                  query: { fund: selectedFund ? selectedFund?.value : '' },
                                }}
                                as={`/Opcvm/${selectedFund ? selectedFund.value : ''}`}
                                key={selectedFund?.value}
                                style={{
                                  textDecoration: 'none', // Remove underline
                                  backgroundColor: '#6366f1', // Background color
                                  color: 'white', // Text color
                                  padding: '10px 20px', // Padding
                                borderRadius: '5px', // Rounded corners
borderColor:'grey'
                                }}
                              >
                                OK
                              </Link>

                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                    <hr />
                    <div className="d-md-flex justify-content-between align-items-center">


                      <div className="panel-heading p-b-0">
                        <div className="row row-no-gutters">
                          <div className="col-lg-12  text-center-xs p-t-1">
                            <h3>
                              <span className="produit-type">{post?.data?.classification != null ? post?.data?.classification : 'OPCVM'}</span> - <strong>{post?.data?.libelle_fond}</strong> -{' '}
                              <small>{post?.data?.code_ISIN} </small>{' '} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              {[1, 2, 3, 4, 5].map((index) => (
                                <FontAwesomeIcon
                                  className="text-right"
                                  key={index}
                                  icon={faStar}
                                  onClick={() => handleRatingClick(index)}
                                  style={{ color: index <= rating ? 'gold' : 'gray', cursor: 'pointer' }}
                                />
                              ))}
                            </h3>

                          </div>
                          <div className=" text-center">
                            <div className="row row-no-gutters flex" style={{ justifyContent: 'flex-end' }}>

                              {userConnected ?
                                <button onClick={handleToggleFavorite}>
                                  {isFavorite ? '💜 Retirer des favoris' : '🤍 Ajouter aux favoris'}
                                </button>
                                : <p></p>}
                            </div> </div>


                        </div>
                      </div>

                    </div>
                    <div className="row">

                      <ul className="tabs-menu" style={{ display: 'flex', flexWrap: 'wrap', padding: '0', margin: '0', listStyleType: 'none' }}>
                        <li style={{ margin: '0', padding: '0' }}>
                          <Button
                            href={`/Opcvm/${id}`}
                            style={{
                              width: '135px',
                              textDecoration: 'none', // Remove underline
                              backgroundColor: 'grey', // Background color
                              color: 'white', // Text color
                              padding: '10px 20px', // Padding
                            borderRadius: '5px', // Rounded corners
borderColor:'grey'
                            }}
                          >
                            Resumé
                          </Button>
                        </li>
                        <li style={{ margin: '0', padding: '0' }}>
                          <Button
                            href={`/Opcvm/resumeEUR/${id}`} style={{
                              width: '135px',
                              textDecoration: 'none', // Remove underline
                              backgroundColor: 'grey', // Background color
                              color: 'white', // Text color
                              padding: '10px 20px', // Padding
                            borderRadius: '5px', // Rounded corners
borderColor:'grey'
                            }}

                          >
                            Resumé EUR
                          </Button>
                        </li>
                        <li style={{ margin: '0', padding: '0' }}>
                          <Button
                            href={`/Opcvm/resumeUSD/${id}`}
                            style={{
                              width: '135px',
                              textDecoration: 'none', // Remove underline
                              backgroundColor: 'grey', // Background color
                              color: 'white', // Text color
                              padding: '10px 20px', // Padding
                            borderRadius: '5px', // Rounded corners
borderColor:'grey'
                            }}

                          >
                            Resumé USD
                          </Button>
                        </li>

                        <li style={{ margin: '0', padding: '0' }}>
                          <Button className="" href={`/Opcvm/historique/${id}`
                          } style={{
                            width: '135px',
                            textDecoration: 'none', // Remove underline
                            backgroundColor: 'grey', // Background color
                            color: 'white', // Text color
                            padding: '10px 20px', // Padding
                          borderRadius: '5px', // Rounded corners
borderColor:'grey'
                          }}>
                            Historique
                          </Button>
                        </li>
                        <li style={{ margin: '0', padding: '0' }}>

                          <Button
                            href={`/Opcvm/performance/${id}`}
                            style={{
                              width: '140px',
                              textDecoration: 'none', // Remove underline
                              backgroundColor: 'grey', // Background color
                              color: 'white', // Text color
                              padding: '10px 20px', // Padding
                            borderRadius: '5px', // Rounded corners
borderColor:'grey'
                            }}
                          >
                            Performances
                          </Button>


                        </li>
                        <li style={{ margin: '0', padding: '0' }}>
                          <Button className="" href="" style={{
                            width: '135px',
                            textDecoration: 'none', // Remove underline
                            backgroundColor: 'grey', // Background color
                            color: 'white', // Text color
                            padding: '10px 20px', // Padding
                          borderRadius: '5px', // Rounded corners
borderColor:'grey'
                          }}>
                            Portefeuille
                          </Button>
                        </li>
                        <li style={{ margin: '0', padding: '0' }}>
                          <Button className="" href="" style={{
                            width: '135px',
                            textDecoration: 'none', // Remove underline
                            backgroundColor: 'grey', // Background color
                            color: 'white', // Text color
                            padding: '10px 20px', // Padding
                          borderRadius: '5px', // Rounded corners
borderColor:'grey'
                          }}>
                            Investir
                          </Button>
                        </li>

                        <li style={{ margin: '0', padding: '0' }}>
                          <Button href={`/Opcvm/telechargervl/${id}`} style={{
                            width: '135px',
                            textDecoration: 'none', // Remove underline
                            backgroundColor: 'grey', // Background color
                            color: 'white', // Text color
                            padding: '10px 20px', // Padding
                          borderRadius: '5px', // Rounded corners
borderColor:'grey'
                          }}>
                            Telecharger VL
                          </Button>
                        </li>
                        <li style={{ margin: '0', padding: '0' }}>
                          <Button href={`/Opcvm/document/${id}`} className=""
                            style={{
                              width: '135px',
                              textDecoration: 'none', // Remove underline
                              backgroundColor: '#6366f1', // Background color
                              color: 'white', // Text color
                              padding: '10px 20px', // Padding
                            borderRadius: '5px', // Rounded corners
borderColor:'grey'
                            }}

                          >
                            Documents
                          </Button>
                        </li>

                      </ul>


                    </div>
                  </div>
                </div>

                <div className="box">
                  <div className="box-body pb-lg-0">
                    <div className="row">
                      <p><span className="text-primary">Documents du fond</span> | <span className="text-fade"></span></p>
                      <div className="col-12">
                        <div className="box">
                          <div className="box-header with-border">
                            <div className="d-inline-block">
                              <div className="lookup lookup-sm lookup-right">
                                <input
                                  type="text"
                                  name="s"
                                  placeholder="Search"
                                  value={searchQuery}
                                  onChange={handleSearchChange}
                                />
                              </div>
                            </div>

                          </div>
                        </div>

                        <div className="row">
                          <div className="col-xl-3 col-lg-4 col-12">
                            <div className="box">
                              <div className="box-body">
                                <ul className="nav nav-pills file-nav d-block">
                                  {documentsall.map((doc, index) => (

                                    <li className="nav-item" key={index}>
                                      <a
                                        className={`nav-link rounded ${activeIndex === index ? 'active' : ''}`}
                                        href="javascript:void(0)"
                                        onClick={() => handleClick(index, doc.name)}
                                      >
                                        <i className={`fs-18 me-10 fa ${doc.icon}`}></i>
                                        <span className="fs-18 mt-2">{doc.name}</span>
                                      </a>
                                    </li>
                                  ))}


                                </ul>

                              </div>
                            </div>
                          </div>

                          <div className="col-xl-9 col-lg-8 col-12">
                            <div className="card-columns">
                              {filteredDocuments && filteredDocuments.map((document: Document) => (

                                <div className="card" key={document.id}>
                                  <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center">
                                      <div>
                                        <label className="mb-0"></label>
                                      </div>

                                    </div>
                                    <div className="text-center">
                                      <FontAwesomeIcon icon={faFileDownload} width={50} />
                                      <p className=" mb-0">{document.nom}</p>
                                      <p className="text-fade mb-0">{document.date}</p>
                                      <p className="text-fade mb-0">Mois: {document.mois}</p>
                                      <p className="text-fade mb-0">Année:{document.annee}</p>

                                    </div>
                                    <div className="text-right">
                                      <Link
                                        className="btn btn-main"
                                        style={{ ...buttonStyle, width: "100%" }} // Appliquer le style du bouton avec une largeur de 100%
                                        href={`${urlconstant}/doc/${post?.data?.pays}/${post?.data?.societe_gestion}/${document.fond}/${document.fichier}/${document.id}`}
                                        download={`${document.fichier}`} // Spécifiez le nom du fichier ici
          
                                        target="_blank"
                                      >
                                        <FontAwesomeIcon icon={faFileDownload} />
                                        Télécharger le document
                                      </Link>

                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                          </div>

                        </div>



                        {/*
              <div className="box ">
                <div className="box-body">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Nom du fichier</th>
                        <th>Type de fichier</th>
                        <th>date</th>
                        <th>annee</th>
                        <th>mois</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDocuments && filteredDocuments.map((document: Document) => (
                        <tr key={document.id}>
                          <td>{document.nom}</td>
                          <td>{document.type_fichier}</td>
                          <td>{document.date}</td>
                          <td>{document.annee}</td>
                          <td>{document.mois}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                </div>
              </div>
                      */}

                      </div>


                    </div>

                  </div>
                </div>


              </div>

            </div>
          </section>
        </div>


      </div >
    </Fragment >

  );
}

async function searchFunds(searchTerm: any) {
  // const response = await fetch(`/api/searchFunds?query=${searchTerm}`);
  const response = await fetch(`/api/searchFunds`);
  const data = await response.json();
  return data;
}
