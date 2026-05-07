"use client";

import Link from "next/link";
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
  let emails = searchParams.get('email');
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const [selectedPays, setSelectedPays] = useState<Pays | null>(null);
  const [password, setPassword] = useState("");
  const [confirmpassword, setconfirmPassword] = useState("");
  const [optionsPays, setOptionsPays] = useState([]);

  const router = useRouter();

  const [formData, setFormData] = useState({
    page: 1,
    email: '',
    typeusers: 'Distributeur',
    typeusers_id: '6',
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
      const typeusers = "Distributeur";
      const typeusers_id = "6";

      if (pwd != "" && confirmpassword != "" && pwd == confirmpassword) {
        const bodyData = {
          email,
          password: pwd,
          denomination,
          pays,
          typeusers,
          typeusers_id,
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

          const href = `/panel/distributor/dashboard`;
          setTimeout(() => {
            router.push(href);
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
                      <h2 className="text-primary fw-600">Inscription Distributeur</h2>
                      <p className="mb-0 text-fade">Créer votre compte distributeur</p>
                    </div>
                    <div className="p-40">
                      <form onSubmit={handleSubmit}>
                        <div>
                          <input
                            name="denomination"
                            className="form-control"
                            type="text"
                            placeholder="Dénomination"
                          />
                          <br />

                          <div className="col-md-12">
                            <label>Pays :</label>
                            <Select
                              className="select-component"
                              name="pays"
                              options={optionsPays}
                              value={selectedPays}
                              onChange={setSelectedPays}
                              placeholder="Sélectionnez un pays"
                            />
                          </div>
                        </div>
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
                          {!passwordsMatch && (
                            <div className="text-center" style={{ color: "red" }}>
                              <p>Mots de passe ne correspondent pas.</p>
                            </div>
                          )}
                        </div>
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
