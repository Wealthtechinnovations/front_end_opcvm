"use client";
import { urlconstant } from "@/app/constants";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Styles pour le DatePicker
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import Select from 'react-select';
//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import Header from "@/app/Header";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface Funds {
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
    date_creationfund: any;
    missingVl: any;
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
async function getMissingDates(fundId: number) {
  const response = await fetch(`${urlconstant}/dates-manquantes/${fundId}`);
  const data = await response.json();
  return data.missingDates;
}

async function getMissingindDates(fundId: number) {
  const response = await fetch(`${urlconstant}/dates-indRef-null/${fundId}`);
  const data = await response.json();
  return data.datesWithIndRefNull;
}
async function getFonds(id: number) {
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

interface PageProps {
  searchParams: {
    Id: number;
    societeconneted: any
  };
}
const buttonStyle = {
  backgroundColor: "#3b82f6",
  color: "white",
  padding: "10px 20px", // Adjust padding to control the button size
  borderRadius: "5px", // Add rounded corners for a consistent look
  cursor: "pointer", // Add a pointer cursor on hover for better user experience
};
type ValuationRow = {
  date: string;
  value: string;
  actif_net: string;
  souscription: string;
  indRef: string;
};
type ValuationRow1 = {
  date: string;
  value: string;
  nom: string;

};
export default function Fonds(props: PageProps) {
  const id = props.searchParams.Id;
  const societeconneted = props.searchParams.societeconneted;

  const router = useRouter();
  const [file, setFile] = useState(null);
  const [file1, setFile1] = useState(null);

  const [funds, setFunds] = useState<Funds | null>(null);
  const [activeTab, setActiveTab] = useState("tabAccueil");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState(null);
  const [dates, setDates] = useState([]); // Nouvel état pour les données en base 100
  const [datesind, setDatesind] = useState([]); // Nouvel état pour les données en base 100

  const datesToHighlight = [new Date('2023-10-28'), new Date('2023-11-10')]; // Remplacez ces dates par celles que vous souhaitez marquer



  useEffect(() => {
    // Appel à l'API lors du premier rendu du composant
    async function fetchData() {
      try {
        Swal.fire({
          title: 'Veuillez patienter',
          html: 'Chargement des résultats en cours...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        console.log(props);
        const data = await getFonds(id);

        setFunds(data);
        console.log(data)
        const data1 = await getMissingDates(id);

        setDates(data1);

        const data2 = await getMissingindDates(id);

        setDatesind(data2);

        Swal.close(); // Close the loading popup


      } catch (error) {
        Swal.close(); // Close the loading popup

        console.error("Erreur lors de l'appel à l'API :", error);
      }
    }
    fetchData();
  }, [id]);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showFileUpload1, setShowFileUpload1] = useState(false);
  const [showValuationForm, setShowValuationForm] = useState(false);
  const [showValuationForm1, setShowValuationForm1] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  const toggleFileUpload = () => {
    setShowFileUpload(!showFileUpload);
    setShowValuationForm(false);
    setShowFileUpload1(false);
    setShowValuationForm1(false);



  };
  const toggleFileUpload1 = () => {
    setShowFileUpload(false);
    setShowFileUpload1(!showFileUpload1);
    setShowValuationForm(false);
    setShowValuationForm1(false);


  };

  const toggleValuationForm = () => {
    setShowFileUpload(false);
    setShowFileUpload1(false);
    setShowValuationForm(!showValuationForm);
    setShowValuationForm1(false);

  };
  const toggleValuationForm1 = () => {
    setShowFileUpload(false);
    setShowFileUpload1(false);
    setShowValuationForm1(!showValuationForm1);
    setShowValuationForm(false);

  };
  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  const handleFileChange1 = (e: any) => {
    setFile1(e.target.files[0]);
  };

  const removeValuationRow = (index: number) => {
    const updatedRows = [...valuationRows];
    updatedRows.splice(index, 1);
    setValuationRows(updatedRows);
  };

  const removeValuationRow1 = (index: number) => {
    const updatedRows = [...valuationRows1];
    updatedRows.splice(index, 1);
    setValuationRows1(updatedRows);
  };
  const [valuationRows, setValuationRows] = useState<ValuationRow[]>([
    { date: '', value: '', actif_net: '', souscription: '', indRef: '' }, // Initialize with an empty row
  ]);

  const [valuationRows1, setValuationRows1] = useState<ValuationRow1[]>([
    { date: '', value: '', nom: '' }, // Initialize with an empty row
  ]);

  const handleFieldChange = (index: number, fieldName: string, value: string) => {
    const updatedRows = [...valuationRows];

    // Use a type assertion to indicate that fieldName is a valid key
    (updatedRows[index] as any)[fieldName] = value;

    setValuationRows(updatedRows);
  };
  const handleFieldChange1 = (index: number, fieldName: string, value: string) => {
    const updatedRows = [...valuationRows1];

    // Use a type assertion to indicate that fieldName is a valid key
    (updatedRows[index] as any)[fieldName] = value;

    setValuationRows1(updatedRows);
  };


  const formData = new FormData();

  fetch('/api/uploadFile', {
    method: 'POST',
    body: formData,
  })
    .then(response => response.json())
    .then(data => {
      // Handle the response as needed
    })
    .catch(error => {
      console.error('Error uploading file:', error);
    });

  const [successMessage, setSuccessMessage] = useState('');

  const addValuationRow = () => {
    setValuationRows([...valuationRows, { date: '', value: '', actif_net: '', souscription: '', indRef: '' }]);
  };
  const addValuationRow1 = () => {
    setValuationRows1([...valuationRows1, { date: '', value: '', nom: '' }]);
  };

  const handleFormSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {
      console.log(valuationRows);
      const valuationRowsWithFondId = valuationRows.map((row) => ({
        ...row,
        fund_id: id,
      }));
      const response = await fetch(`${urlconstant}/api/ajoutVL/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(valuationRowsWithFondId), // Send data as JSON
      });

      if (response.ok) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          html: `<p> Données enregistrées.</p>`,
          showConfirmButton: false,
          timer: 5000,
        });

        setSuccessMessage('Données inserées');

        // Redirect to the same page
        setTimeout(() => {
          const href = `/payspanel/fonds?id=${societeconneted}`;

          router.push(href);
        }, 2000);
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          html: `<p> "Error" </p>`,
          showConfirmButton: false,
          timer: 10000,
        });
        // Handle errors, e.g., show an error message
      }
    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        html: `<p> "Error" </p>`,
        showConfirmButton: false,
        timer: 10000,
      });
      // Handle network errors
    }
  };

  const handleFormFileSubmit = async (e: any) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('id', id.toString());

    try {
      const response = await fetch(`${urlconstant}/api/uploadsfilevl/${id}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          html: `<p> Données enregistrées.</p>`,
          showConfirmButton: false,
          timer: 5000,
        });

        setTimeout(() => {
          const href = `/payspanel/fonds?id=${societeconneted}`;

          router.push(href);
        }, 2000);
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          html: `<p> "Error" </p>`,
          showConfirmButton: false,
          timer: 10000,
        });
        alert('File upload and data save failed.');
      }
    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        html: `<p> "Error" </p>`,
        showConfirmButton: false,
        timer: 10000,
      });
      console.error('Network error:', error);
    }
  };

  const handleFormSubmit1 = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {
      console.log(valuationRows1);
      const valuationRowsWithFondId = valuationRows1.map((row) => ({
        ...row,
        fund_id: id,
      }));
      const response = await fetch(`${urlconstant}/api/ajoutIndice/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(valuationRowsWithFondId), // Send data as JSON
      });

      if (response.ok) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          html: `<p> Données enregistrées.</p>`,
          showConfirmButton: false,
          timer: 5000,
        });
        setSuccessMessage('Données inserées');
        setTimeout(() => {
          const href = `/payspanel/fonds?id=${societeconneted}`;

          router.push(href);
        }, 2000);

        // Redirect to the same page
        /* router.push('/payspanel/fonds/detailsfond', {
           pathname: '/payspanel/fonds/detailsfond',
           query: { Id: item?.id }, // Pass query parameters
         });*/
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          html: `<p> "Error" </p>`,
          showConfirmButton: false,
          timer: 10000,
        });
        // Handle errors, e.g., show an error message
      }
    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        html: `<p> "Error" </p>`,
        showConfirmButton: false,
        timer: 10000,
      });
      // Handle network errors
    }
  };

  const handleFormFileSubmit1 = async (e: any) => {
    e.preventDefault();
    if (!file1) {
      alert('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', file1);
    formData.append('id', id.toString());

    try {
      const response = await fetch(`${urlconstant}/api/uploadsfileindice/${id}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          html: `<p> Données enregistrées.</p>`,
          showConfirmButton: false,
          timer: 5000,
        }); setTimeout(() => {
          const href = `/payspanel/fonds?id=${societeconneted}`;

          router.push(href);
        }, 2000);
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          html: `<p> "Error" </p>`,
          showConfirmButton: false,
          timer: 10000,
        });
      }
    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        html: `<p> "Error" </p>`,
        showConfirmButton: false,
        timer: 10000,
      });
      console.error('Network error:', error);
    }
  };

  const valuationData = {
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
                  <Link href={`/payspanel/pagehome?id=${societeconneted}`} >
                    <i data-feather="plus-square"></i>
                    <span>Tableau de bord</span>
                  </Link>
                </li>
                <li className={`dropdown ${isDropdownOpen ? 'open' : ''}`}>
                  <a href="#" onClick={toggleDropdown} className="dropdown-toggle" data-toggle="dropdown" style={{ backgroundColor: "#3b82f6", color: "white" }}>
                    <i data-feather={isDropdownOpen ? "minus-square" : "plus-square"}></i>
                    <span>Fonds</span>
                  </a>
                  {isDropdownOpen && (
                    <>
                      <li>
                        <a href={`/payspanel/fondsvalide?id=${societeconneted}`}>   <i className="bi bi-check2"></i>
                          <span style={{ marginLeft: '55px' }}>Fonds validés</span></a>
                      </li>
                      <li>
                        <a href={`/payspanel/fonds?id=${societeconneted}`}>
                          <span style={{ marginLeft: '55px' }}>Fonds à validés</span></a>
                      </li>
                      <li>
                        <a href={`/payspanel/ajoutvl?id=${societeconneted}`}> <i data-feather={isDropdownOpen ? "minus-square" : "plus-square"}></i>
                          <span style={{ marginLeft: '55px' }}>Ajouter un fond</span></a>
                      </li>
                      <li>
                        <a href={`/payspanel/importfondvl?id=${societeconneted}`}> <i data-feather={isDropdownOpen ? "minus-square" : "plus-square"}></i>
                          <span style={{ marginLeft: '55px' }}>Importer Fonds et Vl</span></a>
                      </li>
                    </>
                  )}
                </li>


                <li>
                  <Link href={`/payspanel/anomalie?id=${societeconneted}`}  >
                    <i data-feather="plus-square"></i>
                    <span>Anomalies</span>
                  </Link>
                </li>

                <li>
                  <Link href={`/payspanel/actualite?id=${societeconneted}`} >
                    <i data-feather="user"></i>
                    <span>Actualités</span>
                  </Link>
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
                    <h4 className="title-bx text-primary">Panel Societe de gestion</h4>
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

            <div className="col-12">
              <div className="box ">
                <div className="box-body">
                  <div className="d-md justify-content-between align-items-center">
                    <div className="panel-heading p-b-0">
                      <div className="row row-no-gutters">
                        <div className="col-lg-12  text-center-xs p-t-1">
                          <h3>


                          </h3>
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
                      <p><span className="text-primary">Details du fonds</span> | <span className="text-fade">{funds?.data?.libelle_fond}</span></p>

                    </div>

                  </div>
                  {successMessage && <div className="success-message">{successMessage}</div>}

                  <hr />
                  <div className="row">

                    <div className="box mb-15 pull-up hover-success col-3">
                      <div className="box-body">
                        <div className="row align-items-center mt-10">
                          <div className="col-12">
                            <p className="text-muted fw-normal m-0 text-muted" title="Portfolio">
                              Mettre a jour les VL depuis un fichier
                            </p>
                          </div>
                        </div>
                        <br />

                        <Link
                          href={{}}
                          style={{ ...buttonStyle, width: "100%" }} // Appliquer le style du bouton avec une largeur de 100%
                          onClick={toggleFileUpload}
                          className="waves-effect waves-light btn btn-rounded btn-dark mb-5"
                        >
                          Mettre à jour les VLs
                        </Link>


                        <Link
                          className="btn btn-main"
                          style={{ ...buttonStyle, width: "100%" }} // Appliquer le style du bouton avec une largeur de 100%
                          href="/excel-files/Vl.csv"
                          passHref
                        >
                          Télécharger le modèle Excel
                        </Link>

                      </div>
                    </div>
                    <div className="box mb-15 pull-up hover-success col-3">
                      <div className="box-body">
                        <div className="row align-items-center mt-10">
                          <div className="col-12">
                            <p className="text-muted fw-normal m-0 text-muted" title="Portfolio">
                              Ajouter manuellement les VLs manquantes
                            </p>
                          </div>
                        </div>
                        <br />
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center">
                            <button
                              style={buttonStyle} // Apply the button style

                              type="button"
                              onClick={toggleValuationForm}
                              className="waves-effect waves-light btn btn-rounded btn-dark mb-5"
                            >
                              <i className="fa fa-fw fa-apple"></i> Ajouter manuellement les VLs manquantes
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                    <div className="box mb-15 pull-up hover-success col-3">
                      <div className="box-body">
                        <div className="row align-items-center mt-10">
                          <div className="col-12">
                            <p className="text-muted fw-normal m-0 text-muted" title="Portfolio">
                              Gestion du Benchmark du fonds
                            </p>
                          </div>
                        </div>
                        <br />
                        <br />
                        <button
                          style={{ ...buttonStyle, width: "100%" }}  // Apply the button style

                          type="button"
                          onClick={toggleValuationForm1}
                          className="waves-effect waves-light btn btn-rounded btn-dark mb-5"
                        >
                          Ajouter un Benchmarks
                        </button>

                        <Link
                          className="btn btn-main"
                          style={{ ...buttonStyle, width: "100%" }} // Appliquer le style du bouton avec une largeur de 100%
                          href="/excel-files/Indice.csv"
                          passHref
                        >
                          Télécharger le modèle Excel
                        </Link>
                        <br />
                        <br />
                        <Link
                          href={{}}
                          style={{ ...buttonStyle, width: "100%" }} // Appliquer le style du bouton avec une largeur de 100%
                          onClick={toggleFileUpload1}
                          className="waves-effect waves-light btn btn-rounded btn-dark mb-5"
                        >
                          Importer des Benchmarks
                        </Link>

                      </div>
                    </div>


                    <div className="box mb-15 pull-up  col-3">
                      <div className="box-header"><strong>Statistiques</strong></div>
                      <div className="box-body">
                        <p> Nombre de VL manquante : <strong> {dates.length}</strong></p>
                        <p> Date de derniere VL : <strong>{funds?.data?.lastDate}</strong></p>
                        <p> Date de creation du fonds : <strong>{funds?.data?.date_creationfund}</strong></p>
                        <p> Performance veille : <strong className={`text-right ${parseFloat(funds?.data?.performances?.data?.perfVeille) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(funds?.data?.performances?.data?.perfVeille)) ? '-' : parseFloat(funds?.data?.performances?.data?.perfVeille).toFixed(2)} %</strong></p>
                      </div>
                    </div>
                    <div>
                      <button style={buttonStyle} onClick={toggleVisibility}>{isVisible ? 'Cacher' : 'Afficher'} les dates de VL manquantes</button>

                      {isVisible && (
                        <div>
                          <h5>Dates de VL Manquantes</h5>
                          <p>{dates.join(', ')}</p>
                          <br />
                          <h5>Dates de indices Manquantes</h5>
                          <p>{datesind.join(', ')}</p>
                        </div>
                      )}


                    </div>
                    <br />
                    {showFileUpload && (
                      <form onSubmit={handleFormFileSubmit}>
                        <input required type="file" onChange={handleFileChange} />
                        {/* <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                         highlightDates={datesToHighlight.map((date) => ({
                            date,
                            className: 'highlighted-date',
                          }))}
                        />*/}
                        <br />

                        <div className="text-center">
                          <button type="submit" className="btn btn-main" style={buttonStyle} // Apply the button style

                          >Enregistrer</button>
                        </div>
                      </form>

                    )}

                    {showValuationForm && (
                      <form onSubmit={handleFormSubmit}>
                        <div className="row col-4">
                          &nbsp; &nbsp; &nbsp; <button type="button" style={buttonStyle} onClick={addValuationRow} className="btn btn-success">
                            Ajouter une ligne de valorisation                            &nbsp;
                            &nbsp;

                          </button>
                        </div>
                        <br />
                        <div className="row" id="valuationForm">
                          <br />
                          {valuationRows.map((row, index) => (
                            <div key={index} className="row">

                              <div className="col-2">
                                <input
                                  className="form-control"
                                  type="date"
                                  name={`valuation_date`}
                                  value={row.date}
                                  onChange={(e) => handleFieldChange(index, 'date', e.target.value)}
                                  placeholder="Date"
                                  required
                                />
                              </div>
                              <div className="col-2">
                                <input
                                  className="form-control"
                                  type="number"
                                  step="0.01"
                                  name={`valuation_value`}
                                  value={row.value}
                                  onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
                                  placeholder="VL"
                                  required
                                />
                              </div>
                              <div className="col-2">
                                <input
                                  className="form-control"
                                  type="text"
                                  name={`valuation_actif`}
                                  value={row.actif_net}
                                  onChange={(e) => handleFieldChange(index, 'actif_net', e.target.value)}
                                  placeholder="Actif Net"
                                  required
                                />
                              </div>
                              <div className="col-2">
                                <input
                                  className="form-control"
                                  type="text"
                                  name={`souscription`}
                                  value={row.souscription}
                                  onChange={(e) => handleFieldChange(index, 'souscription', e.target.value)}
                                  placeholder="souscription"
                                  required
                                />
                              </div>
                              <div className="col-2">
                                <input
                                  className="form-control"
                                  type="text"
                                  name={`indRef`}
                                  value={row.indRef}
                                  onChange={(e) => handleFieldChange(index, 'indRef', e.target.value)}
                                  placeholder="indRef"
                                  required
                                />
                              </div>
                              <div className="col-2">
                                <button type="button" onClick={() => removeValuationRow(index)} className="btn btn-danger">
                                  Supprimer
                                </button>
                              </div>
                              <br />
                            </div>

                          ))}

                        </div>
                        <br />
                        <div className="text-center">
                          <button className="btn btn-main" style={{ backgroundColor: "#3b82f6", color: "white" }} type="submit">
                            Enregistrer
                          </button>
                        </div>
                      </form>
                    )}
                    {showFileUpload1 && (
                      <form onSubmit={handleFormFileSubmit1}>
                        <input required type="file" onChange={handleFileChange1} />
                        {/* <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                         highlightDates={datesToHighlight.map((date) => ({
                            date,
                            className: 'highlighted-date',
                          }))}
                        />*/}
                        <br />

                        <div className="text-center">
                          <button type="submit" className="btn btn-main" style={buttonStyle} // Apply the button style

                          >Enregistrer</button>
                        </div>
                      </form>

                    )}

                    {showValuationForm1 && (
                      <form onSubmit={handleFormSubmit1}>
                        <div className="row col-4">
                          &nbsp; &nbsp; &nbsp; <button type="button" style={buttonStyle} onClick={addValuationRow1} className="btn btn-success">
                            Ajout Benchmark                            &nbsp;
                            &nbsp;

                          </button>
                        </div>
                        <br />
                        <div className="row" id="valuationForm">
                          <br />
                          {valuationRows1.map((row, index) => (
                            <div key={index} className="row">

                              <div className="col-3">
                                <input
                                  className="form-control"
                                  type="date"
                                  name={`valuation_date`}
                                  value={row.date}
                                  onChange={(e) => handleFieldChange1(index, 'date', e.target.value)}
                                  placeholder="Date"
                                  required
                                />
                              </div>
                              <div className="col-3">
                                <input
                                  className="form-control"
                                  type="number"
                                  step="0.01"
                                  name={`valuation_value`}
                                  value={row.value}
                                  onChange={(e) => handleFieldChange1(index, 'value', e.target.value)}
                                  placeholder="Valeur"
                                  required
                                />
                              </div>
                              <div className="col-3">
                                <input
                                  className="form-control"
                                  type="text"
                                  name={`valuation_actif`}
                                  value={row.nom}
                                  onChange={(e) => handleFieldChange1(index, 'nom', e.target.value)}
                                  placeholder="Nom indice"
                                  required
                                />
                              </div>

                              <div className="col-2">
                                <button type="button" onClick={() => removeValuationRow1(index)} className="btn btn-danger">
                                  Supprimer
                                </button>
                              </div>
                              <br />
                            </div>

                          ))}

                        </div>
                        <br />
                        <div className="text-center">
                          <button className="btn btn-main" style={{ backgroundColor: "#3b82f6", color: "white" }} type="submit">
                            Enregistrer
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                  {/* <div className="table-responsive">

                    <table
                      id="example11"
                      className="table text-fade table-bordered table-hover display nowrap margin-top-10 w-p100">
                      <thead className="table-header">
                        <tr className="text-right">
                          <th className="text-right">Nom du fond </th>
                          <th className="text-right">Code ISIN</th>
                          <th className="text-right">Montant derniere VL</th>
                          <th className="text-right">Date de la derniere VL (Vl initiale)</th>
                          <th className="text-right">Date de création du fonds</th>
                          <th className="text-right">Periodicité</th>
                          <th className="text-right">Categorie</th>
                          <th className="text-right">Devise</th>
                          <th className="text-right">Action</th>



                        </tr>
                      </thead>
                      <tbody>
                        {funds?.data?.funds.map((item: any) => (
                          <tr className="text-right" key={item.id}>

                            <td className="text-left">{item?.nom_fond}</td>
                            <td>{item?.code_ISIN}</td>
                            <td>{item?.categorie_libelle}</td>
                            <td>{item?.dev_libelle}</td>

                            <td>{item?.datejour}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td> </td>

                          </tr>
                        ))}

                      </tbody>
                    </table>
                  </div>*/}



                  {/*<div>
                    <label htmlFor="textInput">Autre champ :</label>
                    <input
                      className="form-control"
                      type="text"
                      id="textInput"
                    />
                  </div>*/ }
                  <br></br>

                </div>


              </div>



            </div>





          </section>
        </div>

      </div >

    </Fragment >
  );
}