"use client";
import { urlconstant } from "@/app/constants";

import Link from "next/link";
import { ChangeEvent, Fragment, useEffect, useState } from "react";


import Select, { SingleValue } from 'react-select';
//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
//import { router } from 'next/router';
import Headermenu from '../../../../Headermenu';
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Sidebar from "@/app/sidebar";

const options = [
  { value: 'Journaliere', label: 'Journaliere' },
  { value: 'Hedbomaaire', label: 'Hedbomaaire' },
  { value: 'Mensuelle', label: 'Mensuelle' },
  // Ajoutez plus d'options au besoin
]; interface FormData {
  date: string;
  mois: string;
  annee: string;
  typedoc: string;
  societe: string;
  objet: string;
  fond_id: number;
  fond: string;
  fichier: File | null; // Modification de la propriété fichier pour accepter File ou null
}

// Initialisez le formulaire avec les valeurs initiales
const initialFormData: FormData = {
  date: '',
  mois: '',
  annee: '',
  typedoc: '',
  societe: '',
  objet: '',
  fond: '',
  fond_id: 0,
  fichier: null, // Définir le fichier initial comme null
};
interface Pays {
  value: string; // ou un type spécifique pour les éléments du tableau 'funds'

}
interface Regulateur {
  value: string; // ou un type spécifique pour les éléments du tableau 'funds'

}
interface Devise {
  value: string; // ou un type spécifique pour les éléments du tableau 'funds'

}

interface Option {
  value: string;
  // Autres propriétés si nécessaire
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
    id: any
  };
}
async function getFonds(id: string) {
  const data = (

    await fetch(`${urlconstant}/api/getfondbysociete/${id}`, {
      method: 'GET', // Assurez-vous que la méthode HTTP correspond à votre API
    })
  ).json();
  return data;
}
export default function Ajoutvl(props: PageProps) {

  const router = useRouter();
  const [selectedFund, setSelectedFund] = useState(null);
  const [fundsOptions, setFundsOptions] = useState([]);
  const [selectedOptions1, setSelectedOptions1] = useState<SingleValue<Option> | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);



  const [optionsPays, setOptionsPays] = useState([]);
  const [regulateurOptions, setRegulateurOptions] = useState([]);
  let response: globalThis.Response;

  const societeconneted = props.searchParams.id;
  useEffect(() => {
    async function fetchData() {
      try {
        const data1 = await getFonds(societeconneted);

        const mappedOptions = data1?.data?.funds.map((funds: any) => ({
          value: funds.test,
          label: funds.test
        }));

        setFundsOptions(mappedOptions); // Mettre à jour l'état avec les données récupérées
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    }
    fetchData(); // Appel à fetchData() lors du premier rendu
  }, []);

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Assurez-vous que target.files est de type FileList ou null
    const file = e.target.files?.[0]; // Utilisation de l'opérateur de chaînage optionnel pour éviter les erreurs si files est null
    if (file) {
      setFormData({ ...formData, fichier: file });
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    formData.societe = societeconneted;
    try {
      const selectedfond = selectedOptions1?.value;
      console.log(selectedfond)
      const formDataToSend = new FormData();
      formDataToSend.append('date', formData.date);
      formDataToSend.append('mois', formData.mois);
      formDataToSend.append('objet', formData.objet);
      formDataToSend.append('annee', formData.annee);
      formDataToSend.append('typedoc', formData.typedoc);
      if (selectedfond != null)
        formDataToSend.append('fond_id', selectedfond);


      formDataToSend.append('societe', formData.societe);
      if (formData.fichier != null)
        formDataToSend.append('fichier', formData.fichier);

      console.log(formData.fichier)
      console.log(selectedfond)

      const response = await fetch(`${urlconstant}/api/doc`, {
        method: 'POST',

        body: formDataToSend
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
          const href = `/panel/societegestionpanel/document?id=${societeconneted}`;
          window.location.href = href;  // This will navigate and refresh the page

          //     router.push(href);
        }, 2000);
        // Redirect the user to another page after a delay (e.g., 2 seconds)

      }
    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        html: `<p> "Error" </p>`,
        showConfirmButton: false,
        timer: 10000,
      });
      console.error('Erreur lors de la soumission du formulaire :', error);
    }
  };



  const [formData, setFormData] = useState<FormData>(initialFormData);


  const renderChampsSpecifiques = () => {
    switch (formData.typedoc) {
      case 'Reporting mensuel':
        return (
          <>
            <br />
            <div className="col-12 row">
              <div className="col-6">
                <select name="mois" value={formData.mois} onChange={handleChange} className="form-control">
                  <option value="">Mois</option>
                  <option value="Janvier">Janvier</option>
                  <option value="Février">Février</option>
                  <option value="Mars">Mars</option>
                  <option value="Avril">Avril</option>
                  <option value="Mai">Mai</option>
                  <option value="Juin">Juin</option>
                  <option value="Juillet">Juillet</option>
                  <option value="Août">Août</option>
                  <option value="Septembre">Septembre</option>
                  <option value="Octobre">Octobre</option>
                  <option value="Novembre">Novembre</option>
                  <option value="Décembre">Décembre</option>
                </select>
              </div>
              <div className="col-6">
                <input type="number" name="annee" value={formData.annee} onChange={handleChange} className="form-control" placeholder="Année" />
              </div>
            </div>
            <br />
          </>
        );
      case 'Rapport annuel':
        return (
          <>
            <br />
            <div className="col-12 ">

              <input type="number" name="annee" value={formData.annee} onChange={handleChange} className="form-control" placeholder="Année" />
            </div>
            <br />

          </>
        );
      case 'DIC':
        return (
          <>
            <br />
            <div className="col-12 row">

              <div className="col-12">
                <input type="number" name="annee" value={formData.annee} onChange={handleChange} className="form-control" placeholder="Année" />
              </div>
            </div>
            <br />

          </>
        );
      case 'Prospectus':
        return (
          <>
            <br />

            <div className="col-12 row">

              <div className="col-12">
                <input type="number" name="annee" value={formData.annee} onChange={handleChange} className="form-control" placeholder="Année" />
              </div>
            </div>
            <br />

          </>
        );
      case 'Reporting annuel':
        return (
          <>
            <br />

            <div className="col-12 row">

              <div className="col-12">
                <input type="number" name="annee" value={formData.annee} onChange={handleChange} className="form-control" placeholder="Année" />
              </div>
            </div>
            <br />

          </>
        );
      case 'Lettre au porteur':
        return (
          <>
            <br />

            <div className="col-12 row">
              <div className="col-6">
                <input type="date" name="date" value={formData.date} onChange={handleChange} className="form-control" placeholder="Mois" />
              </div>
              <div className="col-6">
                <input type="text" name="objet" value={formData.objet} onChange={handleChange} className="form-control" placeholder="Année" />
              </div>
            </div>
            <br />

          </>
        );
      case 'Reporting ISR':
        return (
          <>
            <br />

            <div className="col-12 row">
              <div className="col-6">
                <select name="mois" value={formData.mois} onChange={handleChange} className="form-control">
                  <option value="">Mois</option>
                  <option value="Janvier">Janvier</option>
                  <option value="Février">Février</option>
                  <option value="Mars">Mars</option>
                  <option value="Avril">Avril</option>
                  <option value="Mai">Mai</option>
                  <option value="Juin">Juin</option>
                  <option value="Juillet">Juillet</option>
                  <option value="Août">Août</option>
                  <option value="Septembre">Septembre</option>
                  <option value="Octobre">Octobre</option>
                  <option value="Novembre">Novembre</option>
                  <option value="Décembre">Décembre</option>
                </select>
              </div>
              <div className="col-6">
                <input type="number" name="annee" value={formData.annee} onChange={handleChange} className="form-control" placeholder="Année" />
              </div>
            </div>
            <br />

          </>
        );
      case 'Portefeuille':
        return (
          <>
            <br />

            <div className="col-12 row">
              <div className="col-6">
                <select name="mois" value={formData.mois} onChange={handleChange} className="form-control">
                  <option value="">Mois</option>
                  <option value="Janvier">Janvier</option>
                  <option value="Février">Février</option>
                  <option value="Mars">Mars</option>
                  <option value="Avril">Avril</option>
                  <option value="Mai">Mai</option>
                  <option value="Juin">Juin</option>
                  <option value="Juillet">Juillet</option>
                  <option value="Août">Août</option>
                  <option value="Septembre">Septembre</option>
                  <option value="Octobre">Octobre</option>
                  <option value="Novembre">Novembre</option>
                  <option value="Décembre">Décembre</option>
                </select>
              </div>
              <div className="col-6">
                <input type="number" name="annee" value={formData.annee} onChange={handleChange} className="form-control" placeholder="Année" />
              </div>
            </div>
            <br />

          </>
        );
      case 'Rapport Semestriel':
        return (
          <>
            <br />

            <div className="col-12 row">
              <div className="col-6">
                <select name="mois" value={formData.mois} onChange={handleChange} className="form-control">
                  <option value="">Mois</option>
                  <option value="Janvier">Janvier</option>
                  <option value="Février">Février</option>
                  <option value="Mars">Mars</option>
                  <option value="Avril">Avril</option>
                  <option value="Mai">Mai</option>
                  <option value="Juin">Juin</option>
                  <option value="Juillet">Juillet</option>
                  <option value="Août">Août</option>
                  <option value="Septembre">Septembre</option>
                  <option value="Octobre">Octobre</option>
                  <option value="Novembre">Novembre</option>
                  <option value="Décembre">Décembre</option>
                </select>
              </div>
              <div className="col-6">
                <input type="number" name="annee" value={formData.annee} onChange={handleChange} className="form-control" placeholder="Année" />
              </div>
            </div>
            <br />

          </>
        );
      case 'Reglement du fonds':
        return (
          <>
            <br />

            <div className="col-12 row">

              <div className="col-12">
                <input type="number" name="annee" value={formData.annee} onChange={handleChange} className="form-control" placeholder="Année" />
              </div>
            </div>
            <br />

          </>
        );
      case 'Fiche commerciale':
        return (
          <>
            <br />

            <div className="col-12 row">
              <div className="col-6">
                <select name="mois" value={formData.mois} onChange={handleChange} className="form-control">
                  <option value="">Mois</option>
                  <option value="Janvier">Janvier</option>
                  <option value="Février">Février</option>
                  <option value="Mars">Mars</option>
                  <option value="Avril">Avril</option>
                  <option value="Mai">Mai</option>
                  <option value="Juin">Juin</option>
                  <option value="Juillet">Juillet</option>
                  <option value="Août">Août</option>
                  <option value="Septembre">Septembre</option>
                  <option value="Octobre">Octobre</option>
                  <option value="Novembre">Novembre</option>
                  <option value="Décembre">Décembre</option>
                </select>
              </div>
              <div className="col-6">
                <input type="number" name="annee" value={formData.annee} onChange={handleChange} className="form-control" placeholder="Année" />
              </div>
            </div>
            <br />

          </>
        );
      case 'Due diligence':
        return (
          <>
            <br />

            <div className="col-12 row">
              <div className="col-6">
                <select name="mois" value={formData.mois} onChange={handleChange} className="form-control">
                  <option value="">Mois</option>
                  <option value="Janvier">Janvier</option>
                  <option value="Février">Février</option>
                  <option value="Mars">Mars</option>
                  <option value="Avril">Avril</option>
                  <option value="Mai">Mai</option>
                  <option value="Juin">Juin</option>
                  <option value="Juillet">Juillet</option>
                  <option value="Août">Août</option>
                  <option value="Septembre">Septembre</option>
                  <option value="Octobre">Octobre</option>
                  <option value="Novembre">Novembre</option>
                  <option value="Décembre">Décembre</option>
                </select>
              </div>
              <div className="col-6">
                <input type="number" name="annee" value={formData.annee} onChange={handleChange} className="form-control" placeholder="Année" />
              </div>
            </div>
            <br />

          </>
        );

      default:
        return null;
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
                      <p><span className="text-primary">Charger un document</span> | <span className="text-fade"></span></p>

                    </div>

                  </div>
                  <hr />
                  <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="col-12">
                      <label htmlFor="select">Fonds (Nom/ISIN) :</label>
                      <Select className="select-component"
                        id="select"
                        options={fundsOptions}
                        isSearchable
                        value={selectedOptions1}
                        onChange={(newValue, actionMeta) => setSelectedOptions1(newValue)}
                      />
                    </div>
                    <br />
                    <div className="col-12">
                      <select name="typedoc" value={formData.typedoc} onChange={handleChange} className="form-control">
                        <option value="">Sélectionner le type de document</option>
                        <option value="Reporting mensuel">Reporting mensuel</option>
                        <option value="DIC">DIC</option>
                        <option value="Prospectus">Prospectus</option>
                        <option value="Rapport annuel">Rapport annuel</option>
                        <option value="Lettre au porteur">Lettre au porteur</option>
                        <option value="Reporting ISR">Reporting ISR</option>
                        <option value="Portefeuille">Portefeuille</option>
                        <option value="Rapport Semestriel">Rapport Semestriel</option>
                        <option value="Reglement du fonds">Reglement du fonds</option>
                        <option value="Fiche commerciale">Fiche commerciale</option>
                        <option value="Due diligence">Due diligence</option>

                      </select>
                    </div>
                    <br />
                    <div className="col-12">
                      {renderChampsSpecifiques()}
                    </div>
                    <br />

                    <div className="col-12">
                      <input type="file" name="fichier" onChange={handleFileChange} className="form-control" />
                    </div>
                    <br />
                    <br />
                    <div className="col-12 text-center">
                      <button type="submit" className="btn btn-primary">Ajouter</button>
                    </div>
                  </form>



                </div>
              </div>
            </div>
            </div>
          </section >
        </div >
      </div >
      </div>
      </div>
    </Fragment >
  );
}