"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import Select from 'react-select';
//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import Head from 'next/head';
import { urlconstant, urlstableconstant, API_KEY_STABLECOIN } from "@/app/constants";

import { useRouter } from 'next/navigation';

interface Pays {
  value: any[]; // ou un type spécifique pour les éléments du tableau 'funds'

}

interface Societe {
  value: any[]; // ou un type spécifique pour les éléments du tableau 'funds'

}

async function getpays() {
  const data = (
    await fetch(`${urlconstant}/api/getPays`)
  ).json();
  return data;
}

async function getsociete() {
  const data = (
    await fetch(`${urlconstant}/api/getSocietes`)
  ).json();
  return data;
}
interface PageProps {
  searchParams: {
    email: any;
    password: any;

  };
}
async function register(formData: any) {
  const response = await fetch(`${urlstableconstant}/api/session/register-opcvm`, {
    method: 'POST',
    headers: {
      'x-api-key': API_KEY_STABLECOIN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();
  return data;
}
export default function Register(props: PageProps) {
  const router = useRouter();

  console.log(props);
  let email = props.searchParams.email;
  //let password = props.searchParams.password;
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const [password, setPassword] = useState("");
  const [confirmpassword, setconfirmPassword] = useState("");

  const [selectedPays, setSelectedPays] = useState<Pays | null>(null);
  const [selectedSociete, setSelectedSociete] = useState<Societe | null>(null);

  const [selectedRegulateur, setSelectedRegulateur] = useState(null);
  const [optionsPays, setOptionsPays] = useState([]);
  const [optionsSociete, setOptionsSociete] = useState([]);

  const [userType, setUserType] = useState("Societe de gestion");


  // Add a state variable to store the selected country and list of companies in that country
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [companiesInCountry, setCompaniesInCountry] = useState<string[] | null>(null);

  const handleCountryChange = (selectedOption: any) => {
    // Update the selected country when the user selects a country
    setSelectedCountry(selectedOption?.value);
  };

  /* // Add a function to fetch companies in a specific country
   const fetchCompaniesInCountry = async (country: string) => {
     // Fetch companies based on the selected country
     try {
       const response = await fetch(`${urlconstant}/api/getCompaniesInCountry?country=${country}`);
       const data = await response.json();
       setCompaniesInCountry(data);
     } catch (error) {
       console.error('Error fetching companies in the selected country:', error);
     }
   };*/
  const renderRegistrationFields = () => {
    if (userType === "Particulier") {
      return (
        <div>
          <input className="form-control" type="text" placeholder="Nom" />
          <br />

          <input className="form-control" type="text" placeholder="Prénoms" />
          <br />

          <div className="col-md-12">
            <label>
              pays De Gestion Du Fonds:
            </label>

            <Select className="select-component"
              options={optionsPays}
              value={selectedPays}
              onChange={setSelectedPays}
              placeholder="Sélectionnez un pays"
            />
          </div>
        </div>
      );
    } else if (userType === "Investisseur institutionnel") {
      return (
        <div>
          <input className="form-control" type="text" placeholder="Dénomination" />
          <br />

          <div className="col-md-12">
            <label>
              pays De Gestion Du Fonds:
            </label>

            <Select className="select-component"
              options={optionsPays}
              value={selectedPays}
              onChange={setSelectedPays}
              placeholder="Sélectionnez un pays"
            />
          </div>        </div>
      );
    } else if (userType === "Data requester") {
      return (
        <div>
          <input className="form-control" type="text" placeholder="Dénomination" />
          <br />

          <div className="col-md-12">
            <label>
              Pays:
            </label>

            <Select className="select-component"
              options={optionsPays}
              value={selectedPays}
              onChange={setSelectedPays}
              placeholder="Sélectionnez un pays"
            />
          </div>        </div>
      );
    } else if (userType === "Societe de gestion") {
      return (
        <div>
          <div className="col-md-12">
            <label>Pays :</label>
            <Select className="select-component"
              options={optionsPays}
              value={selectedPays}
              onChange={setSelectedPays}
              placeholder="Sélectionnez un pays"
            //onChange={handleCountryChange}
            />
          </div>
          {selectedPays && (
            <div>
              <div className="col-md-12">
                <label>Societe De Gestion:</label>
                <Select className="select-component"
                  options={optionsSociete}
                  value={selectedSociete}
                  onChange={setSelectedSociete}
                  placeholder="Sélectionnez une Societe"
                />
              </div>
              <div>
                <div className="col-12">
                  <label htmlFor="">Mot de passe</label>
                  <input
                    required
                    type="password"
                    className="form-control ps-15 bg-transparent"
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>
              </div>
              <br />
              <div className="form-group">
                <div className="col-12">
                  <label htmlFor="">Confirmer le Mot de passe</label>

                  <input
                    required
                    type="password"
                    className="form-control ps-15 bg-transparent"
                    placeholder="Password"
                    value={confirmpassword}
                    onChange={(event) => setconfirmPassword(event.target.value)}
                  />
                </div>
                {!passwordsMatch && <div className="text-center" style={{ color: "red" }}> <p>Passwords do not match.</p> </div>}

              </div>
            </div>
          )}
        </div>
      );
    }
  };
  /*
    useEffect(() => {
      if (selectedCountry) {
        // fetchCompaniesInCountry(selectedCountry);
      }
    }, [selectedCountry]);*/
  const [formData, setFormData] = useState({
    email: email, password: password, confirmPassword: password, codeTypeProfil: '', platform: '', typeBusiness: ''
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getpays();
        const mappedOptions = data?.data.paysOptions.map((funds: any) => ({

          value: funds.value,
          label: funds.label, // Replace with the actual property name
          // Replace with the actual property name
        }));
        setOptionsPays(mappedOptions);

        const data1 = await getsociete();
        const mappedOptions1 = data1?.data.societes.map((funds: any) => ({

          value: funds.name,
          label: funds.name, // Replace with the actual property name
          // Replace with the actual property name
        }));
        setOptionsSociete(mappedOptions1);
        console.log(data1);
      } catch (error) {
        console.error("Erreur lors de l'appel à l'API :", error);
      }
    }
    fetchData();
  }, []);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError(null);

    // Validation côté client
    if (password !== confirmpassword) {
      setPasswordsMatch(false);
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    setIsSubmitting(true);
    formData.codeTypeProfil = userType;
    formData.platform = "OPCVM";
    formData.password = password;
    formData.confirmPassword = confirmpassword;

    try {
      // 1. Inscription sur l'API stablecoin
      const response = await fetch(`${urlstableconstant}/api/session/register-opcvm`, {
        method: 'POST',
        headers: {
          'x-api-key': API_KEY_STABLECOIN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Erreur lors de l'inscription");
        setIsSubmitting(false);
        return;
      }

      // 2. Créer aussi le compte sur le backend principal
      const typeusersMap: Record<string, { typeusers: string; typeusers_id: number }> = {
        'socGest': { typeusers: 'Societe de gestion', typeusers_id: 2 },
        'part': { typeusers: 'Particulier', typeusers_id: 0 },
        'insti': { typeusers: 'Investisseur institutionnel', typeusers_id: 1 },
        'Data requester': { typeusers: 'Data requester', typeusers_id: 3 },
      };

      const typeInfo = typeusersMap[userType] || { typeusers: userType, typeusers_id: 0 };

      const mainApiResponse = await fetch(`${urlconstant}/api/postuserportefeuille`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: password,
          denomination: (selectedSociete as any)?.value || '',
          pays: (selectedPays as any)?.value || '',
          typeusers: typeInfo.typeusers,
          typeusers_id: typeInfo.typeusers_id,
        }),
      });

      const mainData = await mainApiResponse.json();

      if (mainApiResponse.ok) {
        // Stocker le token si retourné
        if (mainData.data?.token) {
          localStorage.setItem('authToken', mainData.data.token);
        }
        router.push('/payspanel/login');
      } else {
        setError(mainData.message || "Compte créé partiellement. Veuillez vous connecter.");
        setTimeout(() => router.push('/payspanel/login'), 3000);
      }
    } catch (err) {
      setError("Erreur de connexion au serveur. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (



    < Fragment >
      <br />
      <br /><br /><br />
      <div className="col-12 mt-3">

        <div className="container h-p100">
          <div className="row align-items-center justify-content-md-center h-p100">
            <div className="col-12">
              <div className="row justify-content-center g-0">
                <div className="col-lg-5 col-md-5 col-12">
                  <div className="bg-white rounded10 shadow-lg">
                    <div className="content-top-agile p-20 pb-0">
                      <h2 className="text-primary fw-600">Inscription </h2>
                      <p className="mb-0 text-fade">Sign up </p>
                    </div>
                    <div className="p-40">
                      <form onSubmit={handleSubmit}>
                        <label>
                          Selectionner:
                        </label>
                        <select className="form-control" value={userType} onChange={(event) => setUserType(event.target.value)}>
                          <option value="socGest">Societe de gestion</option>
                          <option value="part">Particulier</option>
                          <option value="insti">Investisseur institutionnel</option>
                          <option value="Data requester">Data requester</option>


                        </select>
                        <br />
                        {renderRegistrationFields()}
                        <br />
                        {error && (
                          <div className="alert alert-danger text-center" role="alert">
                            {error}
                          </div>
                        )}
                        <div className="row">
                          <div className="col-12 text-center">
                            <button
                              className="text-right"
                              style={{
                                textDecoration: 'none',
                                backgroundColor: isSubmitting ? '#9ca3af' : '#6366f1',
                                color: 'white',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                              }}
                              type="submit"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? 'Inscription en cours...' : 'Enregistrer'}
                            </button>
                          </div>
                        </div>
                      </form>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    </Fragment >
  );
}
Register.layout = false; // Désactive le layout par défaut pour cette page
