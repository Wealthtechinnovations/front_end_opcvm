"use client";

import Link from "next/link";
import { Fragment, useState } from "react";
import { urlconstant } from "@/lib/constants";
import { useRouter } from 'next/navigation';


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoggingIn(true);
    setError("");
    try {
      const response = await fetch(`${urlconstant}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.code === 200 && data.data?.userExists) {
        const user = data.data.userExists;
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', user.id);
        localStorage.setItem('tokenEnCours', data.data.token);
        document.cookie = `isLoggedIn=true; path=/; max-age=${60 * 60 * 24 * 7}`;
        document.cookie = `tokenEnCours=${data.data.token}; path=/; max-age=${60 * 60 * 24 * 7}`;

        if (user.typeusers_id === 0) {
          router.push(`/panel/admin/dashboard`);
        } else if (user.typeusers_id === 2 || user.typeusers_id === 5) {
          router.push(`/panel/management/dashboard`);
        } else {
          router.push(`/panel/investor/dashboard`);
        }
      } else {
        setError(data.message || "Email ou mot de passe incorrect");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur");
      console.error(err);
    } finally {
      setIsLoggingIn(false);
    }
  }

  return (
    <Fragment>
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
                      <p className="mb-0 text-fade">Connectez-vous</p>
                    </div>
                    <div className="p-40">
                      <form onSubmit={handleLogin}>
                        <div className="form-group">
                          <div className="input-group mb-3">
                            <span className="input-group-text bg-transparent"><i className="text-fade ti-user"></i></span>
                            <input
                              type="email"
                              className="form-control ps-15 bg-transparent"
                              placeholder="Email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="input-group mb-3">
                            <span className="input-group-text bg-transparent"><i className="text-fade ti-lock"></i></span>
                            <input
                              type="password"
                              className="form-control ps-15 bg-transparent"
                              placeholder="Mot de passe"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        {error && <div className="text-center text-danger mb-3">{error}</div>}
                        <div className="text-center">
                          <button
                            style={{
                              textDecoration: 'none',
                              backgroundColor: '#1B3A5C',
                              color: 'white',
                              padding: '10px 20px',
                              borderRadius: '5px',
                            }}
                            className="btn text-center"
                            disabled={isLoggingIn}
                            type="submit"
                          >
                            {isLoggingIn ? "Connexion..." : "Connexion"}
                          </button>
                        </div>
                      </form>
                      <div className="text-center">
                        <p className="mt-15 mb-0 text-fade">Pas encore de compte ? <Link href="/panel/investor/login/register">Inscription</Link></p>
                      </div>
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
