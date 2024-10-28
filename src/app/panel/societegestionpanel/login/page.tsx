"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import Select from 'react-select';
//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import Head from 'next/head';
import { urlconstant, urlstableconstant, API_KEY_STABLECOIN, urlsite } from "@/app/constants";

import { useRouter } from 'next/navigation';
import { magic } from '../../../../../magic'; // Importer correctement le module
import { Dropdown } from "react-bootstrap";
import Swal from "sweetalert2";

async function login(email: string, password: any) {
  console.log(password);
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
interface PageProps {
  searchParams: {
      id: string;
  };
}
export default function Logins(props: PageProps) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  // Fonction de connexion à magic
  let id  = props.searchParams.id; // Récupère l'ID depuis l'URL

  useEffect(() => {
    if (id === 'Unauthorized') {
      // Si l'ID est "Unauthorized", afficher le popup
      Swal.fire({
        icon: 'error',
        title: 'Unauthorized',
        text: "Vous n'etes pas autorisé!",
        confirmButtonText: 'OK'
      });
    }
  }, [id]);

  const router = useRouter();
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const validatePassword = (password: string) => {
    // Vérifie si le mot de passe est alphanumérique et contient au moins un symbole
    const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).*$/;
    return regex.test(password);
  };
  const handlePasswordChange = (event: { target: { value: any; }; }) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    setPasswordValid(validatePassword(newPassword));
    setPasswordsMatch(newPassword === confirmpassword);
  };

  const handleConfirmPasswordChange = (event: { target: { value: any; }; }) => {
    const newConfirmPassword = event.target.value;
    setconfirmPassword(newConfirmPassword);
    setPasswordsMatch(password === newConfirmPassword);
  };

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
                onChange={handlePasswordChange}
              />
            </div>
          </div>
          {!passwordValid && (
            <div className="text-center" style={{ color: "red" }}>
              <p>Le mot de passe doit être alphanumérique, et comporter des chiffres, des lettres et symboles</p>
            </div>
          )}
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
                onChange={handleConfirmPasswordChange}
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
                onChange={handlePasswordChange}
              />
            </div>
          </div>
          {!passwordValid && (
            <div className="text-center" style={{ color: "red" }}>
              <p>Le mot de passe doit être alphanumérique, et comporter des chiffres, des lettres et symboles</p>
            </div>
          )}
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
                onChange={handleConfirmPasswordChange}
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
                onChange={handlePasswordChange}
              />
            </div>
          </div>
          {!passwordValid && (
            <div className="text-center" style={{ color: "red" }}>
              <p>Le mot de passe doit être alphanumérique, et comporter des chiffres, des lettres et symboles</p>
            </div>
          )}
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
                onChange={handleConfirmPasswordChange}
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
                    onChange={handlePasswordChange}
                  />
                </div>
              </div>
              {!passwordValid && (
                <div className="text-center" style={{ color: "red" }}>
                  <p>Le mot de passe doit être alphanumérique, et comporter des chiffres, des lettres et symboles</p>
                </div>
              )}
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
                    onChange={handleConfirmPasswordChange}
                  />
                </div>
                {!passwordsMatch && <div className="text-center" style={{ color: "red" }}> <p>Mots de passe ne correspondent pas.</p> </div>}

              </div>
            </div>
          )}
        </div>
      );
    } else if (userType === "Pays" || userType === "Regulateur") {
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
              <div>
                <div className="col-12">
                  <label htmlFor="">Mot de passe</label>
                  <input
                    required
                    type="password"
                    className="form-control ps-15 bg-transparent"
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                </div>
              </div>
              {!passwordValid && (
                <div className="text-center" style={{ color: "red" }}>
                  <p>Le mot de passe doit être alphanumérique, et comporter des chiffres, des lettres et symboles</p>
                </div>
              )}
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
                    onChange={handleConfirmPasswordChange}
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
        console.log(data);
        if (data.message === "Mot de passe invalide") {
          setError("Mot de passe incorrect")
          // Redirect the user to another page after a delay (e.g., 2 seconds)

        } else {
          console.log('password');

          console.log(password);

          const data1 = await login(email, password.toString());
          setResponse(data1);


          if (data1.code === 200) {
            console.log(data.token)
            localStorage.setItem('tokenEnCours', data.token);
            localStorage.setItem('isLoggedIn', 'true');
            console.log(localStorage.getItem('tokenEnCours'));
            if (data1.data.userExists.typeusers_id == 2) {
              localStorage.setItem('userId', data1.data.userExists.denomination);
            } else if (data1.data.userExists.typeusers_id == 1) {
              localStorage.setItem('userId', data1.data.userExists.id);
            } else if (data1.data.userExists.typeusers_id == 5) {
              localStorage.setItem('userId', data1.data.userExists.pays);
            }
            setIsLoggingIn(true)

            try {
              if (magic && magic.auth) {
                console.log('password');
                /*  const didToken = await magic.auth.loginWithMagicLink({
                    email,
                    redirectURI: new URL('/callback', window.location.origin).href,
                  })
                  setTimeout(() => {
                    window.location.reload()
                  }, 1000)
                }*/
                const reloadWithParam = (param: string) => {
                  window.location.href = `${window.location.origin}/callback?param=${param}`;
                };
                const didToken = await magic.auth.loginWithMagicLink({
                  email,
                  redirectURI: new URL('/callback', window.location.origin).href,
                });

                setTimeout(() => {
                  reloadWithParam(email);
                }, 5);
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
          const typeusers_id = typeusers === "socGest" ? "2" : typeusers === "part" ? "1" : typeusers === "insti" ? "3" : typeusers === "Data requester" ? "4" : "5";
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
              } else if (data1.data.userExists.typeusers_id == 1) {
                localStorage.setItem('userId', data1.data.userExists.id);
              } else if (data1.data.userExists.typeusers_id == 5) {
                localStorage.setItem('userId', data1.data.userExists.pays);
              }
            }
            const responseData = await data.json();
            console.log(responseData)

            const userId = responseData.data.userId;
            setIsLoggingIn(true)
            try {
              if (magic && magic.auth) {
                const reloadWithParam = (param: string) => {
                  window.location.href = `${window.location.origin}/callback?param=${param}`;
                };
                const didToken = await magic.auth.loginWithMagicLink({
                  email,
                  redirectURI: new URL('/callback', window.location.origin).href,
                });

                setTimeout(() => {
                  reloadWithParam(email);
                }, 5);
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

  const [userConnected, setUserConnected] = useState(null);
  const handleLinkClick = () => {

    if (userConnected !== null) {
        setTimeout(() => {
            const redirectUrl = `/panel/portefeuille/home?id=${userConnected}`;

            router.push(redirectUrl);
        }, 5);

    } else {
        setTimeout(() => {
            // const redirectUrl = `/panel/portefeuille/home?id=${userConnected}`;

            router.push('/panel/societegestionpanel/login');
        }, 5);
    }
};

const handleLinksociete = () => {


    setTimeout(() => {
        const redirectUrl = `/Fundmanager/recherche`;

        router.push(redirectUrl);
    }, 1);


};
const handleLinkquestionnaire = () => {


    setTimeout(() => {
        const redirectUrl = `/Opcvm/questionnaire`;

        router.push(redirectUrl);
    }, 1);


};

const [isHovered, setIsHovered] = useState(false);

const handleMouseEnter = () => {
    setIsHovered(true);
};

const handleMouseLeave = () => {
    setIsHovered(false);
};

const [isHoveredq, setIsHoveredq] = useState(false);

const handleMouseEnterq = () => {
    setIsHoveredq(true);
};

const handleMouseLeaveq = () => {
    setIsHoveredq(false);
};

const [isHovereda, setIsHovereda] = useState(false);

const handleMouseEntera = () => {
    setIsHovereda(true);
};

const handleMouseLeavea = () => {
    setIsHovereda(false);
};
const handleLinkactualite = () => {


    setTimeout(() => {
        const redirectUrl = `/actualite`;

        router.push(redirectUrl);
    }, 1);


};
const handleLinkaccueil = () => {


    setTimeout(() => {
        const redirectUrl = `/accueil`;

        router.push(redirectUrl);
    }, 1);


};

const [isHoveredp, setIsHoveredp] = useState(false);

const handleMouseEnterp = () => {
    setIsHoveredp(true);
};

const handleMouseLeavep = () => {
    setIsHoveredp(false);
};
const handleLinkpays = () => {


    setTimeout(() => {
        const redirectUrl = `/pays`;

        router.push(redirectUrl);
    }, 1);


};

const [isHoveredc, setIsHoveredc] = useState(false);

const handleMouseEnterc = () => {
    setIsHoveredc(true);
};

const handleMouseLeavec = () => {
    setIsHoveredc(false);
};

const handleMouseEnters = () => {
    setIsHovered(true);
};

const handleMouseLeaves = () => {
    setIsHovered(false);
};




const handleMouseEntersa = () => {
    setIsHovereda(true);
};

const handleMouseLeavesa = () => {
    setIsHovereda(false);
};
const [isHoveredaa, setIsHoveredaa] = useState(false);

const handleMouseEnteraa = () => {
    setIsHoveredaa(true);
};

const handleMouseLeaveaa = () => {
    setIsHoveredaa(false);
};


  return (



    < Fragment >
      <nav className="main-nav bg-white" role="navigation">


        <input id="main-menu-state" type="checkbox" checked={menuOpen} onChange={toggleMenu} />
        <label className="main-menu-btn" htmlFor="main-menu-state">
          <span className="main-menu-btn-icon"></span> Toggle main menu visibility
        </label>

        <ul id="main-menu" className={`sm sm-blue ${menuOpen ? 'open' : ''}`}>
                    <li style={{ height: '40px' }}>
                        <button
                            onClick={handleLinkaccueil}
                            style={{
                                width: '150px',
                                backgroundColor: isHovereda ? 'blue' : 'white',
                                color: isHovereda ? 'white' : 'black',
                                display: 'block',
                                height: '100%',
                                padding: '10px',
                                textDecoration: 'none',
                                border: '1px solid #000',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s'
                            }}
                            onMouseEnter={handleMouseEntersa}
                            onMouseLeave={handleMouseLeavesa}
                        >
                            Accueil
                        </button>
                    </li>
                    <li style={{ height: '40px' }}>
                        <button
                            onClick={() => router.push(`${urlsite}/Opcvm/recherche`)}
                            style={{
                                width: '150px',
                                backgroundColor: isHoveredc ? 'blue' : 'white',
                                color: isHoveredc ? 'white' : 'black',
                                display: 'block',
                                height: '100%',
                                padding: '10px',
                                textDecoration: 'none',
                                border: '1px solid #000',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s'
                            }}
                            onMouseEnter={handleMouseEnterc}
                            onMouseLeave={handleMouseLeavec}
                        >
                            Fonds
                        </button>
                    </li>
                    <li style={{ height: '40px' }}>
                        <button
                            onClick={handleLinksociete}
                            style={{
                                width: '150px',
                                backgroundColor: isHovered ? 'blue' : 'white',
                                color: isHovered ? 'white' : 'black',
                                display: 'block',
                                height: '100%',
                                padding: '10px',
                                textDecoration: 'none',
                                border: '1px solid #000',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s'
                            }}
                            onMouseEnter={handleMouseEnters}
                            onMouseLeave={handleMouseLeaves}
                        >
                            Societe de gestion
                        </button>
                    </li>
                    <li style={{ height: '40px', }}>
                        <button
                            onClick={handleLinkpays}
                            style={{
                                width: '150px',
                                backgroundColor: isHoveredp ? 'blue' : 'white',
                                color: isHoveredp ? 'white' : 'black',
                                display: 'block',
                                height: '100%',
                                padding: '10px',
                                textDecoration: 'none',
                                border: '1px solid #000',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s'
                            }}
                            onMouseEnter={handleMouseEnterp}
                            onMouseLeave={handleMouseLeavep}
                        >
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;     Pays &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </button>
                    </li>
                    <li style={{ height: '40px' }}>
                        <Dropdown>
                            <Dropdown.Toggle id="dropdown-basic" style={{ width: '150px', backgroundColor: 'white', color: 'black', display: 'block', height: '100%', padding: '10px', textDecoration: 'none' }}>
                                Services
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item href="/questionnaire/questionnaire/pre/question1">Questionnaire cours</Dropdown.Item>
                                <Dropdown.Item href="/questionnaire/questionnaire/question1">Profil investisseur (MIFID)</Dropdown.Item>
                                <Dropdown.Item href="#">KYC</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </li>
                    <li style={{ height: '40px' }}>
                        <Dropdown>
                            <Dropdown.Toggle id="dropdown-basic" style={{ width: '150px', backgroundColor: 'white', color: 'black', display: 'block', height: '100%', padding: '10px', textDecoration: 'none' }}>
                                Outils
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item href="/Outils/comparaison">Comparaison</Dropdown.Item>
                                <Dropdown.Item href="/Outils/recherche">Selection OPCVM</Dropdown.Item>
                                <Dropdown.Item href="/Outils/robot">Robot Advisor</Dropdown.Item>
                                <Dropdown.Item href="/Outils/profil">Profil investisseurs</Dropdown.Item>
                                <Dropdown.Item href="/Outils/education">Éducation financière</Dropdown.Item>

                            </Dropdown.Menu>
                        </Dropdown>
                    </li>



                    <li style={{ height: '40px' }}>
                        <button
                            onClick={handleLinkactualite}
                            style={{
                                width: '150px',
                                backgroundColor: isHoveredaa ? 'blue' : 'white',
                                color: isHoveredaa ? 'white' : 'black',
                                display: 'block',
                                height: '100%',
                                padding: '10px',
                                textDecoration: 'none',
                                border: '1px solid #000',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s'
                            }}
                            onMouseEnter={handleMouseEnteraa}
                            onMouseLeave={handleMouseLeaveaa}
                        >
                            &nbsp;&nbsp;&nbsp;   Actualités &nbsp;&nbsp;&nbsp;
                        </button>
                    </li>
                    <li style={{ height: '40px' }}>
                        <Dropdown>
                            <Dropdown.Toggle id="dropdown-basic" style={{ width: '150px',   backgroundColor: '#3b82f6',
                                color: 'white', display: 'block', height: '100%', padding: '10px', textDecoration: 'none' }}>
                                Connexion
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={handleLinkClick} href="#">Espace Membre</Dropdown.Item>
                                <Dropdown.Item href="/panel/societegestionpanel/login">Espace client</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
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
                                  onChange={handlePasswordChange}
                                />
                              </div>
                              {!passwordValid && (
                                <div className="text-center" style={{ color: "red" }}>
                                  <p>Le mot de passe doit être alphanumérique, et comporter des chiffres, des lettres et symboles</p>
                                </div>
                              )}
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
                                  <option value="Pays">Association des societés de gestion</option>
                                  <option value="Regulateur">Regulateur</option>

                                </select>
                              </div>

                              <br />
                              {renderRegistrationFields()}
                              <br />


                            </div>
                            : <p></p>}
                          <div className="text-center">
                            <button className="text-center" style={{
                              textDecoration: 'none', // Remove underline
                              backgroundColor: '#6366f1', // Background color
                              color: 'white', // Text color
                              padding: '10px 20px', // Padding
                              borderRadius: '5px', // Rounded corners
                              width: '200px', // Définir une largeur fixe
                            }} type="submit">Login/Inscription</button></div>

                          <br />
                          <div className="row">

                            {/* /.col */}
                            <div className="col-12 text-center">
                            <a className="text-center" style={{
                              textDecoration: 'none', // Remove underline
                              backgroundColor: 'red', // Background color
                              color: 'white', // Text color
                              padding: '10px 20px', // Padding
                              borderRadius: '5px', // Rounded corners
                              width: '200px', // Définir une largeur fixe
                              display: 'inline-block', // Assurez-vous que l'élément est en ligne
                            }} href="/panel/societegestionpanel/login/forgot-password">Mot de passe oublié</a>

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
Logins.layout = false; // Désactive le layout par défaut pour cette page
