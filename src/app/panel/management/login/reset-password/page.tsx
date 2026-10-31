"use client";

import Link from "next/link";
import { Fragment, useState } from "react";
import { urlconstant } from "@/lib/constants";
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tokenapp = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }
    setPasswordsMatch(true);

    const res = await fetch(`${urlconstant}/api/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokenapp, newPassword }),
    });

    if (res.ok) {
      setMessage('Mot de passe réinitialisé avec succès.');
      router.push('/panel/management/login');
    } else {
      setMessage('Erreur lors de la réinitialisation du mot de passe.');
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
                      <h2 className="text-primary fw-600">Réinitialiser le mot de passe</h2>
                    </div>
                    <div className="p-40">
                      <form onSubmit={handleSubmit}>
                        <div className="form-group">
                          <label htmlFor="password">Nouveau mot de passe</label>
                          <div style={{ position: 'relative' }}>
                            <input
                              className="form-control"
                              type={isPasswordVisible ? 'text' : 'password'}
                              placeholder="Nouveau mot de passe"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              required
                            />
                            <span
                              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                            >
                              {isPasswordVisible ? '👁️' : '👁️‍🗨️'}
                            </span>
                          </div>
                        </div>

                        <br />

                        <div className="form-group">
                          <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                          <div style={{ position: 'relative' }}>
                            <input
                              className="form-control"
                              type={confirmPasswordVisible ? 'text' : 'password'}
                              placeholder="Confirmer le mot de passe"
                              value={confirmPassword}
                              onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setPasswordsMatch(newPassword === e.target.value);
                              }}
                              required
                            />
                            <span
                              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                            >
                              {confirmPasswordVisible ? '👁️' : '👁️‍🗨️'}
                            </span>
                          </div>
                          {!passwordsMatch && (
                            <p style={{ color: 'red', fontSize: '14px', marginTop: '8px' }}>Les mots de passe ne correspondent pas.</p>
                          )}
                        </div>

                        <br />

                        {message && (
                          <div className="text-center" style={{ color: message.includes('succès') ? '#16A34A' : 'red', fontSize: '14px', marginBottom: '12px' }}>
                            {message}
                          </div>
                        )}

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
                            Réinitialiser
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
ResetPassword.layout = false;
