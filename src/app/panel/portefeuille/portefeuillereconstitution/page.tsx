"use client";
import { urlconstant } from "@/app/constants";

import Link from "next/link";
import { Fragment, SetStateAction, useEffect, useState } from "react";
import Select from 'react-select';
//import * as XLSX from 'xlsx';
import { FaBars, FaTimes } from 'react-icons/fa'; // Pour les icônes
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
//import { router } from 'next/router';
import Header from '@/app/Header';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { Button } from "react-bootstrap";
import Headermenu from "@/app/Headermenu";
import Sidebar from "@/app/sidebarportefeuille";

async function getperformancep(id: number) {
  const data = (
    await fetch(`${urlconstant}/api/valLiqportefeuille/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', // Indiquer que vous envoyez du JSON
      },
    })
  ).json();
  return data;
}
async function getperformancepdev(id: number, dev: string) {
  const data = (
    await fetch(`${urlconstant}/api/valLiqportefeuilledev/${id}/${dev}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', // Indiquer que vous envoyez du JSON
      },
    })
  ).json();
  return data;
}
async function getPortefeuille(selectedValues: any) {
  const data = (

    await fetch(`${urlconstant}/api/getportefeuille/${selectedValues}`, {
      method: 'GET', // Assurez-vous que la méthode HTTP correspond à votre API
    })
  ).json();
  return data;
}
async function Reconstituergraph(selectedValues: any) {
  const data = (

    await fetch(`${urlconstant}/api/valoriserportefeuille/${selectedValues}`, {
      method: 'GET', // Assurez-vous que la méthode HTTP correspond à votre API
    })
  ).json();
  return data;
}

async function getlastvl1() {
  const data = (
    await fetch(`${urlconstant}/api/searchFunds`)
  ).json();
  return data;
}
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
const options = [
  { value: 1, label: 'Option 1' },
  { value: 2, label: 'Option 2' },
  { value: 3, label: 'Option 3' },
  // Ajoutez plus d'options au besoin
];

interface Pays {
  value: any[]; // ou un type spécifique pour les éléments du tableau 'portefeuile'

}
interface Transaction {

  type: any;
  date: any;
  montant: any;
  fond_ids: any;
  prixparunite: any;
  portefeuille_id: any;
  quantite: any;
  plus_moins_value: any;
  frais: any;
  transactions: any[];


}
interface Portefeuilles {
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
        omega: any;
        dsr: any
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

    lastDate: any;
    lastdatepreviousmonth: any;


  };
}
interface Funds {
  data: {
    nom_portefeuille: any
    valorisation: any
    portefeuille: {
      funds: any,
      poids: any,
      montant_invest: any,
      cash: any,
      maj: any,
      nom_portefeuille: any,
      devise: any

    }; // ou un type spécifique pour les éléments du tableau 'portefeuille'
  };
}

interface Fund {
  data: {
    ratios3a: {
      data: {
        volatility: any;
        maxDrawdown: any;
        betaBaiss: any;
        VAR95: any;
        info: any;
        perfAnnualisee: any
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
        perf10Ans: any;
        adaptValues1: any;
        perfAnnualisee: any;
      }
    };
    funds: any[]; // ou un type spécifique pour les éléments du tableau 'funds'
    fundname: any;
    libelle_indice: any;
    lastDate: any;
    lastValue: any;
    lastValue_USD: any;
    lastValue_EUR: any;
    lastdatepreviousmonth: any;
    libelle_fond: any;
    regulateur: any;
    sitewebregulateur: any;
    nomdelabourse: any;
    URLdelabourse: any;
    symboledevise: any;
    categorie_libelle: any;
    categorie_national: any;
    nom_gerant: any;
    categorie_globale: any;
    societe_gestion: any;
    categorie_regional: any;
    classification: any;
    type_investissement: any;
    pays: any;

  };
}
const min = 1;
const max = 200;
const randomValueInEuros = (Math.random() * (max - min) + min).toFixed(2);
const randomPercentage: string = ((Math.random() * 200) - 100).toFixed(2);

const randomPercentage1 = ((Math.random() * 200) - 100).toFixed(2);
const randomPercentage2 = ((Math.random() * 200) - 100).toFixed(2);
interface Option {
  name: any;
  value: string;
  label: string;
}
interface PageProps {
  searchParams: {
    selectedfund: any;
    portefeuille: any;
    selectedValuename: any;
    id: any
  };
}
interface MyDataType {
  name: any;
  y: any;
  // InRef: any; // Remplacez "number" par le type approprié
  // Autres propriétés
}
export default function PorteFeuile(props: PageProps) {
  const router = useRouter();

  let selectedfunds = props?.searchParams?.selectedfund;
  let selectedportfeuille = props?.searchParams?.portefeuille;
  let selectedValuename = props?.searchParams?.selectedValuename;
  let id = props.searchParams.id;


  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get today's date and one year before today
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  const startDateDefault = formatDate(oneYearAgo);
  const endDateDefault = formatDate(today);
  const [portefeuille, setPortefeuille] = useState<Funds | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [fundsOptions, setFundsOptions] = useState([]);
  const [base100Datap, setBase100Datap] = useState<MyDataType[]>([]); // Nouvel état pour les données en base 100
  const [base100Data, setBase100Data] = useState<MyDataType[]>([]); // Nouvel état pour les données en base 100
  const [fundsData, setFundsData] = useState<Fund[]>([]);
  const [transactionData, settransactioData] = useState<Transaction[]>([]);
  const [performanceP, setperformanceP] = useState<Portefeuilles | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('1 year'); // Initialize with the default selected period
  const [filteredData, setFilteredData] = useState<Option[]>([]);

  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [totalValue, setTotalValue]: [any, React.Dispatch<React.SetStateAction<number>>] = useState(0);
  const [totalinvest, settotalinvest]: [any, React.Dispatch<React.SetStateAction<number>>] = useState(0);
  const [perforigine, setperforigine]: [any, React.Dispatch<React.SetStateAction<number>>] = useState(0);

  const [totalfrais, settotalfrais]: [any, React.Dispatch<React.SetStateAction<number>>] = useState(0);

  const [totalpmvalue, settotalpmvalue]: [any, React.Dispatch<React.SetStateAction<number>>] = useState(0);
  const [datep, setdatep] = useState('');
  const [cash, setcash] = useState('');

  const [filterStartDate, setFilterStartDate] = useState('');

  const [filterEndDate, setFilterEndDate] = useState('');
  const [endDate, setEndDate] = useState<string | null>(endDateDefault);
  const [startDate, setStartDate] = useState<string | null>(startDateDefault);

  const [selectedRows, setSelectedRows] = useState<string[]>([]); // Tableau pour stocker les lignes sélectionnées
  const [datasgraphall, setdatasgraphall] = useState([]);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    Highcharts.setOptions({
      credits: {
        enabled: false
      }
    });
  }, [id]);
  const handleSearch = (e: any) => {
    e.preventDefault();
    // Effectuez votre recherche ici si nécessaire
  };


  useEffect(() => {
    async function fetchData() {
      try {


        const currentDate = new Date(); // Date actuelle
        let filteredData: any[] | ((prevState: Option[]) => Option[]) = []
        if (datasgraphall != undefined) {
          if (selectedPeriod === '1 year') {
            // Filtrer les données pour 1 an
            filteredData = datasgraphall.filter((item: { name: string | number | Date; }) => {
              const itemDate = new Date(item.name); // Convertir la date de l'élément en objet Date
              const oneYearAgo = new Date();
              oneYearAgo.setFullYear(currentDate.getFullYear() - 1); // Date il y a 1 an
              return itemDate >= oneYearAgo && itemDate <= currentDate; // Sélectionner les dates dans la période d'1 an
            });
            // Calculer les données en base 100
            if (filteredData.length > 0) {
              const lastValue = filteredData[0].y; // Dernière valeur

              const base100Data = filteredData.map((item: { name: any; y: number; }) => ({
                name: item.name,
                y: (item.y / lastValue) * 100, // Calcul en base 100
              }));

              setBase100Data(base100Data); // Mettre à jour l'état avec les données en base 100
            }
          } else if (selectedPeriod === '3 years') {
            // Filtrer les données pour 3 ans
            filteredData = datasgraphall.filter((item: { name: string | number | Date; }) => {
              const itemDate = new Date(item.name);
              const threeYearsAgo = new Date();
              threeYearsAgo.setFullYear(currentDate.getFullYear() - 3); // Date il y a 3 ans
              return itemDate >= threeYearsAgo && itemDate <= currentDate;
            });
            // Calculer les données en base 100
            if (filteredData.length > 0) {
              const lastValue = filteredData[0].y; // Dernière valeur

              const base100Data = filteredData.map((item: { name: any; y: number; InRef: number; }) => ({
                name: item.name,
                y: (item.y / lastValue) * 100, // Calcul en base 100
              }));

              setBase100Data(base100Data); // Mettre à jour l'état avec les données en base 100
            }
          } else if (selectedPeriod === '5 years') {
            // Filtrer les données pour 5 ans
            filteredData = datasgraphall.filter((item: { name: string | number | Date; }) => {
              const itemDate = new Date(item.name);
              const fiveYearsAgo = new Date();
              fiveYearsAgo.setFullYear(currentDate.getFullYear() - 5); // Date il y a 5 ans
              return itemDate >= fiveYearsAgo && itemDate <= currentDate;
            });
            // Calculer les données en base 100
            if (filteredData.length > 0) {
              const lastValue = filteredData[0].y; // Dernière valeur

              const base100Data = filteredData.map((item: { name: any; y: number; InRef: number; }) => ({
                name: item.name,
                y: (item.y / lastValue) * 100, // Calcul en base 100
              }));

              setBase100Data(base100Data); // Mettre à jour l'état avec les données en base 100
            }
          }
        }

        setFilteredData(filteredData);



      } catch (error) {
        console.error('Erreur lors de l’appel à l’API :', error);
      }
    }
    fetchData();
  }, [selectedPeriod, datasgraphall]);

  useEffect(() => {
    // Fonction pour effectuer l'appel à l'API
    async function fetchData() {
      const fetchedData = [];
      for (const item of selectedfunds.replace(/[^0-9A-Za-z\s,]+/g, '').split(',')) {
        try {
          const response = await fetch(`${urlconstant}/api/getfondbyid/${item}?funds=${selectedfunds}`);
          const data = await response.json();
          fetchedData.push(data);
        } catch (error) {
          console.error("Erreur lors de l'appel API :", error);
        }
      }

      // Mettez à jour l'état avec les données récupérées
      setFundsData(fetchedData);



    }

    // Appelez la fonction pour récupérer les données lorsque le composant est monté
    fetchData();
  }, [selectedfunds]); // A
  const [selectedDevise, setSelectedDevise] = useState('');
  const handleDeviseChange = async (e: { target: { value: any; }; }) => {
    const selectedValue = e.target.value;
    setSelectedDevise(selectedValue);
    console.log("ffffffffffffffffffffffffffffff")
    const response0 = await fetch(`${urlconstant}/api/portefeuillebase100dev/${selectedportfeuille}/${selectedValue}`);
    const data0 = await response0.json();
    console.log(data0);

    const datasgraph = data0?.data.portefeuilleDatas.map((funds: any) => ({
      name: funds.date,
      y: parseFloat(selectedValue === 'EUR' ? funds.base_100_bis_EUR : funds.base_100_bis_USD),
    }));
    console.log(datasgraph)
    let filteredData = [];
    const currentDate = new Date(); // Date actuelle


    settotalinvest(parseFloat(data0?.data.investissement))
    settotalpmvalue(parseFloat(data0?.data.plusmoinsvalue))
    setTotalValue(parseFloat(data0?.data.valeur))
    setdatep(data0?.data.date)
    setcash(parseFloat(data0.data.cash).toFixed(2))

    const fetchedData = [];

    // Vous pouvez faire d'autres actions ici en fonction de la nouvelle valeur sélectionnée
  };
  const determineClasseSRRI = (volatilite: any) => {
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

  };
  const volatility = parseFloat(performanceP?.data?.ratios3a?.data?.volatility);
  const classeSRRI = determineClasseSRRI(isNaN(volatility) ? 0 : volatility.toFixed(2));

  useEffect(() => {
    let tempTotalValue = 0;


    const titre = calculateTitreValue(fundsData)
    const aa = parseFloat(titre) + (portefeuille?.data.portefeuille.cash ? parseFloat(portefeuille?.data.portefeuille.cash) : 0);

    // Step 3: Update the global variable
    setTotalValue(aa);
  }, [fundsData, portefeuille]);
  const calculateSumOfQuantities = (fundId: any) => {
    // Use transactionData to filter transactions with the given fundId
    const matchingTransactionsAchat = transactionData.filter(
      transaction =>
        transaction.fond_ids === parseInt(fundId) &&
        transaction.type === "achat" &&
        transaction.portefeuille_id === parseInt(selectedportfeuille)
    );

    const matchingTransactionsVente = transactionData.filter(
      transaction =>
        transaction.fond_ids === parseInt(fundId) &&
        transaction.type === "vente" &&
        transaction.portefeuille_id === parseInt(selectedportfeuille)
    );

    const sumQuantiteAchat = matchingTransactionsAchat.reduce(
      (sum, transaction) => sum + (transaction.quantite || 0),
      0
    );

    const sumQuantiteVente = matchingTransactionsVente.reduce(
      (sum, transaction) => sum + (transaction.quantite || 0),
      0
    );

    const netQuantite = sumQuantiteAchat - sumQuantiteVente;
    const transactionsForFund = transactionData.filter(transaction => transaction.fond_ids === fundId && transaction.portefeuille_id === parseInt(selectedportfeuille))


    return netQuantite;
  };
  const calculateAverageNetTransactionPrice = (fundId: any, transactionData: any[]) => {
    const relevantTransactions = transactionData.filter(transaction =>
      (transaction.type === 'achat' || transaction.type === 'vente') &&
      transaction.portefeuille_id === parseInt(selectedportfeuille) &&
      transaction.fond_ids === parseInt(fundId)
    );

    if (relevantTransactions.length === 0) {
      return 0; // Return 0 if no relevant transactions found
    }

    const achatTransactions = relevantTransactions.filter(transaction => transaction.type === 'achat');
    const venteTransactions = relevantTransactions.filter((transaction: { type: string; }) => transaction.type === 'vente');

    // Calculer la moyenne des prix par unité pour les transactions d'achat
    const { totalPrix, totalQuantite } = achatTransactions.reduce((acc, transaction) => {
      const quantite = parseFloat(transaction.quantite);
      const prixparunite = parseFloat(transaction.prixparunite);

      acc.totalPrix += prixparunite;
      acc.totalQuantite += quantite;

      return acc;
    }, { totalPrix: 0, totalQuantite: 0 });
    const nombreAchat = achatTransactions.length;

    const prixMoyen = totalPrix / nombreAchat;
    console.log('Prix Moyen:', prixMoyen);

    // Calculer la quantité totale vendue
    const totalQuantiteVendue = venteTransactions.reduce((acc, transaction) => {
      return acc + parseFloat(transaction.quantite);
    }, 0);

    // Calculer la quantité restante après les ventes
    const quantiteRestante = totalQuantite - totalQuantiteVendue;

    // Calculer le montant net total
    const netTotalAmount = prixMoyen * quantiteRestante;

    return netTotalAmount;
  };
  const [totalpmvaluee, setTotalPmValuee] = useState(0);

  useEffect(() => {
    const fetchTransactionData = async () => {
      const response1 = await fetch(`${urlconstant}/api/gettransactions/${selectedportfeuille}`);
      const data5 = await response1.json();
      const venteTransactions = data5.data.transactions.filter((transaction: { type: string; }) => transaction.type === 'vente');
      const plusValueEffective = venteTransactions.reduce((sum: any, transaction: { plus_moins_value: any; }) => sum + parseFloat(transaction.plus_moins_value), 0);
      console.log(plusValueEffective);

      return plusValueEffective;
    };

    fetchTransactionData().then((plusValueEffective) => {
      setTotalPmValuee(plusValueEffective);
    }).catch(error => console.error('Error fetching transaction data:', error));
  }, [selectedportfeuille, urlconstant]);

  const calculateTitreValue: any = (data: any) => {
    let totalValue = 0;
    data.forEach((data: {
      data: {
        funds: {
          lastValue: string; id: any; lastValue_EUR: any; lastValue_USD: any;
        }[];
      };
    }) => {
      let lastValuee;
      if (portefeuille?.data.portefeuille.devise == "EUR") {
        lastValuee = parseFloat(data.data.funds[0]?.lastValue_EUR);

      } else {
        lastValuee = parseFloat(data.data.funds[0]?.lastValue_USD);

      }
      const lastValue = lastValuee;
      const quantity = calculateSumOfQuantities(data.data.funds[0]?.id);
      const fundValue = lastValue * quantity;

      totalValue += fundValue;
    });

    return totalValue;
  };
  const calculatevalue: any = (data: Fund) => {
    let lastValue;
    if (portefeuille?.data.portefeuille.devise == "EUR") {
      lastValue = parseFloat(data.data.funds[0]?.lastValue_EUR);

    } else {
      lastValue = parseFloat(data.data.funds[0]?.lastValue_USD);

    }




    const quantity = calculateSumOfQuantities(data.data.funds[0]?.id);


    return lastValue * quantity;

  };


  const calculateinvestissement = (data: Fund) => {

    // const purchasePrice = 500; // Assuming you have the purchase price available
    const purchasePrice = calculateAverageNetTransactionPrice(data.data.funds[0]?.id, transactionData);



    // const quantity = calculateSumOfQuantities(data.data.funds[0]?.id);


    return purchasePrice;

  };



  const calculateProfitLoss = (data: Fund) => {
    let lastValue;
    if (portefeuille?.data.portefeuille.devise == "EUR") {
      lastValue = parseFloat(data.data.funds[0]?.lastValue_EUR);

    } else {
      lastValue = parseFloat(data.data.funds[0]?.lastValue_USD);

    }

    // const purchasePrice = 500; // Assuming you have the purchase price available
    const purchasePrice = calculateAverageNetTransactionPrice(data.data.funds[0]?.id, transactionData);



    const quantity = calculateSumOfQuantities(data.data.funds[0]?.id);

    if (!isNaN(lastValue) && !isNaN(purchasePrice) && !isNaN(quantity)) {
      return (lastValue * quantity) - purchasePrice;
    } else {
      return 0; // Return 0 if any value is not a number
    }
  };


  const [formData, setFormData] = useState({
    page: 1,
    selectedportfeuille: selectedportfeuille,
    Fond: selectedfunds,
    Fondname: selectedValuename,
    selectedValue: [] as string[], // Utilisez la syntaxe de type TypeScript
    selectedValuename: [] as string[], // Utilisez la syntaxe de type TypeScript
    deletedfund: [] as string[] // Utilisez la syntaxe de type TypeScript

  });
  let options;
  const [isValueStored, setIsValueStored] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => {
    // Appel à l'API lors du premier rendu du composant
    async function fetchDataç() {
      try {
        const storedMessage = localStorage.getItem('message');
        if (!storedMessage) {
          Swal.fire({
            title: 'Veuillez patienter',
            html: 'Chargement des résultats en cours...',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });
          localStorage.removeItem('message'); // Supprimer le message après l'affichage
        } else {
          Swal.fire({
            title: 'Veuillez patienter',
            html: 'La transaction a été effectuée avec succes cliquer sur la mise a jour.',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });
        }



        const response1 = await fetch(`${urlconstant}/api/gettransactions/${selectedportfeuille}`);
        const data5 = await response1.json();
        settransactioData(data5.data.transactions);
        const totalFees = data5.data.transactions.reduce((acc: number, transaction: { frais: string | null; }) => {
          const frais = transaction.frais !== null ? parseFloat(transaction.frais) : 0;
          return acc + frais;
        }, 0);
        settotalfrais(totalFees.toFixed(2));
        const data = await getPortefeuille(selectedportfeuille);
        setPortefeuille(data);
        setcash(data.data.portefeuille.cash)
        setSelectedDevise(data?.data.portefeuille.devise)

        const storedValue = localStorage.getItem('portefeuille');
        if (storedValue == selectedportfeuille) {
          setIsValueStored(true);
        }


        if (data?.data.portefeuille.maj == 1) {
          const dataperf = await getperformancep(selectedportfeuille);
          console.log('perfff')
          console.log(dataperf)


          setperformanceP(dataperf);

          const datasgraph = dataperf?.data?.graphs.map((item: { date: any; base_100_bis: any; }) => ({
            name: item.date,
            y: parseFloat(item.base_100_bis),
          }));
          const datasgraph1 = dataperf?.data?.graphs.map((item: { date: any; valeur_portefeuille: any; }) => ({
            y: parseFloat(item.valeur_portefeuille),
          }));
          // Step 2: Calculate perf origin
          let perfOrigin = 0;
          if (datasgraph1 && datasgraph1.length > 0) {
            const firstValue = datasgraph[0].y;
            const lastValue = datasgraph[datasgraph.length - 1].y;
            perfOrigin = (lastValue - firstValue) / firstValue;
            console.log("lastValue, firstValue")

            console.log(lastValue, firstValue)

          }

          // Step 3: Update state or process further
          setperforigine(perfOrigin);
          setdatasgraphall(datasgraph);
          const currentDate = new Date(); // Date actuelle
          let filteredData = [];
          if (datasgraph != undefined) {
            if (selectedPeriod === '1 year') {
              // Filtrer les données pour 1 an
              filteredData = datasgraph.filter((item: { name: string | number | Date; }) => {
                const itemDate = new Date(item.name); // Convertir la date de l'élément en objet Date
                const oneYearAgo = new Date();
                oneYearAgo.setFullYear(currentDate.getFullYear() - 1); // Date il y a 1 an
                return itemDate >= oneYearAgo && itemDate <= currentDate; // Sélectionner les dates dans la période d'1 an
              });
              // Calculer les données en base 100
              if (filteredData.length > 0) {
                const lastValue = filteredData[0].y; // Dernière valeur

                const base100Data = filteredData.map((item: { name: any; y: number; InRef: number; }) => ({
                  name: item.name,
                  y: (item.y / lastValue) * 100, // Calcul en base 100
                }));

                setBase100Data(base100Data); // Mettre à jour l'état avec les données en base 100
              }
            } else if (selectedPeriod === '3 years') {
              // Filtrer les données pour 3 ans
              filteredData = datasgraph.filter((item: { name: string | number | Date; }) => {
                const itemDate = new Date(item.name);
                const threeYearsAgo = new Date();
                threeYearsAgo.setFullYear(currentDate.getFullYear() - 3); // Date il y a 3 ans
                return itemDate >= threeYearsAgo && itemDate <= currentDate;
              });
              // Calculer les données en base 100
              if (filteredData.length > 0) {
                const lastValue = filteredData[0].y; // Dernière valeur

                const base100Data = filteredData.map((item: { name: any; y: number; InRef: number; }) => ({
                  name: item.name,
                  y: (item.y / lastValue) * 100, // Calcul en base 100
                }));

                setBase100Data(base100Data); // Mettre à jour l'état avec les données en base 100
              }
            } else if (selectedPeriod === '5 years') {
              // Filtrer les données pour 5 ans
              filteredData = datasgraph.filter((item: { name: string | number | Date; }) => {
                const itemDate = new Date(item.name);
                const fiveYearsAgo = new Date();
                fiveYearsAgo.setFullYear(currentDate.getFullYear() - 5); // Date il y a 5 ans
                return itemDate >= fiveYearsAgo && itemDate <= currentDate;
              });
              // Calculer les données en base 100
              if (filteredData.length > 0) {
                const lastValue = filteredData[0].y; // Dernière valeur

                const base100Data = filteredData.map((item: { name: any; y: number; InRef: number; }) => ({
                  name: item.name,
                  y: (item.y / lastValue) * 100, // Calcul en base 100
                }));

                setBase100Data(base100Data); // Mettre à jour l'état avec les données en base 100
              }
            }
          }

          setFilteredData(filteredData);
          const response6 = await fetch(`${urlconstant}/api/portefeuillebase100/${selectedportfeuille}`);
          const data6 = await response6.json();




          // Check if other fields are defined before setting the state
          settotalinvest(parseFloat(data6.data.investissement));


          settotalpmvalue(parseFloat(data6.data.plusmoinsvalue));


          setdatep(data6.data.date);
        }


        Swal.close(); // Close the loading popup


      } catch (error) {
        Swal.close(); // Close the loading popup

        console.error("Erreur lors de l'appel à l'API :", error);
      }
    }

    fetchDataç();
  }, [selectedportfeuille, selectedValuename]); // Assurez-vous que les dépendances du useEffect sont correctement gérées.

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
        name: portefeuille?.data.portefeuille.nom_portefeuille,
        data: base100Data.map(item => item.y),
      }

    ],
  };
  useEffect(() => {
    setFilterStartDate(startDate !== null ? String(startDate) : ''); // Convertit en chaîne si startDate n'est pas null
    setFilterEndDate(endDate !== null ? String(endDate) : ''); // Convertit en chaîne si endDate n'est pas null
  }, [startDate, endDate]);

  useEffect(() => {
    async function fetchData() {
      try {

        type Optionss = {
          name: any;
          y: number;
          label: any;
          value: string; // Add this line
          // other properties
        };
        let filteredData: Optionss[] = [];

        if (datasgraphall != undefined) {
          // Filtrer les données pour 1 an
          filteredData = datasgraphall.filter((item: { name: string | number | Date; }) => {
            const itemDate = new Date(item.name); // Convertir la date de l'élément en objet Date
            return itemDate >= new Date(startDate || '2020-01-01') && itemDate <= new Date(endDate || '2100-12-31');
          });
          console.log(startDate)
          console.log(datasgraphall)

          console.log(filteredData)
          // Calculer les données en base 100
          if (filteredData.length > 0) {
            const lastValue = filteredData[0].y; // Dernière valeur

            const base100Data = filteredData.map((item: { name: any; y: number; }) => ({
              name: item.name,
              y: (item.y / lastValue) * 100, // Calcul en base 100
            }));

            setBase100Data(base100Data); // Mettre à jour l'état avec les données en base 100
          }
        }

        setFilteredData(filteredData ?? []);




      } catch (error) {

        console.error('Erreur lors de l’appel à l’API :', error);
      }
    }
    fetchData();
  }, [filterStartDate, filterEndDate]);

  const [reconstitutionEnCours, setReconstitutionEnCours] = useState(false);
  const handletransactionClick = async () => {
    const href = `/panel/portefeuille/portefeuillereconstitution/transaction?id=${id}&selectedfund=${selectedfunds}&portefeuille=${selectedportfeuille}`
    setTimeout(() => {
      window.location.href = href;
    }, 500);


  };
  const handleparamClick = async () => {
    const href = `/panel/portefeuille/portefeuillereconstitution/parametrage?id=${id}&selectedfund=${selectedfunds}&portefeuille=${selectedportfeuille}`
    setTimeout(() => {
      window.location.href = href;
    }, 500);


  };
  const handleReconstitutionClick = async () => {



    try {
      Swal.fire({
        title: 'Veuillez patienter',
        html: 'Mise a jour! ne pas quitter la page...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Appeler votre API ici
      const response = await fetch(`${urlconstant}/api/valoriserportefeuille/${selectedportfeuille}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Définir le type de contenu JSON
        },
      });

      const data = await response.json(); // Convertir la réponse en JSON

      console.log(selectedportfeuille)
      if (data.code === 200) {
        Swal.close(); // Fermer le popup après que la requête est terminée

        setTimeout(() => {
          const href = `/panel/portefeuille/portefeuillereconstitution?id=${id}&selectedValuename=${selectedValuename}&selectedfund=${selectedfunds}&portefeuille=${selectedportfeuille}`;
          window.location.href = href;
        }, 500);
      } else {
        Swal.close(); // Fermer le popup en cas de réponse non 200
        console.error('Erreur lors de l\'appel de l\'API:', data.message);
      }

      return data; // Retourner les données si nécessaire
    } catch (error) {
      Swal.close(); // Fermer le popup en cas d'erreur
      console.error('Erreur lors de l\'appel de l\'API:', error);
    }

  };

  /*
  const camembertData = [
    { name: "A", y: 30 },
    { name: "B", y: 20 },
    { name: "C", y: 50 },
  ];*/

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const [isMenuOpen, setMenuOpen] = useState(true);
  const toggleMenu1 = () => setMenuOpen(!isMenuOpen);

  return (



    < Fragment >
    <div className="flex bg-gray-100">
      <Sidebar id={id} />
      <div className="flex-1 ml-64">
        <Headermenu />
      <div className="content-wrapper2">
        <div className="container-full">
          {/* Main content */}
          <section className="content">
            {isModalOpen && (
              <div className="modal">
                {/* Modal content */}
                <div className="modal-content">
                  <p>Form submitted successfully!</p>
                  {/* You can add any content or message you want here */}
                </div>
              </div>
            )}

            <br />
            <div className="col-12">

              <div className="box">
                <div className="box-body pb-lg-0">

                  <div className="d-md-flex justify-content-between align-items-center">
                    <div>
                      <h4 className="">{portefeuille?.data.portefeuille.nom_portefeuille}</h4>
                      <h4>   <span className="mb-0 fw-600">
                        Cash: {cash ? parseFloat(cash).toFixed(2) : '0.00'} {selectedDevise}
                      </span></h4>
                      <h4>  <span className="mb-0 fw-600">Titres: {isNaN(calculateTitreValue(fundsData)) ? '0.00' : calculateTitreValue(fundsData).toFixed(2)} {selectedDevise}</span></h4>

                      <div className="text-center">
                        <div className="col-md-12 mx-auto">
                          <label>Devise:</label>
                          <select className="form-control" onChange={handleDeviseChange} value={selectedDevise} >
                            <option value="">Sélectionner...</option>
                            <option value="EUR">EUR</option>
                            <option value="USD">USD</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="text-left">

                      <div className="mx-lg-60 mx-20 min-w-70" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                          <tbody>
                            <tr>
                              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', backgroundColor: '#f2f2f2' }}>
                                <p className="mb-0 text-fade">Valeur du portefeuille</p>
                              </td>
                              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', backgroundColor: '#f2f2f2' }}>
                                <p className="mb-0 text-fade">Date du portefeuille</p>

                              </td>
                            </tr>
                            <tr>
                              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', backgroundColor: '#fff' }}>
                                <p className="mb-0  text-bold">{!isNaN(totalValue) ? totalValue.toFixed(2) : '0.00'} {selectedDevise}</p>

                              </td>
                              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', backgroundColor: '#fff' }}>
                                <p className="mb-0  text-bold">{datep}</p>
                              </td>
                            </tr>
                            <tr>
                              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', backgroundColor: '#f2f2f2' }}>
                                <p className="mb-0 text-fade">Plus / Moins Value</p>
                              </td>
                              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', backgroundColor: '#f2f2f2' }}>
                                <p className="mb-0 text-fade">Performance depuis l origine</p>

                              </td>
                            </tr>
                            <tr>
                              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', backgroundColor: '#fff' }}>
                                <p className={`mb-0 ${totalpmvalue >= 0 ? 'text-bold text-success text-center' : 'text-bold text-danger text-center'}`}> &nbsp;  {totalpmvalue.toFixed(2)}  {selectedDevise}</p>

                              </td>
                              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', backgroundColor: '#fff' }}>
                                <p className={`mb-0 text-center ${perforigine >= 0 ? 'text-bold text-success' : 'text-bold text-danger'}`}>
                                  &nbsp; {!isNaN(perforigine) ? `${(perforigine * 100).toFixed(2)}%` : ''}
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={2} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', backgroundColor: '#f2f2f2' }}>
                                <p className="mb-0 text-fade">Plus / Moins Value effective </p>
                              </td>

                            </tr>
                            <tr>
                              <td colSpan={2} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', backgroundColor: '#fff' }}>
                                <p className={`mb-0 ${totalpmvaluee >= 0 ? 'text-bold text-success text-center' : 'text-bold text-danger text-center'}`}>
                                  &nbsp;
                                  {isNaN(totalpmvaluee) ? '0.00' : totalpmvaluee.toFixed(2)} {selectedDevise}
                                </p>
                              </td>


                            </tr>

                            <tr>
                              <td colSpan={2} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', backgroundColor: '#f2f2f2' }}>
                                <p className="mb-0 text-fade">Frais</p>
                              </td>

                            </tr>
                            <tr>
                              <td colSpan={2} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', backgroundColor: '#fff' }}>
                                <p className={`mb-0 ${totalfrais >= 0 ? ' text-bold text-center' : ' text-fade text-center'}`}> &nbsp;  {totalfrais}  {selectedDevise}</p>

                              </td>

                            </tr>
                            <tr>
                              <td colSpan={2} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', backgroundColor: '#f2f2f2' }}>
                                <p className="mb-0 text-fade">Investissement</p>
                              </td>

                            </tr>
                            <tr>
                              <td colSpan={2} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', backgroundColor: '#fff' }}>
                                <p className={`mb-0 ${totalinvest >= 0 ? ' text-bold text-center' : ' text-fade text-center'}`}> &nbsp;  {totalinvest.toFixed(2)}  {selectedDevise}</p>

                              </td>

                            </tr>
                          </tbody>
                        </table>
                      </div>
                      {  /*  <div className=" mx-lg-60 mx-20 min-w-70" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <p className="mb-0 text-fade  text-center">Plus / Moins Value </p>
                        <p className={`mb-0 ${calculateTotalProfitLoss() >= 0 ? 'text-success text-center' : 'text-danger text-center'}`}> &nbsp;  {calculateTotalProfitLoss().toFixed(2)}  {selectedDevise}</p>
                        <p className="mb-0 text-fade  text-center">&nbsp;&nbsp;&nbsp;Performance depuis l origine</p>
                        <p className={`mb-0  text-center ${(calculatetotalvalue().toFixed(2) - calculateTotalInvest().toFixed(2)) / calculateTotalInvest().toFixed(2) >= 0 ? 'text-success' : 'text-danger'}`}>
                          &nbsp; {`${(((calculatetotalvalue().toFixed(2) - calculateTotalInvest().toFixed(2)) / calculateTotalInvest().toFixed(2)) * 100).toFixed(2)}%`}
                        </p>

                      </div>
                      <div className="mx-lg-60 mx-20 min-w-70" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <p className="mb-0 text-fade  text-center">Investissement </p>
                        <p className={`mb-0 ${calculateTotalInvest() >= 0 ? 'text-success text-center' : 'text-danger text-center'}`}> &nbsp;  {calculateTotalInvest().toFixed(2)}  {selectedDevise}</p>


                      </div>*/}


                    </div>

                    <div className="text-right">
                      <a
                        href={`/panel/portefeuille/portefeuillereconstitution/ajoutcash?id=${id}&selectedfund=${selectedfunds}&portefeuille=${selectedportfeuille}`}
                        /*  as={`/about/${selectedRows ? selectedRows.join(',') : ''}`}
                          key={selectedRows.join(',')}*/
                        style={{
                          width: '150px',
                          textDecoration: 'none',
                          backgroundColor: 'blue',
                          color: 'white',
                          padding: '10px 20px',
                          borderRadius: '5px',
                        }}
                      >
                        Ajout de Cash
                      </a>
                      &nbsp;
                      <a
                        href={`/panel/portefeuille/portefeuillereconstitution/retraitcash?id=${id}&selectedfund=${selectedfunds}&portefeuille=${selectedportfeuille}`}
                        /*  as={`/about/${selectedRows ? selectedRows.join(',') : ''}`}
                          key={selectedRows.join(',')}*/
                        style={{
                          width: '150px',
                          textDecoration: 'none',
                          backgroundColor: 'red',
                          color: 'white',
                          padding: '10px 20px',
                          borderRadius: '5px',
                        }}
                      >
                        Retrait de Cash
                      </a>
                    </div>

                  </div>
                  <div className="row">

                    <div className="col-lg-9 col-12">
                      <div className="ms-lg-20 mt-20 mt-lg-0 d-flex justify-content-between align-items-center">


                      </div>
                    </div>

                  </div> <br />

                  {portefeuille?.data?.portefeuille?.funds !== undefined ?
                    <div className="text-center">
                      <button
                        style={{
                          width: '150px',
                          textDecoration: 'none',
                          backgroundColor: '#6366f1',
                          color: 'white',
                          padding: '10px 20px',
                          borderRadius: '5px',
                        }}
                        onClick={handleReconstitutionClick}
                      >
                        Mise à jour
                      </button>

                      &nbsp;
                      <button
                        onClick={handletransactionClick}

                        style={{
                          width: '150px',
                          textDecoration: 'none',
                          backgroundColor: '#000',
                          color: 'white',
                          padding: '10px 20px',
                          borderRadius: '5px',
                        }}
                      >
                        Les transactions
                      </button>
                      &nbsp;

                      <button
                        onClick={handleparamClick}

                        style={{
                          width: '150px',
                          textDecoration: 'none',
                          backgroundColor: '#000',
                          color: 'white',
                          padding: '10px 20px',
                          borderRadius: '5px',
                        }}
                      >
                        Parametrage
                      </button>


                    </div>

                    : <p></p>}
                  <br /><br />

                  {/*  <div className="row mt-30">
                    <div className="col-lg-12 col-12">
                      <div >
                        <HighchartsReact
                          highcharts={Highcharts}
                          options={options}
                        />
                        <br />
                        <br />
                      </div>
                    </div>

                  </div>*/}


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
                            </ul>
                          </div>
                          <br></br>
                          {/* Display filtered data with Highcharts */}

                        </div>
                        {/*   <div className="row">
                          <div className="col-6">
                            <label>Date debut</label>
                            <input
                              type="date"
                              className="form-control"
                              value={startDate! || ''}
                              onChange={e => setStartDate(e.target.value)}
                            />
                          </div>

                          <div className="col-6">
                            <label>Date fin</label>
                            <input
                              type="date"
                              className="form-control"
                              value={endDate || ''}
                              onChange={e => setEndDate(e.target.value)}
                            />
                          </div>
              

                        </div>
  */} <div className="row">
                          <div className="col-6">
                            <label>Date debut</label>
                            <input
                              type="date"
                              className="form-control"
                              value={startDate! || ''}
                              onChange={e => setStartDate(e.target.value)}
                            />
                          </div>

                          <div className="col-6">
                            <label>Date fin</label>
                            <input
                              type="date"
                              className="form-control"
                              value={endDate || ''}
                              onChange={e => setEndDate(e.target.value)}
                            />
                          </div>


                        </div>
                        <div>
                          {base100Datap.length > 0 ? (
                            <HighchartsReact
                              highcharts={Highcharts}
                              options={base100Datap}
                            />
                          ) : (
                            <HighchartsReact
                              highcharts={Highcharts}
                              options={options}
                            />
                          )}
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
                                <strong>Perf. {performanceP?.data?.lastDate}</strong>
                              </td>
                              <td className="text-right p-t-1">
                                <strong>Fonds</strong>
                              </td>

                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td> Perf. veille</td>
                              <td className={`text-right ${parseFloat(performanceP?.data?.performances?.data?.perfVeille) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(performanceP?.data?.performances?.data?.perfVeille)) ? '-' : parseFloat(performanceP?.data?.performances?.data?.perfVeille).toFixed(2)} %</td>
                              {/*  <td className={`text-right  ${parseFloat(performanceP?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perfveille) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(performanceP?.data?.performances.data?.performancesCategorie[0]?.moyenne_perfveille)) ? '-' : parseFloat(performanceP?.data?.performances.data?.performancesCategorie[0]?.moyenne_perfveille).toFixed(2)} %</td>*/}
                            </tr>
                            <tr>
                              <td> Perf. 4 semaines</td>
                              <td className={`text-right ${parseFloat(performanceP?.data?.performances?.data?.perf4Semaines) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(performanceP?.data?.performances?.data?.perf4Semaines)) ? '-' : parseFloat(performanceP?.data?.performances?.data?.perf4Semaines).toFixed(2)} %</td>
                              {/* <td className={`text-right  ${parseFloat(performanceP?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perf4s) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(performanceP?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf4s)) || isNaN(parseFloat(performanceP?.data?.performances?.data?.perf4Semaines)) ? '-' : parseFloat(performanceP?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf4s).toFixed(2)} %</td>*/}
                            </tr>

                            <tr>
                              <td> Perf. 1er janvier</td>
                              <td className={`text-right ${parseFloat(performanceP?.data?.performances?.data?.perf1erJanvier) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(performanceP?.data?.performances?.data?.perf1erJanvier)) ? '-' : parseFloat(performanceP?.data?.performances?.data?.perf1erJanvier).toFixed(2)} %</td>
                              {/*  <td className={`text-right  ${parseFloat(performanceP?.data?.performances?.data?.performancesCategorie[0]?.moyenne_ytd) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(performanceP?.data?.performances.data?.performancesCategorie[0]?.moyenne_ytd)) || isNaN(parseFloat(performanceP?.data?.performances?.data?.perf1erJanvier)) ? '-' : parseFloat(performanceP?.data?.performances.data?.performancesCategorie[0]?.moyenne_ytd).toFixed(2)} %</td>*/}
                            </tr>
                            <tr>
                              <td> Perf. 1 an</td>
                              <td className={`text-right ${parseFloat(performanceP?.data?.performances?.data?.perf1An) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(performanceP?.data?.performances?.data?.perf1An)) ? '-' : parseFloat(performanceP?.data?.performances?.data?.perf1An).toFixed(2)}%</td>
                              {/*  <td className={`text-right  ${parseFloat(performanceP?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perf1an) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(performanceP?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf1an)) || isNaN(parseFloat(performanceP?.data?.performances?.data?.perf1An)) ? '-' : parseFloat(performanceP?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf1an).toFixed(2)} %</td>*/}
                            </tr>
                            <tr>
                              <td> Perf. 3 ans</td>
                              <td className={`text-right ${parseFloat(performanceP?.data?.performances?.data?.perf3Ans) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(performanceP?.data?.performances?.data?.perf3Ans)) ? '-' : parseFloat(performanceP?.data?.performances?.data?.perf3Ans).toFixed(2)} %</td>
                              {/*  <td className={`text-right  ${parseFloat(performanceP?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perf3ans) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(performanceP?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf3ans)) || isNaN(parseFloat(performanceP?.data?.performances?.data?.perf3Ans)) ? '-' : parseFloat(performanceP?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf3ans).toFixed(2)} %</td>*/}
                            </tr>
                            <tr>
                              <td> Perf. 5 ans</td>
                              <td className={`text-right ${parseFloat(performanceP?.data?.performances?.data?.perf5Ans) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(performanceP?.data?.performances?.data?.perf5Ans)) ? '-' : parseFloat(performanceP?.data?.performances?.data?.perf5Ans).toFixed(2)} %</td>
                              {/*  <td className={`text-right  ${parseFloat(performanceP?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perf5ans) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(performanceP?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf5ans)) || isNaN(parseFloat(performanceP?.data?.performances?.data?.perf5Ans)) ? '-' : parseFloat(performanceP?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf5ans).toFixed(2)} %</td>*/}
                            </tr>
                            <tr>
                              <td> Perf. 8 ans</td>
                              <td className={`text-right ${parseFloat(performanceP?.data?.performances?.data?.perf8Ans) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(performanceP?.data?.performances?.data?.perf8Ans)) ? '-' : parseFloat(performanceP?.data?.performances?.data?.perf8Ans).toFixed(2)} %</td>
                              {/* <td className={`text-right  ${parseFloat(performanceP?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perf8ans) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(performanceP?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf8ans)) || isNaN(parseFloat(performanceP?.data?.performances?.data?.perf8Ans)) ? '-' : parseFloat(performanceP?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf8ans).toFixed(2)} %</td>*/}
                            </tr>
                            <tr>
                              <td> Perf. 10 ans</td>
                              <td className={`text-right ${parseFloat(performanceP?.data?.performances?.data?.perf10Ans) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(performanceP?.data?.performances?.data?.perf10Ans)) ? '-' : parseFloat(performanceP?.data?.performances?.data?.perf10Ans).toFixed(2)}%</td>
                              {/*   <td className={`text-right  ${parseFloat(performanceP?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perf10ans) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(performanceP?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf10ans)) || isNaN(parseFloat(performanceP?.data?.performances?.data?.perf10Ans)) ? '-' : parseFloat(performanceP?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf10ans).toFixed(2)} %</td>*/}
                            </tr>

                            <tr className="white-hover">
                              <td className="p-t-1">
                                <strong>Perf. annuelles</strong>
                              </td>
                            </tr>
                            {new Date().getFullYear() === performanceP?.data?.performances?.data?.adaptValues1?.[0]?.[0] ? (
                              <>
                                <tr>
                                  <td> Perf. {performanceP?.data?.performances?.data?.adaptValues1?.[0]?.[0]}</td>
                                  <td className={`text-right ${parseFloat(performanceP?.data?.performances?.data?.adaptValues1?.[0]?.[2]) < 0 ? 'text-danger' : 'text-success'}`}>
                                    {isNaN(parseFloat(performanceP?.data?.performances?.data?.adaptValues1?.[0]?.[2])) ? '-' : parseFloat(performanceP?.data?.performances?.data?.adaptValues1?.[0]?.[2]).toFixed(2)} %
                                  </td>
                                </tr>
                              </>
                            ) : null}
                            <tr>
                              <td> Perf. {performanceP?.data?.performances?.data?.adaptValues1?.[1]?.[0]}</td>
                              <td className={`text-right ${parseFloat(performanceP?.data?.performances?.data?.adaptValues1?.[1]?.[2]) < 0 ? 'text-danger' : 'text-success'}`}>
                                {isNaN(parseFloat(performanceP?.data?.performances?.data?.adaptValues1?.[1]?.[2])) ? '-' : parseFloat(performanceP?.data?.performances?.data?.adaptValues1?.[1]?.[2]).toFixed(2)} %
                              </td>



                            </tr>
                            <tr>
                              <td> Perf.  {performanceP?.data?.performances?.data?.adaptValues1?.[1]?.[0] - 1}</td>
                              <td className={`text-right ${parseFloat(performanceP?.data?.performances?.data?.adaptValues1?.[2]?.[2]) < 0 ? 'text-danger' : 'text-success'}`}>
                                {isNaN(parseFloat(performanceP?.data?.performances?.data?.adaptValues1?.[2]?.[2])) ? '-' : parseFloat(performanceP?.data?.performances?.data?.adaptValues1?.[2]?.[2]).toFixed(2)} %
                              </td>
                            </tr>
                            <tr>
                              <td> Perf.  {performanceP?.data?.performances?.data?.adaptValues1?.[1]?.[0] - 2}</td>
                              <td className={`text-right ${parseFloat(performanceP?.data?.performances?.data?.adaptValues1?.[3]?.[2]) < 0 ? 'text-danger' : 'text-success'}`}>
                                {isNaN(parseFloat(performanceP?.data?.performances?.data?.adaptValues1?.[3]?.[2])) ? '-' : parseFloat(performanceP?.data?.performances?.data?.adaptValues1?.[3]?.[2]).toFixed(2)} %
                              </td>
                            </tr>


                            <tr className="white-hover">
                              <td colSpan={3} className="p-t-1">
                                <strong >Données 3 ans au {performanceP?.data?.lastdatepreviousmonth}</strong>
                              </td>
                            </tr>
                            <tr>
                              <td> Perf. annualisée</td>
                              <td className={`text-right `}>{isNaN(parseFloat(performanceP?.data?.ratios3a?.data?.perfAnnualisee)) ? '-' : parseFloat(performanceP?.data?.ratios3a?.data?.perfAnnualisee).toFixed(2)}  %</td>
                              {/*    <td className={`text-right  ${parseFloat(performanceP?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perfannu3an) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(performanceP?.data?.performances.data?.performancesCategorie[0]?.moyenne_perfannu3an)) || isNaN(parseFloat(performanceP?.data?.ratios3a?.data?.perfAnnualisee)) ? '-' : parseFloat(performanceP?.data?.performances.data?.performancesCategorie[0]?.moyenne_perfannu3an).toFixed(2)} %</td>*/}
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
                              <td className={`text-right`}>{isNaN(parseFloat(performanceP?.data?.ratios3a?.data?.volatility)) ? '-' : parseFloat(performanceP?.data?.ratios3a?.data?.volatility).toFixed(2)}  %</td>
                              {/*     <td className={`text-right  ${parseFloat(performanceP?.data?.performances?.data?.performancesCategorie[0]?.moyenne_volatility3an) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(performanceP?.data?.performances.data?.performancesCategorie[0]?.moyenne_volatility3an)) || isNaN(parseFloat(performanceP?.data?.ratios3a?.data?.volatility)) ? '-' : parseFloat(performanceP?.data?.performances.data?.performancesCategorie[0]?.moyenne_volatility3an).toFixed(2)} %</td>*/}
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
                              <td className={`text-right `}>{isNaN(parseFloat(performanceP?.data?.ratios3a?.data?.ratioSharpe)) ? '-' : parseFloat(performanceP?.data?.ratios3a?.data?.ratioSharpe).toFixed(2)}  </td>
                              {/*   <td className={`text-right  ${parseFloat(performanceP?.data?.performances?.data?.performancesCategorie[0]?.moyenne_ratiosharpe3an) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(performanceP?.data?.performances.data?.performancesCategorie[0]?.moyenne_ratiosharpe3an)) || isNaN(parseFloat(performanceP?.data?.ratios3a?.data?.ratioSharpe)) ? '-' : parseFloat(performanceP?.data?.performances.data?.performancesCategorie[0]?.moyenne_ratiosharpe3an).toFixed(2)} %</td>*/}
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







              </div>
              <div className="box table-responsive">


                <table className="table">
                  <thead>
                    <tr>
                      <th className="text-center">Fonds Selectionnés</th>
                      <th className="text-center">Devise</th>
                      <th className="text-center">Date   &nbsp;</th>
                      <th className="text-center"> Dernière VL   </th>
                      <th className="text-center">Perf. Veille</th>
                      <th className="text-center">Quantité</th>
                      <th className="text-center">Valeur</th>
                      <th className="text-center">Investissement</th>
                      <th className="text-center">+ / - Value</th>
                      <th className="text-center">Perf. O</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody >
                    {fundsData.map((data, index) => (
                      <tr key={index}>
                        <td className="text-center"> <Link href={`/Opcvm/${data.data.funds[0]?.id}`}>
                          <strong className="text-primary">
                            {(() => {
                              const maxCharacters = 15;
                              const fondName = data.data.funds[0]?.nom_fond;
                              const truncatedFondName = fondName && fondName.length > maxCharacters
                                ? fondName.slice(0, maxCharacters) + "..."
                                : fondName;
                              return truncatedFondName;
                            })()}
                          </strong>
                        </Link>
                          <br />
                          <span className="text-fade">{data.data.funds[0]?.code_ISIN}</span><br />
                          <span className="text-fade">{data.data.funds[0]?.categorie_national}</span>
                        </td>
                        <td className="text-center">{data.data.funds[0]?.devise}</td>
                        <td> <span className="text-center">{data.data.funds[0]?.datejour}</span></td>
                        <td className="text-center">
                          <span className="text-center">  {selectedDevise === 'USD'
                            ? parseFloat(data.data.funds[0]?.lastValue_USD).toFixed(2)
                            : parseFloat(data.data.funds[0]?.lastValue_EUR).toFixed(2)}  ({data.data.funds[0]?.lastValue} {data.data.funds[0]?.devise})</span><br />

                        </td>
                        <td className="text-center">
                          <strong className={`text-center ${parseFloat(data?.data?.performances?.data?.perfVeille) < 0 ? 'text-danger' : 'text-success'}`}>
                            {isNaN(parseFloat(data?.data?.performances?.data?.perfVeille)) ? '-' : parseFloat(data?.data?.performances?.data?.perfVeille).toFixed(2)} %
                          </strong>
                        </td>
                        <td className="text-center">{calculateSumOfQuantities(data.data.funds[0]?.id).toFixed(2)}</td>
                        <td className={`text-center ${calculatevalue(data) >= 0 ? 'text-success' : 'text-danger'}`}>
                          {isNaN(calculatevalue(data)) ? '0.00' : `${(calculatevalue(data)).toFixed(2)}`}
                        </td>
                        <td className="text-center">{calculateinvestissement(data).toFixed(2)}</td>
                        <td className={`text-center ${calculateProfitLoss(data) >= 0 ? 'text-success' : 'text-danger'}`}>
                          {calculateProfitLoss(data).toFixed(2)}
                        </td>
                        <td>
                          {isNaN(calculatevalue(data))}
                          <strong className={`text-center ${!isNaN(calculatevalue(data)) && !isNaN(calculateinvestissement(data)) &&
                            (((calculatevalue(data) - calculateinvestissement(data)) / calculatevalue(data)) >= 0)
                            ? 'text-success'
                            : 'text-danger'
                            }`}>
                            {(() => {
                              const value = calculatevalue(data).toFixed(2);
                              const investissement = calculateinvestissement(data);

                              if (value > 0) {
                                const result = (calculateProfitLoss(data) / investissement) * 100;
                                return `${result.toFixed(2)} %`;
                              } else {
                                return '';
                              }
                            })()}
                          </strong>

                        </td>

                        <td className="text-center">
                          {portefeuille?.data.portefeuille.cash != null && portefeuille?.data.portefeuille.cash !== 0 && (
                            <div className="text-center">
                              <Link
                                href={{
                                  pathname: '/portefeuille/portefeuillereconstitution/achat',
                                  query: {
                                    id: id, allfund: selectedfunds, selectedfund: data.data.funds[0]?.id, portefeuille: selectedportfeuille, devise: data.data.funds[0]?.devise
                                  },
                                }}
                                style={{
                                  textDecoration: 'none',
                                  backgroundColor: 'blue',
                                  color: 'white',
                                  padding: '5px 10px',
                                  borderRadius: '5px',
                                  marginRight: '5px',
                                }}
                              >
                                Achat
                              </Link>
                              <Link
                                href={{
                                  pathname: '/portefeuille/portefeuillereconstitution/vente',
                                  query: { id: id, allfund: selectedfunds, selectedfund: data.data.funds[0]?.id, portefeuille: selectedportfeuille },
                                }}
                                style={{
                                  textDecoration: 'none',
                                  backgroundColor: 'red',
                                  color: 'white',
                                  padding: '5px 10px',
                                  borderRadius: '5px',
                                }}
                              >
                                Vente
                              </Link>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <br />

              {/* Repeat the above code for other investment items */}







              {/* Repeat the above code for other investment items */}
            </div>
          </section>
        </div>
      </div >
      </div >
      </div >
    </Fragment >
  );
}