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
import { useRouter } from 'next/navigation';
import { useUserId } from '@/hooks/useUserId';
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

interface Option {
  value: string;
}
export default function Ajoutportefeuille() {
  const router = useRouter();
  const id = useUserId();


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fundsOptions, setFundsOptions] = useState<{ value: string; label: string }[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<{ value: string; label: string }[]>([]);

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
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      if (classeActifs != null) {
        formData.classeActifs = classeActifs;
      }
      formData.userid = id;

      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('tokenEnCours')
          : null;

      const response = await fetch(`${urlconstant}/api/postportefeuille`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 200) {
        setIsModalOpen(true);
        setTimeout(() => {
          router.push(`/panel/portefeuille/home`);
        }, 2000);
        return;
      }

      let serverMessage = '';
      try {
        const data = await response.json();
        serverMessage = data?.error || data?.message || '';
      } catch {
        // ignore parse errors
      }
      setSubmitError(
        serverMessage ||
          `Erreur lors de la création du portefeuille (code ${response.status}).`
      );
    } catch (error: any) {
      console.error('Erreur lors de la soumission du formulaire :', error);
      setSubmitError(
        'Impossible de joindre le serveur. Veuillez réessayer.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('tokenEnCours')
        : null;
    fetch(`${urlconstant}/api/recherchefonds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => {
        const fonds = data?.data || data || [];
        setFundsOptions(
          fonds.map((f: any) => ({
            value: String(f.id),
            label: `${f.nom_fond || f.nom || ''} - ${f.isin || ''}`.trim(),
          }))
        );
      })
      .catch(() => {});
  }, []);

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
                            <span className="produit-type">Création d&apos;un portefeuille</span>
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

                          <div className="col-md-6 mx-auto text-left">
                            <label htmlFor="select">Fonds (Nom/ISIN) :</label>
                            <Select
                              className="select-component"
                              id="select"
                              options={fundsOptions}
                              isMulti
                              isSearchable
                              value={selectedOptions}
                              onChange={(newValue) => {
                                const selected = [...newValue];
                                setSelectedOptions(selected);
                                setFormData({
                                  ...formData,
                                  funds: selected.map((o) => o.label).join(', '),
                                  fundids: selected.map((o) => o.value).join(', '),
                                });
                              }}
                            />
                          </div>
                          <br />
                          {submitError && (
                            <div
                              role="alert"
                              style={{
                                color: '#b91c1c',
                                backgroundColor: '#fee2e2',
                                border: '1px solid #fecaca',
                                padding: '10px',
                                borderRadius: '5px',
                                marginBottom: '10px',
                              }}
                            >
                              {submitError}
                            </div>
                          )}
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            style={{
                              textDecoration: 'none',
                              backgroundColor: isSubmitting ? '#9ca3af' : '#6366f1',
                              color: 'white',
                              padding: '10px 20px',
                              borderRadius: '5px',
                              cursor: isSubmitting ? 'not-allowed' : 'pointer',
                            }}
                          >
                            {isSubmitting ? 'Enregistrement…' : 'Enregistrer'}
                          </button>
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