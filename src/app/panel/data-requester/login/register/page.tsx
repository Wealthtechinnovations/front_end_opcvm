"use client";

import { Fragment, useEffect, useState } from "react";
import Select from 'react-select';
import { urlconstant } from "@/lib/constants";
import { useRouter, useSearchParams } from 'next/navigation';

interface Pays {
  value: any[];
}

async function getpays() {
  const data = (
    await fetch(`${urlconstant}/api/getPays`)
  ).json();
  return data;
}

export default function Register() {
  const searchParams = useSearchParams();
  const emails = searchParams.get('email');
  const router = useRouter();

  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [selectedPays, setSelectedPays] = useState<Pays | null>(null);
  const [password, setPassword] = useState("");
  const [confirmpassword, setconfirmPassword] = useState("");
  const [optionsPays, setOptionsPays] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getpays();
        const mappedOptions = data?.data.paysOptions.map((funds: any) => ({
          value: funds.value,
          label: funds.label,
        }));
        setOptionsPays(mappedOptions);
      } catch (error) {
        console.error("Erreur lors de l'appel à l'API :", error);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const email = emails;
      const pwd = e.target.password.value;
      const denomination = e.target.denomination?.value || '';
      const pays = selectedPays?.value || '';

      if (pwd !== "" && confirmpassword !== "" && pwd === confirmpassword) {
        const bodyData = {
          email,
          password: pwd,
          denomination,
          pays,
          typeusers: "Data requester",
          typeusers_id: 4,
        };

        const response = await fetch(`${urlconstant}/api/postuserportefeuille`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bodyData),
        });

        if (response.ok) {
          const responseData = await response.json();
          const token = responseData.data?.token;
          const userId = responseData.data?.userId;

          localStorage.setItem('isLoggedIn', 'true');
          if (userId?.id) localStorage.setItem('userId', userId.id);
          if (token) {
            localStorage.setItem('tokenEnCours', token);
            document.cookie = `tokenEnCours=${token}; path=/; max-age=86400; SameSite=Lax`;
          }
          document.cookie = 'isLoggedIn=true; path=/; max-age=86400; SameSite=Lax';

          setTimeout(() => {
            router.push('/panel/data-requester/dashboard');
          }, 1500);
        } else {
          const errData = await response.json();
          alert(errData.message || 'Erreur lors de la création du compte');
        }
      } else {
        setPasswordsMatch(false);
      }
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire :', error);
      alert('Erreur de connexion au serveur');
    }
  };

  return (
    <Fragment>
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
                      <h2 className="text-primary fw-600">Inscription Data Requester</h2>
                      <p className="mb-0 text-fade">Créer votre compte</p>
                    </div>
                    <div className="p-40">
                      <form onSubmit={handleSubmit}>
                        <div className="form-group">
                          <div className="col-12">
                            <label htmlFor="denomination">Dénomination</label>
                            <input
                              name="denomination"
                              className="form-control ps-15 bg-transparent"
                              type="text"
                              placeholder="Dénomination"
                            />
                          </div>
                        </div>
                        <br />

                        <div className="col-md-12">
                          <label>Pays de résidence :</label>
                          <Select
                            className="select-component"
                            name="pays"
                            options={optionsPays}
                            value={selectedPays}
                            onChange={setSelectedPays}
                            placeholder="Sélectionnez un pays"
                          />
                        </div>
                        <br />

                        <div className="form-group">
                          <div className="col-12">
                            <label htmlFor="password">Mot de passe</label>
                            <input
                              required
                              name="password"
                              type="password"
                              className="form-control ps-15 bg-transparent"
                              placeholder="Mot de passe"
                              value={password}
                              onChange={(event) => setPassword(event.target.value)}
                            />
                          </div>
                        </div>
                        <br />

                        <div className="form-group">
                          <div className="col-12">
                            <label htmlFor="confirmpassword">Confirmer le mot de passe</label>
                            <input
                              required
                              type="password"
                              className="form-control ps-15 bg-transparent"
                              placeholder="Confirmer le mot de passe"
                              value={confirmpassword}
                              onChange={(event) => setconfirmPassword(event.target.value)}
                            />
                          </div>
                          {!passwordsMatch && (
                            <div className="text-center" style={{ color: "red" }}>
                              <p>Les mots de passe ne correspondent pas.</p>
                            </div>
                          )}
                        </div>
                        <br />

                        <div className="row">
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
                                border: 'none',
                              }}
                            >
                              Enregistrer
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
      </div>
    </Fragment>
  );
}

Register.layout = false;
