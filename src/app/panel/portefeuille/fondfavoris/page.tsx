"use client";
import { urlconstant } from "@/app/constants";

import Link from "next/link";
import { Fragment, SetStateAction, useEffect, useState } from "react";
import Select from 'react-select';
//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
//import { router } from 'next/router';
import Header from '@/app/Header';
import { useRouter } from 'next/navigation';
import Sidebar from "@/app/sidebarportefeuille";
import Headermenu from "@/app/Headermenu";

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
interface Pays {
  value: any[]; // ou un type spécifique pour les éléments du tableau 'portefeuile'

}
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
export default function Fondselected(props: PageProps) {
  const router = useRouter();
  let id = props.searchParams.id;

  let selectedfunds = props?.searchParams?.selectedfund;
  let selectedportfeuille = props?.searchParams?.portefeuille;
  let selectedValuename = props?.searchParams?.selectedValuename;
  console.log(selectedValuename);
  const [portefeuille, setPortefeuille] = useState<Funds | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [fundsOptions, setFundsOptions] = useState([]);
  const [fundsOptions1, setFundsOptions1] = useState([]);
  const [allSelectedValues, setAllSelectedValues] = useState("");
  const [fundsData, setFundsData] = useState<Fund[]>([]);

  const [fundsOptions2, setFundsOptions2] = useState([]);

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

      try {
        const response = await fetch(`${urlconstant}/api/favoritesdataall/${id}`);
        const data = await response.json();
        //  setFundsData(data.data);
        const fetchedData = [];

        for (const item of data.data) {
          try {
            const response = await fetch(`${urlconstant}/api/getfondbyid/${item.fund_id}`);
            const data = await response.json();
            console.log(fetchedData);
            fetchedData.push(data);
          } catch (error) {
            console.error("Erreur lors de l'appel API :", error);
          }
        }

        // Mettez à jour l'état avec les données récupérées
        setFundsData(fetchedData);
      } catch (error) {
        console.error("Erreur lors de l'appel API :", error);
      }


      // Mettez à jour l'état avec les données récupérées
    }

    // Appelez la fonction pour récupérer les données lorsque le composant est monté
    fetchData();
  }, []); // A

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


  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

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



              <div className="box pull-up text-align-center">
                <div className="text-center">
                  <br />
                  <h4><span className="text-primary">Liste des Fonds favoris</span></h4>
                </div>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nom du Fonds</th>
                      <th>Code ISIN</th>
                      <th>Catégorie Nationale</th>
                      <th>Devise</th>
                      <th>Date de dernière VL</th>
                      <th> VL</th>
                      <th>Performance Veille</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fundsData.map((data, index) => (
                      <tr key={index} >
                        <td className="">  <Link href={`/Opcvm/${data.data.funds[0]?.id}`}>
                          <p>
                            <span className="text-primary">{data.data.funds[0]?.nom_fond}</span> </p></Link>
                        </td>
                        <td className="">   <p><span className="text-fade">{data.data.funds[0]?.code_ISIN}</span> </p>   </td>
                        <td className="">  <p>   {data.data.funds[0]?.categorie_national}</p> </td>

                        <td className="">      <p className="mb-0">{data.data.funds[0]?.dev_libelle}</p></td>

                        <td className="">      <p className="mb-0 text-success">{data.data.funds[0]?.lastValue}</p></td>
                        <td className="">        <p className="mb-0 text-success">{data.data.funds[0]?.datejour}</p></td>
                        <td className="">       <p>
                          <strong
                            className={`text-right ${parseFloat(data?.data?.performances?.data?.perfVeille) < 0
                              ? 'text-danger'
                              : 'text-success'
                              }`}
                          >
                            {isNaN(parseFloat(data?.data?.performances?.data?.perfVeille))
                              ? '-'
                              : parseFloat(data?.data?.performances?.data?.perfVeille).toFixed(2)}{' '}
                            %
                          </strong>
                        </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>


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