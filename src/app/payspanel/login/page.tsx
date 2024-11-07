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
import { magic } from '../../../../magic'; // Importer correctement le module

async function login(email: string, password: string) {
  const data = (
    await fetch(`${urlconstant}/api/userlogin?email=${email}&password=${password}`)
  ).json();
  return data;
}
async function emailexist(email: string) {
  const response = await fetch(`${urlstableconstant}/api/user/find-user-by-email?email=${email}`, {
    method: 'GET',
    headers: {
      'x-api-key': API_KEY_STABLECOIN, // Ajouter votre en-tête personnalisé
      'Content-Type': 'application/json', // Vous pouvez également ajouter d'autres en-têtes si nécessaire
    },
  });

  const data = await response.json();
  return data;
}
interface Res {
  message: string;

}

interface Pays {
  value: string; // ou un type spécifique pour les éléments du tableau 'funds'

}

interface Societe {
  value: string; // ou un type spécifique pour les éléments du tableau 'funds'

}

async function getpays() {
  const data = (
    await fetch(`${urlconstant}/api/getPays`)
  ).json();
  return data;
}

async function getsociete(pays: string) {
  const data = (
    await fetch(`${urlconstant}/api/getSocietesbypays/${pays}`)
  ).json();
  return data;
}
export default function Login() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  // Fonction de connexion à magic

  const router = useRouter();
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const nextPage = () => {
    setFormDat({ ...formDat, page: formDat.page + 1 });
  };

  const prevPage = () => {
    setFormDat({ ...formDat, page: formDat.page - 1 });
  };
  const [email, setEmail] = useState("");
  const [societeadd, setSocieteadd] = useState("");
  const [societeaddprev, setSocieteaddprev] = useState("");

  const [response, setResponse] = useState<Res | null>(null);
  const [password, setPassword] = useState("");
  const [confirmpassword, setconfirmPassword] = useState("");

  const [isexist, setisExist] = useState("NON");
  const [error, setError] = useState(""); // État pour stocker le message d'erreur

  const [selectedPays, setSelectedPays] = useState<Pays | null>(null);
  const [selectedSociete, setSelectedSociete] = useState<Societe | null>(null);

  const [selectedRegulateur, setSelectedRegulateur] = useState(null);
  const [optionsPays, setOptionsPays] = useState([]);
  const [optionsSociete, setOptionsSociete] = useState([]);

  const [userType, setUserType] = useState("socGest");


  // Add a state variable to store the selected country and list of companies in that country
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [companiesInCountry, setCompaniesInCountry] = useState<string[] | null>(null);

  const handleCountryChange = (selectedOption: any) => {
    // Update the selected country when the user selects a country
    setSelectedCountry(selectedOption?.value);
  };
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    codeTypeProfil: "",
    platform: "",
    typeBusiness: "",
    codeCountry: "",
    nativeCountry: "",
  });
  const [Datas, setDatas] = useState({

    email: '',
    typeusers: '',
    typeusers_id: '',
    pays: '',
    denomination: '',
    password: '',
  });
  const [formDat, setFormDat] = useState({
    page: 1, societeadd: '', pays: '',
    email: email, password: password, confirmPassword: password, codeTypeProfil: '', platform: '', typeBusiness: '', codeCountry: '', nativeCountry: ''
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

        /*  const data1 = await getsociete(selectedPays?.value);
          const mappedOptions1 = data1?.data.societes.map((funds: any) => ({
  
            value: funds.name,
            label: funds.name, // Replace with the actual property name
            // Replace with the actual property name
          }));
          setOptionsSociete(mappedOptions1);
          console.log(data1);*/
      } catch (error) {
        console.error("Erreur lors de l'appel à l'API :", error);
      }
    }
    fetchData();
  }, []);
  useEffect(() => {
    async function fetchData() {
      try {


        const data1 = await getsociete(selectedPays?.value as unknown as string);
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
  }, [selectedPays]);
  useEffect(() => {
    async function fetchData() {
      try {


        const data1 = await getsociete(selectedPays?.value as unknown as string);
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
  }, [societeaddprev]);
  const renderRegistrationFields = () => {
    if (userType === "part") {
      return (
        <div>
          <label>
            Nom :
          </label>
          <input required className="form-control" type="text" placeholder="Nom" />
          <br />
          <label>
            Prénoms :
          </label>
          <input required className="form-control" type="text" placeholder="Prénoms" />
          <br />

          <div className="col-md-12">
            <label>
              pays :
            </label>

            <Select className="select-component"
              required
              options={optionsPays}
              value={selectedPays}
              onChange={setSelectedPays}
              placeholder="Sélectionnez un pays"
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
            {!passwordsMatch && <div className="text-center" style={{ color: "red" }}> <p>Mots de passe ne correspondent pas.</p> </div>}

          </div>
        </div>
      );
    } else if (userType === "insti") {
      return (
        <div>
          <label>
            Dénomination :
          </label>
          <input required className="form-control" type="text" placeholder="Dénomination" />
          <br />

          <div className="col-md-12">
            <label>
              pays De Gestion Du Fonds:
            </label>

            <Select className="select-component"
              required
              options={optionsPays}
              value={selectedPays}
              onChange={setSelectedPays}
              placeholder="Sélectionnez un pays"
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
            {!passwordsMatch && <div className="text-center" style={{ color: "red" }}> <p>Mots de passe ne correspondent pas.</p> </div>}

          </div>
        </div>
      );
    } else if (userType === "Data requester") {
      return (
        <div>
          <label>
            Dénomination :
          </label>
          <input className="form-control" type="text" placeholder="Dénomination" />
          <br />

          <div className="col-md-12">
            <label>
              Pays:
            </label>

            <Select className="select-component"
              required
              options={optionsPays}
              value={selectedPays}
              onChange={setSelectedPays}
              placeholder="Sélectionnez un pays"
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
            {!passwordsMatch && <div className="text-center" style={{ color: "red" }}> <p>Mots de passe ne correspondent pas.</p> </div>}

          </div>
        </div>

      );
    } else if (userType === "socGest") {
      return (
        <div>
          <div className="col-md-12">
            <label>Pays :</label>
            <Select className="select-component"
              required
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
                <label>selectionner votre societe de gestion:</label>
                <div className="row">
                  <div className="col-12"> <Select className="select-component"
                    required
                    options={optionsSociete}
                    value={selectedSociete}
                    onChange={setSelectedSociete}
                    placeholder="Sélectionnez une Societe"
                  />
                  </div>
                  <div className="col-12">Si elle n existe pas cliquer ici pour l enregistrer  <button style={{
                    textDecoration: 'none', // Remove underline
                    backgroundColor: '#6366f1', // Background color
                    color: 'white', // Text color
                    padding: '10px 20px', // Padding
                    borderRadius: '5px', // Rounded corners
                  }} onClick={nextPage}>Ajouter</button>

                  </div>
                </div>
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
                {!passwordsMatch && <div className="text-center" style={{ color: "red" }}> <p>Mots de passe ne correspondent pas.</p> </div>}

              </div>
            </div>
          )}
        </div>
      );
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (password == "") {
      const data = await emailexist(email);
      setResponse(data);

      if (data.message === "Aucun utilisateur trouvé") {
        //  router.push(`/panel/societegestionpanel/login/register?email=${email}&password=${password}`);

        console.log(data);
        setisExist("NON EXIST");
        setError("Pour completer votre inscription merci de selectionner le type d utilisateur pour lequel vous voulez creer un compte")


      } else {
        setisExist("OUI");
        setError("Vous existez deja en base")

      }
    } else if (isexist == "OUI") {
      const datas = {
        email: email,
        password: password,

      };





      try {
        const response = await fetch(`${urlstableconstant}/api/session/login`, {
          method: 'POST',
          headers: {
            'x-api-key': API_KEY_STABLECOIN, // Utiliser directement la variable sans ${}
            'Content-Type': 'application/json', // Set the content type to JSON
          },
          body: JSON.stringify(datas), // Convert the data to JSON and include it in the request body
        });
        console.log(JSON.stringify(datas));

        const data = await response.json();
        if (data.message === "Mot de passe invalide") {
          setError("Mot de passe incorrect")
          // Redirect the user to another page after a delay (e.g., 2 seconds)

        } else {

          const data1 = await login(email, password);
          setResponse(data1);
          if (data1.code === 200) {
            console.log(data.token)
            localStorage.setItem('tokenEnCours', data.token);
            localStorage.setItem('isLoggedIn', 'true');
            console.log(localStorage.getItem('tokenEnCours'));
            if (data1.data.userExists.typeusers_id == 2) {
              localStorage.setItem('userId', data1.data.userExists.denomination);
            } else {
              localStorage.setItem('userId', data1.data.userExists.id);
            }
            setIsLoggingIn(true)

            try {
              if (magic && magic.auth) {
                const didToken = await magic.auth.loginWithMagicLink({
                  email,
                  redirectURI: new URL('/callback', window.location.origin).href,
                })
                const reloadWithParam = (param: any) => {
                  window.location.href = `${window.location.origin}/callback?param=${param}`;
                };
                setTimeout(() => {
                  // window.location.reload()
                  reloadWithParam(email);

                }, 5)
              }
            } catch (error) {
              setIsLoggingIn(false)
              console.error(error);
            }
            console.log(data1)
            /* let href;
             //  router.push(`/panel/societegestionpanel/login/register?email=${email}&password=${password}`);
             if (data.data.userExists.typeusers_id == 2) {
               href = `/panel/societegestionpanel/pagehome?id=${data.data.userExists.denomination}`;
               localStorage.setItem('isLoggedIn', 'true');
               localStorage.setItem('userId', data.data.userExists.denomination);
             } else {
               href = `/panel/portefeuille/home?id=${data.data.userExists.id}`;
               localStorage.setItem('isLoggedIn', 'true');
               localStorage.setItem('userId', data.data.userExists.id);
             }
             router.push(href);
 */
          }
        }
      } catch (error) {
        // Gérer les erreurs de l'API (par exemple, afficher une erreur)
        console.error('Erreur lors de la soumission du formulaire :', error);
      }
    }
    else if (password != "" && confirmpassword != "" && password == confirmpassword) {
      formData.codeTypeProfil = userType;
      formData.platform = "OPCVM";
      formData.email = email;
      formData.confirmPassword = confirmpassword;
      formData.password = password;

      setPasswordsMatch(true);



      try {
        console.log(userType)
        const response = await fetch(`${urlstableconstant}/api/session/register-opcvm`, {
          method: 'POST',
          headers: {
            'x-api-key': API_KEY_STABLECOIN, // Utiliser directement la variable sans ${}
            'Content-Type': 'application/json', // Set the content type to JSON
          },
          body: JSON.stringify(formData), // Convert the data to JSON and include it in the request body
        });
        console.log(JSON.stringify(formData));

        const data = await response.json();
        if (response.status === 200) {

          const email = formData.email;
          const password = formData.password;
          const denomination = selectedSociete?.value;
          const pays = selectedPays?.value;
          let typeusers = userType;
          const typeusers_id = typeusers === "socGest" ? "2" : typeusers === "part" ? "1" : typeusers === "insti" ? "3" : "4";
          console.log(typeusers_id)

          const formDatas = {
            email,
            password,
            denomination,
            pays,
            typeusers,
            typeusers_id,
          };

          // Convert the object to an array
          const dataArray = Object.entries(formDatas);

          // Convert the array to an object with key-value pairs
          const dataObject = Object.fromEntries(dataArray);

          console.log(dataObject);

          const data = await fetch(`${urlconstant}/api/postuserportefeuille`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json', // Spécifiez le type de contenu que vous envoyez
            },
            body: JSON.stringify(dataObject), // Convertissez votre objet formData en JSON
          });

          // Gérer la réponse de l'API (par exemple, afficher un message de succès)
          if (data.status === 200) {
            const datas = {
              email: email,
              password: password,

            };

            const response5 = await fetch(`${urlstableconstant}/api/session/login`, {
              method: 'POST',
              headers: {
                'x-api-key': API_KEY_STABLECOIN, // Utiliser directement la variable sans ${}
                'Content-Type': 'application/json', // Set the content type to JSON
              },
              body: JSON.stringify(datas), // Convert the data to JSON and include it in the request body
            });
            console.log(JSON.stringify(datas));

            const data5 = await response5.json();
            if (data5.message === "Mot de passe invalide") {

            } else {
              console.log(data5.token)
              localStorage.setItem('tokenEnCours', data5.token);
              localStorage.setItem('isLoggedIn', 'true');
              console.log(localStorage.getItem('tokenEnCours'));
              const data1 = await login(email, password);
              setResponse(data1);
              if (data1.data.userExists.typeusers_id == 2) {
                localStorage.setItem('userId', data1.data.userExists.denomination);
              } else {
                localStorage.setItem('userId', data1.data.userExists.id);
              }
            }
            const responseData = await data.json();
            console.log(responseData)

            const userId = responseData.data.userId;
            setIsLoggingIn(true)
            try {
              if (magic && magic.auth) {
                const didToken = await magic.auth.loginWithMagicLink({
                  email,
                  redirectURI: new URL('/callback', window.location.origin).href,
                })
                const reloadWithParam = (param: any) => {
                  window.location.href = `${window.location.origin}/callback?param=${param}`;
                };
                setTimeout(() => {
                  // window.location.reload()
                  reloadWithParam(email);

                }, 5)
              }
            } catch (error) {
              setIsLoggingIn(false)
              console.error(error);
            }
            /*   let href: string;
               if (userId.typeusers_id == 2) {
                 localStorage.setItem('isLoggedIn', 'true');
                 localStorage.setItem('userId', userId.denomination);
                 href = `/panel/societegestionpanel/pagehome?id=${userId.denomination}`;
               } else {
                 localStorage.setItem('isLoggedIn', 'true');
                 localStorage.setItem('userId', userId.id);
                 href = `/panel/portefeuille/home?id=${userId.id}`;
               }
               // Redirect the user to another page after a delay (e.g., 2 seconds)
               setTimeout(() => {
                 router.push(href); // Replace '/other-page' with your desired page URL
               }, 2000);*/
          }

        }
      } catch (error) {
        // Gérer les erreurs de l'API (par exemple, afficher une erreur)
        console.error('Erreur lors de la soumission du formulaire :', error);
      }
    } else if (password != "" && confirmpassword != "" && password != confirmpassword) {
      setPasswordsMatch(false);
    }

  };
  const handleSubmitsociete = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    formDat.societeadd = societeadd;
    formDat.pays = selectedPays?.value as unknown as string;

    const response = await fetch(`${urlconstant}/api/addSociete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
      },
      body: JSON.stringify(formDat), // Convert the data to JSON and include it in the request body

    });
    console.log(response);
    if (response.status === 200) {

      prevPage();
      setSocieteaddprev("OK");
    }
  };
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  return (



    < Fragment >
      <nav className="main-nav bg-white" role="navigation">


        <input id="main-menu-state" type="checkbox" checked={menuOpen} onChange={toggleMenu} />
        <label className="main-menu-btn" htmlFor="main-menu-state">
          <span className="main-menu-btn-icon"></span> Toggle main menu visibility
        </label>

        <ul id="main-menu" className="sm sm-blue">
          <li><Link className="link-style" href="/accueil"> Accueil</Link>

          </li>

          <li><Link className="link-style"
            href="/Opcvm/recherche"

          >
            Fonds
          </Link></li>
          <li>
            <Link className="link-style"
              href="/comparaison"

            >
              Comparaison
            </Link>

          </li>
          <li>
            <Link className="link-style"
              href="/recherche"

            >
              Selection OPCVM
            </Link>

          </li>
          <li><Link className="link-style"
            href="/portefeuille/login"
          //href="/auth/login"

          >
            Espace client
          </Link>

          </li>
          <li>
            <Link className="link-style" style={{ backgroundColor: "#3b82f6", color: "white" }}
              href="/panel/societegestionpanel/login"

            >
              Espace membre
            </Link>
          </li>
        </ul>
      </nav>
      <br />
      <br /><br /><br /><br /><br />
      <div className="col-12 mt-3">

        <div className="container h-p100">
          <div className="row align-items-center justify-content-md-center h-p100">
            <div className="col-12">
              <div className="row justify-content-center g-0">
                <div className="col-lg-5 col-md-5 col-12">
                  <div className="bg-white rounded10 shadow-lg">
                    <div className="content-top-agile p-20 pb-0">
                      <h2 className="text-primary fw-600">Login </h2>
                    </div>
                    <div className="p-40">
                      {formDat.page === 1 && (

                        <form onSubmit={handleSubmit}>
                          <div className="form-group">
                            <div className="col-12">
                              <label htmlFor="">Email</label>
                              <input
                                required
                                type="email"
                                className="form-control ps-15 bg-transparent"
                                placeholder="Email"
                                defaultValue={email}
                                onChange={(event) => setEmail(event.target.value)}
                              />                          </div>
                          </div>
                          {error && <div className=" text-center error-message" style={{ color: "red" }}>{error}</div>}
                          {isexist == "OUI" && email != "" ? (
                            <div className="form-group">
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
                          ) : isexist == "NON EXIST" ?
                            <div className="form-group">
                              <div className="col-12">

                                <label>
                                  Selectionner:
                                </label>
                                <select className="form-control" value={userType} onChange={(event) => setUserType(event.target.value)}>
                                  <option value="socGest">Societe de gestion</option>
                                  <option value="part">Particulier</option>
                                  <option value="insti">Investisseur institutionnel</option>
                                  <option value="Data requester">Data requester</option>
                                  <option value="Association des societés de gestion">Association des societés de gestion</option>
                                  <option value="Regulateur">Regulateur</option>



                                </select>
                              </div>

                              <br />
                              {renderRegistrationFields()}
                              <br />


                            </div>
                            : <p></p>}
                          <div className="text-center">
                            <button className="text-right" style={{
                              textDecoration: 'none', // Remove underline
                              backgroundColor: '#6366f1', // Background color
                              color: 'white', // Text color
                              padding: '10px 20px', // Padding
                              borderRadius: '5px', // Rounded corners
                            }} type="submit">Login/Inscription</button></div>

                          <br />
                          <div className="row">

                            {/* /.col */}
                            <div className="col-12 text-center">

                            </div>
                            {/* /.col */}
                          </div>
                        </form>
                      )}
                      {formDat.page === 2 && (
                        <form onSubmit={handleSubmitsociete}>
                          <div className="form-group">
                            <div className="col-12">
                              <label htmlFor="">Societe de gestion</label>
                              <input
                                required
                                type="text"
                                className="form-control ps-15 bg-transparent"
                                placeholder="Societe"
                                defaultValue={societeadd}
                                onChange={(event) => setSocieteadd(event.target.value)}
                              />                          </div>
                          </div>
                          <div className="text-center">
                            <button style={{
                              textDecoration: 'none', // Remove underline
                              backgroundColor: 'red', // Background color
                              color: 'white', // Text color
                              padding: '10px 20px', // Padding
                              borderRadius: '5px', // Rounded corners
                            }} onClick={prevPage}>Précédent</button>
                            <button className="text-right" style={{
                              textDecoration: 'none', // Remove underline
                              backgroundColor: '#6366f1', // Background color
                              color: 'white', // Text color
                              padding: '10px 20px', // Padding
                              borderRadius: '5px', // Rounded corners
                            }} type="submit">Enregistrer</button></div>

                          <br />
                          <div className="row">

                            {/* /.col */}
                            <div className="col-12 text-center">

                            </div>
                            {/* /.col */}
                          </div>
                        </form>

                      )}

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
Login.layout = false; // Désactive le layout par défaut pour cette page
