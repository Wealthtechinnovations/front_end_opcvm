"use client";
import { urlconstant } from "@/app/constants";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';


import Select from 'react-select';
//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import Header from '@/app/Header';
import Swal from "sweetalert2";
import Sidebar from "@/app/sidebaradmin";
import Headermenu from "@/app/Headermenu";
interface Funds {
  data: {
    userss: any[]; // ou un type spécifique pour les éléments du tableau 'funds'
  };
}

async function getFonds() {
  const data = (

    await fetch(`${urlconstant}/api/getusersbyadmin`, {
      method: 'GET', // Assurez-vous que la méthode HTTP correspond à votre API
    })
  ).json();
  return data;
}
interface PageProps {
  searchParams: {
    selectedRows: any;
    id: any;
  };
}
export default function Fonds(props: PageProps) {
  let id = props.searchParams.id;
  const router = useRouter();

  const [userId, setUserId] = useState('');
  const [duration, setDuration] = useState('');
  const [rateLimit, setRateLimit] = useState('');
  const [apiKeyData, setApiKeyData] = useState(null);
  const [renewalToken, setRenewalToken] = useState('');
  const [renewalDuration, setRenewalDuration] = useState('');

  const [apiKeys, setApiKeys] = useState([]);

  useEffect(() => {
      // Fonction pour récupérer les clés API
      const fetchApiKeys = async () => {
          try {
              const response = await fetch(`${urlconstant}/api/api-keys`);
              if (!response.ok) {
                  throw new Error('Erreur lors de la récupération des clés API');
              }
              const data = await response.json();
              setApiKeys(data);
          } catch (error) {
              console.error("Erreur lors de la récupération des clés API", error);
          }
      };

      fetchApiKeys();
  }, []);

  const handleGenerateApiKey = async () => {
    try {
      const response = await fetch(`${urlconstant}/api/generate-api-key`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
       // 'x-api-key': `0b8e4cd779c0d6c3c464a244cd2fdf1fa10d13b8`
        },
        body: JSON.stringify({
          user_id: userId,
          duration_in_days: duration,
          rate_limit: rateLimit
        }),
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la génération de la clé API');
      }
      const data = await response.json();
      console.log(response);
      if (data.code=200) {
        Swal.fire({
          icon: 'success',
          title: 'Creation clé api',
          text: data.message
      });
    window.location.reload();
    }
    } catch (error) {
      console.error('Erreur lors de la génération de la clé API', error);
    }
  };


  const renewApiKey = async (apiKey: any,renew:any) => {
    // Afficher SweetAlert pour demander la durée du renouvellement
    const { value: duration } = await Swal.fire({
        title: 'Renouveler la Clé API',
        input: 'number',
        inputLabel: 'Durée en jours',
        inputPlaceholder: 'Entrez le nombre de jours',
        showCancelButton: true,
        confirmButtonText: 'Renouveler',
        cancelButtonText: 'Annuler',
        inputValidator: (value) => {
            if (!value || parseInt(value) <= 0) {
                return 'Veuillez entrer un nombre valide !';
            }
        }
    });

    if (duration) {
        try {
            const response = await fetch(`${urlconstant}/api/renew-api-key`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    api_key: apiKey,
                    renewal_token: renew,
                    duration_in_days: duration
                }),
            });
            if (!response.ok) {
                throw new Error('Erreur lors du renouvellement de la clé API');
            }
            const data = await response.json();
            Swal.fire({
                icon: 'success',
                title: 'Clé API renouvelée avec succès',
                text: data.message
            });
        window.location.reload();
        } catch (error) {
            console.error("Erreur lors du renouvellement de la clé API", error);
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: "Erreur lors du renouvellement de la clé API"
            });
        }
    }
};

  return (



    < Fragment >
    <div className="flex bg-gray-100">
      <Sidebar id={id} />
      <div className="flex-1 ml-64">
        <Headermenu />
      <div className="content-wrapper2">
        <div className="container-full">
          {/* Main content */}
          <section className="content">

            <br />
            <div className="container mt-5">
      <h1 className="text-center">Gestion des clés API</h1>
      <div className="card mb-4">
        <div className="card-body">
          <h2 className="card-title">Générer une clé API</h2>
          <div className="mb-3">
            <input required className="form-control" type="text" placeholder="User ID" value={userId} onChange={e => setUserId(e.target.value)} />
          </div>
          <div className="mb-3">
            <input required className="form-control" type="number" placeholder="Durée (en jours)" value={duration} onChange={e => setDuration(e.target.value)} />
          </div>
          <div className="mb-3">
            <input required className="form-control" type="number" placeholder="Limite d'appels" value={rateLimit} onChange={e => setRateLimit(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={handleGenerateApiKey}>Générer la clé API</button>
        </div>
      </div>
      <div className="card table-container p-3">
            <h1>Liste des Clés API</h1>
            <table>
                <thead>
                    <tr>
                        <th>Clé API</th>
                        <th>ID Utilisateur</th>
                        <th>Date d Expiration</th>
                        <th>Limite d Appels</th>
                        <th>Appels Réalisés</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {apiKeys.map((key: { api_key: string; user_id: string; expires_at: string; rate_limit: number,calls_made:any,renewal_token:any }) => (
                        <tr key={key.api_key}>
                            <td>{key.api_key}</td>
                            <td>{key.user_id}</td>
                            <td>{key.expires_at}</td>
                            <td>{key.rate_limit}</td>
                            <td>{key.calls_made}</td>
                            <td>
                                {new Date(key.expires_at) < new Date() || key.rate_limit < key.calls_made ? (
                                    <button className="btn btn-success" onClick={() => renewApiKey(key.api_key,key.renewal_token)}>Renouveler</button>
                                ) : (
                                    <span>Valide</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      {/* {apiKeyData && (
        <div className="card mb-4">
          <div className="card-body">
            <h3 className="card-title">Clé API générée:</h3>
            <p><strong>API Key:</strong> {apiKeyData.apiKey}</p>
            <p><strong>Expires at:</strong> {apiKeyData.expires_at}</p>
            <p><strong>Renewal Token:</strong> {apiKeyData.renewal_token}</p>
            
            <h2 className="mt-4">Renouveler la clé API</h2>
            <input className="form-control mb-3" type="number" placeholder="Nouvelle durée (en jours)" value={renewalDuration} onChange={e => setRenewalDuration(e.target.value)} />
            <button className="btn btn-success" onClick={handleRenewApiKey}>Renouveler la clé API</button>
          </div>
        </div>
      )} */}
    </div>




          </section>
        </div>

      </div >
      </div >
      </div >
    </Fragment >
  );
}