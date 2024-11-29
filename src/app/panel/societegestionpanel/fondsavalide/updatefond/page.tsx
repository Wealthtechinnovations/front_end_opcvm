"use client";
import { urlconstant } from "@/app/constants";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import Select, { SingleValue } from 'react-select';


//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
//import { router } from 'next/router';
import Headermenu from '../../../../Headermenu';
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Sidebar from "@/app/sidebar";

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
  label: string;
}
interface Regulateur {
  value: string; // ou un type spécifique pour les éléments du tableau 'funds'
  label: string;

}
interface Devise {
  value: string; // ou un type spécifique pour les éléments du tableau 'funds'
  label: string;

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
  frais_sortie: string;
  IBAN: string;
  RIB: string;
  banque: string;
  nombre_part: string;
  indice_benchmark: string;
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
    frais_sortie: '',
    IBAN: '',
    RIB: '',
    banque: '',
    nombre_part: '',
    indice_benchmark: '',
  });
  
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
    frais_sortie: '',
    IBAN: '',
    RIB: '',
    banque: '',
    nombre_part: '',
    indice_benchmark: '',
  });
  const structureOptions: Record<string, string[]> = {
    OPCVM: [
      "SICAV",
      "FCP",
      "MUTUAL FUNDS",
      "COLLECTIVE INVESTMENT SCHEME",
      "PENSION FUNDS"
    ],
    PRIVATE_EQUITY: [
      "(FCPR) FONDS COMMUNS DE PLACEMENT A RISQUES",
      "(FCPI) FONDS COMMUNS DE PLACEMENT DANS L'INNOVATION",
      "(FIP) FONDS D'INVESTISSEMENT DE PROXIMITE",
      "AUTRES FONDS DE CAPITAL INVESTISSEMENT",
      "(FPCI) FONDS PROFESSIONNELS DE CAPITAL INVESTISSEMENT"
    ],
    FONDS_IMMOBILIER_REITS: [
      "(SPPICCV) SOCIETES DE PLACEMENT A PREPONDERANCE IMMOBILIERE A CAPITAL VARIABLE",
      "(FCPI) FONDS COMMUN DE PLACEMENT IMMOBILIER",
      "(OPCI) ORGANISMES DE PLACEMENT COLLECTIF IMMOBILIER",
      "(SCPI) SOCIETES CIVILES DE PLACEMENT IMMOBILIER",
      "(OPPCI) ORGANISMES PROFESSIONNELS DE PLACEMENT COLLECTIF IMMOBILIER"
    ],
    FONDS_PROFESSIONNEL_SPECIALISE__FPS: [
      "(SIPS) SOCIETE D'INVESTISSEMENT PROFESSIONNELLE SPECIALISEE",
      "(FIPS) FONDS D'INVESTISSEMENT PROFESSIONNEL SPECIALISE",
      "(SLP) SOCIETE DE LIBRE PARTENARIAT",
      "AUTRES FONDS PROFESSIONNEL SPECIALISE (FPS)"
    ],
    FONDS_D_EPARGNE_SALARIALE: [
      "(FCPE) FONDS COMMUNS DE PLACEMENT D'ENTREPRISE",
      "(SICAVAS) SOCIETES D'INVESTISSEMENT A CAPITAL VARIABLE D'ACTIONNARIAT SALARIE",
      "AUTRES FONDS D'EPARGNE SALARIALE"
    ],
    FONDS_DE_FINANCEMENT_ET_TITRISATION: [
      "(FCT) FONDS COMMUN DE TITRISATION",
      "(FFS) FONDS DE FINANCEMENT SPECIALISE",
      "AUTRES FONDS ET ORGANISMES DE FINANCEMENT",
      "(FPCT) FONDS DE PLACEMENT COLLECTIFS EN TITRISATION"
    ],
    ETF: [
      "TRACKER SYNTHETIQUE",
      "TRACKER PHYSIQUE",
    ],
    HEDGE_FUNDS: [
      "FONDS SPECULATIFS",
    ],
    FONDS_DEDIE: [
      "FONDS DEDIE",
    ],
  };

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
        console.log(data2)
        setFund(data2)
        if (data2 && data2.dev_libelle) {
          setSelectedDevise({ value: data2.dev_libelle, label: data2.dev_libelle });
        }
        if (data2 && data2.pays) {
          setSelectedPays({ value: data2.pays, label: data2.pays });
        }
        if (data2 && data2.regulateur) {
          setSelectedRegulateur({ value: data2.regulateur, label: data2.regulateur });
        }
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
        Swal.fire({
          position: 'center',
          icon: 'success',
          html: `<p> Données enregistrées.</p>`,
          showConfirmButton: false,
          timer: 5000,
        });

        setIsModalOpen(true);

        // Redirect the user to another page after a delay (e.g., 2 seconds)
        setTimeout(() => {
          const href = `/panel/societegestionpanel/fondsavalide?id=${societeconneted}`;

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
  console.log(fund)
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
              <div className="col-xl-12 col-lg-12 mb-4">
                <div className="card text-center shadow-lg border-0 rounded-lg overflow-hidden">
                  <div className="card-body bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-500 text-white">
                    <img src="/images/avatar/avatar-13.png" className="bg-light rounded-circle avatar-lg img-thumbnail border-4 border-white mb-3" alt="profile-image" />
                    <h4 className="mb-0 mt-2">{societeconneted}</h4>
                    <h2 className="mb-0 mt-2">{fund?.nom_fond}</h2>



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
                            <p><span className="text-primary">Modification de fonds</span> | <span className="text-fade"></span></p>

                          </div>

                        </div>
                        <hr />
                        <form onSubmit={handleSubmit}>
                          <div>

                            {formData.page === 1 && (
                              <div>
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
                                      value={formData.numero_agrement|| fund.numero_agrement}
                                      onChange={(e) => setFormData({ ...formData, numero_agrement: e.target.value })}
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="col-md-12 mx-auto">                                <label>
                                  Indice Benchmark:
                                </label>

                                  <input
                                    type="text"
                                    className="form-control"
                                    name="indice_benchmark"
                                    value={formData.indice_benchmark || fund.indice_benchmark}
                                    onChange={(e) => setFormData({ ...formData, indice_benchmark: e.target.value })}
                                    required
                                  />
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
                                    Nom de la banque:
                                  </label>

                                    <input
                                      type="text"
                                      className="form-control"
                                      name="banque"
                                      value={formData.banque || fund.banque}
                                      onChange={(e) => setFormData({ ...formData, banque: e.target.value })}
                                      required
                                    />
                                  </div>
                                  <div className="col-md-6 mx-auto">                                <label>
                                    Nombre de part:
                                  </label>

                                    <input
                                      type="number"
                                      className="form-control"
                                      name="nombre_part"
                                      value={formData.nombre_part || fund.nombre_part}
                                      onChange={(e) => setFormData({ ...formData, nombre_part: e.target.value })}
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-md-6 mx-auto">                                <label>
                                    IBAN:
                                  </label>

                                    <input
                                      type="text"
                                      className="form-control"
                                      name="IBAN"
                                      value={formData.IBAN || fund.IBAN}
                                      onChange={(e) => setFormData({ ...formData, IBAN: e.target.value })}
                                      required
                                    />
                                  </div>
                                  <div className="col-md-6 mx-auto">                                <label>
                                    RIB:
                                  </label>

                                    <input
                                      type="text"
                                      className="form-control"
                                      name="RIB"
                                      value={formData.RIB || fund.RIB}
                                      onChange={(e) => setFormData({ ...formData, RIB: e.target.value })}
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
                                      name="type_investissement"
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
                                      name="description"
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
                                <div className="row">
                                  <div className="col-md-6">
                                    <label>
                                      pays De Gestion Du Fonds:
                                    </label>

                                    <Select className="select-component"
                                      options={optionsPays}
                                      value={selectedPays}
                                      onChange={setSelectedPays}
                                      placeholder="Sélectionnez un pays"
                                    />
                                  </div>
                                  <div className="col-md-6">
                                    <label>
                                      regulateur:
                                    </label>

                                    <Select className="select-component"
                                      options={regulateurOptions}
                                      value={selectedRegulateur}
                                      onChange={setSelectedRegulateur}
                                      placeholder="Select a fund"
                                    />
                                  </div>
                                  <div className="col-md-6">
                                    <label>
                                      Devise:
                                    </label>

                                    <Select className="select-component"
                                      options={deviseOptions}
                                      value={selectedDevise}
                                      onChange={setSelectedDevise}
                                      placeholder="Select a fund"
                                    />
                                  </div>

                                  <div className="col-md-6">
                                    <label>
                                      Minimun investissement:
                                    </label>

                                    <input
                                      type="number"
                                      step="0.01"
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
                                      <option value="QUOTIDIENNE">QUOTIDIENNE</option>
                                      <option value="HEBDOMADAIRE">HEBDOMADAIRE</option>
                                      <option value="MENSUELLE">MENSUELLE</option>

                                    </select>
                                  </div>
                                  <div className="col-6">
                                    <label>Horizon d investissement:</label>
                                    <select className="form-control" value={formData.horizonplacement || fund.horizonplacement} onChange={(e) => setFormData({ ...formData, horizonplacement: e.target.value })}>
                                      <option value="">Sélectionnez...</option>
                                      <option value="MOINS D UN AN">MOINS D UN AN</option>
                                      <option value="AU MOINS 2 ANS">AU MOINS 2 ANS</option>
                                      <option value="AU MOINS 3 ANS">AU MOINS 3 ANS</option>
                                      <option value="AU MOINS 5 ANS">AU MOINS 5 ANS</option>
                                      <option value="AU MOINS 8 ANS">AU MOINS 8 ANS</option>
                                      <option value="AU MOINS 10 ANS">AU MOINS 10 ANS</option>
                                    </select>
                                  </div>
                                  <div className="col-6">
                                    <label>Date de cloture annuelle:</label>
                                    <select className="form-control" value={formData.date_cloture || fund.date_cloture} onChange={(e) => setFormData({ ...formData, date_cloture: e.target.value })}>
                                      <option value="">Sélectionnez...</option>
                                      <option value="MOINS D UN AN">MOINS D UN AN</option>
                                      <option value="AU MOINS 2 ANS">AU MOINS 2 ANS</option>
                                      <option value="AU MOINS 3 ANS">AU MOINS 3 ANS</option>
                                      <option value="AU MOINS 5 ANS">AU MOINS 5 ANS</option>
                                      <option value="AU MOINS 8 ANS">AU MOINS 8 ANS</option>
                                      <option value="AU MOINS 10 ANS">AU MOINS 10 ANS</option>
                                    </select>
                                  </div>
                                  <div className="col-md-6">
                                    <label>
                                      montant De L Actif Net Initial:
                                    </label>

                                    <input
                                      type="number"
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
                                      {Object.keys(structureOptions).map(option => (
                                        <option key={option} value={option}>{option}</option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="col-6">
                                    <label>Structure du fond:</label>
                                    <select className="form-control" value={formData.structure_fond || fund.structure_fond} onChange={(e) => setFormData({ ...formData, structure_fond: e.target.value })}>
                                      <option value="">Sélectionnez...</option>
                                      {formData.classification && structureOptions[formData.classification]
                                        .filter((structure) => typeof structure === 'string') // Filtrer pour garder uniquement les chaînes
                                        .map((structure) => (
                                          <option key={`structure-${structure}`} value={structure}>{structure}</option>
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
                                      <option value="PARTICULIERS">PARTICULIERS</option>
                                      <option value="INVESTISSEURS PROFESSIONNELS / INSTITUTIONNELS">INVESTISSEURS PROFESSIONNELS / INSTITUTIONNELS</option>
                                      <option value="TOUTES CATÉGORIES D'INVESTISSEURS">TOUTES CATÉGORIES D INVESTISSEURS</option>
                                      <option value="AUTRES">AUTRES</option>

                                    </select>
                                  </div>
                                  <div className="col-6">
                                    <label>Affectation des dividendes:</label>
                                    <select className="form-control" value={formData.affectation || fund.affectation} onChange={(e) => setFormData({ ...formData, affectation: e.target.value })}>
                                      <option value="">Sélectionnez...</option>
                                      <option value="DISTRIBUTION">DISTRIBUTION</option>
                                      <option value="CAPITALISATION">CAPITALISATION</option>
                                      <option value="AUTRES">AUTRES</option>

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
                                      type="number"
                                      step="0.01"
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
                                      type="number"
                                      step="0.01"
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
                                      type="number"
                                      step="0.01" className="form-control"
                                      name="frais_sortie"
                                      value={formData.frais_sortie || fund.frais_sortie}
                                      onChange={(e) => setFormData({ ...formData, frais_sortie: e.target.value })}
                                      required
                                    />
                                  </div>


                                </div>
                                <div className="row">
                                  <div className="col-6">
                                    <label>Duree investissement recommandée:</label>
                                    <select className="form-control" value={formData.duree_investissement_recommande || fund.duree_investissement_recommande} onChange={(e) => setFormData({ ...formData, duree_investissement_recommande: e.target.value })}>
                                      <option value="">Sélectionnez...</option>
                                      <option value="MOINS D UN AN">MOINS D UN AN</option>
                                      <option value="AU MOINS 2 ANS">AU MOINS 2 ANS</option>
                                      <option value="AU MOINS 3 ANS">AU MOINS 3 ANS</option>
                                      <option value="AU MOINS 5 ANS">AU MOINS 5 ANS</option>
                                      <option value="AU MOINS 8 ANS">AU MOINS 8 ANS</option>
                                      <option value="AU MOINS 10 ANS">AU MOINS 10 ANS</option>
                                    </select>
                                  </div>
                                  <div className="col-md-6">
                                    <label>
                                      Frais de souscription

                                    </label>

                                    <input
                                      type="number"
                                      step="0.01" className="form-control"
                                      name="frais_souscription"
                                      value={formData.frais_souscription || fund.frais_souscription}
                                      onChange={(e) => setFormData({ ...formData, frais_souscription: e.target.value })}
                                      required
                                    />
                                  </div>

                                </div>
                                {/* Ajoutez les autres champs ici */}
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
            </div >
          </section >
        </div >
      </div >
      </div >
      </div >
      
    </Fragment >
  );
}