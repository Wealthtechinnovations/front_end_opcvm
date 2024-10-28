"use client";

import Link from "next/link";
import { Fragment, JSXElementConstructor, Key, ReactNode, ReactElement, ReactPortal, useEffect, useState } from "react";
import Header from '../../../Header';
import { urlconstant, urlsite } from "@/app/constants";
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faSquare } from '@fortawesome/free-solid-svg-icons';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { Modal, Button } from 'react-bootstrap';

interface Post {
  data: any


}
async function getlastvl(id: number) {
  const data = (
    await fetch(`${urlconstant}/api/valLiq/${id}`)
  ).json();
  return data;
}
async function getperfind(id: number) {
  const data = (
    await fetch(`${urlconstant}/api/performancesindice/fond/${id}`)
  ).json();
  return data;
}
async function getperfcategorieannuel(id: number) {
  const data = (
    await fetch(`${urlconstant}/api/performancescategorie/fond/${id}`)
  ).json();
  return data;
}
async function getlastvl1() {
  const data = (
    await fetch(`${urlconstant}/api/searchFunds`)
  ).json();
  return data;
}
interface PageProps {
  params: {
    fondId: number;
  };
}
interface Option1 {

  value: any;

}
interface PerformancesState {
  monthlyPerformance: { [key: string]: number };
  annualPerformance: { [key: string]: number };
}
export default function Performance(props: PageProps) {
  const [showDescription, setShowDescription] = useState(false);
  const handleMouseEnter = () => {
    console.log("open")
    setShowDescription(true);
  };

  const handleMouseLeave = () => {
    console.log("close")

    setShowDescription(false);
  };
  const selectedValues = props.params.fondId;
  console.log(props.params);
  const [count, setCount] = useState(0);

  const incrementCount = () => {
    setCount(count + 1);

  };
  const [activeTable, setActiveTable] = useState('Glissantes');

  const toggleTable = () => {
    setActiveTable(activeTable === 'Glissantes' ? 'Calendaires' : 'Glissantes');
    console.log(activeTable);
  };

  const [selectedFund, setSelectedFund] = useState<Option1>();
  const [fundsOptions, setFundsOptions] = useState([]);
  const [post, setPost] = useState<Post | null>(null);
  const [posti, setPosti] = useState<Post | null>(null);
  const [postc, setPostc] = useState<Post | null>(null);

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
  const [performances, setPerformances] = useState<PerformancesState>({
    monthlyPerformance: {},
    annualPerformance: {}
  });
  const [performancesindices, setPerformancesindices] = useState<PerformancesState>({
    monthlyPerformance: {},
    annualPerformance: {}
  });
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
        console.log("ddddddeee")
        const data = await getlastvl(selectedValues);
        setPost(data);
        const data2 = await getperfind(selectedValues);
        setPosti(data2);
        const data3 = await getperfcategorieannuel(selectedValues);
        setPostc(data3);

        const url6 = `${urlconstant}/api/performancemonthyear/fond/${selectedValues}`;
        const response = await fetch(url6);
        const data6 = await response.json(); // Extrayez les données JSON de la réponse
        setPerformances(data6); // Mettez à jour l'état avec les données extraites
        const url11 = `${urlconstant}/api/performanceindicemonthyear/fond/${selectedValues}`;
        const response11 = await fetch(url11);
        const data11 = await response11.json(); // Extrayez les données JSON de la réponse
        setPerformancesindices(data11); // Mettez à jour l'état avec les données extraites


        const data10 = await getlastvl1();

        const mappedOptions = data10?.data?.funds.map((funds: any) => ({
          value: funds.value,
          label: funds.label
        }));

        setFundsOptions(mappedOptions); // Mettre à jour l'état avec les données récupérées
        Swal.close(); // Close the loading popup

      } catch (error) {
        Swal.close(); // Close the loading popup

        console.error("Erreur lors de l'appel à l'API :", error);
      }
    }
    fetchData();
  }, []);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };


  const handleSearch = (e: any) => {
    e.preventDefault();
    // Effectuez votre recherche ici si nécessaire
  };
  const handleFundSelect = (selectedOption: any) => {
    setSelectedFund(selectedOption);
  };
  const handleRatingClick = (selectedRating: any) => {
    setRating(selectedRating);
  };
  const [rating, setRating] = useState(2);
  const [isFavorite, setIsFavorite] = useState(false);
  const [show, setShow] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopup1, setShowPopup1] = useState(false);
  const handleToggleFavorite = async () => {
    try {
      console.log("eee")
      if (isFavorite) {
        // Si déjà en favori, supprime-le
        await fetch(`${urlconstant}/api/favorites/remove/${selectedValues}/${userConnected}`, { method: 'GET' });
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
            fund_id: selectedValues,
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
  const postYears = post?.data?.performances?.data?.adaptValues1.map((item: any) => item[0]);

  // Filtrage de postc pour ne garder que les éléments avec des années correspondantes
  const slicedPostc = postc?.data?.multipliedValues;
  const [selectedDevise, setSelectedDevise] = useState('');

  const handleDeviseChange = async (e: { target: { value: any; }; }) => {
    Swal.fire({
      title: 'Veuillez patienter',
      html: 'Chargement des résultats en cours...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const selectedValue = e.target.value;
      setSelectedDevise(selectedValue);

      let url1;
      if (selectedValue == "EUR" || selectedValue == "USD") {
        url1 = `${urlconstant}/api/valLiqdev/${selectedValues}/${selectedValue}`;
      } else {
        url1 = `${urlconstant}/api/valLiq/${selectedValues}`;

      }
      const response1 = await fetch(url1);
      const data1 = await response1.json(); // Extrayez les données JSON de la réponse
      setPost(data1); // Mettez à jour l'état avec les données extraites
      const url2 = `${urlconstant}/api/performancescategorie/fond/${selectedValues}?query=${selectedValue}`;
      const response2 = await fetch(url2);
      const data2 = await response2.json(); // Extrayez les données JSON de la réponse
      setPosti(data2); // Mettez à jour l'état avec les données extraites
      const url3 = `${urlconstant}/api/performancesindice/fond/${selectedValues}?query=${selectedValue}`;
      const response3 = await fetch(url3);
      const data3 = await response3.json(); // Extrayez les données JSON de la réponse
      setPostc(data3); // Mettez à jour l'état avec les données extraites

      const url6 = `${urlconstant}/api/performancemonthyear/fond/${selectedValues}?query=${selectedValue}`;
      const response = await fetch(url6);
      const data6 = await response.json(); // Extrayez les données JSON de la réponse
      setPerformances(data6); // Mettez à jour l'état avec les données extraites
      const url11 = `${urlconstant}/api/performanceindicemonthyear/fond/${selectedValues}?query=${selectedValue}`;
      const response11 = await fetch(url11);
      const data11 = await response11.json(); // Extrayez les données JSON de la réponse
      setPerformancesindices(data11); // Mettez à jour l'état avec les données extraites


    } catch (error) {
      console.error('An error occurred:', error);
      Swal.fire({
        title: 'Erreur',
        text: 'Une erreur s\'est produite lors du chargement des résultats. Veuillez réessayer.',
        icon: 'error'
      });
    } finally {
      Swal.close(); // Close the loading popup in both success and error cases
    }
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

        router.push('/portefeuille/login');
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
                                as={`/Opcvm/${selectedFund ? selectedFund.value : ''}`}
                                key={selectedFund?.value}
                                style={{
                                  textDecoration: 'none', // Remove underline
                                  backgroundColor: '#6366f1', // Background color
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
                    <div className="panel-heading p-b-0">
                      <div className="row row-no-gutters">
                        <div className="col-lg-12  text-center-xs p-t-1">
                          <h3>
                            <span className="produit-type">{post?.data?.classification != null ? post?.data?.classification : 'OPCVM'}</span> - <strong>{post?.data?.libelle_fond}</strong> -{' '}
                            <small>{post?.data?.code_ISIN} </small>{' '} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            {[1, 2, 3, 4, 5].map((index) => (
                              <FontAwesomeIcon
                                className="text-center"
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
                    <div className="d-md-flex justify-content-between align-items-center">

                      <div className="panel-heading p-b-0">
                        <div className="row row-no-gutters">

                          {/*
                           <div className=" text-center">
                            <div className="row row-no-gutters flex" style={{ justifyContent: 'flex-end' }}>
                              <div className="col-xs-12 col-sm-4 col-md-auto text-center p-t-1">
                                <button type="button" className="btn btn-main dropdown-toggle width-100pct-xs width-100pct-sm dropdown-exporter" data-toggle="dropdown">
                                  Exporter <span className="caret"></span>
                                </button>

                              </div>

                              <div className="col-xs-12 col-sm-4 col-md-auto text-center p-t-1" id="dropDownFicheProduit">
                                <button type="button" className="btn btn-main dropdown-toggle width-100pct-xs width-100pct-sm dropdown-documents" data-toggle="dropdown">
                                  Documents <span className="caret"></span>
                                </button>

                              </div>
                            </div>

                        </div>*/ }
                        </div>
                      </div>

                    </div>
                    <div className="row">

                      <ul className="tabs-menu" style={{ display: 'flex', flexWrap: 'wrap', padding: '0', margin: '0', listStyleType: 'none' }}>
                        <li style={{ margin: '0', padding: '0' }}>
                          <Button
                            href={`/Opcvm/${selectedValues}?fundid=${selectedValues}`}

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
                            href={`/Opcvm/resumeEUR/${selectedValues}?fundid=${selectedValues}`} style={{
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
                            href={`/Opcvm/resumeUSD/${selectedValues}?fundid=${selectedValues}`}
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
                          <Button className="" href={`/Opcvm/historique/${selectedValues}?fundid=${selectedValues}`
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
                            href={`/Opcvm/performance/${selectedValues}?fundid=${selectedValues}`}
                            style={{
                              width: '140px',
                              textDecoration: 'none', // Remove underline
                              backgroundColor: '#6366f1', // Background color
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
                          <Button href={`/Opcvm/telechargervl/${selectedValues}?fundid=${selectedValues}`} style={{
                            width: '135px',
                            textDecoration: 'none', // Remove underline
                            backgroundColor: 'grey', // Background color
                            color: 'white', // Text color
                            padding: '10px 20px', // Padding
                          borderRadius: '5px', // Rounded corners
borderColor:'grey'
                          }}>
                            Telecharger VL
                          </Button>
                        </li>
                        <li style={{ margin: '0', padding: '0' }}>
                          <Button href={`/Opcvm/document/${selectedValues}?fundid=${selectedValues}`} className=""
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
                  <div className="box-body">
                    <div className="col-md-12">
                      <div className="container">
                        <div className="text-center">
                          <div className="col-md-6 mx-auto">
                            <label>Devise:</label>
                            <select className="form-control" onChange={handleDeviseChange} value={selectedDevise} >
                              <option value="">Devise Locale</option>
                              <option value="EUR">EUR</option>
                              <option value="USD">USD</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <br />
                      <div className="card">
                        <div className="card-body">
                          <div className="d-md-flex justify-content-between align-items-center">
                            <div className="row">
                              <p><span className="text-primary">Historique </span> | <span className="text-fade"> Performance</span></p>

                            </div>

                          </div>

                          <div className="col-xl-12">
                            <div className="">
                              <div className="card-body">
                                <div className="box-header px-0">
                                  <div className="row">

                                    <div className="col-sm-12">
                                      <div className="col-sm-12 d-flex justify-content-center">
                                        <div className="custom-control custom-switch">
                                          <div className="row">


                                            <input
                                              type="checkbox"
                                              className="custom-control-input"
                                              id="tableSwitch"
                                              checked={activeTable === 'Calendaires'}
                                              onChange={toggleTable}
                                            />
                                            <p >&nbsp;&nbsp;
                                              {activeTable === 'Glissantes' ? '  Glissantes' : '  Calendaires'}
                                            </p>

                                          </div>
                                        </div>
                                      </div>











                                      {activeTable === 'Glissantes' ? (
                                        <div className="table-responsive">

                                          <table
                                            id="tabPerfGlissante"
                                            className="table text-fade table-bordered table-hover display nowrap margin-top-10 w-p100">

                                            <thead className="table-header">
                                              <tr className="text-center">
                                                <th className="text-center">Cumulées au {post?.data?.lastDate}</th>
                                                <th className="text-center">Veille</th>
                                                <th className="text-center">4 sem</th>
                                                <th className="text-center">3 mois</th>
                                                <th className="text-center">6 mois</th>
                                                <th className="text-center">YTD</th>
                                                <th className="text-center">1 an</th>
                                                <th className="text-center">3 ans</th>
                                                <th className="text-center">5 ans</th>
                                                <th className="text-center">8 ans</th>
                                                <th className="text-center">10 ans</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              <tr className="text-center">
                                                <td className="text-left">Fonds</td>
                                                <td className={`text-center  ${parseFloat(post?.data?.performances?.data?.perfVeille) < 0 ? 'text-danger' : 'text-success'} `}>{isNaN(parseFloat(post?.data?.performances?.data?.perfVeille)) ? '-' : parseFloat(post?.data?.performances?.data?.perfVeille).toFixed(2)} %</td>
                                                <td className={`text-center ${parseFloat(post?.data?.performances?.data?.perf4Semaines) < 0 ? 'text-danger' : 'text-success'}  `}>{isNaN(parseFloat(post?.data?.performances?.data?.perf4Semaines)) ? '-' : parseFloat(post?.data?.performances?.data?.perf4Semaines).toFixed(2)}%</td>
                                                <td className={`text-center ${parseFloat(post?.data?.performances?.data?.perf3Mois) < 0 ? 'text-danger' : 'text-success'} `}>{isNaN(parseFloat(post?.data?.performances?.data?.perf3Mois)) ? '-' : parseFloat(post?.data?.performances?.data?.perf3Mois).toFixed(2)} %</td>
                                                <td className={`text-center ${parseFloat(post?.data?.performances?.data?.perf6Mois) < 0 ? 'text-danger' : 'text-success'} `}>{isNaN(parseFloat(post?.data?.performances?.data?.perf6Mois)) ? '-' : parseFloat(post?.data?.performances?.data?.perf6Mois).toFixed(2)} %</td>
                                                <td className={`text-center ${parseFloat(post?.data?.performances?.data?.perf4Semaines) < 0 ? 'text-danger' : 'text-success'} `}>{isNaN(parseFloat(post?.data?.performances?.data?.perf4Semaines)) ? '-' : parseFloat(post?.data?.performances?.data?.perf4Semaines).toFixed(2)} %</td>
                                                <td className={`text-center ${parseFloat(post?.data?.performances?.data?.perf1An) < 0 ? 'text-danger' : 'text-success'} `}>{isNaN(parseFloat(post?.data?.performances?.data?.perf1An)) ? '-' : parseFloat(post?.data?.performances?.data?.perf1An).toFixed(2)}%</td>
                                                <td className={`text-center ${parseFloat(post?.data?.performances?.data?.perf3Ans) < 0 ? 'text-danger' : 'text-success'} `}>{isNaN(parseFloat(post?.data?.performances?.data?.perf3Ans)) ? '-' : parseFloat(post?.data?.performances?.data?.perf3Ans).toFixed(2)} %</td>
                                                <td className={`text-center ${parseFloat(post?.data?.performances?.data?.perf5Ans) < 0 ? 'text-danger' : 'text-success'} `}>{isNaN(parseFloat(post?.data?.performances?.data?.perf5Ans)) ? '-' : parseFloat(post?.data?.performances?.data?.perf5Ans).toFixed(2)} %</td>
                                                <td className={`text-center ${parseFloat(post?.data?.performances?.data?.perf8Ans) < 0 ? 'text-danger' : 'text-success'} `}>{isNaN(parseFloat(post?.data?.performances?.data?.perf8Ans)) ? '-' : parseFloat(post?.data?.performances?.data?.perf8Ans).toFixed(2)} %</td>
                                                <td className={`text-center ${parseFloat(post?.data?.performances?.data?.perf10Ans) < 0 ? 'text-danger' : 'text-success'} `}>{isNaN(parseFloat(post?.data?.performances?.data?.perf10Ans)) ? '-' : parseFloat(post?.data?.performances?.data?.perf10Ans).toFixed(2)} %</td>
                                              </tr>
                                              <tr className="text-center">
                                                <td className="text-left">Catégorie</td>
                                                <td className={`text-center ${post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perfveille && parseFloat(post?.data?.performances.data?.performancesCategorie[0].moyenne_perfveille) < 0 ? 'text-danger' : 'text-success'}`}>
                                                  {isNaN(parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perfveille)) ? '-' : parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perfveille).toFixed(2)} %
                                                </td>
                                                <td className={`text-center ${post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf4s && parseFloat(post?.data?.performances.data?.performancesCategorie[0].moyenne_perf4s) < 0 ? 'text-danger' : 'text-success'}`}>
                                                  {isNaN(parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf4s)) || isNaN(parseFloat(post?.data?.performances?.data?.perf4Semaines)) ? '-' : parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf4s).toFixed(2)} %
                                                </td>
                                                <td className={`text-center ${post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf3m && parseFloat(post?.data?.performances.data?.performancesCategorie[0].moyenne_perf3m) < 0 ? 'text-danger' : 'text-success'}`}>
                                                  {isNaN(parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_ytd)) || isNaN(parseFloat(post?.data?.performances?.data?.perf1erJanvier)) ? '-' : parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf3m).toFixed(2)} %
                                                </td>
                                                <td className={`text-center ${post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf6m && parseFloat(post?.data?.performances.data?.performancesCategorie[0].moyenne_perf6m) < 0 ? 'text-danger' : 'text-success'}`}>
                                                  {isNaN(parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_ytd)) || isNaN(parseFloat(post?.data?.performances?.data?.perf1erJanvier)) ? '-' : parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf6m).toFixed(2)} %
                                                </td>
                                                <td className={`text-center ${post?.data?.performances.data?.performancesCategorie[0]?.moyenne_ytd && parseFloat(post?.data?.performances.data?.performancesCategorie[0].moyenne_ytd) < 0 ? 'text-danger' : 'text-success'}`}>
                                                  {isNaN(parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_ytd)) || isNaN(parseFloat(post?.data?.performances?.data?.perf1erJanvier)) ? '-' : parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_ytd).toFixed(2)} %
                                                </td>
                                                <td className={`text-center ${post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf1an && parseFloat(post?.data?.performances.data?.performancesCategorie[0].moyenne_perf1an) < 0 ? 'text-danger' : 'text-success'}`}>
                                                  {isNaN(parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_ytd)) || isNaN(parseFloat(post?.data?.performances?.data?.perf1erJanvier)) ? '-' : parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf1an).toFixed(2)} %
                                                </td>
                                                <td className={`text-center ${post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf3ans && parseFloat(post?.data?.performances.data?.performancesCategorie[0].moyenne_perf3ans) < 0 ? 'text-danger' : 'text-success'}`}>
                                                  {isNaN(parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_ytd)) || isNaN(parseFloat(post?.data?.performances?.data?.perf1erJanvier)) ? '-' : parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf3ans).toFixed(2)} %
                                                </td>
                                                <td className={`text-center ${post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf5ans && parseFloat(post?.data?.performances.data?.performancesCategorie[0].moyenne_perf5ans) < 0 ? 'text-danger' : 'text-success'}`}>
                                                  {isNaN(parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_ytd)) || isNaN(parseFloat(post?.data?.performances?.data?.perf1erJanvier)) ? '-' : parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf5ans).toFixed(2)} %
                                                </td>
                                                <td className={`text-center ${post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf8ans && parseFloat(post?.data?.performances.data?.performancesCategorie[0].moyenne_perf8ans) < 0 ? 'text-danger' : 'text-success'}`}>
                                                  {isNaN(parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_ytd)) || isNaN(parseFloat(post?.data?.performances?.data?.perf1erJanvier)) ? '-' : parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf8ans).toFixed(2)} %
                                                </td>
                                                <td className={`text-center ${post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf10ans && parseFloat(post?.data?.performances.data?.performancesCategorie[0].moyenne_perf10ans) < 0 ? 'text-danger' : 'text-success'}`}>
                                                  {isNaN(parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_ytd)) || isNaN(parseFloat(post?.data?.performances?.data?.perf1erJanvier)) ? '-' : parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perf10ans).toFixed(2)} %
                                                </td>
                                              </tr>
                                              <tr className="text-center">
                                                <td className="text-left">Différence</td>
                                                <td className={`text-center ${parseFloat(post?.data?.performances?.data?.perfVeille) - parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perfveille) < 0 ? 'text-danger' : 'text-success'}`}>
                                                  {isNaN(parseFloat(post?.data?.performances?.data?.perfVeille) - parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perfveille)) ? '-' : (parseFloat(post?.data?.performances?.data?.perfVeille) - parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perfveille)).toFixed(2)} %
                                                </td>
                                                <td className={`text-center ${parseFloat(post?.data?.performances?.data?.perf4Semaines) - parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perf4s) < 0 ? 'text-danger' : 'text-success'}`}>
                                                  {isNaN(parseFloat(post?.data?.performances?.data?.perf4Semaines) - parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perf4s)) ? '-' : (parseFloat(post?.data?.performances?.data?.perf4Semaines) - parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perf4s)).toFixed(2)} %
                                                </td>
                                                <td className={`text-center ${parseFloat(post?.data?.performances?.data?.perf3Mois) - parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perf3m) < 0 ? 'text-danger' : 'text-success'}`}>
                                                  {isNaN(parseFloat(post?.data?.performances?.data?.perf3Mois) - parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perf3m)) ? '-' : (parseFloat(post?.data?.performances?.data?.perf3Mois) - parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perf3m)).toFixed(2)} %
                                                </td>
                                                <td className={`text-center ${parseFloat(post?.data?.performances?.data?.perf6Mois) - parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perf6m) < 0 ? 'text-danger' : 'text-success'}`}>
                                                  {isNaN(parseFloat(post?.data?.performances?.data?.perf6Mois) - parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perf6m)) ? '-' : (parseFloat(post?.data?.performances?.data?.perf6Mois) - parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perf6m)).toFixed(2)} %
                                                </td>
                                                <td className={`text-center ${parseFloat(post?.data?.performances?.data?.perf1erJanvier) - parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_ytd) < 0 ? 'text-danger' : 'text-success'}`}>
                                                  {isNaN(parseFloat(post?.data?.performances?.data?.perf1erJanvier) - parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_ytd)) ? '-' : (parseFloat(post?.data?.performances?.data?.perf1erJanvier) - parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_ytd)).toFixed(2)} %
                                                </td>
                                                <td className={`text-center ${parseFloat(post?.data?.performances?.data?.perf1An) - parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perf1an) < 0 ? 'text-danger' : 'text-success'}`}>
                                                  {isNaN(parseFloat(post?.data?.performances?.data?.perf1An) - parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perf1an)) ? '-' : (parseFloat(post?.data?.performances?.data?.perf1An) - parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perf1an)).toFixed(2)} %
                                                </td>
                                                <td className={`text-center ${parseFloat(post?.data?.performances?.data?.perf3Ans) - parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perf3ans) < 0 ? 'text-danger' : 'text-success'}`}>
                                                  {isNaN(parseFloat(post?.data?.performances?.data?.perf3Ans) - parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perf3ans)) ? '-' : (parseFloat(post?.data?.performances?.data?.perf3Ans) - parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perf3ans)).toFixed(2)} %
                                                </td>
                                                <td className={`text-center ${parseFloat(post?.data?.performances?.data?.perf5Ans) - parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perf5ans) < 0 ? 'text-danger' : 'text-success'}`}>
                                                  {isNaN(parseFloat(post?.data?.performances?.data?.perf5Ans) - parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perf5ans)) ? '-' : (parseFloat(post?.data?.performances?.data?.perf5Ans) - parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perf5ans)).toFixed(2)} %
                                                </td>
                                                <td className={`text-center ${parseFloat(post?.data?.performances?.data?.perf8Ans) - parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perf8ans) < 0 ? 'text-danger' : 'text-success'}`}>
                                                  {isNaN(parseFloat(post?.data?.performances?.data?.perf8Ans) - parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perf8ans)) ? '-' : (parseFloat(post?.data?.performances?.data?.perf8Ans) - parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perf8ans)).toFixed(2)} %
                                                </td>
                                                <td className={`text-center ${parseFloat(post?.data?.performances?.data?.perf10Ans) - parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perf10ans) < 0 ? 'text-danger' : 'text-success'}`}>
                                                  {isNaN(parseFloat(post?.data?.performances?.data?.perf10Ans) - parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perf10ans)) ? '-' : (parseFloat(post?.data?.performances?.data?.perf10Ans) - parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perf10ans)).toFixed(2)} %
                                                </td>
                                              </tr>

                                              <tr className="text-center">
                                                <td className="text-left">Indice*</td>
                                                <td className={`text-center ${parseFloat(posti?.data?.perfVeille) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(posti?.data?.perfVeille)) ? '-' : parseFloat(posti?.data?.perfVeille).toFixed(2)} %</td>
                                                <td className={`text-center ${parseFloat(posti?.data?.perf4Semaines) < 0 ? 'text-danger' : 'text-success'} `}>{isNaN(parseFloat(posti?.data?.perf4Semaines)) ? '-' : parseFloat(posti?.data?.perf4Semaines).toFixed(2)}%</td>
                                                <td className={`text-center ${parseFloat(posti?.data?.perf3Mois) < 0 ? 'text-danger' : 'text-success'} `}>{isNaN(parseFloat(posti?.data?.perf3Mois)) ? '-' : parseFloat(posti?.data?.perf3Mois).toFixed(2)} %</td>
                                                <td className={`text-center ${parseFloat(posti?.data?.perf6Mois) < 0 ? 'text-danger' : 'text-success'} `}>{isNaN(parseFloat(posti?.data?.perf6Mois)) ? '-' : parseFloat(posti?.data?.perf6Mois).toFixed(2)} %</td>
                                                <td className={`text-center ${parseFloat(posti?.data?.perf4Semaines) < 0 ? 'text-danger' : 'text-success'}`}>{isNaN(parseFloat(posti?.data?.perf4Semaines)) ? '-' : parseFloat(posti?.data?.perf4Semaines).toFixed(2)} %</td>
                                                <td className={`text-center ${parseFloat(posti?.data?.perf1An) < 0 ? 'text-danger' : 'text-success'} `}>{isNaN(parseFloat(posti?.data?.perf1An)) ? '-' : parseFloat(posti?.data?.perf1An).toFixed(2)}%</td>
                                                <td className={`text-center ${parseFloat(posti?.data?.perf3Ans) < 0 ? 'text-danger' : 'text-success'} `}>{isNaN(parseFloat(posti?.data?.perf3Ans)) ? '-' : parseFloat(posti?.data?.perf3Ans).toFixed(2)} %</td>
                                                <td className={`text-center ${parseFloat(posti?.data?.perf5Ans) < 0 ? 'text-danger' : 'text-success'} `}>{isNaN(parseFloat(posti?.data?.perf5Ans)) ? '-' : parseFloat(posti?.data?.perf5Ans).toFixed(2)} %</td>
                                                <td className={`text-center ${parseFloat(posti?.data?.perf8Ans) < 0 ? 'text-danger' : 'text-success'} `}>{isNaN(parseFloat(posti?.data?.perf8Ans)) ? '-' : parseFloat(posti?.data?.perf8Ans).toFixed(2)} %</td>
                                                <td className={`text-center ${parseFloat(posti?.data?.perf10Ans) < 0 ? 'text-danger' : 'text-success'} `}>{isNaN(parseFloat(posti?.data?.perf10Ans)) ? '-' : parseFloat(posti?.data?.perf10Ans).toFixed(2)} %</td>
                                              </tr>
                                              <tr className="text-center">
                                                <td className="text-left">Différence</td>
                                                <td className={`text-center ${parseFloat(post?.data?.performances?.data?.perfVeille) - parseFloat(posti?.data?.perfVeille) < 0 ? 'text-danger' : 'text-success'}`}>
                                                  {isNaN(parseFloat(post?.data?.performances?.data?.perfVeille) - parseFloat(posti?.data?.perfVeille)) ? '-' : (parseFloat(post?.data?.performances?.data?.perfVeille) - parseFloat(posti?.data?.perfVeille)).toFixed(2)} %
                                                </td>
                                                <td className={`text-center ${parseFloat(post?.data?.performances?.data?.perf4Semaines) - parseFloat(posti?.data?.perf4Semaines) < 0 ? 'text-danger' : 'text-success'}`}>
                                                  {isNaN(parseFloat(post?.data?.performances?.data?.perf4Semaines) - parseFloat(posti?.data?.perf4Semaines)) ? '-' : (parseFloat(post?.data?.performances?.data?.perf4Semaines) - parseFloat(posti?.data?.perf4Semaines)).toFixed(2)} %
                                                </td>
                                                <td className={`text-center ${parseFloat(post?.data?.performances?.data?.perf3Mois) - parseFloat(posti?.data?.perf3Mois) < 0 ? 'text-danger' : 'text-success'}`}>
                                                  {isNaN(parseFloat(post?.data?.performances?.data?.perf3Mois) - parseFloat(posti?.data?.perf3Mois)) ? '-' : (parseFloat(post?.data?.performances?.data?.perf3Mois) - parseFloat(posti?.data?.perf3Mois)).toFixed(2)} %
                                                </td>
                                                <td className={`text-center ${parseFloat(post?.data?.performances?.data?.perf6Mois) - parseFloat(posti?.data?.perf6Mois) < 0 ? 'text-danger' : 'text-success'}`}>
                                                  {isNaN(parseFloat(post?.data?.performances?.data?.perf6Mois) - parseFloat(posti?.data?.perf6Mois)) ? '-' : (parseFloat(post?.data?.performances?.data?.perf6Mois) - parseFloat(posti?.data?.perf6Mois)).toFixed(2)} %
                                                </td>
                                                <td className={`text-center ${parseFloat(post?.data?.performances?.data?.perf1erJanvier) - parseFloat(posti?.data?.perf1erJanvier) < 0 ? 'text-danger' : 'text-success'}`}>
                                                  {isNaN(parseFloat(post?.data?.performances?.data?.perf1erJanvier) - parseFloat(posti?.data?.perf1erJanvier)) ? '-' : (parseFloat(post?.data?.performances?.data?.perf1erJanvier) - parseFloat(posti?.data?.perf1erJanvier)).toFixed(2)} %
                                                </td>
                                                <td className={`text-center ${parseFloat(post?.data?.performances?.data?.perf1An) - parseFloat(posti?.data?.perf1An) < 0 ? 'text-danger' : 'text-success'}`}>
                                                  {isNaN(parseFloat(post?.data?.performances?.data?.perf1An) - parseFloat(posti?.data?.perf1An)) ? '-' : (parseFloat(post?.data?.performances?.data?.perf1An) - parseFloat(posti?.data?.perf1An)).toFixed(2)} %
                                                </td>
                                                <td className={`text-center ${parseFloat(post?.data?.performances?.data?.perf3Ans) - parseFloat(posti?.data?.perf3Ans) < 0 ? 'text-danger' : 'text-success'}`}>
                                                  {isNaN(parseFloat(post?.data?.performances?.data?.perf3Ans) - parseFloat(posti?.data?.perf3Ans)) ? '-' : (parseFloat(post?.data?.performances?.data?.perf3Ans) - parseFloat(posti?.data?.perf3Ans)).toFixed(2)} %
                                                </td>
                                                <td className={`text-center ${parseFloat(post?.data?.performances?.data?.perf5Ans) - parseFloat(posti?.data?.perf5Ans) < 0 ? 'text-danger' : 'text-success'}`}>
                                                  {isNaN(parseFloat(post?.data?.performances?.data?.perf5Ans) - parseFloat(posti?.data?.perf5Ans)) ? '-' : (parseFloat(post?.data?.performances?.data?.perf5Ans) - parseFloat(posti?.data?.perf5Ans)).toFixed(2)} %
                                                </td>
                                                <td className={`text-center ${parseFloat(post?.data?.performances?.data?.perf8Ans) - parseFloat(posti?.data?.perf8Ans) < 0 ? 'text-danger' : 'text-success'}`}>
                                                  {isNaN(parseFloat(post?.data?.performances?.data?.perf8Ans) - parseFloat(posti?.data?.perf8Ans)) ? '-' : (parseFloat(post?.data?.performances?.data?.perf8Ans) - parseFloat(posti?.data?.perf8Ans)).toFixed(2)} %
                                                </td>
                                                <td className={`text-center ${parseFloat(post?.data?.performances?.data?.perf10Ans) - parseFloat(posti?.data?.perf10Ans) < 0 ? 'text-danger' : 'text-success'}`}>
                                                  {isNaN(parseFloat(post?.data?.performances?.data?.perf10Ans) - parseFloat(posti?.data?.perf10Ans)) ? '-' : (parseFloat(post?.data?.performances?.data?.perf10Ans) - parseFloat(posti?.data?.perf10Ans)).toFixed(2)} %
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </div>
                                      ) : (
                                        <div className="table-responsive">

                                          <table

                                            className="table text-fade table-bordered table-hover display nowrap margin-top-10 w-p100">



                                            <thead className="table-header">

                                              <tr>
                                                <th className="text-left">Données</th>

                                                {post?.data?.performances?.data?.adaptValues1.map((item: (string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | ReactNode | null | undefined)[], index: Key | null | undefined) => (

                                                  <th key={index} className="text-center">{item[0]}</th>

                                                ))}

                                              </tr>
                                            </thead>
                                            <tbody>
                                              <tr className="text-center">
                                                <td className="text-left">Fonds</td>
                                                {Object.entries(performances.annualPerformance)
                                                  .sort(([year1], [year2]) => parseInt(year2) - parseInt(year1)) // Tri des années dans l'ordre décroissant
                                                  .map(([year, performance]) => (
                                                    <td key={year} className={`text-center ${performance && performance < 0 ? 'text-danger' : 'text-success'}`}>
                                                      {performance !== undefined && performance !== null
                                                        ? (typeof performance === 'number' ? performance.toFixed(2) + '%' : '-')
                                                        : '-'}
                                                    </td>
                                                  ))}
                                              </tr>
                                              <tr className="text-center">
                                                <td className="text-left">Catégorie</td>
                                                {slicedPostc && slicedPostc.map((item: any, index: any) => {
                                                  const fondsValue = typeof item[1] === 'number' ? item[1] : 0; // Vérification de type
                                                  return (
                                                    <td key={index} className={`text-center ${fondsValue < 0 ? 'text-danger' : 'text-success'} `}>
                                                      {fondsValue.toFixed(2)}
                                                    </td>
                                                  );
                                                })}
                                              </tr>
                                              <tr className="text-center">
                                                <td className="text-left">Différence Fonds - Categorie</td>
                                                {post?.data?.performances?.data?.adaptValues1.map((fondsItem: any, index: any) => {
                                                  const indiceItem = slicedPostc && slicedPostc[index];

                                                  // Vérifiez si fondsItem et indiceItem sont définis avant d'essayer d'accéder à leurs éléments
                                                  if (fondsItem && indiceItem && fondsItem[1] !== undefined && indiceItem[1] !== undefined) {
                                                    const difference = fondsItem[2] - indiceItem[1];
                                                    return <td key={index} className={`text-center ${difference < 0 ? 'text-danger' : 'text-success'}`}>{difference.toFixed(2)} %</td>;
                                                  } else {
                                                    // Gérer le cas où fondsItem ou indiceItem est undefined
                                                    return <td key={index} className={`text-center`}>-</td>;
                                                  }
                                                })}

                                              </tr>
                                              <tr className="text-center">
                                                <td className="text-left">Indice*</td>
                                                {Object.entries(performancesindices.annualPerformance)
                                                  .sort(([year1], [year2]) => parseInt(year2) - parseInt(year1)) // Tri des années dans l'ordre décroissant
                                                  .map(([year, performance]) => (
                                                    <td key={year} className={`text-center ${performance && performance < 0 ? 'text-danger' : 'text-success'}`}>
                                                      {performance !== undefined && performance !== null
                                                        ? (typeof performance === 'number' ? performance.toFixed(2) + '%' : '-')
                                                        : '-'}
                                                    </td>
                                                  ))}
                                              </tr>
                                              <tr className="text-center">
                                                <td className="text-left">Différence Fonds - Indice</td>
                                                {
                                                  Object.entries(performances.annualPerformance)
                                                    .sort(([year1], [year2]) => parseInt(year2) - parseInt(year1)) // Tri des années dans l'ordre décroissant
                                                    .map(([year, fondsItem], index) => {
                                                      const indiceItem = performancesindices.annualPerformance[year]; // Utilisation de l'année comme clé

                                                      if (fondsItem !== undefined && indiceItem !== undefined) {
                                                        const difference = fondsItem - indiceItem;
                                                        // Vérification si `difference` est un nombre valide
                                                        const differenceDisplay = isNaN(difference) ? '-' : `${difference.toFixed(2)} %`;
                                                        return (
                                                          <td key={year} className={`text-center ${difference < 0 ? 'text-danger' : 'text-success'}`}>
                                                            {differenceDisplay}
                                                          </td>
                                                        );
                                                      } else {
                                                        return <td key={year} className="text-center">-</td>;
                                                      }
                                                    })
                                                }
                                              </tr>
                                            </tbody>
                                          </table>
                                        </div>
                                      )}
                                    </div>

                                  </div>
                                </div>




                              </div>

                            </div>
                          </div>
                        </div >
                      </div >

                    </div >
                  </div >
                </div >
                <div className="box">
                  <div className="box-body pb-lg-0">
                    <div className="row">
                      <p><span className="text-primary">Ratios</span> | <span className="text-fade">Performance et Ratios  au {post?.data?.lastdatepreviousmonth}</span></p>
                      <div className="panel panel-default">
                        <div className="panel-heading">
                          <div className="row">


                          </div>
                        </div>


                        <div className="row">
                          <div className="col-sm-6">
                            <div className="row">
                              <div className="col-md-12">
                                <table className="table  table-sm">
                                  <thead className="table-header">
                                    <tr>
                                      <th className="text-center"></th>
                                      <th className="text-center">1 an</th>
                                      <th className="text-center">3 ans</th>
                                      <th className="text-center">5 ans</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr className="white-hover">
                                      <td className="text-main p-t-2" colSpan={4}>
                                        <strong>Perf Annualisée
                                          <span
                                            className="custom-button"
                                            onMouseEnter={() => setShowDescription(true)}
                                            onMouseLeave={() => setShowDescription(false)}
                                          >&nbsp;
                                            <FontAwesomeIcon
                                              className="text-right"
                                              icon={faSquare}></FontAwesomeIcon>
                                            {showDescription && (
                                              <div className="description">
                                                Le risque est mesuré par l écart-type des rendements hebdomadaires du fonds sur différentes périodes
                                              </div>
                                            )}
                                          </span>
                                        </strong>{" "}
                                        <span
                                          data-content="La performance annualisée d'un fonds sur une période donnée rapporte sa performance cumulée à une période d'un an (dès lors que la période considérée est supérieure à 1 an). Ainsi, la performance annualisée d'un fonds ayant connu une performance cumulée sur 2 ans de 30% est de 14.02% (on obtient ce résultat en prenant la racine carrée de 1.30, soit 1.14018, et en retranchant 1, soit 0.14018, arrondi à 14.02%). En d'autres termes, obtenir une performance de 30% sur 2 ans est équivalent à enregistrer une performance annuelle de 14.02% deux ans de suite. La performance annualisée ne correspond presque jamais à la réalité expérimentée par l'investisseur : elle permet avant tout de comparer plusieurs produits."
                                          data-helper-explanation=""
                                          data-trigger="hover"
                                          data-tooltip-isinit="true"
                                        ></span>
                                      </td>
                                    </tr>
                                    <tr className="text-center">
                                      <td className="text-left">Fonds</td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.performances?.data?.perfAnnualizedtodate1An)) ? '-' : parseFloat(post?.data?.performances?.data?.perfAnnualizedtodate1An).toFixed(2)} %</td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.performances?.data?.perfAnnualizedtodate3Ans)) ? '-' : parseFloat(post?.data?.performances?.data?.perfAnnualizedtodate3Ans).toFixed(2)} %</td>
                                      <td className={`text-center`}>{isNaN(parseFloat(post?.data?.performances?.data?.perfAnnualizedtodate5Ans)) ? '-' : parseFloat(post?.data?.performances?.data?.perfAnnualizedtodate5Ans).toFixed(2)} %</td>
                                    </tr>
                                    <tr className="text-center">
                                      <td className="text-left">Catégorie</td>
                                      <td className={`text-center  `}>{isNaN(parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perfannu1an)) ? '-' : parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perfannu1an).toFixed(2)} %</td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perfannu3an)) ? '-' : parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perfannu3an).toFixed(2)} %</td>
                                      <td className={`text-center`}>{isNaN(parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perfannu5an)) ? '-' : parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_perfannu5an).toFixed(2)} %</td>
                                    </tr>
                                    <tr className="text-center">
                                      <td className="text-left">Différence</td>
                                      <td className={`text-success ${isNaN(post?.data?.performances?.data?.perfAnnualizedtodate1An) || isNaN(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perfannu1an) || (parseFloat(post?.data?.performances?.data?.perfAnnualizedtodate1An) - parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perfannu1an)) < 0 ? 'text-danger' : ''}`}>
                                        {isNaN(post?.data?.performances?.data?.perfAnnualizedtodate1An) || isNaN(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perfannu1an) ? '-' : ((parseFloat(post?.data?.performances?.data?.perfAnnualizedtodate1An) - parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perfannu1an)).toFixed(2) + ' %')}
                                      </td>
                                      <td className={`text-success ${isNaN(post?.data?.performances?.data?.perfAnnualizedtodate3Ans) || isNaN(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perfannu3an) || (parseFloat(post?.data?.performances?.data?.perfAnnualizedtodate3Ans) - parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perfannu3an)) < 0 ? 'text-danger' : ''}`}>
                                        {isNaN(post?.data?.performances?.data?.perfAnnualizedtodate3Ans) || isNaN(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perfannu3an) ? '-' : ((parseFloat(post?.data?.performances?.data?.perfAnnualizedtodate3Ans) - parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perfannu3an)).toFixed(2) + ' %')}
                                      </td>
                                      <td className={`text-success ${isNaN(post?.data?.performances?.data?.perfAnnualizedtodate5Ans) || isNaN(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perfannu5an) || (parseFloat(post?.data?.performances?.data?.perfAnnualizedtodate3Ans) - parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perfannu3an)) < 0 ? 'text-danger' : ''}`}>
                                        {isNaN(post?.data?.performances?.data?.perfAnnualizedtodate5Ans) || isNaN(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perfannu5an) ? '-' : ((parseFloat(post?.data?.performances?.data?.perfAnnualizedtodate5Ans) - parseFloat(post?.data?.performances?.data?.performancesCategorie[0]?.moyenne_perfannu5an)).toFixed(2) + ' %')}
                                      </td>
                                    </tr>
                                    <tr className="text-center">
                                      <td className="text-left">Indice*</td>
                                      <td className={`text-center `}>{isNaN(parseFloat(posti?.data?.perfAnnualizedtodate1An)) ? '-' : parseFloat(posti?.data?.perfAnnualizedtodate1An).toFixed(2)} %</td>
                                      <td className={`text-center `}>{isNaN(parseFloat(posti?.data?.perfAnnualizedtodate3Ans)) ? '-' : parseFloat(posti?.data?.perfAnnualizedtodate3Ans).toFixed(2)} %</td>
                                      <td className={`text-center `}>{isNaN(parseFloat(posti?.data?.perfAnnualizedtodate5Ans)) ? '-' : parseFloat(posti?.data?.perfAnnualizedtodate5Ans).toFixed(2)} %</td>

                                    </tr>
                                    <tr className="text-center">
                                      <td className="text-left">Différence</td>
                                      <td className={`text-success ${isNaN(post?.data?.performances?.data?.perfAnnualizedtodate1An) || isNaN(posti?.data?.perfAnnualizedtodate1An) || (parseFloat(post?.data?.performances?.data?.perfAnnualizedtodate1An) - parseFloat(posti?.data?.perfAnnualizedtodate1An)) < 0 ? 'text-danger' : ''}`}>
                                        {isNaN(post?.data?.performances?.data?.perfAnnualizedtodate1An) || isNaN(posti?.data?.perfAnnualizedtodate1An) ? '-' : ((parseFloat(post?.data?.performances?.data?.perfAnnualizedtodate1An) - parseFloat(posti?.data?.perfAnnualizedtodate1An)).toFixed(2) + ' %')}
                                      </td>
                                      <td className={`text-success ${isNaN(post?.data?.performances?.data?.perfAnnualizedtodate3Ans) || isNaN(posti?.data?.perfAnnualizedtodate3Ans) || (parseFloat(post?.data?.performances?.data?.perfAnnualizedtodate3Ans) - parseFloat(posti?.data?.perfAnnualizedtodate3Ans)) < 0 ? 'text-danger' : ''}`}>
                                        {isNaN(post?.data?.performances?.data?.perfAnnualizedtodate3Ans) || isNaN(posti?.data?.perfAnnualizedtodate3Ans) ? '-' : ((parseFloat(post?.data?.performances?.data?.perfAnnualizedtodate3Ans) - parseFloat(posti?.data?.perfAnnualizedtodate3Ans)).toFixed(2) + ' %')}
                                      </td>
                                      <td className={`text-success ${isNaN(post?.data?.performances?.data?.perfAnnualizedtodate5Ans) || isNaN(posti?.data?.perfAnnualizedtodate5Ans) || (parseFloat(post?.data?.performances?.data?.perfAnnualizedtodate5Ans) - parseFloat(posti?.data?.perfAnnualizedtodate5Ans)) < 0 ? 'text-danger' : ''}`}>
                                        {isNaN(post?.data?.performances?.data?.perfAnnualizedtodate5Ans) || isNaN(posti?.data?.perfAnnualizedtodate5Ans) ? '-' : ((parseFloat(post?.data?.performances?.data?.perfAnnualizedtodate5Ans) - parseFloat(posti?.data?.perfAnnualizedtodate5Ans)).toFixed(2) + ' %')}
                                      </td>
                                    </tr>
                                    <tr className="white-hover">
                                      <td className="text-main p-t-3" colSpan={4}>
                                        <strong>Risque</strong>
                                      </td>
                                    </tr>
                                    <tr className="text-center">
                                      <td className="text-left">
                                        Volatilité{" "}
                                        <span
                                          data-content="Le risque est mesuré par l'écart-type des rendements hebdomadaires du fonds sur différentes périodes : 1 an, 3 ans, 5 ans, ou sur une période définie par l'utilisateur. On parle aussi parfois de volatilité. Plus le fonds est volatil, plus grande est la fourchette des performances possibles, qu'elles soient positives ou négatives. Toutes choses étant égales par ailleurs, moins le risque est élevé, meilleur a été le fonds pour l'investisseur, mais certains fonds ont à la fois un risque élevé et des performances passées excellentes, il faut donc savoir séparer le bon risque du mauvais risque."
                                          data-helper-explanation=""
                                          data-trigger="hover"
                                          data-tooltip-isinit="true"
                                        ></span>
                                      </td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.ratios1a?.data?.volatility)) ? '-' : parseFloat(post?.data?.ratios1a?.data?.volatility).toFixed(2)} %</td>
                                      <td className={`text-center`}>{isNaN(parseFloat(post?.data?.ratios3a?.data?.volatility)) ? '-' : parseFloat(post?.data?.ratios3a?.data?.volatility).toFixed(2)} %</td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.ratios5a?.data?.volatility)) ? '-' : parseFloat(post?.data?.ratios5a?.data?.volatility).toFixed(2)} %</td>
                                    </tr>
                                    <tr className="text-center">
                                      <td className="text-left">Volatilité Cat</td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_volatility1an)) ? '-' : parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_volatility1an).toFixed(2)} %</td>
                                      <td className={`text-center`}>{isNaN(parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_volatility3an)) ? '-' : parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_volatility3an).toFixed(2)} %</td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_volatility5an)) ? '-' : parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_volatility5an).toFixed(2)} %</td>

                                    </tr>
                                    <tr className="text-center">
                                      <td className="text-left">Volatilité Indice</td>
                                      <td className={`text-center`}>{isNaN(parseFloat(post?.data?.ratios1a?.data?.volatilityInd)) ? '-' : parseFloat(post?.data?.ratios1a?.data?.volatilityInd).toFixed(2)} %</td>
                                      <td className={`text-center`}>{isNaN(parseFloat(post?.data?.ratios3a?.data?.volatilityInd)) ? '-' : parseFloat(post?.data?.ratios3a?.data?.volatilityInd).toFixed(2)} %</td>
                                      <td className={`text-center`}>{isNaN(parseFloat(post?.data?.ratios5a?.data?.volatilityInd)) ? '-' : parseFloat(post?.data?.ratios5a?.data?.volatilityInd).toFixed(2)} %</td>
                                    </tr>
                                    <tr className="text-center">
                                      <td className="text-left">
                                        Perte Maximum{" "}
                                        <span
                                          data-content="Il s'agit de la perte la plus importante encourue par le fonds sur la période, c’est-à-dire ce qui aurait été perdu si le fonds avait été acheté au plus haut et vendu au plus bas possible sur la période."
                                          data-helper-explanation=""
                                          data-trigger="hover"
                                          data-tooltip-isinit="true"
                                        ></span>
                                      </td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.ratios1a?.data?.maxDrawdown)) ? '-' : parseFloat(post?.data?.ratios1a?.data?.maxDrawdown).toFixed(2)} %</td>
                                      <td className={`text-center`}>{isNaN(parseFloat(post?.data?.ratios3a?.data?.maxDrawdown)) ? '-' : parseFloat(post?.data?.ratios3a?.data?.maxDrawdown).toFixed(2)} %</td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.ratios5a?.data?.maxDrawdown)) ? '-' : parseFloat(post?.data?.ratios5a?.data?.maxDrawdown).toFixed(2)} %</td>

                                    </tr>
                                    <tr className="text-center">
                                      <td className="text-left">Perte Maximum Cat</td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_pertemax1an)) ? '-' : parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_pertemax1an).toFixed(2)} %</td>
                                      <td className={`text-center`}>{isNaN(parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_pertemax3an)) ? '-' : parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_pertemax3an).toFixed(2)} %</td>
                                      <td className={`text-center`}>{isNaN(parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_pertemax5an)) ? '-' : parseFloat(post?.data?.performances.data?.performancesCategorie[0]?.moyenne_pertemax5an).toFixed(2)} %</td>

                                    </tr>
                                    <tr className="text-center">
                                      <td className="text-left">Perte Maximum Indice</td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.ratios1a?.data?.maxDrawdownInd)) ? '-' : parseFloat(post?.data?.ratios1a?.data?.maxDrawdownInd).toFixed(2)} %</td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.ratios3a?.data?.maxDrawdownInd)) ? '-' : parseFloat(post?.data?.ratios3a?.data?.maxDrawdownInd).toFixed(2)} %</td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.ratios5a?.data?.maxDrawdownInd)) ? '-' : parseFloat(post?.data?.ratios5a?.data?.maxDrawdownInd).toFixed(2)} %</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>

                          <div className="col-sm-6">
                            <div className="row">
                              <div className="col-md-12">
                                <table className="table  table-sm">
                                  <thead className="table-header">
                                    <tr>
                                      <th className="text-center"></th>
                                      <th className="text-center">1 an</th>
                                      <th className="text-center">3 ans</th>
                                      <th className="text-center">5 ans</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr className="white-hover">
                                      <td className="text-main p-t-2" colSpan={4}><strong>Ratios</strong></td>
                                    </tr>
                                    <tr className="text-center">
                                      <td className="text-left">Ratio de Sharpe</td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.ratios1a?.data?.ratioSharpe)) ? '-' : parseFloat(post?.data?.ratios1a?.data?.ratioSharpe).toFixed(2)} </td>
                                      <td className={`text-center`}>{isNaN(parseFloat(post?.data?.ratios3a?.data?.ratioSharpe)) ? '-' : parseFloat(post?.data?.ratios3a?.data?.ratioSharpe).toFixed(2)} </td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.ratios5a?.data?.ratioSharpe)) ? '-' : parseFloat(post?.data?.ratios5a?.data?.ratioSharpe).toFixed(2)} </td>
                                    </tr>
                                    <tr className="text-center">
                                      <td className="text-left">Traking error</td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.ratios1a?.data?.trackingError)) ? '-' : parseFloat(post?.data?.ratios1a?.data?.trackingError).toFixed(2)} %</td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.ratios3a?.data?.trackingError)) ? '-' : parseFloat(post?.data?.ratios3a?.data?.trackingError).toFixed(2)} %</td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.ratios5a?.data?.trackingError)) ? '-' : parseFloat(post?.data?.ratios5a?.data?.trackingError).toFixed(2)} %</td>

                                    </tr>
                                    <tr className="text-center">
                                      <td className="text-left">Ratio d Information (IR)</td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.ratios1a?.data?.info)) ? '-' : parseFloat(post?.data?.ratios1a?.data?.info).toFixed(2)} </td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.ratios3a?.data?.info)) ? '-' : parseFloat(post?.data?.ratios3a?.data?.info).toFixed(2)} </td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.ratios5a?.data?.info)) ? '-' : parseFloat(post?.data?.ratios5a?.data?.info).toFixed(2)} </td>

                                    </tr>
                                    <tr className="text-center">
                                      <td className="text-left">Up Capture Ratio</td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.ratios1a?.data?.UpCaptureRatio)) ? '-' : parseFloat(post?.data?.ratios1a?.data?.UpCaptureRatio).toFixed(2)} %</td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.ratios3a?.data?.UpCaptureRatio)) ? '-' : parseFloat(post?.data?.ratios3a?.data?.UpCaptureRatio).toFixed(2)} %</td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.ratios5a?.data?.UpCaptureRatio)) ? '-' : parseFloat(post?.data?.ratios5a?.data?.UpCaptureRatio).toFixed(2)} %</td>

                                    </tr>
                                    <tr className="text-center">
                                      <td className="text-left">Down Capture Ratio</td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.ratios1a?.data?.DownCaptureRatio)) ? '-' : parseFloat(post?.data?.ratios1a?.data?.DownCaptureRatio).toFixed(2)} %</td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.ratios3a?.data?.DownCaptureRatio)) ? '-' : parseFloat(post?.data?.ratios3a?.data?.DownCaptureRatio).toFixed(2)} %</td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.ratios5a?.data?.DownCaptureRatio)) ? '-' : parseFloat(post?.data?.ratios5a?.data?.DownCaptureRatio).toFixed(2)} %</td>

                                    </tr>
                                    <tr className="text-center">
                                      <td className="text-left">Ratio Omega</td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.ratios1a?.data?.omega)) ? '-' : parseFloat(post?.data?.ratios1a?.data?.omega).toFixed(2)} %</td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.ratios3a?.data?.omega)) ? '-' : parseFloat(post?.data?.ratios3a?.data?.omega).toFixed(2)} %</td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.ratios5a?.data?.omega)) ? '-' : parseFloat(post?.data?.ratios5a?.data?.omega).toFixed(2)} %</td>

                                    </tr>
                                    <tr className="white-hover">
                                      <td className="text-main p-t-3" colSpan={4}><strong>Réactivité</strong></td>
                                    </tr>
                                    <tr className="text-center">
                                      <td className="text-left">Beta</td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.ratios1a?.data?.beta)) ? '-' : parseFloat(post?.data?.ratios1a?.data?.beta).toFixed(2)} </td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.ratios3a?.data?.beta)) ? '-' : parseFloat(post?.data?.ratios3a?.data?.beta).toFixed(2)} </td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.ratios5a?.data?.beta)) ? '-' : parseFloat(post?.data?.ratios5a?.data?.beta).toFixed(2)} </td>

                                    </tr>
                                    <tr className="text-center">
                                      <td className="text-left">R²</td>
                                      <td className={`text-center`}>{isNaN(parseFloat(post?.data?.ratios1a?.data?.r2)) ? '-' : parseFloat(post?.data?.ratios1a?.data?.r2).toFixed(2)} %</td>
                                      <td className={`text-center`}>{isNaN(parseFloat(post?.data?.ratios3a?.data?.r2)) ? '-' : parseFloat(post?.data?.ratios3a?.data?.r2).toFixed(2)} %</td>
                                      <td className={`text-center`}>{isNaN(parseFloat(post?.data?.ratios5a?.data?.r2)) ? '-' : parseFloat(post?.data?.ratios5a?.data?.r2).toFixed(2)} %</td>

                                    </tr>
                                    <tr className="text-center">
                                      <td className="text-left">Beta haussier</td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.ratios1a?.data?.betaHaussier)) ? '-' : parseFloat(post?.data?.ratios1a?.data?.betaHaussier).toFixed(2)} </td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.ratios3a?.data?.betaHaussier)) ? '-' : parseFloat(post?.data?.ratios3a?.data?.betaHaussier).toFixed(2)} </td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.ratios5a?.data?.betaHaussier)) ? '-' : parseFloat(post?.data?.ratios5a?.data?.betaHaussier).toFixed(2)} </td>

                                    </tr>
                                    <tr className="text-center">
                                      <td className="text-left">Beta baissier</td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.ratios1a?.data?.betaBaiss)) ? '-' : parseFloat(post?.data?.ratios1a?.data?.betaBaiss).toFixed(2)} </td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.ratios3a?.data?.betaBaiss)) ? '-' : parseFloat(post?.data?.ratios3a?.data?.betaBaiss).toFixed(2)} </td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.ratios5a?.data?.betaBaiss)) ? '-' : parseFloat(post?.data?.ratios5a?.data?.betaBaiss).toFixed(2)} </td>

                                    </tr>
                                    <tr className="white-hover">
                                      <td className="text-main p-t-3" colSpan={4}><strong>Asymétrie</strong></td>
                                    </tr>
                                    <tr className="text-center">
                                      <td className="text-left">Skewness</td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.ratios1a?.data?.skewness)) ? '-' : parseFloat(post?.data?.ratios1a?.data?.skewness).toFixed(2)} %</td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.ratios3a?.data?.skewness)) ? '-' : parseFloat(post?.data?.ratios3a?.data?.skewness).toFixed(2)} %</td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.ratios5a?.data?.skewness)) ? '-' : parseFloat(post?.data?.ratios5a?.data?.skewness).toFixed(2)} %</td>

                                    </tr>
                                    <tr className="text-center">
                                      <td className="text-left">Kurtosis</td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.ratios1a?.data?.kurtosis)) ? '-' : parseFloat(post?.data?.ratios1a?.data?.kurtosis).toFixed(2)} %</td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.ratios3a?.data?.kurtosis)) ? '-' : parseFloat(post?.data?.ratios3a?.data?.kurtosis).toFixed(2)} %</td>
                                      <td className={`text-center `}>{isNaN(parseFloat(post?.data?.ratios5a?.data?.kurtosis)) ? '-' : parseFloat(post?.data?.ratios5a?.data?.kurtosis).toFixed(2)} %</td>

                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-2 text-center">

                      </div>


                    </div>

                  </div>
                </div>
              </div >




            </div >
          </section >
        </div >

      </div >
    </Fragment >
  );
}
