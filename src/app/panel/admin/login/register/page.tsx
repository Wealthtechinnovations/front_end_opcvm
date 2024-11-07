"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import Select from 'react-select';
//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import Head from 'next/head';
import { urlconstant } from "@/app/constants";
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

interface PageProps {
  searchParams: {
    email: string;

  };
}
async function getsociete() {
  const data = (
    await fetch(`${urlconstant}/api/getSocietes`)
  ).json();
  return data;
}
export default function Register(props: PageProps) {
  let emails = props?.searchParams?.email;
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const [selectedPays, setSelectedPays] = useState<Pays | null>(null);
  const [selectedSociete, setSelectedSociete] = useState<Societe | null>(null);
  const [password, setPassword] = useState("");
  const [confirmpassword, setconfirmPassword] = useState("");
  const [selectedRegulateur, setSelectedRegulateur] = useState(null);
  const [optionsPays, setOptionsPays] = useState([]);
  const [optionsSociete, setOptionsSociete] = useState([]);

  const [userType, setUserType] = useState("Particulier");
  const renderRegistrationFields = () => {
    if (userType === "Particulier") {
      return (
        <div>
          <input name="nom" className="form-control" type="text" placeholder="Nom" />
          <br />

          <input name="prenoms" className="form-control" type="text" placeholder="Prénoms" />
          <br />

          <div className="col-md-12">
            <label>
              Pays de residence:
            </label>

            <Select className="select-component"
              name="pays"
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
          <input name="denomination" className="form-control" type="text" placeholder="Dénomination" />
          <br />

          <div className="col-md-12">
            <label>
              Pays de residence:
            </label>

            <Select className="select-component"
              name="pays"
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
          <input name="denomination"
            className="form-control" type="text" placeholder="Dénomination" />
          <br />

          <div className="col-md-12">
            <label>
              Pays de residence:
            </label>

            <Select className="select-component"
              name="pays"

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
          <input className="form-control" type="text" placeholder="Description" />
          <br />

          <div className="col-md-12">
            <label>
              Societe De Gestion :
            </label>

            <Select className="select-component"
              name="societe"
              options={optionsPays}
              value={selectedPays}
              onChange={setSelectedPays}
              placeholder="Sélectionnez un pays"
            />
          </div>        </div>
      );
    }
  };
  const router = useRouter();


  const [formData, setFormData] = useState({
    page: 1,
    nom: '',
    prenoms: '',
    email: '',
    typeusers: '',
    typeusers_id: '',
    pays: '',
    denomination: '',
    password: '',
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

          value: funds.value,
          label: funds.label, // Replace with the actual property name
          // Replace with the actual property name
        }));
        setOptionsSociete(mappedOptions1);
      } catch (error) {
        console.error("Erreur lors de l'appel à l'API :", error);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const nom = e.target.nom.value;
      const prenoms = e.target.prenoms.value;
      const email = emails;
      const password = e.target.password.value;
      const denomination = "e.target.denomination.value";
      const pays = e.target.pays.value;
      const typeusers = userType;
      const typeusers_id = "1";

      // Update formData object
      setFormData({
        ...formData,
        nom,
        prenoms,
        email,
        password,
        denomination,
        pays,
        typeusers,
        typeusers_id,
      });
      console.log("formData");

      if (password != "" && confirmpassword != "" && password == confirmpassword) {


        // Envoyer les données du formulaire à l'API
        // Envoyer les données du formulaire à l'API
        const data = await fetch(`${urlconstant}/api/postuserportefeuille`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Spécifiez le type de contenu que vous envoyez
          },
          body: JSON.stringify(formData), // Convertissez votre objet formData en JSON
        });
        console.log(data)

        // Gérer la réponse de l'API (par exemple, afficher un message de succès)
        if (data.status === 200) {
          const responseData = await data.json();
          console.log(responseData)

          const userId = responseData.data.userId;

          const href = `/panel/portefeuille/home?id=${userId?.id}`;
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userId', userId?.id);

          // Redirect the user to another page after a delay (e.g., 2 seconds)
          setTimeout(() => {
            router.push(href); // Replace '/other-page' with your desired page URL
          }, 2000);
        }
      } else {

        setPasswordsMatch(false);

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
                      <h2 className="text-primary fw-600">Login </h2>
                      <p className="mb-0 text-fade">Sign in </p>
                    </div>
                    <div className="p-40">
                      <form onSubmit={handleSubmit}>
                        <select className="form-control" value={userType} onChange={(event) => setUserType(event.target.value)}>
                          <option value="Particulier">Particulier</option>
                          <option value="Investisseur institutionnel">Investisseur institutionnel</option>
                          <option value="Societe de gestion">Societe de gestion</option>
                        </select>
                        <br />
                        {renderRegistrationFields()}
                        <br />
                        <div>
                          <div className="col-12">
                            <label htmlFor="">Mot de passe</label>
                            <input
                              required
                              name="password"
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
                          {!passwordsMatch && <div className="text-center" style={{ color: "red" }}> <p>Mots de passe ne correspondent pas.</p> </div>}
                        </div>
                        <div className="row">

                          {/* /.col */}
                          <div className="col-12 text-center">
                            <button
                              type="submit"
                              style={{
                                textDecoration: 'none',
                                backgroundColor: '#6366f1',
                                color: 'white',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                              }}
                            >
                              Enregistrer
                            </button>
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
      </div>
    </Fragment >
  );
}
Register.layout = false; // Désactive le layout par défaut pour cette page
