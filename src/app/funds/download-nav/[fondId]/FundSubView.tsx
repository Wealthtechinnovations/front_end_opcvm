"use client";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import { useRouter, useParams } from 'next/navigation';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import Header from '@/components/layout/Header'
import { urlconstant, urlsite } from "@/lib/constants";
import ExportModal from './exportmodal';
import { Modal, Button } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import Swal from 'sweetalert2';


/**
 * Fonction asynchrone pour obtenir les détails d'un fond.
 * @async
 * @function getclassement
 * @param {number} id - L'identifiant du fond.
 * @returns {Promise} - Les données du classement du fond.
 */
async function getclassement(id: number) {
  const data = (
    await fetch(`${urlconstant}/api/classementquartilemysql/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', // Indiquer que vous envoyez du JSON
      },
    })
  ).json();
  return data;
}
async function getdateavailable(fondId: any) {
  const data = (
    await fetch(`${urlconstant}/api/getdateavailable/${fondId}`)
  ).json();
  return data;
}
async function getfavoris(id: number) {
  const data = (
    await fetch(`${urlconstant}/api/favoritesdata/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', // Indiquer que vous envoyez du JSON
      },
    })
  ).json();
  return data;
}
/**
 * Fonction asynchrone pour obtenir les dernières valeurs de fonds.
 * @async
 * @function getlastvl1
 * @returns {Promise} - Les dernières valeurs de fonds.
 */
async function getlastvl1() {
  const data = (
    await fetch(`${urlconstant}/api/searchFunds`)
  ).json();
  return data;
}
/**
 * Fonction asynchrone pour obtenir les détails d'une publication.
 * @async
 * @function getPost
 * @param {number} id - L'identifiant de la publication.
 * @returns {Promise} - Les détails de la publication.
 */
async function getPost(id: number) {
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

/**
 * Interface représentant les données d'un fond.
 * @interface Funds
 * @property {Object} data - Les données principales du fond.
 * @property {Object} performances - Les performances du fond.
 * @property {Array} funds - Liste des fonds.
 * @property {string} fundname - Nom du fond.
 * @property {string} libelle_indice - Libellé de l'indice associé au fond.
 * @property {string} ID_indice - Identifiant de l'indice associé au fond.
 * @property {string} lastDate - Date de la dernière mise à jour.
 * @property {string} lastValue - Dernière valeur du fond.
 * @property {...} [Autres propriétés] - Autres propriétés du fond.
 */
interface Funds {
  data: {
    ratios3a: {
      data: {
        volatility: any;
        ratioSharpe: any;
        maxDrawdown: any;
        betaBaiss: any;
        VAR95: any;
        info: any;
        perfAnnualisee: any;
        calmar: any;
        sortino: any;
        omega: any
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
        perf8Ans: any;
        perf10Ans: any;
        adaptValues1: any;
        perfAnnualisee: any;
        performancesCategorie: any
      }
    };
    funds: any[]; // ou un type spécifique pour les éléments du tableau 'funds'
    fundname: any;
    libelle_indice: any;
    ID_indice: any;
    lastDate: any;
    lastValue: any;
    lastdatepreviousmonth: any;
    performancesCategorie: any
    libelle_fond: any;
    regulateur: any;
    code_ISIN: any;
    sitewebregulateur: any;
    nomdelabourse: any;
    URLdelabourse: any;
    symboledevise: any;
    categorie_libelle: any;
    categorie_national: any;
    nom_gerant: any;
    categorie_globale: any;
    societe_gestion: any;
    periodicite: any;
    affectation: any;
    structure_fond: any;
    frais_souscription: any;
    frais_rachat: any;
    frais_gestion: any;
    frais_entree: any;
    frais_sortie: any;
    minimum_investissement: any;
    categorie_regional: any;
    classification: any;
    type_investissement: any;
    pays: any;

  };
}

interface Classement {
  data: {
    classementType1: {
      rank3Mois: any;
      rank3Moistotal: any;
      // ranktotal: any;
      rank6Mois: any;
      rank6Moistotal: any;
      rank1erJanvier: any;
      rank1erJanviertotal: any;
      rank1An: any;
      rank1Antotal: any;
      rank3Ans: any;
      rank3Anstotal: any;
      rank5Ans: any;
      rank5Anstotal: any;


    };
    classementType2: {
      rank3Mois: any;
      rank3Moistotal: any;
      // ranktotal: any;
      rank6Mois: any;
      rank6Moistotal: any;
      rank1erJanvier: any;
      rank1erJanviertotal: any;
      rank1An: any;
      rank1Antotal: any;
      rank3Ans: any;
      rank3Anstotal: any;
      rank5Ans: any;
      rank5Anstotal: any;


    }
  }
};


interface Option {

  name: any;

}
interface Option1 {

  value: any;

}

interface PageProps {
  params: {
    fondId: number;
  };
}
interface MyDataType {
  name: any;
  y: any;
  InRef?: any; // Remplacez "number" par le type approprié
  // Autres propriétés
}
/**
 * Composant principal représentant la page d'un fond.
 * @function Fond
 * @param {PageProps} props - Propriétés de la page.
 */
export default function Fond() {
  const router = useRouter();
  const params = useParams();

  const id = Number(params.fondId);

  const [selectedPeriod, setSelectedPeriod] = useState('1 year'); // Initialize with the default selected period
  const [filteredData, setFilteredData] = useState<Option[]>([]);
  const [post, setPost] = useState<Funds | null>(null);
  const [classementlocal, setClassementlocal] = useState<Classement | null>(null);
  const [selectedFund, setSelectedFund] = useState<Option1>();
  const [fundsOptions, setFundsOptions] = useState([]);
  const [base100Data, setBase100Data] = useState<MyDataType[]>([]); // Nouvel état pour les données en base 100
  const [rating, setRating] = useState(2);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userConnected, setUserConnected] = useState<number | null>(null);

  useEffect(() => {

    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userId = localStorage.getItem('userId');

    if (isLoggedIn === 'true' && userId !== null) {
      const userIdNumber = parseInt(userId, 10);
      setIsLoggedIn(true);
      setUserConnected(userIdNumber)
    } else {
      // If storedIsLoggedIn is null or any other value, set the state to false
      setIsLoggedIn(false);
    }
    /*if (!isLoggedIn) {
      router.push('/home');
    }*/
  }, []);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const handleDocumentSelect = (document: any) => {
    setSelectedDocument(document);
  };

  const handleDownload = () => {
    // Ici, vous pouvez implémenter la logique de téléchargement
    // en fonction du document sélectionné
    if (selectedDocument) {
      window.location.href = `/telecharger/${selectedDocument}`;
    }
  };
  const [show, setShow] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopup1, setShowPopup1] = useState(false);
  const handleClosePopup = () => setShowPopup(false);

  const handleClosePopup1 = () => setShowPopup1(false);

  const handleExport = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const differenceInTime = end.getTime() - start.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    if (differenceInDays > 365) {
      setShowWarningModal(true);
    } else {
      // Call API with startDate and endDate
      handleClose();
    }
  };
  const handleClose = () => setShow(false);

  const handleCloseWarningModal = () => setShowWarningModal(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        // Si déjà en favori, supprime-le
        await fetch(`${urlconstant}/api/favorites/remove/${id}/${userConnected}`, { method: 'GET' });
        //  alert('Fond supprimé des favoris !');
        setShowPopup1(true);

      } else {
        // Sinon, ajoute-le
        await fetch(`${urlconstant}/api/favorites/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fund_id: id,
            user_id: userConnected,
          }),
        });
        setShowPopup(true);


        //  alert('Fond ajouté aux favoris !');
      }

      // Inversez l'état local pour refléter le changement
      setIsFavorite((prev) => !prev);
    } catch (error) {
      console.error('Erreur lors de la gestion des favoris :', error);
    }
  };
  const handleRatingClick = (selectedRating: any) => {
    setRating(selectedRating);
  };
  var options: any;
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
        const data = await getPost(id);
        setPost(data);
        const data3 = await getdateavailable(id);
        setAvailableDates(data3.data);

        const data10 = await getfavoris(id)


        if (data10.success == true) {
          setIsFavorite(true)
        }
        const data1 = await getlastvl1();

        const mappedOptions = data1?.data?.funds.map((funds: any) => ({

          value: funds.value,
          label: funds.label, // Replace with the actual property name
          // Replace with the actual property name
        }));


        setFundsOptions(mappedOptions); // Mettre à jour l'état avec les données récupérées
        Swal.close(); // Close the loading popup

      } catch (error) {
        Swal.close(); // Close the loading popup

        console.error("Erreur lors de l'appel à l'API :", error);
      }
    }
    fetchData();


  }, [selectedPeriod, id]);


  const handleSearch = (e: any) => {
    e.preventDefault();
    // Effectuez votre recherche ici si nécessaire
  };


  const handleFundSelect = (selectedOption: any) => {
    setSelectedFund(selectedOption);
  };

  // Dynamically set quartile color
  const handleExport1 = async () => {
    try {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-based
      const day = String(selectedDate.getDate()).padStart(2, '0');


      const formattedDate = `${year}-${month}-${day}`;

      const year1 = selectedDate1.getFullYear();
      const month1 = String(selectedDate1.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-based
      const day1 = String(selectedDate1.getDate()).padStart(2, '0');


      const formattedDate1 = `${year1}-${month1}-${day1}`;

      const date1 = selectedDate.getTime();
      const date2 = selectedDate1.getTime();
      const differenceInTime = date2 - date1
      const differenceInDays = differenceInTime / (1000 * 3600 * 24);
      if (date1 > date2) {
        setShowWarningModal(true);
        console.error('Erreur : La date de debut doit être postérieure à la date de fin.');
        return;
      }
      if (differenceInDays > 365) {
        setShowWarningModal(true);
        console.error('Erreur : La date de debut doit être postérieure à la date de fin.');
        return;
      }
      const response = await fetch(`${urlconstant}/api/exportToExcel?id=${id}&formattedDate=${formattedDate}&formattedDate1=${formattedDate1}`, {
        method: 'GET',
      });
      if (response.ok) {
        // Handle the exported data (e.g., download a file)
        const excelData = await response.json();

        // Create headers and data for CSV
        const headers = Object.keys(excelData[0]);
        const csvContent = [headers.join(',')];

        const dataRows = excelData.map((row: { [x: string]: any; }) => headers.map(header => row[header]));
        dataRows.forEach((row: { [x: string]: any; }) => {
          const csvRow = row.map((value: any) => `"${value}"`).join(',');
          csvContent.push(csvRow);
        });

        // Download the CSV file
        const csvString = csvContent.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });

        // Declare the link variable here
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${post?.data?.libelle_fond}.csv`;  // Use template literals for filename
        link.click();

        setShow(false)
      } else {
        console.error('Failed to export data');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };
  const [showExportModal, setShowExportModal] = useState(false);

  const handleExportClick = () => {
    setShow(true);
  };
  const onChange = (date: any) => {
    if (isDateAvailable(date)) {
      setSelectedDate(date);
    }
  };
  const onChange1 = (date: any) => {
    if (isDateAvailable(date)) {
      setSelectedDate1(date);
    }
  };
  const [availableDates, setAvailableDates] = useState([]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDate1, setSelectedDate1] = useState(new Date());

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
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (

    <Fragment>
      <Header />
      <div className="">
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Selectionner les datte</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-6 ">
                <label htmlFor="">Date de debut</label>
                <Calendar
                  onChange={onChange}
                  value={selectedDate}
                  tileDisabled={({ date, view }) => view === 'month' && !isDateAvailable(date)}
                />
              </div>
              <div className="col-6 ">
                <label htmlFor="">Date de fin</label>

                <Calendar
                  onChange={onChange1}
                  value={selectedDate1}
                  tileDisabled={({ date, view }) => view === 'month' && !isDateAvailable(date)}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleExport1}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Warning Modal */}
        <Modal show={showWarningModal} onHide={handleCloseWarningModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Attention</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            La date de debut doit etre posterieure à la date de fin
            <br />
            La plage de dates sélectionnée est supérieure à 1 an. Veuillez sélectionner une plage de dates dans un délai d un an.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleCloseWarningModal}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showPopup} onHide={handleClosePopup} centered>
          <Modal.Header closeButton>
            <Modal.Title>Action</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Fonds ajouté aux favoris !
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" style={{
              textDecoration: 'none',
              backgroundColor: '#1B3A5C',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '5px',
            }} onClick={handleClosePopup}>
              Fermer
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showPopup1} onHide={handleClosePopup1} centered>
          <Modal.Header closeButton>
            <Modal.Title>Action</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Fonds supprimé des favoris !
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" style={{
              textDecoration: 'none',
              backgroundColor: '#1B3A5C',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '5px',
            }} onClick={handleClosePopup1}>
              Fermer
            </Button>
          </Modal.Footer>
        </Modal>
        <div className="container-full">
          {/* Main content */}
          <section className="content">
            <div className="row">

              <div className="col-md-12 col-12">
                <div className="box ">
                  <div className="box-body">
                    <div className="d-md-flex justify-content-between align-items-center">
                      <div className="col-2">
                        <p><span className="text-primary">Fonds</span> | <span className="text-fade"></span></p>

                      </div>
                      <div className="">
                        <p className="text-center"><strong>Rechercher un fond</strong></p>
                        <form onSubmit={handleSearch}>
                          <div className=" col-6 input-group">
                            <Select className="select-component fixed-select"
                              id="select"
                              options={fundsOptions}
                              value={selectedFund}
                              onChange={handleFundSelect}
                              placeholder="Select a fund"
                            />
                            <div className="input-group-append">

                              <Link
                                href={{
                                  pathname: '/fundview',
                                  query: { fund: selectedFund ? selectedFund?.value : '' },
                                }}
                                as={`/funds/${selectedFund ? selectedFund.value : ''}`}
                                key={selectedFund?.value}
                                style={{
                                  textDecoration: 'none', // Remove underline
                                  backgroundColor: '#1B3A5C', // Background color
                                  color: 'white', // Text color
                                  padding: '10px 20px', // Padding
                                borderRadius: '5px', // Rounded corners
borderColor:'grey'
                                }}
                              >
                                OK
                              </Link>

                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                    <hr />
                    <div className="d-md-flex justify-content-between align-items-center">


                      <div className="panel-heading p-b-0">
                        <div className="row row-no-gutters">
                          <div className="col-lg-12  text-center-xs p-t-1">
                            <h3>
                              <span className="produit-type">{post?.data?.classification != null ? post?.data?.classification : 'OPCVM'}</span> - <strong>{post?.data?.libelle_fond}</strong> -{' '}
                              <small>{post?.data?.code_ISIN} </small>{' '} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              {[1, 2, 3, 4, 5].map((index) => (
                                <FontAwesomeIcon
                                  className="text-right"
                                  key={index}
                                  icon={faStar}
                                  onClick={() => handleRatingClick(index)}
                                  style={{ color: index <= rating ? 'gold' : 'gray', cursor: 'pointer' }}
                                />
                              ))}
                            </h3>

                          </div>
                          <div className=" text-center">
                            <div className="row row-no-gutters flex" style={{ justifyContent: 'flex-end' }}>

                              {userConnected ?
                                <button onClick={handleToggleFavorite}>
                                  {isFavorite ? '💜 Retirer des favoris' : '🤍 Ajouter aux favoris'}
                                </button>
                                : <p></p>}
                            </div> </div>


                        </div>
                      </div>

                    </div>
                    <div className="row">

                      <ul className="tabs-menu" style={{ display: 'flex', flexWrap: 'wrap', padding: '0', margin: '0', listStyleType: 'none' }}>
                        <li style={{ margin: '0', padding: '0' }}>
                          <Button
                            href={`/funds/${id}`}

                            style={{
                              width: '135px',
                              textDecoration: 'none', // Remove underline
                              backgroundColor: 'grey', // Background color
                              color: 'white', // Text color
                              padding: '10px 20px', // Padding
                            borderRadius: '5px', // Rounded corners
borderColor:'grey'
                            }}
                          >
                            Resumé
                          </Button>
                        </li>
                        <li style={{ margin: '0', padding: '0' }}>
                          <Button
                            href={`/funds/summary-eur/${id}`} style={{
                              width: '135px',
                              textDecoration: 'none', // Remove underline
                              backgroundColor: 'grey', // Background color
                              color: 'white', // Text color
                              padding: '10px 20px', // Padding
                            borderRadius: '5px', // Rounded corners
borderColor:'grey'
                            }}

                          >
                            Resumé EUR
                          </Button>
                        </li>
                        <li style={{ margin: '0', padding: '0' }}>
                          <Button
                            href={`/funds/summary-usd/${id}`}
                            style={{
                              width: '135px',
                              textDecoration: 'none', // Remove underline
                              backgroundColor: 'grey', // Background color
                              color: 'white', // Text color
                              padding: '10px 20px', // Padding
                            borderRadius: '5px', // Rounded corners
borderColor:'grey'
                            }}

                          >
                            Resumé USD
                          </Button>
                        </li>

                        <li style={{ margin: '0', padding: '0' }}>
                          <Button className="" href={`/funds/history/${id}`
                          } style={{
                            width: '135px',
                            textDecoration: 'none', // Remove underline
                            backgroundColor: 'grey', // Background color
                            color: 'white', // Text color
                            padding: '10px 20px', // Padding
                          borderRadius: '5px', // Rounded corners
borderColor:'grey'
                          }}>
                            Historique
                          </Button>
                        </li>
                        <li style={{ margin: '0', padding: '0' }}>

                          <Button
                            href={`/funds/performance/${id}`}
                            style={{
                              width: '140px',
                              textDecoration: 'none', // Remove underline
                              backgroundColor: 'grey', // Background color
                              color: 'white', // Text color
                              padding: '10px 20px', // Padding
                            borderRadius: '5px', // Rounded corners
borderColor:'grey'
                            }}
                          >
                            Performances
                          </Button>


                        </li>
                        <li style={{ margin: '0', padding: '0' }}>
                          <Button className="" href="" style={{
                            width: '135px',
                            textDecoration: 'none', // Remove underline
                            backgroundColor: 'grey', // Background color
                            color: 'white', // Text color
                            padding: '10px 20px', // Padding
                          borderRadius: '5px', // Rounded corners
borderColor:'grey'
                          }}>
                            Portefeuille
                          </Button>
                        </li>
                        <li style={{ margin: '0', padding: '0' }}>
                          <Button className="" href="" style={{
                            width: '135px',
                            textDecoration: 'none', // Remove underline
                            backgroundColor: 'grey', // Background color
                            color: 'white', // Text color
                            padding: '10px 20px', // Padding
                          borderRadius: '5px', // Rounded corners
borderColor:'grey'
                          }}>
                            Investir
                          </Button>
                        </li>

                        <li style={{ margin: '0', padding: '0' }}>
                          <Button href={`/funds/download-nav/${id}`} style={{
                            width: '135px',
                            textDecoration: 'none', // Remove underline
                            backgroundColor: '#1B3A5C', // Background color
                            color: 'white', // Text color
                            padding: '10px 20px', // Padding
                          borderRadius: '5px', // Rounded corners
borderColor:'grey'
                          }}>
                            Telecharger VL
                          </Button>
                        </li>
                        <li style={{ margin: '0', padding: '0' }}>
                          <Button href={`/funds/documents/${id}`} className=""
                            style={{
                              width: '135px',
                              textDecoration: 'none', // Remove underline
                              backgroundColor: 'grey', // Background color
                              color: 'white', // Text color
                              padding: '10px 20px', // Padding
                            borderRadius: '5px', // Rounded corners
borderColor:'grey'
                            }}

                          >
                            Documents
                          </Button>
                        </li>

                      </ul>


                    </div>
                  </div>
                </div>

                <div className="box">
                  <div className="box-body pb-lg-0">
                    <div className="row">
                      <p><span className="text-primary">Téléchargement VL</span> | <span className="text-fade"></span></p>
                      <div className="col-12">
                        <div className="box">
                          <div className="box-header with-border row">
                            <div className="col-md-6">
                              <label htmlFor="">Date de début</label>
                              <Calendar
                                onChange={onChange}
                                value={selectedDate}
                                tileDisabled={({ date, view }) => view === 'month' && !isDateAvailable(date)}
                              />
                            </div>
                            <div className="col-md-6">
                              <label htmlFor="">Date de fin</label>
                              <Calendar
                                onChange={onChange1}
                                value={selectedDate1}
                                tileDisabled={({ date, view }) => view === 'month' && !isDateAvailable(date)}
                              />
                            </div>
                          </div>
                          <div className="row mt-3">
                            <div className="col-md-6 text-center offset-md-3">
                              <Button variant="secondary" className="mr-2" onClick={handleClose}>
                                &nbsp;   Annuler &nbsp;
                              </Button>
                              <Button variant="primary" onClick={handleExport1}>
                                telecharger
                              </Button>
                            </div>
                            <br />
                          </div>
                        </div>
                      </div>
                    </div> </div> </div>


              </div>

            </div>
          </section>
        </div>


      </div >
    </Fragment >

  );
}

async function searchFunds(searchTerm: any) {
  // const response = await fetch(`/api/searchFunds?query=${searchTerm}`);
  const response = await fetch(`/api/searchFunds`);
  const data = await response.json();
  return data;
}
