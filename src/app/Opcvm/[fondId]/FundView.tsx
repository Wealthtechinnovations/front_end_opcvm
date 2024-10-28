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
import ExportModal from './exportmodal';
import { Modal, Button } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Head from 'next/head';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import Swal from 'sweetalert2';


// Fonction pour déterminer la classe SRRI
// Fonction pour déterminer l'index SRRI basé sur la volatilité
const determineClasseSRRI = (volatilite: number) => {
    // Retourne l'index basé sur la volatilité
    if (volatilite < 0.5) {
        return 1; // Indice 1
    } else if (volatilite >= 0.5 && volatilite < 2) {
        return 2; // Indice 2
    } else if (volatilite >= 2 && volatilite < 5) {
        return 3; // Indice 3
    } else if (volatilite >= 5 && volatilite < 10) {
        return 4; // Indice 4
    } else if (volatilite >= 10 && volatilite < 15) {
        return 5; // Indice 5
    } else if (volatilite >= 15 && volatilite < 25) {
        return 6; // Indice 6
    } else if (volatilite >= 25) {
        return 7; // Indice 7
    }
    return 1; // Valeur par défaut
};
/**
 * Fonction asynchrone pour obtenir les détails d'un fond.
 * @async
 * @function getclassement
 * @param {number} id - L'identifiant du fond.
 * @returns {Promise} - Les données du classement du fond.
 */




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
// ... code existant ...
async function getdateavailable(fondId: any) {
    try {
        const response = await fetch(`${urlconstant}/api/getdateavailable/${fondId}`);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des dates disponibles');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des données de classement:', error);
        // Affichez un message d'erreur à l'utilisateur si nécessaire
    }
}
// ... code existant ...
async function getfavoris(id: number) {
    try {
        const response = await fetch(`${urlconstant}/api/favoritesdata/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des favoris');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des données de classement:', error);
        // Affichez un message d'erreur à l'utilisateur si nécessaire
    }
}
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
async function getperfcategorieannuel(id: number) {
    const data = (
        await fetch(`${urlconstant}/api/performancescategorie/fond/${id}`)
    ).json();
    return data;
}

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
        multipliedValues: any;
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
                omega: any;
                dsr: any;
            };

        };
        performances: {
            data: {
                perfVeille: any;
                perf3Moisactif_net: any;
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
        indice_benchmark: any;
        lastDate: any;
        lastValue: any;
        societesiteweb: any;
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
        meilleursFonds: any;

    };
}

interface Classement {
    data: {
        classementType1: {
            rank3Mois: any;
            rank3Moistotal: any;
            // ranktotal: any;
            rank6Mois: any;
            rank6Moistotal: any;
            rank1erJanvier: any;
            rank1erJanviertotal: any;
            rank1An: any;
            rank1Antotal: any;
            rank3Ans: any;
            rank3Anstotal: any;
            rank5Ans: any;
            rank5Anstotal: any;

            rank3Moism: any;
            rank3Moistotalm: any;
            // ranktotal: any;
            rank6Moism: any;
            rank6Moistotalm: any;
            rank1erJanvierm: any;
            rank1erJanviertotalm: any;
            rank1Anm: any;
            rank1Antotalm: any;
            rank3Ansm: any;
            rank3Anstotalm: any;
            rank5Ansm: any;
            rank5Anstotalm: any;

            rankvolatilite: any;
            rankpertemax: any;
            rankinfo: any;
            rankdsr: any;
            rankomega: any;
            ranksharpe: any;
            rankcalamar: any;
            rankvar95: any;
            rankbetabaissier: any;
            ranksortino: any;

            rankvolatilitetotal: any;
            rankpertemaxtotal: any;
            rankinfototal: any;
            rankdsrtotal: any;
            rankomegatotal: any;
            ranksharpetotal: any;
            rankcalamartotal: any;
            rankvar95total: any;
            rankbetabaissiertotal: any;
            ranksortinototal: any;




        };
        classementType2: {
            rank3Mois: any;
            rank3Moistotal: any;
            // ranktotal: any;
            rank6Mois: any;
            rank6Moistotal: any;
            rank1erJanvier: any;
            rank1erJanviertotal: any;
            rank1An: any;
            rank1Antotal: any;
            rank3Ans: any;
            rank3Anstotal: any;
            rank5Ans: any;
            rank5Anstotal: any;



        }
    }
};


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




/**
 * Composant principal représentant la page d'un fond.
 * @function Fond
 * @param {PageProps} props - Propriétés de la page.
 */

export default function Fond(props: PageProps) {
    const router = useRouter();

    const id = props.params.fondId;
    const randomPercentage: string = ((Math.random() * 200) - 100).toFixed(2);

    const randomPercentage1 = ((Math.random() * 200) - 100).toFixed(2);
    const randomPercentage2 = ((Math.random() * 200) - 100).toFixed(2);
    const [showDescription, setShowDescription] = useState(false);
    const handleMouseEnter = () => {
        console.log("open")
        setShowDescription(true);
    };

    const handleMouseLeave = () => {
        console.log("close")

        setShowDescription(false);
    };

    const [selectedPeriod, setSelectedPeriod] = useState('1 year'); // Initialize with the default selected period
    const [filteredData, setFilteredData] = useState<Option[]>([]);
    const [post, setPost] = useState<Funds | null>(null);
    const [classementlocal, setClassementlocal] = useState<Classement | null>(null);
    const [selectedFund, setSelectedFund] = useState<Option1>();
    const [fundsOptions, setFundsOptions] = useState([]);
    const [base100Data, setBase100Data] = useState<MyDataType[]>([]); // Nouvel état pour les données en base 100
    const [rating, setRating] = useState(2);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userConnected, setUserConnected] = useState<number | null>(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const data3 = await getperfcategorieannuel(id);
                setPostc(data3);
                console.log("data3.data.multipliedValues[2][2]")

                console.log(data3.data.multipliedValues[2][1])
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

    const [selectedDocument, setSelectedDocument] = useState(null);

    const handleDocumentSelect = (document: any) => {
        setSelectedDocument(document);
    };

    const handleDownload = () => {
        // Ici, vous pouvez implémenter la logique de téléchargement
        // en fonction du document sélectionné
        if (selectedDocument) {
            window.location.href = `/telecharger/${selectedDocument}`;
        }
    };
    const [show, setShow] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [showPopup1, setShowPopup1] = useState(false);
    const handleClosePopup = () => setShowPopup(false);
    const [postc, setPostc] = useState<Funds | null>(null);

    const handleClosePopup1 = () => setShowPopup1(false);

    const handleExport = () => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const differenceInTime = end.getTime() - start.getTime();
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);
        if (differenceInDays > 365) {
            setShowWarningModal(true);
        } else {
            // Call API with startDate and endDate
            handleClose();
        }
    };
    const handleClose = () => setShow(false);

    const handleCloseWarningModal = () => setShowWarningModal(false);
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
                const data3 = await getdateavailable(id);
                setAvailableDates(data3.data);

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
                const hasSameHistory = (data: any) => {
                    // Vérifiez si l'indice de référence (InRef) a les mêmes dates que les données du fonds
                    return data.every((item: any) => item.InRef !== undefined); // Vérifie si toutes les valeurs ont un InRef défini
                };

                if (selectedPeriod === 'all') {
                    filteredData = datasgraph

                    if (filteredData.length > 0) {
                        const lastValue = filteredData[0].y; // Dernière valeur du fonds
                        const lastValueInd = hasSameHistory(filteredData) ? filteredData[0].InRef : undefined; // Vérification de l'historique

                        const base100Data = filteredData.map((item: { name: any; y: number; InRef: number; }) => {
                            const baseItem: { name: any; y: number; InRef?: number } = {
                                name: item.name,
                                y: (item.y / lastValue) * 100, // Calcul en base 100
                            };
                            if (lastValueInd !== undefined && item.InRef !== undefined) {
                                baseItem.InRef = (item.InRef / lastValueInd) * 100; // Calcul en base 100 pour InRef si les historiques correspondent
                            }
                            return baseItem;
                        });
                        console.log("base100Data")

                        console.log(base100Data)

                        setBase100Data(base100Data); // Mettre à jour l'état avec les données en base 100
                    }
                }

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
                        const lastValue = filteredData[0].y; // Dernière valeur
                        const lastValueInd = filteredData[0].InRef; // Dernière valeur

                        console.log(filteredData[0]);
                        const base100Data = filteredData.map((item: { name: any; y: number; InRef: number; }) => {
                            const baseItem: { name: any; y: number; InRef?: number } = {
                                name: item.name,
                                y: (item.y / lastValue) * 100, // Calcul en base 100
                            };
                            if (item.InRef !== undefined) {
                                baseItem.InRef = (item.InRef / lastValueInd) * 100; // Calcul en base 100 pour InRef si nécessaire
                            }
                            return baseItem;
                        });
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
                        const base100Data = filteredData.map((item: { name: any; y: number; InRef: number; }) => {
                            const baseItem: { name: any; y: number; InRef?: number } = {
                                name: item.name,
                                y: (item.y / lastValue) * 100, // Calcul en base 100
                            };
                            if (item.InRef !== undefined) {
                                baseItem.InRef = (item.InRef / lastValueInd) * 100; // Calcul en base 100 pour InRef si nécessaire
                            }
                            return baseItem;
                        });

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
                        const base100Data = filteredData.map((item: { name: any; y: number; InRef: number; }) => {
                            const baseItem: { name: any; y: number; InRef?: number } = {
                                name: item.name,
                                y: (item.y / lastValue) * 100, // Calcul en base 100
                            };
                            if (item.InRef !== undefined) {
                                baseItem.InRef = (item.InRef / lastValueInd) * 100; // Calcul en base 100 pour InRef si nécessaire
                            }
                            return baseItem;
                        });

                        setBase100Data(base100Data); // Mettre à jour l'état avec les données en base 100
                    }
                }
                setFilteredData(filteredData);
                const datacl = await getclassement(id);
                setClassementlocal(datacl);
                console.log("datacl")
                console.log(datacl)
                Swal.close(); // Close the loading popup

                console.log(datacl)

            } catch (error) {
                Swal.close(); // Close the loading popup

                console.error("Erreur lors de l'appel à l'API :", error);
            }
        }
        fetchData();



    }, [selectedPeriod, id]);

    /*  const determineClasseSRRI = (volatilite: any) => {
          // Supprimez la classe "indic-srri-selected" de tous les éléments "indic-srri"
          const srriElements = document.querySelectorAll('.indic-srri');
          srriElements.forEach((element) => {
              element.classList.remove('indic-srri-selected');
          });
          // Ajoutez la classe "indic-srri-selected" à l'élément approprié en fonction de volatilite
          if (volatilite < 0.5) {
              const element = document.querySelector('.indic-srri:nth-child(1)');
              if (element) {
                  element.classList.add('indic-srri-selected');
              }
              return 'indic-srri indic-srri-selected';
          } else if (volatilite >= 0.5 && volatilite < 2) {
              const element = document.querySelector('.indic-srri:nth-child(2)');
              if (element) {
                  element.classList.add('indic-srri-selected');
              }
              return 'indic-srri indic-srri-selected';
          } else if (volatilite >= 2 && volatilite < 5) {
              const element = document.querySelector('.indic-srri:nth-child(3)');
              if (element) {
                  element.classList.add('indic-srri-selected');
              }
              return 'indic-srri indic-srri-selected';
          } else if (volatilite >= 5 && volatilite < 10) {
              const element = document.querySelector('.indic-srri:nth-child(4)');
              if (element) {
                  element.classList.add('indic-srri-selected');
              }
              return 'indic-srri indic-srri-selected';
          } else if (volatilite >= 10 && volatilite < 15) {
              const element = document.querySelector('.indic-srri:nth-child(5)');
              if (element) {
                  element.classList.add('indic-srri-selected');
              }
              return 'indic-srri indic-srri-selected';
          } else if (volatilite >= 15 && volatilite < 25) {
              const element = document.querySelector('.indic-srri:nth-child(6)');
              if (element) {
                  element.classList.add('indic-srri-selected');
              }
              return 'indic-srri indic-srri-selected';
          } else if (volatilite >= 25) {
              const element = document.querySelector('.indic-srri:nth-child(7)');
              if (element) {
                  element.classList.add('indic-srri-selected');
              }
              return 'indic-srri indic-srri-selected';
          } else {
              return 'indic-srri'; // Par défaut, sans sélection
          }
  
      };*/
    const [classeSRRI, setClasseSRRI] = useState<string>('indic-srri');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const volatility = parseFloat(post?.data?.ratios3a?.data?.volatility);
            console.log("volatility", volatility);
            if (!isNaN(volatility)) {
                // Obtenez l'index basé sur la volatilité
                const selectedIndex = determineClasseSRRI(volatility);
                // Supprimez la classe "indic-srri-selected" de tous les éléments "indic-srri"
                const srriElements = document.querySelectorAll('.indic-srri');
                srriElements.forEach((element) => {
                    element.classList.remove('indic-srri-selected');
                });
                // Ajoutez la classe "indic-srri-selected" à l'élément approprié
                const selectedElement = document.querySelector(`.indic-srri:nth-child(${selectedIndex})`);
                if (selectedElement) {
                    selectedElement.classList.add('indic-srri-selected');
                }
            }
        }
    }, [post]);

    const volatility = parseFloat(post?.data?.ratios3a?.data?.volatility);
    // const classeSRRI = determineClasseSRRI(isNaN(volatility) ? 0 : volatility.toFixed(2));










    let xAxisCategories: any;
    let xAxisType = 'category';

    if (selectedPeriod === '1 year') {
        xAxisCategories = base100Data.map(item => new Date(item.name).toLocaleString('default', { month: 'short' }));
    } else {
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
    const quartile = Math.ceil(classementlocal?.data?.classementType1.rank5Ans / classementlocal?.data?.classementType1.rank5Anstotal * 4);
    console.log(quartile)
    // Define quartile colors
    const quartileColors: {
        [key: number]: string;
    } = {
        1: 'green',
        2: 'lightgreen',
        3: 'orange',
        4: 'red',
    };
    const [error, setError] = useState(""); // État pour stocker le message d'erreur
    //Notation ration
    const getNotationClasses = (rank: number, total: number) => {
        const selectedCount = Math.ceil((rank / total) * 5);
        const classes = Array(5).fill("conseil-default");
        console.log(selectedCount);
        for (let i = 0; i < selectedCount; i++) {
            classes[i] = "conseil-default conseil-selected";
        }

        return classes;
    };

    const getEstimationText = (rank: number) => {
        console.log(rank);
        switch (rank) {
            case 1:
                return "Très mauvais";
            case 2:
                return "Mauvais";
            case 3:
                return "Moyen";
            case 4:
                return "Bon";
            case 5:
                return "Très bon";
            default:
                return "";
        }
    };

    // Dynamically set quartile color
    const handleExport1 = async () => {
        try {
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-based
            const day = String(selectedDate.getDate()).padStart(2, '0');


            const formattedDate = `${year}-${month}-${day}`;

            const year1 = selectedDate1.getFullYear();
            const month1 = String(selectedDate1.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-based
            const day1 = String(selectedDate1.getDate()).padStart(2, '0');


            const formattedDate1 = `${year1}-${month1}-${day1}`;

            const date1 = selectedDate.getTime();
            const date2 = selectedDate1.getTime();
            const differenceInTime = date2 - date1
            const differenceInDays = differenceInTime / (1000 * 3600 * 24);
            console.log(differenceInDays)
            if (date1 > date2) {
                setShowWarningModal(true);
                console.error('Erreur : La date de debut doit être postérieure à la date de fin.');
                return;
            }
            if (differenceInDays > 365) {
                setShowWarningModal(true);
                console.error('Erreur : La date de debut doit être postérieure à la date de fin.');
                return;
            }
            const response = await fetch(`${urlconstant}/api/exportToExcel?id=${id}&formattedDate=${formattedDate}&formattedDate1=${formattedDate1}`, {
                method: 'GET',
            });
            if (response.ok) {
                // Handle the exported data (e.g., download a file)
                const excelData = await response.json();

                // Create headers and data for CSV
                const headers = Object.keys(excelData[0]);
                const csvContent = [headers.join(',')];

                const dataRows = excelData.map((row: { [x: string]: any; }) => headers.map(header => row[header]));
                dataRows.forEach((row: { [x: string]: any; }) => {
                    const csvRow = row.map((value: any) => `"${value}"`).join(',');
                    csvContent.push(csvRow);
                });

                // Download the CSV file
                const csvString = csvContent.join('\n');
                const blob = new Blob([csvString], { type: 'text/csv' });

                // Declare the link variable here
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `${post?.data?.libelle_fond}.csv`;  // Use template literals for filename
                link.click();

                setShow(false)
            } else {
                console.error('Failed to export data');
            }
        } catch (error) {
            console.error('Error exporting data:', error);
        }
    };
    const [showExportModal, setShowExportModal] = useState(false);

    const handleExportClick = () => {
        console.log("ee")
        setShow(true);
    };
    const onChange = (date: any) => {
        if (isDateAvailable(date)) {
            setSelectedDate(date);
        }
    };
    const onChange1 = (date: any) => {
        if (isDateAvailable(date)) {
            setSelectedDate1(date);
        }
    };
    const [availableDates, setAvailableDates] = useState([]);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedDate1, setSelectedDate1] = useState(new Date());

    const isDateAvailable = (date: Date): boolean => {
        // Convert the availableDates array to an array of Date objects
        const dateObjects = availableDates.map(dateString => new Date(dateString));

        // Check if any of the Date objects match the provided date
        return dateObjects.some(availableDate =>
            availableDate.getDate() === date.getDate() &&
            availableDate.getMonth() === date.getMonth() &&
            availableDate.getFullYear() === date.getFullYear()
        );
    };
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };


    const postYears = post?.data?.performances?.data?.adaptValues1.map((item: any) => item[0]);

    const slicedPostc = postc?.data?.multipliedValues;

    const handleLinksociete = () => {


        setTimeout(() => {
            const redirectUrl = `/Fundmanager/recherche`;

            router.push(redirectUrl);
        }, 1);


    };
    useEffect(() => {
        Highcharts.setOptions({
          credits: {
            enabled: false
          }
        });
      }, [id]);

    const [isHovered, setIsHovered] = useState(false);
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

    const [isHoveredcontact, setIsHoveredcontact] = useState(false);

    const handleMouseEntercontact = () => {
        setIsHoveredcontact(true);
    };

    const handleMouseLeavecontact = () => {
        setIsHoveredcontact(false);
    };

    // Créer le canonical URL
    const canonicalUrl = `${urlsite}/Opcvm/${id}`;
    const canonicalUrlroot = `${urlsite}`;

    // JSON-LD pour Schema.org
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "InvestmentFund",
        "name": post?.data?.libelle_fond,
        "description": post?.data?.libelle_fond,
        "identifier": id,
        "category": post?.data?.categorie_globale,
        "offers": {
            "@type": "Offer",
            "price": post?.data?.lastValue,
            "priceCurrency": post?.data?.symboledevise
        },
        "brand": {
            "@type": "Organization",
            "name": post?.data?.societe_gestion,
            "url": post?.data?.societe_gestion
        },
        "latestVl": `${post?.data?.lastValue} ${post?.data?.symboledevise}`,
        "vlDate": post?.data?.lastDate,
        "hasPart": [
            {
                "@type": "WebPage",
                "name": "Historique du Fonds",
                "url": `${canonicalUrlroot}/historique/${id}`,
                "description": "Historique du fonds et ses performances."
            },
            {
                "@type": "WebPage",
                "name": "Documents du Fonds",
                "url": `${canonicalUrlroot}/documents/${id}`,
                "description": "Accès aux documents liés au fonds."
            }
        ]
    };
    return (

        <Fragment>
            <Header />
            <Head>
                <title>{post?.data?.libelle_fond}  {post?.data?.symboledevise}  {post?.data?.code_ISIN}  {post?.data?.pays} - synthèse OPCVM Afrique - Fundafrique</title>
                <meta name="description" content={`Découvrez le résumé du fonds ${post?.data?.libelle_fond} en ${post?.data?.symboledevise} avec des informations sur les performances, les risques et les caractéristiques.`} />
                <meta name="keywords" content={`${post?.data?.libelle_fond}, investissement, ${post?.data?.symboledevise}, performances, caractéristiques`} />
                <meta name="robots" content="index, follow" />
                <meta property="og:title" content={`${post?.data?.libelle_fond} - Résumé ${post?.data?.symboledevise}`} />
                <meta property="og:description" content={`Résumé ${post?.data?.symboledevise} du fonds ${post?.data?.libelle_fond} avec performances, risques et caractéristiques.`} />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:image" content={`${urlsite}/images/logo.png`} />
                <meta property="og:type" content="website" />
                <link rel="canonical" href={`https://funds.chainsolutions.fr/Opcvm/${id}`} />

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />


            </Head>
          

            <div className="">
                <Modal show={show} onHide={handleClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Selectionner les datte</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-6 ">
                                <label htmlFor="">Date de debut</label>
                                <Calendar
                                    onChange={onChange}
                                    value={selectedDate}
                                    tileDisabled={({ date, view }) => view === 'month' && !isDateAvailable(date)}
                                />
                            </div>
                            <div className="col-6 ">
                                <label htmlFor="">Date de fin</label>

                                <Calendar
                                    onChange={onChange1}
                                    value={selectedDate1}
                                    tileDisabled={({ date, view }) => view === 'month' && !isDateAvailable(date)}
                                />
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleExport1}>
                            OK
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Warning Modal */}
                <Modal show={showWarningModal} onHide={handleCloseWarningModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Attention</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        La date de debut doit etre posterieure à la date de fin
                        <br />
                        La plage de dates sélectionnée est supérieure à 1 an. Veuillez sélectionner une plage de dates dans un délai d un an.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleCloseWarningModal}>
                            OK
                        </Button>
                    </Modal.Footer>
                </Modal>

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
                                                                <a onClick={handleToggleFavorite}>
                                                                    {isFavorite ? '💜 Retirer des favoris' : '🤍 Ajouter aux favoris'}
                                                                </a>
                                                                : <p></p>}
                                                        </div> </div>


                                                </div>
                                            </div>

                                        </div>
                                        <div className="row">

                                            <ul className="tabs-menu" style={{ display: 'flex', flexWrap: 'wrap', padding: '0', margin: '0', listStyleType: 'none' }}>
                                                <li style={{ margin: '0', padding: '0' }}>
                                                    <Button
                                                        href="javascript:void(0)"

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
                                            <p><span className="text-primary">Fiche d identité</span> | <span className="text-fade"></span></p>
                                            <div className="col-md-10">
                                                <div className="dl-horizontal dl-fichier-identite dl-horizontal-40-60 dl-highlight-value dl-padding-small dl-small-font">
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <div className="line-group">
                                                                <div>
                                                                    <p><strong>Société
                                                                        <span
                                                                            className="custom-a"
                                                                            onMouseEnter={() => setShowDescription(true)}
                                                                            onMouseLeave={() => setShowDescription(false)}
                                                                        >&nbsp;
                                                                            <FontAwesomeIcon
                                                                                className="text-right"
                                                                                icon={faSquare}></FontAwesomeIcon>
                                                                            {showDescription && (
                                                                                <div className="description">
                                                                                    Le risque est mesuré par l écart-type des rendements hebdomadaires du fonds sur différentes périodes
                                                                                </div>
                                                                            )}
                                                                        </span>
                                                                    </strong>:  <Link
                                                                        href={{
                                                                            pathname: '/Fundmanager',
                                                                            query: { fund: post ? post?.data?.societe_gestion.replace(/ /g, '-') : '' }, // Replaced selectedFund with managementCompany
                                                                        }}
                                                                        as={`/Fundmanager/${post ? post?.data?.societe_gestion.replace(/ /g, '-') : ''}`} // Replaced selectedFund with managementCompany

                                                                    >
                                                                            {post?.data?.societe_gestion}
                                                                        </Link></p>
                                                                    <p><strong>Pays</strong>: {post?.data?.pays}</p>
                                                                    <p><strong>Type d investisseur</strong>: {post?.data?.type_investissement}</p>
                                                                    <p><strong>Nom du régulateur</strong>: {post?.data?.regulateur}</p>
                                                                    <p><strong>Classification Régulateur</strong>: {post?.data?.categorie_libelle}</p>
                                                                    <p><strong>Catégorie global fundafrica</strong>: {post?.data?.categorie_globale}</p>
                                                                    <p><strong>Catégorie local fundafrica</strong>: {post?.data?.categorie_globale} {post?.data?.pays}</p>
                                                                    <p><strong>Catégorie sous régional fundafrica</strong>: {post?.data?.categorie_regional}</p>
                                                                    <p><strong>Gérant</strong>: {post?.data?.nom_gerant}</p>
                                                                    <p><strong>Place financière</strong>: {post?.data?.nomdelabourse}</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <div className="line-group">
                                                                <div>
                                                                    <p><strong>Site de la société de gestion:</strong><a href={post?.data?.societesiteweb}>{post?.data?.societesiteweb}</a></p>
                                                                    <p><strong></strong>&nbsp; </p>
                                                                    <p><strong></strong>&nbsp; </p>
                                                                    <p><strong>Site du régulateur:</strong>: <a href={post?.data?.sitewebregulateur}>{post?.data?.sitewebregulateur}</a></p>
                                                                    <p><strong>Categorie fundafrica (EUR)</strong> </p>
                                                                    <p><strong>Indice de réference global fundafrica</strong>: </p>
                                                                    <p><strong>Indice de réference  local fundafrica</strong>: {post?.data?.ID_indice}</p>
                                                                    <p><strong>Indice de réference sous régional fundafrica</strong>: </p>
                                                                    <p><strong>Benchmark</strong>: {post?.data?.indice_benchmark}  </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Add the ESG and Labels sections here */}
                                            </div>
                                            <div className="col-md-2 mt-3 vl-box">
                                                <span className="vl-box-legend">
                                                    Valeur liquidative
                                                </span><br></br>
                                                <div className="vl-box-currencies">
                                                    <div className="vl-box-devise-value"> {post?.data?.lastValue.toFixed(2)}  {post?.data?.symboledevise != null ? post?.data?.symboledevise : "EUR"}</div>
                                                </div><br></br>
                                                <span className="vl-box-date">
                                                    {post?.data?.lastDate}
                                                </span>
                                            </div>


                                        </div>

                                    </div>
                                </div>


                            </div>
                            <div className="row">
                                <div className="col-md-8">
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
                                                        <li className="nav-item">
                                                            <Link
                                                                className={`nav-link py-2 px-4 b-0 ${selectedPeriod === 'all' ? 'active' : ''}`}
                                                                onClick={() => setSelectedPeriod('all')} href="javascript:void(0)"
                                                            >
                                                                <span className="nav-text base-font">Origine</span>
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <br></br>
                                                {/* Display filtered data with Highcharts */}

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
                                <div className="col-md-4">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="d-md-flex justify-content-between align-items-center">
                                                <div className="row">
                                                    <p><span className="text-primary">Performances</span> | <span className="text-fade"></span></p>

                                                </div>

                                            </div>

                                            <table className="table table-sm">
                                                <thead className="table-header">
                                                    <tr className="white-hover">
                                                        <td className="p-t-1">
                                                            <strong>Perf. {post?.data?.lastDate}</strong>
                                                        </td>
                                                        <td className="text-right p-t-1">
                                                            <strong>Fonds</strong>
                                                        </td>
                                                        <td className="text-right p-t-1">
                                                            <strong>Catégorie</strong>
                                                        </td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td> Perf. veille</td>
                                                        <td className={`text-right ${parseFloat(post?.data?.performances?.data?.perfVeille) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(post?.data?.performances?.data?.perfVeille)) ? '-' : parseFloat(post?.data?.performances?.data?.perfVeille).toFixed(2)} %</td>
                                                        <td className={`text-right  ${parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perfveille) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perfveille)) ? '-' : parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perfveille).toFixed(2)} %</td>
                                                    </tr>
                                                    <tr>
                                                        <td> Perf. 4 semaines</td>
                                                        <td className={`text-right ${parseFloat(post?.data?.performances?.data?.perf4Semaines) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(post?.data?.performances?.data?.perf4Semaines)) ? '-' : parseFloat(post?.data?.performances?.data?.perf4Semaines).toFixed(2)} %</td>
                                                        <td className={`text-right  ${parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perf4s) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf4s)) || isNaN(parseFloat(post?.data?.performances?.data?.perf4Semaines)) ? '-' : parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf4s).toFixed(2)} %</td>
                                                    </tr>

                                                    <tr>
                                                        <td> Perf. 1er janvier</td>
                                                        <td className={`text-right ${parseFloat(post?.data?.performances?.data?.perf1erJanvier) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(post?.data?.performances?.data?.perf1erJanvier)) ? '-' : parseFloat(post?.data?.performances?.data?.perf1erJanvier).toFixed(2)} %</td>
                                                        <td className={`text-right  ${parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_ytd) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_ytd)) || isNaN(parseFloat(post?.data?.performances?.data?.perf1erJanvier)) ? '-' : parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_ytd).toFixed(2)} %</td>
                                                    </tr>
                                                    <tr>
                                                        <td> Perf. 1 an</td>
                                                        <td className={`text-right ${parseFloat(post?.data?.performances?.data?.perf1An) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(post?.data?.performances?.data?.perf1An)) ? '-' : parseFloat(post?.data?.performances?.data?.perf1An).toFixed(2)}%</td>
                                                        <td className={`text-right  ${parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perf1an) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf1an)) || isNaN(parseFloat(post?.data?.performances?.data?.perf1An)) ? '-' : parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf1an).toFixed(2)} %</td>
                                                    </tr>
                                                    <tr>
                                                        <td> Perf. 3 ans</td>
                                                        <td className={`text-right ${parseFloat(post?.data?.performances?.data?.perf3Ans) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(post?.data?.performances?.data?.perf3Ans)) ? '-' : parseFloat(post?.data?.performances?.data?.perf3Ans).toFixed(2)} %</td>
                                                        <td className={`text-right  ${parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perf3ans) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf3ans)) || isNaN(parseFloat(post?.data?.performances?.data?.perf3Ans)) ? '-' : parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf3ans).toFixed(2)} %</td>
                                                    </tr>
                                                    <tr>
                                                        <td> Perf. 5 ans</td>
                                                        <td className={`text-right ${parseFloat(post?.data?.performances?.data?.perf5Ans) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(post?.data?.performances?.data?.perf5Ans)) ? '-' : parseFloat(post?.data?.performances?.data?.perf5Ans).toFixed(2)} %</td>
                                                        <td className={`text-right  ${parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perf5ans) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf5ans)) || isNaN(parseFloat(post?.data?.performances?.data?.perf5Ans)) ? '-' : parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf5ans).toFixed(2)} %</td>
                                                    </tr>
                                                    <tr>
                                                        <td> Perf. 8 ans</td>
                                                        <td className={`text-right ${parseFloat(post?.data?.performances?.data?.perf8Ans) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(post?.data?.performances?.data?.perf8Ans)) ? '-' : parseFloat(post?.data?.performances?.data?.perf8Ans).toFixed(2)} %</td>
                                                        <td className={`text-right  ${parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perf8ans) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf8ans)) || isNaN(parseFloat(post?.data?.performances?.data?.perf8Ans)) ? '-' : parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf8ans).toFixed(2)} %</td>
                                                    </tr>
                                                    <tr>
                                                        <td> Perf. 10 ans</td>
                                                        <td className={`text-right ${parseFloat(post?.data?.performances?.data?.perf10Ans) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(post?.data?.performances?.data?.perf10Ans)) ? '-' : parseFloat(post?.data?.performances?.data?.perf10Ans).toFixed(2)}%</td>
                                                        <td className={`text-right  ${parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perf10ans) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf10ans)) || isNaN(parseFloat(post?.data?.performances?.data?.perf10Ans)) ? '-' : parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf10ans).toFixed(2)} %</td>
                                                    </tr>

                                                    <tr className="white-hover">
                                                        <td className="p-t-1">
                                                            <strong>Perf. annuelles</strong>
                                                        </td>
                                                    </tr>
                                                    {new Date().getFullYear() === post?.data?.performances?.data?.adaptValues1?.[0]?.[0] && (
                                                        <>
                                                            <tr>
                                                                <td> Perf. {post?.data?.performances?.data?.adaptValues1?.[0]?.[0]}</td>
                                                                <td className={`text-right ${parseFloat(post?.data?.performances?.data?.adaptValues1?.[0]?.[2]) < 0 ? 'text-danger' : 'text-success'}`}>
                                                                    {isNaN(parseFloat(post?.data?.performances?.data?.adaptValues1?.[0]?.[2])) ? '-' : parseFloat(post?.data?.performances?.data?.adaptValues1?.[0]?.[2]).toFixed(2)} %
                                                                </td>
                                                                <td className="text-right highlight">
                                                                    {slicedPostc && slicedPostc[0] && !isNaN(parseFloat(slicedPostc[0][1])) ? parseFloat(slicedPostc[0][1]).toFixed(2) + '%' : '-'}
                                                                </td>
                                                            </tr>
                                                        </>
                                                    )}
                                                    <tr>
                                                        <td> Perf. {post?.data?.performances?.data?.adaptValues1?.[1]?.[0]}</td>
                                                        <td className={`text-right ${parseFloat(post?.data?.performances?.data?.adaptValues1?.[1]?.[2]) < 0 ? 'text-danger' : 'text-success'}`}>
                                                            {isNaN(parseFloat(post?.data?.performances?.data?.adaptValues1?.[1]?.[2])) ? '-' : parseFloat(post?.data?.performances?.data?.adaptValues1?.[1]?.[2]).toFixed(2)} %
                                                        </td>
                                                        <td className={`text-right ${slicedPostc && slicedPostc[1] && parseFloat(slicedPostc[1][1]) < 0 ? 'text-danger' : 'text-success'}`}>
                                                            {slicedPostc && slicedPostc[1] && !isNaN(parseFloat(slicedPostc[1][1])) ? parseFloat(slicedPostc[1][1]).toFixed(2) + '%' : '-'}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td> Perf.  {post?.data?.performances?.data?.adaptValues1?.[1]?.[0] - 1}</td>
                                                        <td className={`text-right ${parseFloat(post?.data?.performances?.data?.adaptValues1?.[2]?.[2]) < 0 ? 'text-danger' : 'text-success'}`}>
                                                            {isNaN(parseFloat(post?.data?.performances?.data?.adaptValues1?.[2]?.[2])) ? '-' : parseFloat(post?.data?.performances?.data?.adaptValues1?.[2]?.[2]).toFixed(2)} %
                                                        </td>
                                                        <td className={`text-right ${slicedPostc && slicedPostc[2] && parseFloat(slicedPostc[2][1]) < 0 ? 'text-danger' : 'text-success'}`}>
                                                            {slicedPostc && slicedPostc[2] && !isNaN(parseFloat(slicedPostc[2][1])) ? parseFloat(slicedPostc[2][1]).toFixed(2) + '%' : '-'}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td> Perf.  {post?.data?.performances?.data?.adaptValues1?.[1]?.[0] - 2}</td>
                                                        <td className={`text-right ${parseFloat(post?.data?.performances?.data?.adaptValues1?.[3]?.[2]) < 0 ? 'text-danger' : 'text-success'}`}>
                                                            {isNaN(parseFloat(post?.data?.performances?.data?.adaptValues1?.[3]?.[2])) ? '-' : parseFloat(post?.data?.performances?.data?.adaptValues1?.[3]?.[2]).toFixed(2)} %
                                                        </td>
                                                        <td className={`text-right ${slicedPostc && slicedPostc[3] && parseFloat(slicedPostc[3][1]) < 0 ? 'text-danger' : 'text-success'}`}>
                                                            {slicedPostc && slicedPostc[3] && !isNaN(parseFloat(slicedPostc[3][1])) ? parseFloat(slicedPostc[3][1]).toFixed(2) + '%' : '-'}
                                                        </td>
                                                    </tr>



                                                    <tr className="white-hover">
                                                        <td colSpan={3} className="p-t-1">
                                                            <strong >Données 3 ans au {post?.data?.lastdatepreviousmonth}</strong>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td> Perf. annualisée</td>
                                                        <td className={`text-right  ${parseFloat(post?.data?.ratios3a?.data?.perfAnnualisee) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(post?.data?.ratios3a?.data?.perfAnnualisee)) ? '-' : parseFloat(post?.data?.ratios3a?.data?.perfAnnualisee).toFixed(2)}  %</td>
                                                        <td className={`text-right  ${parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perfannu3an) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perfannu3an)) || isNaN(parseFloat(post?.data?.ratios3a?.data?.perfAnnualisee)) ? '-' : parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perfannu3an).toFixed(2)} %</td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            Volatilité{' '}
                                                            <span
                                                                data-content="Le risque est mesuré par l'écart-type des rendements hebdomadaires du fonds sur différentes périodes : 1 an, 3 ans, 5 ans, ou sur une période définie par l'utilisateur. On parle aussi parfois de volatilité. Plus le fonds est volatil, plus grande est la fourchette des performances possibles, qu'elles soient positives ou négatives. Toutes choses étant égales par ailleurs, moins le risque est élevé, meilleur a été le fonds pour l'investisseur, mais certains fonds ont à la fois un risque élevé et des performances passées excellentes, il faut donc savoir séparer le bon risque du mauvais risque."
                                                                data-helper-explanation=""
                                                                data-trigger="hover"
                                                                data-tooltip-isinit="true"
                                                            ></span>
                                                        </td>
                                                        <td className={`text-right  ${parseFloat(post?.data?.ratios3a?.data?.volatility) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(post?.data?.ratios3a?.data?.volatility)) ? '-' : parseFloat(post?.data?.ratios3a?.data?.volatility).toFixed(2)}  %</td>
                                                        <td className={`text-right   ${parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_volatility3an) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_volatility3an)) || isNaN(parseFloat(post?.data?.ratios3a?.data?.volatility)) ? '-' : parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_volatility3an).toFixed(2)} %</td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            Sharpe{' '}
                                                            <span
                                                                data-content="Le ratio de Sharpe a pour numérateur la surperformance du fonds par rapport au taux sans risque (Quantalys utilise l'EONIA comme taux sans risque) et pour dénominateur le risque du fonds (mesuré par l'écart-type de ses rendements mensuels). Dans le cas où le fonds a généré une surperformance par rapport au taux sans risque (et donc où le Ratio de Sharpe est positif), plus le ratio de Sharpe est élevé, meilleur a été le fonds. Un ratio de Sharpe de 0.4 indique que le fonds a rapporté 0.4% de performance au delà du taux sans risque par unité de risque supplémentaire (soit pour 1% de volatilité, mesurée par l'écart-type des rendements du fonds sur la période de calcul)."
                                                                data-helper-explanation=""
                                                                data-trigger="hover"
                                                                data-tooltip-isinit="true"
                                                            ></span>
                                                        </td>
                                                        <td className={`text-right  ${parseFloat(post?.data?.ratios3a?.data?.ratioSharpe) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(post?.data?.ratios3a?.data?.ratioSharpe)) ? '-' : parseFloat(post?.data?.ratios3a?.data?.ratioSharpe).toFixed(2)}  </td>
                                                        <td className={`text-right   ${parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_ratiosharpe3an) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_ratiosharpe3an)) || isNaN(parseFloat(post?.data?.ratios3a?.data?.ratioSharpe)) ? '-' : parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_ratiosharpe3an).toFixed(2)} </td>
                                                    </tr>
                                                    <br></br>
                                                    <br></br>
                                                    <br></br>
                                                    <tr>
                                                        <td>
                                                            SRRI{' '}
                                                            <span
                                                                data-content="Le ratio de Sharpe a pour numérateur la surperformance du fonds par rapport au taux sans risque (Quantalys utilise l'EONIA comme taux sans risque) et pour dénominateur le risque du fonds (mesuré par l'écart-type de ses rendements mensuels). Dans le cas où le fonds a généré une surperformance par rapport au taux sans risque (et donc où le Ratio de Sharpe est positif), plus le ratio de Sharpe est élevé, meilleur a été le fonds. Un ratio de Sharpe de 0.4 indique que le fonds a rapporté 0.4% de performance au delà du taux sans risque par unité de risque supplémentaire (soit pour 1% de volatilité, mesurée par l'écart-type des rendements du fonds sur la période de calcul)."
                                                                data-helper-explanation=""
                                                                data-trigger="hover"
                                                                data-tooltip-isinit="true"
                                                            ></span>
                                                        </td  >
                                                        <td colSpan={2}>
                                                            <div className="col-xs-9">
                                                                <div className="indic-srri">1</div>
                                                                <div className="indic-srri">2</div>
                                                                <div className="indic-srri">3</div>
                                                                <div className="indic-srri">4</div>
                                                                <div className="indic-srri">5</div>
                                                                <div className="indic-srri">6</div>
                                                                <div className="indic-srri">7</div>
                                                            </div>
                                                        </td>

                                                    </tr>
                                                </tbody>
                                            </table>

                                        </div>

                                    </div>

                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-4">
                                    <div className="card ">
                                        <div className="card-body">
                                            <div className="d-md-flex justify-content-between align-items-center">
                                                <div className="row">
                                                    <p><span className="text-primary">Classement  au {post?.data?.lastDate}</span> | {post?.data?.categorie_national}<span className="text-fade"></span></p>

                                                </div>

                                            </div>


                                            <table className="table table-sm">
                                                <thead className="table-header">
                                                    <tr className="th-no-border">
                                                        <th style={{ width: '20%' }}></th>
                                                        <th className="text-center" style={{ width: '55%' }}>
                                                            Rang
                                                        </th>
                                                        <th style={{ width: '5%' }}></th>
                                                        <th style={{ width: '20%' }}>Quartile</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>3 mois</td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            {classementlocal?.data?.classementType1?.rank3Mois === undefined || classementlocal?.data?.classementType1?.rank3Mois == 0
                                                                ? "-"
                                                                : `${classementlocal?.data?.classementType1?.rank3Mois} / ${classementlocal?.data?.classementType1?.rank3Moistotal}`}
                                                        </td>
                                                        <td className="text-right">
                                                            {classementlocal?.data?.classementType1?.rank3Mois === undefined || classementlocal?.data?.classementType1?.rank3Moistotal === undefined || classementlocal?.data?.classementType1?.rank3Mois == 0
                                                                ? "-"
                                                                : Math.ceil(
                                                                    (classementlocal?.data?.classementType1?.rank3Mois /
                                                                        classementlocal?.data?.classementType1?.rank3Moistotal) *
                                                                    4
                                                                )}
                                                        </td>
                                                        <td>
                                                            {[4, 3, 2, 1].map((index) => (
                                                                <div
                                                                    key={index}
                                                                    className={`quartile-default quartile-${index + 1 >
                                                                        Math.ceil(
                                                                            (classementlocal?.data?.classementType1?.rank3Mois /
                                                                                classementlocal?.data?.classementType1?.rank3Moistotal) *
                                                                            4
                                                                        )
                                                                        ? quartileColors[
                                                                        Math.ceil(
                                                                            (classementlocal?.data?.classementType1?.rank3Mois /
                                                                                classementlocal?.data?.classementType1?.rank3Moistotal) *
                                                                            4
                                                                        )
                                                                        ]
                                                                        : 'default'
                                                                        }`}
                                                                ></div>
                                                            ))}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>6 mois</td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            {classementlocal?.data?.classementType1?.rank6Mois === undefined || classementlocal?.data?.classementType1?.rank6Mois == 0
                                                                ? "-"
                                                                : `${classementlocal?.data?.classementType1?.rank6Mois} / ${classementlocal?.data?.classementType1?.rank6Moistotal}`}
                                                        </td>
                                                        <td className="text-right">
                                                            {classementlocal?.data?.classementType1?.rank6Mois === undefined || classementlocal?.data?.classementType1?.rank6Moistotal === undefined || classementlocal?.data?.classementType1?.rank6Mois == 0
                                                                ? "-"
                                                                : Math.ceil(
                                                                    (classementlocal?.data?.classementType1?.rank6Mois /
                                                                        classementlocal?.data?.classementType1?.rank6Moistotal) *
                                                                    4
                                                                )}
                                                        </td>
                                                        <td>
                                                            {[4, 3, 2, 1].map((index) => (
                                                                <div
                                                                    key={index}
                                                                    className={`quartile-default quartile-${index + 1 >
                                                                        Math.ceil(
                                                                            (classementlocal?.data?.classementType1?.rank6Mois /
                                                                                classementlocal?.data?.classementType1?.rank6Moistotal) *
                                                                            4
                                                                        )
                                                                        ? quartileColors[
                                                                        Math.ceil(
                                                                            (classementlocal?.data?.classementType1?.rank6Mois /
                                                                                classementlocal?.data?.classementType1?.rank6Moistotal) *
                                                                            4
                                                                        )
                                                                        ]
                                                                        : 'default'
                                                                        }`}
                                                                ></div>
                                                            ))}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>YTD</td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            {classementlocal?.data?.classementType1?.rank1erJanvier === undefined || classementlocal?.data?.classementType1?.rank1erJanvier == 0
                                                                ? "-"
                                                                : `${classementlocal?.data?.classementType1?.rank1erJanvier} / ${classementlocal?.data?.classementType1?.rank1erJanviertotal}`}
                                                        </td>
                                                        <td className="text-right">
                                                            {classementlocal?.data?.classementType1?.rank1erJanvier === undefined || classementlocal?.data?.classementType1?.rank1erJanviertotal === undefined || classementlocal?.data?.classementType1?.rank1erJanvier == 0
                                                                ? "-"
                                                                : Math.ceil(
                                                                    (classementlocal?.data?.classementType1?.rank1erJanvier /
                                                                        classementlocal?.data?.classementType1?.rank1erJanviertotal) *
                                                                    4
                                                                )}
                                                        </td>
                                                        <td>
                                                            {[4, 3, 2, 1].map((index) => (
                                                                <div
                                                                    key={index}
                                                                    className={`quartile-default quartile-${index + 1 >
                                                                        Math.ceil(
                                                                            (classementlocal?.data?.classementType1?.rank1erJanvier /
                                                                                classementlocal?.data?.classementType1?.rank1erJanviertotal) *
                                                                            4
                                                                        )
                                                                        ? quartileColors[
                                                                        Math.ceil(
                                                                            (classementlocal?.data?.classementType1?.rank1erJanvier /
                                                                                classementlocal?.data?.classementType1?.rank1erJanviertotal) *
                                                                            4
                                                                        )
                                                                        ]
                                                                        : 'default'
                                                                        }`}
                                                                ></div>
                                                            ))}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>1 an</td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            {classementlocal?.data?.classementType1?.rank1An === undefined || classementlocal?.data?.classementType1?.rank1An == 0
                                                                ? "-"
                                                                : `${classementlocal?.data?.classementType1?.rank1An} / ${classementlocal?.data?.classementType1?.rank1Antotal}`}
                                                        </td>
                                                        <td className="text-right">
                                                            {classementlocal?.data?.classementType1?.rank1An === undefined || classementlocal?.data?.classementType1?.rank1Antotal === undefined || classementlocal?.data?.classementType1?.rank1An == 0
                                                                ? "-"
                                                                : Math.ceil(
                                                                    (classementlocal?.data?.classementType1?.rank1An /
                                                                        classementlocal?.data?.classementType1?.rank1Antotal) *
                                                                    4
                                                                )}
                                                        </td>
                                                        <td>
                                                            {[4, 3, 2, 1].map((index) => (
                                                                <div
                                                                    key={index}
                                                                    className={`quartile-default quartile-${index + 1 >
                                                                        Math.ceil(
                                                                            (classementlocal?.data?.classementType1?.rank1An /
                                                                                classementlocal?.data?.classementType1?.rank1Antotal) *
                                                                            4
                                                                        )
                                                                        ? quartileColors[
                                                                        Math.ceil(
                                                                            (classementlocal?.data?.classementType1?.rank1An /
                                                                                classementlocal?.data?.classementType1?.rank1Antotal) *
                                                                            4
                                                                        )
                                                                        ]
                                                                        : 'default'
                                                                        }`}
                                                                ></div>
                                                            ))}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>3 ans</td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            {classementlocal?.data?.classementType1?.rank3Ans === undefined || classementlocal?.data?.classementType1?.rank3Ans == 0
                                                                ? "-"
                                                                : `${classementlocal?.data?.classementType1?.rank3Ans} / ${classementlocal?.data?.classementType1?.rank3Anstotal}`}
                                                        </td>
                                                        <td className="text-right">
                                                            {classementlocal?.data?.classementType1?.rank3Ans === undefined || classementlocal?.data?.classementType1?.rank3Anstotal === undefined || classementlocal?.data?.classementType1?.rank3Ans == 0
                                                                ? "-"
                                                                : Math.ceil(
                                                                    (classementlocal?.data?.classementType1?.rank3Ans /
                                                                        classementlocal?.data?.classementType1?.rank3Anstotal) *
                                                                    4
                                                                )}
                                                        </td>
                                                        <td>
                                                            {[4, 3, 2, 1].map((index) => (
                                                                <div
                                                                    key={index}
                                                                    className={`quartile-default quartile-${index + 1 >
                                                                        Math.ceil(
                                                                            (classementlocal?.data?.classementType1?.rank3Ans /
                                                                                classementlocal?.data?.classementType1?.rank3Anstotal) *
                                                                            4
                                                                        )
                                                                        ? quartileColors[
                                                                        Math.ceil(
                                                                            (classementlocal?.data?.classementType1?.rank3Ans /
                                                                                classementlocal?.data?.classementType1?.rank3Anstotal) *
                                                                            4
                                                                        )
                                                                        ]
                                                                        : 'default'
                                                                        }`}
                                                                ></div>
                                                            ))}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>5 ans</td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            {classementlocal?.data?.classementType1?.rank5Ans === undefined || classementlocal?.data?.classementType1?.rank5Ans == 0
                                                                ? "-"
                                                                : `${classementlocal?.data?.classementType1?.rank5Ans} / ${classementlocal?.data?.classementType1?.rank5Anstotal}`}
                                                        </td>
                                                        <td className="text-right">
                                                            {classementlocal?.data?.classementType1?.rank5Ans === undefined || classementlocal?.data?.classementType1?.rank5Anstotal === undefined || classementlocal?.data?.classementType1?.rank5Ans == 0
                                                                ? "-"
                                                                : Math.ceil(
                                                                    (classementlocal?.data?.classementType1?.rank5Ans /
                                                                        classementlocal?.data?.classementType1?.rank5Anstotal) *
                                                                    4
                                                                )}
                                                        </td>
                                                        <td>
                                                            {[4, 3, 2, 1].map((index) => (
                                                                <div
                                                                    key={index}
                                                                    className={`quartile-default quartile-${index + 1 >
                                                                        Math.ceil(
                                                                            (classementlocal?.data?.classementType1?.rank5Ans /
                                                                                classementlocal?.data?.classementType1?.rank5Anstotal) *
                                                                            4
                                                                        )
                                                                        ? quartileColors[
                                                                        Math.ceil(
                                                                            (classementlocal?.data?.classementType1?.rank5Ans /
                                                                                classementlocal?.data?.classementType1?.rank5Anstotal) *
                                                                            4
                                                                        )
                                                                        ]
                                                                        : 'default'
                                                                        }`}
                                                                ></div>
                                                            ))}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>




                                        </div>
                                    </div>

                                </div>
                                <div className="col-md-4">
                                    <div className="card ">
                                        <div className="card-body">
                                            <div className="d-md-flex justify-content-between align-items-center">
                                                <div className="row">
                                                    <p><span className="text-primary">Classement  au {post?.data?.lastdatepreviousmonth}</span> | {post?.data?.categorie_national} <span className="text-fade"></span></p>

                                                </div>

                                            </div>



                                            <table className="table table-sm">
                                                <thead className="table-header">
                                                    <tr className="th-no-border">
                                                        <th style={{ width: '20%' }}></th>
                                                        <th className="text-center" style={{ width: '55%' }}>
                                                            Rang
                                                        </th>
                                                        <th style={{ width: '5%' }}></th>
                                                        <th style={{ width: '20%' }}>Quartile</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>3 mois</td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            {classementlocal?.data?.classementType1?.rank3Moism === undefined || classementlocal?.data?.classementType1?.rank3Moism == 0
                                                                ? "-"
                                                                : `${classementlocal?.data?.classementType1?.rank3Moism} / ${classementlocal?.data?.classementType1?.rank3Moistotalm}`}
                                                        </td>
                                                        <td className="text-right">
                                                            {classementlocal?.data?.classementType1?.rank3Moism === undefined || classementlocal?.data?.classementType1?.rank3Moistotalm === undefined || classementlocal?.data?.classementType1?.rank3Moism == 0
                                                                ? "-"
                                                                : Math.ceil(
                                                                    (classementlocal?.data?.classementType1?.rank3Moism /
                                                                        classementlocal?.data?.classementType1?.rank3Moistotalm) *
                                                                    4
                                                                )}
                                                        </td>
                                                        <td>
                                                            {[4, 3, 2, 1].map((index) => (
                                                                <div
                                                                    key={index}
                                                                    className={`quartile-default quartile-${index + 1 >
                                                                        Math.ceil(
                                                                            (classementlocal?.data?.classementType1?.rank3Moism /
                                                                                classementlocal?.data?.classementType1?.rank3Moistotalm) *
                                                                            4
                                                                        )
                                                                        ? quartileColors[
                                                                        Math.ceil(
                                                                            (classementlocal?.data?.classementType1?.rank3Moism /
                                                                                classementlocal?.data?.classementType1?.rank3Moistotalm) *
                                                                            4
                                                                        )
                                                                        ]
                                                                        : 'default'
                                                                        }`}
                                                                ></div>
                                                            ))}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>6 mois</td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            {classementlocal?.data?.classementType1?.rank6Moism === undefined || classementlocal?.data?.classementType1?.rank6Mois == 0
                                                                ? "-"
                                                                : `${classementlocal?.data?.classementType1?.rank6Moism} / ${classementlocal?.data?.classementType1?.rank6Moistotalm}`}
                                                        </td>
                                                        <td className="text-right">
                                                            {classementlocal?.data?.classementType1?.rank6Moism === undefined || classementlocal?.data?.classementType1?.rank6Moistotalm === undefined || classementlocal?.data?.classementType1?.rank6Moism == 0
                                                                ? "-"
                                                                : Math.ceil(
                                                                    (classementlocal?.data?.classementType1?.rank6Moism /
                                                                        classementlocal?.data?.classementType1?.rank6Moistotalm) *
                                                                    4
                                                                )}
                                                        </td>
                                                        <td>
                                                            {[4, 3, 2, 1].map((index) => (
                                                                <div
                                                                    key={index}
                                                                    className={`quartile-default quartile-${index + 1 >
                                                                        Math.ceil(
                                                                            (classementlocal?.data?.classementType1?.rank6Mois /
                                                                                classementlocal?.data?.classementType1?.rank6Moistotalm) *
                                                                            4
                                                                        )
                                                                        ? quartileColors[
                                                                        Math.ceil(
                                                                            (classementlocal?.data?.classementType1?.rank6Mois /
                                                                                classementlocal?.data?.classementType1?.rank6Moistotalm) *
                                                                            4
                                                                        )
                                                                        ]
                                                                        : 'default'
                                                                        }`}
                                                                ></div>
                                                            ))}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>YTD</td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            {classementlocal?.data?.classementType1?.rank1erJanvierm === undefined || classementlocal?.data?.classementType1?.rank1erJanvierm == 0
                                                                ? "-"
                                                                : `${classementlocal?.data?.classementType1?.rank1erJanvierm} / ${classementlocal?.data?.classementType1?.rank1erJanviertotalm}`}
                                                        </td>
                                                        <td className="text-right">
                                                            {classementlocal?.data?.classementType1?.rank1erJanvierm === undefined || classementlocal?.data?.classementType1?.rank1erJanviertotalm === undefined || classementlocal?.data?.classementType1?.rank1erJanvierm == 0
                                                                ? "-"
                                                                : Math.ceil(
                                                                    (classementlocal?.data?.classementType1?.rank1erJanvierm /
                                                                        classementlocal?.data?.classementType1?.rank1erJanviertotalm) *
                                                                    4
                                                                )}
                                                        </td>
                                                        <td>
                                                            {[4, 3, 2, 1].map((index) => (
                                                                <div
                                                                    key={index}
                                                                    className={`quartile-default quartile-${index + 1 >
                                                                        Math.ceil(
                                                                            (classementlocal?.data?.classementType1?.rank1erJanvierm /
                                                                                classementlocal?.data?.classementType1?.rank1erJanviertotalm) *
                                                                            4
                                                                        )
                                                                        ? quartileColors[
                                                                        Math.ceil(
                                                                            (classementlocal?.data?.classementType1?.rank1erJanvierm /
                                                                                classementlocal?.data?.classementType1?.rank1erJanviertotalm) *
                                                                            4
                                                                        )
                                                                        ]
                                                                        : 'default'
                                                                        }`}
                                                                ></div>
                                                            ))}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>1 an</td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            {classementlocal?.data?.classementType1?.rank1Anm === undefined || classementlocal?.data?.classementType1?.rank1Anm == 0
                                                                ? "-"
                                                                : `${classementlocal?.data?.classementType1?.rank1Anm} / ${classementlocal?.data?.classementType1?.rank1Antotalm}`}
                                                        </td>
                                                        <td className="text-right">
                                                            {classementlocal?.data?.classementType1?.rank1Anm === undefined || classementlocal?.data?.classementType1?.rank1Antotalm === undefined || classementlocal?.data?.classementType1?.rank1Anm == 0
                                                                ? "-"
                                                                : Math.ceil(
                                                                    (classementlocal?.data?.classementType1?.rank1Anm /
                                                                        classementlocal?.data?.classementType1?.rank1Antotalm) *
                                                                    4
                                                                )}
                                                        </td>
                                                        <td>
                                                            {[4, 3, 2, 1].map((index) => (
                                                                <div
                                                                    key={index}
                                                                    className={`quartile-default quartile-${index + 1 >
                                                                        Math.ceil(
                                                                            (classementlocal?.data?.classementType1?.rank1Anm /
                                                                                classementlocal?.data?.classementType1?.rank1Antotalm) *
                                                                            4
                                                                        )
                                                                        ? quartileColors[
                                                                        Math.ceil(
                                                                            (classementlocal?.data?.classementType1?.rank1Anm /
                                                                                classementlocal?.data?.classementType1?.rank1Antotalm) *
                                                                            4
                                                                        )
                                                                        ]
                                                                        : 'default'
                                                                        }`}
                                                                ></div>
                                                            ))}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>3 ans</td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            {classementlocal?.data?.classementType1?.rank3Ansm === undefined || classementlocal?.data?.classementType1?.rank3Ansm == 0
                                                                ? "-"
                                                                : `${classementlocal?.data?.classementType1?.rank3Ansm} / ${classementlocal?.data?.classementType1?.rank3Anstotalm}`}
                                                        </td>
                                                        <td className="text-right">
                                                            {classementlocal?.data?.classementType1?.rank3Ansm === undefined || classementlocal?.data?.classementType1?.rank3Anstotalm === undefined || classementlocal?.data?.classementType1?.rank3Ansm == 0
                                                                ? "-"
                                                                : Math.ceil(
                                                                    (classementlocal?.data?.classementType1?.rank3Ansm /
                                                                        classementlocal?.data?.classementType1?.rank3Anstotalm) *
                                                                    4
                                                                )}
                                                        </td>
                                                        <td>
                                                            {[4, 3, 2, 1].map((index) => (
                                                                <div
                                                                    key={index}
                                                                    className={`quartile-default quartile-${index + 1 >
                                                                        Math.ceil(
                                                                            (classementlocal?.data?.classementType1?.rank3Ansm /
                                                                                classementlocal?.data?.classementType1?.rank3Anstotalm) *
                                                                            4
                                                                        )
                                                                        ? quartileColors[
                                                                        Math.ceil(
                                                                            (classementlocal?.data?.classementType1?.rank3Ansm /
                                                                                classementlocal?.data?.classementType1?.rank3Anstotalm) *
                                                                            4
                                                                        )
                                                                        ]
                                                                        : 'default'
                                                                        }`}
                                                                ></div>
                                                            ))}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>5 ans</td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            {classementlocal?.data?.classementType1?.rank5Ansm === undefined || classementlocal?.data?.classementType1?.rank5Ansm == 0
                                                                ? "-"
                                                                : `${classementlocal?.data?.classementType1?.rank5Ansm} / ${classementlocal?.data?.classementType1?.rank5Anstotalm}`}
                                                        </td>
                                                        <td className="text-right">
                                                            {classementlocal?.data?.classementType1?.rank5Ansm === undefined || classementlocal?.data?.classementType1?.rank5Anstotal === undefined || classementlocal?.data?.classementType1?.rank5Ansm == 0
                                                                ? "-"
                                                                : Math.ceil(
                                                                    (classementlocal?.data?.classementType1?.rank5Ansm /
                                                                        classementlocal?.data?.classementType1?.rank5Anstotalm) *
                                                                    4
                                                                )}
                                                        </td>
                                                        <td>
                                                            {[4, 3, 2, 1].map((index) => (
                                                                <div
                                                                    key={index}
                                                                    className={`quartile-default quartile-${index + 1 >
                                                                        Math.ceil(
                                                                            (classementlocal?.data?.classementType1?.rank5Ansm /
                                                                                classementlocal?.data?.classementType1?.rank5Anstotalm) *
                                                                            4
                                                                        )
                                                                        ? quartileColors[
                                                                        Math.ceil(
                                                                            (classementlocal?.data?.classementType1?.rank5Ansm /
                                                                                classementlocal?.data?.classementType1?.rank5Anstotalm) *
                                                                            4
                                                                        )
                                                                        ]
                                                                        : 'default'
                                                                        }`}
                                                                ></div>
                                                            ))}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>




                                        </div>
                                    </div>

                                </div>
                                <div className="col-md-4">
                                    <div className="card ">
                                        <div className="card-body">
                                            <div className="d-md-flex justify-content-between align-items-center">
                                                <div className="row">
                                                    <p><span className="text-primary">Classement au {post?.data?.lastdatepreviousmonth}</span> | {post?.data?.categorie_globale} Afrique<span className="text-fade"></span></p>

                                                </div>

                                            </div>



                                            <table className="table table-sm">
                                                <thead className="table-header">
                                                    <tr className="th-no-border">
                                                        <th style={{ width: '20%' }}></th>
                                                        <th className="text-center" style={{ width: '55%' }}>
                                                            Rang
                                                        </th>
                                                        <th style={{ width: '5%' }}></th>
                                                        <th style={{ width: '20%' }}>Quartile</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>3 mois</td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            {classementlocal?.data?.classementType2?.rank3Mois === undefined || classementlocal?.data?.classementType2?.rank3Mois == 0
                                                                ? "-"
                                                                : `${classementlocal?.data?.classementType2?.rank3Mois} / ${classementlocal?.data?.classementType2?.rank3Moistotal}`}
                                                        </td>
                                                        <td className="text-right">
                                                            {classementlocal?.data?.classementType2?.rank3Mois === undefined || classementlocal?.data?.classementType2?.rank3Moistotal === undefined || classementlocal?.data?.classementType2?.rank3Mois == 0
                                                                ? "-"
                                                                : Math.ceil(
                                                                    (classementlocal?.data?.classementType2?.rank3Mois /
                                                                        classementlocal?.data?.classementType2?.rank3Moistotal) *
                                                                    4
                                                                )}
                                                        </td>
                                                        <td>
                                                            {[4, 3, 2, 1].map((index) => (
                                                                <div
                                                                    key={index}
                                                                    className={`quartile-default quartile-${index + 1 >
                                                                        Math.ceil(
                                                                            (classementlocal?.data?.classementType2?.rank3Mois /
                                                                                classementlocal?.data?.classementType2?.rank3Moistotal) *
                                                                            4
                                                                        )
                                                                        ? quartileColors[
                                                                        Math.ceil(
                                                                            (classementlocal?.data?.classementType2?.rank3Mois /
                                                                                classementlocal?.data?.classementType2?.rank3Moistotal) *
                                                                            4
                                                                        )
                                                                        ]
                                                                        : 'default'
                                                                        }`}
                                                                ></div>
                                                            ))}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>6 mois</td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            {classementlocal?.data?.classementType2?.rank6Mois === undefined || classementlocal?.data?.classementType2?.rank6Mois == 0
                                                                ? "-"
                                                                : `${classementlocal?.data?.classementType2?.rank6Mois} / ${classementlocal?.data?.classementType2?.rank6Moistotal}`}
                                                        </td>
                                                        <td className="text-right">
                                                            {classementlocal?.data?.classementType2?.rank6Mois === undefined || classementlocal?.data?.classementType2?.rank6Moistotal === undefined || classementlocal?.data?.classementType2?.rank6Mois == 0
                                                                ? "-"
                                                                : Math.ceil(
                                                                    (classementlocal?.data?.classementType2?.rank6Mois /
                                                                        classementlocal?.data?.classementType2?.rank6Moistotal) *
                                                                    4
                                                                )}
                                                        </td>
                                                        <td>
                                                            {[4, 3, 2, 1].map((index) => (
                                                                <div
                                                                    key={index}
                                                                    className={`quartile-default quartile-${index + 1 >
                                                                        Math.ceil(
                                                                            (classementlocal?.data?.classementType2?.rank6Mois /
                                                                                classementlocal?.data?.classementType2?.rank6Moistotal) *
                                                                            4
                                                                        )
                                                                        ? quartileColors[
                                                                        Math.ceil(
                                                                            (classementlocal?.data?.classementType2?.rank6Mois /
                                                                                classementlocal?.data?.classementType2?.rank6Moistotal) *
                                                                            4
                                                                        )
                                                                        ]
                                                                        : 'default'
                                                                        }`}
                                                                ></div>
                                                            ))}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>YTD</td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            {classementlocal?.data?.classementType2?.rank1erJanvier === undefined || classementlocal?.data?.classementType2?.rank1erJanvier == 0
                                                                ? "-"
                                                                : `${classementlocal?.data?.classementType2?.rank1erJanvier} / ${classementlocal?.data?.classementType2?.rank1erJanviertotal}`}
                                                        </td>
                                                        <td className="text-right">
                                                            {classementlocal?.data?.classementType2?.rank1erJanvier === undefined || classementlocal?.data?.classementType2?.rank1erJanviertotal === undefined || classementlocal?.data?.classementType2?.rank1erJanvier == 0
                                                                ? "-"
                                                                : Math.ceil(
                                                                    (classementlocal?.data?.classementType2?.rank1erJanvier /
                                                                        classementlocal?.data?.classementType2?.rank1erJanviertotal) *
                                                                    4
                                                                )}
                                                        </td>
                                                        <td>
                                                            {[4, 3, 2, 1].map((index) => (
                                                                <div
                                                                    key={index}
                                                                    className={`quartile-default quartile-${index + 1 >
                                                                        Math.ceil(
                                                                            (classementlocal?.data?.classementType2?.rank1erJanvier /
                                                                                classementlocal?.data?.classementType2?.rank1erJanviertotal) *
                                                                            4
                                                                        )
                                                                        ? quartileColors[
                                                                        Math.ceil(
                                                                            (classementlocal?.data?.classementType2?.rank1erJanvier /
                                                                                classementlocal?.data?.classementType2?.rank1erJanviertotal) *
                                                                            4
                                                                        )
                                                                        ]
                                                                        : 'default'
                                                                        }`}
                                                                ></div>
                                                            ))}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>1 an</td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            {classementlocal?.data?.classementType2?.rank1An === undefined || classementlocal?.data?.classementType2?.rank1An == 0
                                                                ? "-"
                                                                : `${classementlocal?.data?.classementType2?.rank1An} / ${classementlocal?.data?.classementType2?.rank1Antotal}`}
                                                        </td>
                                                        <td className="text-right">
                                                            {classementlocal?.data?.classementType2?.rank1An === undefined || classementlocal?.data?.classementType2?.rank1Antotal === undefined || classementlocal?.data?.classementType2?.rank1An == 0
                                                                ? "-"
                                                                : Math.ceil(
                                                                    (classementlocal?.data?.classementType2?.rank1An /
                                                                        classementlocal?.data?.classementType2?.rank1Antotal) *
                                                                    4
                                                                )}
                                                        </td>
                                                        <td>
                                                            {[4, 3, 2, 1].map((index) => (
                                                                <div
                                                                    key={index}
                                                                    className={`quartile-default quartile-${index + 1 >
                                                                        Math.ceil(
                                                                            (classementlocal?.data?.classementType2?.rank1An /
                                                                                classementlocal?.data?.classementType2?.rank1Antotal) *
                                                                            4
                                                                        )
                                                                        ? quartileColors[
                                                                        Math.ceil(
                                                                            (classementlocal?.data?.classementType2?.rank1An /
                                                                                classementlocal?.data?.classementType2?.rank1Antotal) *
                                                                            4
                                                                        )
                                                                        ]
                                                                        : 'default'
                                                                        }`}
                                                                ></div>
                                                            ))}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>3 ans</td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            {classementlocal?.data?.classementType2?.rank3Ans === undefined || classementlocal?.data?.classementType2?.rank3Ans == 0
                                                                ? "-"
                                                                : `${classementlocal?.data?.classementType2?.rank3Ans} / ${classementlocal?.data?.classementType2?.rank3Anstotal}`}
                                                        </td>
                                                        <td className="text-right">
                                                            {classementlocal?.data?.classementType2?.rank3Ans === undefined || classementlocal?.data?.classementType2?.rank3Anstotal === undefined || classementlocal?.data?.classementType2?.rank3Ans == 0
                                                                ? "-"
                                                                : Math.ceil(
                                                                    (classementlocal?.data?.classementType2?.rank3Ans /
                                                                        classementlocal?.data?.classementType2?.rank3Anstotal) *
                                                                    4
                                                                )}
                                                        </td>
                                                        <td>
                                                            {[4, 3, 2, 1].map((index) => (
                                                                <div
                                                                    key={index}
                                                                    className={`quartile-default quartile-${index + 1 >
                                                                        Math.ceil(
                                                                            (classementlocal?.data?.classementType2?.rank3Ans /
                                                                                classementlocal?.data?.classementType2?.rank3Anstotal) *
                                                                            4
                                                                        )
                                                                        ? quartileColors[
                                                                        Math.ceil(
                                                                            (classementlocal?.data?.classementType2?.rank3Ans /
                                                                                classementlocal?.data?.classementType2?.rank3Anstotal) *
                                                                            4
                                                                        )
                                                                        ]
                                                                        : 'default'
                                                                        }`}
                                                                ></div>
                                                            ))}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>5 ans</td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            {classementlocal?.data?.classementType2?.rank5Ans === undefined || classementlocal?.data?.classementType2?.rank5Ans == 0
                                                                ? "-"
                                                                : `${classementlocal?.data?.classementType2?.rank5Ans} / ${classementlocal?.data?.classementType2?.rank5Anstotal}`}
                                                        </td>
                                                        <td className="text-right">
                                                            {classementlocal?.data?.classementType2?.rank5Ans === undefined || classementlocal?.data?.classementType2?.rank5Anstotal === undefined || classementlocal?.data?.classementType2?.rank5Ans == 0
                                                                ? "-"
                                                                : Math.ceil(
                                                                    (classementlocal?.data?.classementType2?.rank5Ans /
                                                                        classementlocal?.data?.classementType2?.rank5Anstotal) *
                                                                    4
                                                                )}
                                                        </td>
                                                        <td>
                                                            {[4, 3, 2, 1].map((index) => (
                                                                <div
                                                                    key={index}
                                                                    className={`quartile-default quartile-${index + 1 >
                                                                        Math.ceil(
                                                                            (classementlocal?.data?.classementType2?.rank5Ans /
                                                                                classementlocal?.data?.classementType2?.rank5Anstotal) *
                                                                            4
                                                                        )
                                                                        ? quartileColors[
                                                                        Math.ceil(
                                                                            (classementlocal?.data?.classementType2?.rank5Ans /
                                                                                classementlocal?.data?.classementType2?.rank5Anstotal) *
                                                                            4
                                                                        )
                                                                        ]
                                                                        : 'default'
                                                                        }`}
                                                                ></div>
                                                            ))}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>



                                        </div>
                                    </div>

                                </div>

                            </div>
                            <div className="row col-md-8">
                                <div className="col-md-6">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="d-md-flex justify-content-between align-items-center">
                                                <div className="row">
                                                    <p><span className="text-primary">Indicateurs de risque au {post?.data?.lastdatepreviousmonth}</span> | <span className="text-fade"></span></p>

                                                </div>

                                            </div>

                                            <table className="table table-sm">
                                                <thead className="table-header">
                                                    <tr className="th-no-border row-title">
                                                        <th className="no-left-padding value" colSpan={2}>
                                                            valeur à 3 ans
                                                        </th>

                                                        <th colSpan={2} className="rapport-cat">
                                                            Par rapport à la Cat
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr className="row-content">
                                                        <td className="titre">
                                                            Volatilité{' '}
                                                            <span
                                                                data-content="Le risque est mesuré par l'écart-type des rendements hebdomadaires du fonds sur différentes périodes : 1 an, 3 ans, 5 ans, ou sur une période définie par l'utilisateur. On parle aussi parfois de volatilité. Plus le fonds est volatil, plus grande est la fourchette des performances possibles, qu'elles soient positives ou négatives. Toutes choses étant égales par ailleurs, moins le risque est élevé, meilleur a été le fonds pour l'investisseur, mais certains fonds ont à la fois un risque élevé et des performances passées excellentes, il faut donc savoir séparer le bon risque du mauvais risque."
                                                                data-helper-explanation=""
                                                                data-trigger="hover"
                                                                data-tooltip-isinit="true"
                                                            ></span>
                                                        </td>
                                                        <td className="value highlight text-center no-wrap">{isNaN(parseFloat(post?.data?.ratios3a?.data?.volatility)) ? '-' : parseFloat(post?.data?.ratios3a?.data?.volatility).toFixed(2)} %</td>

                                                        <td className="notation">
                                                            {getNotationClasses(classementlocal?.data?.classementType1?.rankvolatilite, classementlocal?.data?.classementType1?.rankvolatilitetotal).map((className, index) => (
                                                                <div key={index} className={className}></div>
                                                            ))}
                                                        </td>
                                                        <td className="estimation highlight">
                                                            {getEstimationText(Math.ceil((classementlocal?.data?.classementType1?.rankvolatilite / classementlocal?.data?.classementType1?.rankvolatilitetotal) * 5))}
                                                        </td>
                                                    </tr>
                                                    <tr className="row-content">
                                                        <td className="titre">
                                                            Perte max{' '}
                                                            <span
                                                                data-content="Il s'agit de la perte la plus importante encourue par le fonds sur la période, c’est-à-dire ce qui aurait été perdu si le fonds avait été acheté au plus haut et vendu au plus bas possible sur la période."
                                                                data-helper-explanation=""
                                                                data-trigger="hover"
                                                                data-tooltip-isinit="true"
                                                            ></span>
                                                        </td>
                                                        <td className="value highlight text-center no-wrap">{isNaN(parseFloat(post?.data?.ratios3a?.data?.maxDrawdown)) ? '-' : parseFloat(post?.data?.ratios3a?.data?.maxDrawdown).toFixed(2)} %</td>
                                                        <td className="notation">
                                                            {getNotationClasses(classementlocal?.data?.classementType1?.rankpertemax, classementlocal?.data?.classementType1?.rankpertemaxtotal).map((className, index) => (
                                                                <div key={index} className={className}></div>
                                                            ))}
                                                        </td>
                                                        <td className="estimation highlight">
                                                            {getEstimationText(Math.ceil((classementlocal?.data?.classementType1?.rankpertemax / classementlocal?.data?.classementType1?.rankpertemaxtotal) * 5))}
                                                        </td>

                                                    </tr>
                                                    <tr className="row-content">
                                                        <td className="titre">
                                                            DSR{' '}
                                                            <span
                                                                data-content="La volatilité considère les écarts de performance négatifs comme positifs par rapport à la performance moyenne du fonds, alors que l'investisseur n'est généralement concerné que par les performances inférieures à un certain seuil. Le downside risk (DSR) ne va prendre en compte que les rendements inférieurs à ce seuil pour en calculer la volatilité. Nous utilisons l'EONIA, qui mesure le taux de l'argent au jour le jour, et ne retenons que les rendements mensuels inférieurs à l'EONIA pour calculer le downside risk du fonds. Comme pour la volatilité classique, plus le downside risk est grand, plus la stratégie appliquée par le fonds est risquée."
                                                                data-helper-explanation=""
                                                                data-trigger="hover"
                                                                data-tooltip-isinit="true"
                                                            ></span>
                                                        </td>
                                                        <td className="value highlight text-center no-wrap">{isNaN(parseFloat(post?.data?.ratios3a?.data?.dsr)) ? '-' : parseFloat(post?.data?.ratios3a?.data?.dsr).toFixed(2)} %</td>
                                                        <td className="notation">
                                                            {getNotationClasses(classementlocal?.data?.classementType1?.rankdsr, classementlocal?.data?.classementType1?.rankdsrtotal).map((className, index) => (
                                                                <div key={index} className={className}></div>
                                                            ))}
                                                        </td>
                                                        <td className="estimation highlight">
                                                            {getEstimationText(Math.ceil((classementlocal?.data?.classementType1?.rankdsr / classementlocal?.data?.classementType1?.rankdsrtotal) * 5))}
                                                        </td>
                                                    </tr>
                                                    <tr className="row-content">
                                                        <td className="titre">
                                                            Beta baiss.{' '}
                                                            <span
                                                                data-content="Le bêta d'un fonds  est un coefficient de volatilité mesurant la relation entre les fluctuations de la valeur du fonds et celles de son marché quand ce dernier est en baisse. On le calcule en régressant les rendements mensuels du fonds sur les rendements mensuels négatifs de l'indice de référence de sa catégorie. On affecte au marché un bêta de 1 : un fonds ayant un beta baissier de 1,2 sera 20% plus réactif que le marché quand celui-ci baisse (et donc baissera plus que le marché), un fonds ayant un bêta baissier de 0,8 sera 20% moins réactif que le marché quand celui-ci baisse (et donc baissera moins que le marché)."
                                                                data-helper-explanation=""
                                                                data-trigger="hover"
                                                                data-tooltip-isinit="true"
                                                            ></span>
                                                        </td>
                                                        <td className="value highlight text-center no-wrap">{isNaN(parseFloat(post?.data?.ratios3a?.data?.betaBaiss)) ? '-' : parseFloat(post?.data?.ratios3a?.data?.betaBaiss).toFixed(2)}</td>
                                                        <td className="notation">
                                                            {getNotationClasses(classementlocal?.data?.classementType1?.rankbetabaissier, classementlocal?.data?.classementType1?.rankbetabaissiertotal).map((className, index) => (
                                                                <div key={index} className={className}></div>
                                                            ))}
                                                        </td>
                                                        <td className="estimation highlight">
                                                            {getEstimationText(Math.ceil((classementlocal?.data?.classementType1?.rankbetabaissier / classementlocal?.data?.classementType1?.rankbetabaissiertotal) * 5))}
                                                        </td>
                                                    </tr>
                                                    <tr className="row-content">
                                                        <td className="titre">
                                                            VAR 95{' '}
                                                            <span
                                                                data-content="Il s'agit de la Var historique 95, c'est à dire du rendement au dessus duquel 95% des rendements hebdomadaires ont été constatés. Par exemple si la Var est de -2% cela signifie que la performance hebdomadaire a été supérieure à -2% dans 95% des cas et inférieure dans 5% des cas."
                                                                data-helper-explanation=""
                                                                data-trigger="hover"
                                                                data-tooltip-isinit="true"
                                                            ></span>
                                                        </td>
                                                        <td className="value highlight text-center no-wrap">{isNaN(parseFloat(post?.data?.ratios3a?.data?.VAR95)) ? '-' : parseFloat(post?.data?.ratios3a?.data?.VAR95).toFixed(2)} %</td>
                                                        <td className="notation">
                                                            {getNotationClasses(classementlocal?.data?.classementType1?.rankvar95, classementlocal?.data?.classementType1?.rankvar95total).map((className, index) => (
                                                                <div key={index} className={className}></div>
                                                            ))}
                                                        </td>
                                                        <td className="estimation highlight">
                                                            {getEstimationText(Math.ceil((classementlocal?.data?.classementType1?.rankvar95 / classementlocal?.data?.classementType1?.rankvar95total) * 5))}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>



                                        </div>
                                    </div>

                                </div>
                                <div className="col-md-6">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="d-md-flex justify-content-between align-items-center">
                                                <div className="row">
                                                    <p><span className="text-primary">L œil de l expert au {post?.data?.lastdatepreviousmonth}</span> | <span className="text-fade"></span></p>

                                                </div>

                                            </div>

                                            <table className="table table-sm">
                                                <thead className="table-header">
                                                    <tr className="th-no-border row-title">
                                                        <th className="no-left-padding value" colSpan={2}>
                                                            valeur à 3 ans
                                                        </th>

                                                        <th colSpan={2} className="rapport-cat">
                                                            Par rapport à la Cat
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr className="row-content">
                                                        <td className="titre">
                                                            Sharpe{' '}
                                                            <span
                                                                data-content="Le risque est mesuré par l'écart-type des rendements hebdomadaires du fonds sur différentes périodes : 1 an, 3 ans, 5 ans, ou sur une période définie par l'utilisateur. On parle aussi parfois de volatilité. Plus le fonds est volatil, plus grande est la fourchette des performances possibles, qu'elles soient positives ou négatives. Toutes choses étant égales par ailleurs, moins le risque est élevé, meilleur a été le fonds pour l'investisseur, mais certains fonds ont à la fois un risque élevé et des performances passées excellentes, il faut donc savoir séparer le bon risque du mauvais risque."
                                                                data-helper-explanation=""
                                                                data-trigger="hover"
                                                                data-tooltip-isinit="true"
                                                            ></span>
                                                        </td>
                                                        <td className="value highlight text-center no-wrap">{isNaN(parseFloat(post?.data?.ratios3a?.data?.ratioSharpe)) ? '-' : parseFloat(post?.data?.ratios3a?.data?.ratioSharpe).toFixed(2)} </td>
                                                        <td className="notation">
                                                            {getNotationClasses(classementlocal?.data?.classementType1?.ranksharpe, classementlocal?.data?.classementType1?.ranksharpetotal).map((className, index) => (
                                                                <div key={index} className={className}></div>
                                                            ))}
                                                        </td>
                                                        <td className="estimation highlight">
                                                            {getEstimationText(Math.ceil((classementlocal?.data?.classementType1?.ranksharpe / classementlocal?.data?.classementType1?.ranksharpetotal) * 5))}
                                                        </td>
                                                    </tr>
                                                    <tr className="row-content">
                                                        <td className="titre">
                                                            Ratio Inf{' '}
                                                            <span
                                                                data-content="Il s'agit de la perte la plus importante encourue par le fonds sur la période, c’est-à-dire ce qui aurait été perdu si le fonds avait été acheté au plus haut et vendu au plus bas possible sur la période."
                                                                data-helper-explanation=""
                                                                data-trigger="hover"
                                                                data-tooltip-isinit="true"
                                                            ></span>
                                                        </td>
                                                        <td className="value highlight text-center no-wrap">{isNaN(parseFloat(post?.data?.ratios3a?.data?.info)) ? '-' : parseFloat(post?.data?.ratios3a?.data?.info).toFixed(2)} </td>
                                                        <td className="notation">
                                                            {getNotationClasses(classementlocal?.data?.classementType1?.rankinfo, classementlocal?.data?.classementType1?.rankinfototal).map((className, index) => (
                                                                <div key={index} className={className}></div>
                                                            ))}
                                                        </td>
                                                        <td className="estimation highlight">
                                                            {getEstimationText(Math.ceil((classementlocal?.data?.classementType1?.rankinfo / classementlocal?.data?.classementType1?.rankinfototal) * 5))}
                                                        </td>
                                                    </tr>
                                                    <tr className="row-content">
                                                        <td className="titre">
                                                            Sortino{' '}
                                                            <span
                                                                data-content="La volatilité considère les écarts de performance négatifs comme positifs par rapport à la performance moyenne du fonds, alors que l'investisseur n'est généralement concerné que par les performances inférieures à un certain seuil. Le downside risk (DSR) ne va prendre en compte que les rendements inférieurs à ce seuil pour en calculer la volatilité. Nous utilisons l'EONIA, qui mesure le taux de l'argent au jour le jour, et ne retenons que les rendements mensuels inférieurs à l'EONIA pour calculer le downside risk du fonds. Comme pour la volatilité classique, plus le downside risk est grand, plus la stratégie appliquée par le fonds est risquée."
                                                                data-helper-explanation=""
                                                                data-trigger="hover"
                                                                data-tooltip-isinit="true"
                                                            ></span>
                                                        </td>
                                                        <td className="value highlight text-center no-wrap">{isNaN(parseFloat(post?.data?.ratios3a?.data?.sortino)) ? '-' : parseFloat(post?.data?.ratios3a?.data?.sortino).toFixed(2)} </td>
                                                        <td className="notation">
                                                            {getNotationClasses(classementlocal?.data?.classementType1?.ranksortino, classementlocal?.data?.classementType1?.ranksortinototal).map((className, index) => (
                                                                <div key={index} className={className}></div>
                                                            ))}
                                                        </td>
                                                        <td className="estimation highlight">
                                                            {getEstimationText(Math.ceil((classementlocal?.data?.classementType1?.ranksortino / classementlocal?.data?.classementType1?.ranksortinototal) * 5))}
                                                        </td>
                                                    </tr>
                                                    <tr className="row-content">
                                                        <td className="titre">
                                                            Omega{' '}
                                                            <span
                                                                data-content="Le bêta d'un fonds  est un coefficient de volatilité mesurant la relation entre les fluctuations de la valeur du fonds et celles de son marché quand ce dernier est en baisse. On le calcule en régressant les rendements mensuels du fonds sur les rendements mensuels négatifs de l'indice de référence de sa catégorie. On affecte au marché un bêta de 1 : un fonds ayant un beta baissier de 1,2 sera 20% plus réactif que le marché quand celui-ci baisse (et donc baissera plus que le marché), un fonds ayant un bêta baissier de 0,8 sera 20% moins réactif que le marché quand celui-ci baisse (et donc baissera moins que le marché)."
                                                                data-helper-explanation=""
                                                                data-trigger="hover"
                                                                data-tooltip-isinit="true"
                                                            ></span>
                                                        </td>
                                                        <td className="value highlight text-center no-wrap">{isNaN(parseFloat(post?.data?.ratios3a?.data?.omega)) ? '-' : parseFloat(post?.data?.ratios3a?.data?.omega).toFixed(2)} </td>
                                                        <td className="notation">
                                                            {getNotationClasses(classementlocal?.data?.classementType1?.rankomega, classementlocal?.data?.classementType1?.rankomegatotal).map((className, index) => (
                                                                <div key={index} className={className}></div>
                                                            ))}
                                                        </td>
                                                        <td className="estimation highlight">
                                                            {getEstimationText(Math.ceil((classementlocal?.data?.classementType1?.rankomega / classementlocal?.data?.classementType1?.rankomegatotal) * 5))}
                                                        </td>
                                                    </tr>
                                                    <tr className="row-content">
                                                        <td className="titre">
                                                            Calamar{' '}
                                                            <span
                                                                data-content="Il s'agit de la Var historique 95, c'est à dire du rendement au dessus duquel 95% des rendements hebdomadaires ont été constatés. Par exemple si la Var est de -2% cela signifie que la performance hebdomadaire a été supérieure à -2% dans 95% des cas et inférieure dans 5% des cas."
                                                                data-helper-explanation=""
                                                                data-trigger="hover"
                                                                data-tooltip-isinit="true"
                                                            ></span>
                                                        </td>
                                                        <td className="value highlight text-center no-wrap">{isNaN(parseFloat(post?.data?.ratios3a?.data?.calmar)) ? '-' : parseFloat(post?.data?.ratios3a?.data?.calmar).toFixed(2)} %</td>
                                                        <td className="notation">
                                                            {getNotationClasses(classementlocal?.data?.classementType1?.rankcalamar, classementlocal?.data?.classementType1?.rankcalamartotal).map((className, index) => (
                                                                <div key={index} className={className}></div>
                                                            ))}
                                                        </td>
                                                        <td className="estimation highlight">
                                                            {getEstimationText(Math.ceil((classementlocal?.data?.classementType1?.rankcalamar / classementlocal?.data?.classementType1?.rankcalamartotal) * 5))}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>



                                        </div>
                                    </div>

                                </div>
                                <div className="col-md-6">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="d-md-flex justify-content-between align-items-center">
                                                <div className="row">
                                                    <p><span className="text-primary">Indicateurs de risque au {post?.data?.lastdatepreviousmonth}</span> | <span className="text-fade"></span></p>

                                                </div>

                                            </div>

                                            <table className="table table-sm">
                                                <thead className="table-header">
                                                    <tr className="th-no-border row-title">
                                                        <th className="no-left-padding value" colSpan={2}>
                                                            valeur à 3 ans
                                                        </th>

                                                        <th colSpan={2} className="rapport-cat">
                                                            Par rapport à la Cat
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr className="row-content">
                                                        <td className="titre">
                                                            Volatilité{' '}
                                                            <span
                                                                data-content="Le risque est mesuré par l'écart-type des rendements hebdomadaires du fonds sur différentes périodes : 1 an, 3 ans, 5 ans, ou sur une période définie par l'utilisateur. On parle aussi parfois de volatilité. Plus le fonds est volatil, plus grande est la fourchette des performances possibles, qu'elles soient positives ou négatives. Toutes choses étant égales par ailleurs, moins le risque est élevé, meilleur a été le fonds pour l'investisseur, mais certains fonds ont à la fois un risque élevé et des performances passées excellentes, il faut donc savoir séparer le bon risque du mauvais risque."
                                                                data-helper-explanation=""
                                                                data-trigger="hover"
                                                                data-tooltip-isinit="true"
                                                            ></span>
                                                        </td>
                                                        <td className="value highlight text-center no-wrap">{isNaN(parseFloat(post?.data?.ratios3a?.data?.volatility)) ? '-' : parseFloat(post?.data?.ratios3a?.data?.volatility).toFixed(2)} %</td>

                                                        <td className="notation">
                                                            {getNotationClasses(classementlocal?.data?.classementType1?.rankvolatilite, classementlocal?.data?.classementType1?.rankvolatilitetotal).map((className, index) => (
                                                                <div key={index} className={className}></div>
                                                            ))}
                                                        </td>
                                                        <td className="estimation highlight">
                                                            {getEstimationText(Math.ceil((classementlocal?.data?.classementType1?.rankvolatilite / classementlocal?.data?.classementType1?.rankvolatilitetotal) * 5))}
                                                        </td>
                                                    </tr>
                                                    <tr className="row-content">
                                                        <td className="titre">
                                                            Perte max{' '}
                                                            <span
                                                                data-content="Il s'agit de la perte la plus importante encourue par le fonds sur la période, c’est-à-dire ce qui aurait été perdu si le fonds avait été acheté au plus haut et vendu au plus bas possible sur la période."
                                                                data-helper-explanation=""
                                                                data-trigger="hover"
                                                                data-tooltip-isinit="true"
                                                            ></span>
                                                        </td>
                                                        <td className="value highlight text-center no-wrap">{isNaN(parseFloat(post?.data?.ratios3a?.data?.maxDrawdown)) ? '-' : parseFloat(post?.data?.ratios3a?.data?.maxDrawdown).toFixed(2)} %</td>
                                                        <td className="notation">
                                                            {getNotationClasses(classementlocal?.data?.classementType1?.rankpertemax, classementlocal?.data?.classementType1?.rankpertemaxtotal).map((className, index) => (
                                                                <div key={index} className={className}></div>
                                                            ))}
                                                        </td>
                                                        <td className="estimation highlight">
                                                            {getEstimationText(Math.ceil((classementlocal?.data?.classementType1?.rankpertemax / classementlocal?.data?.classementType1?.rankpertemaxtotal) * 5))}
                                                        </td>

                                                    </tr>
                                                    <tr className="row-content">
                                                        <td className="titre">
                                                            DSR{' '}
                                                            <span
                                                                data-content="La volatilité considère les écarts de performance négatifs comme positifs par rapport à la performance moyenne du fonds, alors que l'investisseur n'est généralement concerné que par les performances inférieures à un certain seuil. Le downside risk (DSR) ne va prendre en compte que les rendements inférieurs à ce seuil pour en calculer la volatilité. Nous utilisons l'EONIA, qui mesure le taux de l'argent au jour le jour, et ne retenons que les rendements mensuels inférieurs à l'EONIA pour calculer le downside risk du fonds. Comme pour la volatilité classique, plus le downside risk est grand, plus la stratégie appliquée par le fonds est risquée."
                                                                data-helper-explanation=""
                                                                data-trigger="hover"
                                                                data-tooltip-isinit="true"
                                                            ></span>
                                                        </td>
                                                        <td className="value highlight text-center no-wrap">{isNaN(parseFloat(post?.data?.ratios3a?.data?.dsr)) ? '-' : parseFloat(post?.data?.ratios3a?.data?.dsr).toFixed(2)} %</td>
                                                        <td className="notation">
                                                            {getNotationClasses(classementlocal?.data?.classementType1?.rankdsr, classementlocal?.data?.classementType1?.rankdsrtotal).map((className, index) => (
                                                                <div key={index} className={className}></div>
                                                            ))}
                                                        </td>
                                                        <td className="estimation highlight">
                                                            {getEstimationText(Math.ceil((classementlocal?.data?.classementType1?.rankdsr / classementlocal?.data?.classementType1?.rankdsrtotal) * 5))}
                                                        </td>
                                                    </tr>
                                                    <tr className="row-content">
                                                        <td className="titre">
                                                            Beta baiss.{' '}
                                                            <span
                                                                data-content="Le bêta d'un fonds  est un coefficient de volatilité mesurant la relation entre les fluctuations de la valeur du fonds et celles de son marché quand ce dernier est en baisse. On le calcule en régressant les rendements mensuels du fonds sur les rendements mensuels négatifs de l'indice de référence de sa catégorie. On affecte au marché un bêta de 1 : un fonds ayant un beta baissier de 1,2 sera 20% plus réactif que le marché quand celui-ci baisse (et donc baissera plus que le marché), un fonds ayant un bêta baissier de 0,8 sera 20% moins réactif que le marché quand celui-ci baisse (et donc baissera moins que le marché)."
                                                                data-helper-explanation=""
                                                                data-trigger="hover"
                                                                data-tooltip-isinit="true"
                                                            ></span>
                                                        </td>
                                                        <td className="value highlight text-center no-wrap">{isNaN(parseFloat(post?.data?.ratios3a?.data?.betaBaiss)) ? '-' : parseFloat(post?.data?.ratios3a?.data?.betaBaiss).toFixed(2)}</td>
                                                        <td className="notation">
                                                            {getNotationClasses(classementlocal?.data?.classementType1?.rankbetabaissier, classementlocal?.data?.classementType1?.rankbetabaissiertotal).map((className, index) => (
                                                                <div key={index} className={className}></div>
                                                            ))}
                                                        </td>
                                                        <td className="estimation highlight">
                                                            {getEstimationText(Math.ceil((classementlocal?.data?.classementType1?.rankbetabaissier / classementlocal?.data?.classementType1?.rankbetabaissiertotal) * 5))}
                                                        </td>
                                                    </tr>
                                                    <tr className="row-content">
                                                        <td className="titre">
                                                            VAR 95{' '}
                                                            <span
                                                                data-content="Il s'agit de la Var historique 95, c'est à dire du rendement au dessus duquel 95% des rendements hebdomadaires ont été constatés. Par exemple si la Var est de -2% cela signifie que la performance hebdomadaire a été supérieure à -2% dans 95% des cas et inférieure dans 5% des cas."
                                                                data-helper-explanation=""
                                                                data-trigger="hover"
                                                                data-tooltip-isinit="true"
                                                            ></span>
                                                        </td>
                                                        <td className="value highlight text-center no-wrap">{isNaN(parseFloat(post?.data?.ratios3a?.data?.VAR95)) ? '-' : parseFloat(post?.data?.ratios3a?.data?.VAR95).toFixed(2)} %</td>
                                                        <td className="notation">
                                                            {getNotationClasses(classementlocal?.data?.classementType1?.rankvar95, classementlocal?.data?.classementType1?.rankvar95total).map((className, index) => (
                                                                <div key={index} className={className}></div>
                                                            ))}
                                                        </td>
                                                        <td className="estimation highlight">
                                                            {getEstimationText(Math.ceil((classementlocal?.data?.classementType1?.rankvar95 / classementlocal?.data?.classementType1?.rankvar95total) * 5))}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>



                                        </div>
                                    </div>

                                </div>
                                <div className="col-md-6">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="d-md-flex justify-content-between align-items-center">
                                                <div className="row">
                                                    <p><span className="text-primary">L œil de l expert au {post?.data?.lastdatepreviousmonth}</span> | <span className="text-fade"></span></p>

                                                </div>

                                            </div>

                                            <table className="table table-sm">
                                                <thead className="table-header">
                                                    <tr className="th-no-border row-title">
                                                        <th className="no-left-padding value" colSpan={2}>
                                                            valeur à 3 ans
                                                        </th>

                                                        <th colSpan={2} className="rapport-cat">
                                                            Par rapport à la Cat
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr className="row-content">
                                                        <td className="titre">
                                                            Sharpe{' '}
                                                            <span
                                                                data-content="Le risque est mesuré par l'écart-type des rendements hebdomadaires du fonds sur différentes périodes : 1 an, 3 ans, 5 ans, ou sur une période définie par l'utilisateur. On parle aussi parfois de volatilité. Plus le fonds est volatil, plus grande est la fourchette des performances possibles, qu'elles soient positives ou négatives. Toutes choses étant égales par ailleurs, moins le risque est élevé, meilleur a été le fonds pour l'investisseur, mais certains fonds ont à la fois un risque élevé et des performances passées excellentes, il faut donc savoir séparer le bon risque du mauvais risque."
                                                                data-helper-explanation=""
                                                                data-trigger="hover"
                                                                data-tooltip-isinit="true"
                                                            ></span>
                                                        </td>
                                                        <td className="value highlight text-center no-wrap">{isNaN(parseFloat(post?.data?.ratios3a?.data?.ratioSharpe)) ? '-' : parseFloat(post?.data?.ratios3a?.data?.ratioSharpe).toFixed(2)} </td>
                                                        <td className="notation">
                                                            {getNotationClasses(classementlocal?.data?.classementType1?.ranksharpe, classementlocal?.data?.classementType1?.ranksharpetotal).map((className, index) => (
                                                                <div key={index} className={className}></div>
                                                            ))}
                                                        </td>
                                                        <td className="estimation highlight">
                                                            {getEstimationText(Math.ceil((classementlocal?.data?.classementType1?.ranksharpe / classementlocal?.data?.classementType1?.ranksharpetotal) * 5))}
                                                        </td>
                                                    </tr>
                                                    <tr className="row-content">
                                                        <td className="titre">
                                                            Ratio Inf{' '}
                                                            <span
                                                                data-content="Il s'agit de la perte la plus importante encourue par le fonds sur la période, c’est-à-dire ce qui aurait été perdu si le fonds avait été acheté au plus haut et vendu au plus bas possible sur la période."
                                                                data-helper-explanation=""
                                                                data-trigger="hover"
                                                                data-tooltip-isinit="true"
                                                            ></span>
                                                        </td>
                                                        <td className="value highlight text-center no-wrap">{isNaN(parseFloat(post?.data?.ratios3a?.data?.info)) ? '-' : parseFloat(post?.data?.ratios3a?.data?.info).toFixed(2)} </td>
                                                        <td className="notation">
                                                            {getNotationClasses(classementlocal?.data?.classementType1?.rankinfo, classementlocal?.data?.classementType1?.rankinfototal).map((className, index) => (
                                                                <div key={index} className={className}></div>
                                                            ))}
                                                        </td>
                                                        <td className="estimation highlight">
                                                            {getEstimationText(Math.ceil((classementlocal?.data?.classementType1?.rankinfo / classementlocal?.data?.classementType1?.rankinfototal) * 5))}
                                                        </td>
                                                    </tr>
                                                    <tr className="row-content">
                                                        <td className="titre">
                                                            Sortino{' '}
                                                            <span
                                                                data-content="La volatilité considère les écarts de performance négatifs comme positifs par rapport à la performance moyenne du fonds, alors que l'investisseur n'est généralement concerné que par les performances inférieures à un certain seuil. Le downside risk (DSR) ne va prendre en compte que les rendements inférieurs à ce seuil pour en calculer la volatilité. Nous utilisons l'EONIA, qui mesure le taux de l'argent au jour le jour, et ne retenons que les rendements mensuels inférieurs à l'EONIA pour calculer le downside risk du fonds. Comme pour la volatilité classique, plus le downside risk est grand, plus la stratégie appliquée par le fonds est risquée."
                                                                data-helper-explanation=""
                                                                data-trigger="hover"
                                                                data-tooltip-isinit="true"
                                                            ></span>
                                                        </td>
                                                        <td className="value highlight text-center no-wrap">{isNaN(parseFloat(post?.data?.ratios3a?.data?.sortino)) ? '-' : parseFloat(post?.data?.ratios3a?.data?.sortino).toFixed(2)} </td>
                                                        <td className="notation">
                                                            {getNotationClasses(classementlocal?.data?.classementType1?.ranksortino, classementlocal?.data?.classementType1?.ranksortinototal).map((className, index) => (
                                                                <div key={index} className={className}></div>
                                                            ))}
                                                        </td>
                                                        <td className="estimation highlight">
                                                            {getEstimationText(Math.ceil((classementlocal?.data?.classementType1?.ranksortino / classementlocal?.data?.classementType1?.ranksortinototal) * 5))}
                                                        </td>
                                                    </tr>
                                                    <tr className="row-content">
                                                        <td className="titre">
                                                            Omega{' '}
                                                            <span
                                                                data-content="Le bêta d'un fonds  est un coefficient de volatilité mesurant la relation entre les fluctuations de la valeur du fonds et celles de son marché quand ce dernier est en baisse. On le calcule en régressant les rendements mensuels du fonds sur les rendements mensuels négatifs de l'indice de référence de sa catégorie. On affecte au marché un bêta de 1 : un fonds ayant un beta baissier de 1,2 sera 20% plus réactif que le marché quand celui-ci baisse (et donc baissera plus que le marché), un fonds ayant un bêta baissier de 0,8 sera 20% moins réactif que le marché quand celui-ci baisse (et donc baissera moins que le marché)."
                                                                data-helper-explanation=""
                                                                data-trigger="hover"
                                                                data-tooltip-isinit="true"
                                                            ></span>
                                                        </td>
                                                        <td className="value highlight text-center no-wrap">{isNaN(parseFloat(post?.data?.ratios3a?.data?.omega)) ? '-' : parseFloat(post?.data?.ratios3a?.data?.omega).toFixed(2)} </td>
                                                        <td className="notation">
                                                            {getNotationClasses(classementlocal?.data?.classementType1?.rankomega, classementlocal?.data?.classementType1?.rankomegatotal).map((className, index) => (
                                                                <div key={index} className={className}></div>
                                                            ))}
                                                        </td>
                                                        <td className="estimation highlight">
                                                            {getEstimationText(Math.ceil((classementlocal?.data?.classementType1?.rankomega / classementlocal?.data?.classementType1?.rankomegatotal) * 5))}
                                                        </td>
                                                    </tr>
                                                    <tr className="row-content">
                                                        <td className="titre">
                                                            Calamar{' '}
                                                            <span
                                                                data-content="Il s'agit de la Var historique 95, c'est à dire du rendement au dessus duquel 95% des rendements hebdomadaires ont été constatés. Par exemple si la Var est de -2% cela signifie que la performance hebdomadaire a été supérieure à -2% dans 95% des cas et inférieure dans 5% des cas."
                                                                data-helper-explanation=""
                                                                data-trigger="hover"
                                                                data-tooltip-isinit="true"
                                                            ></span>
                                                        </td>
                                                        <td className="value highlight text-center no-wrap">{isNaN(parseFloat(post?.data?.ratios3a?.data?.calmar)) ? '-' : parseFloat(post?.data?.ratios3a?.data?.calmar).toFixed(2)} %</td>
                                                        <td className="notation">
                                                            {getNotationClasses(classementlocal?.data?.classementType1?.rankcalamar, classementlocal?.data?.classementType1?.rankcalamartotal).map((className, index) => (
                                                                <div key={index} className={className}></div>
                                                            ))}
                                                        </td>
                                                        <td className="estimation highlight">
                                                            {getEstimationText(Math.ceil((classementlocal?.data?.classementType1?.rankcalamar / classementlocal?.data?.classementType1?.rankcalamartotal) * 5))}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>



                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="d-md-flex justify-content-between align-items-center">
                                            <div className="row">
                                                <p><span className="text-primary">Caractéristiques générales</span> | <span className="text-fade"></span></p>

                                            </div>

                                        </div>

                                        <table className="table table-sm">
                                            <thead className="table-header">
                                                <tr>
                                                    <td> Structure juridique du fonds</td>
                                                    <td className="text-right highlight">
                                                        {post?.data?.structure_fond}
                                                    </td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Affectation des dividendes <span data-content="Un fonds peut réinvestir ses revenus (dividendes ou coupons), il sera alors qualifié de Capi (car il capitalise les revenus) ou bien les distribuer aux porteurs de parts une ou plusieurs fois par an sous forme de dividendes ou de coupons, il sera alors qualifié de Distri (car il distribue ses revenus). Certains fonds laissent la liberté à leur organe de décision de capitaliser ou de distribuer, ils sont alors qualifiés de C/D." data-helper-explanation="" data-trigger="hover" data-tooltip-isinit="true"></span></td>
                                                    <td className="text-right highlight"> {post?.data?.affectation}</td>
                                                </tr>
                                                <br />
                                                <tr>
                                                    <td>Type investissement <span data-content="Une part de fonds est dite couverte (&quot;hedgée&quot; dans le jargon) quand elle neutralise le risque de change d'un investissement par le biais d'achat d'instruments de couverture. Par exemple, un fonds actions américaines est exposé à la fois au risque du marché américain et, pour un investisseur de la zone euro, au risque de change EUR/USD. La couverture neutralise le risque de change et permet d'accéder à la seule performance du marché actions USA, au coût de la couverture près. Si le dollar se déprécie face à l'euro, la couverture est bénéfique, si le dollar se revalorise, elle prive l'investisseur de cette revalorisation." data-helper-explanation="" data-trigger="hover" data-tooltip-isinit="true"></span></td>
                                                    <td className="text-right highlight"> {post?.data?.type_investissement}</td>
                                                </tr>
                                                <br />
                                                <tr>
                                                    <td>Periodicité de valorisation <span data-content="Une part de fonds est dite couverte (&quot;hedgée&quot; dans le jargon) quand elle neutralise le risque de change d'un investissement par le biais d'achat d'instruments de couverture. Par exemple, un fonds actions américaines est exposé à la fois au risque du marché américain et, pour un investisseur de la zone euro, au risque de change EUR/USD. La couverture neutralise le risque de change et permet d'accéder à la seule performance du marché actions USA, au coût de la couverture près. Si le dollar se déprécie face à l'euro, la couverture est bénéfique, si le dollar se revalorise, elle prive l'investisseur de cette revalorisation." data-helper-explanation="" data-trigger="hover" data-tooltip-isinit="true"></span></td>
                                                    <td className="text-right highlight"> {post?.data?.periodicite}</td>
                                                </tr>
                                                <br />
                                                <tr>
                                                    <td>Frais de souscription <span data-content="Certains fonds investissent dans d'autres fonds plutôt que dans des titres en direct. Dès lors qu'ils sont susceptibles, d'après leur prospectus, d'investir à hauteur d'au moins 50% de leur portefeuille dans d'autres OPCVM, nous les considérons comme des fonds de fonds. Un fonds nourricier ne sera pas considéré comme un fonds de fonds, sauf si son fonds maître est lui-même un fonds de fonds. Les fonds de fonds sont soumis à 2 niveaux de frais de gestion : ceux du fonds lui-même et ceux des fonds dans lesquels il investit." data-helper-explanation="" data-trigger="hover" data-tooltip-isinit="true"></span></td>
                                                    <td className="text-right highlight">
                                                        {isNaN(post?.data?.frais_souscription)
                                                            ? "-"
                                                            : (post?.data?.frais_souscription * 100).toFixed(2) + "%"}
                                                    </td>                        </tr>
                                                <br />
                                                <tr>
                                                    <td>Frais de rachat <span data-content="Les fonds éligibles au P.E.A. peuvent être logés dans un Plan d'Epargne en Actions. Ils doivent pour cela satisfaire à certains critères, notamment être exposés à hauteur d'au moins 75% à des actions de sociétés ayant leur siège dans un Etat de l'union européenne." data-helper-explanation="" data-trigger="hover" data-tooltip-isinit="true"></span></td>
                                                    <td className="text-right highlight"> {isNaN(post?.data?.frais_rachat)
                                                        ? "-"
                                                        : (post?.data?.frais_rachat * 100).toFixed(2) + "%"}</td>
                                                </tr>
                                                <br />
                                                <tr>
                                                    <td>Frais de gestion <span data-content="Les fonds éligibles au PEA PME peuvent être logés dans cette enveloppe fiscale privilégiée dans la limite de 75000 € de versements. Attention, les fonds PEA PME peuvent investir dans les actions ET les obligations des PME européennes." data-helper-explanation="" data-trigger="hover" data-tooltip-isinit="true"></span></td>
                                                    <td className="text-right highlight"> {isNaN(post?.data?.frais_gestion)
                                                        ? "-"
                                                        : (post?.data?.frais_gestion * 100).toFixed(2) + "%"} </td>
                                                </tr>
                                                <br />
                                                <tr>
                                                    <td>Variation actif net (3 mois) <span data-content="Un fonds peut réinvestir ses revenus (dividendes ou coupons), il sera alors qualifié de Capi (car il capitalise les revenus) ou bien les distribuer aux porteurs de parts une ou plusieurs fois par an sous forme de dividendes ou de coupons, il sera alors qualifié de Distri (car il distribue ses revenus). Certains fonds laissent la liberté à leur organe de décision de capitaliser ou de distribuer, ils sont alors qualifiés de C/D." data-helper-explanation="" data-trigger="hover" data-tooltip-isinit="true"></span></td>
                                                    <td className="text-right highlight"> {isNaN(post?.data?.performances.data.perf3Moisactif_net)
                                                        ? "-"
                                                        : (post?.data?.performances.data.perf3Moisactif_net).toFixed(2) + "%"} </td>
                                                </tr>
                                                <br />
                                                <tr>
                                                    <td>Frais courants <span data-content="Une part de fonds est dite couverte (&quot;hedgée&quot; dans le jargon) quand elle neutralise le risque de change d'un investissement par le biais d'achat d'instruments de couverture. Par exemple, un fonds actions américaines est exposé à la fois au risque du marché américain et, pour un investisseur de la zone euro, au risque de change EUR/USD. La couverture neutralise le risque de change et permet d'accéder à la seule performance du marché actions USA, au coût de la couverture près. Si le dollar se déprécie face à l'euro, la couverture est bénéfique, si le dollar se revalorise, elle prive l'investisseur de cette revalorisation." data-helper-explanation="" data-trigger="hover" data-tooltip-isinit="true"></span></td>
                                                    <td className="text-right highlight"> {isNaN(post?.data?.frais_entree)
                                                        ? "-"
                                                        : (post?.data?.frais_entree * 100).toFixed(2) + "%"} </td>
                                                </tr>
                                                <br />
                                                <tr>
                                                    <td>Minimun  investissement <span data-content="Certains fonds investissent dans d'autres fonds plutôt que dans des titres en direct. Dès lors qu'ils sont susceptibles, d'après leur prospectus, d'investir à hauteur d'au moins 50% de leur portefeuille dans d'autres OPCVM, nous les considérons comme des fonds de fonds. Un fonds nourricier ne sera pas considéré comme un fonds de fonds, sauf si son fonds maître est lui-même un fonds de fonds. Les fonds de fonds sont soumis à 2 niveaux de frais de gestion : ceux du fonds lui-même et ceux des fonds dans lesquels il investit." data-helper-explanation="" data-trigger="hover" data-tooltip-isinit="true"></span></td>
                                                    <td className="text-right highlight"> {post?.data?.minimum_investissement}</td>
                                                </tr>



                                            </tbody>
                                        </table>

                                    </div>
                                </div>

                            </div>


                            <div className="row">

                                <div className="col-md-12">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="d-md-flex justify-content-between align-items-center">
                                                <p><span className="text-primary">
                                                    Pré-selection quantitative</span></p>
                                                <table className="table table-sm">
                                                    <thead>
                                                        <tr>
                                                            <th>Nom du fond</th>
                                                            <th>Performance annuelle</th>
                                                            <th>Performance 1 an</th>
                                                            <th>Performance 3 ans</th>
                                                            <th>Performance YTD</th>
                                                            <th>Volatilité à 3 ans</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    {post?.data?.meilleursFonds.map((fond: { 
                                                        nom_fond: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.ReactNode | null | undefined;
                                                        volatility3an: any;
                                                        performance_annualisee: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.ReactNode | null | undefined;
                                                        performance_1_an: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.ReactNode | null | undefined;
                                                        performance_3_ans: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.ReactNode | null | undefined;
                                                        performance_ytd: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.ReactNode | null | undefined;
                                                    }, index: React.Key | null | undefined) => (                                                            <tr key={index}>
                                                                <td>{fond.nom_fond}</td>
                                                                <td style={{ color: typeof fond.performance_annualisee === 'number' && fond.performance_annualisee >= 0 ? 'green' : 'red' }}>{typeof fond.performance_annualisee === 'number' ? fond.performance_annualisee.toFixed(2) + '%' : '-'}</td>
                                                                <td style={{ color: typeof fond.performance_1_an === 'number' && fond.performance_1_an >= 0 ? 'green' : 'red' }}>{typeof fond.performance_1_an === 'number' ? fond.performance_1_an.toFixed(2) + '%' : '-'}</td>
                                                                <td style={{ color: typeof fond.performance_3_ans === 'number' && fond.performance_3_ans >= 0 ? 'green' : 'red' }}>{typeof fond.performance_3_ans === 'number' ? fond.performance_3_ans.toFixed(2) + '%' : '-'}</td>
                                                                <td style={{ color: typeof fond.performance_ytd === 'number' && fond.performance_ytd >= 0 ? 'green' : 'red' }}>{typeof fond.performance_ytd === 'number' ? fond.performance_ytd.toFixed(2) + '%' : '-'}</td>
                                                                <td style={{ color: typeof fond.volatility3an === 'number' && fond.volatility3an >= 0 ? 'green' : 'red' }}>{typeof fond.volatility3an === 'number' ? fond.volatility3an.toFixed(2) : '-'}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
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
