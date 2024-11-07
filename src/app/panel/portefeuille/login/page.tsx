"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { signIn } from 'next-auth/react';


import Select from 'react-select';
//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import Head from 'next/head';
import { urlconstant, urlstableconstant, API_KEY_STABLECOIN } from "@/app/constants";

import { useRouter } from 'next/navigation';
interface Res {
  message: string;
  code: any;

}
async function emailexist(email: string) {
  const data = (
    await fetch(`${urlconstant}/api/userexist?email=${email}`)
  ).json();
  return data;
}
async function login(email: string, password: string) {
  const data = (
    await fetch(`${urlconstant}/api/userlogin?email=${email}&password=${password}`)
  ).json();
  return data;
}
export default function Login() {
  const [response, setResponse] = useState<Res | null>(null);

  const router = useRouter();
  const [isexist, setisExist] = useState("NON");
  const [error, setError] = useState(""); // État pour stocker le message d'erreur

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [userType, setUserType] = useState("Particulier");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Appel à l'API lors du premier rendu du composant

  }, []);

  const handleLogin = async (e: any) => {
    e.preventDefault();

    if (password == "") {
      const data = await emailexist(email);
      setResponse(data);
      if (data.code === 200) {
        //  router.push(`/panel/societegestionpanel/login/register?email=${email}&password=${password}`);

        console.log(data);
        setisExist("OUI");
        setError("Vous existez deja en base")
        setShowPassword(true);


      } else {
        const href = `/panel/portefeuille/login/register?email=${email}`;

        router.push(href);
      }

    } else {
      const data = await login(email, password);
      setResponse(data);
      if (data.code === 200) {
        console.log(data)
        let href: string = '';
        //  router.push(`/panel/societegestionpanel/login/register?email=${email}&password=${password}`);
        if (data.data.userExists.typeusers_id == 1) {
          href = `/panel/portefeuille/home?id=${data.data.userExists.id}`;

        } else if (data.data.userExists.typeusers_id == 2) {
          href = `/panel/societegestionpanel/pagehome?id=${data.data.userExists.denomination}`;

        }
        else if (data.data.userExists.typeusers_id == 0) {
          href = `/panel/admin/home?id=${data.data.userExists.denomination}`;

        }
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', data.data.userExists.id);

        router.push(href);



      } else {
        setError("Login ou mot de passe incorrect")
      }

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

          <li>  <Link className="link-style"
            href="/Opcvm/recherche"

          >
            Fonds
          </Link>
          </li>
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
            href="/panel/portefeuille/login" style={{ backgroundColor: "#3b82f6", color: "white" }}
          //href="/auth/login"

          >
            Espace client
          </Link>

          </li>
          <li>
            <Link className="link-style"
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
                    <div className="p-60">
                      <form onSubmit={handleLogin} >
                        <div className="form-group">
                          <div className="col-12">
                            <label htmlFor="">Email</label>
                            <input
                              type="email"
                              className="form-control ps-15 bg-transparent"
                              placeholder="Email"
                              defaultValue={email}
                              onChange={(event) => setEmail(event.target.value)}
                            />                          </div>
                        </div>
                        {/* <div className="form-group">
                          <div className="input-group mb-3">
                            <span className="input-group-text bg-transparent"><i className="text-fade ti-lock"></i></span>
                            <input type="password" className="form-control ps-15 bg-transparent" placeholder="Password" />
                          </div>
                        </div>*/}
                        <br />
                        {error && <div className=" text-center error-message" style={{ color: "red" }}>{error}</div>}

                        {showPassword && (
                          <div className="col-12">
                            <input type="password" onChange={(event) => setPassword(event.target.value)}
                              className="form-control ps-15 bg-transparent" placeholder="Password" />
                          </div>
                        )}
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
                              }}
                            >
                              Connexion
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
Login.layout = false; // Désactive le layout par défaut pour cette page
