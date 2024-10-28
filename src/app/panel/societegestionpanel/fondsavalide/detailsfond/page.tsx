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
import Headermenu from "@/app/Headermenu";
import Sidebar from "@/app/sidebar";

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
    affectation:any;
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
  dividende: string;
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
    { date: '', value: '', actif_net: '', dividende: '', indRef: '' }, // Initialize with an empty row
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
    setValuationRows([...valuationRows, { date: '', value: '', actif_net: '', dividende: '', indRef: '' }]);
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
          const href = `/panel/societegestionpanel/fondsavalide?id=${societeconneted}`;

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
          const href = `/panel/societegestionpanel/fondsavalide?id=${societeconneted}`;

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
          const href = `/panel/societegestionpanel/fondsavalide?id=${societeconneted}`;

          router.push(href);
        }, 2000);

        // Redirect to the same page
        /* router.push('/societegestionpanel/fonds/detailsfond', {
           pathname: '/societegestionpanel/fonds/detailsfond',
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
          const href = `/panel/societegestionpanel/fondsavalide?id=${societeconneted}`;

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
      <div className="flex bg-gray-100">
        <Sidebar societeconneted={societeconneted} />
        <div className="flex-1 ml-64">
          <Headermenu />


          <div className="content-wrapper2">
            <div className="container-full">
              {/* Main content */}
              <section className="content">
                <div className="row">
                <div className="col-xl-12 mb-4">
                    <div className="card text-center shadow-lg border-0 rounded-lg overflow-hidden">
                      <div className="card-body bg-gradient-to-b from-white to-blue-200 text-white p-5">
                        <img src="/images/avatar/avatar-13.png" className="bg-light rounded-circle avatar-lg img-thumbnail border-4 border-white mb-3" alt="profile-image" />
                        <h4 className="mb-0 mt-2 font-bold text-black-50">{societeconneted}</h4>

                      
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
  <div className="box shadow-lg rounded-lg border-0 bg-white">
    <div className="box-body p-4">
      {/* En-tête de la section */}
      <div className="d-md justify-content-between align-items-center mb-4">
        <div className="panel-heading">
          <div className="row row-no-gutters">
            <div className="col-lg-12 text-center">
              <h3 className="text-gray-800 font-semibold">Détails du Fonds</h3>
            </div>
            <div className="col-lg-2 col-md-2 col-sm-3 col-xs-12 text-center p-2" data-toggle="tooltip" title="42 / 100 au 31/08/2023">
              <div style={{ display: 'inline-block' }} title="42 / 100 au 31/08/2023">
                <div className="spritefonds sprite-3g icon-med" style={{ display: 'inline-block' }}></div>
                <div className="notation-appix"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-lg text-gray-600">
          <p><span className="text-primary">Détails du fonds :</span> {funds?.data?.libelle_fond}</p>
        </div>
      </div>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      <hr className="mb-4" />

      {/* Cartes de fonctions */}
      <div className="row">
        <div className="col-md-3 mb-4">
          <div className="card shadow-sm border-0 rounded-lg">
            <div className="card-body text-center">
              <p className="text-muted">Mettre à jour les VL depuis un fichier</p>
              <Link
                href="#"
                className="btn btn-dark w-100 rounded-full mt-3"
                onClick={toggleFileUpload}
              >
                Mettre à jour les VLs
              </Link>
              <Link
                className="btn btn-outline-primary w-100 rounded-full mt-2"
                href="/excel-files/Vl.csv"
                passHref
              >
                Télécharger le modèle Excel
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="card shadow-sm border-0 rounded-lg">
            <div className="card-body text-center">
              <p className="text-muted">Ajouter manuellement les VLs manquantes</p>
              <button
                className="btn btn-dark w-100 rounded-full mt-3"
                onClick={toggleValuationForm}
              >
                Ajouter manuellement les VLs manquantes
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="card shadow-sm border-0 rounded-lg">
            <div className="card-body text-center">
              <p className="text-muted">Gestion du Benchmark du fonds</p>
              <button
                className="btn btn-dark w-100 rounded-full mt-3"
                onClick={toggleValuationForm1}
              >
                Ajouter un Benchmark
              </button>
              <Link
                className="btn btn-outline-primary w-100 rounded-full mt-2"
                href="/excel-files/Indice.csv"
                passHref
              >
                Télécharger le modèle Excel
              </Link>
              <Link
                href="#"
                className="btn btn-dark w-100 rounded-full mt-2"
                onClick={toggleFileUpload1}
              >
                Importer des Benchmarks
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="card shadow-sm border-0 rounded-lg">
            <div className="card-header text-center text-gray-800 font-bold">
              Statistiques
            </div>
            <div className="card-body">
              <p>Nombre de VL manquantes : <strong>{dates.length}</strong></p>
              <p>Date de dernière VL : <strong>{funds?.data?.lastDate}</strong></p>
              <p>Date de création du fonds : <strong>{funds?.data?.date_creationfund}</strong></p>
              <p>Performance veille : <strong className={`text-right ${parseFloat(funds?.data?.performances?.data?.perfVeille) < 0 ? 'text-danger' : 'text-success'}`}>
                {isNaN(parseFloat(funds?.data?.performances?.data?.perfVeille)) ? '-' : parseFloat(funds?.data?.performances?.data?.perfVeille).toFixed(2)} %
              </strong></p>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton pour afficher/cacher les dates manquantes */}
      <div className="text-center mb-4">
        <button className="btn btn-outline-info rounded-full px-5" onClick={toggleVisibility}>
          {isVisible ? 'Cacher' : 'Afficher'} les dates de VL manquantes
        </button>
      </div>

      {/* Affichage des dates manquantes */}
      {isVisible && (
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h5 className="text-lg font-semibold text-gray-700">Dates de VL Manquantes</h5>
          <p className="text-gray-600">{dates.join(', ')}</p>
          <h5 className="text-lg font-semibold text-gray-700 mt-4">Dates de Benchmarks Manquantes</h5>
          <p className="text-gray-600">{datesind.join(', ')}</p>
        </div>
      )}

      {/* Formulaires de téléchargement et ajout manuel */}
      {showFileUpload && (
        <form onSubmit={handleFormFileSubmit} className="bg-white p-4 rounded-lg shadow-sm mt-4">
          <input type="file" required onChange={handleFileChange} className="form-control mb-3" />
          <div className="text-center">
            <button type="submit" className="btn btn-dark w-100 rounded-full">Enregistrer</button>
          </div>
        </form>
      )}

      {showValuationForm && (
        <form onSubmit={handleFormSubmit} className="bg-white p-4 rounded-lg shadow-sm mt-4">
          <div className="text-center mb-4">
            <button type="button" onClick={addValuationRow} className="btn btn-success rounded-full">Ajouter une ligne de valorisation</button>
          </div>
          <div className="row" id="valuationForm">
            {valuationRows.map((row, index) => (
              <div key={index} className="row mb-3">
                <div className="col-md-2">
                  <input className="form-control" type="date" name={`valuation_date`} value={row.date} onChange={(e) => handleFieldChange(index, 'date', e.target.value)} placeholder="Date" required />
                </div>
                <div className="col-md-2">
                  <input className="form-control" type="number" step="0.01" name={`valuation_value`} value={row.value} onChange={(e) => handleFieldChange(index, 'value', e.target.value)} placeholder="VL" required />
                </div>
                <div className="col-md-2">
                  <input className="form-control" type="text" name={`valuation_actif`} value={row.actif_net} onChange={(e) => handleFieldChange(index, 'actif_net', e.target.value)} placeholder="Actif Net" required />
                </div>
                {funds?.data?.affectation=="DISTRIBUANT" &&
                <div className="col-md-2">
                  <input className="form-control" type="text" name={`dividende`} value={row.dividende} onChange={(e) => handleFieldChange(index, 'dividende', e.target.value)} placeholder="Dividende" required />
                </div>}
                <div className="col-md-2">
                  <input className="form-control" type="text" name={`indRef`} value={row.indRef} onChange={(e) => handleFieldChange(index, 'indRef', e.target.value)} placeholder="Indicateur de référence" required />
                </div>
                <div className="col-md-2">
                  <button type="button" onClick={() => removeValuationRow(index)} className="btn btn-danger rounded-full">Supprimer</button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button className="btn btn-dark w-100 rounded-full">Enregistrer</button>
          </div>
        </form>
      )}

      {showFileUpload1 && (
        <form onSubmit={handleFormFileSubmit1} className="bg-white p-4 rounded-lg shadow-sm mt-4">
          <input type="file" required onChange={handleFileChange1} className="form-control mb-3" />
          <div className="text-center">
            <button type="submit" className="btn btn-dark w-100 rounded-full">Enregistrer</button>
          </div>
        </form>
      )}

      {showValuationForm1 && (
        <form onSubmit={handleFormSubmit1} className="bg-white p-4 rounded-lg shadow-sm mt-4">
          <div className="text-center mb-4">
            <button type="button" onClick={addValuationRow1} className="btn btn-success rounded-full">Ajout Benchmark</button>
          </div>
          <div className="row" id="valuationForm1">
            {valuationRows1.map((row, index) => (
              <div key={index} className="row mb-3">
                <div className="col-md-3">
                  <input className="form-control" type="date" name={`valuation_date`} value={row.date} onChange={(e) => handleFieldChange1(index, 'date', e.target.value)} placeholder="Date" required />
                </div>
                <div className="col-md-3">
                  <input className="form-control" type="number" step="0.01" name={`valuation_value`} value={row.value} onChange={(e) => handleFieldChange1(index, 'value', e.target.value)} placeholder="Valeur" required />
                </div>
                <div className="col-md-3">
                  <input className="form-control" type="text" name={`valuation_actif`} value={row.nom} onChange={(e) => handleFieldChange1(index, 'nom', e.target.value)} placeholder="Nom de l'indice" required />
                </div>
                <div className="col-md-2">
                  <button type="button" onClick={() => removeValuationRow1(index)} className="btn btn-danger rounded-full">Supprimer</button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button className="btn btn-dark w-100 rounded-full">Enregistrer</button>
          </div>
        </form>
      )}
    </div>
  </div>
</div>

            </div>

          </section>
        </div>

        </div>
        </div>
      </div >

    </Fragment >
  );
}