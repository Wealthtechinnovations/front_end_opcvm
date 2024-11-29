"use client";
import { urlconstant } from "@/app/constants";

import Link from "next/link";
import { Fragment, SetStateAction, useEffect, useState } from "react";
import Select from 'react-select';


//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';

//import { router } from 'next/router';
import Header from '@/app/Header';
import Router from 'next/router';
import { magic } from "../../../../../magic";
import { useRouter } from 'next/navigation';
import Headermenu from "@/app/Headermenu";
import Sidebar from "@/app/sidebarportefeuille";

const options = [
  { value: 1, label: 'Option 1' },
  { value: 2, label: 'Option 2' },
  { value: 3, label: 'Option 3' },
  // Ajoutez plus d'options au besoin
];

interface Pays {
  value: any[]; // ou un type spécifique pour les éléments du tableau 'funds'

}

async function getlastvl1() {
  const data = (
    await fetch(`${urlconstant}/api/searchFunds`)
  ).json();
  return data;
}

interface PageProps {
  searchParams: {
    selectedfund: any;
    portefeuille: any;
    selectedValuename: any;
    id: any
  };
}
interface Option {
  value: string;
}
export default function Ajoutportefeuille(props: PageProps) {
  const router = useRouter();
  let id = props.searchParams.id;


  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = (e: any) => {
    e.preventDefault();
    // Effectuez votre recherche ici si nécessaire
  };
  const handleDescriptionChange = (e: { target: { value: any; }; }) => {
    const inputValue = e.target.value;

    if (inputValue.length <= 50) {
      setFormData({ ...formData, Description: inputValue });
    } else {
      // Tronquer le texte à 50 caractères
      setFormData({ ...formData, Description: inputValue.slice(0, 50) });
    }
  };
  const [classeActifs, setClasseActifs] = useState<string[]>([]); // Utilisez le type 'string[]' pour déclarer le tableau

  const handleClasseActifsChange = (event: { target: { options: any; }; }) => {
    const options = event.target.options;
    const selectedClasses = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedClasses.push(options[i].value);
      }
    }
    setClasseActifs(selectedClasses);
  };

  const [formData, setFormData] = useState({
    page: 1,
    nomDuportefeuille: '',
    Description: '',
    funds: '',
    userid: '',
    fundids: '',
    horizon: '',
    devise: '',
    classeActifs: [] as string[],
    portefeuilletype: '',
    universInvestissement: '',

    universInvestissementsous: '',




  });



  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      console.log(formData);
      if (classeActifs != null) {
        formData.classeActifs = classeActifs;

      }
      formData.userid = id;



      // Envoyer les données du formulaire à l'API
      const response = await fetch(`${urlconstant}/api/postportefeuille`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Spécifiez le type de contenu que vous envoyez
        },
        body: JSON.stringify(formData), // Convertissez votre objet formData en JSON
      });
      console.log(response);
      // Gérer la réponse de l'API (par exemple, afficher un message de succès)

      if (response.status === 200) {



        setIsModalOpen(true);

        // Redirect the user to another page after a delay (e.g., 2 seconds)
        setTimeout(() => {
          const href = `/panel/portefeuille/home?id=${id}`;

          router.push(href);
        }, 2000);
      }

    } catch (error) {
      // Gérer les erreurs de l'API (par exemple, afficher une erreur)
      console.error('Erreur lors de la soumission du formulaire :', error);
    }
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  return (


    < Fragment >
    <div className="flex bg-gray-100">
      <Sidebar id={id} />
      <div className="flex-1 ml-64">
        <Headermenu />
      <div className="content-wrapper2">
        <div className="container-full">
          {/* Main content */}
          <section className="content">
            {isModalOpen && (
              <div className="modal">
                {/* Modal content */}
                <div className="modal-content">
                  <p>Form submitted successfully!</p>
                  {/* You can add any content or message you want here */}
                </div>
              </div>
            )}
            <div className="col-12">
              <div className="box ">
                <div className="box-body">
                  <div className="d-md justify-content-between align-items-center">
                    <div className="panel-heading p-b-0">
                      <div className="row row-no-gutters">
                        <div className="col-lg-12  text-center-xs p-t-1">
                          <h3>
                            <span className="produit-type">Creation d un portefeuille</span> -       &nbsp;&nbsp;&nbsp;                     <strong></strong> -                        {' '}
                            <small></small>{' '} &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                          </h3>
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
                      <p><span className="text-primary">Portefeuille</span> | <span className="text-fade"></span></p>

                    </div>

                  </div>
                  <hr />
                  <form onSubmit={handleSubmit}>
                    <div>
                      <div>
                        <div className="text-center">
                          <div className="col-md-6 mx-auto">
                            <label>
                              Nom du portefeuille*:
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="nomDuportefeuille"
                              value={formData.nomDuportefeuille}
                              onChange={(e) => setFormData({ ...formData, nomDuportefeuille: e.target.value })}
                              required
                            />
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="col-md-6 mx-auto">
                            <label>
                              Description:
                            </label>

                            <textarea
                              className="form-control  h-250"
                              name="Description"
                              value={formData.Description}
                              onChange={handleDescriptionChange}

                              // onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                              required
                            />
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="col-md-6 mx-auto">
                            <label>Devise:</label>
                            <select className="form-control" onChange={(e) => setFormData({ ...formData, devise: e.target.value })} >
                              <option value="">Sélectionnez...</option>
                              <option value="EUR">EUR</option>
                              <option value="USD">USD</option>

                            </select>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="col-md-6 mx-auto">
                            <label>Sélectionnez le type de portefeuille:</label>
                            <select className="form-control" required value={formData.portefeuilletype} onChange={(e) => setFormData({ ...formData, portefeuilletype: e.target.value })}
                            >
                              <option value="">Sélectionnez...</option>
                              {/*  <option value="Robot advisor">Robot advisor</option>*/}
                              <option value="Reconstitution">Reconstitution</option>
                            </select>

                            {formData.portefeuilletype === 'Robot advisor' && (
                              <div>
                                <label>Horizon d investissement:</label>
                                <select className="form-control" value={formData.horizon} onChange={(e) => setFormData({ ...formData, horizon: e.target.value })}>
                                  <option value="">Sélectionnez...</option>
                                  <option value="MOINS D UN AN">Moins d un an</option>
                                  <option value="Au moins 2 ans">Au moins 2 ans</option>
                                  <option value="Au moins 3 ans">Au moins 3 ans</option>
                                  <option value="Au moins 5 ans">Au moins 5 ans</option>
                                  <option value="Au moins 8 ans">Au moins 8 ans</option>
                                  <option value="Au moins 10 ans">Au moins 10 ans</option>
                                </select>
                              </div>
                            )}

                            {formData.portefeuilletype === 'Reconstitution' && (
                              <div>
                                <label>Sélectionnez les classes d actifs:</label>
                                <select className="form-control" multiple value={classeActifs} onChange={handleClasseActifsChange}>
                                  <option value="Toutes les classes">Toutes les classes d actifs</option>
                                  <option value="Actions">Actions</option>
                                  <option value="Obligations">Obligations</option>
                                  <option value="Matières premières">Matières premières</option>
                                  <option value="Immobilier">Immobilier</option>
                                  <option value="Alternatifs">Alternatifs</option>
                                  <option value="Produits monétaires">Produits monétaires</option>
                                  <option value="Diversifiés">Diversifiés</option>
                                </select>

                                <label>Sélectionnez l univers d investissement:</label>
                                <select className="form-control" value={formData.universInvestissement} onChange={(e) => setFormData({ ...formData, universInvestissement: e.target.value })}>
                                  <option value="Tous univers">Tous univers</option>
                                  <option value="Regional">Regional</option>
                                  <option value="National">National</option>
                                </select>
                              </div>

                            )}

                          </div>


                          {formData.universInvestissement === 'Regional' && (
                            <div>
                              <label htmlFor="">Zone</label>
                              <div>
                                <select className="form-control" value={formData.universInvestissementsous} onChange={(e) => setFormData({ ...formData, universInvestissementsous: e.target.value })}>
                                  <option value="">Sélectionnez...</option>

                                  <option value="Afrique du Nord">Afrique du nord</option>
                                </select>
                              </div>
                            </div>
                          )}

                          {formData.universInvestissement === 'National' && (

                            <div>

                              <label htmlFor="">Zone</label>
                              <div>
                                <select className="form-control" value={formData.universInvestissementsous} onChange={(e) => setFormData({ ...formData, universInvestissementsous: e.target.value })}>
                                  <option value="">Sélectionnez...</option>

                                  <option value="Maroc">Maroc</option>
                                </select>
                              </div>
                            </div>

                          )}

                          {/*  <div>
                          <label htmlFor="select">Fonds (Nom/ISIN) :</label>
                          <Select className="select-component"
                            id="select"
                            options={fundsOptions}
                            isMulti
                            isSearchable
                            value={selectedOptions}
                            onChange={(newValue, actionMeta) => {
                              setSelectedOptions(newValue.map(option => option as Option));

                              // Mise à jour de la propriété "Description" de formData
                              const selectedDescription1 = newValue.map(option => option.value).join(', '); // Assurez-vous que la structure de l'option correspond à votre modèle
                              const selectedDescription = newValue.map(option => option.label).join(', '); // Assurez-vous que la structure de l'option correspond à votre modèle
                              setFormData({ ...formData, funds: selectedDescription, fundids: selectedDescription1 });

                            }} />
                          </div> */}                       <br />
                          <button style={{
                            textDecoration: 'none', // Remove underline
                            backgroundColor: '#6366f1', // Background color
                            color: 'white', // Text color
                            padding: '10px 20px', // Padding
                            borderRadius: '5px', // Rounded corners
                          }} >Enregistrer</button>
                        </div>
                      </div>
                    </div>




                    {/* Ajoutez les autres pages ici */}

                  </form>

                </div>
              </div>
            </div>
          </section>
        </div >
      </div >
      </div >
      </div >
    </Fragment >
  );
}