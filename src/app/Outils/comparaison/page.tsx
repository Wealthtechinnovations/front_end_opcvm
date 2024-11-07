"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Modal, Button } from 'react-bootstrap'; // Assurez-vous d'importer les composants de Bootstrap nécessaires
import { DropdownButton, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import Select, { SingleValue } from 'react-select';
//import * as XLSX from 'xlsx';
import Header from '../../Header';
import { urlconstant } from '../../constants';
import { color } from "highcharts";
import Swal from 'sweetalert2';

interface Societe {
  value: any[]; // ou un type spécifique pour les éléments du tableau 'funds'
  label: any[]; // ou un type spécifique pour les éléments du tableau 'funds'

}
interface Funds {
  data: {
    funds: any[]; // ou un type spécifique pour les éléments du tableau 'funds'
  };
}
async function getsociete() {
  const data = (
    await fetch(`${urlconstant}/api/getSocietes`)
  ).json();
  return data;
}
const optionsCategorie = [
  { value: "OBLIGATIONS", label: 'OBLIGATIONS' },
  { value: "ACTIONS", label: 'ACTIONS' },
  { value: "DIVERSIFIE", label: 'DIVERSIFIE' },
  { value: "MONETAIRE", label: 'MONETAIRE' },
  { value: "ETF", label: 'ETF' },
  { value: "INFRASTRUCTURE", label: 'INFRASTRUCTURE' },
  { value: "IMMOBILIER", label: 'IMMOBILIER' },
  { value: "PRIVATE EQUITY", label: 'PRIVATE EQUITY' },
  { value: "ALTERNATIF", label: 'ALTERNATIF' },
  { value: "AUTRES", label: 'AUTRES' },


];

const optionsCategorienationale = [
  { value: "OBLIGATIONS MAROC", label: 'OBLIGATIONS MAROC', country: 'MAROC' },
  { value: "ACTIONS MAROC", label: 'ACTIONS MAROC', country: 'MAROC' },
  { value: "DIVERSIFIE MAROC", label: 'DIVERSIFIE MAROC', country: 'MAROC' },
  { value: "MONETAIRE MAROC", label: 'MONETAIRE MAROC', country: 'MAROC' },
  { value: "ETF MAROC", label: 'ETF MAROC', country: 'MAROC' },
  { value: "INFRASTRUCTURE MAROC", label: 'INFRASTRUCTURE MAROC', country: 'MAROC' },
  { value: "IMMOBILIER MAROC", label: 'IMMOBILIER MAROC', country: 'MAROC' },
  { value: "PRIVATE EQUITY MAROC", label: 'PRIVATE EQUITY MAROC', country: 'MAROC' },
  { value: "ALTERNATIF MAROC", label: 'ALTERNATIF MAROC', country: 'MAROC' },
  { value: "AUTRES MAROC", label: 'AUTRES MAROC', country: 'MAROC' },

  { value: "OBLIGATIONS TUNISIE", label: 'OBLIGATIONS TUNISIE', country: 'TUNISIE' },
  { value: "ACTIONS TUNISIE", label: 'ACTIONS TUNISIE', country: 'TUNISIE' },
  { value: "DIVERSIFIE TUNISIE", label: 'DIVERSIFIE TUNISIE', country: 'TUNISIE' },
  { value: "MONETAIRE TUNISIE", label: 'MONETAIRE TUNISIE', country: 'TUNISIE' },
  { value: "ETF TUNISIE", label: 'ETF TUNISIE', country: 'TUNISIE' },
  { value: "INFRASTRUCTURE TUNISIE", label: 'INFRASTRUCTURE TUNISIE', country: 'TUNISIE' },
  { value: "IMMOBILIER TUNISIE", label: 'IMMOBILIER TUNISIE', country: 'TUNISIE' },
  { value: "PRIVATE EQUITY TUNISIE", label: 'PRIVATE EQUITY TUNISIE', country: 'TUNISIE' },
  { value: "ALTERNATIF TUNISIE", label: 'ALTERNATIF TUNISIE', country: 'TUNISIE' },
  { value: "AUTRES TUNISIE", label: 'AUTRES TUNISIE', country: 'TUNISIE' },

  // Ajoutez plus d'options au besoin
];

const optionsCategorieregionale = [
  { value: "OBLIGATIONS AFRIQUE DU NORD", label: 'OBLIGATIONS AFRIQUE DU NORD', country: 'AFRIQUE DU NORD' },
  { value: "ACTIONS AFRIQUE DU NORD", label: 'ACTIONS AFRIQUE DU NORD', country: 'AFRIQUE DU NORD' },
  { value: "DIVERSIFIE AFRIQUE DU NORD", label: 'DIVERSIFIE AFRIQUE DU NORD', country: 'AFRIQUE DU NORD' },
  { value: "MONETAIRE AFRIQUE DU NORD", label: 'MONETAIRE AFRIQUE DU NORD', country: 'AFRIQUE DU NORD' },
  { value: "ETF AFRIQUE DU NORD", label: 'ETF AFRIQUE DU NORD', country: 'AFRIQUE DU NORD' },
  { value: "INFRASTRUCTURE AFRIQUE DU NORD", label: 'INFRASTRUCTURE AFRIQUE DU NORD', country: 'AFRIQUE DU NORD' },
  { value: "IMMOBILIER AFRIQUE DU NORD", label: 'IMMOBILIER AFRIQUE DU NORD', country: 'AFRIQUE DU NORD' },
  { value: "PRIVATE EQUITY AFRIQUE DU NORD", label: 'PRIVATE EQUITY AFRIQUE DU NORD', country: 'AFRIQUE DU NORD' },
  { value: "ALTERNATIF AFRIQUE DU NORD", label: 'ALTERNATIF AFRIQUE DU NORD', country: 'AFRIQUE DU NORD' },
  { value: "AUTRES AFRIQUE DU NORD", label: 'AUTRES AFRIQUE DU NORD', country: 'AFRIQUE DU NORD' },

  { value: "OBLIGATIONS AFRIQUE CENTRALE", label: 'OBLIGATIONS AFRIQUE CENTRALE', country: 'AFRIQUE CENTRALE' },
  { value: "ACTIONS AFRIQUE CENTRALE", label: 'ACTIONS AFRIQUE CENTRALE', country: 'AFRIQUE CENTRALE' },
  { value: "DIVERSIFIE AFRIQUE CENTRALE", label: 'DIVERSIFIE AFRIQUE CENTRALE', country: 'AFRIQUE CENTRALE' },
  { value: "MONETAIRE AFRIQUE CENTRALE", label: 'MONETAIRE AFRIQUE CENTRALE', country: 'AFRIQUE CENTRALE' },
  { value: "ETF AFRIQUE CENTRALE", label: 'ETF AFRIQUE CENTRALE', country: 'AFRIQUE CENTRALE' },
  { value: "INFRASTRUCTURE AFRIQUE CENTRALE", label: 'INFRASTRUCTURE AFRIQUE CENTRALE', country: 'AFRIQUE CENTRALE' },
  { value: "IMMOBILIER AFRIQUE CENTRALE", label: 'IMMOBILIER AFRIQUE CENTRALE', country: 'AFRIQUE CENTRALE' },
  { value: "PRIVATE EQUITY AFRIQUE CENTRALE", label: 'PRIVATE EQUITY AFRIQUE CENTRALE', country: 'AFRIQUE CENTRALE' },
  { value: "ALTERNATIF AFRIQUE CENTRALE", label: 'ALTERNATIF AFRIQUE CENTRALE', country: 'AFRIQUE CENTRALE' },
  { value: "AUTRES AFRIQUE CENTRALE", label: 'AUTRES AFRIQUE CENTRALE', country: 'AFRIQUE CENTRALE' },

  // Ajoutez plus d'options au besoin
];

const optionsSociete = [
  { value: "WINEO GESTION", label: 'WINEO GESTION' },
  { value: "WAFA GESTION", label: 'WAFA GESTION' },
  { value: "TWIN CAPITAL GESTION", label: 'TWIN CAPITAL GESTION' },
  { value: "CFG GESTION", label: 'CFG GESTION' }

  // Ajoutez plus d'options au besoin
];

interface Option {
  value: string;
  label: string;
}
interface FormData {
  societe?: Option;
  categorie?: Option;
}

async function getlastvl1() {
  const data = (
    await fetch(`${urlconstant}/api/searchFunds`)
  ).json();
  return data;
}
export default function Comparaison() {
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
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [selectedOptions1, setSelectedOptions1] = useState<SingleValue<Option> | null>(null);
  const [selectedOptions2, setSelectedOptions2] = useState<SingleValue<Option> | null>(null);
  const [selectedOptions3, setSelectedOptions3] = useState<SingleValue<Option> | null>(null);

  const [selectedRows, setSelectedRows] = useState<string[]>([]); // Tableau pour stocker les lignes sélectionnées
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [sortedFunds, setSortedFunds] = useState<Funds | null>(null); // État pour les fonds triés
  const [searchResults, setSearchResults] = useState([]); // État pour stocker les résultats de la recherche
  const [error, setError] = useState(""); // État pour stocker le message d'erreur
  const [optionsSociete, setOptionsSociete] = useState([]);
  const [selectedSociete, setSelectedSociete] = useState<Societe | null>(null);


  const [textInput, setTextInput] = useState('');
  const [fundsOptions, setFundsOptions] = useState([]);
  const [funds, setFunds] = useState<Funds | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleClosePopup = () => setShowPopup(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    setFunds({ data: { funds: [] } });
    const formData: FormData = {}; // Initialisation de l'objet formData
    let selectedcategorie, selectedeSociete;
    // Ajouter les valeurs des critères "Sharpe" à l'objet formData
    if (selectedOptions1) {


      selectedcategorie = selectedOptions1.value;
    }
    if (selectedSociete) {
      selectedeSociete = selectedSociete?.value;


    }
    const selectedcategorienationale = selectedOptions3?.value;
    const selectedcategorieregionale = selectedOptions2?.value;
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
    console.log('Texte saisi :', textInput);
    const selectedValues = selectedOptions.map(option => option?.value);
    fetch(`${urlconstant}/api/recherchefonds?query=${selectedValues.join(',')}&selectedcategorie=${selectedcategorie}&selectedsociete=${selectedeSociete}&selectedcategorienationale=${selectedcategorienationale}&selectedcategorieregionale=${selectedcategorieregionale}`, {
      method: 'POST', // Assurez-vous que la méthode HTTP correspond à votre API
      headers: {
        'Content-Type': 'application/json', // Spécifiez le type de contenu JSON
      },
      body: JSON.stringify({ formData }), // Convertissez formData en format JSON
    })
      .then(response => response.json())
      .then(data => {
        if (data && data.code === 200 && data.data.funds.length > 0) {
          Swal.close(); // Close the loading popup

          setFunds(data);
          totalItems = data.data.funds.length || 0;
          settotalPages(Math.ceil(totalItems / itemsPerPage));

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
  const [post, setPost] = useState(null);
  const [userConnected, setUserConnected] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
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

  }, []);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, settotalPages] = useState(1);

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
  useEffect(() => {


    console.log("Position de la nav : ", activeTab);

    // Appel à l'API lors du premier rendu du composant
    async function fetchData() {
      try {
        /* const data = await getlastvl();
         setPost(data);*/

        const data1 = await getlastvl1();

        const mappedOptions = data1?.data.funds.map((funds: any) => ({

          value: funds.value,
          label: funds.label, // Replace with the actual property name
          // Replace with the actual property name
        }));
        setFundsOptions(mappedOptions);
        console.log(mappedOptions);

        console.log(fundsOptions);
        const data2 = await getsociete();
        const mappedOptions2 = data2?.data.societes.map((funds: any) => ({

          value: funds.name,
          label: funds.name, // Replace with the actual property name
          // Replace with the actual property name
        }));
        setOptionsSociete(mappedOptions2);
      } catch (error) {
        console.error("Erreur lors de l'appel à l'API :", error);
      }
    }
    fetchData();
  }, [activeTab]);

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

  const getSortClasses = (key: string) => {
    if (sortConfig.key === key) {
      return `text-right ${sortConfig.direction === 'asc' ? 'asc-icon' : 'desc-icon'}`;
    }
    return 'text-right';
  };
  var totalItems: any;
  const handleSort = (key: string) => {
    setCurrentPage(1);
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
        console.log("filteredFunds")

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
          console.log("filteredFunds")

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

  /*const getSortClasses = (key: string) => {
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
  setSortConfig({ key, direction });

  if (funds && funds.data.funds) {
    // Create a sorted copy of the funds using the sort() method
    const sortedFundsCopy = [...funds.data.funds];
    sortedFundsCopy.sort((a, b) => {
      const aValue = getValue(a, key); // Get the value based on the provided key
      const bValue = getValue(b, key);
      if (aValue < bValue) {
        return direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    // Update sortedFunds with the sorted version
    setSortedFunds({ data: { funds: sortedFundsCopy } });
    setFunds({ data: { funds: sortedFundsCopy } });
  }
};

// Helper function to get values from the funds based on the given key
const getValue = (fund, key) => {
  // Assuming your data structure allows nested keys like "firstData.data.key"
  const keys = key.split('.');
  let value = fund;
  for (const nestedKey of keys) {
    value = value ? value[nestedKey] : undefined;
  }
  return value;
};*/
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
  return (



    < Fragment >
      <Header />
      <br />

    
      <div className="">
        <Modal show={showPopup} onHide={handleClosePopup} centered>
          <Modal.Header closeButton>
            <Modal.Title>Action</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Pour sélectionner 100 éléments par page, vous devez être membre.
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

              <div className="col-12">
                <div className="box ">
                  <div className="box-body">
                    <div className="d-md-flex justify-content-between align-items-center">
                      <div>
                        <p><span className="text-primary">Recherche</span> | <span className="text-fade"></span></p>

                      </div>

                    </div>
                    <hr />


                    <div className="row">




                      <form onSubmit={handleFormSubmit}>
                        <div>
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
                        <div className="row ">
                          <div className="col-md-6">
                            <label htmlFor="select">Categorie Regionale  :</label>
                            <Select className="select-component"
                              id="select"
                              options={optionsCategorieregionale}

                              isSearchable
                              value={selectedOptions2}
                              onChange={(newValue, actionMeta) => setSelectedOptions2(newValue)}
                            />
                          </div>
                          <div className="col-md-6">
                            <label htmlFor="select">Categorie nationale :</label>
                            <Select className="select-component"
                              id="select"
                              options={optionsCategorienationale}

                              isSearchable
                              value={selectedOptions3}
                              onChange={(newValue, actionMeta) => setSelectedOptions3(newValue)}
                            />
                          </div>
                        </div>
                        <div className="row ">
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
                          <div className="col-md-6">
                            <label htmlFor="select">Societés de gestion :</label>
                            <Select className="select-component"

                              options={optionsSociete}
                              value={selectedSociete}
                              onChange={setSelectedSociete}
                              placeholder="Sélectionnez une Societe"
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
                                    <th className="text-center" key={header.key} onClick={() => handleSort(header.key)} style={{ height: '35px'}}>
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
                                    <th className="text-center" key={header.key} onClick={() => handleSort(header.key)} style={{ height: '35px' }}>
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
                                    <th className="text-center" key={header.key} onClick={() => handleSort(header.key)} style={{ height: '35px' }}>
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
                                    <th className="text-center" key={header.key} onClick={() => handleSort(header.key)} style={{ height: '35px' }}>
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
                                      <th className="text-center" key={header.key} onClick={() => handleSort(header.key)} style={{ height: '35px' }}>
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
                                        <th className="text-center" key={header.key} onClick={() => handleSort(header.key)} style={{ height: '35px' }}>
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
                                          <th className="text-center" key={header.key} onClick={() => handleSort(header.key)} style={{ height: '35px' }}>
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
                                            <th className="text-center" key={header.key} onClick={() => handleSort(header.key)} style={{ height: '35px' }}>
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
                                            <td className="text-center"><Link href={`/Fundmanager/${item.fundData?.societe_gestion.replace(/ /g, '-')}`}>{item.fundData?.societe_gestion}</Link></td>
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
                                    width: '150px',

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
                                    width: '150px',

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
                          <div className="row justify-content-center">
                            <div className="col-12 text-center">
                              {funds && funds.data && funds.data.funds && funds.data.funds.length > 0 && (
                                <p>Nombre d'éléments dans la liste : {funds.data.funds.length}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <br />
                        <br />
                        {selectedRows.length > 0 && (
                          <div className="text-left">
                            <Link
                              href={{
                                pathname: '/Outils/comparaison/comparaisonview',
                                query: { selectedRows: selectedRows.join(',') }, // Passer les éléments sélectionnés comme paramètres de requête
                              }}
                              /*  as={`/about/${selectedRows ? selectedRows.join(',') : ''}`}
                                key={selectedRows.join(',')}*/
                              style={{
                                width: '150px',
                                textDecoration: 'none',
                                backgroundColor: '#6366f1',
                                color: 'white',
                                padding: '10px 20px',
                                borderRadius: '5px',
                              }}
                            >
                              &nbsp;&nbsp;&nbsp;    Comparaison &nbsp;&nbsp;&nbsp;
                            </Link>
                          </div>
                        )}
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


/*
function exportTableToCSV() {
  // Sélectionnez le tableau HTML par son ID
  var table = document.getElementById("example");

  // Créez une chaîne vide pour stocker les données CSV
  var csv = [];

  // Parcourez les lignes du tableau
  for (var i = 0; i < table?.rows.length; i++) {
    var row = [];
    var cells = table?.rows[i].querySelectorAll("td, th");

    // Parcourez les cellules de chaque ligne
    for (var j = 0; j < cells.length; j++) {
      row.push(cells[j].textContent);
    }

    // Joignez les valeurs de la ligne avec des virgules pour créer une ligne CSV
    csv.push(row.join(","));
  }

  // Joignez les lignes CSV avec des sauts de ligne
  var csvString = csv.join("\n");

  // Créez un objet Blob pour le fichier CSV
  var blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });

  // Générez un URL pour le Blob
  var url = URL.createObjectURL(blob);

  // Créez un élément d'ancrage pour le téléchargement du fichier
  var link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "tableau.csv");

  // Cliquez sur le lien pour déclencher le téléchargement
  link.click();
}*/
/*
function exportTableToXLSX() {
  // Sélectionnez le tableau HTML par son ID
  var table = document.getElementById("example");

  // Créez un objet Workbook
  var wb = XLSX.utils.table_to_book(table);

  // Générez un blob à partir du Workbook
  const blob = XLSX.write(wb, { bookType: 'xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', type: 'blob' });

  // Créez un URL pour le Blob
  var url = URL.createObjectURL(blob);

  // Créez un élément d'ancrage pour le téléchargement du fichier
  var link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "tableau.xlsx");

  // Cliquez sur le lien pour déclencher le téléchargement
  link.click();
}
*/