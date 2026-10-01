"use client";

import Link from "next/link";
import { Fragment, useState } from "react";
import { urlconstant } from "@/lib/constants";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`${urlconstant}/api/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setMessage('Un email de réinitialisation a été envoyé.');
    } else {
      setMessage('Erreur, veuillez réessayer.');
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

      <br /><br /><br /><br /><br /><br />

      <div className="col-12 mt-3">
        <div className="container h-p100">
          <div className="row align-items-center justify-content-md-center h-p100">
            <div className="col-12">
              <div className="row justify-content-center g-0">
                <div className="col-lg-5 col-md-5 col-12">
                  <div className="bg-white rounded10 shadow-lg">
                    <div className="content-top-agile p-20 pb-0">
                      <h2 className="text-primary fw-600">Mot de passe oublié</h2>
                    </div>
                    <div className="p-40">
                      <form onSubmit={handleSubmit}>
                        <div className="form-group">
                          <label htmlFor="email">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Entrez votre email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>

                        <br />

                        {message && (
                          <div className="text-center" style={{ color: message.includes('envoyé') ? '#16A34A' : 'red', fontSize: '14px', marginTop: '8px' }}>
                            {message}
                          </div>
                        )}

                        <br />

                        <div className="text-center">
                          <button
                            type="submit"
                            style={{
                              textDecoration: 'none',
                              backgroundColor: '#1B3A5C',
                              color: 'white',
                              padding: '10px 20px',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              border: 'none',
                            }}
                          >
                            Envoyer
                          </button>
                        </div>

                        <br />

                        <div className="col-12 text-center">
                          <Link
                            href="/panel/management/login"
                            style={{ color: '#1B3A5C', fontSize: '14px', textDecoration: 'underline' }}
                          >
                            Retour à la connexion
                          </Link>
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
ForgotPassword.layout = false;
