"use client";

import Link from "next/link";
import { Fragment, useState } from "react";
import { signIn } from 'next-auth/react';
import { urlconstant } from "@/lib/constants";
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
  const response = await fetch(`${urlconstant}/api/userlogin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
}

export default function Login() {
  const [response, setResponse] = useState<Res | null>(null);
  const router = useRouter();
  const [isexist, setisExist] = useState("NON");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogin = async (e: any) => {
    e.preventDefault();

    if (password === "") {
      const data = await emailexist(email);
      setResponse(data);
      if (data.code === 200) {
        setisExist("OUI");
        setError("Vous existez déjà en base");
        setShowPassword(true);
      } else {
        router.push(`/panel/investor/login/register?email=${email}`);
      }
    } else {
      const data = await login(email, password);
      setResponse(data);
      if (data.code === 200) {
        const userData = data.data.userExists || data.data.user;
        const token = data.data?.token || data.token;
        let href: string = '';
        if (userData.typeusers_id == 0) {
          href = `/panel/admin/dashboard`;
        } else if (userData.typeusers_id == 1) {
          href = `/panel/investor/dashboard`;
        } else if (userData.typeusers_id == 2) {
          href = `/panel/management/dashboard`;
        } else if (userData.typeusers_id == 3) {
          href = `/panel/institutional/dashboard`;
        } else if (userData.typeusers_id == 4) {
          href = `/panel/data-requester/dashboard`;
        } else if (userData.typeusers_id == 5) {
          href = `/country-panel/dashboard`;
        } else if (userData.typeusers_id == 6) {
          href = `/panel/distributor/dashboard`;
        } else {
          href = `/panel/investor/dashboard`;
        }
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', userData.id);
        if (token) {
          localStorage.setItem('tokenEnCours', token);
          document.cookie = `tokenEnCours=${token}; path=/; max-age=86400; SameSite=Lax`;
        }
        document.cookie = 'isLoggedIn=true; path=/; max-age=86400; SameSite=Lax';
        router.push(href);
      } else {
        setError(data.message || "Login ou mot de passe incorrect");
      }
    }
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
            <Link className="link-style" href="/panel/investor/login" style={{ backgroundColor: "#3b82f6", color: "white" }}>
              Espace client
            </Link>
          </li>
          <li>
            <Link className="link-style" href="/panel/management/login">
              Espace membre
            </Link>
          </li>
        </ul>
      </nav>

      <br /><br /><br /><br /><br /><br />

      <div className="col-12 mt-3">
        <div className="container h-p100">
          <div className="row align-items-center justify-content-md-center h-p100">
            <div className="col-12">
              <div className="row justify-content-center g-0">
                <div className="col-lg-5 col-md-5 col-12">
                  <div className="bg-white rounded10 shadow-lg">
                    <div className="content-top-agile p-20 pb-0">
                      <h2 className="text-primary fw-600">Connexion</h2>
                    </div>
                    <div className="p-60">
                      <form onSubmit={handleLogin}>
                        <div className="form-group">
                          <div className="col-12">
                            <label htmlFor="email">Email</label>
                            <input
                              id="email"
                              type="email"
                              className="form-control ps-15 bg-transparent"
                              placeholder="Votre adresse email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                        </div>

                        <br />
                        {error && (
                          <div className="text-center error-message" style={{ color: "red" }}>
                            {error}
                          </div>
                        )}

                        {showPassword && (
                          <div className="col-12 mt-2">
                            <input
                              type="password"
                              onChange={(e) => setPassword(e.target.value)}
                              className="form-control ps-15 bg-transparent"
                              placeholder="Mot de passe"
                            />
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
                                border: 'none',
                              }}
                            >
                              Connexion
                            </button>
                          </div>
                        </div>

                        {showPassword && (
                          <div className="col-12 text-center mt-3">
                            <Link
                              href="/panel/investor/login/forgot-password"
                              style={{ color: '#6366f1', fontSize: '14px', textDecoration: 'underline' }}
                            >
                              Mot de passe oublié ?
                            </Link>
                          </div>
                        )}
                      </form>
                      <div className="text-center mt-3">
                        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '15px', marginTop: '15px' }}>
                          <p className="text-muted mb-2" style={{ fontSize: '14px' }}>Ou connectez-vous avec</p>
                          <button
                            type="button"
                            onClick={() => signIn('google', { callbackUrl: `/panel/investor/dashboard` })}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '10px 20px',
                              border: '1px solid #dadce0',
                              borderRadius: '5px',
                              backgroundColor: 'white',
                              cursor: 'pointer',
                              fontSize: '14px',
                            }}
                          >
                            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                            Google
                          </button>
                        </div>
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

Login.layout = false;
