"use client";

import Link from "next/link";
import { Fragment, useState } from "react";
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
        router.push(`/panel/distributor/login/register?email=${email}`);
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
        } else if (userData.typeusers_id == 2) {
          href = `/panel/management/dashboard`;
        } else if (userData.typeusers_id == 5) {
          href = `/country-panel/dashboard`;
        } else if (userData.typeusers_id == 3) {
          href = `/panel/institutional/dashboard`;
        } else if (userData.typeusers_id == 4) {
          href = `/panel/data-requester/dashboard`;
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
        setError("Login ou mot de passe incorrect");
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
                      <h2 className="text-primary fw-600">Connexion Distributeur</h2>
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
                              href="/panel/distributor/login/forgot-password"
                              style={{ color: '#6366f1', fontSize: '14px', textDecoration: 'underline' }}
                            >
                              Mot de passe oublié ?
                            </Link>
                          </div>
                        )}
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

Login.layout = false;
