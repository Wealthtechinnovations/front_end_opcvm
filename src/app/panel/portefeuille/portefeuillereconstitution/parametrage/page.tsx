"use client";
import { urlconstant } from "@/app/constants";

import Link from "next/link";
import { Fragment, SetStateAction, useEffect, useState } from "react";
import Select from 'react-select';
//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
//import { router } from 'next/router';
import Header from "@/app/Header";

import Swal from 'sweetalert2';
import Headermenu from "@/app/Headermenu";
import Sidebar from "@/app/sidebarportefeuille";

async function getperfcategorieannuel(id: number) {
  const data = (
    await fetch(`${urlconstant}/api/performancescategorie/fond/${id}`)
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
async function getlastvl1() {
  const data = (
    await fetch(`${urlconstant}/api/searchFunds`)
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
  frais: any;
  transactions: any[];


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
interface Funds {
  data: {
    nom_portefeuille: any
    valorisation: any
    portefeuille: {
      funds: any,
      poids: any,
      montant_invest: any,
      cash: any,
      nom_portefeuille: any,
      devise: any

    }; // ou un type spécifique pour les éléments du tableau 'portefeuille'
  };
}
const min = 1;
const max = 200;
const randomValueInEuros = (Math.random() * (max - min) + min).toFixed(2);
interface Option {
  value: string;
  label: string;
  name: any;

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
  InRef: any; // Remplacez "number" par le type approprié
  // Autres propriétés
}
interface Index {
  id: string;
  name: string;
}

interface Fundss {
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
interface MyDataType {
  name: any;
  y: any;
  InRef: any; // Remplacez "number" par le type approprié
  // Autres propriétés
}
export default function Transaction(props: PageProps) {
  let selectedfunds = props?.searchParams?.selectedfund;
  let selectedportfeuille = props?.searchParams?.portefeuille;
  let selectedValuename = props?.searchParams?.selectedValuename;
  let id = props.searchParams.id;
  const [post, setPost] = useState<Fundss | null>(null);
  const [base100Data, setBase100Data] = useState<MyDataType[]>([]); // Nouvel état pour les données en base 100
  const [postc, setPostc] = useState<Funds | null>(null);

  console.log(selectedValuename);
  const [portefeuille, setPortefeuille] = useState<Funds | null>(null);
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [tsr, setTsr] = useState('');
  const [tacc, setTacc] = useState('');
  const [indices, setIndices] = useState<Index[]>([]);
  const [categories, setCategories] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState<string>();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoriesRegional, setcategoriesRegional] = useState([]);
  const [categoriesNational, setCategoriesNational] = useState([]);
  const [selectedCategoryRegional, setselectedCategoryRegional] = useState('');
  const [selectedCategoryNational, setSelectedCategoryNational] = useState('');

  const [selectedPeriod, setSelectedPeriod] = useState('1 year'); // Initialize with the default selected period
  const [filteredData, setFilteredData] = useState<Option[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${urlconstant}/api/getIndice`);
        const data = await response.json();
        setIndices(data.data.indices);

        const response1 = await fetch(`${urlconstant}/api/getCategories`);
        const data1 = await response1.json();
        setcategoriesRegional(data1.data.categoriesRegional);
        setCategoriesNational(data1.data.categoriesNational);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleRegionalChange = (e: { target: { value: any; }; }) => {
    setselectedCategoryRegional(e.target.value);
    setSelectedCategoryNational(''); // Vider la sélection nationale
  };

  const handleNationalChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setSelectedCategoryNational(e.target.value);
    setselectedCategoryRegional(''); // Vider la sélection régionale
  };
  const [datasgraphall, setdatasgraphall] = useState([]);

  const handleSubmit = async () => {
    Swal.fire({
      title: 'Veuillez patienter',
      html: 'Chargement des résultats en cours...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    console.log(selectedIndices)
    setPost(null);
    const data = {
      portfolioId: selectedportfeuille,
      indices: selectedIndices,
      categories: selectedCategoryRegional || selectedCategoryNational,
      tsr,
      tacc
    };
    try {
      //   const data3 = await getperfcategorieannuel(id);
      // setPostc(data3);
      const response = await fetch(`${urlconstant}/api/assignportefeuille`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const responseData = await response.json();

      if (responseData.code == 200) {

        console.log(responseData.data.performanceData);

        console.log(responseData.data.performanceData.data.graphs);
        setPost(responseData.data.performanceData);

        const datasgraph = responseData?.data?.performanceData?.data.graphs.map((item: { date: any; value: any; indValueRef: any; }) => ({
          name: item.date,
          y: item.value,
          InRef: item.indValueRef
        }));
        console.log(datasgraph)
        setdatasgraphall(datasgraph);

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

      } else {
        Swal.close(); // Close the loading popup

        console.error('There was an error!', response.statusText);
      }
    } catch (error) {
      console.error('There was an error!', error);
    }
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
              const lastValueInd = filteredData[0].InRef; // Dernière valeur

              console.log(filteredData[0]);
              const base100Data = filteredData.map((item: { name: any; y: number; InRef: number; }) => ({
                name: item.name,
                y: (item.y / lastValue) * 100, // Calcul en base 100
                InRef: (item.InRef / lastValueInd) * 100, // Calcul en base 100 pour InRef si nécessaire
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
            filteredData = datasgraphall.filter((item: { name: string | number | Date; }) => {
              const itemDate = new Date(item.name);
              const fiveYearsAgo = new Date();
              fiveYearsAgo.setFullYear(currentDate.getFullYear() - 5); // Date il y a 5 ans
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
        }

        setFilteredData(filteredData);



      } catch (error) {
        console.error('Erreur lors de l’appel à l’API :', error);
      }
    }
    fetchData();
  }, [selectedPeriod, datasgraphall]);

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
  const volatility = parseFloat(post?.data?.ratios3a?.data?.volatility);
  const classeSRRI = determineClasseSRRI(isNaN(volatility) ? 0 : volatility.toFixed(2));




  //const slicedPostc = postc?.data?.multipliedValues;
  const slicedPostc = null;


  let xAxisCategories: any;
  let xAxisType = 'category';
  let options;

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



  /*
  const camembertData = [
    { name: "A", y: 30 },
    { name: "B", y: 20 },
    { name: "C", y: 50 },
  ];*/
  const [isMenuOpen, setMenuOpen] = useState(true);
  const toggleMenu1 = () => setMenuOpen(!isMenuOpen);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  }
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



              <br />

              <div className="box text-align-center">
                <div className="text-center">
                  <br />
                  <h4><span className="text-primary">Paramétrage du portefeuille</span></h4>
                </div>

                <div style={{ padding: '20px' }}>

                  <div className="col-12">
                    <label>Select Indices:</label>
                    <select className="form-control" value={selectedIndices} onChange={(e) => setSelectedIndices(e.target.value)}>
                      <option value="">Sélectionner un indice</option>
                      {indices.map((index) => (
                        <option key={index.id} value={index.id}>
                          {index.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <label>Categorie regionale:</label>
                      <select className="form-control" value={selectedCategoryRegional} onChange={handleRegionalChange}>
                        <option value="">Sélectionner une catégorie régionale</option>
                        {categoriesRegional.map((category, index) => (
                          <option key={index} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-6">
                      <label>Categorie Nationale:</label>
                      <select className="form-control" value={selectedCategoryNational} onChange={handleNationalChange}>
                        <option value="">Sélectionner une catégorie nationale</option>
                        {categoriesNational.map((category, index) => (
                          <option key={index} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <label>TSR:</label>
                      <input className="form-control" type="text" value={tsr} onChange={(e) => setTsr(e.target.value)} />
                    </div>

                    <div className="col-6">
                      <label>TACC:</label>
                      <input className="form-control" type="text" value={tacc} onChange={(e) => setTacc(e.target.value)} />
                    </div>
                  </div>
                  <br />
                  <div className="text-center">
                    <button style={{
                      textDecoration: 'none', // Remove underline
                      backgroundColor: '#6366f1', // Background color
                      color: 'white', // Text color
                      padding: '10px 20px', // Padding
                      borderRadius: '5px', // Rounded corners
                    }} onClick={handleSubmit}>OK</button>

                  </div>

                </div>
              </div>
              {post &&
                <div className="box text-align-center">
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


                  <div className="row col-md-12">
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
                                  <div className="conseil-default conseil-selected"></div>
                                  <div className="conseil-default conseil-selected"></div>
                                  <div className="conseil-default"></div>
                                  <div className="conseil-default"></div>
                                  <div className="conseil-default"></div>
                                </td>
                                <td className="estimation highlight">Mauvais</td>
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
                                  <div className="conseil-default conseil-selected"></div>
                                  <div className="conseil-default conseil-selected"></div>
                                  <div className="conseil-default"></div>
                                  <div className="conseil-default"></div>
                                  <div className="conseil-default"></div>
                                </td>
                                <td className="estimation highlight">Mauvais</td>
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
                                  <div className="conseil-default conseil-selected"></div>
                                  <div className="conseil-default conseil-selected"></div>
                                  <div className="conseil-default"></div>
                                  <div className="conseil-default"></div>
                                  <div className="conseil-default"></div>
                                </td>
                                <td className="estimation highlight">Mauvais</td>
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
                                  <div className="conseil-default conseil-selected"></div>
                                  <div className="conseil-default conseil-selected"></div>
                                  <div className="conseil-default conseil-selected"></div>
                                  <div className="conseil-default"></div>
                                  <div className="conseil-default"></div>
                                </td>
                                <td className="estimation highlight">Moyen</td>
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
                                  <div className="conseil-default conseil-selected"></div>
                                  <div className="conseil-default"></div>
                                  <div className="conseil-default"></div>
                                  <div className="conseil-default"></div>
                                  <div className="conseil-default"></div>
                                </td>
                                <td className="estimation highlight">Très mauvais</td>
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
                                  <div className="conseil-default conseil-selected"></div>
                                  <div className="conseil-default conseil-selected"></div>
                                  <div className="conseil-default"></div>
                                  <div className="conseil-default"></div>
                                  <div className="conseil-default"></div>
                                </td>
                                <td className="estimation highlight">Mauvais</td>
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
                                  <div className="conseil-default conseil-selected"></div>
                                  <div className="conseil-default conseil-selected"></div>
                                  <div className="conseil-default"></div>
                                  <div className="conseil-default"></div>
                                  <div className="conseil-default"></div>
                                </td>
                                <td className="estimation highlight">Mauvais</td>
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
                                  <div className="conseil-default conseil-selected"></div>
                                  <div className="conseil-default conseil-selected"></div>
                                  <div className="conseil-default"></div>
                                  <div className="conseil-default"></div>
                                  <div className="conseil-default"></div>
                                </td>
                                <td className="estimation highlight">Mauvais</td>
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
                                  <div className="conseil-default conseil-selected"></div>
                                  <div className="conseil-default conseil-selected"></div>
                                  <div className="conseil-default conseil-selected"></div>
                                  <div className="conseil-default"></div>
                                  <div className="conseil-default"></div>
                                </td>
                                <td className="estimation highlight">Moyen</td>
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
                                  <div className="conseil-default conseil-selected"></div>
                                  <div className="conseil-default"></div>
                                  <div className="conseil-default"></div>
                                  <div className="conseil-default"></div>
                                  <div className="conseil-default"></div>
                                </td>
                                <td className="estimation highlight">Très mauvais</td>
                              </tr>
                            </tbody>
                          </table>



                        </div>
                      </div>

                    </div>

                  </div>


                </div>
              }


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