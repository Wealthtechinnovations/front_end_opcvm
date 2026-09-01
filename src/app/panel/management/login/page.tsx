"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import Select from 'react-select';
import { urlconstant } from "@/lib/constants";

import { useRouter, useSearchParams } from 'next/navigation';
import Swal from "sweetalert2";

async function login(email: string, password: any) {
  const response = await fetch(`${urlconstant}/api/userlogin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
}
async function emailexist(email: string) {
  const response = await fetch(`${urlconstant}/api/userexist?email=${email}`);
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
export default function Logins() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('id');
    if (id === 'Unauthorized') {
      Swal.fire({
        icon: 'error',
        title: 'Unauthorized',
        text: "Vous n'etes pas autorisé!",
        confirmButtonText: 'OK'
      });
    }
  }, [searchParams]);

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
                    backgroundColor: '#1B3A5C', // Background color
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

      if (data.code !== 200 || !data.data?.userExists) {
        setisExist("NON EXIST");
        setError("Pour completer votre inscription merci de selectionner le type d utilisateur pour lequel vous voulez creer un compte")
      } else {
        setisExist("OUI");
        setError("Vous existez deja en base")
      }
    } else if (isexist == "OUI") {
      try {
        const data1 = await login(email, password.toString());
        setResponse(data1);

        if (data1.code === 200) {
          const userData = data1.data.userExists || data1.data.user;
          const token = data1.data?.token || data1.token;
          if (token) {
            localStorage.setItem('tokenEnCours', token);
            document.cookie = `tokenEnCours=${token}; path=/; max-age=86400; SameSite=Lax`;
          }
          localStorage.setItem('isLoggedIn', 'true');
          document.cookie = 'isLoggedIn=true; path=/; max-age=86400; SameSite=Lax';

          let href: string;
          if (userData.typeusers_id == 0) {
            localStorage.setItem('userId', userData.id);
            href = `/panel/admin/dashboard`;
          } else if (userData.typeusers_id == 1) {
            localStorage.setItem('userId', userData.id);
            href = `/panel/investor/dashboard`;
          } else if (userData.typeusers_id == 2) {
            localStorage.setItem('userId', userData.denomination);
            href = `/panel/management/dashboard`;
          } else if (userData.typeusers_id == 3) {
            localStorage.setItem('userId', userData.id);
            href = `/panel/institutional/dashboard`;
          } else if (userData.typeusers_id == 4) {
            localStorage.setItem('userId', userData.id);
            href = `/panel/data-requester/dashboard`;
          } else if (userData.typeusers_id == 5) {
            localStorage.setItem('userId', userData.pays);
            href = `/country-panel/dashboard`;
          } else if (userData.typeusers_id == 6) {
            localStorage.setItem('userId', userData.id);
            href = `/panel/distributor/dashboard`;
          } else {
            localStorage.setItem('userId', userData.id);
            href = `/panel/investor/dashboard`;
          }
          router.push(href);
        } else {
          setError(data1.message || "Mot de passe incorrect");
        }
      } catch (error) {
        console.error('Erreur lors de la soumission du formulaire :', error);
        setError("Erreur de connexion au serveur");
      }
    }
    else if (password != "" && confirmpassword != "" && password == confirmpassword) {
      setPasswordsMatch(true);

      try {
        const denomination = selectedSociete?.value || '';
        const pays = selectedPays?.value || '';
        const typeusers_id = userType === "socGest" ? "2" : userType === "part" ? "1" : userType === "insti" ? "3" : userType === "Data requester" ? "4" : "5";

        const registerData = {
          email,
          password,
          denomination,
          pays,
          typeusers: userType,
          typeusers_id,
        };

        const response = await fetch(`${urlconstant}/api/postuserportefeuille`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(registerData),
        });

        if (response.ok) {
          const regResult = await response.json();
          const token = regResult.data?.token;

          if (token) {
            localStorage.setItem('tokenEnCours', token);
            document.cookie = `tokenEnCours=${token}; path=/; max-age=86400; SameSite=Lax`;
          }
          localStorage.setItem('isLoggedIn', 'true');
          document.cookie = 'isLoggedIn=true; path=/; max-age=86400; SameSite=Lax';

          let href: string;
          const uid = regResult.data?.userId?.id || '';
          if (typeusers_id == "1") {
            localStorage.setItem('userId', uid);
            href = `/panel/investor/dashboard`;
          } else if (typeusers_id == "2") {
            localStorage.setItem('userId', denomination || pays);
            href = `/panel/management/dashboard`;
          } else if (typeusers_id == "3") {
            localStorage.setItem('userId', uid);
            href = `/panel/institutional/dashboard`;
          } else if (typeusers_id == "4") {
            localStorage.setItem('userId', uid);
            href = `/panel/data-requester/dashboard`;
          } else if (typeusers_id == "5") {
            localStorage.setItem('userId', pays || denomination);
            href = `/country-panel/dashboard`;
          } else if (typeusers_id == "6") {
            localStorage.setItem('userId', uid);
            href = `/panel/distributor/dashboard`;
          } else {
            localStorage.setItem('userId', uid);
            href = `/panel/investor/dashboard`;
          }
          router.push(href);
        } else {
          const errData = await response.json();
          setError(errData.message || "Erreur lors de la création du compte");
        }
      } catch (error) {
        console.error('Erreur lors de la soumission du formulaire :', error);
        setError("Erreur de connexion au serveur");
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


    <Fragment>
      <nav className="main-nav bg-white" role="navigation">
        <input id="main-menu-state" type="checkbox" checked={menuOpen} onChange={toggleMenu} />
        <label className="main-menu-btn" htmlFor="main-menu-state">
          <span className="main-menu-btn-icon"></span> Toggle main menu visibility
        </label>
        <ul id="main-menu" className="sm sm-blue">
          <li><Link className="link-style" href="/home">Accueil</Link></li>
          <li><Link className="link-style" href="/funds/search">Fonds</Link></li>
          <li><Link className="link-style" href="/comparaison">Comparaison</Link></li>
          <li><Link className="link-style" href="/recherche">Selection OPCVM</Link></li>
          <li>
            <Link className="link-style" href="/panel/investor/login">
              Espace client
            </Link>
          </li>
          <li>
            <Link className="link-style" href="/panel/management/login" style={{ backgroundColor: "#1B3A5C", color: "white" }}>
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
                              backgroundColor: '#1B3A5C', // Background color
                              color: 'white', // Text color
                              padding: '10px 20px', // Padding
                              borderRadius: '5px', // Rounded corners
                              width: '200px', // Définir une largeur fixe
                            }} type="submit">Login/Inscription</button></div>

                          <br />
                          <div className="row">

                            {/* /.col */}
                            <div className="col-12 text-center">
                            <Link
                              href="/panel/management/login/forgot-password"
                              style={{ color: '#1B3A5C', fontSize: '14px', textDecoration: 'underline' }}
                            >
                              Mot de passe oublié ?
                            </Link>

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
                              backgroundColor: '#ef4444', // Background color
                              color: 'white', // Text color
                              padding: '10px 20px', // Padding
                              borderRadius: '5px', // Rounded corners
                            }} onClick={prevPage}>Précédent</button>
                            <button className="text-right" style={{
                              textDecoration: 'none', // Remove underline
                              backgroundColor: '#1B3A5C', // Background color
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
