"use client";
import { urlconstant, urlconstantimage } from "@/app/constants";

import Link from "next/link";
import { Fragment, JSXElementConstructor, Key, ReactNode, ReactElement, ReactPortal, SetStateAction, useEffect, useState } from "react";
import Select from 'react-select';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFileDownload, faPhoneAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';

//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
//import { router } from 'next/router';
import Header from '@/app/Header';
import Router from 'next/router';
import { magic } from "../../../../../magic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Headermenu from "@/app/Headermenu";
import Sidebar from "@/app/sidebar";

const options = [
  { value: 1, label: 'Option 1' },
  { value: 2, label: 'Option 2' },
  { value: 3, label: 'Option 3' },
  // Ajoutez plus d'options au besoin
];



interface Pays {
  value: any[]; // ou un type spécifique pour les éléments du tableau 'funds'

}
const buttonStyle = {
  backgroundColor: "#3b82f6",
  color: "white",
  padding: "10px 20px", // Adjust padding to control the button size
  borderRadius: "5px", // Add rounded corners for a consistent look
  cursor: "pointer", // Add a pointer cursor on hover for better user experience
};
interface FormData {
  pays: string;
  nom: string;
  name: string;
  description: string;
  email: string;
  tel: string;
}

async function getsociete(id: string) {
  const data = (
    await fetch(`${urlconstant}/api/getSocietebyid/${id}`)
  ).json();
  return data;
}
interface Option {
  value: string;
}

interface PageProps {
  searchParams: {
    selectedRows: any;
    id: any;
  };
}
interface Document {
  nom: ReactNode;
  id: Key | null | undefined;
  type_fichier: any;
  date: any;
  annee: any;
  fichier: any;
  fond: any;
  mois: any;


}
const documentsall = [
  { name: 'Reporting mensuel', type: 'rapport', icon: 'fa-image' },
  { name: 'DIC', type: 'autre', icon: 'fa-video-camera' },
  { name: 'Prospectus', type: 'autre', icon: 'fa-file' },
  { name: 'Rapport annuel', type: 'rapport', icon: 'fa-user' },
  { name: 'Lettre aux porteurs', type: 'autre', icon: 'fa-trash' },
  { name: 'Reporting ISR', type: 'autre', icon: 'fa-trash' },
  { name: 'Portefeuille', type: 'autre', icon: 'fa-trash' },
  { name: 'Rapport Semestriel', type: 'rapport', icon: 'fa-trash' },
  { name: 'Reglement du fonds', type: 'autre', icon: 'fa-trash' },
  { name: 'Fiche commerciale', type: 'autre', icon: 'fa-trash' },
  { name: 'Due diligence', type: 'autre', icon: 'fa-trash' }
];


type Documents = Document[];


export default function Profile(props: PageProps) {
  let societeconneted = props.searchParams.id;
  const [activeIndex, setActiveIndex] = useState(0); // Initialisation avec 0
  const [filteredDocument, setFilteredDocument] = useState<Document[] | null>(null);

  const handleClick = (index: number, doc: string) => {
    setActiveIndex(index);
    if (documents) {
      setFilteredDocument(documents.filter(document => document.type_fichier === doc));
    }
  };
  const [managementCompany, setManagementCompany] = useState<FormData>({
    name: '',
    description: '',
    email: '',
    tel: '',
    pays: '',
    nom: '',
  });

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    email: '',
    tel: '',
    pays: '',
    nom: '',
  });
  const [documents, setDocuments] = useState<Documents | null>(null);


  useEffect(() => {
    async function fetchData() {
      try {

        const data = await getsociete(societeconneted);

        setManagementCompany(data.data.societe);
        console.log(managementCompany);
      } catch (error) {
        console.error("Erreur lors de l'appel à l'API :", error);
      }
    }
    fetchData();
  }, []);
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch(`${urlconstant}/api/documents/${societeconneted}`);
        if (response.ok) {
          const data = await response.json();
          setDocuments(data);
          setFilteredDocument(data);
        } else {
          console.error('Erreur lors de la récupération des documents:', response.statusText);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des documents:', error);
      }
    };
    if (societeconneted) {
      fetchDocuments();
    }
  }, [societeconneted,]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setSearchQuery(e.target.value);
  };
  const handleDownload = (e: { target: { value: SetStateAction<string>; }; }) => {
    setSearchQuery(e.target.value);
  };
  const filteredDocuments = filteredDocument && filteredDocument.filter(document => {
    const searchTerms = searchQuery.toLowerCase().split(' ');
    return searchTerms.every(term =>
      Object.values(document).some(value =>
        typeof value === 'string' && value.toLowerCase().includes(term)
      )
    );
  });

  console.log(managementCompany);
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
                <div className="col-xl-12 col-lg-12 mb-4">
                  <div className="card text-center shadow-lg border-0 rounded-lg overflow-hidden">
                    <div className="card-body bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-500 text-white">
                      <img src="/images/avatar/avatar-13.png" className="bg-light rounded-circle avatar-lg img-thumbnail border-4 border-white mb-3" alt="profile-image" />
                      <h4 className="mb-0 mt-2">{societeconneted}</h4>



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
              <div className="box">
                <div className="box-header with-border">
                  <div className="d-inline-block">
                    <div className="lookup lookup-sm lookup-right">
                      <input
                        type="text"
                        name="s"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={handleSearchChange}
                      />
                    </div>
                  </div>
                  <div className="box-controls pull-right">
                    <div className="box-header-actions" style={{ marginTop: '-30px' }}>
                      <Link href={`/panel/societegestionpanel/document/ajout?id=${societeconneted}`} style={{
                        textDecoration: 'none',
                        backgroundColor: '#6366f1',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '5px',
                      }}>
                        <i data-feather="plus-square"></i>
                        <span>Ajouter un document</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-xl-3 col-lg-4 col-12">
                  <div className="box">
                    <div className="box-body">
                      <ul className="nav nav-pills file-nav d-block">
                        {documentsall.map((doc, index) => (

                          <li className="nav-item" key={index}>
                            <a
                              className={`nav-link rounded ${activeIndex === index ? 'active' : ''}`}
                              href="javascript:void(0)"
                              onClick={() => handleClick(index, doc.name)}
                            >
                              <i className={`fs-18 me-10 fa ${doc.icon}`}></i>
                              <span className="fs-18 mt-2">{doc.name}</span>
                            </a>
                          </li>
                        ))}


                      </ul>

                    </div>
                  </div>
                </div>

                <div className="col-xl-9 col-lg-8 col-12">
                  <div className="card-columns">
                    {filteredDocuments && filteredDocuments.map((document: Document) => (

                      <div className="card" key={document.id}>
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <label className="mb-0"></label>
                            </div>

                          </div>
                          <div className="text-center">
                            <FontAwesomeIcon icon={faFileDownload} width={50} />
                            <p className=" mb-0">{document.fichier}</p>
                            <p className="text-fade mb-0">{document.date}</p>
                            <p className="text-fade mb-0">Mois: {document.mois}</p>
                            <p className="text-fade mb-0">Année:{document.annee}</p>

                          </div>
                          <div className="text-right">
                            <a
                              className="btn btn-main"
                              style={{ ...buttonStyle, width: "100%" }} // Appliquer le style du bouton avec une largeur de 100%
                              href={`${urlconstant}/doc/${managementCompany.pays}/${managementCompany.nom}/${document.fond}/${document.fichier}/${document.id}`}
                              download={`${document.fichier}`} // Spécifiez le nom du fichier ici

                              target="_blank"
                            >
                              <FontAwesomeIcon icon={faFileDownload} />
                              Télécharger le document
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

              </div>



              {/*
              <div className="box ">
                <div className="box-body">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Nom du fichier</th>
                        <th>Type de fichier</th>
                        <th>date</th>
                        <th>annee</th>
                        <th>mois</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDocuments && filteredDocuments.map((document: Document) => (
                        <tr key={document.id}>
                          <td>{document.nom}</td>
                          <td>{document.type_fichier}</td>
                          <td>{document.date}</td>
                          <td>{document.annee}</td>
                          <td>{document.mois}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                </div>
              </div>
                      */}

            </div>

          </div>
        </section>
      </div >
      </div>
      </div>
      </div>
    </Fragment >
  );
}