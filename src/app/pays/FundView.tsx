"use client";

import Link from "next/link";
import { Fragment, SetStateAction, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Modal, Button } from 'react-bootstrap'; // Assurez-vous d'importer les composants de Bootstrap nécessaires
import { DropdownButton, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import Select, { SingleValue } from 'react-select';
//import * as XLSX from 'xlsx';
import Header from '../Header';
import { urlconstant, urlsite } from "@/app/constants";
import { color } from "highcharts";
interface Societe {
  value: any[]; // ou un type spécifique pour les éléments du tableau 'funds'
  label: any[]; // ou un type spécifique pour les éléments du tableau 'funds'

}
interface Funds {
  data: {
    countriesWithCompanies: any[]; // ou un type spécifique pour les éléments du tableau 'funds'
  };
}

interface Pays {
  value: string; // ou un type spécifique pour les éléments du tableau 'funds'

}
interface Option {
  value: string;
  label: string;
}
interface FormData {
  societe?: Option;
  categorie?: Option;
}

async function getlastvl1() {
  const data = (
    await fetch(`${urlconstant}/api/searchFunds`)
  ).json();
  return data;
}
async function getpays() {
  const data = (
    await fetch(`${urlconstant}/api/getPaysall`)
  ).json();
  return data;
}
export default function Comparaison() {
  const headers = {
    tabAccueil: [
      { label: 'Nom', key: 'pays' },
      { label: 'Nombre de societé', key: 'companyCount' },
      { label: 'Nombre de fonds', key: 'fondscount' },
      { label: 'Encours', key: 'encours' },

    ],

  };
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [selectedOptions1, setSelectedOptions1] = useState<SingleValue<Option> | null>(null);
  const [selectedOptions2, setSelectedOptions2] = useState<SingleValue<Option> | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]); // Tableau pour stocker les lignes sélectionnées
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [sortedFunds, setSortedFunds] = useState<Funds | null>(null); // État pour les fonds triés
  const [searchResults, setSearchResults] = useState([]); // État pour stocker les résultats de la recherche
  const [error, setError] = useState(""); // État pour stocker le message d'erreur
  const [optionsPays, setOptionsPays] = useState([]);

  const [selectedPays, setSelectedPays] = useState<Pays | null>(null);



  const [textInput, setTextInput] = useState('');
  const [fundsOptions, setFundsOptions] = useState([]);
  const [pays, setPays] = useState<Funds | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleClosePopup = () => setShowPopup(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    const formData: FormData = {}; // Initialisation de l'objet formData

    // Ajouter les valeurs des critères "Sharpe" à l'objet formData

    setError("");

    // Traitez les données du formulaire ici (selectedOptions et textInput)
    console.log('Options sélectionnées :', formData);

    if (selectedPays) {

      const filteredPays = pays?.data.countriesWithCompanies.filter(paysOption => paysOption.pays === selectedPays) as any[];
      console.log(filteredPays);
      if (filteredPays.length > 0) {
        setPays({ data: { countriesWithCompanies: filteredPays } });
      } else {

      }
    } else {

    }
  };




  const [activeTab, setActiveTab] = useState("tabAccueil");

  const handleTabClick = (tabName: any) => {
    setActiveTab(tabName);
    console.log("Position de la nav : ", tabName);
  };

  const handleItemsPerPageChange = (e: { target: { value: string; }; }) => {
    const selectedValue = parseInt(e.target.value, 10);

    if (selectedValue === 100) {
      setShowPopup(true);
      setItemsPerPage(20);
      setCurrentPage(1);

    } else {

      setItemsPerPage(selectedValue);
      setCurrentPage(1);
    } // Reset to the fi
  };
  const [post, setPost] = useState(null);
  const [userConnected, setUserConnected] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
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
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, settotalPages] = useState(1);
  var totalItems: any;

  useEffect(() => {


    console.log("Position de la nav : ", activeTab);

    // Appel à l'API lors du premier rendu du composant
    async function fetchData() {
      try {
        /* const data = await getlastvl();
         setPost(data);*/
        const data = await getpays();

        setPays(data);
        console.log(data);
        totalItems = data?.data?.countriesWithCompanies.length || 0;
        console.log(Math.ceil(totalItems / itemsPerPage))
        settotalPages(Math.ceil(totalItems / itemsPerPage));
        const mappedOptions = data?.data.countriesWithCompanies.map((funds: any) => ({

          value: funds.pays,
          label: funds.pays, // Replace with the actual property name
          // Replace with the actual property name
        }));
        setOptionsPays(mappedOptions);

        console.log(fundsOptions);



      } catch (error) {
        console.error("Erreur lors de l'appel à l'API :", error);
      }
    }
    fetchData();
  }, [activeTab]);
  const handlePaysChange = (selectedOption: any) => {
    console.log(selectedOption)
    setSelectedPays(selectedOption.value); // Met à jour l'état selectedPays avec la nouvelle sélection
  };

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


  const handleSort = (key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
      console.log('ghhghhh')

    }
    setSortConfig({ key, direction });

    if (pays && pays.data.countriesWithCompanies) {

      // Créez une copie triée des fonds en utilisant la méthode sort()
      const sortedFundsCopy = [...pays.data.countriesWithCompanies];
      const filteredFunds = sortedFundsCopy.filter(item => item[sortConfig.key] !== '-');
      console.log(filteredFunds)

      filteredFunds.sort((a, b) => {
        console.log("filteredFunds")

        if (sortConfig.key == "nom" || sortConfig.key == "pays") {
          const aValue = a[sortConfig.key];
          const bValue = b[sortConfig.key];
          if (aValue < bValue) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          } else if (aValue > bValue) {
            return sortConfig.direction === 'asc' ? 1 : -1;
          } else {
            return 0;
          }

        } else {
          console.log("filteredFunds")

          const aValue = a[sortConfig.key];
          const bValue = b[sortConfig.key];
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
      setSortedFunds({ data: { countriesWithCompanies: filteredFunds } });
      setPays({ data: { countriesWithCompanies: filteredFunds } });
    }
  };

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const router = useRouter();


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

  
  const [isHoveredc, setIsHoveredc] = useState(false);

  const handleMouseEnterc = () => {
      setIsHoveredc(true);
  };

  const handleMouseLeavec = () => {
      setIsHoveredc(false);
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

                        <div className="text-center">
                          <div className="col-md-6 mx-auto">


                            <label>
                              pays :
                            </label>

                            <Select className="select-component"
                              options={optionsPays}
                              value={selectedPays?.value}
                              onChange={handlePaysChange}
                              placeholder="Sélectionnez un pays"
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
                        <div className=" text-center">
                          <button style={{ width: '150px', backgroundColor: "#3b82f6", color: "white" }} className="btn btn-main">Rechercher</button>
                        </div>
                      </form>
                      {error && <div className=" text-center error-message" style={{ color: "red" }}>{error}</div>}

                      {/* Affichez les résultats de la recherche */}
                      {searchResults.length > 0 && (
                        <div className="search-results">
                          {/* Affichez les résultats ici */}
                          {/* ... */}
                        </div>
                      )}
                      <br />
                      <div className="row text-center">
                        <br />
                        <div className="text-center ">
                          <label>Nombre de ligne par page:</label>
                          <select
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                          >
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                          </select>
                        </div>

                        <div className="text-center">
                          <br />
                          <button
                            className={`btn btn-main active}`}
                            style={{ width: '150px', backgroundColor: "#3b82f6", color: "white" }}
                          // onClick={exportTableToCSV}
                          >
                            Exporter
                          </button>
                        </div>

                        <div className="table-responsive">

                          <table
                            id="example11"
                            className="table-striped  text-fade table-bordered table-hover display nowrap margin-top-10 w-p100">
                            <thead className="table-header">
                              <tr className="text-center">
                                {headers.tabAccueil.map((header) => (
                                  <th className="text-center" style={{ height: '35px' }} key={header.key} onClick={() => handleSort(header.key)}>
                                    {header.label}
                                    {sortConfig.key === header.key && (
                                      <span>{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
                                    )}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {pays?.data.countriesWithCompanies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
                                <tr className="text-center" key={item.id}>
                                  <td className="text-center"><Link href={`/pays/${encodeURIComponent(item.pays.replace(/ /g, '-'))}`}>{item?.pays}</Link></td>
                                  <td className="text-center">{item?.companyCount}</td>
                                  <td className="text-center">{item?.fondscount}</td>
                                  <td className="text-center">0</td>
                                </tr>
                              ))}

                            </tbody>
                          </table>
                        </div>


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
                        </div>

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


/*
function exportTableToCSV() {
  // Sélectionnez le tableau HTML par son ID
  var table = document.getElementById("example");

  // Créez une chaîne vide pour stocker les données CSV
  var csv = [];

  // Parcourez les lignes du tableau
  for (var i = 0; i < table?.rows.length; i++) {
    var row = [];
    var cells = table?.rows[i].querySelectorAll("td, th");

    // Parcourez les cellules de chaque ligne
    for (var j = 0; j < cells.length; j++) {
      row.push(cells[j].textContent);
    }

    // Joignez les valeurs de la ligne avec des virgules pour créer une ligne CSV
    csv.push(row.join(","));
  }

  // Joignez les lignes CSV avec des sauts de ligne
  var csvString = csv.join("\n");

  // Créez un objet Blob pour le fichier CSV
  var blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });

  // Générez un URL pour le Blob
  var url = URL.createObjectURL(blob);

  // Créez un élément d'ancrage pour le téléchargement du fichier
  var link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "tableau.csv");

  // Cliquez sur le lien pour déclencher le téléchargement
  link.click();
}*/
/*
function exportTableToXLSX() {
  // Sélectionnez le tableau HTML par son ID
  var table = document.getElementById("example");

  // Créez un objet Workbook
  var wb = XLSX.utils.table_to_book(table);

  // Générez un blob à partir du Workbook
  const blob = XLSX.write(wb, { bookType: 'xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', type: 'blob' });

  // Créez un URL pour le Blob
  var url = URL.createObjectURL(blob);

  // Créez un élément d'ancrage pour le téléchargement du fichier
  var link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "tableau.xlsx");

  // Cliquez sur le lien pour déclencher le téléchargement
  link.click();
}
*/