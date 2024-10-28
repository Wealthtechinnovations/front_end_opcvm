"use client";
import { urlconstant } from "@/app/constants";

import Link from "next/link";
import { Fragment, JSXElementConstructor, Key, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, SetStateAction, useEffect, useState } from "react";
import Select, { SingleValue } from 'react-select';
//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
//import { router } from 'next/router';

import { useRouter } from 'next/navigation';
import { Console } from "console";
import Swal from 'sweetalert2';
import { Button } from "react-bootstrap";
import Header from "@/app/Header";


const options = [
  { value: 1, label: 'Option 1' },
  { value: 2, label: 'Option 2' },
  { value: 3, label: 'Option 3' },
  // Ajoutez plus d'options au besoin
];

interface Pays {
  value: any[]; // ou un type spécifique pour les éléments du tableau 'portefeuile'

}
interface Funds {
  data: {
    portefeuille: any[]; // ou un type spécifique pour les éléments du tableau 'portefeuille'
  };
}
interface Portefeuillepropose {
  data: {
    filteredPortfolios: any[]; // ou un type spécifique pour les éléments du tableau 'portefeuille'
  };
}

type CategoryValues = {
  [key: string]: {
    min?: string;
    max?: string;
  };
};

interface Option {
  value: string;
}
interface PageProps {
  searchParams: {
    selectedfund: any;
    portefeuille: any;
    funds: any;
    simulation: any;
    id: any
  };
}
async function getlastvl1() {
  const data = (
    await fetch(`${urlconstant}/api/searchFunds`)
  ).json();
  return data;
}
const optionsCategorie = [
  { value: "Obligations", label: 'Obligations' },
  { value: "Actions", label: 'Actions' },
  { value: "Diversifié", label: 'Diversifié' },
  { value: "Monétaire", label: 'Monétaire' },
  /*  { value: "ETF", label: 'ETF' },
    { value: "Infrastructure", label: 'Infrastructure' },
    { value: "Immobilier", label: 'Immobilier' },
    { value: "Private equity", label: 'Private equity' },
    { value: "Alternatif", label: 'Alternatif' },
  
    { value: "Autres", label: 'Autres' },*/





  // Ajoutez plus d'options au besoin
];

interface EfficientFrontierData {
  risks: number[];
  returns: number[];
}
interface Option {
  value: string;
  label: string;
}
interface Rendement {
  id: number;
  date: string;
  rendement_journalier: number | null;
  rendement_mensuel: number | null;
  rendement_semaine: number | null;
}

interface Fund {
  idfond: number;
  nom_fond: string;
  categorie: string;
  rendements: Rendement[];
}
interface PortfolioData {
  max_sharpe_weights: number[];
  efficient_portfolios: number[][];
  frontier: {
    risks: number[];
    returns: number[];
  };
  frontier_image: string;
}
export default function RoboAdvisor(props: PageProps) {

  const [selectedOptions1, setSelectedOptions1] = useState<Option[]>([
    { value: "Actions", label: 'Actions' },
    { value: "Obligations", label: 'Obligations' },
    { value: "Diversifié", label: 'Diversifié' },
    { value: "Monétaire", label: 'Monétaire' }
  ]);
  const [showFundCountInfo, setShowFundCountInfo] = useState<boolean | null>(null);
  const [etape, setEtape] = useState<number>(1);
  const [showWeightInfo, setShowWeightInfo] = useState<boolean | null>(null);
  const [showActionWeightInfo, setShowActionWeightInfo] = useState<boolean | null>(null);
  const [showObligationWeightInfo, setShowObligationWeightInfo] = useState<boolean | null>(null);
  const [showMonetaryWeightInfo, setShowMonetaryWeightInfo] = useState<boolean | null>(null);
  const [showDiversifiedWeightInfo, setShowDiversifiedWeightInfo] = useState<boolean | null>(null);
  const [showSRRIInfo, setShowSRRIInfo] = useState<boolean | null>(null);
  const [showCurrencyDistributionInfo, setShowCurrencyDistributionInfo] = useState<boolean | null>(null);
  const router = useRouter();
  const minWeightArray: number[] = [];
  const maxWeightArray: number[] = [];
  const simulation = props?.searchParams?.simulation;
  const portefeuille = props?.searchParams?.portefeuille;
  const [isOpen, setIsOpen] = useState(false);
  const [fundsOptions, setFundsOptions] = useState([]);

  // const [portefeuille, setPortefeuille] = useState<Funds | null>(null);
  const [portefeuillePropose, setPortefeuillePropose] = useState<PortfolioData | null>(null);
  const nextPage = () => {
    setFormData({ ...formData, page: formData.page + 1 });
  };

  const prevPage = () => {
    setFormData({ ...formData, page: formData.page - 1 });
  };
  const [searchResults, setSearchResults] = useState([]); // État pour stocker les résultats de la recherche
  const [error, setError] = useState(""); // État pour stocker le message d'erreur
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = (e: any) => {
    e.preventDefault();
    // Effectuez votre recherche ici si nécessaire
  };

  const viderinput = () => {
    setMinWeights([]);
    setMaxWeights([]);
    setFormData({
      page: 1,
      nomportefeuille: '',
      nombreligne: '',
      nombreportefeuille: '',
      robottype: '',
      minWeight: [],
      maxWeight: [],
      minReturn: '',
      maxReturn: '',
      minVolatility: '',
      maxVolatility: '',
      totalInvestment: '',
      date: '',
      min_srri: '',
      max_srri: '',
      max_weight_per_fund: '',
      min_weight_per_fund: '',
      min_number_of_funds: '',
      max_number_of_funds: '',
      nombreMinFonds: '',
      nombreMaxFonds: '',
      minPoidsFonds: '',
      maxPoidsFonds: '',
      minSRRI: '',
      maxSRRI: '',
      minWeightPerFund: '',
      maxWeightPerFund: '',
      minRepartitionDevise: '',
      maxRepartitionDevise: '',
      maxWeightActions: '',
      minWeightActions: '',
      maxWeightObligations: '',
      minWeightObligations: '',
      maxWeightDiversifies: '',
      minWeightDiversifies: '',
      maxWeightMonetaires: '',
      minWeightMonetaires: ''



    });

  };
  const handleCheckboxChange = (index: number) => {
    console.log(index)
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(index)
        ? prevSelectedRows.filter((i) => i !== index)
        : [...prevSelectedRows, index]
    );
  };

  let id = props.searchParams.id;

  const [currentMinWeight, setCurrentMinWeight] = useState('');
  const [currentMaxWeight, setCurrentMaxWeight] = useState('');
  const [minWeights, setMinWeights] = useState<number[]>([]);
  const [maxWeights, setMaxWeights] = useState<number[]>([]);
  const [efficientFrontierData, setEfficientFrontierData] = useState<EfficientFrontierData | null>(null);

  // Définissez les gestionnaires de changement pour mettre à jour les états minWeights et maxWeights
  const handleMinWeightChange = (value: number, index: number) => {
    console.log(minWeights);
    const newMinWeights = [...minWeights];
    newMinWeights[index] = value;
    setMinWeights(newMinWeights);
  };

  const handleMaxWeightChange = (value: number, index: number) => {
    const newMaxWeights = [...maxWeights];
    newMaxWeights[index] = value;
    setMaxWeights(newMaxWeights);
  };


  const [formData, setFormData] = useState({
    page: 1,
    nomportefeuille: '',
    nombreligne: '',
    nombreportefeuille: '',
    robottype: '',
    minWeight: [],
    maxWeight: [],
    minReturn: '',
    maxReturn: '',
    minVolatility: '',
    maxVolatility: '',
    totalInvestment: '',
    date: '',
    min_srri: '',
    max_srri: '',
    max_weight_per_fund: '',
    min_weight_per_fund: '',
    min_number_of_funds: '',
    max_number_of_funds: '',
    nombreMinFonds: '',
    nombreMaxFonds: '',
    minPoidsFonds: '',
    maxPoidsFonds: '',
    minSRRI: '',
    maxSRRI: '',
    minWeightPerFund: '',
    maxWeightPerFund: '',
    minRepartitionDevise: '',
    maxRepartitionDevise: '',
    maxWeightActions: '',
    minWeightActions: '',
    maxWeightObligations: '',
    minWeightObligations: '',
    maxWeightDiversifies: '',
    minWeightDiversifies: '',
    maxWeightMonetaires: '',
    minWeightMonetaires: '',




  });
  const [choix, setChoix] = useState('');
  const handleChoixChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setChoix(event.target.value);
    setSelectedOptions([]); // Reset selected options when choix changes
  };
  useEffect(() => {
    // Appel à l'API lors du premier rendu du composant
    async function fetchData() {
      try {
        const data1 = await getlastvl1();
        console.log(data1);
        const mappedOptions = data1?.data.funds.map((funds: any) => ({
          value: funds.value,
          label: funds.label,
        }));

        // D'abord, initialisez les options.
        setFundsOptions(mappedOptions);

      } catch (error) {
        console.error("Erreur lors de l'appel à l'API :", error);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      console.log(formData)
      setError("");
      const formDatas = new URLSearchParams();
      formDatas.append("minReturn", formData.minReturn); // Remplacez "valeur-de-minReturn" par la valeur de minReturn
      formDatas.append("maxReturn", formData.maxReturn); // Remplacez "valeur-de-maxReturn" par la valeur de maxReturn
      formDatas.append("minVolatility", formData.minVolatility); // Remplacez "valeur-de-minVolatility" par la valeur de minVolatility
      formDatas.append("maxVolatility", formData.maxVolatility); // Remplacez "valeur-de-maxVolatility" par la valeur de maxVolatility
      formDatas.append("minweight", JSON.stringify(minWeights)); // Remplacez "valeur-de-minReturn" par la valeur de minReturn
      formDatas.append("maxweight", JSON.stringify(maxWeights)); // Remplacez "valeur-de-minReturn" par la valeur de minReturn
      formDatas.append("min_srri", formData.min_srri);
      formDatas.append("max_srri", formData.max_srri);
      const url = `${urlconstant}/api/robotadvisor/fonds?${formDatas.toString()}`;
      // Envoyer les données du formulaire à l'API

      const datas = (await fetch(url
      )).json();

      const data1 = await datas;

      if (data1.data.filteredPortfolios.length === 0) {
        console.log("datas")

        // Aucune donnée trouvée, affichez un message d'erreur
        setError("Aucun résultat trouvé. Réessayez avec d'autres critères.");
      } else {
        console.log("datas1")

        // Réinitialisez le message d'erreur s'il y a des données
        setError("");
      }
    } catch (error) {
      // Gérer les erreurs de l'API (par exemple, afficher une erreur)
      console.error('Erreur lors de la soumission du formulaire :', error);
    }
  };
  const [fundData, setFundData] = useState<Fund[]>([]);
  const [periodicite, setPeriodicite] = useState('');

  const handleSubmitfe = async (e: any) => {
    e.preventDefault();
    setEfficientFrontierData(null);
    try {
      Swal.fire({
        title: 'Veuillez patienter',
        html: 'Chargement!...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      setError("");

      const ids = selectedOptions.map(option => option.value);
      const fund_names = selectedOptions.map(option => option.label);

      const categories = selectedOptions1.map(option => option.value);

      // Premier appel pour récupérer les données des fonds
      const params = new URLSearchParams({
        ids: ids.join(','),
        categorie: categories.join(',')
      });

      /* const response = await fetch(`${urlconstant}/api/rendement/fonds?${params.toString()}`);
       const result = await response.json();
 
       if (result.code === 200) {
         console.log(result.data)
         setFundData(result.data.fonds);
         setPeriodicite(result.data.periodicite);
       } else {
         throw new Error(result.message || 'Une erreur s\'est produite.');
       }
 
       // Formatage des valeurs de catégorie si nécessaire
       const formattedCategoryValues = Object.entries(categoryValues).map(([category, values]) => ({
         category,
         ...values,
       }));
 
       // Vérification pour s'assurer qu'il y a des données de fonds à traiter
       if (result.data.fonds.length === 0) return;
 
       // Fonction pour comparer les dates en format YYYY_WW et YYYY_MM
       const isDateInRange = (date: string, start: string, end: string) => {
         const dateParts = date.split(/[-_]/);
         const startParts = start.split(/[-_]/);
         const endParts = end.split(/[-_]/);
 
         const dateValue = dateParts[0] + dateParts[1];
         const startValue = startParts[0] + startParts[1];
         const endValue = endParts[0] + endParts[1];
 
         return dateValue >= startValue && dateValue <= endValue;
       };
 
       const filteredFunds = result.data.fonds.map((fund: { rendements: any[]; }) => {
         const rendementsFiltres = fund.rendements
           .filter((rendement) => isDateInRange(rendement.date, '2022_W01', '2022_W52'))
           .map((rendement) => {
             return result.data.periodicite === 'Hebdomadaire' ? parseFloat(rendement.rendement_semaine) : parseFloat(rendement.rendement_semaine);
           });
 
         return {
           ...fund,
           rendementsFiltres: rendementsFiltres.length > 51 ? rendementsFiltres : null
         };
       }).filter((fund: { rendementsFiltres: null; }) => fund.rendementsFiltres !== null);
 
       // Extraire les rendements filtrés
       const filteredReturns = filteredFunds.map((fund: { rendementsFiltres: any; }) => fund.rendementsFiltres);
 
       console.log(filteredReturns);
       // Extraire les détails des fonds filtrés
       const fundDetails = filteredFunds.map((fund: { nom_fond: any; idfond: any; pays: any; categorie: any; }) => ({
         nom_fond: fund.nom_fond,
         idfond: fund.idfond,
         pays: fund.pays,
         categorie: fund.categorie,
       }));
 */
      // Deuxième appel pour l'efficacité de la frontière
      try {
        // Formatage des valeurs de catégorie si nécessaire
        const formattedCategoryValues = Object.entries(categoryValues).map(([category, values]) => ({
          category,
          ...values,
        }));

        //   console.log(fundDetails);
        const response1 = await fetch('http://localhost:5000/efficient-frontier', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            //  returns: filteredReturns,
            //  period: result.data.periodicite,
            fund_data: [], // Ajoutez ici les données des fonds
            param_data: {
              min_return: formData.minReturn,
              max_return: formData.maxReturn,
              min_risk: formData.minVolatility,
              max_risk: formData.maxVolatility,
              num_portfolio: formData.nombreportefeuille, // Remplacez par le bon champ
            },
            constraint_data: {
              Min_funds: formData.nombreMinFonds,
              Max_funds: formData.nombreMaxFonds,
              Min_weight_per_fund: formData.minWeightPerFund,
              Max_weight_per_fund: formData.maxWeightPerFund,
              Min_weight_actions: formData.minWeightActions,
              Max_weight_actions: formData.maxWeightActions,
              Min_weight_obligations: formData.minWeightObligations,
              Max_weight_obligations: formData.maxWeightObligations,
              Min_weight_monetary: formData.minWeightMonetaires,
              Max_weight_monetary: formData.maxWeightMonetaires,
              Min_weight_diversified: formData.minWeightDiversifies,
              Max_weight_diversified: formData.maxWeightDiversifies,
              Min_SRRI: formData.minSRRI,
              Max_SRRI: formData.maxSRRI,
              Min_currency_allocation: formData.minRepartitionDevise,
              Max_currency_allocation: formData.maxRepartitionDevise,
            }
          })
        });

        const result1 = await response1.json();
        console.log(result1);
        console.log(result1.frontier);
        setEfficientFrontierData(result1.frontier);
        setPortefeuillePropose(result1);
      } catch (error) {
        console.error('Erreur lors de la requête vers efficient-frontier :', error);
      }

      Swal.close(); // Fermer le popup après que la requête est terminée

    } catch (error) {
      Swal.close(); // Fermer le popup après que la requête est terminée

      // Gérer les erreurs de l'API (par exemple, afficher une erreur)
      console.error('Erreur lors de la soumission du formulaire :', error);
    }
  };

  const options = efficientFrontierData ? {
    chart: {
      type: 'scatter',
      zoomType: 'xy'
    },
    title: {
      text: 'Frontière Efficiente'
    },
    xAxis: {
      title: {
        enabled: true,
        text: 'Volatilité (Risque)'
      },
      startOnTick: true,
      endOnTick: true,
      showLastLabel: true
    },
    yAxis: {
      title: {
        text: 'Rendement'
      }
    },
    series: [{
      name: 'Portefeuille',
      color: 'rgba(223, 83, 83, .5)',
      data: efficientFrontierData.risks.map((risk: any, index: number) => [risk, efficientFrontierData.returns[index]])
    }]
  } : {};
  const [showAdvancedConditions, setShowAdvancedConditions] = useState(false);
  const [categoryValues, setCategoryValues] = useState<CategoryValues>({});

  const toggleMenu = () => {
    console.log(showAdvancedConditions);
    setShowAdvancedConditions(!showAdvancedConditions);
  };

  const handleCategoryValueChange = (category: string, type: 'min' | 'max', value: string) => {
    setCategoryValues((prevValues) => ({
      ...prevValues,
      [category]: {
        ...prevValues[category],
        [type]: value,
      },
    }));
  };


  const handleSubmit1 = async (e: any) => {
    e.preventDefault();

    try {
      Swal.fire({
        title: 'Veuillez patienter',
        html: 'Chargement des résultats en cours...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      console.log(selectedRows)

      const selectedPortfolios = selectedRows.map(index => ({
        poids: portefeuillePropose?.efficient_portfolios[index],
        fond: "some_fond_value", // Replace with actual value
        simulation_id: parseInt(simulation), // Replace with actual value
        portefeuille_id: null, // This will be auto-incremented
        nom: formData.nomportefeuille + " " + (index + 1).toString() // Correction ici
      }));

      console.log(selectedPortfolios);

      const response = await fetch(`${urlconstant}/api/postportefeuillepropose`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Spécifiez le type de contenu que vous envoyez
        },
        body: JSON.stringify({ portfolios: selectedPortfolios })
      });

      const result = await response.json();
      if (response.ok) {
        Swal.close(); // Close the loading popup

        setTimeout(() => {
          const href = `/panel/portefeuille/robotadvisor/portefeuillerobot?id=${id}`;

          router.push(href);
        }, 2000);
      } else {
        Swal.close(); // Close the loading popup
      }


    } catch (error) {
      Swal.close(); // Close the loading popup

      // Gérer les erreurs de l'API (par exemple, afficher une erreur)
      console.error('Erreur lors de la soumission du formulaire :', error);
    }
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  return (



    < Fragment >
      <Header />
      <aside className="main-sidebar">
        <section className="sidebar position-relative">
          <div className="multinav">
            <div className="multinav-scroll" style={{ height: '97%' }}>
              <ul className="sidebar-menu" data-widget="tree">


                <li>
                  <Link href={`/panel/portefeuille/home?id=${id}`} style={{ backgroundColor: "#3b82f6", color: "white" }} >
                    <i data-feather="plus-square"></i>
                    <span>PorteFeuile</span>
                  </Link>
                </li>
                <li className={`dropdown ${isDropdownOpen ? 'open' : ''}`}>
                  <a href="#" onClick={toggleDropdown} className="dropdown-toggle" data-toggle="dropdown" >
                    <i data-feather={isDropdownOpen ? "minus-square" : "plus-square"}></i>
                    <span>Profil investisseur</span>
                  </a>
                  {isDropdownOpen && (
                    <>
                      <li>
                        <a href={`/panel/portefeuille/profile?id=${id}`}>   <i className="bi bi-check2"></i>
                          <span style={{ marginLeft: '55px' }}>Profil</span></a>
                      </li>
                      <li>
                        <a href={`/panel/portefeuille/questionnaire?id=${id}`}>
                          <span style={{ marginLeft: '55px' }}>Questionnaire</span></a>
                      </li>
                    </>
                  )}
                </li>
                <li>
                  <Link href={`/accueil`}>
                    <i data-feather="user"></i>
                    <span>Se deconnecter</span>
                  </Link>
                </li>




                {/* ... (autres éléments du menu) */}
              </ul>

              <div className="sidebar-widgets">
                <div className="mx-25 mb-30 pb-20 side-bx bg-primary-light rounded20">
                  <div className="text-center">
                    <img src="../../../images/svg-icon/color-svg/custom-32.svg" className="sideimg p-5" alt="" />
                    <h4 className="title-bx text-primary">Portefeuille Panel</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </aside>
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
            <div className="col-12">
              <div className="box ">
                <div className="box-body">
                  <div className="d-md justify-content-between align-items-center">
                    <div className="panel-heading p-b-0">
                      <div className="row row-no-gutters">
                        <div className="col-lg-12  text-center-xs p-t-1">

                        </div>

                        <div className="col-lg-2 col-md-2 col-sm-3 col-xs-12 text-center p-l-1 p-t-1" data-toggle="tooltip" data-placement="top" data-original-title="" title="">
                          <div style={{ display: 'inline-block' }} title="42 / 100 au 31/08/2023">
                            <div className="spritefonds sprite-3g icon-med" style={{ display: 'inline-block' }}></div>
                            <div className="notation-appix">

                            </div>
                          </div>
                        </div>


                      </div>
                    </div>
                    <div>
                      <p><span className="text-primary">Robot Advisor</span> | <span className="text-fade"></span></p>

                    </div>

                  </div>
                  <hr />
                  {formData.page === 1 && (
                    <form onSubmit={handleSubmit}>

                      <div>
                        <div className="row">
                          <div className="col-6">
                            <label>Nom du portefeuille:</label>
                            <input
                              type="text"
                              className="form-control"
                              name="nomportefeuille"
                              value={formData.nomportefeuille}
                              onChange={(e) => setFormData({ ...formData, nomportefeuille: e.target.value })}
                              required
                            />

                          </div>
                          <div className="col-6">
                            <label>Sélectionnez le type de robot:</label>
                            <select className="form-control" required value={formData.robottype} onChange={(e) => setFormData({ ...formData, robottype: e.target.value })}
                            >
                              <option value="">Sélectionnez...</option>
                              <option value="Minweight">Minweight</option>
                              <option value="Frontière Efficiente">Frontière Efficiente</option>

                            </select>



                            <br />


                          </div>

                          <div className="col-6">
                            <label>Retour minimum attendu (en%):</label>
                            <input
                              type="number"
                              className="form-control"
                              name="min_return"
                              value={formData.minReturn}
                              onChange={(e) => setFormData({ ...formData, minReturn: e.target.value })}
                              required
                            />
                          </div>
                          <div className="col-6">
                            <label>Retour maximum attendu (en%):</label>
                            <input
                              type="number"
                              className="form-control"
                              name="max_return"
                              value={formData.maxReturn}
                              onChange={(e) => setFormData({ ...formData, maxReturn: e.target.value })}
                              required
                            />
                          </div>
                          <div className="col-6">
                            <label>Risque minimum attendu (en%):</label>
                            <input
                              type="number"
                              className="form-control"
                              name="min_risk"
                              value={formData.minVolatility}
                              onChange={(e) => setFormData({ ...formData, minVolatility: e.target.value })}
                              required
                            />
                          </div>
                          <div className="col-6">
                            <label>Risque maximum attendu (en%):</label>
                            <input
                              type="number"
                              className="form-control"
                              name="max_risk"
                              value={formData.maxVolatility}
                              onChange={(e) => setFormData({ ...formData, maxVolatility: e.target.value })}
                              required
                            />
                          </div>


                        </div>
                        <br />

                        {formData.robottype != '' ? (

                          <div className="text-right">

                            <button style={{
                              textDecoration: 'none', // Remove underline
                              backgroundColor: '#6366f1', // Background color
                              color: 'white', // Text color
                              padding: '10px 20px', // Padding
                              borderRadius: '5px', // Rounded corners
                            }} onClick={nextPage}>Suivant</button>

                          </div>) : <p></p>}
                      </div>
                    </form>

                  )}
                  {formData.page === 2 && formData.robottype === "Minweight" && (
                    <form onSubmit={handleSubmit}>
                      <div>

                        <div>
                          <div>

                            <div className="row">

                              <div className="col-6">
                                <label>
                                  Min return* (en%):
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="minReturn"
                                  value={formData.minReturn}
                                  onChange={(e) => setFormData({ ...formData, minReturn: e.target.value })}
                                  required
                                />

                              </div>
                              <div className="col-6">
                                <label>
                                  Max return* (en%):
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="maxReturn"
                                  value={formData.maxReturn}
                                  onChange={(e) => setFormData({ ...formData, maxReturn: e.target.value })}
                                  required
                                />

                              </div>
                            </div>
                            <div className="row">
                              <div className="col-6">
                                <label>
                                  Min Volatility* (en%):
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="minVolatility"
                                  value={formData.minVolatility}
                                  onChange={(e) => setFormData({ ...formData, minVolatility: e.target.value })}
                                  required
                                />

                              </div>
                              <div className="col-6">
                                <label>
                                  Max Volatility* (en%):
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="maxVolatility"
                                  value={formData.maxVolatility}
                                  onChange={(e) => setFormData({ ...formData, maxVolatility: e.target.value })}
                                  required
                                />

                              </div>
                            </div>
                            <br />
                            <div className="row">
                              <div className="col-6 text-left">
                                <button className="btn btn-main" style={{ backgroundColor: "RED", color: "white" }} onClick={viderinput}>Vider</button>
                              </div>
                              <div className=" col-6 text-right">
                                <button className="btn btn-main" style={{ backgroundColor: "#6366f1", color: "white" }} onClick={toggleMenu}>Conditions d allocation avancée</button>
                              </div>
                            </div>




                            < br />
                            <div className="text-center">
                              <button style={{
                                textDecoration: 'none', // Remove underline
                                backgroundColor: '#6366f1', // Background color
                                color: 'white', // Text color
                                padding: '10px 20px', // Padding
                                borderRadius: '5px', // Rounded corners
                              }} >Rechercher</button>
                            </div>

                          </div>




                        </div>

                      </div>
                    </form>

                  )}
                  {formData.page === 2 && formData.robottype == "Frontière Efficiente" && (
                    <form onSubmit={handleSubmitfe}>


                      <div>
                      {etape==1 && (
                        <div style={{ padding: '10px', margin: '10px' }}>
                          <p >Voulez-vous renseigner  le nombre de fonds ?</p>
                          <div className="button-group" style={{ display: 'flex', justifyContent: 'space-between', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
                            <a href="#" onClick={() => { setShowFundCountInfo(true);setEtape(2)}} style={{ color: 'red', textDecoration: 'none', padding: '10px 20px', borderRadius: '5px', backgroundColor: '#f2f2f2', border: '1px solid #ccc' }}>Oui</a>
                            <a href="#" onClick={() => { setShowFundCountInfo(false);setEtape(2) }} style={{ color: 'orange', textDecoration: 'none', padding: '10px 20px', borderRadius: '5px', backgroundColor: '#f2f2f2', border: '1px solid #ccc' }}>Non</a>
                          </div>
                        </div>
                      )}
                        {showFundCountInfo  && (
                          <fieldset>
                            <legend>Nombre de fonds</legend>
                            <div className="row">
                              <div className="col-6">
                                <label>Nombre minimum de fonds dans le portefeuille</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="nombreMinFonds"
                                  value={formData.nombreMinFonds}
                                  onChange={(e) => setFormData({ ...formData, nombreMinFonds: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="col-6">
                                <label>Nombre maximum de fonds dans le portefeuille</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="nombreMaxFonds"
                                  value={formData.nombreMaxFonds}
                                  onChange={(e) => { setFormData({ ...formData, nombreMaxFonds: e.target.value })}}
                                  required
                                />
                              </div>
                            </div>
                          </fieldset>
                        )}
                        {etape==2  || (formData.nombreMinFonds && formData.nombreMaxFonds)? (
                           <div style={{ padding: '10px', margin: '10px' }}>
                           <p >Voulez-vous renseigner la pondération par fonds ?</p>
                           <div className="button-group" style={{ display: 'flex', justifyContent: 'space-between', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
                             <a href="#" onClick={() => setShowWeightInfo(true)} style={{ color: 'red', textDecoration: 'none', padding: '10px 20px', borderRadius: '5px', backgroundColor: '#f2f2f2', border: '1px solid #ccc' }}>Oui</a>
                             <a href="#" onClick={() => { setShowWeightInfo(false);setEtape(3) }} style={{ color: 'orange', textDecoration: 'none', padding: '10px 20px', borderRadius: '5px', backgroundColor: '#f2f2f2', border: '1px solid #ccc' }}>Non</a>
                           </div>
                         </div>
                        ) : null}
                        {showWeightInfo && (
                          <fieldset>
                            <legend>Pondération par fonds</legend>
                            <div className="row">
                              <div className="col-6">
                                <label>Pondération minimale par fonds (en%)</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="minWeightPerFund"
                                  value={formData.minWeightPerFund}
                                  onChange={(e) => setFormData({ ...formData, minWeightPerFund: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="col-6">
                                <label>Pondération maximale par fonds (en%)</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="maxWeightPerFund"
                                  value={formData.maxWeightPerFund}
                                  onChange={(e) => setFormData({ ...formData, maxWeightPerFund: e.target.value })}
                                  required
                                />
                              </div>
                            </div>
                          </fieldset>
                        )}
                        {etape==3 ||(formData.minWeightPerFund && formData.maxWeightPerFund)  ? (
                           <div style={{ padding: '10px', margin: '10px' }}>
                           <p >Voulez-vous renseigner la pondération par actions ?</p>
                           <div className="button-group" style={{ display: 'flex', justifyContent: 'space-between', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
                             <a href="#" onClick={() => setShowActionWeightInfo(true)} style={{ color: 'red', textDecoration: 'none', padding: '10px 20px', borderRadius: '5px', backgroundColor: '#f2f2f2', border: '1px solid #ccc' }}>Oui</a>
                             <a href="#" onClick={() => { setShowActionWeightInfo(false);setEtape(4) }} style={{ color: 'orange', textDecoration: 'none', padding: '10px 20px', borderRadius: '5px', backgroundColor: '#f2f2f2', border: '1px solid #ccc' }}>Non</a>
                           </div>
                         </div>
                        ):null}
                        {showActionWeightInfo && (
                          <fieldset>
                            <legend>Pondération des actions</legend>
                            <div className="row">
                              <div className="col-6">
                                <label>Pondération minimale des actions (en%)</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="minWeightActions"
                                  value={formData.minWeightActions}
                                  onChange={(e) => setFormData({ ...formData, minWeightActions: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="col-6">
                                <label>Pondération maximale des actions (en%)</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="maxWeightActions"
                                  value={formData.maxWeightActions}
                                  onChange={(e) => setFormData({ ...formData, maxWeightActions: e.target.value })}
                                  required
                                />
                              </div>
                            </div>
                          </fieldset>
                        )}
                        {etape==4 || (formData.minWeightActions && formData.maxWeightActions)?(
                          <div style={{ padding: '10px', margin: '10px' }}>
                          <p >Voulez-vous renseigner la pondération par obligations ?</p>
                          <div className="button-group" style={{ display: 'flex', justifyContent: 'space-between', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
                            <a href="#" onClick={() => setShowObligationWeightInfo(true)} style={{ color: 'red', textDecoration: 'none', padding: '10px 20px', borderRadius: '5px', backgroundColor: '#f2f2f2', border: '1px solid #ccc' }}>Oui</a>
                            <a href="#" onClick={() => { setShowObligationWeightInfo(false);setEtape(5) }} style={{ color: 'orange', textDecoration: 'none', padding: '10px 20px', borderRadius: '5px', backgroundColor: '#f2f2f2', border: '1px solid #ccc' }}>Non</a>
                          </div>
                        </div>
                        ):null}
                        {showObligationWeightInfo && (
                          <fieldset>
                            <legend>Pondération des obligations</legend>
                            <div className="row">
                              <div className="col-6">
                                <label>Pondération minimale des obligations (en%)</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="minWeightObligations"
                                  value={formData.minWeightObligations}
                                  onChange={(e) => setFormData({ ...formData, minWeightObligations: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="col-6">
                                <label>Pondération maximale des obligations (en%)</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="maxWeightObligations"
                                  value={formData.maxWeightObligations}
                                  onChange={(e) => setFormData({ ...formData, maxWeightObligations: e.target.value })}
                                  required
                                />
                              </div>
                            </div>
                          </fieldset>
                        )}
                        {etape==5 || (formData.minWeightObligations && formData.maxWeightObligations) ? (
                           <div style={{ padding: '10px', margin: '10px' }}>
                           <p >Voulez-vous renseigner la pondération par monétaires ?</p>
                           <div className="button-group" style={{ display: 'flex', justifyContent: 'space-between', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
                             <a href="#" onClick={() => setShowMonetaryWeightInfo(true)} style={{ color: 'red', textDecoration: 'none', padding: '10px 20px', borderRadius: '5px', backgroundColor: '#f2f2f2', border: '1px solid #ccc' }}>Oui</a>
                             <a href="#" onClick={() => { setShowMonetaryWeightInfo(false);setEtape(6) }} style={{ color: 'orange', textDecoration: 'none', padding: '10px 20px', borderRadius: '5px', backgroundColor: '#f2f2f2', border: '1px solid #ccc' }}>Non</a>
                           </div>
                         </div>
                        ):null}
                        {showMonetaryWeightInfo && (
                          <fieldset>
                            <legend>Pondération des instruments monétaires</legend>
                            <div className="row">
                              <div className="col-6">
                                <label>Pondération minimale des instruments monétaires (en%)</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="minWeightMonetaires"
                                  value={formData.minWeightMonetaires}
                                  onChange={(e) => setFormData({ ...formData, minWeightMonetaires: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="col-6">
                                <label>Pondération maximale des instruments monétaires (en%)</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="maxWeightMonetaires"
                                  value={formData.maxWeightMonetaires}
                                  onChange={(e) => setFormData({ ...formData, maxWeightMonetaires: e.target.value })}
                                  required
                                />
                              </div>
                            </div>
                          </fieldset>
                        )}
                        {etape==6 || (formData.minWeightMonetaires && formData.maxWeightMonetaires)  ?(
                          <div style={{ padding: '10px', margin: '10px' }}>
                          <p >Voulez-vous renseigner la pondération par diversifiés ?</p>
                          <div className="button-group" style={{ display: 'flex', justifyContent: 'space-between', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
                            <a href="#" onClick={() => setShowDiversifiedWeightInfo(true)} style={{ color: 'red', textDecoration: 'none', padding: '10px 20px', borderRadius: '5px', backgroundColor: '#f2f2f2', border: '1px solid #ccc' }}>Oui</a>
                            <a href="#" onClick={() => { setShowDiversifiedWeightInfo(false);setEtape(7) }} style={{ color: 'orange', textDecoration: 'none', padding: '10px 20px', borderRadius: '5px', backgroundColor: '#f2f2f2', border: '1px solid #ccc' }}>Non</a>
                          </div>
                        </div>
                        ):null}
                        {showDiversifiedWeightInfo && (
                          <fieldset>
                            <legend>Pondération des investissements diversifiés</legend>
                            <div className="row">
                              <div className="col-6">
                                <label>Pondération minimale des investissements diversifiés (en%)</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="minWeightDiversifies"
                                  value={formData.minWeightDiversifies}
                                  onChange={(e) => setFormData({ ...formData, minWeightDiversifies: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="col-6">
                                <label>Pondération maximale des investissements diversifiés (en%)</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="maxWeightDiversifies"
                                  value={formData.maxWeightDiversifies}
                                  onChange={(e) => setFormData({ ...formData, maxWeightDiversifies: e.target.value })}
                                  required
                                />
                              </div>
                            </div>
                          </fieldset>
                        )}
                        {etape==7 || (formData.minWeightDiversifies && formData.maxWeightDiversifies) ? (
                           <div style={{ padding: '10px', margin: '10px' }}>
                           <p >Voulez-vous renseigne les SRRI?</p>
                           <div className="button-group" style={{ display: 'flex', justifyContent: 'space-between', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
                             <a href="#" onClick={() => setShowSRRIInfo(true)} style={{ color: 'red', textDecoration: 'none', padding: '10px 20px', borderRadius: '5px', backgroundColor: '#f2f2f2', border: '1px solid #ccc' }}>Oui</a>
                             <a href="#" onClick={() => { setShowSRRIInfo(false);setEtape(8) }} style={{ color: 'orange', textDecoration: 'none', padding: '10px 20px', borderRadius: '5px', backgroundColor: '#f2f2f2', border: '1px solid #ccc' }}>Non</a>
                           </div>
                         </div>
                        ):null}
                        {showSRRIInfo && (
                          <fieldset>
                            <legend>SRRI</legend>
                            <div className="row">
                              <div className="col-6">
                                <label>Valeur minimale du SRRI (en%)</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="minSRRI"
                                  value={formData.minSRRI}
                                  onChange={(e) => setFormData({ ...formData, minSRRI: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="col-6">
                                <label>Valeur maximale du SRRI (en%)</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="maxSRRI"
                                  value={formData.maxSRRI}
                                  onChange={(e) => setFormData({ ...formData, maxSRRI: e.target.value })}
                                  required
                                />
                              </div>
                            </div>
                          </fieldset>
                        )}
                        {etape==8 || (formData.minSRRI && formData.maxSRRI)?  (
                          <div style={{ padding: '10px', margin: '10px' }}>
                          <p >Voulez-vous renseigner la repartition par device?</p>
                          <div className="button-group" style={{ display: 'flex', justifyContent: 'space-between', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
                            <a href="#" onClick={() => setShowCurrencyDistributionInfo(true)} style={{ color: 'red', textDecoration: 'none', padding: '10px 20px', borderRadius: '5px', backgroundColor: '#f2f2f2', border: '1px solid #ccc' }}>Oui</a>
                            <a href="#" onClick={() => { setShowCurrencyDistributionInfo(false);setEtape(9) }} style={{ color: 'orange', textDecoration: 'none', padding: '10px 20px', borderRadius: '5px', backgroundColor: '#f2f2f2', border: '1px solid #ccc' }}>Non</a>
                          </div>
                        </div>
                        ):null}
                        {showCurrencyDistributionInfo && (
                          <fieldset>
                            <legend>Répartition par devise</legend>
                            <div className="row">
                              <div className="col-6">
                                <label>Répartition minimale par devise (en%)</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="minRepartitionDevise"
                                  value={formData.minRepartitionDevise}
                                  onChange={(e) => setFormData({ ...formData, minRepartitionDevise: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="col-6">
                                <label>Répartition maximale par devise (en%)</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="maxRepartitionDevise"
                                  value={formData.maxRepartitionDevise}
                                  onChange={(e) => setFormData({ ...formData, maxRepartitionDevise: e.target.value })}
                                  required
                                />
                              </div>
                            </div>
                          </fieldset>
                        )}
                        <br />
                        <div className="row">
                          <div className="col-6 text-left">
                            <button className="btn btn-main" style={{ backgroundColor: "RED", color: "white" }} onClick={viderinput}>Vider</button>
                          </div>
                        </div>
                        <br />
                        <div className="text-center">
                          <button style={{
                            textDecoration: 'none',
                            backgroundColor: '#6366f1',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '5px',
                          }}>Rechercher</button>
                        </div>
                      </div>


                      {efficientFrontierData && (
                        <div>

                          <h2>Frontière Efficiente</h2>
                          <HighchartsReact highcharts={Highcharts} options={options} />
                        </div>
                      )}


                      <form onSubmit={handleSubmit1}>
                        <div className="table-responsive">
                          <table
                            id="example11"

                            className="table text-fade table-bordered table-hover display nowrap margin-top-10 w-p100"
                          >

                            <thead className="table-header">

                              <tr className="text-right">

                                <th className="text-right"></th>
                                <th className="text-right">Portefeuille</th>
                                <th className="text-right">Poids</th>
                                <th className="text-right">Rendement</th>
                                <th className="text-right">Volatilité</th>
                              </tr>
                            </thead>
                            <tbody>
                              {error && (

                                <div className="text-center error-message" style={{ color: 'red' }}>

                                  {error}
                                </div>
                              )}

                              {portefeuillePropose?.efficient_portfolios?.slice(0, 20).map((weight: any, index: any) => (

                                <tr className="text-right" key={index}>

                                  <td>

                                    <input
                                      type="checkbox"

                                      checked={selectedRows.includes(index)}

                                      id={`checkbox_${index}`}
                                      onChange={() => handleCheckboxChange(index)}
                                    />

                                  </td>
                                  <td className="text-left">Portefeuille {index + 1}</td>
                                  <td>
                                    {/*weights.map((weight: any, idx: any) => (*/

                                      <span >{(parseFloat(weight) * 100).toFixed(2)}% </span>

                                                      /* ))*/}
                                  </td>

                                  <td>{(portefeuillePropose.frontier.returns[index] * 100).toFixed(2)}%</td>
                                  <td>{(portefeuillePropose.frontier.risks[index] * 100).toFixed(2)}%</td>

                                </tr>
                              ))}

                            </tbody>
                          </table>
                        </div>

                        <div className="text-right">

                          <button
                            style={{

                              textDecoration: 'none',
                              backgroundColor: 'red',

                              color: 'white',

                              padding: '10px 20px',
                              borderRadius: '5px',
                            }}

                            onClick={prevPage}
                            type="button"
                          >
                            Précédent
                          </button>

                          &nbsp;

                          {portefeuillePropose?.efficient_portfolios && selectedRows.length > 0 ? (
                            <Link
                              href={{}}
                              className="btn btn-main"
                              style={{
                                textDecoration: 'none',
                                backgroundColor: '#6366f1',
                                color: 'white',

                                padding: '10px 20px',
                                borderRadius: '5px',
                              }}

                              onClick={handleSubmit1}
                            >

                              Enregistrer
                            </Link>


                          ) : null}
                        </div>

                      </form>






                    </form>

                  )}

                  {/*formData.page === 3 && (
                    <form onSubmit={handleSubmit1}>
                      <div>
                        <div className="row">
                          <div className="col-6">
                            <label>Date</label>
                            <input className="form-control"

                              type="date"
                              value={formData.date}
                              onChange={(e) => setFormData({ ...formData, date: e.target.value })}

                            />
                          </div>
                          <div className="col-6">
                            <label>Montant investi</label>
                            <input className="form-control"

                              type="number"
                              value={formData.totalInvestment}
                              onChange={(e) => setFormData({ ...formData, totalInvestment: e.target.value })}
                            />
                          </div>

                        </div>
                        <br />
                        <div>
                          <button style={{
                            textDecoration: 'none', // Remove underline
                            backgroundColor: 'red', // Background color
                            color: 'white', // Text color
                            padding: '10px 20px', // Padding
                            borderRadius: '5px', // Rounded corners
                          }} onClick={prevPage}>Précédent</button>
                          &nbsp;
                          <button style={{
                            textDecoration: 'none', // Remove underline
                            backgroundColor: '#6366f1', // Background color
                            color: 'white', // Text color
                            padding: '10px 20px', // Padding
                            borderRadius: '5px', // Rounded corners
                          }} >Enregistrer</button>
                        </div>
                      </div>
                    </form>

                  )*/}

                </div>
              </div>
            </div>
          </section>
        </div>
      </div >
    </Fragment >
  );
}