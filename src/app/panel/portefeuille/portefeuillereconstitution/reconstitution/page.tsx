"use client";
import { urlconstant } from "@/app/constants";
import axios from 'axios';
import Link from "next/link";
import { Fragment, JSXElementConstructor, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import Select from 'react-select';
import { useRouter } from 'next/navigation';

//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
//import { router } from 'next/router';
import Header from "@/app/Header";
import Headermenu from "@/app/Headermenu";
import Sidebar from "@/app/sidebarportefeuille";


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
export default function Reconstitution(props: PageProps) {
  let id = props.searchParams.id;

  const selectedfunds = props?.searchParams?.selectedfund;
  console.log(selectedfunds);
  const selectedportfeuille = props?.searchParams?.portefeuille;
  const router = useRouter();

  const [portefeuille, setPortefeuille] = useState<Funds | null>(null);
  const [portefeuillepropose, setPortefeuillepropose] = useState<Portefeuillepropose | null>(null);
  const nextPage = () => {
    setFormData({ ...formData, page: formData.page + 1 });
  };
  const [entries, setEntries] = useState([
    { date: '', montantInvesti: 0, fondId: 0, portefeuilleselect: null },
  ]);
  const prevPage = () => {
    setFormData({ ...formData, page: formData.page - 1 });
  };

  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]); // Tableau pour stocker les lignes sélectionnées
  const [selectedFunds, setSelectedFunds] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = (e: any) => {
    e.preventDefault();
    // Effectuez votre recherche ici si nécessaire
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
    // Appel à l'API lors du premier rendu du composant
    async function fetchData() {
      try {
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


      } catch (error) {
        console.error("Erreur lors de l'appel à l'API :", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const initialEntries = selectedFunds.map(fundId => ({
      date: '',
      montantInvesti: 0,
      fondId: fundId,
      portefeuilleselect: selectedportfeuille
    }));
    setEntries(initialEntries);
  }, [selectedFunds]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      console.log(entries)
      fetch(`${urlconstant}/api/reconstitution`, {
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
              const href = `/panel/portefeuille/home?id=${id}`;

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
                      <p><span className="text-primary">Reconstitution</span> | <span className="text-fade"></span></p>

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
                      {entries.map((entry, index) => (
                        <div key={index} className="form-entry">
                          <div className="row">
                            <div className="col-4">
                              <label>Date</label>
                              <input
                                className="form-control"
                                type="date"
                                value={entry.date}
                                onChange={(e) => {
                                  const updatedEntries = [...entries];
                                  updatedEntries[index].date = e.target.value;
                                  setEntries(updatedEntries);
                                }}
                              /></div>
                            <div className="col-4">
                              <label>Montant investi</label>
                              <input
                                type="number"
                                className="form-control"

                                value={entry.montantInvesti}
                                onChange={(e) => {
                                  const updatedEntries = [...entries];
                                  updatedEntries[index].montantInvesti = parseInt(e.target.value);
                                  setEntries(updatedEntries);
                                }}
                              /></div>
                            <div className="col-4">
                              <label>Fonds</label>
                              <Select
                                className="form-control select-component"
                                options={selectedOptions}
                                value={selectedOptions.find(option => option.value === (entry?.fondId !== null ? parseInt(entry.fondId.toString(), 10) : null))}
                                onChange={(selectedOption) => {
                                  const updatedEntries = [...entries];
                                  if (selectedOption) {
                                    updatedEntries[index].fondId = parseInt(selectedOption.value.toString(), 10); // Utilisez la valeur de l'option
                                  } else {
                                    // Faites quelque chose en cas de selectedOption null (par exemple, attribuer une valeur par défaut)
                                  }
                                  setEntries(updatedEntries);
                                }}
                              />
                            </div>
                            { /* <div className="col-2">
                              <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                              <button style={{
                                textDecoration: 'none', // Remove underline
                                backgroundColor: 'red', // Background color
                                color: 'white', // Text color
                                padding: '10px 20px', // Padding
                                borderRadius: '5px', // Rounded corners
                              }} onClick={() => removeEntry(index)}>Supprimer</button>
                            </div>*/}

                          </div>

                        </div>
                      ))}


                      <div className="text-center">
                        <button style={{
                          textDecoration: 'none', // Remove underline
                          backgroundColor: '#6366f1', // Background color
                          color: 'white', // Text color
                          padding: '10px 20px', // Padding
                          borderRadius: '5px', // Rounded corners
                        }} onClick={() => {
                          // Vous pouvez laisser cette fonction vide, elle n'effectuera aucune action.
                        }}>Calculer la valorisation</button>

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