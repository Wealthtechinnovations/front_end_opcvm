"use client";
import { urlconstant } from "@/app/constants";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import Select from 'react-select';


//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
//import { router } from 'next/router';
import Header from '@/app/Header';
import Router from 'next/router';
import { magic } from "../../../../../magic";
import Headermenu from "@/app/Headermenu";
import Sidebar from "@/app/sidebaradmin";

const options = [
  { value: 1, label: 'Option 1' },
  { value: 2, label: 'Option 2' },
  { value: 3, label: 'Option 3' },
  // Ajoutez plus d'options au besoin
];

interface Pays {
  value: any[]; // ou un type spécifique pour les éléments du tableau 'funds'

}

interface PageProps {
  searchParams: {
    selectedfund: any;
    portefeuille: any;
    selectedValuename: any;
    id: any
  };
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
export default function Profile(props: PageProps) {
  let id = props.searchParams.id;

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
      console.log(formData);
      // Envoyer les données du formulaire à l'API
      const response = await fetch(`${urlconstant}/api/postportefeuille`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Spécifiez le type de contenu que vous envoyez
        },
        body: JSON.stringify(formData), // Convertissez votre objet formData en JSON
      });
      console.log(response);
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

          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Portefeuille</h5>
                <div className="card-actions float-end">
                  <div className="dropdown show">
                    <a href="#" data-bs-toggle="dropdown" data-bs-display="static">
                      <i className="align-middle" data-feather="more-horizontal"></i>
                    </a>
                    <div className="dropdown-menu dropdown-menu-end">
                      <a className="dropdown-item" href="#">
                        Action
                      </a>
                      <a className="dropdown-item" href="#">
                        Another action
                      </a>
                      <a className="dropdown-item" href="#">
                        Something else here
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="row g-0">
                  <div className="col-sm-3 col-xl-12 col-xxl-3 text-center">
                    <img
                      src="../../../images/avatar/avatar-3.png"
                      width="64"
                      height="64"
                      className="bg-light rounded-circle mt-2"
                      alt="Societe gestion"
                    />
                  </div>
                  <div className="col-sm-9 col-xl-12 col-xxl-9">
                    <strong>About me</strong>
                    <p className="text-fade">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                      eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                  </div>
                </div>

                <table className="table my-2">
                  <tbody>
                    <tr>
                      <th>Name</th>
                      <td className="text-fade">Test</td>
                    </tr>
                    <tr>
                      <th>Company</th>
                      <td className="text-fade">The Wiz</td>
                    </tr>
                    <tr>
                      <th>Email</th>
                      <td className="text-fade">angelica@ramos.com</td>
                    </tr>
                    <tr>
                      <th>Phone</th>
                      <td className="text-fade">+1234123123123</td>
                    </tr>
                    <tr>
                      <th>Status</th>
                      <td>
                        <span className="badge bg-success-light">Active</span>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <strong className="my-20 d-block">Activity</strong>

                <div className="activity-div">
                  {/* Aquí deberías agregar el código JSX para la sección de actividad */}
                </div>
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