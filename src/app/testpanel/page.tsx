// pages/societegestionpanel/pagehome.tsx
"use client";// pages/societegestionpanel/pagehome.tsx
import { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import Header from "./header";

async function getsociete(id: string) {
  const response = await fetch(`/api/getSocietebyid/${id}`);
  return await response.json();
}

async function getFonds(id: string) {
  const response = await fetch(`/api/getfondbyuser/${id}`);
  return await response.json();
}

async function getactualite() {
  const response = await fetch(`/api/getactualite`);
  return await response.json();
}

export default function Dashboard(props: { searchParams: { id: string } }) {
  const societeconneted = props.searchParams.id;
  const [managementCompany, setManagementCompany] = useState<any>({});
  const [funds, setFunds] = useState<any[]>([]);
  const [actualites, setActualites] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [societeData, fondsData, actualitesData] = await Promise.all([
          getsociete(societeconneted),
          getFonds(societeconneted),
          getactualite(),
        ]);
        setManagementCompany(societeData?.data?.societe);
        setFunds(fondsData?.data?.funds || []);
        setActualites(actualitesData || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    }
    fetchData();
  }, [societeconneted]);

  return (
    <div className="flex bg-gray-100">
      <Sidebar societeconneted={societeconneted} />
      <div className="flex-1 ml-64">
        <Header />
        <div className="p-8 space-y-8 overflow-auto h-screen">
          {/* Section de gestion de la société */}
          <div className="bg-white p-8 rounded-lg shadow-xl transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-semibold mb-4 text-blue-700">Informations sur la Société</h2>
            <div className="grid grid-cols-2 gap-4">
              <p><strong className="text-gray-700">Nom : </strong>{managementCompany.nom}</p>
              <p><strong className="text-gray-700">Description : </strong>{managementCompany.description}</p>
              <p><strong className="text-gray-700">Site Web : </strong><a href={managementCompany.site_web} className="text-blue-500 underline">{managementCompany.site_web}</a></p>
              <p><strong className="text-gray-700">Email : </strong>{managementCompany.email}</p>
              <p><strong className="text-gray-700">Pays : </strong>{managementCompany.pays}</p>
            </div>
          </div>

          {/* Section des actualités */}
          <div className="bg-white p-8 rounded-lg shadow-xl transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-semibold mb-4 text-blue-700">Dernières Actualités</h2>
            <div className="space-y-4">
              {actualites.slice(0, 3).map((actu, index) => (
                <div key={index} className="border-b border-gray-200 py-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{actu.username}</h4>
                    <p className="text-gray-600">{actu.description}</p>
                  </div>
                  <img
                    src={actu.image ? actu.image : "/images/default-image.png"}
                    alt="Actualité"
                    className="rounded-lg shadow-md w-32 h-24 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section des fonds */}
          <div className="bg-white p-8 rounded-lg shadow-xl transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-semibold mb-4 text-blue-700">Les Derniers Fonds</h2>
            <table className="w-full bg-gray-50 rounded-lg shadow">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-4">Nom du fond</th>
                  <th className="p-4">Code ISIN</th>
                  <th className="p-4">Catégorie</th>
                  <th className="p-4">Devise</th>
                  <th className="p-4">Date de dernière VL</th>
                </tr>
              </thead>
              <tbody>
                {funds.slice(0, 5).map((fund, index) => (
                  <tr key={index} className="text-center bg-white border-b border-gray-200">
                    <td className="p-4">{fund.nom_fond}</td>
                    <td className="p-4">{fund.code_ISIN}</td>
                    <td className="p-4">{fund.categorie_national}</td>
                    <td className="p-4">{fund.dev_libelle}</td>
                    <td className="p-4">{fund.datejour}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
