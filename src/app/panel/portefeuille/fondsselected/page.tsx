"use client";
import { urlconstant } from "@/app/constants";

import Link from "next/link";
import { Fragment, SetStateAction, useEffect, useState } from "react";
import Select, { OptionsOrGroups, GroupBase, Options } from 'react-select';
//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
//import { router } from 'next/router';
import Header from '@/app/Header';
import { useRouter } from 'next/navigation';
import Headermenu from "@/app/Headermenu";
import Sidebar from "@/app/sidebarportefeuille";

async function getPortefeuille(selectedValues: any) {
  const data = (

    await fetch(`${urlconstant}/api/getportefeuille/${selectedValues}`, {
      method: 'GET', // Assurez-vous que la méthode HTTP correspond à votre API
    })
  ).json();
  return data;
}
async function getlastvl1(minDate: any, maxDate: any) {
  const data = (
    await fetch(`${urlconstant}/api/searchFunds?minHorizon=${minDate}&maxHorizon=${maxDate}`)
  ).json();
  return data;
}
async function getlastvl2(categorie: any, univers: any, universsous: any) {
  const data = (
    await fetch(`${urlconstant}/api/searchFundsreconstitution?categorie=${categorie}&univers=${univers}&universsous=${universsous}`)
  ).json();
  return data;
}

const options = [
  { value: 1, label: 'Option 1' },
  { value: 2, label: 'Option 2' },
  { value: 3, label: 'Option 3' },
  // Ajoutez plus d'options au besoin
];
const min = 1;
const max = 200;
const randomValueInEuros = (Math.random() * (max - min) + min).toFixed(2);

interface Funds {
  data: {
    nom_portefeuille: any
    valorisation: any
    horizon: any
    portefeuille: {
      funds: any,
      poids: any,
      horizon: any,
      categorie: any,
      montant_invest: any,
      nom_portefeuille: any,
      portefeuilletype: any,
      universsous: any,
      univers: any
    }; // ou un type spécifique pour les éléments du tableau 'portefeuille'
  };
}

interface Option {
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
  InRef: any; // Remplacez "number" par le type approprié
  // Autres propriétés
}
interface OptionType {
  value: string;
  label: string;
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
interface Pays {
  value: string; // ou un type spécifique pour les éléments du tableau 'funds'

}

interface Region {
  value: string; // ou un type spécifique pour les éléments du tableau 'funds'

}

async function getpays() {
  const data = (
    await fetch(`${urlconstant}/api/getPaysall`)
  ).json();
  return data;
}
export default function Fondselected(props: PageProps) {
  const router = useRouter();
  let id = props.searchParams.id;

  let selectedfunds = props?.searchParams?.selectedfund;
  let selectedportfeuille = props?.searchParams?.portefeuille;
  let selectedValuename = props?.searchParams?.selectedValuename;
  console.log(selectedValuename);
  const [optionsPays, setOptionsPays] = useState([]);
  const [selectedPays, setSelectedPays] = useState<Pays | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  const [portefeuille, setPortefeuille] = useState<Funds | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [fundsOptions, setFundsOptions] = useState([]);
  const [fundsOptions1, setFundsOptions1] = useState([]);
  const [allSelectedValues, setAllSelectedValues] = useState("");
  const [fundsData, setFundsData] = useState<Fund[]>([]);

  const [fundsOptions2, setFundsOptions2] = useState([]);
  const [categories, setcategories] = useState("");
  const [univers, setunivers] = useState("");
  const [universsous, setuniverssous] = useState("");
  const [base100Data, setBase100Data] = useState<MyDataType[]>([]); // Nouvel état pour les données en base 100
  const [horizon, setHorizon] = useState('Moins d\'un an'); // Remplacez par la valeur sélectionnée


  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [selectedOptions1, setSelectedOptions1] = useState<Option[]>([]);

  const [selectedOptions2, setSelectedOptions2] = useState<Option[]>([]);


  const [selectedRows, setSelectedRows] = useState<string[]>([]); // Tableau pour stocker les lignes sélectionnées
  const [selectedFond, setSelectedFond] = useState('');
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleFondSelect = (fond: any) => {
    setSelectedFond(fond);
    setSelectedRows(selectedfunds.concat(fond));
    console.log("s" + selectedfunds);
    console.log(selectedRows.join(','));
    console.log(fond);

  };
  const handleSearch = (e: any) => {
    e.preventDefault();
    // Effectuez votre recherche ici si nécessaire
  };


  useEffect(() => {
    // Fonction pour effectuer l'appel à l'API
    async function fetchData() {
      const data = await getpays();

      const mappedOptions = data?.data.countriesWithCompanies.map((funds: any) => ({

        value: funds.pays,
        label: funds.pays, // Replace with the actual property name
        // Replace with the actual property name
      }));
      setOptionsPays(mappedOptions);
      const fetchedData = [];

      for (const item of selectedfunds.replace(/[^0-9A-Za-z\s,]+/g, '').split(',')) {
        try {
          const response = await fetch(`${urlconstant}/api/getfondbyid/${item}`);
          const data = await response.json();
          console.log(fetchedData);
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
  useEffect(() => {
    // Appel à l'API lors du premier rendu du composant
    async function fetchData() {
      try {
        const data = await getPortefeuille(selectedportfeuille);
        setPortefeuille(data);
        console.log("eeee");
        let minDate, maxDate;
        if (data?.data.portefeuille.portefeuilletype == 'Robot advisor') {
          console.log(data?.data?.portefeuille.horizon);
          console.log(data?.data?.portefeuille.horizon);
          console.log(data?.data?.portefeuille.horizon);

          switch (data?.data?.portefeuille.horizon) {
            case "MOINS D UN AN":
              maxDate = new Date();
              minDate = new Date(maxDate);
              minDate.setFullYear(minDate.getFullYear() - 1);
              break;
            case "Au moins 2 ans":
              maxDate = new Date();
              minDate = new Date(maxDate);
              minDate.setFullYear(minDate.getFullYear() - 2);
              break;
            case "Au moins 3 ans":
              maxDate = new Date();
              minDate = new Date(maxDate);
              minDate.setFullYear(minDate.getFullYear() - 3);
              break;
            case "Au moins 5 ans":
              maxDate = new Date();
              minDate = new Date(maxDate);
              minDate.setFullYear(minDate.getFullYear() - 5);
              break;
            case "Au moins 8 ans":
              maxDate = new Date();
              minDate = new Date(maxDate);
              minDate.setFullYear(minDate.getFullYear() - 5);
              break;
            case "Au moins 10 ans":
              maxDate = new Date();
              minDate = new Date(maxDate);
              minDate.setFullYear(minDate.getFullYear() - 5);
              break;
            default:
              // Gérer d'autres cas si nécessaire
              break;
          }
          const maxYear = maxDate?.getFullYear();
          const maxMonth = String((maxDate ?? new Date()).getMonth() + 1).padStart(2, '0');
          const maxDay = String(maxDate?.getDate()).padStart(2, '0');

          const minYear = minDate?.getFullYear();
          const minMonth = String((minDate ?? new Date()).getMonth() + 1).padStart(2, '0');
          const minDay = String(minDate?.getDate()).padStart(2, '0');

          // Creamos las cadenas en formato "yyyy-mm-dd"
          const maxDateString = `${maxYear}-${maxMonth}-${maxDay}`;
          const minDateString = `${minYear}-${minMonth}-${minDay}`;
          console.log(maxDateString);
          console.log(minDateString);

          const data1 = await getlastvl1(minDateString, maxDateString);
          console.log(data1);
          const mappedOptions = data1?.data.funds.map((funds: any) => ({
            value: funds.value,
            label: funds.label,
          }));

          // D'abord, initialisez les options.
          setFundsOptions(mappedOptions);

          // Ensuite, filtrez les options pour pré-sélectionner celles qui correspondent à selectedValuename.
          const preselectedOptions = mappedOptions.filter((option: { label: any; }) => selectedValuename.includes(option.label));
          setSelectedOptions(preselectedOptions);
          console.log("ddd");
        } else {
          setcategories(data?.data.portefeuille.categorie.replace(/[^0-9A-Za-z\s,]+/g, '').split(','));
          setunivers(data?.data.portefeuille.univers);
          setuniverssous(data?.data.portefeuille.universsous);
          const cat = data?.data.portefeuille.categorie.replace(/[^0-9A-Za-z\s,]+/g, '').split(',');
          const data1 = await getlastvl2(cat, data?.data.portefeuille.univers, data?.data.portefeuille.universsous);
          const mappedOptions = data1?.data.fundsByCategorie.map((funds: any) => ({
            value: funds.value,
            label: funds.label,
          }));

          // D'abord, initialisez les options.
          setFundsOptions(mappedOptions);
          const mappedOptions1 = data1?.data?.fundsByRegionalCategorie?.map((funds: any) => ({
            value: funds.value,
            label: funds.label,
          }));
          setFundsOptions1(mappedOptions1);

          const mappedOptions2 = data1?.data?.fundsByNationalCategorie?.map((funds: any) => ({
            value: funds.value,
            label: funds.label,
          }));
          setFundsOptions2(mappedOptions2);

          // Ensuite, filtrez les options pour pré-sélectionner celles qui correspondent à selectedValuename.
          const preselectedOptions = mappedOptions.filter((option: { label: any; }) => selectedValuename.includes(option.label));
          setSelectedOptions(preselectedOptions);
          console.log("ddd");

          const preselectedOptions1 = mappedOptions1.filter((option: { label: any; }) => selectedValuename.includes(option.label));
          setSelectedOptions1(preselectedOptions1);
          console.log("ddd");

          const preselectedOptions2 = mappedOptions2.filter((option: { label: any; }) => selectedValuename.includes(option.label));
          setSelectedOptions2(preselectedOptions2);
          console.log("ddd");

          setAllSelectedValues(selectedValuename);

        }

      } catch (error) {
        console.error("Erreur lors de l'appel à l'API :", error);
      }
    }

    fetchData();
  }, [selectedportfeuille, selectedValuename]); // Assurez-vous que les dépendances du useEffect sont correctement gérées.


  useEffect(() => {
    // Mettez à jour allSelectedValues à chaque changement de selectedOptions, selectedOptions1 ou selectedOptions2
    const selectedValues = [
      selectedOptions,
      selectedOptions1,
      selectedOptions2,
    ]
      .filter((selectedOption) => selectedOption !== null)
      .map((selectedOption) =>
        selectedOption.map((option) => option.label).join(", ")
      )
      .join(", ");

    setAllSelectedValues(selectedValues);
  }, [selectedOptions, selectedOptions1, selectedOptions2]);
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const selectedValues = [
        ...selectedOptions,
        ...selectedOptions1,
        ...selectedOptions2,
      ].map((option) => option?.value);

      const selectedValuenames = [
        ...selectedOptions,
        ...selectedOptions1,
        ...selectedOptions2,
      ].map((option) => option?.label);

      formData.selectedValue = selectedValues.join(',') as unknown as string[]
      formData.selectedValuename = selectedValuenames.join(',') as unknown as string[]
      console.log(formData);
      console.log(selectedValues);

      const response = await fetch(`${urlconstant}/api/updateportefeuille`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Spécifiez le type de contenu que vous envoyez
        },
        body: JSON.stringify(formData), // Convertissez votre objet formData en JSON
      });
      // Gérer la réponse de l'API (par exemple, afficher un message de succès)
      if (response.status === 200) {
        setIsModalOpen(true);

        // Redirect the user to another page after a delay (e.g., 2 seconds)
        setTimeout(() => {
          const href = `/panel/portefeuille/home?id=${id}`;

          router.push(href); // Replace '/other-page' with your desired page URL
        }, 2000);
      }
    } catch (error) {
      // Gérer les erreurs de l'API (par exemple, afficher une erreur)
      console.error('Erreur lors de la soumission du formulaire :', error);
    }
  };

  //onChange={handleRegionChange}

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  // Définir les options des régions
  const regionOptions: OptionsOrGroups<OptionType, GroupBase<OptionType>> = [
    { value: 'Afrique du Nord', label: 'Afrique du Nord' },
    { value: 'Afrique de l\'Ouest', label: 'Afrique de l\'Ouest' },
    { value: 'Afrique de l\'Est', label: 'Afrique de l\'Est' },
    { value: 'Afrique Centrale', label: 'Afrique Centrale' },
    { value: 'Afrique du Sud', label: 'Afrique du Sud' },
  ];
  const handlePaysChange = (selectedOption: any) => {
    console.log(selectedOption)
    setFundsOptions([]);
    setSelectedPays(selectedOption.value); // Met à jour l'état selectedPays avec la nouvelle sélection
  };

  const handleRegionChange = (e: any) => {
    console.log(e)
    setFundsOptions([]);
    setSelectedRegion(e);
  };

  useEffect(() => {
    // Vérifiez si le pays ou la région ou les deux sont renseignés
    if (selectedPays || selectedRegion) {
      // Construisez l'URL de la requête en fonction des valeurs renseignées
      let query = '';
      if (selectedPays) {
        query += `selectedPays=${selectedPays}`;
      }
      if (selectedRegion) {
        query += `${selectedPays ? '&' : ''}selectedRegion=${selectedRegion.value}`;
      }

      // Remplacez par votre méthode pour récupérer les fonds par pays et/ou région
      fetch(`${urlconstant}/api/searchFundsreconstitution?categorie=${categories}&univers=${univers}&universsous=${universsous}&${query}`)
        .then((response) => response.json())
        .then((data) => {
          const mappedOptions = data?.data?.fundsByCategorie?.map((fund: { value: any; label: any; }) => ({
            value: fund.value,
            label: fund.label,
          }));
          setFundsOptions(mappedOptions);
        });
    }
  }, [selectedPays, selectedRegion]);
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
                  {portefeuille?.data.portefeuille.portefeuilletype == 'Robot advisor' ?
                    <div className="mt-10 mt-md-0">
                      <button className="btn btn-main" style={{ backgroundColor: "#3b82f6", color: "white" }} onClick={toggleMenu}>Ajouter un Fonds</button>
                      {isOpen && (




                        <form onSubmit={handleSubmit}>
                          <div className="row">
                            <div className="col-11">
                              <label htmlFor="select">Fonds (Nom/ISIN) :</label>
                              <Select className="select-component"
                                required
                                id="select"
                                options={fundsOptions}
                                isMulti
                                isSearchable
                                value={selectedOptions}
                                onChange={(newValue, actionMeta) => setSelectedOptions(newValue.map(option => option as Option))}
                              />
                            </div>
                            <div className="col-1">
                              <label htmlFor="select">&nbsp;</label>

                              <button style={{
                                textDecoration: 'none', // Remove underline
                                backgroundColor: '#6366f1', // Background color
                                color: 'white', // Text color
                                padding: '10px 20px', // Padding
                                borderRadius: '5px', // Rounded corners
                              }} onClick={() => {
                                // Vous pouvez laisser cette fonction vide, elle n'effectuera aucune action.
                              }}>OK</button>
                            </div>
                          </div>

                        </form>





                      )}
                      {selectedFond && <p>Fond sélectionné : {selectedFond}</p>}
                    </div> :
                    <div>
                      <form onSubmit={handleSubmit}>
                        <div className="row">
                          {selectedOptions1 != null ?
                            <div className="col-6">
                              <label htmlFor="select">Fonds (Nom/ISIN) par région :</label>
                              <Select
                                options={regionOptions}
                                value={selectedRegion}
                                onChange={handleRegionChange}
                              />
                            </div> : <p></p>}
                          {selectedOptions2 != null ?
                            <div className="col-6">
                              <label htmlFor="select">Fonds (Nom/ISIN) par pays :</label>

                              <Select className="select-component"
                                isSearchable
                                options={optionsPays}
                                value={selectedPays?.value}
                                onChange={handlePaysChange}
                                placeholder="Sélectionnez un pays"

                              />
                            </div> : <p></p>}
                        </div>
                        {selectedOptions != null ?
                          <div>
                            <label htmlFor="select">Fonds (Nom/ISIN) par categorie :</label>

                            <Select className="select-component"
                              isMulti
                              isSearchable
                              options={fundsOptions}
                              value={selectedOptions}
                              onChange={(newValue, actionMeta) => setSelectedOptions(newValue.map(option => option as Option))}
                            />
                          </div> : <p></p>}

                        <br />

                        <div className="text-center" >
                          <button style={{
                            textDecoration: 'none', // Remove underline
                            backgroundColor: '#6366f1', // Background color
                            color: 'white', // Text color
                            padding: '10px 20px', // Padding
                            borderRadius: '5px', // Rounded corners
                          }} onClick={() => {
                            // Vous pouvez laisser cette fonction vide, elle n'effectuera aucune action.
                          }}>OK</button>
                        </div>
                        <br />
                        <div>
                          <label htmlFor="allSelectedValues">Toutes les valeurs sélectionnées :</label>
                          <input className="form-control"
                            type="text"
                            id="allSelectedValues"
                            value={allSelectedValues}
                            readOnly
                          />
                        </div>
                      </form>

                    </div>}




                </div>

                <br />
              </div>


              {fundsData.map((data, index) => (
                <div key={index} className="box pull-up">
                  <div className="box-body">
                    <div className="d-md-flex justify-content-between align-items-center">
                      <div>
                        <p><span className="text-primary">{data.data.funds[0]?.nom_fond}</span> | <span className="text-fade">{data.data.funds[0]?.code_ISIN}</span> | <span className="text-fade">{data.data.funds[0]?.categorie_national}</span></p>
                      </div>
                      <div className="mt-10 mt-md-0">

                      </div>
                    </div>
                    <hr />
                    <div className="d-md-flex justify-content-between align-items-center">
                      <div className="d-flex justify-content-start align-items-center">
                        <div className="min-w-100">
                          <p className="mb-0 text-fade">Devise</p>
                          <h6 className="mb-0">{data.data.funds[0]?.dev_libelle}</h6>
                        </div>
                        <div className="mx-lg-50 mx-20 min-w-70">
                          <p className="mb-0 text-fade">Date de derniere VL</p>
                          <h6 className="mb-0 text-success">{data.data.funds[0]?.lastValue}</h6>

                          <h6 className="mb-0 text-success">{data.data.funds[0]?.datejour}</h6>

                        </div>
                        <div className="mx-lg-50 mx-20 min-w-70">
                          <p className="mb-0 text-fade">Performance veille</p>
                          <p><strong className={`text-right ${parseFloat(data?.data?.performances?.data?.perfVeille) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(data?.data?.performances?.data?.perfVeille)) ? '-' : parseFloat(data?.data?.performances?.data?.perfVeille).toFixed(2)} %</strong></p>
                        </div>

                      </div>
                      <div className="mt-10 mt-md-0">

                      </div>
                    </div>
                  </div>
                </div>
              ))}
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