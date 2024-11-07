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
import Swal from 'sweetalert2';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFileDownload, faPhoneAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';
/**
 * Fonction asynchrone pour obtenir les détails d'un fond.
 * @async
 * @function getclassement
 * @param {number} id - L'identifiant du fond.
 * @returns {Promise} - Les données du classement du fond.
 */
async function getclassement(id: number) {
  const data = (
    await fetch(`${urlconstant}/api/classementquartilemysql/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', // Indiquer que vous envoyez du JSON
      },
    })
  ).json();
  return data;
}
async function getdateavailable(fondId: any) {
  const data = (
    await fetch(`${urlconstant}/api/getdateavailable/${fondId}`)
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
        perf6Mois: any;
        perf3Mois: any;
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
    philosophie_fond: any;
    strategie_politique_invest: any;
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
interface PerformancesState {
  monthlyPerformance: { [key: string]: number };
  annualPerformance: { [key: string]: number };
}
type Documents = Document[];
/**
 * Composant principal représentant la page d'un fond.
 * @function Fond
 * @param {PageProps} props - Propriétés de la page.
 */
export default function Fond(props: PageProps) {
  const router = useRouter();
  const [performances, setPerformances] = useState<PerformancesState>({
    monthlyPerformance: {},
    annualPerformance: {}
  });
  const [performancesindices, setPerformancesindices] = useState<PerformancesState>({
    monthlyPerformance: {},
    annualPerformance: {}
  });

  const id = props.params.fondId;
  const [activeIndex, setActiveIndex] = useState(0); // Initialisation avec 0
  const [filteredDocument, setFilteredDocument] = useState<Document[] | null>(null);
  const [documents, setDocuments] = useState<Documents | null>(null);
  var options: any;

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
  const [selectedPeriod, setSelectedPeriod] = useState('1 year'); // Initialize with the default selected period
  const [filteredData, setFilteredData] = useState<Option[]>([]);
  const handleSearch = (e: any) => {
    e.preventDefault();
    // Effectuez votre recherche ici si nécessaire
  };
  useEffect(() => {
    async function fetchData() {
      try {
        const url = `${urlconstant}/api/performancemonthyear/fond/${id}`;
        const response = await fetch(url);
        const data = await response.json(); // Extrayez les données JSON de la réponse
        setPerformances(data); // Mettez à jour l'état avec les données extraites
        console.log(data)
        const url1 = `${urlconstant}/api/performanceindicemonthyear/fond/${id}`;
        const response1 = await fetch(url1);
        const data1 = await response1.json(); // Extrayez les données JSON de la réponse
        setPerformancesindices(data1); // Mettez à jour l'état avec les données extraites
        console.log(data1)

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getPost(id);
        setPost(data);
        const data1 = await getlastvl1();

        const mappedOptions = data1?.data?.funds.map((funds: any) => ({
          value: funds.value,
          label: funds.label
        }));

        setFundsOptions(mappedOptions); // Mettre à jour l'état avec les données récupérées
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    }
    fetchData(); // Appel à fetchData() lors du premier rendu
  }, []);
  const [base100Data, setBase100Data] = useState<MyDataType[]>([]); // Nouvel état pour les données en base 100
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

    try {
      const selectedValue = e.target.value;
      setSelectedDevise(selectedValue);

      const url = `${urlconstant}/api/performancemonthyear/fond/${id}?query=${selectedValue}`;
      const response = await fetch(url);
      const data = await response.json(); // Extrayez les données JSON de la réponse
      setPerformances(data); // Mettez à jour l'état avec les données extraites
      console.log(data)
      const url1 = `${urlconstant}/api/performanceindicemonthyear/fond/${id}?query=${selectedValue}`;
      const response1 = await fetch(url1);
      const data1 = await response1.json(); // Extrayez les données JSON de la réponse
      setPerformancesindices(data1); // Mettez à jour l'état avec les données extraites

      let url5;
      if (e.target.value == "EUR" || e.target.value == "USD") {
        url5 = `${urlconstant}/api/valLiqdev/${id}/${selectedValue}`;
      } else {
        url5 = `${urlconstant}/api/valLiq/${id}`;

      }
      const response5 = await fetch(url5);
      const data5 = await response5.json(); // Extrayez les données JSON de la réponse
      console.log(data5);
      setPost(data5); // Mettez à jour l'état avec les données extraites
      const datasgraph = data5?.data?.graphs.map((item: { dates: any; values: any; valuesInd: any; }) => ({
        name: item.dates,
        y: item.values,
        InRef: item.valuesInd
      }));
      console.log(datasgraph)
      const currentDate = new Date(); // Date actuelle
      let filteredData = [];
      const lastDate = new Date(Math.max(...datasgraph.map((item: { name: string | number | Date }) => new Date(item.name))));

      if (selectedPeriod === '1 year') {
        // Filtrer les données pour 1 an

        filteredData = datasgraph.filter((item: { name: string | number | Date; }) => {
          const itemDate = new Date(item.name); // Convertir la date de l'élément en objet Date
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(lastDate.getFullYear() - 1); // Date il y a 1 an
          return itemDate >= oneYearAgo && itemDate <= currentDate; // Sélectionner les dates dans la période d'1 an
        });
        console.log('filteredData');
        console.log(filteredData);

        // Calculer les données en base 100
        if (filteredData.length > 0) {
          console.log('filteredData[0]');

          console.log(filteredData[0]);
          const lastValue = filteredData[0].y; // Dernière valeur
          const lastValueInd = filteredData[0].InRef; // Dernière valeur

          console.log(filteredData[0]);
          const base100Data = filteredData.map((item: { name: any; y: number; InRef: number; }) => ({
            name: item.name,
            y: (item.y / lastValue) * 100, // Calcul en base 100
            InRef: (item.InRef / lastValueInd) * 100, // Calcul en base 100 pour InRef si nécessaire
          }));
          console.log(base100Data)

          setBase100Data(base100Data); // Mettre à jour l'état avec les données en base 100
        }
      } else if (selectedPeriod === '3 years') {
        // Filtrer les données pour 3 ans
        filteredData = datasgraph.filter((item: { name: string | number | Date; }) => {
          const itemDate = new Date(item.name);
          const threeYearsAgo = new Date();
          threeYearsAgo.setFullYear(lastDate.getFullYear() - 3); // Date il y a 3 ans
          return itemDate >= threeYearsAgo && itemDate <= currentDate;
        });
        // Calculer les données en base 100
        if (filteredData.length > 0) {
          const lastValue = filteredData[0].y; // Dernière valeur
          const lastValueInd = filteredData[0].InRef; // Dernière valeur

          console.log(filteredData[0]);
          const base100Data = filteredData.map((item: { name: any; y: number; InRef: number; }) => ({
            name: item.name,
            y: (item.y / lastValue) * 100, // Calcul en base 100
            InRef: (item.InRef / lastValueInd) * 100, // Calcul en base 100 pour InRef si nécessaire
          }));

          setBase100Data(base100Data); // Mettre à jour l'état avec les données en base 100
        }
      } else if (selectedPeriod === '5 years') {
        // Filtrer les données pour 5 ans
        filteredData = datasgraph.filter((item: { name: string | number | Date; }) => {
          const itemDate = new Date(item.name);
          const fiveYearsAgo = new Date();
          fiveYearsAgo.setFullYear(lastDate.getFullYear() - 5); // Date il y a 5 ans
          return itemDate >= fiveYearsAgo && itemDate <= currentDate;
        });
        // Calculer les données en base 100
        if (filteredData.length > 0) {
          const lastValue = filteredData[0].y; // Dernière valeur
          const lastValueInd = filteredData[0].InRef; // Dernière valeur

          console.log(filteredData[0]);
          const base100Data = filteredData.map((item: { name: any; y: number; InRef: number; }) => ({
            name: item.name,
            y: (item.y / lastValue) * 100, // Calcul en base 100
            InRef: (item.InRef / lastValueInd) * 100, // Calcul en base 100 pour InRef si nécessaire
          }));

          setBase100Data(base100Data); // Mettre à jour l'état avec les données en base 100
        }
      }
      setFilteredData(filteredData);


    } catch (error) {
      console.error('An error occurred:', error);
      Swal.fire({
        title: 'Erreur',
        text: 'Une erreur s\'est produite lors du chargement des résultats. Veuillez réessayer.',
        icon: 'error'
      });
    } finally {
      Swal.close(); // Close the loading popup in both success and error cases
    }
  };
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
        const data = await getPost(id);
        setPost(data);


        const data10 = await getfavoris(id)
        console.log("data10")

        console.log(data10)

        console.log("data")

        console.log(data)
        if (data10.success == true) {
          setIsFavorite(true)
        }
        const data1 = await getlastvl1();
        console.log("data1")

        console.log(data1)
        const mappedOptions = data1?.data?.funds.map((funds: any) => ({

          value: funds.value,
          label: funds.label, // Replace with the actual property name
          // Replace with the actual property name
        }));
        const datasgraph = data?.data?.graphs.map((item: { dates: any; values: any; valuesInd: any; }) => ({
          name: item.dates,
          y: item.values,
          InRef: item.valuesInd
        }));
        console.log(datasgraph)
        setFundsOptions(mappedOptions);
        const currentDate = new Date(); // Date actuelle
        let filteredData = [];
        const lastDate = new Date(Math.max(...datasgraph.map((item: { name: string | number | Date }) => new Date(item.name))));

        if (selectedPeriod === '1 year') {
          // Filtrer les données pour 1 an

          filteredData = datasgraph.filter((item: { name: string | number | Date; }) => {
            const itemDate = new Date(item.name); // Convertir la date de l'élément en objet Date
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(lastDate.getFullYear() - 1); // Date il y a 1 an
            return itemDate >= oneYearAgo && itemDate <= currentDate; // Sélectionner les dates dans la période d'1 an
          });
          console.log('filteredData');
          console.log(filteredData);

          // Calculer les données en base 100
          if (filteredData.length > 0) {
            console.log('filteredData[0]');

            console.log(filteredData[0]);
            const lastValue = filteredData[0].y; // Dernière valeur
            const lastValueInd = filteredData[0].InRef; // Dernière valeur

            console.log(filteredData[0]);
            const base100Data = filteredData.map((item: { name: any; y: number; InRef: number; }) => ({
              name: item.name,
              y: (item.y / lastValue) * 100, // Calcul en base 100
              InRef: (item.InRef / lastValueInd) * 100, // Calcul en base 100 pour InRef si nécessaire
            }));
            console.log(base100Data)

            setBase100Data(base100Data); // Mettre à jour l'état avec les données en base 100
          }
        } else if (selectedPeriod === '3 years') {
          // Filtrer les données pour 3 ans
          filteredData = datasgraph.filter((item: { name: string | number | Date; }) => {
            const itemDate = new Date(item.name);
            const threeYearsAgo = new Date();
            threeYearsAgo.setFullYear(lastDate.getFullYear() - 3); // Date il y a 3 ans
            return itemDate >= threeYearsAgo && itemDate <= currentDate;
          });
          // Calculer les données en base 100
          if (filteredData.length > 0) {
            const lastValue = filteredData[0].y; // Dernière valeur
            const lastValueInd = filteredData[0].InRef; // Dernière valeur

            console.log(filteredData[0]);
            const base100Data = filteredData.map((item: { name: any; y: number; InRef: number; }) => ({
              name: item.name,
              y: (item.y / lastValue) * 100, // Calcul en base 100
              InRef: (item.InRef / lastValueInd) * 100, // Calcul en base 100 pour InRef si nécessaire
            }));

            setBase100Data(base100Data); // Mettre à jour l'état avec les données en base 100
          }
        } else if (selectedPeriod === '5 years') {
          // Filtrer les données pour 5 ans
          filteredData = datasgraph.filter((item: { name: string | number | Date; }) => {
            const itemDate = new Date(item.name);
            const fiveYearsAgo = new Date();
            fiveYearsAgo.setFullYear(lastDate.getFullYear() - 5); // Date il y a 5 ans
            return itemDate >= fiveYearsAgo && itemDate <= currentDate;
          });
          // Calculer les données en base 100
          if (filteredData.length > 0) {
            const lastValue = filteredData[0].y; // Dernière valeur
            const lastValueInd = filteredData[0].InRef; // Dernière valeur

            console.log(filteredData[0]);
            const base100Data = filteredData.map((item: { name: any; y: number; InRef: number; }) => ({
              name: item.name,
              y: (item.y / lastValue) * 100, // Calcul en base 100
              InRef: (item.InRef / lastValueInd) * 100, // Calcul en base 100 pour InRef si nécessaire
            }));

            setBase100Data(base100Data); // Mettre à jour l'état avec les données en base 100
          }
        }
        setFilteredData(filteredData);

        Swal.close(); // Close the loading popup

      } catch (error) {
        Swal.close(); // Close the loading popup

        console.error("Erreur lors de l'appel à l'API :", error);
      }
    }
    fetchData();



  }, [selectedPeriod, id]);

  let xAxisCategories: any;
  let xAxisType = 'category';

  if (selectedPeriod === '1 year') {
    xAxisCategories = base100Data.map(item => new Date(item.name).toLocaleString('default', { month: 'short' }));
  } else if (selectedPeriod === '3 years' || selectedPeriod === '5 years') {
    xAxisCategories = base100Data.map(item => {
      const date = new Date(item.name);
      const options = { month: 'long', year: 'numeric' } as Intl.DateTimeFormatOptions;
      const formattedDate = date.toLocaleDateString(undefined, options);
      return formattedDate;
    });
  }

  options = {
    chart: {
      type: 'spline',
    },
    title: {
      text: 'Courbe de tous les fonds',
    },
    xAxis: {
      type: xAxisType,
      categories: xAxisCategories,
    },
    series: [
      {
        name: post?.data?.fundname,
        data: base100Data.map(item => item.y),
      },
      {
        name: post?.data?.libelle_indice,
        data: base100Data.map(item => item.InRef),
      },
    ],
  };
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


  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];


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
                            backgroundColor: '#6366f1', // Background color
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
                              backgroundColor: 'grey', // Background color
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
                      <p><span className="text-primary">Historique du fond</span> | <span className="text-fade"></span></p>
                      <div className="col-12">
                        <div className="box">


                          <div className="container">
                            <div className="text-center">
                              <div className="col-md-6 mx-auto">
                                <label>Devise:</label>
                                <select className="form-control" onChange={handleDeviseChange} value={selectedDevise} >
                                  <option value="">Devise Locale</option>
                                  <option value="EUR">EUR</option>
                                  <option value="USD">USD</option>
                                </select>
                              </div>
                            </div>
                            <br />
                            {post && (
                              <div>
                                <div className="card mb-3">
                                  <div className="card-body">
                                    <h2 className="card-title">Type d investissement</h2>
                                    <textarea
                                      value={post.data.type_investissement || 'N/A'}
                                      readOnly
                                      className="form-control border-0"
                                      style={{ height: 'auto', minHeight: '50px' }} // Hauteur initiale et minimale
                                    />
                                  </div>
                                </div>
                                <div className="card mb-3">
                                  <div className="card-body">
                                    <h2 className="card-title">Philosophie du fond</h2>
                                    <textarea
                                      value={post.data.philosophie_fond || 'N/A'}
                                      readOnly
                                      className="form-control border-0"
                                      style={{ height: 'auto', minHeight: '50px' }} // Hauteur initiale et minimale
                                    />
                                  </div>
                                </div>
                                <div className="card mb-3">
                                  <div className="card-body">
                                    <h2 className="card-title">Stratégie politique d investissement</h2>
                                    <textarea
                                      value={post.data.strategie_politique_invest || 'N/A'}
                                      readOnly
                                      className="form-control border-0"
                                      style={{ height: 'auto', minHeight: '50px' }} // Hauteur initiale et minimale
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                            <div className="row">
                              <div className="col-md-12">
                                <div className="card">
                                  <div className="card-body">
                                    <div className="d-md-flex justify-content-between align-items-center">
                                      <div className="row">
                                        <p><span className="text-primary">Historique </span> | <span className="text-fade"> </span></p>

                                      </div>

                                    </div>
                                    <hr />
                                    <div className="box-header px-0">
                                      <h5>Historique base 100 du {filteredData[0]?.name} au {filteredData[filteredData.length - 1]?.name}</h5>
                                      <div className="box-controls ">
                                        <ul className="nav nav-pills nav-pills-sm" role="tablist">
                                          <li className="nav-item">
                                            <Link
                                              className={`nav-link py-2 px-4 b-0 ${selectedPeriod === '1 year' ? 'active' : ''}`}
                                              onClick={() => setSelectedPeriod('1 year')} href="javascript:void(0)"
                                            >
                                              <span className="nav-text base-font">1 an</span>
                                            </Link>
                                          </li>
                                          <li className="nav-item">
                                            <Link
                                              className={`nav-link py-2 px-4 b-0 ${selectedPeriod === '3 years' ? 'active' : ''}`}
                                              onClick={() => setSelectedPeriod('3 years')} href="javascript:void(0)"
                                            >
                                              <span className="nav-text base-font">3 ans</span>
                                            </Link>
                                          </li>
                                          <li className="nav-item">
                                            <Link
                                              className={`nav-link py-2 px-4 b-0 ${selectedPeriod === '5 years' ? 'active' : ''}`}
                                              onClick={() => setSelectedPeriod('5 years')} href="javascript:void(0)"
                                            >
                                              <span className="nav-text base-font">5 ans</span>
                                            </Link>
                                          </li>
                                        </ul>
                                      </div>
                                      <br></br>


                                    </div>
                                    <div >
                                      <HighchartsReact
                                        highcharts={Highcharts}
                                        options={options}
                                      />
                                      <br />
                                      <br />
                                    </div>
                                  </div>
                                </div>

                              </div>

                            </div>
                            <div className="row">
                              <div className="col-md-12">
                                <div className="card">
                                  <div className="card-body">
                                    <div className="d-md-flex justify-content-between align-items-center">
                                      <div className="row">
                                        <p><span className="text-primary">Historique des performances </span> | <span className="text-fade"> </span></p>

                                      </div>


                                    </div>
                                    <hr />
                                    <div className="table-responsive">
                                      <table
                                        id="tabPerfGlissante"
                                        className="table text-fade table-bordered table-hover display nowrap margin-top-10 w-p100"
                                      >
                                        <thead className="table-header">
                                          <tr className="text-right">
                                            <th className="text-right">Année</th>
                                            {months.map((month, index) => (
                                              <th key={index} className="text-right">
                                                {month}
                                              </th>
                                            ))}
                                            <th className="text-right">OPC</th>
                                            <th className="text-right">Ind</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {Object.entries(performances.annualPerformance)
                                            .sort(([year1], [year2]) => parseInt(year2) - parseInt(year1)) // Tri des années dans l'ordre décroissant
                                            .map(([year, performance]) => {
                                              let sumMonthlyPerformance = 0; // Initialisation de la somme des performances mensuelles

                                              return (
                                                <tr key={year}>
                                                  <td className="text-left">{year}</td>
                                                  {months.map((_, monthIndex) => {
                                                    const monthKey = `${year}-${monthIndex + 1 < 10 ? '0' : ''}${monthIndex + 1}`;
                                                    const monthlyPerformance = performances.monthlyPerformance[monthKey];
                                                    sumMonthlyPerformance += typeof monthlyPerformance === 'number' ? monthlyPerformance : 0; // Ajout de la performance mensuelle à la somme
                                                    return (
                                                      <td key={monthIndex} className={`text-right ${monthlyPerformance && monthlyPerformance < 0 ? 'text-danger' : 'text-success'}`}>
                                                        {typeof monthlyPerformance === 'number' ? monthlyPerformance.toFixed(2) + '%' : '-'}
                                                      </td>
                                                    );
                                                  })}
                                                  {/*<td className="text-right">{sumMonthlyPerformance.toFixed(2) + '%'}</td> Affichage de la somme des performances mensuelles */}
                                                  <td className={`text-right ${performance && performance < 0 ? 'text-danger' : 'text-success'}`}>
                                                    {performance ?
                                                      (typeof performance === 'number' ? performance.toFixed(2) + '%' : '-')
                                                      : '-'}
                                                  </td> {/* Affichage de la performance annuelle */}
                                                  <td className={`text-right ${performancesindices && performancesindices.annualPerformance && performancesindices.annualPerformance[year] < 0 ? 'text-danger' : 'text-success'}`}>
                                                    {performancesindices && performancesindices.annualPerformance && performancesindices.annualPerformance[year] ?
                                                      (typeof performancesindices.annualPerformance[year] === 'number' ? performancesindices.annualPerformance[year].toFixed(2) + '%' : '-')
                                                      : '-'}
                                                  </td>
                                                </tr>
                                              );
                                            })}
                                        </tbody>
                                      </table>


                                    </div>
                                  </div>

                                </div>
                              </div>

                            </div>
                          </div>
                        </div>


                      </div>


                    </div>

                  </div>
                </div>


              </div >

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
