"use client";
import { urlconstant } from "@/app/constants";

import Link from "next/link";
import { ChangeEvent, Fragment, useEffect, useState } from "react";


import Select, { SingleValue } from 'react-select';
//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
//import { router } from 'next/router';
import Headermenu from '../../../Headermenu';
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Sidebar from "@/app/sidebar";

interface FormData {
    date: string;
    mois: string;
    annee: string;
    typedoc: string;
    societe: string;
    objet: string;
    fond_id: number;
    fond: string;
    fichier: File | null; // Modification de la propriété fichier pour accepter File ou null
}

// Initialisez le formulaire avec les valeurs initiales
const initialFormData: FormData = {
    date: '',
    mois: '',
    annee: '',
    typedoc: '',
    societe: '',
    objet: '',
    fond: '',
    fond_id: 0,
    fichier: null, // Définir le fichier initial comme null
};
interface Pays {
    value: string; // ou un type spécifique pour les éléments du tableau 'funds'

}


interface Option {
    value: string;
    label: string;
    // Autres propriétés si nécessaire
}
async function getpays() {
    const data = (
        await fetch(`${urlconstant}/api/getPays`)
    ).json();
    return data;
}
async function getregulateur(selectedPays: any) {
    const data = (
        await fetch(`${urlconstant}/api/getRegulateur?pays=${selectedPays}`)
    ).json();
    return data;
}
async function getdevise(selectedPays: any) {
    const data = (
        await fetch(`${urlconstant}/api/getDevise?pays=${selectedPays}`)
    ).json();
    return data;
}
interface PageProps {
    searchParams: {
        id: any
    };
}
async function getFonds(id: string) {
    const data = (

        await fetch(`${urlconstant}/api/getfondbysociete/${id}`, {
            method: 'GET', // Assurez-vous que la méthode HTTP correspond à votre API
        })
    ).json();
    return data;
}

type OptionType = { value: string; label: string };

export default function Reporting(props: PageProps) {

    const router = useRouter();
    const [selectedFund, setSelectedFund] = useState(null);
    const [fundsOptions, setFundsOptions] = useState([]);
    const [selectedOptions1, setSelectedOptions1] = useState<SingleValue<Option> | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);



    const [optionsPays, setOptionsPays] = useState([]);
    const [regulateurOptions, setRegulateurOptions] = useState([]);
    let response: globalThis.Response;

    const societeconneted = props.searchParams.id;
    useEffect(() => {
        async function fetchData() {
            try {
                const data1 = await getFonds(societeconneted);

                const mappedOptions = data1?.data?.funds.map((funds: any) => ({
                    value: funds.id,
                    label: funds.test
                }));

                setFundsOptions(mappedOptions); // Mettre à jour l'état avec les données récupérées
            } catch (error) {
                console.error("Erreur lors de la récupération des données :", error);
            }
        }
        fetchData(); // Appel à fetchData() lors du premier rendu
    }, []);

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        // Assurez-vous que target.files est de type FileList ou null
        const file = e.target.files?.[0]; // Utilisation de l'opérateur de chaînage optionnel pour éviter les erreurs si files est null
        if (file) {
            setFormData({ ...formData, fichier: file });
        }
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
    
        const formData = {
            selectedOptions1: selectedOptions1?.value || "",
            managerComments: managerComments || "",
            selectedMonth: selectedMonth?.value || "",
            selectedYear: selectedYear?.value || ""
        };
    
        try {
            const response = await fetch(`${urlconstant}/api/reportingmensuelle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'filled_template.docx'); // Nom du fichier à télécharger
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
    
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    html: `<p>Fichier téléchargé avec succès.</p>`,
                    showConfirmButton: false,
                    timer: 5000,
                });
            } else {
                console.error('Erreur lors du téléchargement :', response.statusText);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    html: `<p>Erreur lors du téléchargement du fichier</p>`,
                    showConfirmButton: false,
                    timer: 10000,
                });
            }
        } catch (error) {
            console.error('Erreur lors de la soumission du formulaire :', error);
            Swal.fire({
                position: 'center',
                icon: 'error',
                html: `<p>Erreur lors de la soumission</p>`,
                showConfirmButton: false,
                timer: 10000,
            });
        }
    };
    
    



    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [managerComments, setManagerComments] = useState('');
    const [selectedMonth, setSelectedMonth] = useState<OptionType | null>(null);
    const [selectedYear, setSelectedYear] = useState<OptionType | null>(null);
    const monthOptions = [
        { value: '01', label: 'Janvier' },
        { value: '02', label: 'Février' },
        { value: '03', label: 'Mars' },
        { value: '04', label: 'Avril' },
        { value: '05', label: 'Mai' },
        { value: '06', label: 'Juin' },
        { value: '07', label: 'Juillet' },
        { value: '08', label: 'Août' },
        { value: '09', label: 'Septembre' },
        { value: '10', label: 'Octobre' },
        { value: '11', label: 'Novembre' },
        { value: '12', label: 'Décembre' },
    ];

    const yearOptions = [
        { value: '2021', label: '2021' },
        { value: '2022', label: '2022' },
        { value: '2023', label: '2023' },
        { value: '2024', label: '2024' },
        { value: '2025', label: '2025' },
        { value: '2026', label: '2026' },
    ];



    return (



        < Fragment >
        <div className="flex bg-gray-100">
          <Sidebar societeconneted={societeconneted} />
          <div className="flex-1 ml-64">
            <Headermenu />
  
  
            <div className="content-wrapper2">
              <div className="container-full">
                {/* Main content */}
                <section className="content">
                  <div className="row">
                  <div className="col-xl-12 mb-4">
                    <div className="card text-center shadow-lg border-0 rounded-lg overflow-hidden">
                      <div className="card-body bg-gradient-to-b from-white to-blue-200 text-white p-5">
                        <img src="/images/avatar/avatar-13.png" className="bg-light rounded-circle avatar-lg img-thumbnail border-4 border-white mb-3" alt="profile-image" />
                        <h4 className="mb-0 mt-2 font-bold text-black-50">{societeconneted}</h4>

                      
                      </div>
                    </div>
                  </div>
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
                                            <p><span className="text-primary">Imprimer un document</span> | <span className="text-fade"></span></p>

                                        </div>

                                    </div>
                                    <hr />
                                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                                        <div className="col-12">
                                            <label htmlFor="select">Fonds (Nom/ISIN) :</label>
                                            <Select className="select-component"
                                                id="select"
                                                options={fundsOptions}
                                                isSearchable
                                                value={selectedOptions1}
                                                onChange={(newValue, actionMeta) => setSelectedOptions1(newValue)}
                                            />
                                        </div>
                                        <br />
                                        <div className="col-12">
                                            <label htmlFor="comments">Commentaires du gérant :</label>
                                            <textarea
                                                id="comments"
                                                className="form-control"
                                                value={managerComments}
                                                onChange={(e) => setManagerComments(e.target.value)}
                                            />
                                        </div>
                                        <br />
                                        <div className="row">
                                            <div className="col-6">
                                                <label htmlFor="select-month">Mois :</label>
                                                <Select
                                                    className="select-component"
                                                    id="select-month"
                                                    options={monthOptions}
                                                    isSearchable
                                                    value={selectedMonth}
                                                    onChange={(newValue, actionMeta) => setSelectedMonth(newValue)}
                                                />
                                            </div>
                                            <br />

                                            <div className="col-6">
                                                <label htmlFor="select-year">Année :</label>
                                                <Select
                                                    className="select-component"
                                                    id="select-year"
                                                    options={yearOptions}
                                                    isSearchable
                                                    value={selectedYear}
                                                    onChange={(newValue, actionMeta) => setSelectedYear(newValue)}
                                                />
                                            </div>
                                        </div>

                                        <br />

                                        <div className="col-12 text-center">
                                            <button type="submit" className="btn btn-primary">Imprimer</button>
                                        </div>
                                    </form>


                                </div>
                            </div>
                        </div>
                        </div>
                    </section >
                </div >
            </div >
            </div>
            </div>
        </Fragment >
    );
}