"use client";

import { Fragment, useEffect, useState } from "react";
import Header from '@/components/layout/Header';
import { urlconstant, urlsite } from "@/lib/constants";
import { useRouter } from 'next/navigation';
import SEO from '@/components/common/SEO';
import { breadcrumbSchema } from '@/utils/structuredData';
import Swal from "sweetalert2";

export default function Accueil() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        description: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch(`${urlconstant}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await res.json();
            if (result.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Message envoyé',
                    text: 'Votre message a bien été transmis. Nous reviendrons vers vous rapidement.',
                    confirmButtonColor: '#1B3A5C',
                    timer: 4000,
                    showConfirmButton: false,
                });
                setFormData({ name: '', email: '', description: '' });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: 'Impossible d’envoyer le message. Veuillez réessayer.',
                    confirmButtonColor: '#1B3A5C',
                });
            }
        } catch {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Impossible de contacter le serveur. Veuillez réessayer plus tard.',
                confirmButtonColor: '#1B3A5C',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Fragment>
            <SEO
                title="Contact - Fundafrique"
                description="Contactez l&apos;équipe Fundafrique pour toute question sur les OPCVM en Afrique et l&apos;investissement dans les fonds africains."
                keywords="contact, Fundafrique, OPCVM, Afrique"
                canonicalUrl={`${urlsite}/contact`}
                structuredData={breadcrumbSchema([
                    { name: 'Accueil', url: `${urlsite}/accueil` },
                    { name: 'Contact', url: `${urlsite}/contact` },
                ])}
            />
            <Header />

            <div style={{ background: 'linear-gradient(135deg, #F8F9FB 0%, #EBF0F5 50%, #F0F2F5 100%)', minHeight: '80vh', padding: '60px 24px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    {/* Page title */}
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#1B3A5C', marginBottom: '12px', fontFamily: 'Inter, sans-serif' }}>
                            Nous contacter
                        </h1>
                        <p style={{ fontSize: '16px', color: '#4A5568', maxWidth: '500px', margin: '0 auto' }}>
                            Une question, un partenariat, ou besoin d&apos;assistance ? Notre &eacute;quipe est &agrave; votre &eacute;coute.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                        {/* Contact form */}
                        <div style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '32px',
                            border: '1px solid #E2E8F0',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1B3A5C', marginBottom: '24px' }}>
                                Envoyez-nous un message
                            </h2>
                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4A5568', marginBottom: '6px' }}>
                                        Nom complet
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        style={{
                                            width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0',
                                            borderRadius: '8px', fontSize: '14px', outline: 'none',
                                            transition: 'border-color 0.2s', fontFamily: 'Inter, sans-serif',
                                        }}
                                    />
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4A5568', marginBottom: '6px' }}>
                                        Adresse email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        style={{
                                            width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0',
                                            borderRadius: '8px', fontSize: '14px', outline: 'none',
                                            transition: 'border-color 0.2s', fontFamily: 'Inter, sans-serif',
                                        }}
                                    />
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4A5568', marginBottom: '6px' }}>
                                        Message
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={5}
                                        required
                                        style={{
                                            width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0',
                                            borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical',
                                            fontFamily: 'Inter, sans-serif',
                                        }}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    style={{
                                        width: '100%', padding: '12px', backgroundColor: '#1B3A5C', color: 'white',
                                        border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600,
                                        cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1,
                                        transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
                                    }}
                                >
                                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                                </button>
                            </form>
                        </div>

                        {/* Contact info */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {[
                                {
                                    icon: '📍',
                                    title: 'Localisation',
                                    content: 'Abidjan, Cocody, Riviera Palmeraie\nImmeuble Gold Africa\nCôte d’Ivoire',
                                },
                                {
                                    icon: '📞',
                                    title: 'Téléphone',
                                    content: '(+225) 25 21 00 61 21',
                                },
                                {
                                    icon: '✉️',
                                    title: 'Email',
                                    content: 'contact@chainsolutions.fr',
                                },
                            ].map((info, idx) => (
                                <div key={idx} style={{
                                    background: 'white',
                                    borderRadius: '12px',
                                    padding: '24px',
                                    border: '1px solid #E2E8F0',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                                    flex: 1,
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                        <span style={{
                                            width: '44px', height: '44px', borderRadius: '10px',
                                            background: '#EBF0F5', display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', fontSize: '20px', flexShrink: 0,
                                        }}>
                                            {info.icon}
                                        </span>
                                        <div>
                                            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1B3A5C', margin: '0 0 6px' }}>
                                                {info.title}
                                            </h3>
                                            <p style={{ fontSize: '14px', color: '#4A5568', margin: 0, lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                                                {info.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Availability info */}
                            <div style={{
                                background: 'linear-gradient(135deg, #1B3A5C, #2A5A8C)',
                                borderRadius: '12px',
                                padding: '24px',
                                color: 'white',
                                flex: 1,
                            }}>
                                <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 8px', color: '#D4A843' }}>
                                    Horaires
                                </h3>
                                <p style={{ fontSize: '14px', margin: 0, lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}>
                                    Lundi - Vendredi : 8h00 - 18h00 (GMT)<br />
                                    Samedi - Dimanche : Ferm&eacute;
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
