"use client";
import { urlconstant } from "@/lib/constants";

import Link from "next/link";
import { Fragment, SetStateAction, useEffect, useState } from "react";
import Select from 'react-select';


//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';

import { useRouter } from 'next/navigation';
import { useUserId } from '@/hooks/useUserId';
import Sidebar from '@/components/layout/InvestorSidebar';
import Headermenu from '@/components/layout/HeaderMenu';

const options = [
  { value: 1, label: 'Option 1' },
  { value: 2, label: 'Option 2' },
  { value: 3, label: 'Option 3' },
  // Ajoutez plus d'options au besoin
];

interface Pays {
  value: any[]; // ou un type spécifique pour les éléments du tableau 'funds'

}


interface Option {
  value: string;
}
export default function Ajoutportefeuille() {
  const router = useRouter();
  const id = useUserId();


  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDescriptionChange = (e: { target: { value: any; }; }) => {
    const inputValue = e.target.value;

    if (inputValue.length <= 50) {
      setFormData({ ...formData, description: inputValue });
    } else {
      // Tronquer le texte à 50 caractères
      setFormData({ ...formData, description: inputValue.slice(0, 50) });
    }
  };

  const [formData, setFormData] = useState({
    page: 1,
    nom: '',
    description: '',

    userid: '',




  });



  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {

      formData.userid = id;



      // Envoyer les données du formulaire à l'API
      const response = await fetch(`${urlconstant}/api/postsimulation`, {
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
          const href = `/panel/investor/robot-advisor`;

          router.push(href);
        }, 2000);
      }

    } catch (error) {
      // Gérer les erreurs de l'API (par exemple, afficher une erreur)
      console.error('Erreur lors de la soumission du formulaire :', error);
    }
  };

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
            <div className="col-12">
              <div className="box ">
                <div className="box-body">
                  <div className="d-md justify-content-between align-items-center">
                    <div className="panel-heading p-b-0">
                      <div className="row row-no-gutters">
                        <div className="col-lg-12  text-center-xs p-t-1">
                          <h3>
                            <span className="produit-type">Nouvelle simulation </span> -       &nbsp;&nbsp;&nbsp;                     <strong></strong> -                        {' '}
                            <small></small>{' '} &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                          </h3>
                        </div>

                        <div className="col-lg-2 col-md-2 col-sm-3 col-xs-12 text-center p-l-1 p-t-1" data-toggle="tooltip" data-placement="top" data-original-title="" title="">
                          <div style={{ display: 'inline-block' }} title="42 / 100 au 31/08/2023">
                            <div className="spritefonds sprite-3g icon-med" style={{ display: 'inline-block' }}></div>
                            <div className="notation-appix">

                            </div>
                          </div>
                        </div>


                      </div>
                    </div>
                    <div>
                      <p><span className="text-primary">Simulation</span> | <span className="text-fade"></span></p>

                    </div>

                  </div>
                  <hr />
                  <form onSubmit={handleSubmit}>
                    <div className="text-center">
                      <div className="col-md-6 mx-auto">
                        <label>
                          Nom*:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="nom"
                          value={formData.nom}
                          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="col-md-6 mx-auto">
                        <label>
                          Description:
                        </label>

                        <textarea
                          className="form-control  h-250"
                          name="description"
                          value={formData.description}
                          onChange={handleDescriptionChange}

                          // onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                          required
                        />
                      </div>
                    </div>


                    <br />
                    <button style={{
                      textDecoration: 'none', // Remove underline
                      backgroundColor: '#6366f1', // Background color
                      color: 'white', // Text color
                      padding: '10px 20px', // Padding
                      borderRadius: '5px', // Rounded corners
                    }} >Enregistrer</button>





                    {/* Ajoutez les autres pages ici */}

                  </form>

                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      </div >
      </div >
    </Fragment >
  );
}