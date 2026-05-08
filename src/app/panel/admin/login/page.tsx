"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
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
        //  router.push(`/panel/management/login/register?email=${email}&password=${password}`);

        setisExist("OUI");
        setError("Vous existez deja en base")
        setShowPassword(true);


      } else {
        router.push(`/panel/admin/login/register?email=${email}`);
      }

    } else {
      const data = await login(email, password);
      setResponse(data);
      if (data.code === 200) {
        const userData = data.data.userExists || data.data.user;
        const token = data.data?.token || data.token;

        if (userData.typeusers_id != 0) {
          setError("Accès réservé aux administrateurs");
          return;
        }

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', userData.id);
        if (token) {
          localStorage.setItem('tokenEnCours', token);
          document.cookie = `tokenEnCours=${token}; path=/; max-age=86400; SameSite=Lax`;
        }
        document.cookie = 'isLoggedIn=true; path=/; max-age=86400; SameSite=Lax';

        router.push('/panel/admin/dashboard');
      } else {
        setError(data.message || "Login ou mot de passe incorrect")
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
          <li><Link className="link-style" href="/home"> Accueil</Link>

          </li>

          <li>  <Link className="link-style"
            href="/funds/search"

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
            href="/panel/investor/login"
          //href="/auth/login"

          >
            Espace client
          </Link>

          </li>
          <li>
            <Link className="link-style"
              href="/panel/management/login"

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
                                backgroundColor: '#1B3A5C',
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
