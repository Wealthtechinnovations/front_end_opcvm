"use client";
import { urlconstant } from "@/app/constants";
import axios from 'axios';
import Link from "next/link";
import { Fragment, JSXElementConstructor, ReactNode, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import Select from 'react-select';
import { useRouter } from 'next/navigation';

//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
//import { router } from 'next/router';
import Header from "@/app/Header";
import Sidebar from "@/app/sidebarportefeuille";
import Headermenu from "@/app/Headermenu";


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
    nom_portefeuille: any
    valorisation: any
    portefeuille: {
      funds: any,
      poids: any,
      montant_invest: any,
      cash: any,
      nom_portefeuille: any
    }; // ou un type spécifique pour les éléments du tableau 'portefeuille'
  };
}
interface Portefeuillepropose {
  data: {
    filteredPortfolios: any[]; // ou un type spécifique pour les éléments du tableau 'portefeuille'
  };
}
async function getlastvl1() {
  const data = (
    await fetch(`${urlconstant}/api/searchFunds`)
  ).json();
  return data;
}
interface Option {
  value: number;
  label: string
}
interface PageProps {
  searchParams: {
    selectedfund: any;
    portefeuille: any
    id: any
  };
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
async function getPortefeuille(selectedValues: any) {
  const data = (

    await fetch(`${urlconstant}/api/getportefeuille/${selectedValues}`, {
      method: 'GET', // Assurez-vous que la méthode HTTP correspond à votre API
    })
  ).json();
  return data;
}
export default function Retraitcash(props: PageProps) {
  let id = props.searchParams.id;

  const selectedfunds = props?.searchParams?.selectedfund;
  console.log(selectedfunds);
  const selectedportfeuille = props?.searchParams?.portefeuille;
  const router = useRouter();
  const [transactionData, settransactioData] = useState<Transaction[]>([]);

  const [portefeuille, setPortefeuille] = useState<Funds | null>(null);
  const [portefeuillepropose, setPortefeuillepropose] = useState<Portefeuillepropose | null>(null);
  const nextPage = () => {
    setFormData({ ...formData, page: formData.page + 1 });
  };
  const [entries, setEntries] = useState([
    { date: '', type: 'retraitcash', montant: 0, cash: 0, portefeuilleselect: null },
  ]);
  const prevPage = () => {
    setFormData({ ...formData, page: formData.page - 1 });
  };
  const [error, setError] = useState(""); // État pour stocker le message d'erreur


  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]); // Tableau pour stocker les lignes sélectionnées
  const [selectedFunds, setSelectedFunds] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = (e: any) => {
    e.preventDefault();
    // Effectuez votre recherche ici si nécessaire
  };

  const handleEntryChange = (index: number, field: string, value: string | number | null) => {
    const updatedEntries = [...entries];
    updatedEntries[index] = {
      ...updatedEntries[index],
      [field]: value,
    };
    setEntries(updatedEntries);
  };
  const [formData, setFormData] = useState({
    page: 1,
    minReturn: '',
    maxReturn: '',
    minVolatility: '',
    maxVolatility: '',
    totalInvestment: '',
    date: '',

  });

  useEffect(() => {
    const initialEntry = {
      date: '',
      type: 'retraitcash',
      montant: 0,
      cash: portefeuille?.data.portefeuille.cash ? portefeuille?.data.portefeuille.cash : 0,
      portefeuilleselect: selectedportfeuille
    };

    setEntries([initialEntry]);
  }, [portefeuille, selectedportfeuille]);





  useEffect(() => {
    // Appel à l'API lors du premier rendu du composant
    async function fetchData() {
      try {
        const data = await getPortefeuille(selectedportfeuille);
        setPortefeuille(data);
        const data1 = await getlastvl1();

        const mappedOptions = data1?.data.funds.map((funds: any) => ({

          value: funds.value,
          label: funds.label, // Replace with the actual property name
          // Replace with the actual property name
        }));
        setSelectedOptions(mappedOptions);
        console.log(mappedOptions);
        const selectedFundsArray = JSON.parse(selectedfunds);
        setSelectedFunds(selectedFundsArray);
        console.log(selectedFunds);

        const response2 = await fetch(`${urlconstant}/api/gettransactions/${selectedportfeuille}`);
        const data2 = await response2.json();
        console.log('dddddd');
        console.log(data2.data.transactions);
        settransactioData(data2.data.transactions);

      } catch (error) {
        console.error("Erreur lors de l'appel à l'API :", error);
      }
    }
    fetchData();
  }, []);




  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // Vérification de la quantité dans le formulaire
    const isInvalidQuantity1 = entries.some(entry => entry.montant > 0);
    const isInvalidQuantity2 = entries.some(entry => entry.montant > entry.cash);
    if (isInvalidQuantity2) {
      setError("Le montant doit être inferieure au cash.")

      // Afficher un message d'erreur et ne pas poursuivre le traitement du formulaire
      return;
    }

    if (!isInvalidQuantity1) {
      setError("Le montant doit être supérieure à 0.")

      // Afficher un message d'erreur et ne pas poursuivre le traitement du formulaire
      return;
    }
    try {
      console.log(entries)

      fetch(`${urlconstant}/api/managecash`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Définir le type de contenu JSON
        },
        body: JSON.stringify(entries), // Convertir l'objet en JSON
      })
        .then((response) => response.json()) // Convertir la réponse en JSON
        .then((data) => {
          console.log(data);

          if (data.code === 200) {

            setTimeout(() => {
              const href = `/panel/portefeuille/portefeuillereconstitution?id=${id}`;

              router.push(href);
            }, 2000);
          }
        })
        .catch((error) => {
          console.error('Une erreur s\'est produite :', error);
        });

      // Gérer la réponse de l'API (par exemple, afficher un message de succès)
      /*  if (datas.status === 200) {
          const data = datas;
          console.log(data)
          setIsModalOpen(true);
  
          // Redirect the user to another page after a delay (e.g., 2 seconds)
          setTimeout(() => {
            //     router.push('/pagehome'); // Replace '/other-page' with your desired page URL
          }, 2000);
        } else {
          const data = datas;
          console.log(data)
        }*/
    } catch (error) {
      // Gérer les erreurs de l'API (par exemple, afficher une erreur)
      console.error('Erreur lors de la soumission du formulaire :', error);
    }
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
                      <p><span className="text-primary">Retrait de cash</span> | <span className="text-fade"></span></p>

                    </div>
                    {/*   <div className="text-right">
                      <button style={{
                        textDecoration: 'none', // Remove underline
                        backgroundColor: '#6366f1', // Background color
                        color: 'white', // Text color
                        padding: '10px 20px', // Padding
                        borderRadius: '5px', // Rounded corners
                      }} onClick={addEntry}>Ajouter une ligne</button>
                    </div>*/}

                  </div>
                  <hr />


                  <div>
                    <form onSubmit={handleSubmit}>
                      <div className="form-entry">
                        <div className="row">
                          <div className="col-4">
                            <label>Date</label>
                            <input
                              required
                              className="form-control"
                              type="date"
                              value={entries[0].date}
                              onChange={(e) => handleEntryChange(0, 'date', e.target.value)}
                            />
                          </div>

                          <div className="col-4">
                            <label>Cash</label>
                            <input
                              disabled

                              type="number"
                              className="form-control"
                              value={entries[0].cash}
                              onChange={(e) => handleEntryChange(0, 'cash', parseInt(e.target.value))}
                            />
                          </div>
                          <div className="col-4">
                            <label>Montant</label>
                            <input
                              type="number"
                              className="form-control"
                              value={entries[0].montant}
                              onChange={(e) => handleEntryChange(0, 'montant', parseInt(e.target.value))}
                            />
                          </div>

                        </div>
                      </div>
                      <br />

                      {error && <div className=" text-center error-message" style={{ color: "red" }}>{error}</div>}


                      <div className="text-center">
                        <button style={{
                          textDecoration: 'none', // Remove underline
                          backgroundColor: '#6366f1', // Background color
                          color: 'white', // Text color
                          padding: '10px 20px', // Padding
                          borderRadius: '5px', // Rounded corners
                        }} onClick={() => {
                          // Vous pouvez laisser cette fonction vide, elle n'effectuera aucune action.
                        }}>Retirer</button>

                      </div>
                    </form>

                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      </div >
      </div >
    </Fragment >
  );
}