"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Modal, Button } from 'react-bootstrap'; // Assurez-vous d'importer les composants de Bootstrap nécessaires
import { DropdownButton, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import Select, { SingleValue } from 'react-select';
//import * as XLSX from 'xlsx';
import Head from 'next/head';

import Header from '../../../Header';
import { urlconstant, urlsite } from "@/app/constants";
import { color } from "highcharts";
import Swal from "sweetalert2";

interface Societe {
  value: any[]; // ou un type spécifique pour les éléments du tableau 'funds'
  label: any[]; // ou un type spécifique pour les éléments du tableau 'funds'

}
interface Funds {
  data: {
    societes: any[]; // ou un type spécifique pour les éléments du tableau 'funds'
  };
}
async function getsociete() {
  const data = (
    await fetch(`${urlconstant}/api/getsocieterecherche`)
  ).json();
  return data;
}
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





  // Ajoutez plus d'options au besoin
];

const optionsSociete = [
  { value: "WINEO GESTION", label: 'WINEO GESTION' },
  { value: "WAFA GESTION", label: 'WAFA GESTION' },
  { value: "TWIN CAPITAL GESTION", label: 'TWIN CAPITAL GESTION' },
  { value: "CFG GESTION", label: 'CFG GESTION' }

  // Ajoutez plus d'options au besoin
];
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
    await fetch(`${urlconstant}/api/getPays`)
  ).json();
  return data;
}
interface PageProps {
  params: {
    fondId: string;
  };
}
export default function Comparaison(props: PageProps) {
  const headers = {
    tabAccueil: [
      { label: 'Nom', key: 'nom' },
      { label: 'Pays', key: 'pays' },
      { label: 'Nombre de fonds', key: 'nombreFonds' },
      { label: 'En cours', key: 'sommeActifNet' },
    ],

  };
  const id = props.params.fondId.replace(/-/g, ' ');

  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [selectedOptions1, setSelectedOptions1] = useState<SingleValue<Option> | null>(null);
  const [selectedOptions2, setSelectedOptions2] = useState<SingleValue<Option> | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]); // Tableau pour stocker les lignes sélectionnées
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [sortedFunds, setSortedFunds] = useState<Funds | null>(null); // État pour les fonds triés
  const [searchResults, setSearchResults] = useState([]); // État pour stocker les résultats de la recherche
  const [error, setError] = useState(""); // État pour stocker le message d'erreur
  const [optionsSociete, setOptionsSociete] = useState([]);
  const [selectedSociete, setSelectedSociete] = useState<Option[]>([]);
  const [optionsPays, setOptionsPays] = useState([]);

  const [selectedPays, setSelectedPays] = useState<Pays | null>(null);



  const [textInput, setTextInput] = useState('');
  const [fundsOptions, setFundsOptions] = useState([]);
  const [funds, setFunds] = useState<Funds | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleClosePopup = () => setShowPopup(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    setFunds({ data: { societes: [] } });
    const formData: FormData = {}; // Initialisation de l'objet formData
    let selectedpays;
    // Ajouter les valeurs des critères "Sharpe" à l'objet formData
    if (selectedOptions1) {


      selectedpays = selectedOptions1.value;
    }

    setError("");
    Swal.fire({
      title: 'Veuillez patienter',
      html: 'Chargement des résultats en cours...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    // Traitez les données du formulaire ici (selectedOptions et textInput)
    console.log('Options sélectionnées :', formData);
    console.log('Texte saisi :', selectedPays);
    const selectedValues = selectedSociete.map(option => option?.value);
    fetch(`${urlconstant}/api/listesocietepays/${id}?query=${selectedValues.join(',')}`, {
      method: 'POST', // Assurez-vous que la méthode HTTP correspond à votre API
      headers: {
        'Content-Type': 'application/json', // Spécifiez le type de contenu JSON
      },
      body: JSON.stringify({ formData }), // Convertissez formData en format JSON
    })
      .then(response => response.json())
      .then(data => {
        if (data && data.code === 200) {
          Swal.close(); // Close the loading popup
          setFunds(data);
          console.log(data)
          console.log("data")

        } else {
          // Affichez un message d'erreur ici
          setError("Aucun résultat trouvé. Réessayez avec d'autres critères.");

          console.error('Aucun fonds trouvé ou erreur de l\'API.');
        }

        // Traitez la réponse de l'API ici
        console.log('Réponse de l\'API :', data);
      })
      .catch(error => {
        console.error('Erreur lors de l\'appel de l\'API :', error);
      });
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


    console.log("Position de la nav : ", activeTab);

    // Appel à l'API lors du premier rendu du composant
    async function fetchData() {
      try {
        /* const data = await getlastvl();
         setPost(data);*/
        Swal.fire({
          title: 'Veuillez patienter',
          html: 'Chargement des résultats en cours...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        const data = await getpays();
        const mappedOptions = data?.data.paysOptions.map((funds: any) => ({

          value: funds.value,
          label: funds.label, // Replace with the actual property name
          // Replace with the actual property name
        }));
        setOptionsPays(mappedOptions);


        console.log(fundsOptions);
        const data2 = await getsociete();
        const mappedOptions2 = data2?.data.societes.map((funds: any) => ({

          value: funds.nom,
          label: funds.nom, // Replace with the actual property name
          // Replace with the actual property name
        }));
        setOptionsSociete(mappedOptions2);

        const response = await fetch(`${urlconstant}/api/listesocietepays/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          //body: JSON.stringify(requestBody),
        });

        const responseData = await response.json();
        if (responseData && responseData.code === 200) {
          Swal.close(); // Close the loading popup

          console.log(responseData)
          setFunds(responseData);
        }

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
      setSelectedRows(selectedRows.concat(itemId));
      console.log(selectedRows)

    }
  };


  var totalItems: any;
  const handleSort = (key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';

    }
    console.log(key)

    setSortConfig({ key, direction });

    if (funds && funds.data.societes) {

      // Créez une copie triée des fonds en utilisant la méthode sort()
      const sortedFundsCopy = [...funds.data.societes];
      console.log(sortedFundsCopy);
      const filteredFunds = sortedFundsCopy.filter(item =>
        item[sortConfig.key] !== '-'
      );
      console.log(filteredFunds)

      filteredFunds.sort((a, b) => {
        console.log(sortConfig.key)

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
      setSortedFunds({ data: { societes: filteredFunds } });
      setFunds({ data: { societes: filteredFunds } });
      totalItems = filteredFunds.length || 0;
      settotalPages(Math.ceil(totalItems / itemsPerPage));
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
  
  // JSON-LD pour Schema.org
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "InvestmentFund",
    "name":id,
    "description": id,
    "identifier": id,
  };
  return (



    < Fragment >
      <Header />
      <Head>
        <title>{id} - Informations sur la societe</title>
        <meta name="keywords" content={`${id}, investissement, performances, caractéristiques`} />
        <meta name="description" content={id} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={`${id} - Informations sur le fond`} />
        <meta property="og:description" content={id} /> 
         <meta property="og:image" content={`${urlsite}/images/logo.png`} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`https://funds.chainsolutions.fr/pays/${id}`} />
        {/* Ajoutez ici d'autres métadonnées spécifiques au SEO */}
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
      </Head>
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
                      <div className="col-2">
                        <p><span className="text-primary">Pays</span> | <span className="text-fade"></span></p>

                      </div>

                    </div>
                    <hr />
                    <div className="d-md-flex justify-content-between align-items-center">



                    </div>
                    <div className="row">

                      <ul className="tabs-menu" style={{ display: 'flex', flexWrap: 'wrap', padding: '0', margin: '0', listStyleType: 'none', width: '100%' }}>
                        <li style={{ margin: '0', padding: '0', flex: '1' }}>
                          <Link
                            href={`/pays/${id.replace(/ /g, '-')}`}
                            style={{
                              width: '100%',
                              textDecoration: 'none', // Remove underline
                              backgroundColor: 'grey', // Background color
                              color: 'white', // Text color
                              padding: '10px 20px', // Padding
                            borderRadius: '5px', // Rounded corners
borderColor:'grey',
                              textAlign: 'center', // Center the text
                              display: 'inline-block' // Ensure it takes the full width
                            }}
                          >
                            Liste des OPCVM
                          </Link>
                        </li>
                        <li style={{ margin: '0', padding: '0', flex: '1' }}>
                          <Link
                            href={`/pays/Fundmanager/${id.replace(/ /g, '-')}`}
                            style={{
                              width: '100%',
                              backgroundColor: '#6366f1', // Background color
                              textDecoration: 'none', // Remove underline
                              color: 'white', // Text color
                              padding: '10px 20px', // Padding
                            borderRadius: '5px', // Rounded corners
borderColor:'grey',
                              textAlign: 'center', // Center the text
                              display: 'inline-block' // Ensure it takes the full width
                            }}
                          >
                            Liste des sociétés
                          </Link>
                        </li>
                        <li style={{ margin: '0', padding: '0', flex: '1' }}>
                          <Link
                            href={`/pays/Opcvm/${id.replace(/ /g, '-')}`}
                            style={{
                              width: '100%',
                              backgroundColor: 'grey', // Background color
                              textDecoration: 'none', // Remove underline
                              color: 'white', // Text color
                              padding: '10px 20px', // Padding
                            borderRadius: '5px', // Rounded corners
borderColor:'grey',
                              textAlign: 'center', // Center the text
                              display: 'inline-block' // Ensure it takes the full width
                            }}
                          >
                            Liste des fonds
                          </Link>
                        </li>
                        <li style={{ margin: '0', padding: '0', flex: '1' }}>
                          <Link
                            href={`/pays/statistique/${id.replace(/ /g, '-')}`}
                            style={{
                              width: '100%',
                              backgroundColor: 'grey', // Background color
                              textDecoration: 'none', // Remove underline
                              color: 'white', // Text color
                              padding: '10px 20px', // Padding
                            borderRadius: '5px', // Rounded corners
borderColor:'grey',
                              textAlign: 'center', // Center the text
                              display: 'inline-block' // Ensure it takes the full width
                            }}
                          >
                            Graphiques de synthèse
                          </Link>
                        </li>
                      </ul>



                    </div>
                  </div>
                </div>
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
                            <label htmlFor="select">Societés de gestion :</label>
                            <Select className="select-component"
                              isMulti
                              options={optionsSociete}
                              value={selectedSociete}
                              onChange={(newValue, actionMeta) => setSelectedSociete(newValue.map(option => option as Option))}
                              placeholder="Sélectionnez une Societe"
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
                      <div className="row text-center">

                        <div className="text-center mt-3">
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
                            className="table-striped text-fade table-bordered table-hover display nowrap margin-top-10 w-p100">
                            <thead className="table-header">
                              <tr className="text-center">
                                {headers.tabAccueil.map((header) => (
                                  <th className="text-center" key={header.key} onClick={() => handleSort(header.key)}>
                                    {header.label}
                                    {sortConfig.key === header.key && (
                                      <span>{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
                                    )}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {funds?.data?.societes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
                                <tr className="text-center" key={item.id}>
                                  <td className="text-center"><Link href={`/Fundmanager/${item.nom.replace(/ /g, '-')}`}>{item?.nom}</Link></td>
                                  <td>{item.pays}</td>
                                  <td>{item.nombreFonds}</td>
                                  <td>{item.sommeActifNet}</td>

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
          </section>
        </div>

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