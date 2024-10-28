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

interface Funds {
  data: {
    funds: any[]; // ou un type spécifique pour les éléments du tableau 'funds'
  };
}

async function getsociete(id: string) {
  const data = (
    await fetch(`${urlconstant}/api/getSocietebyid/${id}`)
  ).json();
  return data;
}
async function getFonds(id: string) {
  const data = (

    await fetch(`${urlconstant}/api/getfondbyuser/${id}?pays=${id}`, {
      method: 'GET', // Assurez-vous que la méthode HTTP correspond à votre API
    })
  ).json();
  return data;
}
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
    selectedRows: any;
    id: any;
  };
}

interface FormData {
  page: number;
  nom: string;
  description: string;
  numeroagrement: string;
  email: string;
  password: string;
  site_web: string;
  dateimmatriculation: string;
  regulateur: string;
  tel: string;
  pays: string;
  societ: string;
  devise: string;
}


interface Pays {
  value: string; // ou un type spécifique pour les éléments du tableau 'funds'

}
interface Regulateur {
  value: string; // ou un type spécifique pour les éléments du tableau 'funds'

}
interface Devise {
  value: string; // ou un type spécifique pour les éléments du tableau 'funds'

}
export default function Pagehome(props: PageProps) {
  const [managementCompany, setManagementCompany] = useState<FormData>({
    page: 1,
    nom: '',
    description: '',
    numeroagrement: '',
    email: '',
    password: '',
    site_web: '',
    dateimmatriculation: '',
    regulateur: '',
    tel: '',
    pays: '',
    societ: '',
    devise: ''
  });

  let societeconneted = props.searchParams.id;
  const [deviseOptions, setDeviseOptions] = useState([]);

  const [optionsPays, setOptionsPays] = useState([]);
  const [regulateurOptions, setRegulateurOptions] = useState([]);
  const [funds, setFunds] = useState<Funds | null>(null);
  const [actualites, setActualites] = useState<Actualite[]>([]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [base100Data, setBase100Data] = useState([]); // Nouvel état pour les données en base 100
  const nextPage = () => {
    setFormData({ ...formData, page: formData.page + 1 });
  };

  const prevPage = () => {
    setFormData({ ...formData, page: formData.page - 1 });
  };
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [selectedPays, setSelectedPays] = useState<Pays | null>(null);
  const [selectedRegulateur, setSelectedRegulateur] = useState<Regulateur | null>(null);
  const [selectedDevise, setSelectedDevise] = useState<Devise | null>(null);

  const [formData, setFormData] = useState({
    page: 1,
    nom: '',
    description: '',
    numeroagrement: '',
    email: '',
    password: '',
    site_web: '',
    dateimmatriculation: '',
    regulateur: '',
    tel: '',
    pays: '',
    societ: '',
    devise: ''
  });
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
  useEffect(() => {
    // Appel à l'API lors du premier rendu du composant
    async function fetchData() {
      try {

        const data = await getFonds(societeconneted);

        setFunds(data);

        // const data1 = await getsociete(societeconneted);

        // setManagementCompany(data1.data.societe);
        console.log(managementCompany);
        const data8 = await getactualite();
        setActualites(data8);

      } catch (error) {
        console.error("Erreur lors de l'appel à l'API :", error);
      }
    }
    fetchData();
  }, []);
  const [activeTab, setActiveTab] = useState('aboutme');

  const handleTabClick = (tabId: SetStateAction<string>) => {
    setActiveTab(tabId);
  };
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    console.log(formData)
    formData.societ = societeconneted;
    if (selectedPays)
      formData.pays = selectedPays.value;

    if (selectedDevise)
      formData.devise = selectedDevise?.value;

    if (selectedRegulateur)
      formData.regulateur = selectedRegulateur?.value

    const formDatas = new FormData(); // Créez un nouvel objet FormData

    // Ajoutez les champs de formData à formDatas
    formDatas.append('nom', formData.nom);
    formDatas.append('societ', formData.societ);
    formDatas.append('description', formData.description);
    formDatas.append('tel', formData.tel);
    formDatas.append('dateimmatriculation', formData.dateimmatriculation);
    formDatas.append('email', formData.email);
    formDatas.append('devise', formData.devise);
    formDatas.append('regulateur', formData.regulateur);
    formDatas.append('password', formData.password);
    formDatas.append('pays', formData.pays);
    formDatas.append('numeroagrement', formData.numeroagrement);
    formDatas.append('site_web', formData.site_web);


    console.log(formData)

    try {

      const response = await fetch(`${urlconstant}/api/updateSociete`, {
        headers: {
          'Content-Type': 'application/json', // Spécifiez le type de contenu que vous envoyez
        },
        method: 'POST',

        body: JSON.stringify(formData)
      });
      const data = await response.json();
      console.log(data);
      if (response.status === 200) {
        //  setIsModalOpen(true);

        // Redirect the user to another page after a delay (e.g., 2 seconds)
        setTimeout(() => {
          const href = `/payspanel/pagehome?id=${societeconneted}`;

          router.push(href);
        }, 2000);
      }
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire :', error);
    }
  };
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
          const href = `/payspanel/pagehome?id=${societeconneted}`;
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

  const handleChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    const { name, value, selectedOptions } = e.target;
    if (name) {
      setFormData({
        ...formData,
        [name]: name === 'activite' && selectedOptions ? Array.from(selectedOptions).map((option: HTMLOptionElement) => option.value) : value
      });
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
                  <Link href={`/payspanel/pagehome?id=${societeconneted}`} style={{ backgroundColor: "#3b82f6", color: "white" }}>
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
                    <h4 className="title-bx text-primary">Panel</h4>
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
              <div className="col-xl-4 col-lg-5">
                <div className="card text-center">
                  <div className="card-body">
                    <div className="card-body">
                      <img src="/images/avatar/avatar-13.png" className="bg-light w-100 h-100 rounded-circle avatar-lg img-thumbnail" alt="profile-image" />

                      <h4 className="mb-0 mt-2">{societeconneted}</h4>
                      <p className="text-muted fs-14">Pays</p>





                    </div>
                  </div>
                </div>
                {/*     <div className="card">
                  <div className="card-body">
                    <div>
                      <div className="dropdown float-end">
                        <a href="#" className="dropdown-toggle no-caret" data-bs-toggle="dropdown" aria-expanded="false">
                          <i className="mdi mdi-dots-vertical"></i>
                        </a>
                        <div className="dropdown-menu dropdown-menu-end">
                          <a href="javascript:void(0);" className="dropdown-item">Settings</a>
                          <a href="javascript:void(0);" className="dropdown-item">Action</a>
                        </div>
                      </div>
                       <h4 className="header-title mb-3">Personnel</h4>

                      <div>
                        <div className="d-flex align-items-center mb-30">
                          <div className="me-15">
                            <img src="/images/avatar/avatar-1.png" className="bg-primary-light avatar avatar-lg rounded-circle" alt="" />
                          </div>
                          <div className="d-flex flex-column flex-grow-1">
                            <a href="#" className="text-dark hover-primary mb-1 fs-16">Sophia</a>
                            <span className="text-mute fs-12">Manager</span>
                          </div>
                          <div>
                            <a href="#" className="btn btn-sm btn-primary-light">Reply</a>
                          </div>
                        </div>

                    </div>
                    </div>
                  </div>
                </div>*/}
              </div>
              <div className="col-xl-8 col-lg-7">
                <div className="card">
                  <div className="card-body">
                    <div>
                      <ul className="nav nav-pills bg-nav-pills nav-justified mb-3">
                        <li className="nav-item">
                          <a href="#aboutme" onClick={() => handleTabClick('aboutme')} className={`nav-link rounded-0 ${activeTab === 'aboutme' ? 'active' : ''}`}>
                            Apropos
                          </a>
                        </li>
                        <li className="nav-item">
                          <a href="#actu" onClick={() => handleTabClick('actu')} className={`nav-link rounded-0 ${activeTab === 'actu' ? 'active' : ''}`}>
                            Actualité
                          </a>
                        </li>



                      </ul>
                      <div className="tab-content">

                        <div className={`tab-pane ${activeTab === 'aboutme' ? 'show active' : ''}`} id="aboutme">
                          <h5 className="text-uppercase"><i className="mdi mdi-briefcase me-1"></i> Description</h5>

                          <div className="timeline-alt pb-0">
                            <div className="timeline-item">
                              <i className="mdi mdi-circle bg-info-light text-info timeline-icon"></i>
                              <div className="timeline-item-info">
                                <h5 className="fs-14 mt-0 mb-1">Pays</h5>
                                <p className="text-muted mt-2 mb-0 pb-3">{managementCompany.description}</p>
                              </div>
                            </div>

                            {/* Repite el mismo patrón para los otros elementos de la experiencia */}
                          </div>

                          <h5 className="mb-3 mt-4 text-uppercase"><i className="mdi mdi-cards-variant me-1"></i> Les Fonds</h5>
                          <div className="table-responsive">

                            <table className="table text-fade table-borderless table-nowrap mb-0">
                              <thead className="table-light">
                                <tr>
                                  <th>Nom du fond</th>
                                  <th>Code ISIN</th>
                                  <th>Catégorie</th>
                                  <th>Devise</th>
                                  <th>Date de dernière VL</th>
                                </tr>
                              </thead>
                              <tbody>
                                {funds?.data?.funds.slice(-5).map((item: any) => (
                                  <tr key={item.id}>
                                    <td>{item?.nom_fond}</td>
                                    <td>{item?.code_ISIN}</td>
                                    <td>{item?.categorie_national}</td>
                                    <td>{item?.dev_libelle}</td>
                                    <td>{item?.datejour}</td>

                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          {/* <div className="table-responsive">
                            <table className="table text-fade table-borderless table-nowrap mb-0">
                              <thead className="table-light">
                                <tr>
                                  <th>#</th>
                                  <th>Clients</th>
                                  <th>Project Name</th>
                                  <th>Start Date</th>
                                  <th>Due Date</th>
                                  <th>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>1</td>
                                  <td>Nil Yeager</td>
                                  <td>App design</td>
                                  <td>01/01/2015</td>
                                  <td>10/15/2018</td>
                                  <td><span className="badge badge-info-light">Work in Progress</span></td>
                                </tr>
                              </tbody>
                      </table>
                        </div>*/}

                        </div>
                        <div className={`tab-pane ${activeTab === 'actu' ? 'show active' : ''}`} id="actu">
                          <div className="border rounded mt-2 mb-3">
                            <form onSubmit={handleSubmitactu} action="#" className="comment-area-box">
                              <input className="form-control"
                                type="text"
                                placeholder="Titre"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                              />
                              <br />
                              <textarea value={description}
                                onChange={(e) => setDescription(e.target.value)} className="form-control border-0 resize-none" placeholder="Destription...."></textarea>
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
                          {actualites.slice(0, 2).map((actualite, index) => (
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
              </div>
            </div>
          </section>
        </div>

      </div >

    </Fragment >
  );
}