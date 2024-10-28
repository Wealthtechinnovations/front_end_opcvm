"use client";
import { urlconstant, urlconstantimage } from "@/app/constants";

import Link from "next/link";
import { Fragment, SetStateAction, useEffect, useState, ChangeEventHandler, useCallback, ChangeEvent } from "react";
import Select, { SingleValue } from 'react-select';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faMapMarkerAlt, faPhoneAlt, faEnvelope, faComments, faClock } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import Headermenu from '@/app/Headermenu';
import { Dropdown } from "react-bootstrap";
import Head from "next/head";
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/navigation";
import { magic } from '../../../../../magic'; // Importer correctement le module
import Swal from "sweetalert2";
import Sidebar from "@/app/sidebar";

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

    await fetch(`${urlconstant}/api/getfondbyuser/${id}`, {
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
  label: string;

}
interface Regulateur {
  value: string; // ou un type spécifique pour les éléments du tableau 'funds'
  label: string;

}
interface Devise {
  value: string; // ou un type spécifique pour les éléments du tableau 'funds'
  label: string;

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

        const data1 = await getsociete(societeconneted);

        setManagementCompany(data1.data.societe);
        setFormData({
          ...formData,
          nom: data1.data.societe.nom,
          site_web: data1.data.societe.site_web,
          description: data1.data.societe.description,
          tel: data1.data.societe.tel,
          dateimmatriculation: data1.data.societe.dateimmatriculation,
          email: data1.data.societe.email,
          numeroagrement: data1.data.societe.numeroagrement,
          devise: data1.data.societe.devise,
          pays: data1.data.societe.pays,
          regulateur: data1.data.societe.regulateur,
        });
        // ... code existant ...
        setSelectedPays({ value: data1.data.societe.pays, label: data1.data.societe.pays }); // Assurez-vous que l'objet a les propriétés 'value' et 'label'
        setSelectedRegulateur({ value: data1.data.societe.regulateur, label: data1.data.societe.regulateur }); // Assurez-vous que l'objet a les propriétés 'value' et 'label'
        setSelectedDevise({ value: data1.data.societe.devise, label: data1.data.societe.devise }); // Assurez-vous que l'objet a les propriétés 'value' et 'label'
        // ... code existant ...

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
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Succès',
          text: 'Vos informations ont été mises à jour avec succès.',
          showConfirmButton: false,
          timer: 2500
        });

        // Redirect the user to another page after a delay (e.g., 2 seconds)
        setTimeout(() => {
          const href = `/panel/societegestionpanel/pagehome?id=${societeconneted}`;

          window.location.reload();
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
          const href = `/panel/societegestionpanel/pagehome?id=${societeconneted}`;
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
  <div className="flex flex-col md:flex-row items-stretch md:space-x-6 space-y-4 md:space-y-0">

    {/* Première carte (Image à gauche) */}
    <div className="card flex-1 shadow-lg border-0 rounded-lg overflow-hidden h-full">
      <div className="card-body bg-gradient-to-b from-white to-blue-200 text-white p-6 flex items-center justify-center h-full relative">
        {/* Image agrandie */}
        <div className="text-center">
          <img
            src="/images/avatar/avatar-13.png"
            className="bg-light rounded-circle img-thumbnail border-4 border-white mb-3 mx-auto w-48 h-48" // Augmente la taille de l'image
            alt="profile-image"
          />
          <h4 className="mt-2 text-black-50">{societeconneted}</h4>
          <p className="text-black-50">Société de gestion</p>
        </div>
      </div>
    </div>

    {/* Deuxième carte (Description à droite) */}
    <div className="card flex-1 shadow-lg border-0 rounded-lg overflow-hidden h-full">
      <div className="card-body bg-white text-dark p-6 flex flex-col justify-center h-full relative">
        <h4 className="mb-4 text-blue-600">Détails de la Société</h4>
        <p className="mb-2">
          <strong>Nom :</strong> <span className="ml-2">{managementCompany.nom}</span>
        </p>
        <p className="mb-2">
          <strong>Description :</strong> <span className="ml-2">{managementCompany.description}</span>
        </p>
        <p className="mb-2">
          <strong>Site Web :</strong> <span className="ml-2">{managementCompany.site_web}</span>
        </p>
        <p className="mb-2">
          <strong>Email :</strong> <span className="ml-2">{managementCompany.email}</span>
        </p>
        <p className="mb-0">
          <strong>Pays :</strong> <span className="ml-2">{managementCompany.pays}</span>
        </p>
      </div>
    </div>
  </div>
</div>




                  <div className="col-xl-12 col-lg-12">
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


                            <li className="nav-item">
                              <a href="#settings" onClick={() => handleTabClick('settings')} className={`nav-link rounded-0 ${activeTab === 'settings' ? 'active' : ''}`}>
                                Profile
                              </a>
                            </li>
                          </ul>
                          <div className="tab-content">
                            <div className={`tab-pane ${activeTab === 'settings' ? 'show active' : ''}`} id="settings">

                              <form onSubmit={handleSubmit}>
                                {formData.page === 1 && (
                                  <div>
                                    <h4 className="mb-4 text-uppercase"><i className="mdi mdi-account-circle me-1"></i> Societe de gestion Infos </h4>
                                    <br />
                                    <h5 className="mb-4 text-uppercase"><i className="mdi mdi-account-circle me-1"></i> (Completer Vos infos pour etre eligible d etre validé)</h5>

                                    <div className="row">
                                      <div className="col-md-6">
                                        <div className="mb-3">
                                          <label htmlFor="firstname" className="form-label">Nom</label>
                                          <input type="text" name="nom" className="form-control" id="firstname" value={formData.nom || managementCompany.nom}
                                            onChange={(e) => setFormData({ ...formData, nom: e.target.value })} />
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <div className="mb-3">
                                          <label htmlFor="firstname" className="form-label">Site web</label>
                                          <input type="text" name="site_web" className="form-control" id="firstname" value={formData.site_web || managementCompany.site_web}
                                            onChange={(e) => setFormData({ ...formData, site_web: e.target.value })} />
                                        </div>
                                      </div>

                                    </div>
                                    <div className="row">
                                      <div className="col-md-12">
                                        <div className="mb-3">
                                          <label htmlFor="lastname" className="form-label">Description</label>
                                          <textarea name="description" className="form-control" id="lastname" value={formData.description || managementCompany.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                                        </div>
                                      </div>

                                    </div>
                                    <div className="row">
                                      <div className="col-md-6">
                                        <div className="mb-3">
                                          <label htmlFor="firstname" className="form-label">Tel</label>
                                          <input type="text" name="tel" className="form-control" id="firstname" value={formData.tel || managementCompany.tel}
                                            onChange={(e) => setFormData({ ...formData, tel: e.target.value })} />
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <div className="mb-3">
                                          <label htmlFor="lastname" className="form-label">Date immatriculation</label>
                                          <input type="date" name="dateimmatriculation" className="form-control" id="lastname" value={formData.dateimmatriculation || managementCompany.dateimmatriculation}
                                            onChange={(e) => setFormData({ ...formData, dateimmatriculation: e.target.value })} />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="row">
                                      <div className="col-md-6">
                                        <div className="mb-3">
                                          <label htmlFor="useremail" className="form-label">Email Address</label>
                                          <input type="email" name="email" className="form-control" id="useremail" value={formData.email || managementCompany.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <div className="mb-3">
                                          <label htmlFor="userpassword" className="form-label">Password</label>
                                          <input type="password" className="form-control" id="userpassword"
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                                        </div>
                                      </div>
                                    </div>


                                    <div className="row">
                                      <div className="col-md-6">
                                        <label>
                                          Pays :
                                        </label>

                                        <Select className="select-component"
                                          options={optionsPays}
                                          value={selectedPays || managementCompany.pays}
                                          onChange={(newValue: SingleValue<string | Pays>, actionMeta) => {
                                            if (typeof newValue === 'string') {
                                              setSelectedPays(null); // Handle case where newValue is a string
                                            } else {
                                              setSelectedPays(newValue); // Handle case where newValue is a Devise object
                                            }
                                          }} placeholder="Sélectionnez un pays"
                                        />
                                      </div>
                                      <div className="col-md-6">
                                        <label>
                                          regulateur:
                                        </label>

                                        <Select className="select-component"
                                          options={regulateurOptions}
                                          value={selectedRegulateur || managementCompany.regulateur}
                                          onChange={(newValue: SingleValue<string | Regulateur>, actionMeta) => {
                                            if (typeof newValue === 'string') {
                                              setSelectedRegulateur(null); // Handle case where newValue is a string
                                            } else {
                                              setSelectedRegulateur(newValue); // Handle case where newValue is a Devise object
                                            }
                                          }} placeholder="Select a fund"
                                        />
                                      </div>
                                      <div className="col-md-6">
                                        <label>
                                          Devise:
                                        </label>

                                        <Select className="select-component"
                                          options={deviseOptions}
                                          value={selectedDevise || managementCompany.devise}
                                          onChange={(newValue: SingleValue<string | Devise>, actionMeta) => {
                                            if (typeof newValue === 'string') {
                                              setSelectedDevise(null); // Handle case where newValue is a string
                                            } else {
                                              setSelectedDevise(newValue); // Handle case where newValue is a Devise object
                                            }
                                          }} placeholder="Select a fund"
                                        />
                                      </div>
                                      <div className="col-md-6">
                                        <div className="mb-3">
                                          <label htmlFor="useremail" className="form-label">Numero agrement</label>
                                          <input type="test" name="numeroagrement" className="form-control" id="useremail" value={formData.numeroagrement || managementCompany.numeroagrement}
                                            onChange={(e) => setFormData({ ...formData, numeroagrement: e.target.value })} />
                                        </div>
                                      </div>

                                    </div>
                                    <br />
                                    <div className="text-end">
                                      {/* <button style={{
                                    textDecoration: 'none', // Remove underline
                                    backgroundColor: '#6366f1', // Background color
                                    color: 'white', // Text color
                                    padding: '10px 20px', // Padding
                                    borderRadius: '5px', // Rounded corners
                                  }} onClick={nextPage}>Suivant</button>*/}
                                      <button className="text-right btn btn-primary w-100 rounded-lg shadow-sm" type="submit">Enregistrer</button>
                                    </div>
                                  </div>
                                )}

                              </form>
                            </div>
                            <div className={`tab-pane ${activeTab === 'aboutme' ? 'show active' : ''}`} id="aboutme">
                              <h5 className="text-uppercase"><i className="mdi mdi-briefcase me-1"></i> Description</h5>

                              <div className="timeline-alt pb-0">
                                <div className="timeline-item">
                                  <i className="mdi mdi-circle bg-info-light text-info timeline-icon"></i>
                                  <div className="timeline-item-info">
                                    <h5 className="fs-14 mt-0 mb-1">Societe de gestion</h5>
                                    <p className="text-muted mt-2 mb-0 pb-3">{managementCompany.description}</p>
                                  </div>
                                </div>

                                {/* Repite el mismo patrón para los otros elementos de la experiencia */}
                              </div>

                              <h5 className="mb-3 mt-4 text-uppercase"><i className="mdi mdi-cards-variant me-1"></i> Les cinqs derniers fonds</h5>
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
                              <div className="col-xl-12">
                                <div className="card shadow-md border-0 rounded-lg overflow-hidden">
                                  <div className="card-body p-4 bg-white">
                                    <div className="border rounded mt-2 mb-4 p-4 shadow-sm bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300">
                                      <form onSubmit={handleSubmitactu} action="#" className="comment-area-box">
                                        <input className="form-control rounded-lg mb-3" type="text" placeholder="Titre de la publication" value={type} onChange={(e) => setType(e.target.value)} />
                                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="form-control border-0 resize-none rounded-lg mb-3" placeholder="Description..."></textarea>
                                        <input type="file" name="fichier" onChange={handleFileChange} className="form-control rounded-lg mb-3" />
                                        <button type="submit" className="btn btn-primary w-100 rounded-lg shadow-sm">Poster</button>
                                      </form>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {actualites.map((actualite, index) => (
                            <div key={index} className="p-6 border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                                <div className="d-flex align-items-center mb-4">
                                    <img className="rounded-circle bg-light" src="/images/avatar/avatar-1.png" alt="Avatar" height="50" width="50" />
                                    <div className="ml-3">
                                        <h5 className="text-lg font-semibold text-gray-800">{actualite.username}</h5>
                                        <p className="text-gray-500 text-sm"><i className="fa fa-clock"></i> {actualite.date}</p>
                                    </div>
                                </div>
                                <p className="text-gray-700 mb-4">{actualite.description}</p>
                                {actualite.image && (
                                    <img className="img-fluid rounded-lg mb-4" src={`${urlconstantimage}/${actualite.image}`} alt="Image" style={{ maxHeight: "300px", maxWidth: "100%" }} />
                                )}
                                <div className="flex justify-between items-center">
                                    <button className="btn btn-outline-primary btn-sm px-4 rounded-full">J aime</button>
                                    <button className="btn btn-outline-secondary btn-sm px-4 rounded-full">Commenter</button>
                                </div>
                            </div>
                        ))}
                    </div>

                                    <div className="text-center">
                                      <a href="#" className="text-primary hover:text-red-500 transition duration-300"><i className="mdi mdi-spin mdi-loading me-1"></i> Charger plus </a>
                                    </div>
                                  </div>
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
        </div >
      </div >
    </Fragment >
  );
}