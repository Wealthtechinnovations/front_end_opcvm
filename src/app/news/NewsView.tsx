"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import Header from '@/components/layout/Header';
import { urlconstant, urlconstantimage } from "@/lib/constants";

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
                console.error('Erreur lors de l\'appel à l\'API :', error);
            }
        };
        fetchData();
    }, []);

    return (
        <Fragment>
            <Header />

            <div style={{ background: 'linear-gradient(135deg, #F8F9FB 0%, #EBF0F5 50%, #F0F2F5 100%)', minHeight: '80vh', padding: '48px 24px' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    {/* Page header */}
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#B8860B', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Actualit&eacute;s
                        </span>
                        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#1B3A5C', marginTop: '8px', marginBottom: '12px', fontFamily: 'Inter, sans-serif' }}>
                            Les derni&egrave;res nouvelles
                        </h1>
                        <p style={{ fontSize: '16px', color: '#4A5568', maxWidth: '500px', margin: '0 auto' }}>
                            Restez inform&eacute; avec les derni&egrave;res actualit&eacute;s et analyses de la communaut&eacute; financi&egrave;re africaine.
                        </p>
                    </div>

                    {/* News grid */}
                    {actualites.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                            {actualites.map((actualite, index) => (
                                <article key={index} style={{
                                    background: 'white',
                                    borderRadius: '12px',
                                    border: '1px solid #E2E8F0',
                                    overflow: 'hidden',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                                    transition: 'box-shadow 0.2s, transform 0.2s',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}>
                                    {actualite.image && (
                                        <div style={{ height: '200px', overflow: 'hidden', borderBottom: '1px solid #E2E8F0' }}>
                                            <img
                                                src={`${urlconstantimage}/${actualite.image}`}
                                                alt="Image actualité"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </div>
                                    )}
                                    <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                            <div style={{
                                                width: '36px', height: '36px', borderRadius: '50%',
                                                background: '#EBF0F5', display: 'flex', alignItems: 'center',
                                                justifyContent: 'center', fontSize: '14px', fontWeight: 600, color: '#1B3A5C',
                                            }}>
                                                {actualite.username?.charAt(0)?.toUpperCase() || 'F'}
                                            </div>
                                            <div>
                                                <p style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A2E', margin: 0 }}>{actualite.username}</p>
                                                <p style={{ fontSize: '12px', color: '#8896A6', margin: 0 }}>{actualite.date}</p>
                                            </div>
                                            {actualite.type && (
                                                <span style={{
                                                    marginLeft: 'auto', fontSize: '11px', fontWeight: 600,
                                                    color: '#B8860B', background: 'rgba(184,134,11,0.08)',
                                                    padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase',
                                                }}>
                                                    {actualite.type}
                                                </span>
                                            )}
                                        </div>
                                        <p style={{ fontSize: '14px', color: '#4A5568', lineHeight: 1.7, flex: 1 }}>
                                            {actualite.description}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '60px 24px' }}>
                            <p style={{ fontSize: '16px', color: '#8896A6' }}>Aucune actualit&eacute; pour le moment.</p>
                        </div>
                    )}
                </div>
            </div>
        </Fragment>
    );
}
