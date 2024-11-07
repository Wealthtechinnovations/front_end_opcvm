"use client";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Highcharts, { color } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Select, { SingleValue } from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faSquare } from '@fortawesome/free-solid-svg-icons';
import Header from '../../../Header'
import { urlconstant, urlsite } from "@/app/constants";
import { Modal, Button } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Head from 'next/head';
import Swal from 'sweetalert2';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
/**
 * Fonction asynchrone pour obtenir les détails d'un fond.
 * @async
 * @function getclassement
 * @param {number} id - L'identifiant du fond.
 * @returns {Promise} - Les données du classement du fond.
 */

async function getFonds(id: string) {
  const data = (

    await fetch(`${urlconstant}/api/getfondbypays/${id}`, {
      method: 'GET', // Assurez-vous que la méthode HTTP correspond à votre API
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
interface Funds {
  data: {
    funds: any[]; // ou un type spécifique pour les éléments du tableau 'funds'
  };
}

interface FormDatas {
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
}


interface Option {

  name: any;
  value: any;
}
interface Societe {
  value: any[]; // ou un type spécifique pour les éléments du tableau 'funds'
  label: any[]; // ou un type spécifique pour les éléments du tableau 'funds'

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

const optionsCategorie = [
  { value: "Obligations", label: 'Obligations' },
  { value: "Actions", label: 'Actions' },
  { value: "Diversifié", label: 'Diversifié' },
  { value: "Monétaire", label: 'Monétaire' },
  { value: "ETF", label: 'ETF' },
  { value: "Infrastructure", label: 'Infrastructure' },
  { value: "Immobilier", label: 'Immobilier' },
  { value: "Private equity", label: 'Private equity' },
  { value: "Alternatif", label: 'Alternatif' },

  { value: "Autres", label: 'Autres' },





  // Ajoutez plus d'options au besoin
];
interface FormData {
  societe?: Option;
  categorie?: Option;
}
/**
 * Composant principal représentant la page d'un fond.
 * @function Fond
 * @param {PageProps} props - Propriétés de la page.
 */
export default function Fond(props: PageProps) {
  const router = useRouter();

  const id = props.params.fondId.replace(/-/g, ' ');
  const [funds, setFunds] = useState<Funds | null>(null);

  const [showDescription, setShowDescription] = useState(false);
  const handleMouseEnter = () => {
    console.log("open")
    setShowDescription(true);
  };

  const handleMouseLeave = () => {
    console.log("close")

    setShowDescription(false);
  };


  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const [selectedOptions1, setSelectedOptions1] = useState<SingleValue<Option1> | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [fundsOptions, setFundsOptions] = useState([]);
  const [base100Data, setBase100Data] = useState<MyDataType[]>([]); // Nouvel état pour les données en base 100
  const [rating, setRating] = useState(2);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userConnected, setUserConnected] = useState<number | null>(null);
  const [managementCompany, setManagementCompany] = useState<FormDatas>({
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
    devise: ''
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
        const data1 = await getFonds(id);

        const mappedOptions = data1?.data.funds.map((funds: any) => ({

          value: funds.id,
          label: funds.test, // Replace with the actual property name
          // Replace with the actual property name
        }));
        setFundsOptions(mappedOptions);



        const response = await fetch(`${urlconstant}/api/listeproduitpayssociete/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          //body: JSON.stringify(requestBody),
        });

        const responseData = await response.json();
        if (responseData && responseData.code === 200 && responseData.data.funds.length > 0) {
          Swal.close(); // Close the loading popup

          setFunds(responseData);
          totalItems = responseData?.data.funds?.length || 0;
          console.log(Math.ceil(totalItems / itemsPerPage))
          settotalPages(Math.ceil(totalItems / itemsPerPage));
        }

      } catch (error) {
        Swal.close(); // Close the loading popup

        console.error("Erreur lors de l'appel à l'API :", error);
      }
    }
    fetchData();



  }, [id]);

  const [selectedRows, setSelectedRows] = useState<string[]>([]); // Tableau pour stocker les lignes sélectionnées
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [sortedFunds, setSortedFunds] = useState<Funds | null>(null); // État pour les fonds triés
  const [searchResults, setSearchResults] = useState([]); // État pour stocker les résultats de la recherche
  const [optionsSociete, setOptionsSociete] = useState([]);
  const [selectedSociete, setSelectedSociete] = useState<Societe | null>(null);

  const [activeTab, setActiveTab] = useState("tabAccueil");

  const handleTabClick = (tabName: any) => {
    setActiveTab(tabName);
    console.log("Position de la nav : ", tabName);
  };

  const handleItemsPerPageChange = (e: { target: { value: string; }; }) => {
    const selectedValue = parseInt(e.target.value, 10);

    if (selectedValue === 100) {
      setShowPopup(true);
      setItemsPerPage(20);
      setCurrentPage(1);

    } else {

      setItemsPerPage(selectedValue);
      setCurrentPage(1);
    } // Reset to the fi
  };



  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, settotalPages] = useState(1);
  var totalItems: any;
  const getSortClasses = (key: string) => {
    if (sortConfig.key === key) {
      return `text-right ${sortConfig.direction === 'asc' ? 'asc-icon' : 'desc-icon'}`;
    }
    return 'text-right';
  };

  const handleSort = (key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';

    }
    console.log(key)

    setSortConfig({ key, direction });

    if (funds && funds.data.funds) {

      // Créez une copie triée des fonds en utilisant la méthode sort()
      const sortedFundsCopy = [...funds.data.funds];
      console.log(sortedFundsCopy);
      const filteredFunds = sortedFundsCopy.filter(item =>
        item.performanceData &&
        item.performanceData[sortConfig.key] !== '-'
      );
      console.log(filteredFunds)

      filteredFunds.sort((a, b) => {

        if (sortConfig.key == "type_investissement" || sortConfig.key == "nom_fond" || sortConfig.key == "categorie_national" || sortConfig.key == "datejour" || sortConfig.key == "datemoispre" || sortConfig.key == "dev_libelle" || sortConfig.key == "categorie_globale" || sortConfig.key == "code_ISIN" || sortConfig.key == "societe_gestion") {
          const aValue = a.fundData[sortConfig.key];
          const bValue = b.fundData[sortConfig.key];
          if (aValue < bValue) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          } else if (aValue > bValue) {
            return sortConfig.direction === 'asc' ? 1 : -1;
          } else {
            return 0;
          }

        } else {
          const aValue = a.performanceData[sortConfig.key];
          const bValue = b.performanceData[sortConfig.key];
          const numericAValue = parseFloat(aValue);
          const numericBValue = parseFloat(bValue);

          if (isNaN(numericAValue) || isNaN(numericBValue) || aValue === '-' || bValue === '-') {
            // Handle cases where the values are not valid numbers
            // For example, if aValue or bValue are non-numeric strings
            return 0; // or handle this case based on your requirements
          }

          if (numericAValue < numericBValue) {
            return direction === 'asc' ? -1 : 1;
          } else if (numericAValue > numericBValue) {
            return direction === 'asc' ? 1 : -1;
          } else {
            return 0;
          }
        }
      });

      // Mettre à jour sortedFunds avec la version triée
      setSortedFunds({ data: { funds: filteredFunds } });
      setFunds({ data: { funds: filteredFunds } });
      totalItems = filteredFunds.length || 0;
      settotalPages(Math.ceil(totalItems / itemsPerPage));
    }
  };
  const handleCheckboxChange = (itemId: any) => {
    if (selectedRows.includes(itemId)) {
      // L'élément est déjà sélectionné, donc le désélectionner
      setSelectedRows(selectedRows.filter((id) => id !== itemId));
      console.log("aaaaa")
      console.log(selectedRows)
    } else {
      console.log("bbbb")
      // L'élément n'est pas sélectionné, donc le sélectionner
      setSelectedRows(selectedRows.concat(itemId));
      console.log(selectedRows)

    }
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
  const headers = {
    tabAccueil: [
      { label: 'Nom du fonds', key: 'nom_fond' },
      { label: 'Categorie', key: 'categorie_globale' },
      { label: 'Devise', key: 'dev_libelle' },
      { label: 'Categorie_nationale', key: 'categorie_national' },
      { label: 'YTD', key: 'ytd' },
      { label: 'Perf Glissante 1A', key: 'perf1an' },
      { label: 'Perf Glissante 3A', key: 'perf3ans' },
      { label: 'Date', key: 'datejour' },
    ],
    tabPerfCT: [
      { label: 'Nom du fonds', key: 'nom_fond' },
      { label: 'Categorie', key: 'categorie_globale' },
      { label: 'Devise', key: 'dev_libelle' },
      { label: 'YTD', key: 'ytd' },
      { label: 'Perf Glissante 4S', key: 'perf4s' },
      { label: 'Perf Glissante 3M', key: 'perf3m' },
      { label: 'Perf Glissante 6M', key: 'perf6m' },

      { label: 'Date', key: 'datejour' },],
    tabPerfMTLT: [
      { label: 'Nom du fonds', key: 'nom_fond' },
      { label: 'Devise', key: 'dev_libelle' },
      { label: 'Perf Glissante 1A', key: 'perf1an' },
      { label: 'Perf Glissante 3A', key: 'perf3ans' },
      { label: 'Perf Glissante 5A', key: 'perf5ans' },
      { label: 'Date', key: 'datejour' },],
    tabPerfRatios1a: [
      { label: 'Nom du fonds', key: 'nom_fond' },
      { label: 'Perf annualise', key: 'perfannu1an' },
      { label: 'Volatilité', key: 'volatility1an' },
      { label: 'Sharpe', key: 'ratiosharpe1an' },
      { label: 'Perte Max', key: 'pertemax1an' },
      { label: 'Sortino', key: 'sortino1an' },
      { label: 'Ratio info', key: 'info1an' },
      { label: 'Date', key: 'datejour' },],
    tabPerfRatios3a: [
      { label: 'Nom du fonds', key: 'nom_fond' },
      { label: 'Perf annualise', key: 'perfannu3an' },
      { label: 'Volatilité', key: 'volatility3an' },
      { label: 'Sharpe', key: 'ratiosharpe3an' },
      { label: 'Perte Max', key: 'pertemax3an' },
      { label: 'Sortino', key: 'sortino3an' },
      { label: 'Ratio info', key: 'info3an' },
      { label: 'Date', key: 'datejour' },],
    tabPerfRatios5a: [{ label: 'Nom du fonds', key: 'nom_fond' },
    { label: 'Perf annualise', key: 'perfannu5an' },
    { label: 'Volatilité', key: 'volatility5an' },
    { label: 'Sharpe', key: 'ratiosharpe5an' },
    { label: 'Perte Max', key: 'pertemax5an' },
    { label: 'Sortino', key: 'sortino5an' },
    { label: 'Ratio info', key: 'info5an' },
    { label: 'Date', key: 'datejour' },],
    tabFrais: [

      { label: 'Nom du fonds', key: 'nom_fond' },
      { label: 'Invest min', key: 'minimum_investissement' },
      { label: 'Gestion', key: 'frais_gestion' },
      { label: 'Souscription', key: 'frais_souscription' },
      { label: 'Rachat', key: 'frais_rachat' },],

    tabGestion: [

      { label: 'Nom du fonds', key: 'nom_fond' },
      { label: 'Societe de gestion', key: 'societe_gestion' },
      { label: 'Type', key: 'structure_fond' },
      { label: 'Categorie_nationale', key: 'categorie_national' },
      { label: 'Code ISIN', key: 'code_ISIN' },
    ],
  };
  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    setFunds({ data: { funds: [] } });
    const formData: FormData = {}; // Initialisation de l'objet formData
    let selectedcategorie, selectedeSociete;
    // Ajouter les valeurs des critères "Sharpe" à l'objet formData
    if (selectedOptions1) {


      selectedcategorie = selectedOptions1.value;
    }

    setError("");
    Swal.fire({
      title: 'Veuillez patienter',
      html: 'Chargement des résultats en cours...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    // Traitez les données du formulaire ici (selectedOptions et textInput)
    console.log('Options sélectionnées :', formData);
    const selectedValues = selectedOptions.map(option => option?.value);
    fetch(`${urlconstant}/api/listeproduitpayssociete/${id}?query=${selectedValues.join(',')}&selectedcategorie=${selectedcategorie}`, {
      method: 'POST', // Assurez-vous que la méthode HTTP correspond à votre API
      headers: {
        'Content-Type': 'application/json', // Spécifiez le type de contenu JSON
      },
      body: JSON.stringify({ formData }), // Convertissez formData en format JSON
    })
      .then(response => response.json())
      .then(data => {
        if (data && data.code === 200 && data.data.funds.length > 0) {
          setFunds(data);
          totalItems = data.data.funds.length || 0;
          settotalPages(Math.ceil(totalItems / itemsPerPage));
          Swal.close(); // Close the loading popup


        } else {
          Swal.close(); // Close the loading popup

          // Affichez un message d'erreur ici
          setError("Aucun résultat trouvé. Réessayez avec d'autres critères.");

          console.error('Aucun fonds trouvé ou erreur de l\'API.');
        }

        // Traitez la réponse de l'API ici
        console.log('Réponse de l\'API :', data);
      })
      .catch(error => {
        console.error('Erreur lors de l\'appel de l\'API :', error);
      });
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
        <title>{id} - Informations sur la societe</title>
        <meta name="keywords" content={`${id}, investissement, ${managementCompany.devise}, performances, caractéristiques`} />
        <meta name="description" content={id} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={`${id} - Informations sur le fond`} />
        <meta property="og:description" content={id} /> 
         <meta property="og:image" content={`${urlsite}/images/logo.png`} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`https://funds.chainsolutions.fr/pays/${id}`} />
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
                        <p><span className="text-primary">Pays</span> | <span className="text-fade"></span></p>

                      </div>

                    </div>
                    <hr />
                    <div className="d-md-flex justify-content-between align-items-center">



                    </div>
                    <div className="row">

                      <ul className="tabs-menu" style={{ display: 'flex', flexWrap: 'wrap', padding: '0', margin: '0', listStyleType: 'none', width: '100%' }}>
                        <li style={{ margin: '0', padding: '0', flex: '1' }}>
                          <Link
                            href={`/pays/${id.replace(/ /g, '-')}`}
                            style={{
                              width: '100%',
                              textDecoration: 'none', // Remove underline
                              backgroundColor: 'grey', // Background color
                              color: 'white', // Text color
                              padding: '10px 20px', // Padding
                            borderRadius: '5px', // Rounded corners
borderColor:'grey',
                              textAlign: 'center', // Center the text
                              display: 'inline-block' // Ensure it takes the full width
                            }}
                          >
                            Fiche pays
                          </Link>
                        </li>
                        <li style={{ margin: '0', padding: '0', flex: '1' }}>
                          <Link
                            href={`/pays/Fundmanager/${id.replace(/ /g, '-')}`}
                            style={{
                              width: '100%',
                              backgroundColor: 'grey', // Background color
                              textDecoration: 'none', // Remove underline
                              color: 'white', // Text color
                              padding: '10px 20px', // Padding
                            borderRadius: '5px', // Rounded corners
borderColor:'grey',
                              textAlign: 'center', // Center the text
                              display: 'inline-block' // Ensure it takes the full width
                            }}
                          >
                            Liste des sociétés
                          </Link>
                        </li>
                        <li style={{ margin: '0', padding: '0', flex: '1' }}>
                          <Link
                            href={`/pays/Opcvm/${id.replace(/ /g, '-')}`}
                            style={{
                              width: '100%',
                              backgroundColor: '#6366f1', // Background color
                              textDecoration: 'none', // Remove underline
                              color: 'white', // Text color
                              padding: '10px 20px', // Padding
                            borderRadius: '5px', // Rounded corners
borderColor:'grey',
                              textAlign: 'center', // Center the text
                              display: 'inline-block' // Ensure it takes the full width
                            }}
                          >
                            Liste des OPCVM
                          </Link>
                        </li>
                        <li style={{ margin: '0', padding: '0', flex: '1' }}>
                          <Link
                            href={`/pays/statistique/${id.replace(/ /g, '-')}`}
                            style={{
                              width: '100%',
                              backgroundColor: 'grey', // Background color
                              textDecoration: 'none', // Remove underline
                              color: 'white', // Text color
                              padding: '10px 20px', // Padding
                            borderRadius: '5px', // Rounded corners
borderColor:'grey',
                              textAlign: 'center', // Center the text
                              display: 'inline-block' // Ensure it takes the full width
                            }}
                          >
                            Graphiques de synthèse
                          </Link>
                        </li>
                      </ul>



                    </div>
                  </div>
                </div>
                <div className="row">




                  <form onSubmit={handleFormSubmit}>
                    <div className="row ">

                      <div className="col-md-6">
                        <label htmlFor="select">Fonds (Nom/ISIN) :</label>
                        <Select className="select-component"
                          id="select"
                          options={fundsOptions}
                          isMulti
                          isSearchable
                          value={selectedOptions}
                          onChange={(newValue, actionMeta) => setSelectedOptions(newValue.map(option => option as Option))}
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="select">Categories  :</label>
                        <Select className="select-component"
                          id="select"
                          options={optionsCategorie}

                          isSearchable
                          value={selectedOptions1}
                          onChange={(newValue, actionMeta) => setSelectedOptions1(newValue)}
                        />
                      </div>

                    </div>
                    <br />
                    {/* <div>
                          <label htmlFor="textInput">Autre champ :</label>
                          <input
                            className="form-control"
                            type="text"
                            id="textInput"
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                          />
  </div>*/}
                    <div className=" text-center">
                      <button style={{ width: '150px', backgroundColor: "#3b82f6", color: "white" }} className="btn btn-main">Rechercher</button>
                    </div>
                  </form>
                  {error && <div className=" text-center error-message" style={{ color: "red" }}>{error}</div>}

                  {/* Affichez les résultats de la recherche */}
                  {searchResults.length > 0 && (
                    <div className="search-results">
                      {/* Affichez les résultats ici */}
                      {/* ... */}
                    </div>
                  )}
                  <div className="row text-center">
                    <div className="btn-group" style={{ display: "inline-block" }}>
                      <button
                        className={`btn btn-main ${activeTab === "tabAccueil" ? "active" : ""} `}
                        style={activeTab === "tabAccueil" ? { width: '150px', backgroundColor: "#3b82f6", color: "white" } : {}}
                        onClick={() => handleTabClick("tabAccueil")}
                      >
                        Accueil
                      </button>
                      <button
                        className={`btn btn-main ${activeTab === "tabPerfCT" ? "active" : ""}`}
                        style={activeTab === "tabPerfCT" ? { width: '150px', backgroundColor: "#3b82f6", color: "white" } : {}}
                        onClick={() => handleTabClick("tabPerfCT")}
                      >
                        Perf CT
                      </button>
                      <button
                        className={`btn btn-main ${activeTab === "tabPerfMTLT" ? "active" : ""}`}
                        style={activeTab === "tabPerfMTLT" ? { width: '150px', backgroundColor: "#3b82f6", color: "white" } : {}}
                        onClick={() => handleTabClick("tabPerfMTLT")}
                      >
                        Perf MT / LT
                      </button>
                      <button
                        className={`btn btn-main ${activeTab === "tabPerfRatios1a" ? "active" : ""}`}
                        style={activeTab === "tabPerfRatios1a" ? { width: '150px', backgroundColor: "#3b82f6", color: "white" } : {}}
                        onClick={() => handleTabClick("tabPerfRatios1a")}
                      >
                        Ratios 1A
                      </button>
                      <button
                        className={`btn btn-main ${activeTab === "tabPerfRatios3a" ? "active" : ""}`}
                        style={activeTab === "tabPerfRatios3a" ? { width: '150px', backgroundColor: "#3b82f6", color: "white" } : {}}
                        onClick={() => handleTabClick("tabPerfRatios3a")}
                      >
                        Ratios 3A
                      </button>
                      <button
                        className={`btn btn-main ${activeTab === "tabPerfRatios5a" ? "active" : ""}`}
                        style={activeTab === "tabPerfRatios5a" ? { width: '150px', backgroundColor: "#3b82f6", color: "white" } : {}}
                        onClick={() => handleTabClick("tabPerfRatios5a")}
                      >
                        Ratios 5A
                      </button>
                      <button
                        className={`btn btn-main ${activeTab === "tabFrais" ? "active" : ""}`}
                        style={activeTab === "tabFrais" ? { width: '150px', backgroundColor: "#3b82f6", color: "white" } : {}}
                        onClick={() => handleTabClick("tabFrais")}
                      >
                        Frais
                      </button>
                      <button
                        className={`btn btn-main ${activeTab === "tabGestion" ? "active" : ""}`}
                        style={activeTab === "tabGestion" ? { width: '150px', backgroundColor: "#3b82f6", color: "white" } : {}}
                        onClick={() => handleTabClick("tabGestion")}
                      >
                        Gestion
                      </button>
                      {/*                   <button
                            className={`btn btn-main ${activeTab === "tabISR" ? "active" : ""}`}
                            style={activeTab === "tabISR" ? { backgroundColor: "#3b82f6", color: "white" } : {}}
                            onClick={() => handleTabClick("tabISR")}
                          >
                            ESG
  </button>*/}
                    </div>
                    <div className="text-center mt-3">
                      <label>Nombre de ligne par page:</label>
                      <select
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                      >
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>
                    <div className="text-right">
                      <button
                        className={`btn btn-main active}`}
                        style={{ width: '150px', backgroundColor: "#3b82f6", color: "white" }}
                      // onClick={exportTableToCSV}
                      >
                        Exporter
                      </button>
                    </div>
                    {activeTab == 'tabAccueil' ? (
                      <div className="table-responsive">

                        <table
                          id="example11"
                          className="table-striped text-fade table-bordered table-hover display nowrap margin-top-10 w-p100">
                          <thead className="table-header">
                            <tr className="text-center">
                              <th className="text-center"></th>
                              {headers.tabAccueil.map((header) => (
                                <th className="text-center" key={header.key} onClick={() => handleSort(header.key)}>
                                  {header.label}
                                  {sortConfig.key === header.key && (
                                    <span>{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
                                  )}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {funds?.data?.funds.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
                              <tr className="text-center" key={item.id}>
                                <td>
                                  <input
                                    type="checkbox"
                                    checked={selectedRows.includes(item.id)}
                                    id={`checkbox_${item.id}`}
                                    onChange={() => handleCheckboxChange(item.id)}
                                  />
                                </td>
                                <td className="text-center"><Link href={`/Opcvm/${item.fundData?.id}`}>{item.fundData?.nom_fond}</Link></td>
                                <td>{item.fundData?.categorie_globale}</td>
                                <td>{item.fundData?.dev_libelle}</td>
                                <td >{item.fundData?.categorie_national}</td>
                                <td className={`text-center ${parseFloat(item.performanceData?.ytd) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.performanceData?.ytd)) ? '-' : parseFloat(item.performanceData?.ytd).toFixed(2) + " %"}</td>
                                <td className={`text-center ${parseFloat(item.performanceData?.perf1an) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.performanceData?.perf1an)) ? '-' : parseFloat(item.performanceData?.perf1an).toFixed(2) + " %"}</td>
                                <td className={`text-center ${parseFloat(item.performanceData?.perf3ans) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.performanceData?.perf3ans)) ? '-' : parseFloat(item.performanceData?.perf3ans).toFixed(2) + " %"}</td>
                                <td>{item.fundData?.datejour}</td>

                              </tr>
                            ))}

                          </tbody>
                        </table>
                      </div>
                    ) : activeTab == 'tabPerfCT' ? (
                      <div className="table-responsive">

                        <table
                          id="example11"
                          className="table-striped text-fade table-bordered table-hover display nowrap margin-top-10 w-p100">
                          <thead className="table-header">
                            <tr className="text-center">
                              <th className="text-center"></th>
                              {headers.tabPerfCT.map((header) => (
                                <th className="text-center" key={header.key} onClick={() => handleSort(header.key)}>
                                  {header.label}
                                  {sortConfig.key === header.key && (
                                    <span>{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
                                  )}
                                </th>
                              ))}
                            </tr>
                          </thead>

                          <tbody>
                            {funds?.data?.funds.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
                              <tr className="text-center" key={item.id}>
                                <td>
                                  <input
                                    type="checkbox"
                                    checked={selectedRows.includes(item.id)}
                                    id={`checkbox_${item.id}`}
                                    onChange={() => handleCheckboxChange(item.id)}
                                  />
                                </td>
                                <td className="text-center"><Link href={`/Opcvm/${item.fundData?.id}`}>{item.fundData?.nom_fond}</Link></td>
                                <td>{item.fundData?.categorie_globale}</td>
                                <td>{item.fundData?.dev_libelle}</td>
                                <td className={`text-center ${parseFloat(item.performanceData?.ytd) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.performanceData?.ytd)) ? '-' : parseFloat(item.performanceData?.ytd).toFixed(2) + " %"}</td>
                                <td className={`text-center ${parseFloat(item.performanceData?.perf4s) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.performanceData?.perf4s)) ? '-' : parseFloat(item.performanceData?.perf4s).toFixed(2) + " %"}</td>
                                <td className={`text-center ${parseFloat(item.performanceData?.perf3m) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.performanceData?.perf3m)) ? '-' : parseFloat(item.performanceData?.perf3m).toFixed(2) + " %"}</td>
                                <td className={`text-center ${parseFloat(item.performanceData?.perf6m) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.performanceData?.perf6m)) ? '-' : parseFloat(item.performanceData?.perf6m).toFixed(2) + " %"}</td>

                                <td>{item.fundData?.datejour}</td>

                              </tr>
                            ))}

                          </tbody>
                        </table>
                      </div>
                    ) : activeTab == 'tabPerfMTLT' ? (
                      <div className="table-responsive">

                        <table
                          id="example11"
                          className="table-striped text-fade table-bordered table-hover display nowrap margin-top-10 w-p100">
                          <thead className="table-header">
                            <tr className="text-center">
                              <th className="text-center"></th>
                              {headers.tabPerfMTLT.map((header) => (
                                <th className="text-center" key={header.key} onClick={() => handleSort(header.key)}>
                                  {header.label}
                                  {sortConfig.key === header.key && (
                                    <span>{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
                                  )}
                                </th>
                              ))}
                            </tr>
                          </thead>

                          <tbody>
                            {funds?.data?.funds.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
                              <tr className="text-center" key={item.id}>
                                <td>
                                  <input
                                    type="checkbox"
                                    checked={selectedRows.includes(item.id)}
                                    id={`checkbox_${item.id}`}
                                    onChange={() => handleCheckboxChange(item.id)}
                                  />
                                </td>
                                <td className="text-center"><Link href={`/Opcvm/${item.fundData?.id}`}>{item.fundData?.nom_fond}</Link></td>
                                <td>{item.fundData?.dev_libelle}</td>
                                <td className={`text-center ${parseFloat(item.performanceData?.perf1an) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.performanceData?.perf1an)) ? '-' : parseFloat(item.performanceData?.perf1an).toFixed(2) + " %"}</td>
                                <td className={`text-center ${parseFloat(item.performanceData?.perf3ans) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.performanceData?.perf3ans)) ? '-' : parseFloat(item.performanceData?.perf3ans).toFixed(2) + " %"}</td>
                                <td className={`text-center ${parseFloat(item.performanceData?.perf5ans) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.performanceData?.perf5ans)) ? '-' : parseFloat(item.performanceData?.perf5ans).toFixed(2) + " %"}</td>

                                <td>{item.fundData?.datejour}</td>

                              </tr>
                            ))}

                          </tbody>
                        </table>
                      </div>
                    ) : activeTab == 'tabPerfRatios1a' ? (
                      <div className="table-responsive">

                        <table
                          id="example11"
                          className="table-striped text-fade table-bordered table-hover display nowrap margin-top-10 w-p100">
                          <thead className="table-header">
                            <tr className="text-center">
                              <th className="text-center"></th>
                              {headers.tabPerfRatios1a.map((header) => (
                                <th className="text-center" key={header.key} onClick={() => handleSort(header.key)}>
                                  {header.label}
                                  {sortConfig.key === header.key && (
                                    <span>{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
                                  )}
                                </th>
                              ))}
                            </tr>
                          </thead>

                          <tbody>
                            {funds?.data?.funds.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
                              <tr className="text-center" key={item.id}>
                                <td>
                                  <input
                                    type="checkbox"
                                    checked={selectedRows.includes(item.id)}
                                    id={`checkbox_${item.id}`}
                                    onChange={() => handleCheckboxChange(item.id)}
                                  />
                                </td>
                                <td className="text-center"><Link href={`/Opcvm/${item.fundData?.id}`}>{item.fundData?.nom_fond}</Link></td>
                                <td className={`text-center ${parseFloat(item.performanceData?.perfannu1an) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.performanceData?.perfannu1an)) ? '-' : parseFloat(item.performanceData?.perfannu1an).toFixed(2) + " %"}</td>
                                <td className={`text-center`}>{isNaN(parseFloat(item.performanceData?.volatility1an)) ? '-' : parseFloat(item.performanceData?.volatility1an).toFixed(2) + " %"} </td>
                                <td className={`text-center ${parseFloat(item.performanceData?.ratiosharpe1an) < 0 ? 'text-danger' : parseFloat(item.performanceData?.ratiosharpe1an) > 1 ? 'text-success' : ''}`}>{isNaN(parseFloat(item.performanceData?.ratiosharpe1an)) ? '-' : parseFloat(item.performanceData?.ratiosharpe1an).toFixed(2)}</td>
                                <td className={`text-center ${parseFloat(item.performanceData?.pertemax1an) < 0 ? 'text-danger' : 'text-success'}`}>  {isNaN(parseFloat(item.performanceData?.pertemax1an)) || parseFloat(item.performanceData?.pertemax1an) === 0
                                  ? '-'
                                  : parseFloat(item.performanceData?.pertemax1an).toFixed(2) + " %"}</td>
                                <td className={`text-center `}>{isNaN(parseFloat(item.performanceData?.sortino1an)) ? '-' : parseFloat(item.performanceData?.sortino1an).toFixed(2)}</td>
                                <td className={`text-center `}>{isNaN(parseFloat(item.performanceData?.info1an)) ? '-' : parseFloat(item.performanceData?.info1an).toFixed(2)}</td>
                                <td>{item.fundData?.datemoispre}</td>

                              </tr>
                            ))}

                          </tbody>
                        </table>
                      </div>
                    )
                      : activeTab == 'tabPerfRatios3a' ? (
                        <div className="table-responsive">

                          <table
                            id="example11"
                            className="table-striped text-fade table-bordered table-hover display nowrap margin-top-10 w-p100">
                            <thead className="table-header">
                              <tr className="text-center">
                                <th className="text-center"></th>
                                {headers.tabPerfRatios3a.map((header) => (
                                  <th className="text-center" key={header.key} onClick={() => handleSort(header.key)}>
                                    {header.label}
                                    {sortConfig.key === header.key && (
                                      <span>{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
                                    )}
                                  </th>
                                ))}
                              </tr>
                            </thead>

                            <tbody>
                              {funds?.data?.funds.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
                                <tr className="text-center" key={item.id}>
                                  <td>
                                    <input
                                      type="checkbox"
                                      checked={selectedRows.includes(item.id)}
                                      id={`checkbox_${item.id}`}
                                      onChange={() => handleCheckboxChange(item.id)}
                                    />
                                  </td>
                                  <td className="text-center"><Link href={`/Opcvm/${item.fundData?.id}`}>{item.fundData?.nom_fond}</Link></td>
                                  <td className={`text-center ${parseFloat(item.performanceData?.perfannu3an) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.performanceData?.perfannu3an)) ? '-' : parseFloat(item.performanceData?.perfannu3an).toFixed(2) + " %"}</td>
                                  <td className={`text-center `}>{isNaN(parseFloat(item.performanceData?.volatility3an)) ? '-' : parseFloat(item.performanceData?.volatility3an).toFixed(2) + " %"}</td>
                                  <td className={`text-center ${parseFloat(item.performanceData?.ratiosharpe3an) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.performanceData?.ratiosharpe3an)) ? '-' : parseFloat(item.performanceData?.ratiosharpe3an).toFixed(2)}</td>
                                  <td className={`text-center ${parseFloat(item.performanceData?.pertemax3an) < 0 ? 'text-danger' : 'text-success'}`}>  {isNaN(parseFloat(item.performanceData?.pertemax3an)) || parseFloat(item.performanceData?.pertemax3an) === 0
                                    ? '-'
                                    : parseFloat(item.performanceData?.pertemax3an).toFixed(2) + " %"}</td>
                                  <td className={`text-center`}>{isNaN(parseFloat(item.performanceData?.sortino3an)) ? '-' : parseFloat(item.performanceData?.sortino3an).toFixed(2)}</td>
                                  <td className={`text-center `}>{isNaN(parseFloat(item.performanceData?.info3an)) ? '-' : parseFloat(item.performanceData?.info3an).toFixed(2)}</td>
                                  <td>{item.fundData?.datemoispre}</td>

                                </tr>
                              ))}

                            </tbody>
                          </table>
                        </div>
                      )

                        : activeTab == 'tabPerfRatios5a' ? (
                          <div className="table-responsive">

                            <table
                              id="example11"
                              className="table-striped text-fade table-bordered table-hover display nowrap margin-top-10 w-p100">
                              <thead className="table-header">
                                <tr className="text-center">
                                  <th className="text-center"></th>
                                  {headers.tabPerfRatios5a.map((header) => (
                                    <th className="text-center" key={header.key} onClick={() => handleSort(header.key)}>
                                      {header.label}
                                      {sortConfig.key === header.key && (
                                        <span>{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
                                      )}
                                    </th>
                                  ))}
                                </tr>
                              </thead>

                              <tbody>
                                {funds?.data?.funds.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
                                  <tr className="text-center" key={item.id}>
                                    <td>
                                      <input
                                        type="checkbox"
                                        checked={selectedRows.includes(item.id)}
                                        id={`checkbox_${item.id}`}
                                        onChange={() => handleCheckboxChange(item.id)}
                                      />
                                    </td>
                                    <td className="text-center"><Link href={`/Opcvm/${item.fundData?.id}`}>{item.fundData?.nom_fond}</Link></td>
                                    <td className={`text-center ${parseFloat(item.performanceData?.perfannu5an) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.performanceData?.perfannu5an)) ? '-' : parseFloat(item.performanceData?.perfannu5an).toFixed(2) + " %"}</td>
                                    <td className={`text-center`}>{isNaN(parseFloat(item.performanceData?.volatility5an)) ? '-' : parseFloat(item.performanceData?.volatility5an).toFixed(2) + " %"}</td>
                                    <td className={`text-center ${parseFloat(item.performanceData?.ratiosharpe5an) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.performanceData?.ratiosharpe5an)) ? '-' : parseFloat(item.performanceData?.ratiosharpe5an).toFixed(2)}</td>
                                    <td className={`text-center ${parseFloat(item.performanceData?.pertemax5an) < 0 ? 'text-danger' : 'text-success'}`}>  {isNaN(parseFloat(item.performanceData?.pertemax5an)) || parseFloat(item.performanceData?.pertemax5an) === 0
                                      ? '-'
                                      : parseFloat(item.performanceData?.pertemax5an).toFixed(2) + " %"}</td>
                                    <td className={`text-center `}>{isNaN(parseFloat(item.performanceData?.sortino5an)) ? '-' : parseFloat(item.performanceData?.sortino5an).toFixed(2)}</td>
                                    <td className={`text-center `}>{isNaN(parseFloat(item.performanceData?.info5an)) ? '-' : parseFloat(item.performanceData?.info5an).toFixed(2)}</td>
                                    <td>{item.fundData?.datemoispre}</td>

                                  </tr>
                                ))}

                              </tbody>
                            </table>
                          </div>
                        )
                          : activeTab == 'tabFrais' ? (
                            <div className="table-responsive">

                              <table
                                id="example11"
                                className="table-striped text-fade table-bordered table-hover display nowrap margin-top-10 w-p100">
                                <thead className="table-header">
                                  <tr className="text-center">
                                    <th className="text-center"></th>
                                    {headers.tabFrais.map((header) => (
                                      <th className="text-center" key={header.key} onClick={() => handleSort(header.key)}>
                                        {header.label}
                                        {sortConfig.key === header.key && (
                                          <span>{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
                                        )}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>

                                <tbody>
                                  {funds?.data?.funds.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
                                    <tr className="text-center" key={item.id}>
                                      <td>
                                        <input
                                          type="checkbox"
                                          checked={selectedRows.includes(item.id)}
                                          id={`checkbox_${item.id}`}
                                          onChange={() => handleCheckboxChange(item.id)}
                                        />
                                      </td>
                                      <td className="text-center"><Link href={`/Opcvm/${item.fundData?.id}`}>{item.fundData?.nom_fond}</Link></td>
                                      <td>{item.fundData?.minimum_investissement}</td>
                                      <td>{item.fundData?.frais_gestion !== undefined ? (item.fundData.frais_gestion * 100).toFixed(2) + '%' : ''}</td>
                                      <td>{item.fundData?.frais_souscription !== undefined ? (item.fundData.frais_souscription * 100).toFixed(2) + '%' : ''}</td>
                                      <td>{item.fundData?.frais_rachat !== undefined ? (item.fundData.frais_rachat * 100).toFixed(2) + '%' : ''}</td>

                                    </tr>
                                  ))}

                                </tbody>
                              </table>
                            </div>
                          )
                            : activeTab == 'tabGestion' ? (
                              <div className="table-responsive">

                                <table
                                  id="example11"
                                  className="table-striped text-fade table-bordered table-hover display nowrap margin-top-10 w-p100">

                                  <thead className="table-header">
                                    <tr className="text-center">
                                      <th className="text-center"></th>
                                      {headers.tabGestion.map((header) => (
                                        <th className="text-center" key={header.key} onClick={() => handleSort(header.key)}>
                                          {header.label}
                                          {sortConfig.key === header.key && (
                                            <span>{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
                                          )}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {funds?.data?.funds.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
                                      <tr className="text-center" key={item.id}>
                                        <td>
                                          <input
                                            type="checkbox"
                                            checked={selectedRows.includes(item.id)}
                                            id={`checkbox_${item.id}`}
                                            onChange={() => handleCheckboxChange(item.id)}
                                          />
                                        </td>
                                        <td className="text-center"><Link href={`/Opcvm/${item.fundData?.id}`}>{item.fundData?.nom_fond}</Link></td>
                                        <td className="text-center">{item.fundData?.societe_gestion}</td>
                                        <td className="text-center">{item.fundData?.structure_fond}</td>
                                        <td className="text-center">{item.fundData?.categorie_national}</td>
                                        <td className="text-center">{item.fundData?.code_ISIN}</td>


                                      </tr>
                                    ))}

                                  </tbody>
                                </table>
                              </div>
                            ) : <div>
                            </div>}
                    <div className="text-center">

                      <div className="row justify-content-center">
                        <div className="col-2">
                          {currentPage < totalPages && (
                            <button
                              style={{
                                textDecoration: 'none',
                                backgroundColor: '#6366f1',
                                color: 'white',
                                padding: '10px 20px',
                                borderRadius: '5px',
                              }}
                              onClick={handleNextPage}
                            >
                              Page suivante
                            </button>
                          )}
                        </div>
                        <div className="col-2 text-center">
                          {currentPage}/{totalPages}
                        </div>
                        <div className="col-2">
                          {currentPage > 1 && (
                            <button
                              style={{
                                textDecoration: 'none',
                                backgroundColor: '#6366f1',
                                color: 'white',
                                padding: '10px 20px',
                                borderRadius: '5px',
                              }}
                              onClick={handlePreviousPage}
                            >
                              Page précédente
                            </button>
                          )}
                        </div>
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
