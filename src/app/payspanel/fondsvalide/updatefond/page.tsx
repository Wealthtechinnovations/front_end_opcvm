"use client";
import { urlconstant } from "@/app/constants";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import Select, { SingleValue } from 'react-select';


//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
//import { router } from 'next/router';
import Header from '../../../Header';
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const options = [
  { value: 'Journaliere', label: 'Journaliere' },
  { value: 'Hedbomaaire', label: 'Hedbomaaire' },
  { value: 'Mensuelle', label: 'Mensuelle' },
  // Ajoutez plus d'options au besoin
];

const optionsCategorie = [
  { value: "Obligations", label: 'Obligations' },
  { value: "Actions", label: 'Actions' },
  { value: "Diversifié", label: 'Diversifié' },
  { value: "Monétaire", label: 'Monétaire' },
  { value: "ETF", label: 'ETF' },
  { value: "Infrastructure", label: 'Infrastructure' },
  { value: "Immobilier", label: 'Immobilier' },
  { value: "Private equity", label: 'Private equity' },
  { value: "Alternatif", label: 'Alternatif' },

  { value: "Autres", label: 'Autres' },


];

const optionsStructure = [
  {
    value: "(FCPR) Fonds communs de placement à risques", label: '(FCPR) Fonds communs de placement à risques'
  },
  {
    value: "(FCPI) Fonds communs de placement dans l'innovation", label: "(FCPI) Fonds communs de placement dans l'innovation"
  },
  {
    value: "(FIP) Fonds d'investissement de proximité", label: "(FIP) Fonds d'investissement de proximité"
  },
  {
    value: "Autres Fonds de capital investissement", label: 'Autres Fonds de capital investissement'
  },
  {
    value: "(FPCI) Fonds professionnels de capital investissement", label: '(FPCI) Fonds professionnels de capital investissement'
  },

];

const optionsClassification = [
  {
    value: "Private_Equity", label: 'Private_Equity'
  },
  {
    value: "Immobiler_REITs", label: 'Immobiler_REITs'
  },
  { value: "Diversifié", label: 'Diversifié' },
  {
    value: "Fonds_professionnel_spécialisé__FPS", label: 'Fonds_professionnel_spécialisé__FPS'
  },
  {
    value: "Fonds_d_épargne_salariale", label: 'Fonds_d_épargne_salariale'
  },
  {
    value: "Fonds_de_Financement_et_titrisation", label: 'Fonds_de_Financement_et_titrisation'
  },
  {
    value: "ETF", label: 'ETF'
  },
  {
    value: "Hedge_Funds", label: 'Hedge_Funds'
  },
  {
    value: "Fonds_dédié", label: 'Fonds_dédié'
  },

  { value: "Autres", label: 'Autres' },


];

interface Pays {
  value: string; // ou un type spécifique pour les éléments du tableau 'funds'

}
interface Regulateur {
  value: string; // ou un type spécifique pour les éléments du tableau 'funds'

}
interface Devise {
  value: string; // ou un type spécifique pour les éléments du tableau 'funds'

}
interface FormData {
  page: number;
  nom_fond: string;
  categorie_globale: string;
  societe_gestion: string;
  numero_agrement: string;
  structure_fond: string;
  strategie_politique_invest: string;
  philosophie_fond: string;
  code_ISIN: string;
  nom_gerant: string;
  type_investissement: string;
  description: string;
  date_creation: string;
  pays: string;
  regulateur: string;
  dev_libelle: string;
  fuseauHoraire: string;
  periodicite: string;
  horizonplacement: string;
  date_agrement: string;
  active: number; // Ajouter les variables supplémentaires du modèle avec leurs valeurs par défaut
  depositaire: string;
  teneur_registre: string;
  valorisateur: string;
  centralisateur: string;
  agent_transfert: string;
  agent_payeur: string;
  montant_premier_vl: string;
  date_premiere_vl: string;
  montant_actif_net: string;
  duree_investissement_recommande: string;
  minimum_investissement: string;
  date_cloture: string;
  heure_cutt_off: string;
  delai_reglement: string;
  classification: string;
  affectation: string;
  souscripteur: string;
  datejour: string;
  frais_gestion: string; // Ajout des frais
  frais_souscription: string;
  frais_entree: string;
  frais_sortie: string
}


async function getpays() {
  const data = (
    await fetch(`${urlconstant}/api/getPays`)
  ).json();
  return data;
}
async function getregulateur(selectedPays: any) {
  const data = (
    await fetch(`${urlconstant}/api/getRegulateur?pays=${selectedPays}`)
  ).json();
  return data;
}
async function getdevise(selectedPays: any) {
  const data = (
    await fetch(`${urlconstant}/api/getDevise?pays=${selectedPays}`)
  ).json();
  return data;
}
interface PageProps {
  searchParams: {
    id: any,
    fondId: any
    societeconneted: any
  };
}
async function fondscharge(id: number) {
  const data = (
    await fetch(`${urlconstant}/api/fondscharge/${id}`)
  ).json();
  return data;
}
export default function Ajoutvl(props: PageProps) {
  async function getlastvl1() {
    const data = (
      await fetch(`/api/searchFunds`)
    ).json();
    return data;
  }
  let id = props.searchParams.id;
  let fondId = props.searchParams.fondId
  const router = useRouter();
  const [selectedFund, setSelectedFund] = useState(null);
  const [fund, setFund] = useState<FormData>({
    page: 1,
    nom_fond: '',
    categorie_globale: '',
    societe_gestion: '',
    numero_agrement: '',
    structure_fond: '',
    strategie_politique_invest: '',
    philosophie_fond: '',
    code_ISIN: '',
    nom_gerant: '',
    type_investissement: '',
    description: '',
    date_creation: '',
    pays: '',
    regulateur: '',
    dev_libelle: '',
    fuseauHoraire: '',
    periodicite: '',
    horizonplacement: '',
    date_agrement: '',
    active: 0, // Ajouter les variables supplémentaires du modèle avec leurs valeurs par défaut
    depositaire: '',
    teneur_registre: '',
    valorisateur: '',
    centralisateur: '',
    agent_transfert: '',
    agent_payeur: '',
    montant_premier_vl: '',
    date_premiere_vl: '',
    montant_actif_net: '',
    duree_investissement_recommande: '',
    minimum_investissement: '',
    date_cloture: '',
    heure_cutt_off: '',
    delai_reglement: '',
    classification: '',
    affectation: '',
    souscripteur: '',
    datejour: '',
    frais_gestion: '', // Ajout des frais
    frais_souscription: '',
    frais_entree: '',
    frais_sortie: ''
  });
  const [deviseOptions, setDeviseOptions] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPays, setSelectedPays] = useState<Pays | null>(null);
  const [selectedRegulateur, setSelectedRegulateur] = useState<Regulateur | null>(null);
  const [selectedDevise, setSelectedDevise] = useState<Devise | null>(null);


  const [optionsPays, setOptionsPays] = useState([]);
  const [regulateurOptions, setRegulateurOptions] = useState([]);
  let response: globalThis.Response;
  const handleSearch = (e: any) => {
    e.preventDefault();
    // Effectuez votre recherche ici si nécessaire
  };
  const societeconneted = props.searchParams.societeconneted;


  const handleFundSelect = (selectedOption: any) => {
    setSelectedFund(selectedOption);
  };
  const [formData, setFormData] = useState({
    page: 1,
    nom_fond: '',
    categorie_globale: '',
    societe_gestion: '',
    numero_agrement: '',
    structure_fond: '',
    strategie_politique_invest: '',
    philosophie_fond: '',
    code_ISIN: '',
    nom_gerant: '',
    type_investissement: '',
    description: '',
    date_creation: '',
    pays: '',
    regulateur: '',
    dev_libelle: '',
    fuseauHoraire: '',
    periodicite: '',
    horizonplacement: '',
    date_agrement: '',
    active: 0, // Ajouter les variables supplémentaires du modèle avec leurs valeurs par défaut
    depositaire: '',
    teneur_registre: '',
    valorisateur: '',
    centralisateur: '',
    agent_transfert: '',
    agent_payeur: '',
    montant_premier_vl: '',
    date_premiere_vl: '',
    montant_actif_net: '',
    duree_investissement_recommande: '',
    minimum_investissement: '',
    date_cloture: '',
    heure_cutt_off: '',
    delai_reglement: '',
    classification: '',
    affectation: '',
    souscripteur: '',
    datejour: '',
    frais_gestion: '', // Ajout des frais
    frais_souscription: '',
    frais_entree: '',
    frais_sortie: ''
  });

  const nextPage = () => {
    setFormData({ ...formData, page: formData.page + 1 });
  };

  const prevPage = () => {
    setFormData({ ...formData, page: formData.page - 1 });
  };

  useEffect(() => {
    // Appel à l'API lors du premier rendu du composant
    async function fetchData() {
      try {
        const data2 = await fondscharge(fondId);
        setFund(data2)
        const data = await getpays();
        const mappedOptions = data?.data.paysOptions.map((funds: any) => ({

          value: funds.value,
          label: funds.label, // Replace with the actual property name
          // Replace with the actual property name
        }));
        setOptionsPays(mappedOptions);
        console.log(data.data.paysOptions);
      } catch (error) {
        console.error("Erreur lors de l'appel à l'API :", error);
      }
    }
    fetchData();
  }, []);
  useEffect(() => {
    // Charger le régulateur correspondant lorsque le pays est sélectionné
    if (selectedPays) {
      const fetchRegulateur = async () => {
        try {
          const data = await getregulateur(selectedPays?.value)
          console.log(data?.data);

          let mappedOptions = [];
          if (Array.isArray(data?.data.regulateur)) {
            mappedOptions = data?.data.regulateur.map((funds: any) => ({
              value: funds.value,
              label: funds.label, // Replace with the actual property name
              // Replace with the actual property name
            }));
          } else if (data?.data.regulateur) {
            // Si devises n'est pas un tableau, mais un élément unique
            mappedOptions = [{
              value: data.data.regulateur.value,
              label: data.data.regulateur.label, // Replace with the actual property name
              // Replace with the actual property name
            }];
          }
          setRegulateurOptions(mappedOptions);

          const data1 = await getdevise(selectedPays?.value)

          let mappedOptions1 = [];
          if (Array.isArray(data1?.data.devises)) {
            mappedOptions1 = data1?.data.devises.map((funds: any) => ({
              value: funds.value,
              label: funds.label, // Replace with the actual property name
              // Replace with the actual property name
            }));
          } else if (data1?.data.devises) {
            // Si devises n'est pas un tableau, mais un élément unique
            mappedOptions1 = [{
              value: data1.data.devises.value,
              label: data1.data.devises.label, // Replace with the actual property name
              // Replace with the actual property name
            }];
          }
          setDeviseOptions(mappedOptions1);
        } catch (error) {
          console.error(error);
        }
      };

      fetchRegulateur();
    }
  }, [selectedPays]);
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (selectedPays)
        formData.pays = selectedPays.value;

      if (selectedDevise)
        formData.dev_libelle = selectedDevise?.value;

      if (selectedRegulateur)
        formData.regulateur = selectedRegulateur?.value
      formData.societe_gestion = societeconneted;
      console.log(formData);
      console.log(formData);
      // Envoyer les données du formulaire à l'API
      const response = await fetch(`${urlconstant}/api/updatefondmodif/${fondId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Spécifiez le type de contenu que vous envoyez
        },
        body: JSON.stringify(formData), // Convertissez votre objet formData en JSON
      });
      // Gérer la réponse de l'API (par exemple, afficher un message de succès)
      if (response.status === 200) {
        setIsModalOpen(true);
        Swal.fire({
          position: 'center',
          icon: 'success',
          html: `<p> Données enregistrées.</p>`,
          showConfirmButton: false,
          timer: 5000,
        });

        // Redirect the user to another page after a delay (e.g., 2 seconds)
        setTimeout(() => {
          const href = `/payspanel/fonds?id=${societeconneted}`;

          router.push(href);
        }, 2000);
      }
    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        html: `<p> "Error" </p>`,
        showConfirmButton: false,
        timer: 10000,
      });
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

                {/* <li>
                 On vérifie si l'utilisateur n'est pas connecté on affiche login sinon on affiche le bouton de deconnexion
                  {!userMetadata ? (
                    <a href="/auth/login">Login</a>
                  ) : (
                    <button onClick={logout} className='mt-2'>Deconnexion {currentUserEmail}</button>
                  )}


                </li>
 */}

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
                      <p><span className="text-primary">Creation de fonds</span> | <span className="text-fade"></span></p>

                    </div>

                  </div>
                  <hr />
                  <form onSubmit={handleSubmit}>
                    <div>

                      {formData.page === 1 && (
                        <div>
                          <form>
                            <div className="row">

                              <div className="col-md-6 mx-auto">
                                <label>
                                  Nom du fonds*:                                </label>

                                <input
                                  type="text"
                                  className="form-control"
                                  name="nom_fond"
                                  value={formData.nom_fond || fund.nom_fond}
                                  onChange={(e) => setFormData({ ...formData, nom_fond: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="col-md-6 mx-auto">                                <label>
                                Numero agrement:
                              </label>

                                <input
                                  type="text"
                                  className="form-control"
                                  name="numero_agrement"
                                  value={formData.numero_agrement || fund.numero_agrement}
                                  onChange={(e) => setFormData({ ...formData, numero_agrement: e.target.value })}
                                  required
                                />
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6 mx-auto">                                <label>
                                code ISIN:
                              </label>

                                <input
                                  type="text"
                                  className="form-control"
                                  name="code_ISIN"
                                  value={formData.code_ISIN || fund.code_ISIN}
                                  onChange={(e) => setFormData({ ...formData, code_ISIN: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="col-md-6 mx-auto">                                <label>
                                Nom Du Gerant Du Fonds:
                              </label>

                                <input
                                  type="text"
                                  className="form-control"
                                  name="nom_gerant"
                                  value={formData.nom_gerant || fund.nom_gerant}
                                  onChange={(e) => setFormData({ ...formData, nom_gerant: e.target.value })}
                                  required
                                />
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6 mx-auto">                                <label>
                                date De Creation Du Fonds:
                              </label>

                                <input
                                  type="date"
                                  className="form-control"
                                  name="date_creation"
                                  value={formData.date_creation || fund.date_creation}
                                  onChange={(e) => setFormData({ ...formData, date_creation: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="col-md-6 mx-auto">                                <label>
                                date agrement du fonds:
                              </label>

                                <input
                                  type="date"
                                  className="form-control"
                                  name="date_agrement"
                                  value={formData.date_agrement || fund.date_agrement}
                                  onChange={(e) => setFormData({ ...formData, date_agrement: e.target.value })}
                                  required
                                />
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6 mx-auto">                                <label>
                                Montant premiere VL:
                              </label>

                                <input
                                  type="date"
                                  className="form-control"
                                  name="montant_premier_vl"
                                  value={formData.montant_premier_vl || fund.montant_premier_vl}
                                  onChange={(e) => setFormData({ ...formData, montant_premier_vl: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="col-md-6 mx-auto">                                <label>
                                date publication premiere VL :
                              </label>

                                <input
                                  type="date"
                                  className="form-control"
                                  name="date_premiere_vl"
                                  value={formData.date_premiere_vl || fund.date_premiere_vl}
                                  onChange={(e) => setFormData({ ...formData, date_premiere_vl: e.target.value })}
                                  required
                                />
                              </div>
                            </div>
                            <div className="row">




                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <label>
                                  objectif Investissement:
                                </label>

                                <textarea
                                  className="form-control  h-250"
                                  name="objectifInvestissement"
                                  value={formData.type_investissement || fund.type_investissement}
                                  onChange={(e) => setFormData({ ...formData, type_investissement: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="col-md-6">
                                <label>
                                  Description Du Fonds:
                                </label>

                                <textarea
                                  className="form-control  h-250"
                                  name="descriptionDuFonds"
                                  value={formData.description || fund.description}
                                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                  required
                                />
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <label>
                                  Philosophie du fond:
                                </label>

                                <textarea
                                  className="form-control  h-250"
                                  name="philosophie_fond"
                                  value={formData.philosophie_fond || fund.philosophie_fond}
                                  onChange={(e) => setFormData({ ...formData, philosophie_fond: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="col-md-6">
                                <label>
                                  Strategie et politique d investissement:
                                </label>

                                <textarea
                                  className="form-control  h-250"
                                  name="strategie_politique_invest"
                                  value={formData.strategie_politique_invest || fund.strategie_politique_invest}
                                  onChange={(e) => setFormData({ ...formData, strategie_politique_invest: e.target.value })}
                                  required
                                />
                              </div>
                            </div>


                            {/* Ajoutez les autres champs ici */}
                          </form>
                          <br />
                          <button style={{
                            textDecoration: 'none', // Remove underline
                            backgroundColor: '#6366f1', // Background color
                            color: 'white', // Text color
                            padding: '10px 20px', // Padding
                            borderRadius: '5px', // Rounded corners
                          }} onClick={nextPage}>Suivant</button>
                        </div>
                      )}

                      {formData.page === 2 && (
                        <div>
                          <form>
                            <div className="row">
                              <div className="col-md-6">
                                <label>
                                  pays De Gestion Du Fonds:
                                </label>

                                <Select className="select-component"
                                  options={optionsPays}
                                  value={selectedPays || fund.pays}
                                  onChange={(newValue: SingleValue<string | Pays>, actionMeta) => {
                                    if (typeof newValue === 'string') {
                                      setSelectedPays(null); // Handle case where newValue is a string
                                    } else {
                                      setSelectedPays(newValue); // Handle case where newValue is a Devise object
                                    }
                                  }} placeholder="Sélectionnez un pays"
                                />
                              </div>
                              <div className="col-md-6">
                                <label>
                                  regulateur:
                                </label>

                                <Select className="select-component"
                                  options={regulateurOptions}
                                  value={selectedRegulateur || fund.regulateur}
                                  onChange={(newValue: SingleValue<string | Regulateur>, actionMeta) => {
                                    if (typeof newValue === 'string') {
                                      setSelectedRegulateur(null); // Handle case where newValue is a string
                                    } else {
                                      setSelectedRegulateur(newValue); // Handle case where newValue is a Devise object
                                    }
                                  }}
                                  placeholder="Select a fund"
                                />
                              </div>
                              <div className="col-md-6">
                                <label>
                                  Devise:
                                </label>

                                <Select className="select-component"
                                  options={deviseOptions}
                                  value={selectedDevise || fund.dev_libelle}
                                  onChange={(newValue: SingleValue<string | Devise>, actionMeta) => {
                                    if (typeof newValue === 'string') {
                                      setSelectedDevise(null); // Handle case where newValue is a string
                                    } else {
                                      setSelectedDevise(newValue); // Handle case where newValue is a Devise object
                                    }
                                  }}
                                  placeholder="Select a fund"
                                />
                              </div>

                              <div className="col-md-6">
                                <label>
                                  Minimun investissement:
                                </label>

                                <input
                                  type="text"
                                  className="form-control"
                                  name="montant_actif_net"
                                  value={formData.minimum_investissement || fund.minimum_investissement}
                                  onChange={(e) => setFormData({ ...formData, minimum_investissement: e.target.value })}
                                  required
                                />
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-6">
                                <label>Periodicité de Vl:</label>
                                <select className="form-control" value={formData.periodicite || fund.periodicite} onChange={(e) => setFormData({ ...formData, periodicite: e.target.value })}>
                                  <option value="">Sélectionnez...</option>
                                  <option value="Journaliere">Journaliere</option>
                                  <option value="Hebdomadaire">Hebdomadaire</option>
                                  <option value="Mensuelle">Mensuelle</option>

                                </select>
                              </div>
                              <div className="col-6">
                                <label>Horizon d investissement:</label>
                                <select className="form-control" value={formData.horizonplacement || fund.horizonplacement} onChange={(e) => setFormData({ ...formData, horizonplacement: e.target.value })}>
                                  <option value="">Sélectionnez...</option>
                                  <option value="MOINS D UN AN">Moins d un an</option>
                                  <option value="Au moins 2 ans">Au moins 2 ans</option>
                                  <option value="Au moins 3 ans">Au moins 3 ans</option>
                                  <option value="Au moins 5 ans">Au moins 5 ans</option>
                                  <option value="Au moins 8 ans">Au moins 8 ans</option>
                                  <option value="Au moins 10 ans">Au moins 10 ans</option>
                                </select>
                              </div>
                              <div className="col-6">
                                <label>Date de cloture annuelle:</label>
                                <select className="form-control" value={formData.date_cloture || fund.date_cloture} onChange={(e) => setFormData({ ...formData, horizonplacement: e.target.value })}>
                                  <option value="">Sélectionnez...</option>
                                  <option value="MOINS D UN AN">Moins d un an</option>
                                  <option value="Au moins 2 ans">Au moins 2 ans</option>
                                  <option value="Au moins 3 ans">Au moins 3 ans</option>
                                  <option value="Au moins 5 ans">Au moins 5 ans</option>
                                  <option value="Au moins 8 ans">Au moins 8 ans</option>
                                  <option value="Au moins 10 ans">Au moins 10 ans</option>
                                </select>
                              </div>
                              <div className="col-md-6">
                                <label>
                                  montant De L Actif Net Initial:
                                </label>

                                <input
                                  type="text"
                                  className="form-control"
                                  name="montant_actif_net"
                                  value={formData.montant_actif_net || fund.montant_actif_net}
                                  onChange={(e) => setFormData({ ...formData, montant_actif_net: e.target.value })}
                                  required
                                />
                              </div>


                            </div>

                            <div className="row">
                              <div className="col-6">
                                <label>Classification type de placement:</label>
                                <select className="form-control" value={formData.classification || fund.classification} onChange={(e) => setFormData({ ...formData, classification: e.target.value })}>
                                  <option value="">Sélectionnez...</option>
                                  {optionsClassification.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="col-6">
                                <label>Structure du fond:</label>
                                <select className="form-control" value={formData.structure_fond || fund.structure_fond} onChange={(e) => setFormData({ ...formData, structure_fond: e.target.value })}>
                                  <option value="">Sélectionnez...</option>
                                  {optionsStructure.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="col-md-6">
                                <label>
                                  Delai reglement livraison
                                </label>

                                <input
                                  type="text"
                                  className="form-control"
                                  name="delai_reglement"
                                  value={formData.delai_reglement || fund.delai_reglement}
                                  onChange={(e) => setFormData({ ...formData, delai_reglement: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="col-md-6">
                                <label>
                                  Heure cuff off
                                </label>

                                <input
                                  type="text"
                                  className="form-control"
                                  name="heure_cutt_off"
                                  value={formData.heure_cutt_off || fund.heure_cutt_off}
                                  onChange={(e) => setFormData({ ...formData, heure_cutt_off: e.target.value })}
                                  required
                                />
                              </div>


                            </div>

                            <div className="row">
                              <div className="col-6">
                                <label>Classe actif:</label>
                                <select className="form-control" value={formData.categorie_globale || fund.categorie_globale} onChange={(e) => setFormData({ ...formData, categorie_globale: e.target.value })}>
                                  <option value="">Sélectionnez...</option>
                                  {optionsCategorie.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="col-6">
                                <label>Type de souscripteur autorisé:</label>
                                <select className="form-control" value={formData.souscripteur || fund.souscripteur} onChange={(e) => setFormData({ ...formData, souscripteur: e.target.value })}>
                                  <option value="">Sélectionnez...</option>
                                  <option value="Particuliers">Particuliers</option>
                                  <option value="Investisseurs Professionnels / Institutionnels">Investisseurs Professionnels / Institutionnels</option>
                                  <option value="Toutes catégories d investisseurs">Toutes catégories d investisseurs</option>
                                  <option value="Au moins 5 ans">Autres</option>

                                </select>
                              </div>
                              <div className="col-6">
                                <label>Affectation des dividendes:</label>
                                <select className="form-control" value={formData.affectation || fund.affectation} onChange={(e) => setFormData({ ...formData, affectation: e.target.value })}>
                                  <option value="">Sélectionnez...</option>
                                  <option value="Distribution">Distribution</option>
                                  <option value="Capitalisation">Capitalisation</option>
                                  <option value="Autres">Autres</option>

                                </select>
                              </div>
                              <div className="col-md-6">
                                <label>
                                  Depositaire
                                </label>

                                <input
                                  type="text"
                                  className="form-control"
                                  name="depositaire"
                                  value={formData.depositaire || fund.depositaire}
                                  onChange={(e) => setFormData({ ...formData, depositaire: e.target.value })}
                                  required
                                />
                              </div>


                            </div>

                            <div className="row">
                              <div className="col-md-6">
                                <label>
                                  Agent tansfert

                                </label>

                                <input
                                  type="text"
                                  className="form-control"
                                  name="agent_transfert"
                                  value={formData.agent_transfert || fund.agent_transfert}
                                  onChange={(e) => setFormData({ ...formData, agent_transfert: e.target.value })}
                                  required
                                />
                              </div>

                              <div className="col-md-6">
                                <label>
                                  Centralisateur

                                </label>

                                <input
                                  type="text"
                                  className="form-control"
                                  name="centralisateur"
                                  value={formData.centralisateur || fund.centralisateur}
                                  onChange={(e) => setFormData({ ...formData, centralisateur: e.target.value })}
                                  required
                                />
                              </div>

                              <div className="col-md-6">
                                <label>
                                  Valorisateur

                                </label>

                                <input
                                  type="text"
                                  className="form-control"
                                  name="valorisateur"
                                  value={formData.valorisateur || fund.valorisateur}
                                  onChange={(e) => setFormData({ ...formData, valorisateur: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="col-md-6">
                                <label>
                                  Teneur registre

                                </label>

                                <input
                                  type="text"
                                  className="form-control"
                                  name="montantDeLActifNetInitial"
                                  value={formData.teneur_registre || fund.teneur_registre}
                                  onChange={(e) => setFormData({ ...formData, teneur_registre: e.target.value })}
                                  required
                                />
                              </div>


                            </div>

                            <div className="row">
                              <div className="col-md-6">
                                <label>
                                  Agent payeur

                                </label>

                                <input
                                  type="text"
                                  className="form-control"
                                  name="agent_payeur"
                                  value={formData.agent_payeur || fund.agent_payeur}
                                  onChange={(e) => setFormData({ ...formData, agent_payeur: e.target.value })}
                                  required
                                />
                              </div>

                              <div className="col-md-6">
                                <label>
                                  Frais de gestion

                                </label>

                                <input
                                  type="text"
                                  className="form-control"
                                  name="frais_gestion"
                                  value={formData.frais_gestion || fund.frais_gestion}
                                  onChange={(e) => setFormData({ ...formData, frais_gestion: e.target.value })}
                                  required
                                />
                              </div>

                              <div className="col-md-6">
                                <label>
                                  Frais d entrée

                                </label>

                                <input
                                  type="text"
                                  className="form-control"
                                  name="frais_entree"
                                  value={formData.frais_entree || fund.frais_entree}
                                  onChange={(e) => setFormData({ ...formData, frais_entree: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="col-md-6">
                                <label>
                                  Frais de sortie

                                </label>

                                <input
                                  type="text"
                                  className="form-control"
                                  name="frais_sortie"
                                  value={formData.frais_sortie || fund.frais_sortie}
                                  onChange={(e) => setFormData({ ...formData, frais_sortie: e.target.value })}
                                  required
                                />
                              </div>


                            </div>
                            {/* Ajoutez les autres champs ici */}
                          </form>
                          <br />
                          <button style={{
                            textDecoration: 'none', // Remove underline
                            backgroundColor: 'red', // Background color
                            color: 'white', // Text color
                            padding: '10px 20px', // Padding
                            borderRadius: '5px', // Rounded corners
                          }} onClick={prevPage}>Précédent</button>
                          &nbsp;
                          <button className="text-right" style={{
                            textDecoration: 'none', // Remove underline
                            backgroundColor: '#6366f1', // Background color
                            color: 'white', // Text color
                            padding: '10px 20px', // Padding
                            borderRadius: '5px', // Rounded corners
                          }} type="submit">Enregistrer</button>

                        </div>
                      )}

                      {/* Ajoutez les autres pages ici */}
                    </div>

                  </form>

                </div>
              </div>
            </div>
          </section >
        </div >
      </div >
    </Fragment >
  );
}