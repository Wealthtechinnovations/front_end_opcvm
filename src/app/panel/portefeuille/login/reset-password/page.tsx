"use client";

import Link from "next/link";
import { Fragment, useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { urlconstant } from "@/lib/constants";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!token) {
      setIsError(true);
      setMessage("Lien de réinitialisation invalide ou manquant.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      setMessage("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (password !== confirm) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${urlconstant}/api/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (data.code === 200) {
        setIsSuccess(true);
        setMessage("Votre mot de passe a été réinitialisé avec succès.");
        setTimeout(() => router.push('/panel/investor/login'), 3000);
      } else {
        setIsError(true);
        setMessage(data.message || "Une erreur est survenue.");
      }
    } catch {
      setMessage("Impossible de contacter le serveur. Réessayez plus tard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-lg-5 col-md-5 col-12">
      <div className="bg-white rounded10 shadow-lg">
        <div className="content-top-agile p-20 pb-0">
          <h2 className="text-primary fw-600">Nouveau mot de passe</h2>
        </div>
        <div className="p-60">
          {isSuccess ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
              <p style={{ color: '#22c55e', fontWeight: 600, marginBottom: '12px' }}>
                Mot de passe modifié !
              </p>
              <p style={{ color: '#555', fontSize: '14px', marginBottom: '24px' }}>
                {message}
              </p>
              <p style={{ color: '#888', fontSize: '13px' }}>Redirection automatique dans 3 secondes...</p>
              <Link
                href="/panel/investor/login"
                style={{ color: '#6366f1', textDecoration: 'underline', fontSize: '14px' }}
              >
                Se connecter maintenant
              </Link>
            </div>
          ) : isError && !token ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
              <p style={{ color: 'red', marginBottom: '16px' }}>{message}</p>
              <Link
                href="/panel/investor/login/forgot-password"
                style={{ color: '#6366f1', textDecoration: 'underline', fontSize: '14px' }}
              >
                Faire une nouvelle demande
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <div className="col-12">
                  <label htmlFor="password">Nouveau mot de passe</label>
                  <input
                    id="password"
                    type="password"
                    required
                    className="form-control ps-15 bg-transparent"
                    placeholder="Minimum 8 caractères"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group mt-3">
                <div className="col-12">
                  <label htmlFor="confirm">Confirmer le mot de passe</label>
                  <input
                    id="confirm"
                    type="password"
                    required
                    className="form-control ps-15 bg-transparent"
                    placeholder="Répétez le mot de passe"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                </div>
              </div>

              {message && (
                <div style={{ color: isError ? 'red' : '#555', fontSize: '14px', marginTop: '8px', textAlign: 'center' }}>
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
                    {loading ? 'Réinitialisation...' : 'Confirmer le nouveau mot de passe'}
                  </button>
                </div>
              </div>

              <div className="col-12 text-center mt-3">
                <Link
                  href="/panel/investor/login"
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
  );
}

export default function ResetPassword() {
  return (
    <Fragment>
      <br /><br /><br /><br /><br /><br />
      <div className="col-12 mt-3">
        <div className="container h-p100">
          <div className="row align-items-center justify-content-md-center h-p100">
            <div className="col-12">
              <div className="row justify-content-center g-0">
                <Suspense fallback={<div className="text-center p-60">Chargement...</div>}>
                  <ResetPasswordForm />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

ResetPassword.layout = false;
