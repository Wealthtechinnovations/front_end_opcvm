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
  frais_entree: any;
  frais_sortie: any;
  frais_transaction: any;
  plus_moins_value: any;
  average: any;
  invest: any;
  taux: any;
  devise: any;
  nom_fond: any;
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
export default function Transactions(props: PageProps) {
  let selectedfunds = props?.searchParams?.selectedfund;
  let selectedportfeuille = props?.searchParams?.portefeuille;
  let selectedValuename = props?.searchParams?.selectedValuename;
  let id = props.searchParams.id;

  console.log(selectedValuename);
  const [portefeuille, setPortefeuille] = useState<Funds | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [fundsOptions, setFundsOptions] = useState([]);
  const [base100Data, setBase100Data] = useState<MyDataType[]>([]); // Nouvel état pour les données en base 100
  const [fundsData, setFundsData] = useState<Fund[]>([]);
  const [transactionData, settransactioData] = useState<Transaction[]>([]);


  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [totalValue, setTotalValue] = useState(0);

  const [selectedRows, setSelectedRows] = useState<string[]>([]); // Tableau pour stocker les lignes sélectionnées
  const [selectedFond, setSelectedFond] = useState('');
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);



  useEffect(() => {
    // Fonction pour effectuer l'appel à l'API
    async function fetchData() {
      const fetchedData = [];
      Swal.fire({
        title: 'Veuillez patienter',
        html: 'Chargement des résultats en cours...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
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


      const response1 = await fetch(`${urlconstant}/api/gettransactions/${selectedportfeuille}`);
      const data1 = await response1.json();
      console.log('dddddd');
      console.log(data1.data.transactions);
      settransactioData(data1.data.transactions);
      const data = await getPortefeuille(selectedportfeuille);
      setPortefeuille(data);
      Swal.close(); // Close the loading popup

    }

    // Appelez la fonction pour récupérer les données lorsque le composant est monté
    fetchData();
  }, [selectedfunds]); // A

  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ascending' });




  const sortData = (key: keyof Transaction) => {

    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }

    const sortedData = [...transactionData].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    settransactioData(sortedData);
    setSortConfig({ key, direction });
  };

  const renderSortIndicator = (key: string) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
    }
    return null;
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



              <div className="box text-align-center table-responsive">
                <div className="text-center">
                  <br />
                  <h4><span className="text-primary">Liste des transactions du portefeuille en {portefeuille?.data.portefeuille.devise}</span></h4>
                </div>


                <table className="table">
                  <thead>
                    <tr>
                      <th onClick={() => sortData('nom_fond')}>
                        Fonds {renderSortIndicator('nom_fond')}
                      </th>
                      <th onClick={() => sortData('type')}>
                        Type {renderSortIndicator('type')}
                      </th>
                      <th>Devise</th>
                      <th onClick={() => sortData('date')}>
                        Date &nbsp; {renderSortIndicator('date')}
                      </th>

                      <th onClick={() => sortData('quantite')}>
                        QTE {renderSortIndicator('quantite')}
                      </th>
                      <th onClick={() => sortData('quantite')}>
                        PU {renderSortIndicator('quantite')}
                      </th>
                      <th onClick={() => sortData('montant')}>
                        Mnt brut {renderSortIndicator('montant_brut')}
                      </th>
                      <th onClick={() => sortData('frais')}>
                        Frais total {renderSortIndicator('frais')}
                      </th>
                      <th onClick={() => sortData('montant')}>
                        Mnt Net {renderSortIndicator('montant')}
                      </th>

                      <th onClick={() => sortData('montant')}>
                        Cout Moyen {renderSortIndicator('montant')}
                      </th>

                      <th onClick={() => sortData('montant')}>
                        Investissement {renderSortIndicator('montant')}
                      </th>

                      <th onClick={() => sortData('frais_transaction')}>
                        Frais TX {renderSortIndicator('frais_transaction')}
                      </th>
                      <th onClick={() => sortData('frais_entree')}>
                        Frais entrée {renderSortIndicator('frais_entree')}
                      </th>
                      <th onClick={() => sortData('frais_sortie')}>
                        Frais sortie {renderSortIndicator('frais_sortie')}
                      </th>
                      <th onClick={() => sortData('plus_moins_value')}>
                        +/- Value {renderSortIndicator('plus_moins_value')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionData.map((data, index) => (
                      <tr key={index}>
                        <td>
                          <p><span className="text-primary">{data?.nom_fond}</span></p>
                        </td>
                        <td>
                          <p><span className="text-primary">{data?.type}</span></p>
                        </td>
                        <td>
                          <p><span className="text-primary">{portefeuille?.data.portefeuille.devise}</span></p>
                        </td>
                        <td>
                          <p><span className="text-primary">{data?.date}</span></p>
                        </td>

                        <td>
                          <p><span className="text-primary">{(data?.quantite ?? 0).toFixed(2)}</span></p>
                        </td>
                        <td>
                          <p> <span className="text-primary">
                            {Number(data?.prixparunite ?? 0).toFixed(2)}
                            ({data?.taux ? (Number(data?.prixparunite ?? 0) * parseFloat(data.taux)).toFixed(2) : ''} {data?.devise})
                          </span></p>
                        </td>
                        <td>
                          <p> <span className="text-primary">
                            {(() => {
                              switch (data.type) {
                                case 'ajoutcash':
                                  return parseFloat(data.montant).toFixed(2);
                                case 'achat':
                                  // Calcul des frais et montant total pour 'achat' et 'vente'
                                  const total = parseFloat(data.frais || 0) + parseFloat(data.montant || 0);
                                  const totalFormatted = total.toFixed(2);
                                  // Affichage du total avec la devise si taux est défini
                                  const totalWithTaux = data?.taux
                                    ? ` (${(total * parseFloat(data.taux)).toFixed(2)} ${data?.devise})`
                                    : '';
                                  return totalFormatted + totalWithTaux;
                                case 'vente':
                                  // Calcul des frais et montant total pour 'achat' et 'vente'
                                  const total1 = parseFloat(data.montant || 0);
                                  const totalFormatted1 = total1.toFixed(2);
                                  // Affichage du total avec la devise si taux est défini
                                  const totalWithTaux1 = data?.taux
                                    ? ` (${(total1 * parseFloat(data.taux)).toFixed(2)} ${data?.devise})`
                                    : '';
                                  return totalFormatted1 + totalWithTaux1;
                                default:
                                  return '0.00'; // Valeur par défaut si le type de transaction n'est pas reconnu
                              }
                            })()}
                          </span></p>
                        </td>
                        <td>
                          <p><span className="text-danger">-{data?.frais ? parseFloat(data.frais).toFixed(2) : '0.00'}</span></p>
                        </td>
                        <td>
                          <p><span className="text-primary">
                            {(() => {
                              switch (data.type) {
                                case 'achat':
                                  // Calcul des frais et montant total pour 'achat' et 'vente'
                                  const total = parseFloat(data.montant || 0);
                                  const totalFormatted = total.toFixed(2);
                                  // Affichage du total avec la devise si taux est défini
                                  const totalWithTaux = data?.taux
                                    ? ` (${(total * parseFloat(data.taux)).toFixed(2)} ${data?.devise})`
                                    : '';
                                  return totalFormatted + totalWithTaux;
                                case 'vente':
                                  // Calcul des frais et montant total pour 'achat' et 'vente'
                                  const total1 = parseFloat(data.montant || 0) - parseFloat(data.frais || 0);
                                  const totalFormatted1 = total1.toFixed(2);
                                  // Affichage du total avec la devise si taux est défini
                                  const totalWithTaux1 = data?.taux
                                    ? ` (${(total1 * parseFloat(data.taux)).toFixed(2)} ${data?.devise})`
                                    : '';
                                  return totalFormatted1 + totalWithTaux1;
                                default:
                                  return '0.00'; // Valeur par défaut si le type de transaction n'est pas reconnu
                              }
                            })()}
                          </span></p>
                        </td>
                        <td>
                          <p><span className="text-danger">{data?.average ? parseFloat(data.average).toFixed(2) : '0.00'}</span></p>
                        </td>
                        <td>
                          <p><span className="text-danger">-{data?.invest ? parseFloat(data.invest).toFixed(2) : '0.00'}</span></p>
                        </td>
                        <td>
                          <p><span className="text-danger">-{data?.frais_transaction ? parseFloat(data.frais_transaction).toFixed(2) : '0.00'}</span></p>
                        </td>
                        <td>
                          <p><span className="text-danger">-{data?.frais_entree ? parseFloat(data.frais_entree).toFixed(2) : '0.00'}</span></p>
                        </td>
                        <td>
                          <p><span className="text-danger">-{data?.frais_sortie ? parseFloat(data.frais_sortie).toFixed(2) : '0.00'}</span></p>
                        </td>
                        <td>
                          <p> <span className={parseFloat(data?.plus_moins_value) > 0 ? "text-success" : "text-danger"}>
                            {data?.plus_moins_value ? parseFloat(data.plus_moins_value).toFixed(2) : '0.00'}
                          </span></p>
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