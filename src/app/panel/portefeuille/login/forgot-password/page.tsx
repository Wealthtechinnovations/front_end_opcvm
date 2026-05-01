"use client";

import Link from "next/link";
import { Fragment, useState } from "react";
import { urlconstant } from "@/app/constants";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${urlconstant}/api/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.code === 200) {
        setIsSuccess(true);
        setMessage("Si cet email est enregistré, vous recevrez un lien de réinitialisation dans quelques minutes. Vérifiez aussi vos spams.");
      } else {
        setMessage(data.message || "Une erreur est survenue. Réessayez.");
      }
    } catch {
      setMessage("Impossible de contacter le serveur. Réessayez plus tard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
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
                      <p style={{ color: '#666', fontSize: '14px' }}>
                        Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                      </p>
                    </div>
                    <div className="p-60">
                      {isSuccess ? (
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✉️</div>
                          <p style={{ color: '#22c55e', fontWeight: 600, marginBottom: '12px' }}>
                            Email envoyé !
                          </p>
                          <p style={{ color: '#555', fontSize: '14px', marginBottom: '24px' }}>
                            {message}
                          </p>
                          <Link
                            href="/panel/portefeuille/login"
                            style={{
                              color: '#6366f1',
                              textDecoration: 'underline',
                              fontSize: '14px',
                            }}
                          >
                            Retour à la connexion
                          </Link>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmit}>
                          <div className="form-group">
                            <div className="col-12">
                              <label htmlFor="email">Adresse email</label>
                              <input
                                id="email"
                                type="email"
                                required
                                className="form-control ps-15 bg-transparent"
                                placeholder="votre@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                              />
                            </div>
                          </div>

                          {message && !isSuccess && (
                            <div style={{ color: 'red', fontSize: '14px', marginTop: '8px', textAlign: 'center' }}>
                              {message}
                            </div>
                          )}

                          <br />
                          <div className="row">
                            <div className="col-12 text-center">
                              <button
                                type="submit"
                                disabled={loading}
                                style={{
                                  backgroundColor: '#6366f1',
                                  color: 'white',
                                  padding: '10px 20px',
                                  borderRadius: '5px',
                                  cursor: loading ? 'not-allowed' : 'pointer',
                                  border: 'none',
                                  opacity: loading ? 0.7 : 1,
                                }}
                              >
                                {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
                              </button>
                            </div>
                          </div>

                          <div className="col-12 text-center mt-3">
                            <Link
                              href="/panel/portefeuille/login"
                              style={{ color: '#6366f1', fontSize: '14px', textDecoration: 'underline' }}
                            >
                              Retour à la connexion
                            </Link>
                          </div>
                        </form>
                      )}
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
