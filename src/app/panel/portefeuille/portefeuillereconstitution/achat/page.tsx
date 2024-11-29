"use client";
import { urlconstant } from "@/app/constants";
import axios from 'axios';
import Link from "next/link";
import { Fragment, JSXElementConstructor, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import Select from 'react-select';
import { useRouter } from 'next/navigation';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
//import { router } from 'next/router';
import Header from "@/app/Header";

import { IntlProvider, FormattedDate } from 'react-intl';
import Swal from 'sweetalert2';
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
    portefeuille: {
      funds: any,
      devise: any,
      poids: any,
      montant_invest: any,
      cash: any,
      nom_portefeuille: any
    };
  };
}
interface Portefeuillepropose {
  data: {
    filteredPortfolios: any[]; // ou un type spécifique pour les éléments du tableau 'portefeuille'
  };
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
async function getdateavailable(fondId: any) {
  const data = (
    await fetch(`${urlconstant}/api/getdateavailable/${fondId}`)
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
    id: any;
    devise: any;
    allfund: any;
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
export default function Achat(props: PageProps) {
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
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

  const onChange = (date: any) => {
    if (isDateAvailable(date)) {
      setSelectedDate(date);
    }
  };
  let allfund = props.searchParams.allfund;
  let id = props.searchParams.id;
  let devise = props.searchParams.devise || 'MAD';
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
    { date: '', type: 'achat', quantite: 0, cash: 0, quantiteachat: 0, montant: 0, fondId: 0, portefeuilleselect: null },
  ]);
  const prevPage = () => {
    setFormData({ ...formData, page: formData.page - 1 });
  };
  const [error, setError] = useState(""); // État pour stocker le message d'erreur

  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]); // Tableau pour stocker les lignes sélectionnées
  const [selectedFunds, setSelectedFunds] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vl, setVl] = useState(''); // Set your default currency
  const [vldev, setVldev] = useState(''); // Set your default currency

  const [montantport, setmontantport] = useState(''); // Set your default currency
  const [cashapresopdev, setcashapresopdev] = useState(''); // Set your default currency
  const [cashapresopport, setcashapresopport] = useState(''); // Set your default currency
  const [cashdev, setcashdev] = useState(''); // Set your default currency
  const [taux, settaux] = useState(''); // Set your default currency
  const [quantiteachete, setquantiteachete] = useState(''); // Set your default currency

  const handleSearch = (e: any) => {
    e.preventDefault();
    // Effectuez votre recherche ici si nécessaire
  };
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch(`${urlconstant}/api/vlpardate?date=${selectedDate}&fund_id=${selectedfunds}`);
        const data = await response.json();
        setVl(data.value);
        if (portefeuille?.data.portefeuille.devise == "EUR") {
          setVldev(data.value_EUR)
        } else {
          setVldev(data.value_USD)

        }
        const paire = `${portefeuille?.data.portefeuille.devise}/${devise}`;
        const response8 = await fetch(`${urlconstant}/api/changedevise?date=${selectedDate}&paire=${paire}`);
        const data8 = await response8.json();
        console.log(data8)
        if (data8.message != "Exchange rates not found for the given date") {
          const mont = portefeuille?.data.portefeuille.cash * data8
          setcashdev(mont.toFixed(2).toString());
          settaux(data8)
          const updatedEntries = [...entries];

          const montantp = updatedEntries[0].montant / parseFloat(taux);
          const dd = parseFloat(cashdev) - updatedEntries[0].montant;
          const ee = parseFloat(portefeuille?.data.portefeuille.cash) - parseFloat(montantport);
          setmontantport(montantp.toFixed(2).toString());
          setcashapresopdev(dd.toFixed(2).toString())
          setcashapresopport(ee.toFixed(2).toString())
          const ff = updatedEntries[0].montant / parseFloat(vl);
          setquantiteachete(ff.toFixed(2).toString())
        } else {
          setcashdev("");
          settaux("");
          setmontantport("");
          setquantiteachete("");
          setcashapresopport("");
          setcashapresopdev('')
        }

      } catch (error) {
        console.error('Error fetching exchange rates', error);
      }
    };

    fetchExchangeRates();
  }, [selectedDate]);



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
        const data = await getPortefeuille(selectedportfeuille);
        setPortefeuille(data);
        const paire = `${data?.data.portefeuille.devise}/${devise}`;
        const response8 = await fetch(`${urlconstant}/api/changedevise?date=${selectedDate}&paire=${paire}`);
        const data8 = await response8.json();
        /*if (data8 != null) {
          const mont = portefeuille?.data.portefeuille.cash * data
          setcashdev(mont.toFixed(2).toString());
        }*/

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
        const data3 = await getdateavailable(selectedfunds);
        setAvailableDates(data3.data);
        console.log("ssssss")
        console.log(data3.data)
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

  useEffect(() => {

    let fundsToProcess = [];

    if (Array.isArray(selectedFunds)) {
      fundsToProcess = selectedFunds;
    } else {
      // If selectedFunds is not an array, treat it as a single element
      fundsToProcess = [selectedFunds];
    }

    const initialEntries = fundsToProcess.map(fundId => {
      // Rechercher la transaction correspondante dans transactioData
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
      console.log(transactionData);
      const netQuantiteRounded = parseFloat(netQuantite.toFixed(2));

      console.log(matchingTransactionsAchat);
      return {
        date: '',
        type: 'achat',
        montant: 0,
        quantiteachat: 0,
        quantite: netQuantiteRounded,
        fondId: fundId,
        cash: portefeuille?.data.portefeuille.cash ? portefeuille?.data.portefeuille.cash : 0,
        portefeuilleselect: selectedportfeuille
      };
    });
    setEntries(initialEntries);
  }, [selectedFunds, transactionData]);


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const firstTransaction = transactionData
      //   .reverse()
      .find((transaction) => transaction.type === 'ajoutcash');
    // const firstTransaction = transactionData[0]; // Get the first transaction
    //const selectedDate = new Date(); // Replace this with your actual selectedDate
    console.log(firstTransaction)
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-based
    const day = String(selectedDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    const updatedEntries = [...entries];
    updatedEntries[0].date = formattedDate;
    updatedEntries[0].montant = parseFloat(montantport);


    setEntries(updatedEntries);
    console.log(firstTransaction);

    const isInvalidQuantity = entries.some(entry => entry.montant === 0 || entry.montant > parseFloat(cashdev));
    const isInvalidQuantity1 = entries.some(entry => entry.quantiteachat > 0);
    const isInvalidQuantity2 = entries.some(entry => firstTransaction && entry.date > firstTransaction.date);

    if (!isInvalidQuantity2) {
      setError("La date d achat doit etre superieure à la date de depot")

      // Afficher un message d'erreur et ne pas poursuivre le traitement du formulaire
      console.error('Erreur : La quantité doit être supérieure à 0 .');
      return;
    }
    if (isInvalidQuantity) {
      setError("Le montant doit être supérieure à 0 et inférieure ou égale au cash")

      // Afficher un message d'erreur et ne pas poursuivre le traitement du formulaire
      console.error('Erreur : La quantité doit être supérieure à 0 .');
      return;
    }
    Swal.fire({
      title: 'Veuillez patienter',
      html: 'Achat en cours, ne pas quitter la page!...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      localStorage.setItem('message', 'Achat réussi !');
      console.log(entries)

      const response = await fetch(`${urlconstant}/api/createtransactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Définir le type de contenu JSON
        },
        body: JSON.stringify(entries), // Convertir l'objet en JSON
      });

      const responseData = await response.json(); // Convertir la réponse en JSON



      console.log(responseData);

      if (responseData.code === 200) {
        localStorage.setItem('portefeuille', selectedportfeuille);

        setTimeout(() => {
          const href = `/panel/portefeuille/portefeuillereconstitution?id=${id}&selectedfund=${allfund}&portefeuille=${selectedportfeuille}`;
          router.push(href);
        }, 500);
      }
      Swal.close(); // Fermer le popup après que la requête est terminée



    } catch (error) {
      Swal.close(); // Fermer le popup après que la requête est terminée

      // Gérer les erreurs de l'API (par exemple, afficher une erreur)
      console.error('Erreur lors de la soumission du formulaire :', error);
    }
  };
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
                      <p><span className="text-primary">Achat d actif</span> |  <span className="text-fade">
                      </span></p>

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
                          <div className="row mx-auto text-center">

                            <div className="col-6 ">
                              <Calendar
                                onChange={onChange}
                                value={selectedDate}
                                tileDisabled={({ date, view }) => view === 'month' && !isDateAvailable(date)}
                              />

                            </div>
                            <div className="col-6 ">
                              <br />
                              <br /><br />
                              <label>Fonds</label>
                              <Select
                                isDisabled
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
                          </div>
                          <br />
                          <div className="row ">
                            <div className="row ">


                              <div className="col-3">
                                <label>Cash {portefeuille?.data.portefeuille.devise}</label>
                                <input
                                  disabled

                                  type="number"
                                  className="form-control"
                                  value={entries[0].cash}
                                  onChange={(e) => {
                                    const updatedEntries = [...entries];
                                    updatedEntries[index].cash = parseInt(e.target.value);
                                    setEntries(updatedEntries);
                                  }} />
                              </div>
                              <div className="col-2">
                                <label>Quantite actuelle</label>
                                <input
                                  disabled
                                  type="number"
                                  className="form-control"

                                  value={entry.quantite}
                                  onChange={(e) => {
                                    const updatedEntries = [...entries];
                                    updatedEntries[index].quantite = parseInt(e.target.value);
                                    setEntries(updatedEntries);
                                  }}
                                /></div>
                              <div className="col-2">
                                <label>VL en {portefeuille?.data.portefeuille.devise}</label>
                                <input
                                  disabled
                                  type="number"
                                  className="form-control"

                                  value={vldev}

                                /></div>

                              <div className="col-2">
                                <label>Montant en {portefeuille?.data.portefeuille.devise}</label>
                                <input
                                  disabled
                                  type="number"
                                  className="form-control"

                                  value={montantport}

                                /></div>


                              <div className="col-3">
                                <label>Cash apres operation en {portefeuille?.data.portefeuille.devise}</label>
                                <input
                                  disabled
                                  type="number"
                                  className="form-control"

                                  value={cashapresopport}

                                /></div>


                            </div>
                            <div className="row ">


                              <div className="col-3">
                                <label>Cash {devise}</label>
                                <input
                                  disabled

                                  type="number"
                                  className="form-control"
                                  value={cashdev}
                                />
                              </div>
                              <div className="col-2">
                                <label>VL en {devise}</label>
                                <input
                                  disabled
                                  type="number"
                                  className="form-control"

                                  value={vl}

                                /></div>
                              <div className="col-2">
                                <label>Quantite acheté </label>
                                <input
                                  disabled
                                  type="number"
                                  className="form-control"

                                  value={quantiteachete}

                                /></div>


                              <div className="col-2">
                                <label>Montant en  {devise}</label>
                                <input
                                  type="number"
                                  className="form-control"

                                  //  value={entry.montant}
                                  onChange={(e) => {
                                    const updatedEntries = [...entries];
                                    setEntries(updatedEntries);
                                    const montantp = parseInt(e.target.value) / parseFloat(taux);
                                    setmontantport(montantp.toFixed(2).toString());
                                    //updatedEntries[index].montant = ;
                                    updatedEntries[index].montant = montantp;
                                    const dd = parseFloat(cashdev) - parseInt(e.target.value);
                                    const ee = parseFloat(portefeuille?.data.portefeuille.cash) - parseFloat(montantp.toFixed(2).toString());
                                    setcashapresopdev(dd.toFixed(2).toString())
                                    setcashapresopport(ee.toFixed(2).toString())
                                    const ff = updatedEntries[index].montant / parseFloat(vldev);
                                    setquantiteachete(ff.toFixed(2).toString())
                                  }}
                                /></div>


                              <div className="col-3">
                                <label>Cash apres operation en  {devise}</label>
                                <input
                                  disabled
                                  type="number"
                                  className="form-control"

                                  value={cashapresopdev}

                                /></div>

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
                      {error && <div className=" text-center error-message" style={{ color: "red" }}>{error}</div>}

                      <br />
                      <div className="text-center">
                        <button style={{
                          textDecoration: 'none', // Remove underline
                          backgroundColor: '#6366f1', // Background color
                          color: 'white', // Text color
                          padding: '10px 20px', // Padding
                          borderRadius: '5px', // Rounded corners
                        }} onClick={() => {
                          // Vous pouvez laisser cette fonction vide, elle n'effectuera aucune action.
                        }}>Achat</button>

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