"use client";

import Link from "next/link";
import { Fragment, useCallback, useEffect, useState } from "react";


import Select from 'react-select';
//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import Head from 'next/head';
import { urlconstant } from "@/app/constants";
import { magic } from '../../../../magic'; // Importer correctement le module
import { useRouter } from 'next/navigation';


export default function LoginMagic() {

  const [email, setEmail] = useState(""); // Ajout de l'état pour l'e-mail
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();

  // Fonction de connexion à magic
  async function loginMagic(e: React.FormEvent) {
    e.preventDefault();
    setIsLoggingIn(true)
    try {
      if (magic && magic.auth) {
        const didToken = await magic.auth.loginWithMagicLink({
          email,
          redirectURI: new URL('/callback', window.location.origin).href,
        })
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
    } catch (error) {
      setIsLoggingIn(false)
      console.error(error);
    }
  };


  // Fonction de deconnexion
  const logout = useCallback(() => {
    if (magic && magic.user) {

      magic.user.logout().then(() => {
        // Actualisation et redirection
        setTimeout(() => {
          window.location.reload()
        }, 1000)
        router.push("/"); //Redirection après connexion

      });
    }
  }, [router]);

  return (



    < Fragment >
      <br />

      <div className="col-12 mt-3">

        <div className="container h-p100">
          <div className="row align-items-center justify-content-md-center h-p100">
            <div className="col-12">
              <div className="row justify-content-center g-0">
                <div className="col-lg-5 col-md-5 col-12">
                  <div className="bg-white rounded10 shadow-lg">
                    <div className="content-top-agile p-20 pb-0">
                      <h2 className="text-primary fw-600">Login</h2>
                      <p className="mb-0 text-fade">Sign in</p>
                    </div>
                    <div className="p-40">
                      <form onSubmit={loginMagic}>
                        <div className="form-group">
                          <div className="input-group mb-3">
                            <span className="input-group-text bg-transparent"><i className="text-fade ti-user"></i></span>
                            <input
                              type="email"
                              className="form-control ps-15 bg-transparent"
                              placeholder="Email"
                              defaultValue={email}
                              onChange={(event) => setEmail(event.target.value)}
                            />
                          </div>
                        </div>
                        <div className="text-center">
                          <button
                            style={{
                              textDecoration: 'none',
                              backgroundColor: '#6366f1',
                              color: 'white',
                              padding: '10px 20px',
                              borderRadius: '5px',
                            }}
                            className="btn text-center "
                            disabled={isLoggingIn}
                            type="submit"
                          >
                            Connexion
                          </button>
                        </div>
                      </form>
                      <div className="text-center">
                        <p className="mt-15 mb-0 text-fade">Don t have an account? <Link href="" onClick={logout}>Deconnexion</Link></p>
                      </div>

                      <div className="text-center">
                        <p className="mt-20 text-fade">- Sign With -</p>
                        <p className="gap-items-2 mb-0">
                          <a className="waves-effect waves-circle btn btn-social-icon btn-circle btn-facebook-light" href="#"><i className="fa fa-facebook"></i></a>
                          <a className="waves-effect waves-circle btn btn-social-icon btn-circle btn-twitter-light" href="#"><i className="fa fa-twitter"></i></a>
                          <a className="waves-effect waves-circle btn btn-social-icon btn-circle btn-instagram-light" href="#"><i className="fa fa-instagram"></i></a>
                        </p>
                      </div>
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
LoginMagic.layout = false; // Désactive le layout par défaut pour cette page
