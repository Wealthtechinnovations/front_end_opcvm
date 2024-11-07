"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { Modal, Button } from 'react-bootstrap'; // Assurez-vous d'importer les composants de Bootstrap nécessaires
import { DropdownButton, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

import Select, { SingleValue } from 'react-select';
//import * as XLSX from 'xlsx';
import Header from '../../Header';
import { urlconstant } from '../../constants';
interface Option {
  value: string;
  // Autres propriétés si nécessaire
}
interface Societe {
  value: any[]; // ou un type spécifique pour les éléments du tableau 'funds'
  label: any[]; // ou un type spécifique pour les éléments du tableau 'funds'

}
interface Devise {
  value: any[]; // ou un type spécifique pour les éléments du tableau 'funds'
  label: any[]; // ou un type spécifique pour les éléments du tableau 'funds'

}
const options = [
  { value: 1, label: 'Option 1' },
  { value: 2, label: 'Option 2' },
  { value: 3, label: 'Option 3' },
  // Ajoutez plus d'options au besoin
];
interface Funds {
  data: {
    funds: any[]; // ou un type spécifique pour les éléments du tableau 'funds'
  };
}
async function getsociete() {
  const data = (
    await fetch(`${urlconstant}/api/getSocietes`)
  ).json();
  return data;
}
async function getdevise() {
  const data = (
    await fetch(`${urlconstant}/api/getDevises`)
  ).json();
  return data;
}
const optionsCategorie = [
  { value: "OBLIGATIONS", label: 'OBLIGATIONS' },
  { value: "ACTIONS", label: 'ACTIONS' },
  { value: "DIVERSIFIE", label: 'DIVERSIFIE' },
  { value: "MONETAIRE", label: 'MONETAIRE' },
  { value: "ETF", label: 'ETF' },
  { value: "INFRASTRUCTURE", label: 'INFRASTRUCTURE' },
  { value: "IMMOBILIER", label: 'IMMOBILIER' },
  { value: "PRIVATE EQUITY", label: 'PRIVATE EQUITY' },
  { value: "ALTERNATIF", label: 'ALTERNATIF' },
  { value: "AUTRES", label: 'AUTRES' },


];

const optionsCategorienationale = [
  { value: "OBLIGATIONS MAROC", label: 'OBLIGATIONS MAROC', country: 'MAROC' },
  { value: "ACTIONS MAROC", label: 'ACTIONS MAROC', country: 'MAROC' },
  { value: "DIVERSIFIE MAROC", label: 'DIVERSIFIE MAROC', country: 'MAROC' },
  { value: "MONETAIRE MAROC", label: 'MONETAIRE MAROC', country: 'MAROC' },
  { value: "ETF MAROC", label: 'ETF MAROC', country: 'MAROC' },
  { value: "INFRASTRUCTURE MAROC", label: 'INFRASTRUCTURE MAROC', country: 'MAROC' },
  { value: "IMMOBILIER MAROC", label: 'IMMOBILIER MAROC', country: 'MAROC' },
  { value: "PRIVATE EQUITY MAROC", label: 'PRIVATE EQUITY MAROC', country: 'MAROC' },
  { value: "ALTERNATIF MAROC", label: 'ALTERNATIF MAROC', country: 'MAROC' },
  { value: "AUTRES MAROC", label: 'AUTRES MAROC', country: 'MAROC' },

  { value: "OBLIGATIONS TUNISIE", label: 'OBLIGATIONS TUNISIE', country: 'TUNISIE' },
  { value: "ACTIONS TUNISIE", label: 'ACTIONS TUNISIE', country: 'TUNISIE' },
  { value: "DIVERSIFIE TUNISIE", label: 'DIVERSIFIE TUNISIE', country: 'TUNISIE' },
  { value: "MONETAIRE TUNISIE", label: 'MONETAIRE TUNISIE', country: 'TUNISIE' },
  { value: "ETF TUNISIE", label: 'ETF TUNISIE', country: 'TUNISIE' },
  { value: "INFRASTRUCTURE TUNISIE", label: 'INFRASTRUCTURE TUNISIE', country: 'TUNISIE' },
  { value: "IMMOBILIER TUNISIE", label: 'IMMOBILIER TUNISIE', country: 'TUNISIE' },
  { value: "PRIVATE EQUITY TUNISIE", label: 'PRIVATE EQUITY TUNISIE', country: 'TUNISIE' },
  { value: "ALTERNATIF TUNISIE", label: 'ALTERNATIF TUNISIE', country: 'TUNISIE' },
  { value: "AUTRES TUNISIE", label: 'AUTRES TUNISIE', country: 'TUNISIE' },

  // Ajoutez plus d'options au besoin
];

const optionsCategorieregionale = [
  { value: "OBLIGATIONS AFRIQUE DU NORD", label: 'OBLIGATIONS AFRIQUE DU NORD', country: 'AFRIQUE DU NORD' },
  { value: "ACTIONS AFRIQUE DU NORD", label: 'ACTIONS AFRIQUE DU NORD', country: 'AFRIQUE DU NORD' },
  { value: "DIVERSIFIE AFRIQUE DU NORD", label: 'DIVERSIFIE AFRIQUE DU NORD', country: 'AFRIQUE DU NORD' },
  { value: "MONETAIRE AFRIQUE DU NORD", label: 'MONETAIRE AFRIQUE DU NORD', country: 'AFRIQUE DU NORD' },
  { value: "ETF AFRIQUE DU NORD", label: 'ETF AFRIQUE DU NORD', country: 'AFRIQUE DU NORD' },
  { value: "INFRASTRUCTURE AFRIQUE DU NORD", label: 'INFRASTRUCTURE AFRIQUE DU NORD', country: 'AFRIQUE DU NORD' },
  { value: "IMMOBILIER AFRIQUE DU NORD", label: 'IMMOBILIER AFRIQUE DU NORD', country: 'AFRIQUE DU NORD' },
  { value: "PRIVATE EQUITY AFRIQUE DU NORD", label: 'PRIVATE EQUITY AFRIQUE DU NORD', country: 'AFRIQUE DU NORD' },
  { value: "ALTERNATIF AFRIQUE DU NORD", label: 'ALTERNATIF AFRIQUE DU NORD', country: 'AFRIQUE DU NORD' },
  { value: "AUTRES AFRIQUE DU NORD", label: 'AUTRES AFRIQUE DU NORD', country: 'AFRIQUE DU NORD' },

  { value: "OBLIGATIONS AFRIQUE CENTRALE", label: 'OBLIGATIONS AFRIQUE CENTRALE', country: 'AFRIQUE CENTRALE' },
  { value: "ACTIONS AFRIQUE CENTRALE", label: 'ACTIONS AFRIQUE CENTRALE', country: 'AFRIQUE CENTRALE' },
  { value: "DIVERSIFIE AFRIQUE CENTRALE", label: 'DIVERSIFIE AFRIQUE CENTRALE', country: 'AFRIQUE CENTRALE' },
  { value: "MONETAIRE AFRIQUE CENTRALE", label: 'MONETAIRE AFRIQUE CENTRALE', country: 'AFRIQUE CENTRALE' },
  { value: "ETF AFRIQUE CENTRALE", label: 'ETF AFRIQUE CENTRALE', country: 'AFRIQUE CENTRALE' },
  { value: "INFRASTRUCTURE AFRIQUE CENTRALE", label: 'INFRASTRUCTURE AFRIQUE CENTRALE', country: 'AFRIQUE CENTRALE' },
  { value: "IMMOBILIER AFRIQUE CENTRALE", label: 'IMMOBILIER AFRIQUE CENTRALE', country: 'AFRIQUE CENTRALE' },
  { value: "PRIVATE EQUITY AFRIQUE CENTRALE", label: 'PRIVATE EQUITY AFRIQUE CENTRALE', country: 'AFRIQUE CENTRALE' },
  { value: "ALTERNATIF AFRIQUE CENTRALE", label: 'ALTERNATIF AFRIQUE CENTRALE', country: 'AFRIQUE CENTRALE' },
  { value: "AUTRES AFRIQUE CENTRALE", label: 'AUTRES AFRIQUE CENTRALE', country: 'AFRIQUE CENTRALE' },

  // Ajoutez plus d'options au besoin
];


const optionsSociete = [
  { value: "WINEO GESTION", label: 'WINEO GESTION' },
  { value: "WAFA GESTION", label: 'WAFA GESTION' },
  { value: "TWIN CAPITAL GESTION", label: 'TWIN CAPITAL GESTION' },
  { value: "CFG GESTION", label: 'CFG GESTION' }

  // Ajoutez plus d'options au besoin
];

interface FormData {
  Sharpe?: {
    periode: string; // ou le type approprié
    operation: string; // ou le type approprié
    value: string; // ou le type approprié
  },
  Trackingerror?: {
    periode: string; // ou le type approprié
    operation: string; // ou le type approprié
    value: string; // ou le type approprié
  },
  Dsr?: {
    periode: string; // ou le type approprié
    operation: string; // ou le type approprié
    value: string; // ou le type approprié
  },
  Kurtosis?: {
    periode: string; // ou le type approprié
    operation: string; // ou le type approprié
    value: string; // ou le type approprié
  },
  Omega?: {
    periode: string; // ou le type approprié
    operation: string; // ou le type approprié
    value: string; // ou le type approprié
  },
  Upcapture?: {
    periode: string; // ou le type approprié
    operation: string; // ou le type approprié
    value: string; // ou le type approprié
  },
  Downcapture?: {
    periode: string; // ou le type approprié
    operation: string; // ou le type approprié
    value: string; // ou le type approprié
  },
  Sortino?: {
    periode: string; // ou le type approprié
    operation: string; // ou le type approprié
    value: string; // ou le type approprié
  },
  Betahaussier?: {
    periode: string; // ou le type approprié
    operation: string; // ou le type approprié
    value: string; // ou le type approprié
  },
  Betabaissier?: {
    periode: string; // ou le type approprié
    operation: string; // ou le type approprié
    value: string; // ou le type approprié
  },
  Skewness?: {
    periode: string; // ou le type approprié
    operation: string; // ou le type approprié
    value: string; // ou le type approprié
  },
  Beta?: {
    periode: string; // ou le type approprié
    operation: string; // ou le type approprié
    value: string; // ou le type approprié
  },
  Fraiscourant?: {
    operation: string; // ou le type approprié
    value: string; // ou le type approprié
  },
  PerfAnnu?: {
    periode: string; // ou le type approprié
    operation: string; // ou le type approprié
    value: string; // ou le type approprié
  },
  PerfCummul?: {
    periode: string; // ou le type approprié
    operation: string; // ou le type approprié
    value: string; // ou le type approprié
  },
  Pertemax?: {
    periode: string; // ou le type approprié
    operation: string; // ou le type approprié
    value: string; // ou le type approprié
  },
  Ratioinf?: {
    periode: string; // ou le type approprié
    operation: string; // ou le type approprié
    value: string; // ou le type approprié
  },
  Fraisrachat?: {
    operation: string; // ou le type approprié
    value: string; // ou le type approprié
  },
  Fraissous?: {
    operation: string; // ou le type approprié
    value: string; // ou le type approprié
  },
  Calamar?: {
    periode: string; // ou le type approprié
    operation: string; // ou le type approprié
    value: string; // ou le type approprié
  },
  Actifnet?: {
    operation: string; // ou le type approprié
    value: string; // ou le type approprié
  },
  Var99?: {
    periode: string; // ou le type approprié
    operation: string; // ou le type approprié
    value: string; // ou le type approprié
  },
  Var95?: {
    periode: string; // ou le type approprié
    operation: string; // ou le type approprié
    value: string; // ou le type approprié
  },
  Fraisgestion?: {
    operation: string; // ou le type approprié
    value: string; // ou le type approprié
  },
  societe?: {
    value: Option; // ou le type approprié
  },
  categorie?: {
    value: Option; // ou le type approprié
  },
  Typeinvest?: {

    value: string; // ou le type approprié
  },
  Freqvaloris?: {

    value: string; // ou le type approprié
  },
  Mininvest?: {
    operation: string; // ou le type approprié
    value: string; // ou le type approprié
  },
  Devise?: {

    value: string; // ou le type approprié
  },
  Volatilite?: {
    periode: string; // ou le type approprié
    operation: string; // ou le type approprié
    value: string; // ou le type approprié
  };
};

async function getlastvl1() {
  const data = (
    await fetch(`${urlconstant}/api/searchFunds`)
  ).json();
  return data;
}
export default function Recherche() {
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, settotalPages] = useState(1);
  const headers = {
    tabAccueil: [
      { label: 'Nom du fonds', key: 'nom_fond' },
      { label: 'Categorie', key: 'categorie_globale' },
      { label: 'Devise', key: 'dev_libelle' },
      { label: 'Categorie_nationale', key: 'categorie_national' },
      { label: 'YTD', key: 'ytd' },
      { label: 'Perf Glissante 1A', key: 'perf1an' },
      { label: 'Perf Glissante 3A', key: 'perf3ans' },
      { label: 'Date', key: 'datejour' },
    ],
    tabPerfCT: [
      { label: 'Nom du fonds', key: 'nom_fond' },
      { label: 'Categorie', key: 'categorie_globale' },
      { label: 'Devise', key: 'dev_libelle' },
      { label: 'YTD', key: 'ytd' },
      { label: 'Perf Glissante 4S', key: 'perf4s' },
      { label: 'Perf Glissante 3M', key: 'perf3m' },
      { label: 'Perf Glissante 6M', key: 'perf6m' },

      { label: 'Date', key: 'datejour' },],
    tabPerfMTLT: [
      { label: 'Nom du fonds', key: 'nom_fond' },
      { label: 'Devise', key: 'dev_libelle' },
      { label: 'Perf Glissante 1A', key: 'perf1an' },
      { label: 'Perf Glissante 3A', key: 'perf3ans' },
      { label: 'Perf Glissante 5A', key: 'perf5ans' },
      { label: 'Date', key: 'datejour' },],
    tabPerfRatios1a: [
      { label: 'Nom du fonds', key: 'nom_fond' },
      { label: 'Perf annualise', key: 'perfannu1an' },
      { label: 'Volatilité', key: 'volatility1an' },
      { label: 'Sharpe', key: 'ratiosharpe1an' },
      { label: 'Perte Max', key: 'pertemax1an' },
      { label: 'Sortino', key: 'sortino1an' },
      { label: 'Ratio info', key: 'info1an' },
      { label: 'Date', key: 'datejour' },],
    tabPerfRatios3a: [
      { label: 'Nom du fonds', key: 'nom_fond' },
      { label: 'Perf annualise', key: 'perfannu3an' },
      { label: 'Volatilité', key: 'volatility3an' },
      { label: 'Sharpe', key: 'ratiosharpe3an' },
      { label: 'Perte Max', key: 'pertemax3an' },
      { label: 'Sortino', key: 'sortino3an' },
      { label: 'Ratio info', key: 'info3an' },
      { label: 'Date', key: 'datejour' },],
    tabPerfRatios5a: [{ label: 'Nom du fonds', key: 'nom_fond' },
    { label: 'Perf annualise', key: 'perfannu5an' },
    { label: 'Volatilité', key: 'volatility5an' },
    { label: 'Sharpe', key: 'ratiosharpe5an' },
    { label: 'Perte Max', key: 'pertemax5an' },
    { label: 'Sortino', key: 'sortino5an' },
    { label: 'Ratio info', key: 'info5an' },
    { label: 'Date', key: 'datejour' },],
    tabFrais: [

      { label: 'Nom du fonds', key: 'nom_fond' },
      { label: 'Invest min', key: 'minimum_investissement' },
      { label: 'Gestion', key: 'frais_gestion' },
      { label: 'Souscription', key: 'frais_souscription' },
      { label: 'Rachat', key: 'frais_rachat' },],

    tabGestion: [

      { label: 'Nom du fonds', key: 'nom_fond' },
      { label: 'Societe de gestion', key: 'societe_gestion' },
      { label: 'Type', key: 'structure_fond' },
      { label: 'Categorie_nationale', key: 'categorie_national' },
      { label: 'Code ISIN', key: 'code_ISIN' },
    ],
  };
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });


  const [selectedOptions, setSelectedOptions] = useState<Option[]>([])
  const [selectedOptions1, setSelectedOptions1] = useState<SingleValue<Option> | null>(null);
  const [selectedOptions2, setSelectedOptions2] = useState<SingleValue<Option> | null>(null);
  const [selectedOptions3, setSelectedOptions3] = useState<SingleValue<Option> | null>(null);

  const [selectedRows, setSelectedRows] = useState<string[]>([]); // Tableau pour stocker les lignes sélectionnées


  const [textInput, setTextInput] = useState('');
  const [fundsOptions, setFundsOptions] = useState([]);
  const [funds, setFunds] = useState<Funds | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [periodePerfAnnu, setPeriodePerfAnnu] = useState('1a');
  const [operationPerfAnnu, setOperationPerfAnnu] = useState('<=');
  const [valuePerfAnnu, setValuePerfAnnu] = useState('');

  const [devise, setDevise] = useState('');
  const [Typeinvest, setTypeinvest] = useState('');

  const [Freqvaloris, setFreqvaloris] = useState('');

  const [operationActifnet, setOperationActifnet] = useState('');
  const [valueActifnet, setValueActifnet] = useState('');

  const [periodePerfCummul, setPeriodePerfCummul] = useState('perfVeille');
  const [operationPerfCummul, setOperationPerfCummul] = useState('<=');
  const [valuePerfCummul, setValuePerfCummul] = useState('');

  const [periodeSharpe, setPeriodeSharpe] = useState('1a');
  const [operationSharpe, setOperationSharpe] = useState('<=');
  const [valueSharpe, setValueSharpe] = useState('');

  const [periodeTrackingerror, setPeriodeTrackingerror] = useState('1a');
  const [operationTrackingerror, setOperationTrackingerror] = useState('<=');
  const [valueTrackingerror, setValueTrackingerror] = useState('');

  const [periodeSortino, setPeriodeSortino] = useState('1a');
  const [operationSortino, setOperationSortino] = useState('<=');
  const [valueSortino, setValueSortino] = useState('');

  const [periodeOmega, setPeriodeOmega] = useState('1a');
  const [operationOmega, setOperationOmega] = useState('<=');
  const [valueOmega, setValueOmega] = useState('');

  const [periodeDsr, setPeriodeDsr] = useState('1a');
  const [operationDsr, setOperationDsr] = useState('<=');
  const [valueDsr, setValueDsr] = useState('');

  const [periodeBetahaussier, setPeriodeBetahaussier] = useState('1a');
  const [operationBetahaussier, setOperationBetahaussier] = useState('<=');
  const [valueBetahaussier, setValueBetahaussier] = useState('');

  const [periodeBetabaissier, setPeriodeBetabaissier] = useState('1a');
  const [operationBetabaissier, setOperationBetabaissier] = useState('<=');
  const [valueBetabaissier, setValueBetabaissier] = useState('');

  const [periodeDowncapture, setPeriodeDowncapture] = useState('1a');
  const [operationDowncapture, setOperationDowncapture] = useState('<=');
  const [valueDowncapture, setValueDowncapture] = useState('');

  const [periodeUpcapture, setPeriodeUpcapture] = useState('1a');
  const [operationUpcapture, setOperationUpcapture] = useState('<=');
  const [valueUpcapture, setValueUpcapture] = useState('');

  const [periodeSkewness, setPeriodeSkewness] = useState('1a');
  const [operationSkewness, setOperationSkewness] = useState('<=');
  const [valueSkewness, setValueSkewness] = useState('');

  const [periodeKurtosis, setPeriodeKurtosis] = useState('1a');
  const [operationKurtosis, setOperationKurtosis] = useState('<=');
  const [valueKurtosis, setValueKurtosis] = useState('');


  const [periodeBeta, setPeriodeBeta] = useState('1a');
  const [operationBeta, setOperationBeta] = useState('<=');
  const [valueBeta, setValueBeta] = useState('');

  const [operationFraisgestion, setOperationFraisgestion] = useState('<=');
  const [valueFraisgestion, setValueFraisgestion] = useState('');

  const [operationFraisrachat, setOperationFraisrachat] = useState('<=');
  const [valueFraisrachat, setValueFraisrachat] = useState('');

  const [operationFraissous, setOperationFraissous] = useState('<=');
  const [valueFraissous, setValueFraissous] = useState('');

  const [periodeFraiscourant, setPeriodeFraiscourant] = useState('');
  const [operationFraiscourant, setOperationFraiscourant] = useState('<=');
  const [valueFraiscourant, setValueFraiscourant] = useState('');

  const [periodeMininvest, setPeriodeMininvest] = useState('1a');
  const [operationMininvest, setOperationMininvest] = useState('<=');
  const [valueMininvest, setValueMininvest] = useState('');

  const [periodeVolatilite, setPeriodeVolatilite] = useState('1a');
  const [operationVolatilite, setOperationVolatilite] = useState('<=');
  const [valueVolatilite, setValueVolatilite] = useState('');

  const [periodePertemax, setPeriodePertemax] = useState('1a');
  const [operationPertemax, setOperationPertemax] = useState('<=');
  const [valuePertemax, setValuePertemax] = useState('');

  const [periodeRatioinf, setPeriodeRatioinf] = useState('1a');
  const [operationRatioinf, setOperationRatioinf] = useState('<=');
  const [valueRatioinf, setValueRatioinf] = useState('');

  const [periodeVar95, setPeriodeVar95] = useState('1a');
  const [operationVar95, setOperationVar95] = useState('<=');
  const [valueVar95, setValueVar95] = useState('');

  const [periodeCalamar, setPeriodeCalamar] = useState('1a');
  const [operationCalamar, setOperationCalamar] = useState('<=');
  const [valueCalamar, setValueCalamar] = useState('');

  const [periodeVar99, setPeriodeVar99] = useState('1a');
  const [operationVar99, setOperationVar99] = useState('<=');
  const [valueVar99, setValueVar99] = useState('');

  const [sortedFunds, setSortedFunds] = useState<Funds | null>(null); // État pour les fonds triés

  const [searchResults, setSearchResults] = useState([]); // État pour stocker les résultats de la recherche
  const [error, setError] = useState(""); // État pour stocker le message d'erreur
  const [openFieldset, setOpenFieldset] = useState(null);
  const [optionsSociete, setOptionsSociete] = useState([]);
  const [optionsDevise, setOptionsDevise] = useState([]);
  const [selectedSociete, setSelectedSociete] = useState<Societe | null>(null);
  const [selectedDevise, setSelectedDevise] = useState<Devise | null>(null);


  // Other state variables and functions for your form fields (periode, operation, value, etc.)

  const handleToggleFieldset = (fieldsetName: any) => {
    setOpenFieldset((prevOpenFieldset) =>
      prevOpenFieldset === fieldsetName ? null : fieldsetName
    );
  };
  const getSortClasses = (key: string) => {
    if (sortConfig.key === key) {
      return `text-right ${sortConfig.direction === 'asc' ? 'asc-icon' : 'desc-icon'}`;
    }
    return 'text-right';
  };
  var totalItems: any;
  const handleSort = (key: string) => {
    setCurrentPage(1);
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';

    }
    console.log(key)

    setSortConfig({ key, direction });

    if (funds && funds.data.funds) {

      // Créez une copie triée des fonds en utilisant la méthode sort()
      const sortedFundsCopy = [...funds.data.funds];
      console.log(sortedFundsCopy);
      const filteredFunds = sortedFundsCopy.filter(item =>
        item.performanceData &&
        item.performanceData[sortConfig.key] !== '-'
      );
      console.log(filteredFunds)

      filteredFunds.sort((a, b) => {

        if (sortConfig.key == "type_investissement" || sortConfig.key == "nom_fond" || sortConfig.key == "categorie_national" || sortConfig.key == "datejour" || sortConfig.key == "datemoispre" || sortConfig.key == "dev_libelle" || sortConfig.key == "categorie_globale" || sortConfig.key == "code_ISIN" || sortConfig.key == "societe_gestion") {
          const aValue = a.fundData[sortConfig.key];
          const bValue = b.fundData[sortConfig.key];
          if (aValue < bValue) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          } else if (aValue > bValue) {
            return sortConfig.direction === 'asc' ? 1 : -1;
          } else {
            return 0;
          }

        } else {
          const aValue = a.performanceData[sortConfig.key];
          const bValue = b.performanceData[sortConfig.key];
          const numericAValue = parseFloat(aValue);
          const numericBValue = parseFloat(bValue);

          if (isNaN(numericAValue) || isNaN(numericBValue) || aValue === '-' || bValue === '-') {
            // Handle cases where the values are not valid numbers
            // For example, if aValue or bValue are non-numeric strings
            return 0; // or handle this case based on your requirements
          }

          if (numericAValue < numericBValue) {
            return direction === 'asc' ? -1 : 1;
          } else if (numericAValue > numericBValue) {
            return direction === 'asc' ? 1 : -1;
          } else {
            return 0;
          }
        }
      });

      // Mettre à jour sortedFunds avec la version triée
      setSortedFunds({ data: { funds: filteredFunds } });
      setFunds({ data: { funds: filteredFunds } });
      totalItems = filteredFunds.length || 0;
      settotalPages(Math.ceil(totalItems / itemsPerPage));
    }
  };
  const handleClosePopup = () => setShowPopup(false);

  const handleChange = (e: { target: { value: string; }; }) => {
    const selectedValue = parseInt(e.target.value, 10);

    if (selectedValue === 100) {
      setShowPopup(true);

      // Display a popup or take any other action when 100 is selected
      //  alert('To select 100 items per page, you must be a member.');
      setItemsPerPage(20);
      setCurrentPage(1);

    } else {

      setItemsPerPage(selectedValue);
      setCurrentPage(1);
    } // Reset to the first page when changing the number of items per page
  };
  /*
    const handleSubmit = (e) => {
      e.preventDefault();
  
    
    };*/
  const [showPopup, setShowPopup] = useState(false);

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    setFunds({ data: { funds: [] } });
    // Traitez les données du formulaire ici (selectedOptions et textInput)
    const formData: FormData = {}; // Initialisation de l'objet formData

    /*  if (selectedOptions1) {
        formData["categorie"] = {
          value: selectedOptions1
        };
      }
      if (selectedOptions2) {
        formData["societe"] = {
          value: selectedOptions2
        };
      }*/
    // Ajouter les valeurs des critères "Sharpe" à l'objet formData
    if ((periodeSharpe || operationSharpe) && valueSharpe) {
      formData["Sharpe"] = {
        periode: periodeSharpe,
        operation: operationSharpe,
        value: valueSharpe
      };
    }

    // Ajouter les valeurs des critères "Trackingerror" à l'objet formData
    if ((periodeSharpe || operationSharpe) && valueSharpe) {
      formData["Trackingerror"] = {
        periode: periodeTrackingerror,
        operation: operationTrackingerror,
        value: valueTrackingerror
      };
    }

    // Ajouter les valeurs des critères "Sortino" à l'objet formData
    if ((periodeSortino || operationSortino) && valueSortino) {
      formData["Sortino"] = {
        periode: periodeSortino,
        operation: operationSortino,
        value: valueSortino
      };
    }

    // Ajouter les valeurs des critères "Omega" à l'objet formData
    if ((periodeOmega || operationOmega) && valueOmega) {
      formData["Omega"] = {
        periode: periodeOmega,
        operation: operationOmega,
        value: valueOmega
      };
    }

    // Ajouter les valeurs des critères "Dsr" à l'objet formData
    if ((periodeDsr || operationDsr) && valueDsr) {
      formData["Dsr"] = {
        periode: periodeDsr,
        operation: operationDsr,
        value: valueDsr
      };
    }

    // Ajouter les valeurs des critères "Betahaussier" à l'objet formData
    if ((periodeBetahaussier || operationBetahaussier) && valueBetahaussier) {
      formData["Betahaussier"] = {
        periode: periodeBetahaussier,
        operation: operationBetahaussier,
        value: valueBetahaussier
      };
    }

    // Ajouter les valeurs des critères "Betabaissier" à l'objet formData
    if ((periodeBetabaissier || operationBetabaissier) && valueBetabaissier) {
      formData["Betabaissier"] = {
        periode: periodeBetabaissier,
        operation: operationBetabaissier,
        value: valueBetabaissier
      };
    }

    // Ajouter les valeurs des critères "Downcapture" à l'objet formData
    if ((periodeDowncapture || operationDowncapture) && valueDowncapture) {
      formData["Downcapture"] = {
        periode: periodeDowncapture,
        operation: operationDowncapture,
        value: valueDowncapture
      };
    }

    // Ajouter les valeurs des critères "Upcapture" à l'objet formData
    if ((periodeUpcapture || operationUpcapture) && valueUpcapture) {
      formData["Upcapture"] = {
        periode: periodeUpcapture,
        operation: operationUpcapture,
        value: valueUpcapture
      };
    }

    // Ajouter les valeurs des critères "Skewness" à l'objet formData
    if ((periodeSkewness || operationSkewness) && valueSkewness) {
      formData["Skewness"] = {
        periode: periodeSkewness,
        operation: operationSkewness,
        value: valueSkewness
      };
    }
    // Ajouter les valeurs des critères "Kurtosis" à l'objet formData
    if ((periodeKurtosis || operationKurtosis) && valueKurtosis) {
      formData["Kurtosis"] = {
        periode: periodeKurtosis,
        operation: operationKurtosis,
        value: valueKurtosis
      };
    }

    // Ajouter les valeurs des critères "Volatilité" à l'objet formData
    if ((periodeVolatilite || operationVolatilite) && valueVolatilite) {
      formData["Volatilite"] = {
        periode: periodeVolatilite,
        operation: operationVolatilite,
        value: valueVolatilite
      };
    }

    // Ajouter les valeurs des critères "Beta" à l'objet formData
    if ((periodeBeta || operationBeta) && valueBeta) {
      formData["Beta"] = {
        periode: periodeBeta,
        operation: operationBeta,
        value: valueBeta
      };
    }

    // Ajouter les valeurs des critères "Calamar" à l'objet formData
    if ((periodeCalamar || operationCalamar) && valueCalamar) {
      formData["Calamar"] = {
        periode: periodeCalamar,
        operation: operationCalamar,
        value: valueCalamar
      };
    }

    // Ajouter les valeurs des critères "Fraiscourant" à l'objet formData
    if (operationFraiscourant && valueFraiscourant) {
      formData["Fraiscourant"] = {
        operation: operationFraiscourant,
        value: valueFraiscourant
      };
    }

    // Ajouter les valeurs des critères "PerfAnnu" à l'objet formData
    if ((periodePerfAnnu || operationPerfAnnu) && valuePerfAnnu) {
      formData["PerfAnnu"] = {
        periode: periodePerfAnnu,
        operation: operationPerfAnnu,
        value: valuePerfAnnu
      };
    }

    // Ajouter les valeurs des critères "PerfCummul" à l'objet formData
    if ((periodePerfCummul || operationPerfCummul) && valuePerfCummul) {
      formData["PerfCummul"] = {
        periode: periodePerfCummul,
        operation: operationPerfCummul,
        value: valuePerfCummul
      };
    }

    // Ajouter les valeurs des critères "Pertemax" à l'objet formData
    if ((periodePertemax || operationPertemax) && valuePertemax) {
      formData["Pertemax"] = {
        periode: periodePertemax,
        operation: operationPertemax,
        value: valuePertemax
      };
    }

    // Ajouter les valeurs des critères "Ratioinf" à l'objet formData
    if ((periodeRatioinf || operationRatioinf) && valueRatioinf) {
      formData["Ratioinf"] = {
        periode: periodeRatioinf,
        operation: operationRatioinf,
        value: valueRatioinf
      };
    }

    // Ajouter les valeurs des critères "Var95" à l'objet formData
    if ((periodeVar95 || operationVar95) && valueVar95) {
      formData["Var95"] = {
        periode: periodeVar95,
        operation: operationVar95,
        value: valueVar95
      };
    }

    // Ajouter les valeurs des critères "Var99" à l'objet formData
    if ((periodeVar99 || operationVar99) && valueVar99) {
      formData["Var99"] = {
        periode: periodeVar99,
        operation: operationVar99,
        value: valueVar99
      };
    }

    // Ajouter les valeurs des critères "Actifnet" à l'objet formData
    if (operationActifnet && valueActifnet) {
      formData["Actifnet"] = {
        operation: operationActifnet,
        value: valueActifnet
      };
    }

    // Ajouter les valeurs des critères "Fraiscourant" à l'objet formData
    if (operationFraiscourant && valueFraiscourant) {
      formData["Fraiscourant"] = {
        operation: operationFraiscourant,
        value: valueFraiscourant
      };
    }

    // Ajouter les valeurs des critères "Fraisgestion" à l'objet formData
    if (operationFraisgestion && valueFraisgestion) {
      formData["Fraisgestion"] = {
        operation: operationFraisgestion,
        value: valueFraisgestion
      };
    }

    // Ajouter les valeurs des critères "Fraisrachat" à l'objet formData
    if (operationFraisrachat && valueFraisrachat) {
      formData["Fraisrachat"] = {
        operation: operationFraisrachat,
        value: valueFraisrachat
      };
    }

    if (operationFraissous && valueFraissous) {
      formData["Fraissous"] = {
        operation: operationFraissous,
        value: valueFraissous
      };
    }

    // Ajouter les valeurs des critères "Mininvest" à l'objet formData
    if (operationMininvest && valueMininvest) {
      formData["Mininvest"] = {
        operation: operationMininvest,
        value: valueMininvest
      };
    }

    // Ajouter les valeurs des critères "Devise" à l'objet formData
    if (devise) {
      formData["Devise"] = {
        value: devise
      };
    }

    // Ajouter les valeurs des critères "Freqvaloris" à l'objet formData
    if (Freqvaloris) {
      formData["Freqvaloris"] = {
        value: Freqvaloris
      };
    }
    // Ajouter les valeurs des critères "Typeinvest" à l'objet formData
    if (Typeinvest) {
      formData["Typeinvest"] = {
        value: Typeinvest
      };
    }

    setError("");
    // Utilisez le tableau formData selon vos besoins (par exemple, envoyez-le à un serveur).
    console.log(formData);

    console.log('Options sélectionnées :', selectedOptions);
    console.log('Texte saisi :', textInput);
    const selectedValues = selectedOptions.map(option => option?.value);
    const selectedcategorie = selectedOptions1?.value;
    const selectedcategorienationale = selectedOptions3?.value;
    const selectedcategorieregionale = selectedOptions2?.value;

    const selectedsociete = selectedSociete?.value;
    const selecteddevise = selectedDevise?.value;
    console.log("Freqvaloris");
    console.log(Freqvaloris);
    Swal.fire({
      title: 'Veuillez patienter',
      html: 'Chargement des résultats en cours...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    /* fetch(`${urlconstant}/api/recherchefonds?query=${selectedValues.join(',')}`, {
       method: 'GET', // Assurez-vous que la méthode HTTP correspond à votre API
     })*/
    fetch(`${urlconstant}/api/rechercheravance-fonds?query=${selectedValues.join(',')}&selectedcategorie=${selectedcategorie}&selectedsociete=${selectedsociete}&selecteddevise=${selecteddevise}&frequence=${Freqvaloris}&selectedcategorienationale=${selectedcategorienationale}&selectedcategorieregionale=${selectedcategorieregionale}`, {
      method: 'POST', // Assurez-vous que la méthode HTTP correspond à votre API
      headers: {
        'Content-Type': 'application/json', // Spécifiez le type de contenu JSON
      },
      body: JSON.stringify({ formData }), // Convertissez formData en format JSON
    })
      .then(response => response.json())
      .then(data => {
        if (data && data.code === 200 && data.data.funds.length > 0) {
          setFunds(data);
          Swal.close(); // Close the loading popup
          totalItems = data.data.funds.length || 0;
          settotalPages(Math.ceil(totalItems / itemsPerPage));

        } else {
          Swal.close(); // Close the loading popup

          setError("Aucun résultat trouvé. Réessayez avec d'autres critères.");

          // Affichez un message d'erreur ici
          console.error('Aucun fonds trouvé ou erreur de l\'API.');
        }

        // Traitez la réponse de l'API ici
        console.log('Réponse de l\'API :', data);
      })
      .catch(error => {
        console.error('Erreur lors de l\'appel de l\'API :', error);
      });
  };
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userConnected, setUserConnected] = useState<number | null>(null);
  const router = useRouter();


  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userId = localStorage.getItem('userId');

    console.log("isLoggedIn")
    if (isLoggedIn === 'true' && userId !== null) {
      const userIdNumber = parseInt(userId, 10);
      setIsLoggedIn(true);
      setUserConnected(userIdNumber)
    } else {
      // If storedIsLoggedIn is null or any other value, set the state to false
      setIsLoggedIn(false);
    } console.log(isLoggedIn)

  }, []);

  const [activeTab, setActiveTab] = useState("tabAccueil");

  const handleTabClick = (tabName: any) => {
    setActiveTab(tabName);
    console.log("Position de la nav : ", tabName);
  };


  const [post, setPost] = useState(null);
  useEffect(() => {


    console.log("Position de la nav : ", activeTab);

    // Appel à l'API lors du premier rendu du composant
    async function fetchData() {
      try {
        /* const data = await getlastvl();
         setPost(data);*/

        const data1 = await getlastvl1();

        const mappedOptions = data1?.data?.funds.map((funds: any) => ({

          value: funds.value,
          label: funds.label, // Replace with the actual property name
          // Replace with the actual property name
        }));
        setFundsOptions(mappedOptions);
        console.log(mappedOptions);

        const data2 = await getsociete();
        const mappedOptions2 = data2?.data.societes.map((funds: any) => ({

          value: funds.name,
          label: funds.name, // Replace with the actual property name
          // Replace with the actual property name
        }));
        setOptionsSociete(mappedOptions2);
        console.log(fundsOptions);

        const data5 = await getdevise();
        const mappedOptions5 = data5?.data.devises.map((funds: any) => ({

          value: funds.devise,
          label: funds.devise, // Replace with the actual property name
          // Replace with the actual property name
        }));
        setOptionsDevise(mappedOptions5);
        console.log(fundsOptions);

      } catch (error) {
        console.error("Erreur lors de l'appel à l'API :", error);
      }
    }
    fetchData();
  }, [activeTab]);

  const handleCheckboxChange = (itemId: any) => {
    if (selectedRows.includes(itemId)) {
      // L'élément est déjà sélectionné, donc le désélectionner
      setSelectedRows(selectedRows.filter((id) => id !== itemId));
      console.log("aaaaa")
      console.log(selectedRows)
    } else {
      console.log("bbbb")
      // L'élément n'est pas sélectionné, donc le sélectionner
      setSelectedRows([...selectedRows, itemId]);
      console.log(selectedRows)

    }
  };
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const handleItemsPerPageChange = (e: { target: { value: string; }; }) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1); // Reset current page when changing items per page
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFunds = funds?.data?.funds.slice(indexOfFirstItem, indexOfLastItem);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu1 = () => {
    setMenuOpen(!menuOpen);
  };


  const handleLinkClick = () => {

    if (userConnected !== null) {
      setTimeout(() => {
        const redirectUrl = `/panel/portefeuille/home?id=${userConnected}`;

        router.push(redirectUrl);
      }, 5);

    } else {
      setTimeout(() => {
        // const redirectUrl = `/panel/portefeuille/home?id=${userConnected}`;

        router.push('/panel/societegestionpanel/login');
      }, 5);
    }
  };

  const handleLinksociete = () => {


    setTimeout(() => {
      const redirectUrl = `/Fundmanager/recherche`;

      router.push(redirectUrl);
    }, 1);


  };
  const [isHovered, setIsHovered] = useState(false);


  const handleMouseEnters = () => {
    setIsHovered(true);
  };

  const handleMouseLeaves = () => {
    setIsHovered(false);
  };
  const handleLinkaccueil = () => {


    setTimeout(() => {
      const redirectUrl = `/accueil`;

      router.push(redirectUrl);
    }, 1);


  };
  const [isHovereda, setIsHovereda] = useState(false);


  const handleMouseEntersa = () => {
    setIsHovereda(true);
  };

  const handleMouseLeavesa = () => {
    setIsHovereda(false);
  };

  const [isHoveredaa, setIsHoveredaa] = useState(false);

  const handleMouseEnteraa = () => {
    setIsHoveredaa(true);
  };

  const handleMouseLeaveaa = () => {
    setIsHoveredaa(false);
  };
  const handleLinkactualite = () => {


    setTimeout(() => {
      const redirectUrl = `/actualite`;

      router.push(redirectUrl);
    }, 1);


  };

  const [isHoveredp, setIsHoveredp] = useState(false);

  const handleMouseEnterp = () => {
    setIsHoveredp(true);
  };

  const handleMouseLeavep = () => {
    setIsHoveredp(false);
  };
  const handleLinkpays = () => {


    setTimeout(() => {
      const redirectUrl = `/pays`;

      router.push(redirectUrl);
    }, 1);


  };
  return (



    < Fragment >
      <Header />
      <br />

      
      <div className="">
        <Modal show={showPopup} onHide={handleClosePopup} centered>
          <Modal.Header closeButton>
            <Modal.Title>Action</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Pour sélectionner 100 éléments par page, vous devez être membre.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" style={{
              textDecoration: 'none',
              backgroundColor: '#6366f1',
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
            <div className="row">

              <div className="col-12">
                <div className="box ">
                  <div className="box-body">
                    <div className="d-md-flex justify-content-between align-items-center">
                      <div>
                        <p><span className="text-primary">Recherche</span> | <span className="text-fade"></span></p>

                      </div>

                    </div>
                    <hr />


                    <div className="row">




                      <form onSubmit={handleFormSubmit}>
                        <div>
                          <label htmlFor="select">Fonds (Nom/ISIN) :</label>
                          <Select className="select-component"
                            id="select"
                            options={fundsOptions}
                            isMulti
                            isSearchable
                            value={selectedOptions}
                            onChange={(newValue, actionMeta) => setSelectedOptions(newValue.map(option => option as Option))}
                          />
                        </div>
                        <div className="row ">
                          <div className="col-md-6">
                            <label htmlFor="select">Classe d actif  :</label>
                            <Select className="select-component"
                              id="select"
                              options={optionsCategorie}

                              isSearchable
                              value={selectedOptions1}
                              onChange={(newValue, actionMeta) => setSelectedOptions1(newValue)}
                            />
                          </div>
                          <div className="col-md-6">
                            <label htmlFor="select">Societés de gestion :</label>
                            <Select className="select-component"

                              options={optionsSociete}
                              value={selectedSociete}
                              onChange={setSelectedSociete}
                              placeholder="Sélectionnez une Societe"
                            />
                          </div>
                        </div>
                        <div className="row ">
                          <div className="col-md-6">
                            <label htmlFor="select">Categorie Regionale  :</label>
                            <Select className="select-component"
                              id="select"
                              options={optionsCategorieregionale}

                              isSearchable
                              value={selectedOptions2}
                              onChange={(newValue, actionMeta) => setSelectedOptions2(newValue)}
                            />
                          </div>
                          <div className="col-md-6">
                            <label htmlFor="select">Categorie nationale :</label>
                            <Select className="select-component"
                              id="select"
                              options={optionsCategorienationale}

                              isSearchable
                              value={selectedOptions3}
                              onChange={(newValue, actionMeta) => setSelectedOptions3(newValue)}
                            />
                          </div>
                        </div>

                        <br />
                        {/* <div>
                          <label htmlFor="textInput">Autre champ :</label>
                          <input
                            className="form-control"
                            type="text"
                            id="textInput"
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                          />
  </div>*/}
                        <div className="text-right">
                          <Link href={""} style={{
                            textDecoration: 'none',
                            backgroundColor: '#6366f1',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '5px',
                          }} onClick={toggleMenu}>Critères de recherche avancés</Link>
                        </div>
                        {isOpen && (



                          <div className="container">

                            {/* Section pour les critères Perf annu */}
                            <fieldset>
                              <legend><strong>Fiche d identité</strong>
                                <button
                                  type="button"
                                  className="btn btn-link"
                                  onClick={() => handleToggleFieldset('fieldset1')}
                                >
                                  {openFieldset === 'fieldset1' ? 'Fermer' : 'Ouvrir'}
                                </button>
                              </legend>
                              {openFieldset === 'fieldset1' && (
                                <div>
                                  <div className="row">
                                    <div className="col-6">
                                      <div className="row">
                                        <div className="col">
                                          <strong><label htmlFor="periode">Devise</label></strong>
                                        </div>
                                      </div>
                                      <div className="col-3">
                                        <Select className="select-component"

                                          options={optionsDevise}
                                          value={selectedDevise}
                                          onChange={setSelectedDevise}
                                          placeholder="Sélectionnez une Societe"
                                        />
                                      </div>
                                      {/* <div className="col-3">
                                        <div className="form-group">
                                          <select
                                            className="form-control"
                                            id="operation"
                                            value={devise}
                                            onChange={(e) => setDevise(e.target.value)}
                                          >
                                            <option value="EUR">{'EUR'}</option>
                                            <option value="USD">{'USD'}</option>
                                          </select>
                                        </div>
                              </div>*/}
                                    </div>
                                    <div className="col-6">
                                      <div className="row">
                                        <div className="col">
                                          <strong><label htmlFor="periode">Type investissement</label></strong>
                                        </div>
                                      </div>
                                      <div className="col-3">
                                        <div className="form-group">
                                          <select
                                            className="form-control"
                                            id="operation"
                                            value={Typeinvest}
                                            onChange={(e) => setTypeinvest(e.target.value)}
                                          >
                                            <option value="Tous">{'Tous'}</option>
                                            <option value="Tous souscripteurs">{'Tous souscripteurs'}</option>
                                            <option value="Professionels">{'Professionels'}</option>
                                          </select>
                                        </div>
                                      </div>
                                    </div>



                                  </div>
                                </div>
                              )}
                            </fieldset>
                            <fieldset>
                              <legend><strong> Calcul Stantards</strong>
                                <button
                                  type="button"
                                  className="btn btn-link"
                                  onClick={() => handleToggleFieldset('fieldset2')}
                                >
                                  {openFieldset === 'fieldset2' ? 'Fermer' : 'Ouvrir'}
                                </button>
                              </legend>
                              {openFieldset === 'fieldset2' && (
                                <div className="row">
                                  <div className="col-6">
                                    <div className="row">
                                      <div className="row">
                                        <div className="col">
                                          <strong><label htmlFor="periode">Perf. Annualisée   (en %)</label></strong>
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="periode"
                                              value={periodePerfAnnu}
                                              onChange={(e) => setPeriodePerfAnnu(e.target.value)}
                                            >
                                              <option value="1a">1a</option>
                                              <option value="3a">3a</option>
                                              <option value="5a">5a</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="operation"
                                              value={operationPerfAnnu}
                                              onChange={(e) => setOperationPerfAnnu(e.target.value)}
                                            >
                                              <option value="<=">{'<='}</option>
                                              <option value=">=">{'>='}</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <input
                                              type="text"
                                              className="form-control"
                                              id="value"
                                              value={valuePerfAnnu}
                                              onChange={(e) => setValuePerfAnnu(e.target.value)}
                                            />
                                          </div>

                                        </div>

                                      </div>

                                      <div className="row">
                                        <div className="col">
                                          <strong><label htmlFor="periode">Perf. Cummulé (en %)</label></strong>
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="periode"
                                              value={periodePerfCummul}
                                              onChange={(e) => setPeriodePerfCummul(e.target.value)}
                                            >
                                              <option value="perfVeille">perfVeille</option>
                                              <option value="perf4Semaines">perf4Semaines</option>
                                              <option value="perf1erJanvier">perf1erJanvier</option>
                                              <option value="perf3Mois">perf3Mois</option>
                                              <option value="perf6Mois">perf6Mois</option>
                                              <option value="perf1An">perf1An</option>
                                              <option value="perf3Ans">perf3Ans</option>
                                              <option value="perf5Ans">perf5Ans</option>

                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="operation"
                                              value={operationPerfCummul}
                                              onChange={(e) => setOperationPerfCummul(e.target.value)}
                                            >
                                              <option value="<=">{'<='}</option>
                                              <option value=">=">{'>='}</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <input
                                              type="text"
                                              className="form-control"
                                              id="value"
                                              value={valuePerfCummul}
                                              onChange={(e) => setValuePerfCummul(e.target.value)}
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col">
                                          <strong><label htmlFor="periode">Sharpe</label></strong>
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="periode"
                                              value={periodeSharpe}
                                              onChange={(e) => setPeriodeSharpe(e.target.value)}
                                            >
                                              <option value="1a">1a</option>
                                              <option value="3a">3a</option>
                                              <option value="5a">5a</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="operation"
                                              value={operationSharpe}
                                              onChange={(e) => setOperationSharpe(e.target.value)}
                                            >
                                              <option value="<=">{'<='}</option>
                                              <option value=">=">{'>='}</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <input
                                              type="text"
                                              className="form-control"
                                              id="value"
                                              value={valueSharpe}
                                              onChange={(e) => setValueSharpe(e.target.value)}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-6">
                                    <div className="row">
                                      <div className="row">
                                        <div className="col">
                                          <strong><label htmlFor="periode">Volatilité (en %)</label></strong>
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="periode"
                                              value={periodeVolatilite}
                                              onChange={(e) => setPeriodeVolatilite(e.target.value)}
                                            >
                                              <option value="1a">1a</option>
                                              <option value="3a">3a</option>
                                              <option value="5a">5a</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="operation"
                                              value={operationVolatilite}
                                              onChange={(e) => setOperationVolatilite(e.target.value)}
                                            >
                                              <option value="<=">{'<='}</option>
                                              <option value=">=">{'>='}</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <input
                                              type="text"
                                              className="form-control"
                                              id="value"
                                              value={valueVolatilite}
                                              onChange={(e) => setValueVolatilite(e.target.value)}
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col">
                                          <strong><label htmlFor="periode">Perte max (en %)</label></strong>
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="periode"
                                              value={periodePertemax}
                                              onChange={(e) => setPeriodePertemax(e.target.value)}
                                            >
                                              <option value="1a">1a</option>
                                              <option value="3a">3a</option>
                                              <option value="5a">5a</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="operation"
                                              value={operationPertemax}
                                              onChange={(e) => setOperationPertemax(e.target.value)}
                                            >
                                              <option value="<=">{'<='}</option>
                                              <option value=">=">{'>='}</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <input
                                              type="text"
                                              className="form-control"
                                              id="value"
                                              value={valuePertemax}
                                              onChange={(e) => setValuePertemax(e.target.value)}
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col">
                                          <strong><label htmlFor="periode">Beta</label></strong>
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="periode"
                                              value={periodeBeta}
                                              onChange={(e) => setPeriodeBeta(e.target.value)}
                                            >
                                              <option value="1a">1a</option>
                                              <option value="3a">3a</option>
                                              <option value="5a">5a</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="operation"
                                              value={operationBeta}
                                              onChange={(e) => setOperationBeta(e.target.value)}
                                            >
                                              <option value="<=">{'<='}</option>
                                              <option value=">=">{'>='}</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <input
                                              type="text"
                                              className="form-control"
                                              id="value"
                                              value={valueBeta}
                                              onChange={(e) => setValueBeta(e.target.value)}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </fieldset>
                            <fieldset>
                              <legend><strong>Calculs avancés</strong>
                                <button
                                  type="button"
                                  className="btn btn-link"
                                  onClick={() => handleToggleFieldset('fieldset3')}
                                >
                                  {openFieldset === 'fieldset3' ? 'Fermer' : 'Ouvrir'}
                                </button>
                              </legend>
                              {openFieldset === 'fieldset3' && (
                                <div className="row">
                                  <div className="col-6">
                                    <div className="row">
                                      <div className="row">
                                        <div className="col">
                                          <strong><label htmlFor="periode">Ratio Info</label></strong>
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="periode"
                                              value={periodeRatioinf}
                                              onChange={(e) => setPeriodeRatioinf(e.target.value)}
                                            >
                                              <option value="1a">1a</option>
                                              <option value="3a">3a</option>
                                              <option value="5a">5a</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="operation"
                                              value={operationRatioinf}
                                              onChange={(e) => setOperationRatioinf(e.target.value)}
                                            >
                                              <option value="<=">{'<='}</option>
                                              <option value=">=">{'>='}</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <input
                                              type="text"
                                              className="form-control"
                                              id="value"
                                              value={valueRatioinf}
                                              onChange={(e) => setValueRatioinf(e.target.value)}
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col">
                                          <strong><label htmlFor="periode">Var 95 (en %)</label></strong>
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="periode"
                                              value={periodeVar95}
                                              onChange={(e) => setPeriodeVar95(e.target.value)}
                                            >
                                              <option value="1a">1a</option>
                                              <option value="3a">3a</option>
                                              <option value="5a">5a</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="operation"
                                              value={operationVar95}
                                              onChange={(e) => setOperationVar95(e.target.value)}
                                            >
                                              <option value="<=">{'<='}</option>
                                              <option value=">=">{'>='}</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <input
                                              type="text"
                                              className="form-control"
                                              id="value"
                                              value={valueVar95}
                                              onChange={(e) => setValueVar95(e.target.value)}
                                            />
                                          </div>
                                        </div>
                                      </div>



                                    </div>
                                  </div>
                                  <div className="col-6">
                                    <div className="row">
                                      <div className="row">
                                        <div className="col">
                                          <strong><label htmlFor="periode">Calamar</label></strong>
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="periode"
                                              value={periodeCalamar}
                                              onChange={(e) => setPeriodeCalamar(e.target.value)}
                                            >
                                              <option value="1a">1a</option>
                                              <option value="3a">3a</option>
                                              <option value="5a">5a</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="operation"
                                              value={operationCalamar}
                                              onChange={(e) => setOperationCalamar(e.target.value)}
                                            >
                                              <option value="<=">{'<='}</option>
                                              <option value=">=">{'>='}</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <input
                                              type="text"
                                              className="form-control"
                                              id="value"
                                              value={valueCalamar}
                                              onChange={(e) => setValueCalamar(e.target.value)}
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col">
                                          <strong><label htmlFor="periode">VAR 99 (en %)</label></strong>
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="periode"
                                              value={periodeVar99}
                                              onChange={(e) => setPeriodeVar99(e.target.value)}
                                            >
                                              <option value="1a">1a</option>
                                              <option value="3a">3a</option>
                                              <option value="5a">5a</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="operation"
                                              value={operationVar99}
                                              onChange={(e) => setOperationVar99(e.target.value)}
                                            >
                                              <option value="<=">{'<='}</option>
                                              <option value=">=">{'>='}</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <input
                                              type="text"
                                              className="form-control"
                                              id="value"
                                              value={valueVar99}
                                              onChange={(e) => setValueVar99(e.target.value)}
                                            />
                                          </div>
                                        </div>
                                      </div>


                                    </div>
                                  </div>

                                  <div className="col-6">
                                    <div className="row">
                                      <div className="row">
                                        <div className="col">
                                          <strong><label htmlFor="periode">Trackingerror</label></strong>
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="periode"
                                              value={periodeTrackingerror}
                                              onChange={(e) => setPeriodeTrackingerror(e.target.value)}
                                            >
                                              <option value="1a">1a</option>
                                              <option value="3a">3a</option>
                                              <option value="5a">5a</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="operation"
                                              value={operationTrackingerror}
                                              onChange={(e) => setOperationTrackingerror(e.target.value)}
                                            >
                                              <option value="<=">{'<='}</option>
                                              <option value=">=">{'>='}</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <input
                                              type="text"
                                              className="form-control"
                                              id="value"
                                              value={valueTrackingerror}
                                              onChange={(e) => setValueTrackingerror(e.target.value)}
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col">
                                          <strong><label htmlFor="periode">Sortino</label></strong>
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="periode"
                                              value={periodeSortino}
                                              onChange={(e) => setPeriodeSortino(e.target.value)}
                                            >
                                              <option value="1a">1a</option>
                                              <option value="3a">3a</option>
                                              <option value="5a">5a</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="operation"
                                              value={operationSortino}
                                              onChange={(e) => setOperationSortino(e.target.value)}
                                            >
                                              <option value="<=">{'<='}</option>
                                              <option value=">=">{'>='}</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <input
                                              type="text"
                                              className="form-control"
                                              id="value"
                                              value={valueSortino}
                                              onChange={(e) => setValueSortino(e.target.value)}
                                            />
                                          </div>
                                        </div>
                                      </div>


                                    </div>
                                  </div>


                                  <div className="col-6">
                                    <div className="row">
                                      <div className="row">
                                        <div className="col">
                                          <strong><label htmlFor="periode">Omega</label></strong>
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="periode"
                                              value={periodeOmega}
                                              onChange={(e) => setPeriodeOmega(e.target.value)}
                                            >
                                              <option value="1a">1a</option>
                                              <option value="3a">3a</option>
                                              <option value="5a">5a</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="operation"
                                              value={operationOmega}
                                              onChange={(e) => setOperationOmega(e.target.value)}
                                            >
                                              <option value="<=">{'<='}</option>
                                              <option value=">=">{'>='}</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <input
                                              type="text"
                                              className="form-control"
                                              id="value"
                                              value={valueOmega}
                                              onChange={(e) => setValueOmega(e.target.value)}
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col">
                                          <strong><label htmlFor="periode">Dsr</label></strong>
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="periode"
                                              value={periodeDsr}
                                              onChange={(e) => setPeriodeDsr(e.target.value)}
                                            >
                                              <option value="1a">1a</option>
                                              <option value="3a">3a</option>
                                              <option value="5a">5a</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="operation"
                                              value={operationDsr}
                                              onChange={(e) => setOperationDsr(e.target.value)}
                                            >
                                              <option value="<=">{'<='}</option>
                                              <option value=">=">{'>='}</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <input
                                              type="text"
                                              className="form-control"
                                              id="value"
                                              value={valueDsr}
                                              onChange={(e) => setValueDsr(e.target.value)}
                                            />
                                          </div>
                                        </div>
                                      </div>


                                    </div>
                                  </div>
                                  <div className="col-6">
                                    <div className="row">
                                      <div className="row">
                                        <div className="col">
                                          <strong><label htmlFor="periode">Betahaussier</label></strong>
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="periode"
                                              value={periodeBetahaussier}
                                              onChange={(e) => setPeriodeBetahaussier(e.target.value)}
                                            >
                                              <option value="1a">1a</option>
                                              <option value="3a">3a</option>
                                              <option value="5a">5a</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="operation"
                                              value={operationBetahaussier}
                                              onChange={(e) => setOperationBetahaussier(e.target.value)}
                                            >
                                              <option value="<=">{'<='}</option>
                                              <option value=">=">{'>='}</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <input
                                              type="text"
                                              className="form-control"
                                              id="value"
                                              value={valueBetahaussier}
                                              onChange={(e) => setValueBetahaussier(e.target.value)}
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col">
                                          <strong><label htmlFor="periode">Betabaissier</label></strong>
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="periode"
                                              value={periodeBetabaissier}
                                              onChange={(e) => setPeriodeBetabaissier(e.target.value)}
                                            >
                                              <option value="1a">1a</option>
                                              <option value="3a">3a</option>
                                              <option value="5a">5a</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="operation"
                                              value={operationBetabaissier}
                                              onChange={(e) => setOperationBetabaissier(e.target.value)}
                                            >
                                              <option value="<=">{'<='}</option>
                                              <option value=">=">{'>='}</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <input
                                              type="text"
                                              className="form-control"
                                              id="value"
                                              value={valueBetabaissier}
                                              onChange={(e) => setValueBetabaissier(e.target.value)}
                                            />
                                          </div>
                                        </div>
                                      </div>


                                    </div>
                                  </div>
                                  <div className="col-6">
                                    <div className="row">
                                      <div className="row">
                                        <div className="col">
                                          <strong><label htmlFor="periode">Downcapture</label></strong>
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="periode"
                                              value={periodeDowncapture}
                                              onChange={(e) => setPeriodeDowncapture(e.target.value)}
                                            >
                                              <option value="1a">1a</option>
                                              <option value="3a">3a</option>
                                              <option value="5a">5a</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="operation"
                                              value={operationDowncapture}
                                              onChange={(e) => setOperationDowncapture(e.target.value)}
                                            >
                                              <option value="<=">{'<='}</option>
                                              <option value=">=">{'>='}</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <input
                                              type="text"
                                              className="form-control"
                                              id="value"
                                              value={valueDowncapture}
                                              onChange={(e) => setValueDowncapture(e.target.value)}
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col">
                                          <strong><label htmlFor="periode">Upcapture</label></strong>
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="periode"
                                              value={periodeUpcapture}
                                              onChange={(e) => setPeriodeUpcapture(e.target.value)}
                                            >
                                              <option value="1a">1a</option>
                                              <option value="3a">3a</option>
                                              <option value="5a">5a</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="operation"
                                              value={operationUpcapture}
                                              onChange={(e) => setOperationUpcapture(e.target.value)}
                                            >
                                              <option value="<=">{'<='}</option>
                                              <option value=">=">{'>='}</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <input
                                              type="text"
                                              className="form-control"
                                              id="value"
                                              value={valueUpcapture}
                                              onChange={(e) => setValueUpcapture(e.target.value)}
                                            />
                                          </div>
                                        </div>
                                      </div>


                                    </div>
                                  </div>
                                  <div className="col-6">
                                    <div className="row">
                                      <div className="row">
                                        <div className="col">
                                          <strong><label htmlFor="periode">Kurtosis</label></strong>
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="periode"
                                              value={periodeKurtosis}
                                              onChange={(e) => setPeriodeKurtosis(e.target.value)}
                                            >
                                              <option value="1a">1a</option>
                                              <option value="3a">3a</option>
                                              <option value="5a">5a</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="operation"
                                              value={operationKurtosis}
                                              onChange={(e) => setOperationKurtosis(e.target.value)}
                                            >
                                              <option value="<=">{'<='}</option>
                                              <option value=">=">{'>='}</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <input
                                              type="text"
                                              className="form-control"
                                              id="value"
                                              value={valueKurtosis}
                                              onChange={(e) => setValueKurtosis(e.target.value)}
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col">
                                          <strong><label htmlFor="periode">Skewness</label></strong>
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="periode"
                                              value={periodeSkewness}
                                              onChange={(e) => setPeriodeSkewness(e.target.value)}
                                            >
                                              <option value="1a">1a</option>
                                              <option value="3a">3a</option>
                                              <option value="5a">5a</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="operation"
                                              value={operationSkewness}
                                              onChange={(e) => setOperationSkewness(e.target.value)}
                                            >
                                              <option value="<=">{'<='}</option>
                                              <option value=">=">{'>='}</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <input
                                              type="text"
                                              className="form-control"
                                              id="value"
                                              value={valueSkewness}
                                              onChange={(e) => setValueSkewness(e.target.value)}
                                            />
                                          </div>
                                        </div>
                                      </div>


                                    </div>
                                  </div>
                                </div>
                              )}
                            </fieldset>
                            <fieldset>
                              <legend><strong>Frais et min investissements</strong>
                                <button
                                  type="button"
                                  className="btn btn-link"
                                  onClick={() => handleToggleFieldset('fieldset4')}
                                >
                                  {openFieldset === 'fieldset4' ? 'Fermer' : 'Ouvrir'}
                                </button>
                              </legend>
                              {openFieldset === 'fieldset4' && (
                                <div className="row">
                                  <div className="col-6">
                                    <div className="row">
                                      <div className="row">
                                        <div className="col">
                                          <strong><label htmlFor="periode">Frais souscription (en %)</label></strong>
                                        </div>
                                      </div>

                                      <div className="row">

                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="operation"
                                              value={operationFraissous}
                                              onChange={(e) => setOperationFraissous(e.target.value)}
                                            >
                                              <option value="<=">{'<='}</option>
                                              <option value=">=">{'>='}</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <input
                                              type="text"
                                              className="form-control"
                                              id="value"
                                              value={valueFraissous}
                                              onChange={(e) => setValueFraissous(e.target.value)}
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col">
                                          <strong><label htmlFor="periode">Frais Rachat (en %)</label></strong>
                                        </div>
                                      </div>

                                      <div className="row">

                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="operation"
                                              value={operationFraisrachat}
                                              onChange={(e) => setOperationFraisrachat(e.target.value)}
                                            >
                                              <option value="<=">{'<='}</option>
                                              <option value=">=">{'>='}</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <input
                                              type="text"
                                              className="form-control"
                                              id="value"
                                              value={valueFraisrachat}
                                              onChange={(e) => setValueFraisrachat(e.target.value)}
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col">
                                          <strong><label htmlFor="periode">Frais Gestion (en %)</label></strong>
                                        </div>
                                      </div>

                                      <div className="row">

                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="operation"
                                              value={operationFraisgestion}
                                              onChange={(e) => setOperationFraisgestion(e.target.value)}
                                            >
                                              <option value="<=">{'<='}</option>
                                              <option value=">=">{'>='}</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <input
                                              type="text"
                                              className="form-control"
                                              id="value"
                                              value={valueFraisgestion}
                                              onChange={(e) => setValueFraisgestion(e.target.value)}
                                            />
                                          </div>
                                        </div>
                                      </div>

                                    </div>
                                  </div>
                                  <div className="col-6">
                                    <div className="row">
                                      <div className="row">
                                        <div className="col">
                                          <strong><label htmlFor="periode">Frais courant (en %)</label></strong>
                                        </div>
                                      </div>

                                      <div className="row">

                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="operation"
                                              value={operationFraiscourant}
                                              onChange={(e) => setOperationFraiscourant(e.target.value)}
                                            >
                                              <option value="<=">{'<='}</option>
                                              <option value=">=">{'>='}</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <input
                                              type="text"
                                              className="form-control"
                                              id="value"
                                              value={valueFraiscourant}
                                              onChange={(e) => setValueFraiscourant(e.target.value)}
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col">
                                          <strong><label htmlFor="periode">Minimun Investissment initial</label></strong>
                                        </div>
                                      </div>

                                      <div className="row">

                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="operation"
                                              value={operationMininvest}
                                              onChange={(e) => setOperationMininvest(e.target.value)}
                                            >
                                              <option value="<=">{'<='}</option>
                                              <option value=">=">{'>='}</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <input
                                              type="text"
                                              className="form-control"
                                              id="value"
                                              value={valueMininvest}
                                              onChange={(e) => setValueMininvest(e.target.value)}
                                            />
                                          </div>
                                        </div>
                                      </div>


                                    </div>
                                  </div>
                                </div>
                              )}
                            </fieldset>
                            <fieldset>
                              <legend><strong>Valorisation en encours</strong>
                                <button
                                  type="button"
                                  className="btn btn-link"
                                  onClick={() => handleToggleFieldset('fieldset5')}
                                >
                                  {openFieldset === 'fieldset5' ? 'Fermer' : 'Ouvrir'}
                                </button>
                              </legend>
                              {openFieldset === 'fieldset5' && (
                                <div className="row">
                                  <div className="col-6">
                                    <div className="row">
                                      <div className="row">
                                        <div className="col">
                                          <strong><label htmlFor="periode">Frequence valorisation </label></strong>
                                        </div>
                                      </div>

                                      <div className="row">

                                        <div className="col-6">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="operation"
                                              value={Freqvaloris}
                                              onChange={(e) => setFreqvaloris(e.target.value)}
                                            >
                                              <option value="Quotidienne">{'Quotidienne'}</option>
                                              <option value="Hebdomadaire">{'Hebdomadaire'}</option>
                                              <option value="Mensuelle">{'Mensuelle'}</option>

                                            </select>
                                          </div>
                                        </div>

                                      </div>



                                    </div>
                                  </div>
                                  <div className="col-6">
                                    <div className="row">
                                      <div className="row">
                                        <div className="col">
                                          <strong><label htmlFor="periode">Actif en €</label></strong>
                                        </div>
                                      </div>

                                      <div className="row">

                                        <div className="col-2">
                                          <div className="form-group">
                                            <select
                                              className="form-control"
                                              id="operation"
                                              value={operationActifnet}
                                              onChange={(e) => setOperationActifnet(e.target.value)}
                                            >
                                              <option value="<=">{'<='}</option>
                                              <option value=">=">{'>='}</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="col-2">
                                          <div className="form-group">
                                            <input
                                              type="text"
                                              className="form-control"
                                              id="value"
                                              value={valueActifnet}
                                              onChange={(e) => setValueActifnet(e.target.value)}
                                            />
                                          </div>
                                        </div>
                                      </div>




                                    </div>
                                  </div>
                                </div>
                              )}
                            </fieldset>





                          </div>



                        )}
                        <div className=" text-center">
                          <button type="submit" style={{ width: '150px', backgroundColor: "#3b82f6", color: "white" }} className="btn btn-main">Rechercher</button>
                        </div>
                      </form>
                      <br />
                      {error && <div className=" text-center error-message" style={{ color: "red" }}>{error}</div>}

                      {/* Affichez les résultats de la recherche */}
                      {searchResults.length > 0 && (
                        <div className="search-results">
                          {/* Affichez les résultats ici */}
                          {/* ... */}
                        </div>
                      )}
                      <div className="row text-center">
                        <div className="btn-group" style={{ display: "inline-block" }}>
                          <button
                            className={`btn btn-main ${activeTab === "tabAccueil" ? "active" : ""} `}
                            style={activeTab === "tabAccueil" ? { width: '150px', backgroundColor: "#3b82f6", color: "white" } : {}}
                            onClick={() => handleTabClick("tabAccueil")}
                          >
                            Accueil
                          </button>
                          <button
                            className={`btn btn-main ${activeTab === "tabPerfCT" ? "active" : ""}`}
                            style={activeTab === "tabPerfCT" ? { width: '150px', backgroundColor: "#3b82f6", color: "white" } : {}}
                            onClick={() => handleTabClick("tabPerfCT")}
                          >
                            Perf CT
                          </button>
                          <button
                            className={`btn btn-main ${activeTab === "tabPerfMTLT" ? "active" : ""}`}
                            style={activeTab === "tabPerfMTLT" ? { width: '150px', backgroundColor: "#3b82f6", color: "white" } : {}}
                            onClick={() => handleTabClick("tabPerfMTLT")}
                          >
                            Perf MT / LT
                          </button>
                          <button
                            className={`btn btn-main ${activeTab === "tabPerfRatios1a" ? "active" : ""}`}
                            style={activeTab === "tabPerfRatios1a" ? { width: '150px', backgroundColor: "#3b82f6", color: "white" } : {}}
                            onClick={() => handleTabClick("tabPerfRatios1a")}
                          >
                            Ratios 1A
                          </button>
                          <button
                            className={`btn btn-main ${activeTab === "tabPerfRatios3a" ? "active" : ""}`}
                            style={activeTab === "tabPerfRatios3a" ? { width: '150px', backgroundColor: "#3b82f6", color: "white" } : {}}
                            onClick={() => handleTabClick("tabPerfRatios3a")}
                          >
                            Ratios 3A
                          </button>
                          <button
                            className={`btn btn-main ${activeTab === "tabPerfRatios5a" ? "active" : ""}`}
                            style={activeTab === "tabPerfRatios5a" ? { width: '150px', backgroundColor: "#3b82f6", color: "white" } : {}}
                            onClick={() => handleTabClick("tabPerfRatios5a")}
                          >
                            Ratios 5A
                          </button>
                          <button
                            className={`btn btn-main ${activeTab === "tabFrais" ? "active" : ""}`}
                            style={activeTab === "tabFrais" ? { width: '150px', backgroundColor: "#3b82f6", color: "white" } : {}}
                            onClick={() => handleTabClick("tabFrais")}
                          >
                            Frais
                          </button>
                          <button
                            className={`btn btn-main ${activeTab === "tabGestion" ? "active" : ""}`}
                            style={activeTab === "tabGestion" ? { width: '150px', backgroundColor: "#3b82f6", color: "white" } : {}}
                            onClick={() => handleTabClick("tabGestion")}
                          >
                            Gestion
                          </button>
                          {/*                   <button
                            className={`btn btn-main ${activeTab === "tabISR" ? "active" : ""}`}
                            style={activeTab === "tabISR" ? { backgroundColor: "#3b82f6", color: "white" } : {}}
                            onClick={() => handleTabClick("tabISR")}
                          >
                            ESG
  </button>*/}
                        </div>
                        <div className="text-center mt-3">
                          <label>Nombre de ligne par page:</label>
                          <select
                            value={itemsPerPage}
                            onChange={handleChange}
                          >
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                          </select>
                        </div>
                        <div className="text-right">
                          <button
                            className={`btn btn-main active}`}
                            style={{ width: '150px', backgroundColor: "#3b82f6", color: "white" }}
                          // onClick={exportTableToCSV}
                          >
                            Exporter
                          </button>
                        </div>
                        {activeTab == 'tabAccueil' ? (
                          <div className="table-responsive">

                            <table
                              id="example11"
                              className="table-striped text-fade table-bordered table-hover display nowrap margin-top-10 w-p100">
                              <thead className="table-header">
                                <tr className="text-center">
                                  <th className="text-center"></th>
                                  {headers.tabAccueil.map((header) => (
                                    <th className="text-center" key={header.key} onClick={() => handleSort(header.key)} style={{ height: '35px' }}>
                                      {header.label}
                                      {sortConfig.key === header.key && (
                                        <span>{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
                                      )}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {funds?.data?.funds.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
                                  <tr className="text-center" key={item.id}>
                                    <td>
                                      <input
                                        type="checkbox"
                                        checked={selectedRows.includes(item.id)}
                                        id={`checkbox_${item.id}`}
                                        onChange={() => handleCheckboxChange(item.id)}
                                      />
                                    </td>
                                    <td className="text-center"><Link href={`/Opcvm/${item.fundData?.id}`}>{item.fundData?.nom_fond}</Link></td>
                                    <td>{item.fundData?.categorie_globale}</td>
                                    <td>{item.fundData?.dev_libelle}</td>
                                    <td >{item.fundData?.categorie_national}</td>
                                    <td className={`text-center ${parseFloat(item.performanceData?.ytd) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.performanceData?.ytd)) ? '-' : parseFloat(item.performanceData?.ytd).toFixed(2) + " %"}</td>
                                    <td className={`text-center ${parseFloat(item.performanceData?.perf1an) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.performanceData?.perf1an)) ? '-' : parseFloat(item.performanceData?.perf1an).toFixed(2) + " %"}</td>
                                    <td className={`text-center ${parseFloat(item.performanceData?.perf3ans) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.performanceData?.perf3ans)) ? '-' : parseFloat(item.performanceData?.perf3ans).toFixed(2) + " %"}</td>
                                    <td>{item.fundData?.datejour}</td>

                                  </tr>
                                ))}

                              </tbody>
                            </table>
                          </div>
                        ) : activeTab == 'tabPerfCT' ? (
                          <div className="table-responsive">

                            <table
                              id="example11"
                              className="table-striped text-fade table-bordered table-hover display nowrap margin-top-10 w-p100">
                              <thead className="table-header">
                                <tr className="text-center">
                                  <th className="text-center"></th>
                                  {headers.tabPerfCT.map((header) => (
                                    <th className="text-center" key={header.key} onClick={() => handleSort(header.key)} style={{ height: '35px' }}>
                                      {header.label}
                                      {sortConfig.key === header.key && (
                                        <span>{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
                                      )}
                                    </th>
                                  ))}
                                </tr>
                              </thead>

                              <tbody>
                                {funds?.data?.funds.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
                                  <tr className="text-center" key={item.id}>
                                    <td>
                                      <input
                                        type="checkbox"
                                        checked={selectedRows.includes(item.id)}
                                        id={`checkbox_${item.id}`}
                                        onChange={() => handleCheckboxChange(item.id)}
                                      />
                                    </td>
                                    <td className="text-center"><Link href={`/Opcvm/${item.fundData?.id}`}>{item.fundData?.nom_fond}</Link></td>
                                    <td>{item.fundData?.categorie_globale}</td>
                                    <td>{item.fundData?.dev_libelle}</td>
                                    <td className={`text-center ${parseFloat(item.performanceData?.ytd) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.performanceData?.ytd)) ? '-' : parseFloat(item.performanceData?.ytd).toFixed(2) + " %"}</td>
                                    <td className={`text-center ${parseFloat(item.performanceData?.perf4s) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.performanceData?.perf4s)) ? '-' : parseFloat(item.performanceData?.perf4s).toFixed(2) + " %"}</td>
                                    <td className={`text-center ${parseFloat(item.performanceData?.perf3m) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.performanceData?.perf3m)) ? '-' : parseFloat(item.performanceData?.perf3m).toFixed(2) + " %"}</td>
                                    <td className={`text-center ${parseFloat(item.performanceData?.perf6m) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.performanceData?.perf6m)) ? '-' : parseFloat(item.performanceData?.perf6m).toFixed(2) + " %"}</td>

                                    <td>{item.fundData?.datejour}</td>

                                  </tr>
                                ))}

                              </tbody>
                            </table>
                          </div>
                        ) : activeTab == 'tabPerfMTLT' ? (
                          <div className="table-responsive">

                            <table
                              id="example11"
                              className="table-striped text-fade table-bordered table-hover display nowrap margin-top-10 w-p100">
                              <thead className="table-header">
                                <tr className="text-center">
                                  <th className="text-center"></th>
                                  {headers.tabPerfMTLT.map((header) => (
                                    <th className="text-center" key={header.key} onClick={() => handleSort(header.key)} style={{ height: '35px' }}>
                                      {header.label}
                                      {sortConfig.key === header.key && (
                                        <span>{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
                                      )}
                                    </th>
                                  ))}
                                </tr>
                              </thead>

                              <tbody>
                                {funds?.data?.funds.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
                                  <tr className="text-center" key={item.id}>
                                    <td>
                                      <input
                                        type="checkbox"
                                        checked={selectedRows.includes(item.id)}
                                        id={`checkbox_${item.id}`}
                                        onChange={() => handleCheckboxChange(item.id)}
                                      />
                                    </td>
                                    <td className="text-center"><Link href={`/Opcvm/${item.fundData?.id}`}>{item.fundData?.nom_fond}</Link></td>
                                    <td>{item.fundData?.dev_libelle}</td>
                                    <td className={`text-center ${parseFloat(item.performanceData?.perf1an) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.performanceData?.perf1an)) ? '-' : parseFloat(item.performanceData?.perf1an).toFixed(2) + " %"}</td>
                                    <td className={`text-center ${parseFloat(item.performanceData?.perf3ans) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.performanceData?.perf3ans)) ? '-' : parseFloat(item.performanceData?.perf3ans).toFixed(2) + " %"}</td>
                                    <td className={`text-center ${parseFloat(item.performanceData?.perf5ans) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.performanceData?.perf5ans)) ? '-' : parseFloat(item.performanceData?.perf5ans).toFixed(2) + " %"}</td>

                                    <td>{item.fundData?.datejour}</td>

                                  </tr>
                                ))}

                              </tbody>
                            </table>
                          </div>
                        ) : activeTab == 'tabPerfRatios1a' ? (
                          <div className="table-responsive">

                            <table
                              id="example11"
                              className="table-striped text-fade table-bordered table-hover display nowrap margin-top-10 w-p100">
                              <thead className="table-header">
                                <tr className="text-center">
                                  <th className="text-center"></th>
                                  {headers.tabPerfRatios1a.map((header) => (
                                    <th className="text-center" key={header.key} onClick={() => handleSort(header.key)} style={{ height: '35px' }}>
                                      {header.label}
                                      {sortConfig.key === header.key && (
                                        <span>{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
                                      )}
                                    </th>
                                  ))}
                                </tr>
                              </thead>

                              <tbody>
                                {funds?.data?.funds.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
                                  <tr className="text-center" key={item.id}>
                                    <td>
                                      <input
                                        type="checkbox"
                                        checked={selectedRows.includes(item.id)}
                                        id={`checkbox_${item.id}`}
                                        onChange={() => handleCheckboxChange(item.id)}
                                      />
                                    </td>
                                    <td className="text-center"><Link href={`/Opcvm/${item.fundData?.id}`}>{item.fundData?.nom_fond}</Link></td>
                                    <td className={`text-center ${parseFloat(item.performanceData?.perfannu1an) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.performanceData?.perfannu1an)) ? '-' : parseFloat(item.performanceData?.perfannu1an).toFixed(2) + " %"}</td>
                                    <td className={`text-center`}>{isNaN(parseFloat(item.performanceData?.volatility1an)) ? '-' : parseFloat(item.performanceData?.volatility1an).toFixed(2) + " %"} </td>
                                    <td className={`text-center ${parseFloat(item.performanceData?.ratiosharpe1an) < 0 ? 'text-danger' : parseFloat(item.performanceData?.ratiosharpe1an) > 1 ? 'text-success' : ''}`}>{isNaN(parseFloat(item.performanceData?.ratiosharpe1an)) ? '-' : parseFloat(item.performanceData?.ratiosharpe1an).toFixed(2)}</td>
                                    <td className={`text-center ${parseFloat(item.performanceData?.pertemax1an) < 0 ? 'text-danger' : 'text-success'}`}>  {isNaN(parseFloat(item.performanceData?.pertemax1an)) || parseFloat(item.performanceData?.pertemax1an) === 0
                                      ? '-'
                                      : parseFloat(item.performanceData?.pertemax1an).toFixed(2) + " %"}</td>
                                    <td className={`text-center `}>{isNaN(parseFloat(item.performanceData?.sortino1an)) ? '-' : parseFloat(item.performanceData?.sortino1an).toFixed(2)}</td>
                                    <td className={`text-center `}>{isNaN(parseFloat(item.performanceData?.info1an)) ? '-' : parseFloat(item.performanceData?.info1an).toFixed(2)}</td>
                                    <td>{item.fundData?.datemoispre}</td>

                                  </tr>
                                ))}

                              </tbody>
                            </table>
                          </div>
                        )
                          : activeTab == 'tabPerfRatios3a' ? (
                            <div className="table-responsive">

                              <table
                                id="example11"
                                className="table-striped text-fade table-bordered table-hover display nowrap margin-top-10 w-p100">
                                <thead className="table-header">
                                  <tr className="text-center">
                                    <th className="text-center"></th>
                                    {headers.tabPerfRatios3a.map((header) => (
                                      <th className="text-center" key={header.key} onClick={() => handleSort(header.key)} style={{ height: '35px' }}>
                                        {header.label}
                                        {sortConfig.key === header.key && (
                                          <span>{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
                                        )}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>

                                <tbody>
                                  {funds?.data?.funds.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
                                    <tr className="text-center" key={item.id}>
                                      <td>
                                        <input
                                          type="checkbox"
                                          checked={selectedRows.includes(item.id)}
                                          id={`checkbox_${item.id}`}
                                          onChange={() => handleCheckboxChange(item.id)}
                                        />
                                      </td>
                                      <td className="text-center"><Link href={`/Opcvm/${item.fundData?.id}`}>{item.fundData?.nom_fond}</Link></td>
                                      <td className={`text-center ${parseFloat(item.performanceData?.perfannu3an) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.performanceData?.perfannu3an)) ? '-' : parseFloat(item.performanceData?.perfannu3an).toFixed(2) + " %"}</td>
                                      <td className={`text-center `}>{isNaN(parseFloat(item.performanceData?.volatility3an)) ? '-' : parseFloat(item.performanceData?.volatility3an).toFixed(2) + " %"}</td>
                                      <td className={`text-center ${parseFloat(item.performanceData?.ratiosharpe3an) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.performanceData?.ratiosharpe3an)) ? '-' : parseFloat(item.performanceData?.ratiosharpe3an).toFixed(2)}</td>
                                      <td className={`text-center ${parseFloat(item.performanceData?.pertemax3an) < 0 ? 'text-danger' : 'text-success'}`}>  {isNaN(parseFloat(item.performanceData?.pertemax3an)) || parseFloat(item.performanceData?.pertemax3an) === 0
                                        ? '-'
                                        : parseFloat(item.performanceData?.pertemax3an).toFixed(2) + " %"}</td>
                                      <td className={`text-center`}>{isNaN(parseFloat(item.performanceData?.sortino3an)) ? '-' : parseFloat(item.performanceData?.sortino3an).toFixed(2)}</td>
                                      <td className={`text-center `}>{isNaN(parseFloat(item.performanceData?.info3an)) ? '-' : parseFloat(item.performanceData?.info3an).toFixed(2)}</td>
                                      <td>{item.fundData?.datemoispre}</td>

                                    </tr>
                                  ))}

                                </tbody>
                              </table>
                            </div>
                          )

                            : activeTab == 'tabPerfRatios5a' ? (
                              <div className="table-responsive">

                                <table
                                  id="example11"
                                  className="table-striped text-fade table-bordered table-hover display nowrap margin-top-10 w-p100">
                                  <thead className="table-header">
                                    <tr className="text-center">
                                      <th className="text-center"></th>
                                      {headers.tabPerfRatios5a.map((header) => (
                                        <th className="text-center" key={header.key} onClick={() => handleSort(header.key)} style={{ height: '35px' }}>
                                          {header.label}
                                          {sortConfig.key === header.key && (
                                            <span>{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
                                          )}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {funds?.data?.funds.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
                                      <tr className="text-center" key={item.id}>
                                        <td>
                                          <input
                                            type="checkbox"
                                            checked={selectedRows.includes(item.id)}
                                            id={`checkbox_${item.id}`}
                                            onChange={() => handleCheckboxChange(item.id)}
                                          />
                                        </td>
                                        <td className="text-center"><Link href={`/Opcvm/${item.fundData?.id}`}>{item.fundData?.nom_fond}</Link></td>
                                        <td className={`text-center ${parseFloat(item.performanceData?.perfannu5an) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.performanceData?.perfannu5an)) ? '-' : parseFloat(item.performanceData?.perfannu5an).toFixed(2) + " %"}</td>
                                        <td className={`text-center`}>{isNaN(parseFloat(item.performanceData?.volatility5an)) ? '-' : parseFloat(item.performanceData?.volatility5an).toFixed(2) + " %"}</td>
                                        <td className={`text-center ${parseFloat(item.performanceData?.ratiosharpe5an) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.performanceData?.ratiosharpe5an)) ? '-' : parseFloat(item.performanceData?.ratiosharpe5an).toFixed(2)}</td>
                                        <td className={`text-center ${parseFloat(item.performanceData?.pertemax5an) < 0 ? 'text-danger' : 'text-success'}`}>  {isNaN(parseFloat(item.performanceData?.pertemax5an)) || parseFloat(item.performanceData?.pertemax5an) === 0
                                          ? '-'
                                          : parseFloat(item.performanceData?.pertemax5an).toFixed(2) + " %"}</td>
                                        <td className={`text-center `}>{isNaN(parseFloat(item.performanceData?.sortino5an)) ? '-' : parseFloat(item.performanceData?.sortino5an).toFixed(2)}</td>
                                        <td className={`text-center `}>{isNaN(parseFloat(item.performanceData?.info5an)) ? '-' : parseFloat(item.performanceData?.info5an).toFixed(2)}</td>
                                        <td>{item.fundData?.datemoispre}</td>

                                      </tr>
                                    ))}

                                  </tbody>
                                </table>
                              </div>
                            )
                              : activeTab == 'tabFrais' ? (
                                <div className="table-responsive">

                                  <table
                                    id="example11"
                                    className="table-striped text-fade table-bordered table-hover display nowrap margin-top-10 w-p100">
                                    <thead className="table-header">
                                      <tr className="text-center">
                                        <th className="text-center"></th>
                                        {headers.tabFrais.map((header) => (
                                          <th className="text-center" key={header.key} onClick={() => handleSort(header.key)} style={{ height: '35px' }}>
                                            {header.label}
                                            {sortConfig.key === header.key && (
                                              <span>{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
                                            )}
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>

                                    <tbody>
                                      {funds?.data?.funds.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
                                        <tr className="text-center" key={item.id}>
                                          <td>
                                            <input
                                              type="checkbox"
                                              checked={selectedRows.includes(item.id)}
                                              id={`checkbox_${item.id}`}
                                              onChange={() => handleCheckboxChange(item.id)}
                                            />
                                          </td>
                                          <td className="text-center"><Link href={`/Opcvm/${item.fundData?.id}`}>{item.fundData?.nom_fond}</Link></td>
                                          <td>{item.fundData?.minimum_investissement}</td>
                                          <td>{item.fundData?.frais_gestion !== undefined ? (item.fundData.frais_gestion * 100).toFixed(2) + '%' : ''}</td>
                                          <td>{item.fundData?.frais_souscription !== undefined ? (item.fundData.frais_souscription * 100).toFixed(2) + '%' : ''}</td>
                                          <td>{item.fundData?.frais_rachat !== undefined ? (item.fundData.frais_rachat * 100).toFixed(2) + '%' : ''}</td>

                                        </tr>
                                      ))}

                                    </tbody>
                                  </table>
                                </div>
                              )
                                : activeTab == 'tabGestion' ? (
                                  <div className="table-responsive">

                                    <table
                                      id="example11"
                                      className="table-striped text-fade table-bordered table-hover display nowrap margin-top-10 w-p100">

                                      <thead className="table-header">
                                        <tr className="text-center">
                                          <th className="text-center"></th>
                                          {headers.tabGestion.map((header) => (
                                            <th className="text-center" key={header.key} onClick={() => handleSort(header.key)} style={{ height: '35px' }}>
                                              {header.label}
                                              {sortConfig.key === header.key && (
                                                <span>{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
                                              )}
                                            </th>
                                          ))}
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {funds?.data?.funds.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
                                          <tr className="text-center" key={item.id}>
                                            <td>
                                              <input
                                                type="checkbox"
                                                checked={selectedRows.includes(item.id)}
                                                id={`checkbox_${item.id}`}
                                                onChange={() => handleCheckboxChange(item.id)}
                                              />
                                            </td>
                                            <td className="text-center"><Link href={`/Opcvm/${item.fundData?.id}`}>{item.fundData?.nom_fond}</Link></td>
                                            <td className="text-center"><Link href={`/Fundmanager/${item.fundData?.societe_gestion.replace(/ /g, '-')}`}>{item.fundData?.societe_gestion}</Link></td>
                                            <td className="text-center">{item.fundData?.structure_fond}</td>
                                            <td className="text-center">{item.fundData?.categorie_national}</td>
                                            <td className="text-center">{item.fundData?.code_ISIN}</td>


                                          </tr>
                                        ))}

                                      </tbody>
                                    </table>
                                  </div>
                                ) : <div>
                                </div>}
                        <div className="text-center">


                          <div className="row justify-content-center">
                            <div className="col-2">
                              {currentPage < totalPages && (
                                <button
                                  style={{
                                    width: '150px',

                                    textDecoration: 'none',
                                    backgroundColor: '#6366f1',
                                    color: 'white',
                                    padding: '10px 20px',
                                    borderRadius: '5px',
                                  }}
                                  onClick={handleNextPage}
                                >
                                  Page suivante
                                </button>
                              )}
                            </div>
                            <div className="col-2 text-center">
                              {currentPage}/{totalPages}
                            </div>
                            <div className="col-2">
                              {currentPage > 1 && (
                                <button
                                  style={{
                                    width: '150px',

                                    textDecoration: 'none',
                                    backgroundColor: '#6366f1',
                                    color: 'white',
                                    padding: '10px 20px',
                                    borderRadius: '5px',
                                  }}
                                  onClick={handlePreviousPage}
                                >
                                  Page précédente
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="row justify-content-center">
                            <div className="col-12 text-center">
                              {funds && funds.data && funds.data.funds && funds.data.funds.length > 0 && (
                                <p>Nombre d éléments dans la liste : {funds.data.funds.length}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        {selectedRows.length > 0 && (
                          <div className="text-left">
                            <Link
                              href={{
                                pathname: '/Outils/comparaison/comparaisonview',
                                query: { selectedRows: selectedRows.join(',') }, // Passer les éléments sélectionnés comme paramètres de requête
                              }}
                              /*  as={`/about/${selectedRows ? selectedRows.join(',') : ''}`}
                                key={selectedRows.join(',')}*/
                              style={{
                                width: '150px',
                                textDecoration: 'none',
                                backgroundColor: '#6366f1',
                                color: 'white',
                                padding: '10px 20px',
                                borderRadius: '5px',
                              }}
                            >
                              &nbsp;&nbsp;&nbsp;    Comparaison &nbsp;&nbsp;&nbsp;
                            </Link>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>

                </div>



              </div>




            </div>
          </section >
        </div >

      </div >

    </Fragment >
  );
}