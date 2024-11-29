"use client";
import { urlconstant } from "@/app/constants";

import Link from "next/link";
import { ChangeEvent, ChangeEventHandler, Fragment, useEffect, useState } from "react";


import Select from 'react-select';
//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
//import { router } from 'next/router';
import Header from "@/app/Header";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Headermenu from "@/app/Headermenu";
import Sidebar from "@/app/sidebar";

const options = [
  { value: 'Journaliere', label: 'Journaliere' },
  { value: 'Hedbomaaire', label: 'Hedbomaaire' },
  { value: 'Mensuelle', label: 'Mensuelle' },
  // Ajoutez plus d'options au besoin
];

interface Pays {
  value: string; // ou un type spécifique pour les éléments du tableau 'funds'

}
interface Regulateur {
  value: string; // ou un type spécifique pour les éléments du tableau 'funds'

}
interface Devise {
  value: string; // ou un type spécifique pour les éléments du tableau 'funds'

}


interface PageProps {
  searchParams: {
    id: any
  };
}
interface FormData {
  page: number;
  nom: string;
  societe: string;
  prenom: string;
  fonction: string;
  activite: string;
  email: string;
  numero: string;
  photo: File | null; // Modification de la propriété fichier pour accepter File ou null

}

// Initialisez le formulaire avec les valeurs initiales
const initialFormData: FormData = {
  page: 1,
  nom: '',
  societe: '',
  prenom: '',
  fonction: '',
  activite: '',
  email: '',
  numero: '',
  photo: null, // Définir le fichier initial comme null

};
interface Option {
  value: string;
  // Autres propriétés si nécessaire
}
async function getlastvl1() {
  const data = (
    await fetch(`${urlconstant}/api/searchFunds`)
  ).json();
  return data;
}
export default function Ajoutvl(props: PageProps) {

  const fonctions = [
    "Commercial",
    "Analyste",
    "Gerant OPCVM",
    "Comptable",
    "Responsable du Controle Interne",
    "Responsable de la Conformité",
    "Responsable Juridique",
    "Middle Office",
    "Back Office",
    "Directeur Commercial",
    "Directeur de la gestion",
    "Directeur General",
    "Secretaire General"
  ];
  const activites = [
    "Vente",
    "Analyse des données",
    "Gestion des fonds",
    "Comptabilité",
    "Contrôle Interne",
    "Conformité",
    "Droit",
    "Gestion opérationnelle",
    "Gestion administrative",
    "Direction commerciale",
    "Direction générale",
    "Administration générale"
  ];

  const router = useRouter();
  const [selectedFund, setSelectedFund] = useState(null);
  const [fundsOptions, setFundsOptions] = useState([]);
  const [deviseOptions, setDeviseOptions] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPays, setSelectedPays] = useState<Pays | null>(null);
  const [selectedRegulateur, setSelectedRegulateur] = useState<Regulateur | null>(null);
  const [selectedDevise, setSelectedDevise] = useState<Devise | null>(null);


  const [optionsPays, setOptionsPays] = useState([]);
  const [regulateurOptions, setRegulateurOptions] = useState([]);
  let response: globalThis.Response;
  const handleSearch = (e: any) => {
    e.preventDefault();
    // Effectuez votre recherche ici si nécessaire
  };
  const societeconneted = props.searchParams.id;


  const handleFundSelect = (selectedOption: any) => {
    setSelectedFund(selectedOption);
  };
  const [formData, setFormData] = useState<FormData>(initialFormData);


  const nextPage = () => {
    setFormData({ ...formData, page: formData.page + 1 });
  };

  const prevPage = () => {
    setFormData({ ...formData, page: formData.page - 1 });
  };
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([])

  useEffect(() => {
    // Appel à l'API lors du premier rendu du composant
    async function fetchData() {
      try {
        const data1 = await getlastvl1();
        const mappedOptions1 = data1?.data?.funds.map((funds: any) => ({

          value: funds.value,
          label: funds.label, // Replace with the actual property name
          // Replace with the actual property name
        }));
        setFundsOptions(mappedOptions1);

      } catch (error) {
        console.error("Erreur lors de l'appel à l'API :", error);
      }
    }
    fetchData();
  }, []);

  const [file, setFile] = useState(null);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    /*  const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }*/
    console.log(formData)
    formData.societe = societeconneted;

    const formDatas = new FormData(); // Créez un nouvel objet FormData

    // Ajoutez les champs de formData à formDatas
    formDatas.append('page', formData.page.toString()); // Ajoutez les champs un par un
    formDatas.append('nom', formData.nom);
    if (formData.photo != null) {
      formDatas.append('photo', formData.photo);

    } formDatas.append('societe', formData.societe);
    formDatas.append('prenom', formData.prenom);
    formDatas.append('fonction', formData.fonction);
    formDatas.append('activite', formData.activite);
    formDatas.append('email', formData.email);
    formDatas.append('numero', formData.numero);
    console.log(formDatas)
    const selectedValues = selectedOptions.map(option => option?.value);

    try {

      const response = await fetch(`${urlconstant}/api/personnelsociete?query=${selectedValues.join(',')}`, {
        method: 'POST',

        body: /*JSON.stringify(formData)*/formDatas
      });
      const data = await response.json();
      console.log(data);
      if (response.status === 200) {
        setIsModalOpen(true);

        Swal.fire({
          position: 'center',
          icon: 'success',
          html: `<p> Données enregistrées.</p>`,
          showConfirmButton: false,
          timer: 5000,
        });
        setTimeout(() => {
          const href = `/panel/societegestionpanel/personnel?id=${societeconneted}`;
          window.location.href = href;  // This will navigate and refresh the page

          //     router.push(href);
        }, 2000);
      }
    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        html: `<p>''Error </p>`,
        showConfirmButton: false,
        timer: 10000,
      });
      console.error('Erreur lors de la soumission du formulaire :', error);
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
  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Utilisation de l'opérateur de chaînage optionnel pour éviter les erreurs si files est null
    if (file) {
      setFormData({ ...formData, photo: file });
    }
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
                      <p><span className="text-primary">Creation du personnel</span> | <span className="text-fade"></span></p>

                    </div>

                  </div>
                  <hr />
                  <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="row">
                      <div className="col-md-6 mx-auto">
                        <label>Photo :</label>
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*"
                          name="photo"
                          onChange={handlePhotoChange}
                          required
                        />
                        {formData.photo && (
                          <img src={URL.createObjectURL(formData.photo)} alt="Photo preview" style={{ marginTop: '10px', maxWidth: '200px' }} />
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mx-auto">
                        <label>Nom :</label>
                        <input
                          type="text"
                          className="form-control"
                          name="nom"
                          value={formData.nom}
                          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-6 mx-auto">
                        <label>Prénom :</label>
                        <input
                          type="text"
                          className="form-control"
                          name="prenom"
                          value={formData.prenom}
                          onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12 mx-auto">
                        <label>Fonction :</label>
                        <select
                          className="form-control"
                          name="fonction"
                          value={formData.fonction}
                          onChange={handleChange}
                        >
                          <option value="">Sélectionner une fonction</option>
                          {fonctions.map((fonction, index) => (
                            <option key={index} value={fonction}>{fonction}</option>
                          ))}
                        </select>
                      </div>

                    </div>
                    <div className="row">
                      <div className="col-md-12 mx-auto">
                        <label>Activité :</label>
                        <select
                          className="form-control"
                          name="activite"
                          value={formData.activite}
                          onChange={handleChange}
                          multiple
                        >
                          <option value="">Sélectionner une activité</option>
                          {activites.map((activite, index) => (
                            <option key={index} value={activite}>{activite}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {formData.fonction === 'Gerant OPCVM' && ( // Conditionally render based on activity

                      <div className="row">
                        <div className="col-12">
                          <label htmlFor="select">Fonds (Nom/ISIN) :</label>
                          <Select className="select-component"
                            id="select"
                            options={fundsOptions}
                            isMulti
                            isSearchable
                            value={selectedOptions}
                            onChange={(newValue, actionMeta) => setSelectedOptions(newValue.map(option => option as Option))}
                          />
                        </div>
                      </div>
                    )}
                    <div className="row">
                      <div className="col-md-6 mx-auto">
                        <label>Email :</label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-6 mx-auto">
                        <label>Numéro :</label>
                        <input
                          type="text"
                          className="form-control"
                          name="numero"
                          value={formData.numero}
                          onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ marginTop: '10px' }}
                    >
                      Enregistrer
                    </button>
                  </form>

                </div>
              </div>
            </div>
            </div >
          </section >
        </div >
      </div >
      </div >
      </div >
    </Fragment >
  );
}