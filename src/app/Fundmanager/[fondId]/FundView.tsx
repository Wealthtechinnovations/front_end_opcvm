"use client";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Highcharts, { color } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faSquare } from '@fortawesome/free-solid-svg-icons';
import Header from '../../Header'
import { urlconstant, urlsite } from "@/app/constants";
import { Modal, Button } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Head from 'next/head';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import Swal from "sweetalert2";
/**
 * Fonction asynchrone pour obtenir les détails d'un fond.
 * @async
 * @function getclassement
 * @param {number} id - L'identifiant du fond.
 * @returns {Promise} - Les données du classement du fond.
 */
async function getsociete(id: string) {
  const data = (
    await fetch(`${urlconstant}/api/getSocietebyidfisrt/${id}`)
  ).json();
  return data;
}

async function getallsociete() {
  const data = (
    await fetch(`${urlconstant}/api/getsocieterecherche`)
  ).json();
  return data;
}
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
/**
 * Fonction asynchrone pour obtenir les dernières valeurs de fonds.
 * @async
 * @function getlastvl1
 * @returns {Promise} - Les dernières valeurs de fonds.
 */
/**
 * Fonction asynchrone pour obtenir les détails d'une publication.
 * @async
 * @function getPost
 * @param {number} id - L'identifiant de la publication.
 * @returns {Promise} - Les détails de la publication.
 */

/**
 * Interface représentant les données d'un fond.
 * @interface Funds
 * @property {Object} data - Les données principales du fond.
 * @property {Object} performances - Les performances du fond.
 * @property {Array} funds - Liste des fonds.
 * @property {string} fundname - Nom du fond.
 * @property {string} libelle_indice - Libellé de l'indice associé au fond.
 * @property {string} ID_indice - Identifiant de l'indice associé au fond.
 * @property {string} lastDate - Date de la dernière mise à jour.
 * @property {string} lastValue - Dernière valeur du fond.
 * @property {...} [Autres propriétés] - Autres propriétés du fond.
 */


interface FormData {
  nom: string;
  description: string;
  numeroagrement: string;
  email: string;
  password: string;
  site_web: string;
  dateimmatriculation: string;
  regulateur: string;
  tel: string;
  pays: string;
  societ: string;
  devise: string;
  sumActifNet: number;
  nbreFond: number;
  latestDate: string
}

interface DataItem {
  annee: number; // Assuming 'annee' is a number
  totalActifNet: any;
}
interface Option {

  name: any;

}
interface Option1 {

  value: any;

}

interface PageProps {
  params: {
    fondId: string;
  };
}
interface MyDataType {
  name: any;
  y: any;
  InRef: any; // Remplacez "number" par le type approprié
  // Autres propriétés
}

/**
 * Composant principal représentant la page d'un fond.
 * @function Fond
 * @param {PageProps} props - Propriétés de la page.
 */
export default function Fond(props: PageProps) {
  const router = useRouter();

  const id = props.params.fondId.replace(/-/g, ' ');
  const randomPercentage: string = ((Math.random() * 200) - 100).toFixed(2);
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const randomPercentage1 = ((Math.random() * 200) - 100).toFixed(2);
  const randomPercentage2 = ((Math.random() * 200) - 100).toFixed(2);
  const [showDescription, setShowDescription] = useState(false);
  const handleMouseEnter = () => {
    console.log("open")
    setShowDescription(true);
  };
  useEffect(() => {
    Highcharts.setOptions({
      credits: {
        enabled: false
      }
    });
  }, [id]);
  const handleMouseLeave = () => {
    console.log("close")

    setShowDescription(false);
  };
  const [selectedFund, setSelectedFund] = useState<Option1>();
  const [fundsOptions, setFundsOptions] = useState([]);
  const [base100Data, setBase100Data] = useState<MyDataType[]>([]); // Nouvel état pour les données en base 100
  const [rating, setRating] = useState(2);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userConnected, setUserConnected] = useState<number | null>(null);
  const [managementCompany, setManagementCompany] = useState<FormData>({
    nom: '',
    description: '',
    numeroagrement: '',
    email: '',
    password: '',
    site_web: '',
    dateimmatriculation: '',
    regulateur: '',
    tel: '',
    pays: '',
    societ: '',
    devise: '',
    sumActifNet: 0,
    nbreFond: 0,
    latestDate: ''
  });
  useEffect(() => {
    const fetchData = async () => {
      try {

        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const userId = localStorage.getItem('userId');

        console.log("isLoggedIn", isLoggedIn);

        if (isLoggedIn === 'true' && userId !== null) {
          const userIdNumber = parseInt(userId, 10);
          setIsLoggedIn(true);
          setUserConnected(userIdNumber);
        } else {
          setIsLoggedIn(false);
        }

        /*if (!isLoggedIn) {
          router.push('/accueil');
        }*/
      } catch (error) {
        console.error("Error fetching data:", error);
        // Gérer les erreurs ici, par exemple, afficher un message d'erreur à l'utilisateur
      }
    };

    fetchData();
  }, []);


  const [selectedDevise, setSelectedDevise] = useState('');

  const handleDeviseChange = async (e: { target: { value: any; }; }) => {
    Swal.fire({
      title: 'Veuillez patienter',
      html: 'Chargement des résultats en cours...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    const selectedValue = e.target.value;
    setSelectedDevise(selectedValue)

    const response = await fetch(`${urlconstant}/api/getSocietebyidfisrt/${id}?query=${selectedValue}`);
    const data = await response.json();
    setData(data.data.graph);
    setData1(data.data.fundCountByYear);
    setManagementCompany(prevState => ({
      ...prevState,
      sumActifNet: data.data.sumActifNet,
      latestDate: data.data.latestDate,
      nbreFond: data.data.nbrePart
    }));
    Swal.close(); // Close the loading popup

  };
  const [show, setShow] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopup1, setShowPopup1] = useState(false);
  const handleClosePopup = () => setShowPopup(false);

  const handleClose = () => setShow(false);



  var options: any;
  useEffect(() => {
    // Appel à l'API lors du premier rendu du composant
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
        const data = await getsociete(id);
        setManagementCompany(data.data.societe);
        setManagementCompany(prevState => ({
          ...prevState,
          sumActifNet: data.data.sumActifNet,
          latestDate: data.data.latestDate,
          nbreFond: data.data.nbrePart
        }));
        setData(data.data.graph);
        setData1(data.data.fundCountByYear);
        console.log(data.data.graph)

        const data1 = await getallsociete();

        const mappedOptions = data1?.data?.societes.map((funds: any) => ({

          value: funds.nom,
          label: funds.nom, // Replace with the actual property name
          // Replace with the actual property name
        }));

        setFundsOptions(mappedOptions);
        Swal.close(); // Close the loading popup


      } catch (error) {
        Swal.close(); // Close the loading popup

        console.error("Erreur lors de l'appel à l'API :", error);
      }
    }
    fetchData();



  }, [id]);






  const handleSearch = (e: any) => {
    e.preventDefault();
    // Effectuez votre recherche ici si nécessaire
  };


  const handleFundSelect = (selectedOption: any) => {
    setSelectedFund(selectedOption);
  };

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
  const [error, setError] = useState(""); // État pour stocker le message d'erreur


  const [showExportModal, setShowExportModal] = useState(false);

  const handleExportClick = () => {
    console.log("ee")
    setShow(true);
  };
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const [filterYears, setFilterYears] = useState(3); // Valeur par défaut : 3 ans

  // Filtrer les données en fonction de la période sélectionnée
  /*
    const filteredData = data.filter((item: DataItem) => {
      const currentYear = new Date().getFullYear();
      const filterYear = currentYear - filterYears;
  
      return item.annee >= filterYear && item.annee <= currentYear;
    });*/

  const currentYear = new Date().getFullYear();
  const filterYear = currentYear - filterYears;

  // Filtrer les données pour n'inclure que les années récentes
  const filteredData: { [key: string]: number } = {};
  const fundCountByYears: { [key: string]: number } = {}; // Object to keep track of the count of funds per year
  for (const [year, actifNet] of Object.entries(data)) {
    if (parseInt(year) >= filterYear && parseInt(year) <= currentYear) {
      filteredData[year] = Math.round(actifNet);

    }
  }
  for (const [year, fundCountByYear] of Object.entries(data1)) {
    if (parseInt(year) >= filterYear && parseInt(year) <= currentYear) {
      fundCountByYears[year] = fundCountByYear; // Increment the count for the year

    }
  }

  console.log(fundCountByYears)
  const years = Object.keys(filteredData);
  const actifNets = Object.values(filteredData);
  const fundsPerYear = Object.values(fundCountByYears);


  options = {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Actifs Nets par Année'
    },
    xAxis: {
      categories: years.map(year => parseInt(year)),
      title: {
        text: 'Année'
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Actifs Nets'
      }
    },
    tooltip: {
      formatter: function (this: Highcharts.TooltipFormatterContextObject) {
        const yearIndex: number = this.point?.index ?? 0; // Use 0 as default if index is undefined
        const numberOfFunds: number = fundsPerYear[yearIndex] ?? 0; // Use 0 as default if fundsPerYear[yearIndex] is undefined
        const actifNet: number = this.y!; // Use non-null assertion operator (!) to assert that this.y is not null or undefined
        return `<b>${this.x}</b><br/>Actifs Nets: ${numberFormat(Math.round(actifNet), 0, '.', ' ')} <br/>Nombre de fonds: ${numberOfFunds}`;
      }
    },
    series: [{
      name: 'Actifs Nets',
      data: actifNets
    }]
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
  
  // JSON-LD pour Schema.org
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "InvestmentFund",
    "name":id,
    "description": id,
    "identifier": id,
  };
  return (

    <Fragment>
      <Header />
      <Head>
        <title>{managementCompany?.nom} - Informations sur la societe</title>
        <meta name="description" content={managementCompany?.nom} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={`${managementCompany?.nom} - Informations sur le fond`} />
        <meta property="og:description" content={managementCompany?.nom} />
        <meta property="og:image" content={`${urlsite}/images/logo.png`} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`${urlsite}/Fundmanager/${id}`} />
        {/* Ajoutez ici d'autres métadonnées spécifiques au SEO */}     
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
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

        <div className="container-full">
          {/* Main content */}
          <section className="content">
            <div className="row">

              <div className="col-md-12 col-12">
                <div className="box ">
                  <div className="box-body">
                    <div className="d-md-flex justify-content-between align-items-center">
                      <div className="col-2">
                    

                      </div>
                      <div className="">
                        <p className="text-center"><strong>Rechercher une société</strong></p>
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
                                  pathname: '/Fundmanager',
                                  query: { fund: selectedFund ? selectedFund?.value.replace(/ /g, '-') : '' },
                                }}
                                as={`/Fundmanager/${selectedFund ? selectedFund.value.replace(/ /g, '-') : ''}`}
                                key={selectedFund?.value}
                                style={{
                                  textDecoration: 'none', // Remove underline
                                  backgroundColor: '#6366f1', // Background color
                                  color: 'white', // Text color
                                  padding: '10px 20px', // Padding
                                borderRadius: '5px', // Rounded corners
borderColor:'grey',
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



                    </div>
                    <div className="row">

                      <ul className="tabs-menu" style={{ display: 'flex', flexWrap: 'wrap', padding: '0', margin: '0', listStyleType: 'none', width: '100%' }}>
                        <li style={{ margin: '0', padding: '0', flex: '1' }}>
                          <Button
                            href="javascript:void(0)"
                            style={{
                              width: '100%',
                              textDecoration: 'none', // Remove underline
                              backgroundColor: '#6366f1', // Background color
                              color: 'white', // Text color
                              padding: '10px 20px', // Padding
                            borderRadius: '5px', // Rounded corners
borderColor:'grey',
                              textAlign: 'center' // Center the text
                            }}
                          >
                            Fiche récapitulative
                          </Button>
                        </li>
                        <li style={{ margin: '0', padding: '0', flex: '1' }}>
                          <Button
                            href={`/Fundmanager/Opcvm/${id.replace(/ /g, '-')}`}
                            style={{
                              width: '100%',
                              backgroundColor: 'grey',
                              textDecoration: 'none', // Remove underline
                              color: 'white', // Text color
                              padding: '10px 20px', // Padding
                            borderRadius: '5px', // Rounded corners
borderColor:'grey',
                              textAlign: 'center' // Center the text
                            }}
                          >
                            Liste des fonds
                          </Button>
                        </li>
                        <li style={{ margin: '0', padding: '0', flex: '1' }}>
                          <Button
                            href={`/Fundmanager/statistique/${id.replace(/ /g, '-')}`}
                            style={{
                              width: '100%',
                              backgroundColor: 'grey',
                              textDecoration: 'none', // Remove underline
                              color: 'white', // Text color
                              padding: '10px 20px', // Padding
                            borderRadius: '5px', // Rounded corners
borderColor:'grey',
                              textAlign: 'center' // Center the text
                            }}
                          >
                            Graphiques de synthèse
                          </Button>
                        </li>
                      </ul>




                    </div>
                  </div>
                </div>


                <div className="row">
                  <div className="col-md-7 d-flex flex-column">

                    <div className="box flex-fill">
                      <div className="box-body pb-lg-0">
                        <p><span className="text-primary">Informations sur la société de gestion</span> | <span className="text-fade"></span></p>
                        <div className="dl-horizontal dl-fichier-identite dl-horizontal-40-60 dl-highlight-value dl-padding-small dl-small-font">
                          <div className="row">
                            <div className="col-md-7">
                              <div className="line-group">
                                <div>
                                  <p><strong>Société</strong>: {managementCompany?.nom}</p>
                                  <p><strong>Pays</strong>: {managementCompany?.pays}</p>
                                  <p><strong>Numero agrement</strong>: {managementCompany?.numeroagrement}</p>
                                  <p><strong>Societe independante</strong>: Oui</p>
                                  <p><strong>Liée au groupe</strong>: </p>
                                  <p><strong>Nombre d employés</strong>:</p>
                                  <p><strong>Nombre de part réferencées</strong>: {managementCompany?.nbreFond}</p>
                                  <p><strong>Encours global</strong>: </p>
                                  <p><strong>Encours des parts réferencées</strong>: {numberFormat(Math.round(managementCompany?.sumActifNet), 0, '.', ' ')}  du {managementCompany?.latestDate}</p>
                                  <p><strong>Commercialisation</strong>: Global</p>
                                  <p><strong>Commercialisation du groupe</strong>:</p>
                                  <p><strong>Site Internet</strong>: {managementCompany?.site_web}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="box flex-fill">
                      <div className="box-body pb-lg-0">
                        <p><span className="text-primary">Présentation de la société</span></p>
                        {managementCompany?.description}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-5">
                    <div className="box">
                      <div className="box-body pb-lg-0">
                        <p><span className="text-primary">Graphique de l&#39;évolution des encours</span> | <span className="text-fade"></span></p>
                        <div className="dl-horizontal dl-fichier-identite dl-horizontal-40-60 dl-highlight-value dl-padding-small dl-small-font">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="line-group">
                                <div className="text-center">
                                  <div className="col-md-6 mx-auto">
                                    <label>Devise:</label>
                                    <select className="form-control" onChange={handleDeviseChange} value={selectedDevise}>
                                      <option value="">Devise Locale</option>
                                      <option value="EUR">EUR</option>
                                      <option value="USD">USD</option>
                                    </select>
                                  </div>
                                </div>
                                <br />
                                <div>
                                  <div className="box-controls ">
                                    <ul className="nav nav-pills nav-pills-sm" role="tablist">
                                      <li className="nav-item">
                                        <Link
                                          className={`nav-link py-2 px-4 b-0 ${filterYears === 3 ? 'active' : ''}`}
                                          onClick={() => setFilterYears(3)} href="javascript:void(0)"
                                        >
                                          <span className="nav-text base-font">3 ans</span>
                                        </Link>
                                      </li>
                                      <li className="nav-item">
                                        <Link
                                          className={`nav-link py-2 px-4 b-0 ${filterYears === 5 ? 'active' : ''}`}
                                          onClick={() => setFilterYears(5)} href="javascript:void(0)"
                                        >
                                          <span className="nav-text base-font">5 ans</span>
                                        </Link>
                                      </li>
                                      <li className="nav-item">
                                        <Link
                                          className={`nav-link py-2 px-4 b-0 ${filterYears === 8 ? 'active' : ''}`}
                                          onClick={() => setFilterYears(8)} href="javascript:void(0)"
                                        >
                                          <span className="nav-text base-font">8 ans</span>
                                        </Link>
                                      </li>
                                    </ul>
                                  </div>

                                  <HighchartsReact
                                    highcharts={Highcharts}
                                    options={options}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">

                    <div className="box">
                      <div className="box-body pb-lg-0">
                        <p><span className="text-primary">Actualités</span> | <span className="text-fade"></span></p>
                        <div className="dl-horizontal dl-fichier-identite dl-horizontal-40-60 dl-highlight-value dl-padding-small dl-small-font">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="line-group">

                              </div>
                            </div>


                          </div>
                        </div>

                        {/* Add the ESG and Labels sections here */}
                      </div>
                    </div>
                  </div>

                </div>
                <div className="row">
                  <div className="col-md-12">

                    <div className="box">
                      <div className="box-body pb-lg-0">
                        <p><span className="text-primary">Recompenses</span> | <span className="text-fade"></span></p>
                        <div className="dl-horizontal dl-fichier-identite dl-horizontal-40-60 dl-highlight-value dl-padding-small dl-small-font">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="line-group">

                              </div>
                            </div>


                          </div>
                        </div>

                        {/* Add the ESG and Labels sections here */}
                      </div>
                    </div>
                  </div>

                </div>
              </div>








            </div >
          </section >
        </div >


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

function numberFormat(number: number, decimals = 0, decimalSeparator = '.', thousandSeparator = ' ') {
  const fixedNumber = number.toFixed(decimals);
  const parts = fixedNumber.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
  return parts.join(decimalSeparator);
}