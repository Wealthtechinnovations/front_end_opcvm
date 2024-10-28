"use client";

import Link from "next/link";
import { ChangeEvent, Fragment, useEffect, useState } from "react";


import Select from 'react-select';
//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import Header from '@/app/Header';
import { urlconstant } from "@/app/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const options = [
  { value: 1, label: 'Option 1' },
  { value: 2, label: 'Option 2' },
  { value: 3, label: 'Option 3' },
  // Ajoutez plus d'options au besoin
];
interface PageProps {
  searchParams: {
    id: number;
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
export default function Importvl(props: PageProps) {
  const societeconneted = props.searchParams.id;

  useEffect(() => {
    // Appel à l'API lors du premier rendu du composant

  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();


  };

  const [file, setFile] = useState<File | null>(null); // Définir le type de l'état de fichier
  const [message, setMessage] = useState('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    try {
      if (!file) {
        setMessage('Veuillez sélectionner un fichier.');
        return;
      }

      const formData = new FormData();
      formData.append('fichier', file);
      console.log(formData);
      const response = await fetch(`${urlconstant}/api/importfondsvl`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setMessage('Données importées avec succès !');
      } else {
        setMessage('Erreur lors de l\'importation des données.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'importation des données:', error);
      setMessage('Erreur lors de l\'importation des données.');
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
                      <p><span className="text-primary">Importation</span> | <span className="text-fade"></span></p>

                    </div>

                  </div>
                  <hr />
                  <form onSubmit={handleSubmit}>
                    <Link
                      className="btn btn-main"
                      style={{ ...buttonStyle, width: "100%" }} // Appliquer le style du bouton avec une largeur de 100%
                      href="/excel-files/FondVlimport.xlsx"
                      passHref
                    >
                      Télécharger le modèle Excel
                    </Link>

                    <div className="col-md-12">
                      <label>
                        Fichier:
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        name="fichier"
                        onChange={handleFileChange}
                        required
                      />

                    </div>


                    {/* Ajoutez les autres champs ici */}

                    <br />



                    <div>

                      <br />

                      <button onClick={handleUpload} className="text-right" style={{
                        textDecoration: 'none', // Remove underline
                        backgroundColor: '#6366f1', // Background color
                        color: 'white', // Text color
                        padding: '10px 20px', // Padding
                        borderRadius: '5px', // Rounded corners
                      }} type="submit">Enregistrer</button>

                    </div>

                    {/* Ajoutez les autres pages ici */}


                  </form>

                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Fragment >
  );
}