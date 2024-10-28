"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import Header from '../Header';
import { urlconstant, urlconstantimage } from "@/app/constants";
import { useRouter } from 'next/navigation';
import Swal from "sweetalert2";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import Head from "next/head";

async function getactualite() {
    const data = await fetch(`${urlconstant}/api/getactualite`, {
        method: 'GET',
    }).then((res) => res.json());
    return data;
}

interface Actualite {
    date: string;
    description: string;
    image: string;
    type: string;
    username: string;
}

export default function Accueil() {
    const [actualites, setActualites] = useState<Actualite[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const data8 = await getactualite();
                setActualites(data8);
            } catch (error) {
                console.error('Erreur lors de l’appel à l’API :', error);
            }
        };
        fetchData();
    }, []);

    const router = useRouter();

    return (
        <Fragment>
            <Header />
            <Head>
                <title>Opcvm Afrique: Guide Complet</title>
                <meta name="description" content="Découvrez notre sélection d'Opcvm en Afrique pour optimiser votre portefeuille d'investissement." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            {/* Section Actualités */}
            <div className="bg-gradient-to-br from-blue-50 via-white to-gray-100 min-h-screen py-10">
                <div className="container">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-700 mb-3">Les Actualités</h1>
                        <p className="text-lg text-gray-600">Restez informé avec les dernières nouvelles et annonces de notre communauté.</p>
                    </div>

                    {/* Boucle pour afficher les actualités */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {actualites.map((actualite, index) => (
                            <div key={index} className="p-6 border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                                <div className="d-flex align-items-center mb-4">
                                    <img className="rounded-circle bg-light" src="/images/avatar/avatar-1.png" alt="Avatar" height="50" width="50" />
                                    <div className="ml-3">
                                        <h5 className="text-lg font-semibold text-gray-800">{actualite.username}</h5>
                                        <p className="text-gray-500 text-sm"><i className="fa fa-clock"></i> {actualite.date}</p>
                                    </div>
                                </div>
                                <p className="text-gray-700 mb-4">{actualite.description}</p>
                                {actualite.image && (
                                    <img className="img-fluid rounded-lg mb-4" src={`${urlconstantimage}/${actualite.image}`} alt="Image" style={{ maxHeight: "300px", maxWidth: "100%" }} />
                                )}
                                <div className="flex justify-between items-center">
                                    <button className="btn btn-outline-primary btn-sm px-4 rounded-full">J aime</button>
                                    <button className="btn btn-outline-secondary btn-sm px-4 rounded-full">Commenter</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bouton Charger plus */}
                    <div className="text-center mt-12">
                        <button className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-full shadow-md hover:bg-blue-600 transition-all duration-300">
                            Charger plus
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
