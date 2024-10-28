"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import Select from 'react-select';
//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import Headermenu from '../../Headermenu';
import { urlconstant, urlstableconstant, API_KEY_STABLECOIN } from "@/app/constants";


const options = [
  { value: 1, label: 'Option 1' },
  { value: 2, label: 'Option 2' },
  { value: 3, label: 'Option 3' },
  // Ajoutez plus d'options au besoin
];

export default function Societegestionpanel() {
  useEffect(() => {
    // Appel à l'API lors du premier rendu du composant

  }, []);

  const [formData, setFormData] = useState({
    nom: '', // Champ "Nom"
    site: '', // Champ "Site"
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();


  };

  return (



    < Fragment >
      <Headermenu />

      <div className="content-wrapper2">
        <div className="container-full">
          {/* Main content */}
          <section className="content">

            <div className="col-12">
              <div className="box ">
                <div className="box-body">
                  <div className="d-md justify-content-between align-items-center">
                    <div className="panel-heading p-b-0">
                      <div className="row row-no-gutters">
                        <div className="col-lg-12  text-center-xs p-t-1">
                          <h3>
                            <span className="produit-type">Gestion des societés </span> -       &nbsp;&nbsp;&nbsp;                     <strong></strong> -                        {' '}
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
                      <p><span className="text-primary">Societe de gestion</span> | <span className="text-fade"></span></p>

                    </div>

                  </div>
                  <hr />
                  <form onSubmit={handleSubmit}>

                    <div>
                      <form>
                        <div className="row">
                          <div className="col-md-6">
                            <label>
                              Nom:
                              <input
                                type="text"
                                className="form-control"
                                name="nom"
                                value={formData.nom}
                                onChange={handleInputChange}
                                required
                              />
                            </label>
                          </div>
                          <div className="col-md-6">
                            <label>
                              Site:
                              <input
                                type="text"
                                className="form-control"
                                name="site"
                                value={formData.site}
                                onChange={handleInputChange}
                                required
                              />
                            </label>
                          </div>
                        </div>


                        {/* Ajoutez les autres champs ici */}
                      </form>
                      <br />



                      <div>

                        <br />

                        <button className="text-right" style={{
                          textDecoration: 'none', // Remove underline
                          backgroundColor: '#6366f1', // Background color
                          color: 'white', // Text color
                          padding: '10px 20px', // Padding
                          borderRadius: '5px', // Rounded corners
                        }} type="submit">Enregistrer</button>

                      </div>

                      {/* Ajoutez les autres pages ici */}
                    </div>

                  </form>

                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Fragment >
  );
}