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

import { useRouter } from 'next/navigation';
import { Button, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import Headermenu from "@/app/Headermenu";
import Sidebar from "@/app/sidebaradmin";

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
  dev_libelle: any;
  datejour: any;
  lastValue: any;
  categorie_national: any;
  id: any;
  code_ISIN: any;
  nom_fond: any;
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
    fond: any;
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
  dev_libelle: any;
  datejour: any;
  lastValue: any;
  categorie_national: any;
  id: any;
  code: any;
  nom: any;
  now: string;
  nowdate: string;
  after: any;
  afterdate: any;
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
  let fondid = props.searchParams.fond;
  let societeconneted = props.searchParams.id;

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
  const [showPopup, setShowPopup] = useState(false);
  const [valuenow, setValuenow] = useState<string>('');
  const handleClosePopup = () => setShowPopup(false);
  const [fundsOptions2, setFundsOptions2] = useState([]);
  const [indexselected, setIndexselected] = useState<number | null>(null);

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
        const response = await fetch(`${urlconstant}/api/getfondsanomalie/${fondid}`);
        const data = await response.json();
        //  setFundsData(data.data);




        // Mettez à jour l'état avec les données récupérées
        setFundsData(data.data);
      } catch (error) {
        console.error("Erreur lors de l'appel API :", error);
      }


      // Mettez à jour l'état avec les données récupérées
    }

    // Appelez la fonction pour récupérer les données lorsque le composant est monté
    fetchData();
  }, []); // A


  let options;
  const handleshow = async (index: number) => {
    try {

      setShowPopup(true);
      setIndexselected(index);

      const response = await fetch(`${urlconstant}/api/vlspresui/${fondid}/${fundsData[index].now}/${fundsData[index].nowdate}`);  // Remplacez 'id' par l'identifiant du fonds
      const data = await response.json();
      console.log(data.data);
      let { previousValues, nextValues } = data.data;
      //  const newLine = { id: fondid, date: '', value: '' };


      //   previousValues = [...previousValues, newLine],
      setFormValues({ previousValues, nextValues });
      console.log()

      //  alert('Fond ajouté aux favoris !');


      // Inversez l'état local pour refléter le changement
    } catch (error) {
    }
  };

  const [formValues, setFormValues] = useState({
    // Initialiser les valeurs du formulaire
    previousValues: Array.from({ length: 6 }, () => ({ id: fondid, date: '', value: '' })),
    nextValues: Array.from({ length: 5 }, () => ({ id: fondid, date: '', value: '' }))
  });

  useEffect(() => {
    const fetchData = async () => {
      try {

      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (showPopup) {
      fetchData();
    }
  }, [showPopup, fondid, fundsData]);

  const handleSaveChanges = async (e: any) => {
    e.preventDefault();
    // const newLine = { id: fondid, date: fundsData[0].nowdate, value: fundsData[0].now };

    // Mettre à jour formValues avec la nouvelle ligne ajoutée
    /*const updatedFormValues = {
      previousValues: [...formValues.previousValues, newLine],
      nextValues: [...formValues.nextValues]
    };*/
    const response = await fetch(`${urlconstant}/api/updateValues/${fondid}`, {
      method: 'POST', // Utilisez 'POST' ou 'PUT' selon votre API
      headers: {
        'Content-Type': 'application/json', // Spécifiez le type de contenu que vous envoyez
      },
      body: JSON.stringify(formValues)
    });
    if (response.status === 200) {

      Swal.fire({
        position: 'center',
        icon: 'success',
        html: `<p> Données enregistrées.</p>`,
        showConfirmButton: false,
        timer: 5000,
      });

      setTimeout(() => {
        const href = `/panel/societegestionpanel/anomalie?id=${societeconneted}`;

        router.push(href);
      }, 2000);

      // Envoyer les valeurs modifiées au backend pour mise à jour
      // Mettre en œuvre la logique pour mettre à jour les valorisations ici
      // Une fois que les modifications sont effectuées avec succès, fermez le pop-up
      handleClosePopup();
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        html: `<p> "Error" </p>`,
        showConfirmButton: false,
        timer: 10000,
      });
    }
  };

  const handlePreviousChange = (index: number, value: string, date?: any) => {
    console.log(index)
    let newValues;
    if (index != 5) {
      newValues = [...formValues.previousValues];
      newValues[index].value = value;
      console.log("index")
      console.log(newValues)
      console.log(formValues.previousValues)
    } else {
      const newLine = { id: fondid, date: date, value: '' };

      if (formValues.previousValues.length <= 5) {
        formValues.previousValues.push(newLine);
      }
      console.log("index1")

      newValues = [...formValues.previousValues];
      console.log(newValues)

      //  newValues[5].value = value;
      newValues[index].value = value;
      console.log(index)
      console.log(value)
      console.log(formValues.previousValues)
    }

    setFormValues({ ...formValues, previousValues: newValues });
  };

  const handleNextChange = (index: number, value: string) => {
    const newValues = [...formValues.nextValues];
    newValues[index].value = value;
    setFormValues({ ...formValues, nextValues: newValues });
  };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  return (

< Fragment >
      <div className="flex bg-gray-100">
        <Sidebar id={societeconneted} />
        <div className="flex-1 ml-64">
          <Headermenu />


          <div className="content-wrapper2">
            <div className="container-full">
              {/* Main content */}
              <section className="content">
                <div className="row">
                  <div className="col-xl-12 col-lg-12 mb-4">
                    <div className="card text-center shadow-lg border-0 rounded-lg overflow-hidden">
                      <div className="card-body bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-500 text-white">
                        <img src="/images/avatar/avatar-13.png" className="bg-light rounded-circle avatar-lg img-thumbnail border-4 border-white mb-3" alt="profile-image" />
                        <h4 className="mb-0 mt-2">{societeconneted}</h4>



                        <ul className="social-list list-inline mt-3 mb-0">
                          <li className="list-inline-item">
                            <a href="#" className="btn btn-social-icon btn-circle text-white bg-facebook hover:bg-facebook-dark">
                              <i className="fa fa-facebook"></i>
                            </a>
                          </li>
                          <li className="list-inline-item">
                            <a href="#" className="btn btn-social-icon btn-circle text-white bg-twitter hover:bg-twitter-dark">
                              <i className="fa fa-twitter"></i>
                            </a>
                          </li>
                          <li className="list-inline-item">
                            <a href="#" className="btn btn-social-icon btn-circle text-white bg-google hover:bg-google-dark">
                              <i className="fa fa-google"></i>
                            </a>
                          </li>
                          <li className="list-inline-item">
                            <a href="#" className="btn btn-social-icon btn-circle text-white bg-instagram hover:bg-instagram-dark">
                              <i className="fa fa-instagram"></i>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
            <br />


        <Modal show={showPopup} onHide={handleClosePopup} centered>
          <Modal.Header closeButton>
            <Modal.Title>Action</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>Précédentes valeurs :</h5>

            {formValues.previousValues.map((item, index) => (
              index != 5 && (
                <div className="row" key={index}>
                  <div className="col-6">
                    <input
                      readOnly
                      className="form-control"
                      type="text"
                      value={item.date}
                      placeholder="Date"
                    />
                  </div>
                  <div className="col-6">
                    <input
                      className="form-control"
                      type="text"
                      value={item.value}
                      onChange={(e) => handlePreviousChange(index, e.target.value, item.date)}
                      placeholder="Valeur"
                    />
                  </div>
                </div>
              )


            ))}
            <br />
            <h5>Valeurs :</h5>
            {fundsData.map((data, index) => (
              index === indexselected && (
                <div className="row" key={indexselected}>
                  <div className="col-6">
                    <input
                      readOnly
                      className="form-control"
                      type="text"
                      value={data?.nowdate}
                      placeholder="Date"
                    />
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      className="form-control"
                      //  value={parseFloat(data?.now)}
                      onChange={(e) => handlePreviousChange(5, e.target.value || data?.now, data?.nowdate)}
                      placeholder="Valeur"
                    />
                  </div>
                </div>
              )
            ))}


            <br />
            <h5>Suivantes valeurs :</h5>
            {formValues.nextValues.map((item, index) => (
              <div className="row" key={index}>

                <div className="col-6">
                  <input
                    readOnly
                    className="form-control"
                    type="text"
                    value={item.date}
                    onChange={(e) => handleNextChange(index, e.target.value)}
                    placeholder="Date"
                  />
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    className="form-control"
                    value={item.value}
                    onChange={(e) => handleNextChange(index, e.target.value)}
                    placeholder="Valeur"
                  />
                </div>
              </div>

            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" style={{
              textDecoration: 'none',
              backgroundColor: '#6366f1',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '5px',
            }} onClick={handleSaveChanges}>
              Ok
            </Button>
            <Button variant="secondary" style={{
              textDecoration: 'none',
              backgroundColor: 'red',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '5px',
            }} onClick={handleClosePopup}>
              Fermer
            </Button>
          </Modal.Footer>
        </Modal>
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
                  <h4><span className="text-primary">Details sur le Fonds</span></h4>
                </div>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nom du Fonds</th>
                      <th>Code ISIN</th>
                      <th> VL 1 </th>
                      <th> VL 2</th>
                      <th>Actions</th>

                    </tr>
                  </thead>
                  <tbody>
                    {fundsData.map((data, index) => (
                      <tr key={index} >
                        <td className="">
                          <p>
                            <span className="text-primary">{data?.nom}</span> </p>
                        </td>
                        <td className="">   <p><span className="text-fade">{data?.code}</span> </p>   </td>
                        <td className="">      <p className="mb-0 text-success">{data?.now} du {data?.nowdate}</p></td>
                        <td className="">      <p className="mb-0 text-success">{data?.after} du {data?.afterdate}</p></td>
                        <td> <button
                          className="reconstitution-button"
                          onClick={() => handleshow(index)}
                        >
                          Details
                        </button></td>
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
      </section>
      </div >
      </div >
      </div >
      </div >
    </Fragment >
  );
}