"use client";
import { urlconstant } from "@/app/constants";

import Link from "next/link";
import { Fragment, SetStateAction, useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import { useUserId } from '@/hooks/useUserId';
import Sidebar from "@/app/sidebarportefeuille";
import Headermenu from "@/app/Headermenu";
import Select from 'react-select';
//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import Header from "@/app/Header";

import Swal from 'sweetalert2';

async function getPortefeuille(selectedValues: any) {
  const data = (

    await fetch(`${urlconstant}/api/getsimulationportefeuillebyuser/${selectedValues}`, {
      method: 'GET', // Assurez-vous que la méthode HTTP correspond à votre API
    })
  ).json();
  return data;
}
async function getlastvl1() {
  const data = (
    await fetch(`${urlconstant}/api/searchFunds`)
  ).json();
  return data;
}

const options = [
  { value: 1, label: 'Option 1' },
  { value: 2, label: 'Option 2' },
  { value: 3, label: 'Option 3' },
  // Ajoutez plus d'options au besoin
];

interface Pays {
  value: any[]; // ou un type spécifique pour les éléments du tableau 'portefeuile'

}
interface Funds {
  data: {
    nom_portefeuille: any
    valorisation: any
    valorisation_robo: any
    simulations: any[]; // ou un type spécifique pour les éléments du tableau 'portefeuille'
  };
}

const min = 1;
const max = 200;
interface Option {
  value: string;
  label: string;
}
interface MyDataType {
  name: any;
  y: any;
  InRef?: any;
  // Autres propriétés
}

export default function PorteFeuile() {
  const searchParams = useSearchParams();
  const id = useUserId();
  const selectedfunds = searchParams.get('selectedfund');

  useEffect(() => {
    Highcharts.setOptions({
      credits: {
        enabled: false
      }
    });
  }, [id]);
  const selectedportfeuille = searchParams.get('simulation');
  const [portefeuille, setPortefeuille] = useState<Funds | null>(null);
  const [isOpen, setIsOpen] = useState(false);


  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

  const [selectedRows, setSelectedRows] = useState<string[]>([]); // Tableau pour stocker les lignes sélectionnées
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = (e: any) => {
    e.preventDefault();
    // Effectuez votre recherche ici si nécessaire
  };





  useEffect(() => {
    // Appel à l'API lors du premier rendu du composant
    async function fetchData() {
      try {
        Swal.fire({
          title: 'Veuillez patienter',
          html: 'Chargement des résultats en cours...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        const data = await getPortefeuille(selectedportfeuille);
        setPortefeuille(data);

        const data1 = await getlastvl1();
        const mappedOptions = data1?.data.funds.map((funds: any) => ({
          value: funds.value,
          label: funds.label,
        }));






        Swal.close(); // Close the loading popup

      } catch (error) {
        Swal.close(); // Close the loading popup

        console.error("Erreur lors de l'appel à l'API :", error);
      }
    }

    fetchData();
  }, [selectedportfeuille]); // Assurez-vous que les dépendances du useEffect sont correctement gérées.




  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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
            {isModalOpen && (
              <div className="modal">
                {/* Modal content */}
                <div className="modal-content">
                  <p>Form submitted successfully!</p>
                  {/* You can add any content or message you want here */}
                </div>
              </div>
            )}

            <br />
            <div className="col-12">

              <div className="box">
                <div className="box-body pb-lg-0">

                  <div className="d-md-flex justify-content-between align-items-center">
                    <div>
                      <br />
                      <p><span className="text-primary">Portefeuille</span> | <span className="text-fade"></span></p>
                    </div>

                  </div>
                  <div className="row">



                  </div>    {portefeuille?.data?.simulations !== null ?
                    <div className="text-right">  <Link
                      href={{
                        pathname: '/portefeuille/robotadvisor/portefeuillerobot/roboadvisor',
                        query: { simulation: selectedportfeuille }, // Passer les éléments sélectionnés comme paramètres de requête
                      }}
                      /*  as={`/about/${selectedRows ? selectedRows.join(',') : ''}`}
                        key={selectedRows.join(',')}*/
                      style={{
                        textDecoration: 'none',
                        backgroundColor: '#6366f1',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '5px',
                      }}
                    >
                      Appliquer le Robot advisor
                    </Link></div>
                    : <p></p>}<br />



                </div>


              </div>
              {portefeuille?.data?.simulations?.map((data, index) => (
                <div key={index} className="box pull-up">
                  <div className="box-body">
                    <div className="d-md-flex justify-content-between align-items-center">
                      <div>
                        <p><span className="text-primary">{data.nom}</span> </p>
                      </div>
                      <div className="mt-10 mt-md-0">

                      </div>
                    </div>
                    <hr />
                    <div className="d-md-flex justify-content-between align-items-center">
                      <div className="d-flex justify-content-start align-items-center">
                        <div className="min-w-100">
                          <p className="mb-0 text-fade">Fonds</p>
                          <h6 className="mb-0">{data.fond_ids}</h6>
                        </div>
                        <div className="mx-lg-50 mx-20 min-w-70">
                          <p className="mb-0 text-fade">Poids</p>
                          <h6 className="mb-0 text-success">{data.poids}</h6>



                        </div>


                      </div>
                      <div className="mt-10 mt-md-0">

                      </div>
                    </div>
                  </div>
                </div>
              ))}


            </div>
          </section>
        </div>
      </div>
      </div >
      </div >
    </Fragment >
  );
}