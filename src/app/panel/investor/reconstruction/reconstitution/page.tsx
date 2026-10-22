"use client";
import { urlconstant } from "@/lib/constants";
import axios from 'axios';
import Link from "next/link";
import { Fragment, JSXElementConstructor, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import Select from 'react-select';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserId } from '@/hooks/useUserId';
import Swal from 'sweetalert2';

//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import Header from '@/components/layout/Header';
import Headermenu from '@/components/layout/HeaderMenu';
import Sidebar from '@/components/layout/InvestorSidebar';


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
    portefeuille: any[]; // ou un type spécifique pour les éléments du tableau 'portefeuille'
  };
}
interface Portefeuillepropose {
  data: {
    filteredPortfolios: any[]; // ou un type spécifique pour les éléments du tableau 'portefeuille'
  };
}
async function getlastvl1() {
  const response = await fetch(`${urlconstant}/api/searchFunds`);
  if (!response.ok) return [];
  return response.json();
}
interface Option {
  value: number;
  label: string
}
export default function Reconstitution() {
  const searchParams = useSearchParams();
  const id = useUserId();

  const selectedfundsRaw = searchParams.get('selectedfund');
  const selectedportfeuille = searchParams.get('portefeuille');
  const router = useRouter();

  // Safe parse: handle JSON arrays, comma-separated strings, and null
  const selectedfunds = selectedfundsRaw || '';

  const [portefeuille, setPortefeuille] = useState<Funds | null>(null);
  const [portefeuillepropose, setPortefeuillepropose] = useState<Portefeuillepropose | null>(null);
  const nextPage = () => {
    setFormData({ ...formData, page: formData.page + 1 });
  };
  const [entries, setEntries] = useState([
    { date: '', montantInvesti: 0, fondId: 0, portefeuilleselect: null },
  ]);
  const prevPage = () => {
    setFormData({ ...formData, page: formData.page - 1 });
  };

  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]); // Tableau pour stocker les lignes sélectionnées
  const [selectedFunds, setSelectedFunds] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const [formData, setFormData] = useState({
    page: 1,
    minReturn: '',
    maxReturn: '',
    minVolatility: '',
    maxVolatility: '',
    totalInvestment: '',
    date: '',

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
        setSelectedOptions(mappedOptions);
        let selectedFundsArray: any[] = [];
        try {
          let parsed = JSON.parse(selectedfunds);
          if (typeof parsed === 'string') {
            try { parsed = JSON.parse(parsed); } catch {}
          }
          selectedFundsArray = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          selectedFundsArray = selectedfunds.split(',').filter(Boolean);
        }
        setSelectedFunds(selectedFundsArray);


      } catch (error) {
        console.error("Erreur lors de l'appel à l'API :", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const initialEntries = selectedFunds.map(fundId => ({
      date: '',
      montantInvesti: 0,
      fondId: fundId,
      portefeuilleselect: selectedportfeuille
    }));
    setEntries(initialEntries);
  }, [selectedFunds]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const hasEmptyDate = entries.some(entry => !entry.date);
    const hasZeroAmount = entries.some(entry => !entry.montantInvesti || entry.montantInvesti <= 0);

    if (hasEmptyDate || hasZeroAmount) {
      Swal.fire('Champs requis', 'Veuillez remplir la date et le montant pour chaque fonds.', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      Swal.fire({
        title: 'Veuillez patienter',
        html: 'Enregistrement en cours...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const response = await fetch(`${urlconstant}/api/reconstitution`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entries),
      });

      const data = await response.json();

      if (data.code === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Reconstitution effectuée',
          text: 'Le portefeuille a été reconstitué avec succès.',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          router.push(`/panel/investor/reconstruction?selectedValuename=${encodeURIComponent(searchParams.get('selectedValuename') || '')}&selectedfund=${encodeURIComponent(selectedfunds)}&portefeuille=${selectedportfeuille}`);
        });
      } else {
        Swal.fire('Erreur', data.message || 'Une erreur est survenue.', 'error');
      }
    } catch (error) {
      Swal.fire('Erreur', 'Impossible de contacter le serveur.', 'error');
      console.error('Erreur lors de la soumission du formulaire :', error);
    } finally {
      setIsSubmitting(false);
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
                      <p><span className="text-primary">Reconstitution</span> | <span className="text-fade"></span></p>

                    </div>
                    {/*   <div className="text-right">
                      <button style={{
                        textDecoration: 'none', // Remove underline
                        backgroundColor: '#1B3A5C', // Background color
                        color: 'white', // Text color
                        padding: '10px 20px', // Padding
                        borderRadius: '5px', // Rounded corners
                      }} onClick={addEntry}>Ajouter une ligne</button>
                    </div>*/}

                  </div>
                  <hr />


                  <div>
                    <form onSubmit={handleSubmit}>
                      {entries.map((entry, index) => (
                        <div key={index} className="form-entry">
                          <div className="row">
                            <div className="col-4">
                              <label>Date</label>
                              <input
                                className="form-control"
                                type="date"
                                value={entry.date}
                                onChange={(e) => {
                                  const updatedEntries = [...entries];
                                  updatedEntries[index].date = e.target.value;
                                  setEntries(updatedEntries);
                                }}
                              /></div>
                            <div className="col-4">
                              <label>Montant investi</label>
                              <input
                                type="number"
                                className="form-control"

                                value={entry.montantInvesti}
                                onChange={(e) => {
                                  const updatedEntries = [...entries];
                                  updatedEntries[index].montantInvesti = parseInt(e.target.value);
                                  setEntries(updatedEntries);
                                }}
                              /></div>
                            <div className="col-4">
                              <label>Fonds</label>
                              <Select
                                className="form-control select-component"
                                options={selectedOptions}
                                value={selectedOptions.find(option => option.value === (entry?.fondId !== null ? parseInt(entry.fondId.toString(), 10) : null))}
                                onChange={(selectedOption) => {
                                  const updatedEntries = [...entries];
                                  if (selectedOption) {
                                    updatedEntries[index].fondId = parseInt(selectedOption.value.toString(), 10); // Utilisez la valeur de l'option
                                  } else {
                                    // Faites quelque chose en cas de selectedOption null (par exemple, attribuer une valeur par défaut)
                                  }
                                  setEntries(updatedEntries);
                                }}
                              />
                            </div>
                            { /* <div className="col-2">
                              <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                              <button style={{
                                textDecoration: 'none', // Remove underline
                                backgroundColor: '#ef4444', // Background color
                                color: 'white', // Text color
                                padding: '10px 20px', // Padding
                                borderRadius: '5px', // Rounded corners
                              }} onClick={() => removeEntry(index)}>Supprimer</button>
                            </div>*/}

                          </div>

                        </div>
                      ))}


                      <div className="text-center">
                        <button type="submit" style={{
                          textDecoration: 'none',
                          backgroundColor: '#1B3A5C',
                          color: 'white',
                          padding: '10px 20px',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          border: 'none',
                        }}>Calculer la valorisation</button>

                      </div>
                    </form>

                  </div>
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