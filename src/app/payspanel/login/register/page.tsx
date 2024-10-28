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
async function register(email: string, password: string, confirmPassword: string, codeTypeProfil: string, platform: string, typeBusiness: string) {
  const response = await fetch(`${urlstableconstant}/api/session/register-opcvm`, {
    method: 'GET',
    headers: {
      'x-api-key': API_KEY_STABLECOIN, // Ajouter votre en-tête personnalisé
      'Content-Type': 'application/json', // Vous pouvez également ajouter d'autres en-têtes si nécessaire
    },
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    formData.codeTypeProfil = userType;
    formData.platform = "OPCVM";

    try {
      console.log(formData);

      const response = await fetch(`${urlstableconstant}/api/session/register-opcvm`, {
        method: 'POST',
        headers: {
          'x-api-key': API_KEY_STABLECOIN, // Utiliser directement la variable sans ${}
          'Content-Type': 'application/json', // Set the content type to JSON
        },
        body: JSON.stringify(formData), // Convert the data to JSON and include it in the request body
      });

      const data = await response.json();
      if (response.status === 200) {

        // Redirect the user to another page after a delay (e.g., 2 seconds)
        setTimeout(() => {
          router.push('/societegestionpanel/pagehome'); // Replace '/other-page' with your desired page URL
        }, 2000);
      }
    } catch (error) {
      // Gérer les erreurs de l'API (par exemple, afficher une erreur)
      console.error('Erreur lors de la soumission du formulaire :', error);
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
                        <div className="row">

                          {/* /.col */}
                          <div className="col-12 text-center">
                            <button className="text-right" style={{
                              textDecoration: 'none', // Remove underline
                              backgroundColor: '#6366f1', // Background color
                              color: 'white', // Text color
                              padding: '10px 20px', // Padding
                              borderRadius: '5px', // Rounded corners
                            }} type="submit">Enregistrer</button>
                          </div>
                          {/* /.col */}
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
