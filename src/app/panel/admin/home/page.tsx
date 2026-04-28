"use client";
import { urlconstant } from "@/app/constants";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import Select from 'react-select';
import Headermenu from "@/app/Headermenu";
import Sidebar from "@/app/sidebaradmin";
import PageHeader from "@/components/common/PageHeader";

const options = [
  { value: 1, label: 'Option 1' },
  { value: 2, label: 'Option 2' },
  { value: 3, label: 'Option 3' },
  // Ajoutez plus d'options au besoin
];

interface Pays {
  value: any[]; // ou un type spécifique pour les éléments du tableau 'funds'

}

async function getlastvl1() {

  const data = (
    await fetch(`${urlconstant}/api/searchFunds`)
  ).json();
  return data;
}
interface Option {
  value: string;
}
export default function Profile() {
  const [id, setId] = useState<string>('');
  useEffect(() => {
    const stored = localStorage.getItem('userId');
    if (stored) setId(stored);
  }, []);

  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [fundsOptions, setFundsOptions] = useState([]);

  const [selectedFund, setSelectedFund] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPays, setSelectedPays] = useState<Pays | null>(null);
  const [selectedRegulateur, setSelectedRegulateur] = useState(null);
  const [optionsPays, setOptionsPays] = useState([]);
  const [regulateurOptions, setRegulateurOptions] = useState([]);
  let response: globalThis.Response;
  const handleSearch = (e: any) => {
    e.preventDefault();
    // Effectuez votre recherche ici si nécessaire
  };


  const handleFundSelect = (selectedOption: any) => {
    setSelectedFund(selectedOption);
  };
  const [formData, setFormData] = useState({
    page: 1,
    nomDuportefeuille: '',
    Description: '',
    funds: '',
    fundids: ''

  });

  useEffect(() => {
    // Appel à l'API lors du premier rendu du composant
    async function fetchData() {
      try {

        const data1 = await getlastvl1();

        const mappedOptions = data1?.data.funds.map((funds: any) => ({

          value: funds.value,
          label: funds.label, // Replace with the actual property name
          // Replace with the actual property name
        }));
        setFundsOptions(mappedOptions);
      } catch (error) {
        console.error("Erreur lors de l'appel à l'API :", error);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      // Envoyer les données du formulaire à l'API
      const response = await fetch(`${urlconstant}/api/postportefeuille`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Spécifiez le type de contenu que vous envoyez
        },
        body: JSON.stringify(formData), // Convertissez votre objet formData en JSON
      });
      // Gérer la réponse de l'API (par exemple, afficher un message de succès)

      if (response.status === 200) {



        setIsModalOpen(true);

        // Redirect the user to another page after a delay (e.g., 2 seconds)
        setTimeout(() => {
          Router.push('https://example.com/pagehome');
        }, 2000);
      }

    } catch (error) {
      // Gérer les erreurs de l'API (par exemple, afficher une erreur)
      console.error('Erreur lors de la soumission du formulaire :', error);
    }
  };

  return (



    < Fragment >
    <div className="flex bg-gray-100">
      <Sidebar id={id} />
      <div className="flex-1 ml-64">
        <Headermenu />
      <div className="content-wrapper2">
        {/* Main content */}
        <section className="content">
          <PageHeader
            title="Tableau de bord Admin"
            breadcrumbs={[
              { label: 'Admin', link: `/panel/admin/home` },
              { label: 'Accueil' },
            ]}
          />

        <div className="col-xl-12 col-lg-12 mb-4">
                    <div className="card text-center shadow-lg border-0 rounded-lg overflow-hidden">
                      <div className="card-body bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-500 text-white">
                        <img src="/images/avatar/avatar-13.png" className="bg-light rounded-circle avatar-lg img-thumbnail border-4 border-white mb-3" alt="profile-image" />
                        <h4 className="mb-0 mt-2">Admin</h4>



                        <ul className="social-list list-inline mt-3 mb-0">
                          <li className="list-inline-item">
                            <a href="#" className="btn btn-social-icon btn-circle text-white bg-facebook hover:bg-facebook-dark">
                              <i className="fa fa-facebook"></i>
                            </a>
                          </li>
                          <li className="list-inline-item">
                            <a href="#" className="btn btn-social-icon btn-circle text-white bg-twitter hover:bg-twitter-dark">
                              <i className="fa fa-twitter"></i>
                            </a>
                          </li>
                          <li className="list-inline-item">
                            <a href="#" className="btn btn-social-icon btn-circle text-white bg-google hover:bg-google-dark">
                              <i className="fa fa-google"></i>
                            </a>
                          </li>
                          <li className="list-inline-item">
                            <a href="#" className="btn btn-social-icon btn-circle text-white bg-instagram hover:bg-instagram-dark">
                              <i className="fa fa-instagram"></i>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
        </section>
      </div>
      </div>
      </div>
    </Fragment >
  );
}