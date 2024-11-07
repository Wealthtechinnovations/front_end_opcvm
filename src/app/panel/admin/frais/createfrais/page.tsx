"use client";
import { urlconstant } from "@/app/constants";

import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import Select from 'react-select';
import { useRouter } from 'next/navigation';

//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
//import { router } from 'next/router';
import Header from "@/app/Header";
import Swal from "sweetalert2";
import Headermenu from "@/app/Headermenu";
import Sidebar from "@/app/sidebaradmin";
interface Option {
  value: string; // or whatever type your value should be
  label: string; // other properties of your option object
}
const options = [
  { value: 1, label: 'Option 1' },
  { value: 2, label: 'Option 2' },
  { value: 3, label: 'Option 3' },
  // Ajoutez plus d'options au besoin
];

interface Pays {
  value: any[]; // ou un type spécifique pour les éléments du tableau 'funds'

}

interface Devise {
  value: string; // ou un type spécifique pour les éléments du tableau 'funds'

}

interface PageProps {
  searchParams: {
    fondId: number;
    id: any;
    fond: any
  };
}
export default function UpdateFonds(props: PageProps) {
  const fondId = props.searchParams.fondId;
  let id = props.searchParams.id;
  let fond = props.searchParams.fond;

  const [isModalOpen, setIsModalOpen] = useState(false);

  let response: globalThis.Response;
  const handleSearch = (e: any) => {
    e.preventDefault();
    // Effectuez votre recherche ici si nécessaire
  };


  const router = useRouter();


  const [formData, setFormData] = useState({
    fond_id: '',
    frais_transa_achat: '',
    frais_transa_vente: '',
  });

  const [fondsOptions, setFondsOptions] = useState<Option[]>([]);

  useEffect(() => {
    const fetchFonds = async () => {
      try {
        const response = await fetch(`${urlconstant}/api/searchFunds`);
        const result = await response.json();
        console.log(result);
        if (result.code === 200) {
          const options = result.data?.funds.map((fond: any) => ({
            value: fond.value,
            label: fond.label,
          }));
          setFondsOptions(options);
        } else {
          console.error('Failed to fetch fonds:', result.error);
        }
      } catch (error) {
        console.error('Error fetching fonds:', error);
      }
    };
    fetchFonds();
  }, []);


  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedOption: any) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      fond_id: selectedOption.value,
    }));
  };


  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      console.log(formData)
      const response = await fetch(`${urlconstant}/api/createfrais`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.code === 200) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          html: `<p> Votre réponse a été sauvegardée avec succès.</p>`,
          showConfirmButton: false,
          timer: 5000
        }),
          setTimeout(() => {
            router.push(`/panel/admin/frais?id=${id}`);
          }, 500)
      } else {
        console.error('Failed to create frais:', result.error);
      }
    } catch (error) {
      console.error('Error creating frais:', error);
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
                      <p><span className="text-primary">Creation </span> | <span className="text-fade">{fond}</span></p>

                    </div>

                  </div>
                  <hr />
                  <form onSubmit={handleSubmit}>
                    <div className="col-12">
                      <label>
                        Sélectionnez un fond:
                      </label>

                      <Select

                        options={fondsOptions}
                        onChange={handleSelectChange}
                        value={fondsOptions.find(option => option.value === formData.fond_id) as Option | undefined}
                      />
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <label>
                          Frais Transaction Achat:
                        </label>

                        <input
                          className="form-control"
                          type="number"
                          name="frais_transa_achat"
                          value={formData.frais_transa_achat}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-6">
                        <label>
                          Frais Transaction Vente:
                        </label>

                        <input
                          className="form-control"
                          type="number"
                          name="frais_transa_vente"
                          value={formData.frais_transa_vente}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <br />
                    <div className="text-center">
                      <button
                        type="submit"
                        style={{
                          textDecoration: 'none',
                          backgroundColor: '#6366f1',
                          color: 'white',
                          padding: '10px 20px',
                          borderRadius: '5px',
                        }}
                      >
                        Enregistrer
                      </button>
                    </div>

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