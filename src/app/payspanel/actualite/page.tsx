"use client";
import { urlconstant, urlconstantimage } from "@/app/constants";

import Link from "next/link";
import { Fragment, SetStateAction, useEffect, useState, ChangeEventHandler, useCallback, ChangeEvent } from "react";
import Select, { SingleValue } from 'react-select';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faMapMarkerAlt, faPhoneAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import Header from '@/app/Header';
import { Dropdown } from "react-bootstrap";
import Head from "next/head";
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/navigation";
import { magic } from '../../../../magic'; // Importer correctement le module
import Swal from "sweetalert2";


interface Actualite {
  date: string; // Assurez-vous que le type de date correspond à ce que votre API renvoie
  description: string;
  image: string;
  type: string;
  username: string;

  // Ajoutez d'autres propriétés si nécessaire
}
async function getactualite() {
  const data = (

    await fetch(`${urlconstant}/api/getactualite`, {
      method: 'GET', // Assurez-vous que la méthode HTTP correspond à votre API
    })
  ).json();
  return data;
}



interface PageProps {
  searchParams: {
    selectedRows: any;
    id: any;
  };
}

export default function Pagehome(props: PageProps) {


  let societeconneted = props.searchParams.id;

  const [actualites, setActualites] = useState<Actualite[]>([]);

  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Assurez-vous que target.files est de type FileList ou null
    const file = e.target.files?.[0]; // Utilisation de l'opérateur de chaînage optionnel pour éviter les erreurs si files est null
    if (file) {
      setImage(file);
    }
  };
  useEffect(() => {
    // Appel à l'API lors du premier rendu du composant
    async function fetchData() {
      try {


        const data8 = await getactualite();
        setActualites(data8);

      } catch (error) {
        console.error("Erreur lors de l'appel à l'API :", error);
      }
    }
    fetchData();
  }, []);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const router = useRouter();

  const handleSubmitactu = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const formDatass = new FormData();
    formDatass.append('description', description);

    if (image != null)
      formDatass.append('fichier', image);

    formDatass.append('type', type);
    formDatass.append('user_id', societeconneted);
    formDatass.append('username', societeconneted);

    try {
      const response = await fetch(`${urlconstant}/api/actualite`, {
        method: 'POST',

        body: formDatass
      });

      console.log('Article uploaded successfully');
      const data = await response.json();
      console.log(data);
      if (response.status === 200) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          html: `<p> Données enregistrées.</p>`,
          showConfirmButton: false,
          timer: 5000,
        });
        setTimeout(() => {
          const href = `/payspanel/actualite?id=${societeconneted}`;
          window.location.href = href;  // This will navigate and refresh the page

          //     router.push(href);
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
      console.error('Error uploading article:', error);
    }
  };


  // Fonction de deconnexion
  const logout = useCallback(() => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    if (magic && magic.user) {

      magic.user.logout().then(() => {
        // Actualisation et redirection
        setTimeout(() => {
          window.location.reload()
        }, 1000)
        router.push("/"); //Redirection après connexion

      });
    }
  }, [router]);
  return (
    < Fragment >
      <Header />

      <aside className="main-sidebar">
        <section className="sidebar position-relative">
          <div className="multinav">

            <div className="multinav-scroll" style={{ height: '97%' }}>
              <ul data-widget="tree" className='sidebar-menu'>

                <li>
                  <Link href={`/payspanel/pagehome?id=${societeconneted}`} >
                    <i data-feather="plus-square"></i>
                    <span>Tableau de bord</span>
                  </Link>
                </li>

                <li className={`dropdown ${isDropdownOpen ? 'open' : ''}`}>
                  <a href="#" onClick={toggleDropdown} className="dropdown-toggle" data-toggle="dropdown">
                    <i data-feather={isDropdownOpen ? "minus-square" : "plus-square"}></i>
                    <span>Fonds</span>
                  </a>
                  {isDropdownOpen && (
                    <>
                      <li>
                        <a href={`/payspanel/fondsvalide?id=${societeconneted}`}>   <i className="bi bi-check2"></i>
                          <span style={{ marginLeft: '55px' }}><FontAwesomeIcon icon={faThumbsUp} />Fonds validés</span></a>
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
                  <Link href={`/payspanel/actualite?id=${societeconneted}`} style={{ backgroundColor: "#3b82f6", color: "white" }} >
                    <i data-feather="user"></i>
                    <span>Actualités</span>
                  </Link>
                </li>

                <li>
                  <Link href={``} onClick={logout}>
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
            <div className="row">

              <div className="col-xl-12">
                <div className="card">
                  <div className="card-body">
                    <div className="tab-content">

                      <div className="border rounded mt-2 mb-3">
                        <form onSubmit={handleSubmitactu} action="#" className="comment-area-box">
                          <input className="form-control"
                            type="text"
                            placeholder="Titre de la publication"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                          />
                          <br />
                          <textarea value={description}
                            onChange={(e) => setDescription(e.target.value)} className="form-control border-0 resize-none" placeholder="Description...."></textarea>
                          <input
                            type="file"
                            name="fichier" onChange={handleFileChange} className="form-control" />
                          <div className="p-2 bg-gray-100 d-flex justify-content-between align-items-center">

                            <button type="submit" className="btn btn-sm btn-primary-light waves-effect">Poster</button>
                          </div>
                        </form>
                      </div>
                      {/* End comment box */}

                      {/* Story Box 1 */}
                      <div className="border border-light rounded p-2 mb-3">
                        <div className="d-flex">
                          <img className="me-2 rounded-circle bg-light" src="/images/avatar/avatar-1.png" alt="Generic placeholder image" height="32" />
                          <div>
                            <h5 className="fs-15 m-0">Jeremy Tomlinson</h5>
                            <p className="text-muted"><small>about 2 minuts ago</small></p>
                          </div>
                        </div>
                        <p className="text-fade">Story based around the idea of time lapse, animation to post soon!</p>

                        <img src="/images/gallery/thumb-sm/1.jpg" alt="post-img" className="rounded bg-light m-1" height="100" />


                      </div>
                      {actualites.map((actualite, index) => (
                        <div key={index} className="border border-light rounded p-2 mb-3">
                          <div className="d-flex">
                            <img className="me-2 rounded-circle bg-light" src="/images/avatar/avatar-1.png" alt="Avatar" height="32" />
                            <div>
                              <h5 className="fs-15 m-0">{actualite.username}</h5>
                              <p className="text-muted"><small>{actualite.date}</small></p>
                            </div>
                          </div>
                          <p className="text-fade">{actualite.description}</p>
                          <img className="img-fluid rounded bg-light m-1" src={actualite.image ? `${urlconstantimage}/${actualite.image}` : "/images/avatar/375x200/1.jpg"} alt="Image" style={{ maxHeight: "300px", maxWidth: "300px" }} />
                        </div>
                      ))}

                      <div className="text-center">
                        <a href="javascript:void(0);" className="text-danger"><i className="mdi mdi-spin mdi-loading me-1"></i> Load more </a>
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