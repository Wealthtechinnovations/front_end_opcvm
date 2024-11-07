"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';


import Select, { MultiValue } from 'react-select';
//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import Header from '../../../Header';
import { urlconstant } from "../../../constants";
import { DropdownButton, Dropdown, Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

interface Option {
  value: string;
  // Autres propriétés si nécessaire
}
interface Funds {
  data: {
    funds: any[]; // ou un type spécifique pour les éléments du tableau 'funds'
  };
}
interface FondType {
  id: number;
  name: string;
  value: number;
}
async function getlastvl1() {
  const data = (
    await fetch(`${urlconstant}/api/searchFunds`)
  ).json();
  return data;
}


async function getFonds(selectedValues: any) {
  const data = (

    await fetch(`${urlconstant}/api/comparaison?query=${selectedValues}`, {
      method: 'GET', // Assurez-vous que la méthode HTTP correspond à votre API
    })
  ).json();
  return data;
}
interface PageProps {
  searchParams: {
    selectedRows: any;
  };
}
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get today's date and one year before today
const today = new Date();
const oneYearAgo = new Date();
oneYearAgo.setFullYear(today.getFullYear() - 1);

const startDateDefault = formatDate(oneYearAgo);
const endDateDefault = formatDate(today);

export default function Comparaisonview(props: PageProps) {
  let selectedValues = props?.searchParams?.selectedRows;
  const [endDate, setEndDate] = useState<string | null>(endDateDefault);
  const [startDate, setStartDate] = useState<string | null>(startDateDefault);
  const [funds, setFunds] = useState<Funds | null>(null);
  const [activeTab, setActiveTab] = useState("tabAccueil");
  const [base100Data, setBase100Data] = useState({}); // Nouvel état pour les données en base 100
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFond, setSelectedFond] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<MultiValue<Option>>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);  // Tableau pour stocker les lignes sélectionnées
  const [fundsOptions, setFundsOptions] = useState([]);
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const headers = {
    tabAccueil: [
      { label: 'Nom du fonds', key: 'nom_fond' },
      { label: 'Categorie', key: 'categorie_globale' },
      { label: 'Devise', key: 'dev_libelle' },
      { label: 'Categorie_nationale', key: 'categorie_national' },
      { label: 'YTD', key: 'perf1erJanvier' },
      { label: 'Perf Glissante 1A', key: 'perf1An' },
      { label: 'Perf Glissante 3A', key: 'perf3Ans' },
      { label: 'Date', key: 'datejour' },
    ],
    tabPerfCT: [
      { label: 'Nom du fonds', key: 'nom_fond' },
      { label: 'Categorie', key: 'categorie_globale' },
      { label: 'Devise', key: 'dev_libelle' },
      { label: 'YTD', key: 'perf1erJanvier' },
      { label: 'Perf Glissante 4S', key: 'perf4Semaines' },
      { label: 'Perf Glissante 3M', key: 'perf3Mois' },
      { label: 'Perf Glissante 6M', key: 'perf6Mois' },

      { label: 'Date', key: 'datejour' },],
    tabPerfMTLT: [
      { label: 'Nom du fonds', key: 'nom_fond' },
      { label: 'Devise', key: 'dev_libelle' },
      { label: 'Perf Glissante 1A', key: 'perf1An' },
      { label: 'Perf Glissante 3A', key: 'perf3Ans' },
      { label: 'Perf Glissante 5A', key: 'perf5Ans' },
      { label: 'Date', key: 'datejour' },],
    tabPerfRatios1a: [
      { label: 'Nom du fonds', key: 'nom_fond' },
      { label: 'Perf annualise', key: 'perfAnnualisee' },
      { label: 'Volatilité', key: 'volatility' },
      { label: 'Sharpe', key: 'ratioSharpe' },
      { label: 'Perte Max', key: 'maxDrawdown' },
      { label: 'Sortino', key: 'sortino' },
      { label: 'Ratio info', key: 'info' },
      { label: 'Date', key: 'datejour' },],
    tabPerfRatios3a: [
      { label: 'Nom du fonds', key: 'nom_fond' },
      { label: 'Perf annualise', key: 'perfAnnualisee' },
      { label: 'Volatilité', key: 'volatility' },
      { label: 'Sharpe', key: 'ratioSharpe' },
      { label: 'Perte Max', key: 'maxDrawdown' },
      { label: 'Sortino', key: 'sortino' },
      { label: 'Ratio info', key: 'info' },
      { label: 'Date', key: 'datejour' },],
    tabPerfRatios5a: [{ label: 'Nom du fonds', key: 'nom_fond' },
    { label: 'Perf annualise', key: 'perfAnnualisee' },
    { label: 'Volatilité', key: 'volatility' },
    { label: 'Sharpe', key: 'ratioSharpe' },
    { label: 'Perte Max', key: 'maxDrawdown' },
    { label: 'Sortino', key: 'sortino' },
    { label: 'Ratio info', key: 'info' },
    { label: 'Date', key: 'datejour' },],
    tabFrais: [
      { label: 'Nom du fonds', key: 'nom_fond' },
      { label: 'Invest min', key: 'categorie_globale' },
      { label: 'Devise', key: 'dev_libelle' },
      { label: 'YTD', key: 'perf1erJanvier' },
      { label: 'Perf Glissante 1 an', key: 'perf1An' },
      { label: 'Perf Glissante 3 ans', key: 'perf3Ans' },
      { label: 'Date', key: 'datejour' },],
    tabGestion: [
      { label: 'Nom du fonds', key: 'nom_fond' },
      { label: 'Categorie', key: 'categorie_globale' },
      { label: 'Devise', key: 'dev_libelle' },
      { label: 'YTD', key: 'perf1erJanvier' },
      { label: 'Perf Glissante 1 an', key: 'perf1An' },
      { label: 'Perf Glissante 3 ans', key: 'perf3Ans' },
      { label: 'Date', key: 'datejour' },],
  };

  const getSortClasses = (key: string) => {
    if (sortConfig.key === key) {
      return `text-right ${sortConfig.direction === 'asc' ? 'asc-icon' : 'desc-icon'}`;
    }
    return 'text-right';
  };
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [sortedFunds, setSortedFunds] = useState<Funds | null>(null); // État pour les fonds triés
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userConnected, setUserConnected] = useState<number | null>(null);
  const router = useRouter();

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
  const handleSort = (key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    if (funds && funds.data.funds) {
      // Créez une copie triée des fonds en utilisant la méthode sort()
      const sortedFundsCopy = [...funds.data.funds];
      sortedFundsCopy.sort((a, b) => {
        const aValue = a.firstData?.data[sortConfig.key];
        const bValue = b.firstData?.data[sortConfig.key];
        if (aValue < bValue) {
          return direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return direction === 'asc' ? 1 : -1;
        }
        return 0;
      });

      // Mettre à jour sortedFunds avec la version triée
      setSortedFunds({ data: { funds: sortedFundsCopy } });
      setFunds({ data: { funds: sortedFundsCopy } });
    }
  };
  const handleCheckboxChange = (itemId: any) => {
    if (selectedRows.includes(itemId)) {
      // L'élément est déjà sélectionné, donc le désélectionner
      setSelectedRows(selectedRows.filter((id) => id !== itemId));
      console.log("aaaaa")
      console.log(selectedRows)
    } else {
      console.log("bbbb")
      // L'élément n'est pas sélectionné, donc le sélectionner
      setSelectedRows(selectedRows.concat(itemId));
      console.log(selectedRows)

    }
  };


  const handleOkClick = () => {
    console.log(selectedValues)
    console.log(selectedOptions)

    const selectedValuess = selectedOptions ? selectedOptions.map((option: { value: any; }) => option.value).join(',') : '';
    const concatenatedValues = `${selectedValues},${selectedValuess}`;

    console.log(concatenatedValues)
    setTimeout(() => {
      const redirectUrl = `/Outils/comparaison/comparaisonview?selectedRows=${concatenatedValues}`;
      window.location.href = redirectUrl;  // This will navigate and refresh the page
    }, 1);

  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleFondSelect = (fond: any) => {

    setSelectedFond(fond.value);
    //setSelectedRows(selectedValues.concat(fond));
    console.log(selectedValues);
    console.log(fond);

  };
  const handleTabClick = (tabName: any) => {
    setActiveTab(tabName);
    console.log("Position de la nav : ", tabName);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getFonds(selectedValues);
        setFunds(data);

      } catch (error) {
        console.error('Erreur lors de l’appel à l’API :', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setFilterStartDate(startDate !== null ? String(startDate) : ''); // Convertit en chaîne si startDate n'est pas null
    setFilterEndDate(endDate !== null ? String(endDate) : ''); // Convertit en chaîne si endDate n'est pas null
  }, [startDate, endDate]);

  useEffect(() => {
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

        const data1 = await getlastvl1();
        console.log("data1")

        console.log(data1)
        const mappedOptions = data1?.data?.funds.map((funds: any) => ({

          value: funds.value,
          label: funds.label, // Replace with the actual property name
          // Replace with the actual property name
        }));
        setFundsOptions(mappedOptions);

        const data = await getFonds(selectedValues);

        const datasgraph = data.data.funds.map((fund: { fundData: any; graphData: any[]; id: any; }) => {
          const filteredData = fund?.graphData.filter(item => item.dates >= filterStartDate && item.dates <= filterEndDate);
          const initialVal = filteredData[0]?.values || 1;
          return {
            name: ` ${fund.fundData.nom_fond}`,
            data: filteredData.map(item => ({
              x: new Date(item.dates).getTime(),
              y: (item.values / initialVal) * 100,
            })),
          };
        });

        const series = datasgraph.map((item: { name: any; data: any[]; }) => ({
          name: item.name,
          data: item.data.map((dataItem: { x: any; y: any; }) => [dataItem.x, dataItem.y]),
        }));

        const options = {
          chart: { type: 'line' },
          title: { text: 'Courbe de tous les fonds' },
          xAxis: { type: 'datetime' },
          yAxis: { title: { text: 'Valeur' } },
          series: series,
        };

        setBase100Data(options);
        Swal.close(); // Close the loading popup

      } catch (error) {
        Swal.close(); // Close the loading popup

        console.error('Erreur lors de l’appel à l’API :', error);
      }
    }
    fetchData();
  }, [filterStartDate, filterEndDate]);
  console.log(funds);

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu1 = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLinksociete = () => {


    setTimeout(() => {
      const redirectUrl = `/Fundmanager/recherche`;

      router.push(redirectUrl);
    }, 1);


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

        router.push('/panel/portefeuille/login');
      }, 5);
    }
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
        <div className="container-full">
          {/* Main content */}
          <section className="content">
            <div className="row">


              <div className="col-10">
                <div className="box ">
                  <div className="box-body">
                    <div className="d-md justify-content-between align-items-center">
                      <div className="panel-heading p-b-0">
                        <div className="row row-no-gutters">


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
                        <p><span className="text-primary">Comparaison</span> | <span className="text-fade"></span></p>

                      </div>

                    </div>
                    <hr />




                    {/*<div>
                    <label htmlFor="textInput">Autre champ :</label>
                    <input
                      className="form-control"
                      type="text"
                      id="textInput"
                    />
                  </div>*/ }
                    <br></br>
                    <div className="row">
                      <div className="col-6">
                        <label>Date debut</label>
                        <input
                          type="date"
                          className="form-control"
                          value={startDate! || ''}
                          onChange={e => setStartDate(e.target.value)}
                        />
                      </div>

                      <div className="col-6">
                        <label>Date fin</label>
                        <input
                          type="date"
                          className="form-control"
                          value={endDate || ''}
                          onChange={e => setEndDate(e.target.value)}
                        />
                      </div>


                    </div>

                    <div>
                      {base100Data && (
                        <HighchartsReact
                          highcharts={Highcharts}
                          options={base100Data}
                        />
                      )}
                    </div>
                    <br />

                    <div>
                      <Button
                        className="btn btn-main"
                        style={{ width: "150px", backgroundColor: "#3b82f6", color: "white" }}
                        onClick={toggleMenu}
                      >
                        Ajouter un Fonds
                      </Button>

                      <Modal show={isOpen} onHide={toggleMenu}>
                        <Modal.Header closeButton>
                          <Modal.Title>Ajouter un Fonds</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <div className="row">
                            <div className="col-10 ">
                              <Select
                                className="select-component"
                                id="select"
                                isMulti
                                options={fundsOptions}
                                isSearchable
                                value={selectedOptions}
                                placeholder="Fond"
                                onChange={(selectedOption) => {
                                  setSelectedOptions(selectedOption);
                                  handleFondSelect(selectedOption);
                                }}
                              />
                            </div>
                            <div className="col-2 input-group-append">
                              <button
                                className="btn btn-main"
                                style={{
                                  textDecoration: 'none',
                                  backgroundColor: '#6366f1',
                                  color: 'white',
                                  padding: '10px 20px',
                                  borderRadius: '5px',
                                }}
                                onClick={handleOkClick}
                              >
                                OK
                              </button>
                            </div>
                          </div>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={toggleMenu}>
                            Close
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </div>
                    <div className="row text-center">
                      <div className="btn-group" style={{ display: "inline-block" }}>
                        <button
                          className={`btn btn-main ${activeTab === "tabAccueil" ? "active" : ""} `}
                          style={activeTab === "tabAccueil" ? { width: "150px", backgroundColor: "#3b82f6", color: "white" } : {}}
                          onClick={() => handleTabClick("tabAccueil")}
                        >
                          Accueil
                        </button>
                        <button
                          className={`btn btn-main ${activeTab === "tabPerfCT" ? "active" : ""}`}
                          style={activeTab === "tabPerfCT" ? { width: "150px", backgroundColor: "#3b82f6", color: "white" } : {}}
                          onClick={() => handleTabClick("tabPerfCT")}
                        >
                          Perf CT
                        </button>
                        <button
                          className={`btn btn-main ${activeTab === "tabPerfMTLT" ? "active" : ""}`}
                          style={activeTab === "tabPerfMTLT" ? { width: "150px", backgroundColor: "#3b82f6", color: "white" } : {}}
                          onClick={() => handleTabClick("tabPerfMTLT")}
                        >
                          Perf MT / LT
                        </button>
                        <button
                          className={`btn btn-main ${activeTab === "tabPerfRatios1a" ? "active" : ""}`}
                          style={activeTab === "tabPerfRatios1a" ? { width: "150px", backgroundColor: "#3b82f6", color: "white" } : {}}
                          onClick={() => handleTabClick("tabPerfRatios1a")}
                        >
                          Ratios 1A
                        </button>
                        <button
                          className={`btn btn-main ${activeTab === "tabPerfRatios3a" ? "active" : ""}`}
                          style={activeTab === "tabPerfRatios3a" ? { width: "150px", backgroundColor: "#3b82f6", color: "white" } : {}}
                          onClick={() => handleTabClick("tabPerfRatios3a")}
                        >
                          Ratios 3A
                        </button>
                        <button
                          className={`btn btn-main ${activeTab === "tabPerfRatios5a" ? "active" : ""}`}
                          style={activeTab === "tabPerfRatios5a" ? { width: "150px", backgroundColor: "#3b82f6", color: "white" } : {}}
                          onClick={() => handleTabClick("tabPerfRatios5a")}
                        >
                          Ratios 5A
                        </button>
                        <button
                          className={`btn btn-main ${activeTab === "tabFrais" ? "active" : ""}`}
                          style={activeTab === "tabFrais" ? { width: "150px", backgroundColor: "#3b82f6", color: "white" } : {}}
                          onClick={() => handleTabClick("tabFrais")}
                        >
                          Frais
                        </button>
                        <button
                          className={`btn btn-main ${activeTab === "tabGestion" ? "active" : ""}`}
                          style={activeTab === "tabGestion" ? { width: "150px", backgroundColor: "#3b82f6", color: "white" } : {}}
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

                      {activeTab == 'tabAccueil' ? (
                        <div className="table-responsive">

                          <table
                            id="example11"
                            className="table text-fade table-bordered table-hover display nowrap margin-top-10 w-p100">
                            <thead className="table-header">
                              <tr className="text-right">

                                {headers.tabAccueil.map((header) => (
                                  <th className="text-right" key={header.key} onClick={() => handleSort(header.key)} style={{ height: '35px' }}>
                                    {header.label}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {funds?.data?.funds.map((item) => (
                                <tr className="text-right" key={item.id}>

                                  <td className="text-left"><Link href={`/Opcvm/${item.fundData?.id}`}>{item.fundData?.nom_fond}</Link></td>
                                  <td>{item.fundData?.categorie_globale}</td>
                                  <td>{item.fundData?.dev_libelle}</td>
                                  <td >{item.fundData?.categorie_national}</td>
                                  <td className={`text-right ${parseFloat(item.firstData?.data?.perf1erJanvier) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.firstData?.data?.perf1erJanvier)) ? '-' : parseFloat(item.firstData?.data?.perf1erJanvier).toFixed(2)} %</td>
                                  <td className={`text-right ${parseFloat(item.firstData?.data?.perf1An) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.firstData?.data?.perf1An)) ? '-' : parseFloat(item.firstData?.data?.perf1An).toFixed(2)} %</td>
                                  <td className={`text-right ${parseFloat(item.firstData?.data?.perf3Ans) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.firstData?.data?.perf3Ans)) ? '-' : parseFloat(item.firstData?.data?.perf3Ans).toFixed(2)} %</td>
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
                            className="table text-fade table-bordered table-hover display nowrap margin-top-10 w-p100">
                            <thead className="table-header">
                              <tr className="text-right">

                                {headers.tabPerfCT.map((header) => (
                                  <th className="text-right" key={header.key} onClick={() => handleSort(header.key)} style={{ height: '35px' }}>
                                    {header.label}
                                  </th>
                                ))}
                              </tr>
                            </thead>

                            <tbody>
                              {funds?.data?.funds.map((item) => (
                                <tr className="text-right" key={item.id}>

                                  <td className="text-left"><Link href={`/Opcvm/${item.fundData?.id}`}>{item.fundData?.nom_fond}</Link></td>
                                  <td>{item.fundData?.categorie_globale}</td>
                                  <td>{item.fundData?.dev_libelle}</td>
                                  <td className={`text-right ${parseFloat(item.firstData?.data?.perf1erJanvier) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.firstData?.data?.perf1erJanvier)) ? '-' : parseFloat(item.firstData?.data?.perf1erJanvier).toFixed(2)} %</td>
                                  <td className={`text-right ${parseFloat(item.firstData?.data?.perf4Semaines) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.firstData?.data?.perf4Semaines)) ? '-' : parseFloat(item.firstData?.data?.perf4Semaines).toFixed(2)} %</td>
                                  <td className={`text-right ${parseFloat(item.firstData?.data?.perf3Mois) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.firstData?.data?.perf3Mois)) ? '-' : parseFloat(item.firstData?.data?.perf3Mois).toFixed(2)} %</td>
                                  <td className={`text-right ${parseFloat(item.firstData?.data?.perf6Mois) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.firstData?.data?.perf6Mois)) ? '-' : parseFloat(item.firstData?.data?.perf6Mois).toFixed(2)} %</td>

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
                            className="table text-fade table-bordered table-hover display nowrap margin-top-10 w-p100">
                            <thead className="table-header">
                              <tr className="text-right">

                                {headers.tabPerfMTLT.map((header) => (
                                  <th className="text-right" key={header.key} onClick={() => handleSort(header.key)} style={{ height: '35px' }}>
                                    {header.label}
                                  </th>
                                ))}
                              </tr>
                            </thead>

                            <tbody>
                              {funds?.data?.funds.map((item) => (
                                <tr className="text-right" key={item.id}>

                                  <td className="text-left"><Link href={`/Opcvm/${item.fundData?.id}`}>{item.fundData?.nom_fond}</Link></td>
                                  <td>{item.fundData?.dev_libelle}</td>
                                  <td className={`text-right ${parseFloat(item.firstData?.data?.perf1An) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.firstData?.data?.perf1An)) ? '-' : parseFloat(item.firstData?.data?.perf1An).toFixed(2)} %</td>
                                  <td className={`text-right ${parseFloat(item.firstData?.data?.perf3Ans) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.firstData?.data?.perf3Ans)) ? '-' : parseFloat(item.firstData?.data?.perf3Ans).toFixed(2)} %</td>
                                  <td className={`text-right ${parseFloat(item.firstData?.data?.perf5Ans) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.firstData?.data?.perf5Ans)) ? '-' : parseFloat(item.firstData?.data?.perf5Ans).toFixed(2)} %</td>

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
                            className="table text-fade table-bordered table-hover display nowrap margin-top-10 w-p100">
                            <thead className="table-header">
                              <tr className="text-right">

                                {headers.tabPerfRatios1a.map((header) => (
                                  <th className="text-right" key={header.key} onClick={() => handleSort(header.key)} style={{ height: '35px' }}>
                                    {header.label}
                                  </th>
                                ))}
                              </tr>
                            </thead>

                            <tbody>
                              {funds?.data?.funds.map((item) => (
                                <tr className="text-right" key={item.id}>

                                  <td className="text-left"><Link href={`/Opcvm/${item.fundData?.id}`}>{item.fundData?.nom_fond}</Link></td>
                                  <td className={`text-right ${parseFloat(item.secondData?.data?.perfAnnualisee) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.secondData?.data?.perfAnnualisee)) ? '-' : parseFloat(item.secondData?.data?.perfAnnualisee).toFixed(2)} %</td>
                                  <td className={`text-right ${parseFloat(item.secondData?.data?.volatility) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.secondData?.data?.volatility)) ? '-' : parseFloat(item.secondData?.data?.volatility).toFixed(2)} %</td>
                                  <td className={`text-right ${parseFloat(item.secondData?.data?.ratioSharpe) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.secondData?.data?.ratioSharpe)) ? '-' : parseFloat(item.secondData?.data?.ratioSharpe).toFixed(2)} %</td>
                                  <td className={`text-right ${parseFloat(item.secondData?.data?.maxDrawdown) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.secondData?.data?.maxDrawdown)) ? '-' : parseFloat(item.secondData?.data?.maxDrawdown).toFixed(2)} %</td>
                                  <td className={`text-right ${parseFloat(item.secondData?.data?.sortino) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.secondData?.data?.sortino)) ? '-' : parseFloat(item.secondData?.data?.sortino).toFixed(2)} %</td>
                                  <td className={`text-right ${parseFloat(item.secondData?.data?.info) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.secondData?.data?.info)) ? '-' : parseFloat(item.secondData?.data?.info).toFixed(2)} %</td>
                                  <td>{item?.firstData?.data?.lastdatepreviousmonth}</td>

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
                              className="table text-fade table-bordered table-hover display nowrap margin-top-10 w-p100">
                              <thead className="table-header">
                                <tr className="text-right">

                                  {headers.tabPerfRatios3a.map((header) => (
                                    <th className="text-right" key={header.key} onClick={() => handleSort(header.key)} style={{ height: '35px' }}>
                                      {header.label}
                                    </th>
                                  ))}
                                </tr>
                              </thead>

                              <tbody>
                                {funds?.data?.funds.map((item) => (
                                  <tr className="text-right" key={item.id}>

                                    <td className="text-left"><Link href={`/Opcvm/${item.fundData?.id}`}>{item.fundData?.nom_fond}</Link></td>
                                    <td className={`text-right ${parseFloat(item.thirdData?.data?.perfAnnualisee) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.thirdData?.data?.perfAnnualisee)) ? '-' : parseFloat(item.thirdData?.data?.perfAnnualisee).toFixed(2)} %</td>
                                    <td className={`text-right ${parseFloat(item.thirdData?.data?.volatility) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.thirdData?.data?.volatility)) ? '-' : parseFloat(item.thirdData?.data?.volatility).toFixed(2)} %</td>
                                    <td className={`text-right ${parseFloat(item.thirdData?.data?.ratioSharpe) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.thirdData?.data?.ratioSharpe)) ? '-' : parseFloat(item.thirdData?.data?.ratioSharpe).toFixed(2)} %</td>
                                    <td className={`text-right ${parseFloat(item.thirdData?.data?.maxDrawdown) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.thirdData?.data?.maxDrawdown)) ? '-' : parseFloat(item.thirdData?.data?.maxDrawdown).toFixed(2)} %</td>
                                    <td className={`text-right ${parseFloat(item.thirdData?.data?.sortino) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.thirdData?.data?.sortino)) ? '-' : parseFloat(item.thirdData?.data?.sortino).toFixed(2)} %</td>
                                    <td className={`text-right ${parseFloat(item.thirdData?.data?.info) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.thirdData?.data?.info)) ? '-' : parseFloat(item.thirdData?.data?.info).toFixed(2)} %</td>
                                    <td>{item?.firstData?.data?.lastdatepreviousmonth}</td>

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
                                className="table text-fade table-bordered table-hover display nowrap margin-top-10 w-p100">
                                <thead className="table-header">
                                  <tr className="text-right">

                                    {headers.tabPerfRatios5a.map((header) => (
                                      <th className="text-right" key={header.key} onClick={() => handleSort(header.key)} style={{ height: '35px' }}>
                                        {header.label}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>

                                <tbody>
                                  {funds?.data?.funds.map((item) => (
                                    <tr className="text-right" key={item.id}>

                                      <td className="text-left"><Link href={`/Opcvm/${item.fundData?.id}`}>{item.fundData?.nom_fond}</Link></td>
                                      <td className={`text-right ${parseFloat(item.fourthData?.data?.perfAnnualisee) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.fourthData?.data?.perfAnnualisee)) ? '-' : parseFloat(item.fourthData?.data?.perfAnnualisee).toFixed(2)} %</td>
                                      <td className={`text-right ${parseFloat(item.fourthData?.data?.volatility) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.fourthData?.data?.volatility)) ? '-' : parseFloat(item.fourthData?.data?.volatility).toFixed(2)} %</td>
                                      <td className={`text-right ${parseFloat(item.fourthData?.data?.ratioSharpe) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.fourthData?.data?.ratioSharpe)) ? '-' : parseFloat(item.fourthData?.data?.ratioSharpe).toFixed(2)} %</td>
                                      <td className={`text-right ${parseFloat(item.fourthData?.data?.maxDrawdown) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.fourthData?.data?.maxDrawdown)) ? '-' : parseFloat(item.fourthData?.data?.maxDrawdown).toFixed(2)} %</td>
                                      <td className={`text-right ${parseFloat(item.fourthData?.data?.sortino) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.fourthData?.data?.sortino)) ? '-' : parseFloat(item.fourthData?.data?.sortino).toFixed(2)} %</td>
                                      <td className={`text-right ${parseFloat(item.fourthData?.data?.info) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(item.fourthData?.data?.info)) ? '-' : parseFloat(item.fourthData?.data?.info).toFixed(2)} %</td>
                                      <td>{item?.firstData?.data?.lastdatepreviousmonth}</td>

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
                                  className="table text-fade table-bordered table-hover display nowrap margin-top-10 w-p100">
                                  <thead className="table-header">
                                    <tr className="text-right">
                                      <th className="text-right" style={{ height: '35px' }}>Nom du fonds </th>
                                      <th className="text-right" style={{ height: '35px' }}>Invest min</th>
                                      <th className="text-right" style={{ height: '35px' }}>Gestion</th>
                                      <th className="text-right" style={{ height: '35px' }}>Souscription</th>
                                      <th className="text-right" style={{ height: '35px' }}>Rachat</th>




                                    </tr>
                                  </thead>

                                  <tbody>
                                    {funds?.data?.funds.map((item) => (
                                      <tr className="text-right" key={item.id}>

                                        <td className="text-left"><Link href={`/Opcvm/${item.fundData?.id}`}>{item.fundData?.nom_fond}</Link></td>
                                        <td>{item.fundData?.minimum_investissement}</td>
                                        <td>{item.fundData?.frais_gestion}</td>
                                        <td>{item.fundData?.frais_souscription}</td>
                                        <td>{item.fundData?.frais_rachat}</td>


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
                                    className="table text-fade table-bordered table-hover display nowrap margin-top-10 w-p100">

                                    <thead className="table-header">
                                      <tr className="text-right">
                                        <th className="text-right" style={{ height: '35px' }}>Nom du fonds </th>
                                        <th className="text-right" style={{ height: '35px' }}>Societe de gestion</th>
                                        <th className="text-right" style={{ height: '35px' }}>Type</th>
                                        <th className="text-right" style={{ height: '35px' }}>Categorie</th>
                                        <th className="text-right" style={{ height: '35px' }}>Code ISIN</th>




                                      </tr>
                                    </thead>
                                    <tbody>
                                      {funds?.data?.funds.map((item) => (
                                        <tr className="text-right" key={item.id}>

                                          <td className="text-left"><Link href={`/Opcvm/${item.fundData?.id}`}>{item.fundData?.nom_fond}</Link></td>
                                          <td className="text-left"><Link href={`/Fundmanager/${item.fundData?.societe_gestion.replace(/ /g, '-')}`}>{item.fundData?.societe_gestion}</Link></td>
                                          <td className="text-left">Fonds</td>
                                          <td className="text-left">{item.fundData?.categorie_libelle}</td>
                                          <td className="text-left">{item.fundData?.code_ISIN}</td>


                                        </tr>
                                      ))}

                                    </tbody>
                                  </table>
                                </div>
                              )/* : activeTab == 'tabISR' ? (
                                  <div className="table-responsive">

                                    <table
                                      id="example11"
                                      className="table text-fade table-bordered table-hover display nowrap margin-top-10 w-p100">
                                      <thead className="table-header">
                                        <tr className="text-right">
                                          
                                          <th className="text-right">Nom du fonds </th>
                                          <th className="text-right">Perf annualise</th>
                                          <th className="text-right">Volatilité</th>
                                          <th className="text-right">Sharpe</th>
                                          <th className="text-right">Perte Max</th>
                                          <th className="text-right">Sortino</th>
                                          <th className="text-right">Ratio info</th>
                                          <th className="text-right">Date</th>



                                        </tr>
                                      </thead>
                                      <tbody>
                                        {funds?.data?.funds.map((item) => (
                                          <tr className="text-right" key={item.id}>
                                            <td>
                                              <input
                                                type="checkbox"
                                                checked={selectedRows.includes(item.id)}
                                                id={`checkbox_${item.id}`}
                                                onChange={() => handleCheckboxChange(item.id)}
                                              />
                                            </td>
                                            <td className="text-left">Fonds</td>
                                            <td>1,24 %</td>
                                            <td>1,09 %</td>
                                            <td>2,23 %</td>
                                            <td>-2,25 %</td>
                                            <td>1,17 %</td>
                                            <td>2,97 %</td>
                                            <td>-3,32 %</td>
                                            <td>25,74 %</td>
                                            <td>40,75 %</td>
                                            <td>73,50 %</td>
                                          </tr>
                                        ))}

                                      </tbody>
                                    </table>
                                  </div>
                                ) */: <div>
                                </div>}
                      <div className="text-right">

                      </div>
                    </div>

                  </div>


                </div>



              </div>
              <div className="col-2">
                <div className="box ">
                  <div className="box-body">
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />

                    <br />

                    <br />

                    <br />


                  </div>
                </div>
              </div>
            </div>




          </section>
        </div>

      </div >

    </Fragment >
  );
}