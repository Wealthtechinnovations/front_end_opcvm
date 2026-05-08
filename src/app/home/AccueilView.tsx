"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import Header from '@/components/layout/Header';
import { urlsite } from "@/lib/constants";
import { useRouter } from 'next/navigation';
import SEO from '@/components/common/SEO';
import { organizationSchema, websiteSchema, breadcrumbSchema } from '@/utils/structuredData';

export default function Accueil() {
  const router = useRouter();
  const [userConnected, setUserConnected] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userId = localStorage.getItem('userId');
    if (isLoggedIn === 'true' && userId !== null) {
      setUserConnected(parseInt(userId, 10));
    }
  }, []);

  const solutions = [
    {
      num: '01', icon: '🔍', title: 'Recherche & Exploration',
      desc: 'Un moteur de recherche multi-critères pour constituer rapidement un univers de fonds investissable qualifié — par gérant, par pays, par classe d\'actif, par catégorie.',
      link: '/funds/search', linkText: 'Explorer les fonds',
    },
    {
      num: '02', icon: '📊', title: 'Analyse & Performance',
      desc: 'Des fiches fonds riches en indicateurs : performances glissantes, volatilité, drawdown, ratios de gestion, comparatif multi-devise.',
      link: '/funds/search', linkText: 'Analyser',
    },
    {
      num: '03', icon: '⚖️', title: 'Comparaison & Sélection',
      desc: 'Un outil de comparaison pour mettre plusieurs OPCVM en regard sur des critères analytiques structurés, directement utilisable dans un mémo de sélection.',
      link: '/tools/comparison', linkText: 'Comparer',
    },
    {
      num: '04', icon: '📁', title: 'Due Diligence Documentaire',
      desc: 'Une bibliothèque documentaire classifiée par fonds : prospectus, DIC, rapports annuels, lettres aux porteurs, questionnaires de due diligence.',
      link: '/funds/search', linkText: 'Accéder',
    },
    {
      num: '05', icon: '🏢', title: 'Sociétés de Gestion',
      desc: 'Une page dédiée par maison de gestion : identité, gamme complète, graphiques de synthèse, lecture consolidée de l\'offre par devise et par horizon.',
      link: '/fund-managers/search', linkText: 'Consulter',
    },
    {
      num: '06', icon: '🗺️', title: 'Vision Géographique',
      desc: 'Une lecture par pays pour comprendre les marchés, cartographier les acteurs et appréhender l\'environnement de chaque place financière africaine.',
      link: '/pays', linkText: 'Explorer',
    },
  ];

  const tools = [
    { icon: '🔍', name: 'FundSearch', desc: 'Moteur de recherche OPCVM multi-critères', link: '/funds/search', badge: 'Recherche' },
    { icon: '📋', name: 'FundCard', desc: 'Fiche analytique complète par fonds', link: '/funds/search', badge: 'Analyse' },
    { icon: '📈', name: 'FundHistory', desc: 'Historique base 100 et performances', link: '/funds/search', badge: 'Historique' },
    { icon: '⬇️', name: 'VLDownload', desc: 'Téléchargement des valeurs liquidatives', link: '/funds/search', badge: 'Données' },
    { icon: '📁', name: 'DocVault', desc: 'Bibliothèque documentaire classifiée', link: '/funds/search', badge: 'Documents' },
    { icon: '🏢', name: 'ManagerView', desc: 'Fiche société de gestion détaillée', link: '/fund-managers/search', badge: 'Gérants' },
    { icon: '🗺️', name: 'MarketMap', desc: 'Vue géographique par pays', link: '/pays', badge: 'Marchés' },
    { icon: '⚖️', name: 'CompareDesk', desc: 'Comparaison multi-fonds structurée', link: '/tools/comparison', badge: 'Comparaison' },
    { icon: '🎯', name: 'AdvancedSearch', desc: 'Recherche avancée multi-critères', link: '/tools/search', badge: 'Avancé' },
  ];

  const audiences = [
    { emoji: '🎯', role: 'Sélecteurs & Allocataires', desc: 'Constitution d\'univers investissables, comparaison multi-fonds, documentation de sélection structurée.', tags: ['Analyse', 'Comparaison', 'Due diligence'] },
    { emoji: '🏦', role: 'Banques Privées & Institutionnels', desc: 'Lecture structurée d\'un marché, qualification d\'une gamme, vision géographique et multi-devise.', tags: ['Marchés', 'Multi-pays', 'Reporting'] },
    { emoji: '💼', role: 'Family Offices', desc: 'Analyse des profils risque/rendement, accès documentaire, suivi d\'une allocation fonds africains.', tags: ['Risque', 'Rendement', 'Suivi'] },
    { emoji: '🏢', role: 'Sociétés de Gestion', desc: 'Visibilité de l\'offre, valorisation de la gamme, présence sur les marchés cibles, lecture comparative.', tags: ['Visibilité', 'Distribution', 'Benchmarking'] },
    { emoji: '🔬', role: 'Consultants & Analystes', desc: 'Appui à la recommandation, extraction de données VL, lecture comparative, supports de présentation.', tags: ['Données', 'Modélisation', 'VL'] },
    { emoji: '🌐', role: 'Distributeurs & Plateformes', desc: 'Qualification de l\'offre, lecture consolidée des gérants, vision des marchés par pays, présence cross-border.', tags: ['Cross-border', 'Multi-pays', 'Diaspora'] },
  ];

  const countries = [
    { flag: '🇨🇮', name: 'Côte d\'Ivoire', zone: 'UEMOA · BRVM' },
    { flag: '🇸🇳', name: 'Sénégal', zone: 'UEMOA · CREPMF' },
    { flag: '🇲🇦', name: 'Maroc', zone: 'AMMC · Casablanca' },
    { flag: '🇧🇫', name: 'Burkina Faso', zone: 'UEMOA · CREPMF' },
    { flag: '🇧🇯', name: 'Bénin', zone: 'UEMOA · CREPMF' },
    { flag: '🇹🇬', name: 'Togo', zone: 'UEMOA · CREPMF' },
    { flag: '🇲🇱', name: 'Mali', zone: 'UEMOA · CREPMF' },
    { flag: '🇳🇪', name: 'Niger', zone: 'UEMOA · CREPMF' },
  ];

  const steps = [
    { num: '01', title: 'Rechercher un fonds', desc: 'Saisissez un nom, un ISIN ou filtrez par gérant et pays. Accédez à l\'univers OPCVM africain en quelques clics.' },
    { num: '02', title: 'Analyser la fiche', desc: 'Performances, ratios de risque et de gestion, historique base 100, scénarios — tout en un point.' },
    { num: '03', title: 'Accéder aux documents', desc: 'Prospectus, DIC, reporting mensuel, due diligence : bibliothèque documentaire classifiée par catégorie.' },
    { num: '04', title: 'Comparer & décider', desc: 'Mettez plusieurs fonds en regard avec le comparateur. Exportez. Documentez votre sélection.' },
  ];

  const faqs = [
    { q: 'Peut-on souscrire directement à des fonds via la plateforme ?', a: 'Non. Fundafrique est une plateforme d\'information, d\'analyse et de préparation à la décision. Elle ne dispose pas de module de souscription en ligne. Elle apporte la connaissance nécessaire à une décision éclairée.' },
    { q: 'Quels indicateurs sont disponibles par fonds ?', a: 'Chaque fiche fonds intègre : performances glissantes (1M–5A), indicateurs de risque (volatilité, drawdown, VaR), ratios de gestion (alpha, bêta, R², tracking error, ratio d\'information), classements et quartiles, historique base 100 et scénarios de performance.' },
    { q: 'Quels marchés africains sont couverts ?', a: 'La plateforme couvre plusieurs marchés africains, notamment l\'espace UEMOA (Afrique de l\'Ouest francophone, BRVM), le Maroc, et d\'autres places financières. La couverture évolue en fonction de l\'élargissement progressif de la base de données.' },
    { q: 'La plateforme est-elle réservée aux professionnels ?', a: 'Non. Bien que pensée avec des standards professionnels, la plateforme est accessible à tout utilisateur souhaitant comprendre, analyser ou comparer des OPCVM africains.' },
    { q: 'Comment une société de gestion peut-elle être référencée ?', a: 'Les sociétés de gestion souhaitant valoriser leur présence sur la plateforme sont invitées à nous contacter directement via la page contact.' },
    { q: 'Les données VL peuvent-elles être téléchargées ?', a: 'Oui. L\'outil VLDownload permet d\'extraire l\'historique des valeurs liquidatives d\'un fonds sur une période définie, dans un format directement exploitable.' },
  ];

  const cardStyle: React.CSSProperties = {
    background: 'white',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '28px 24px',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    cursor: 'pointer',
    position: 'relative',
  };

  return (
    <Fragment>
      <SEO
        title="Analyse et comparaison des OPCVM africains"
        description="Explorez, analysez et comparez les OPCVM africains. Données de performances, fiches fonds détaillées, sociétés de gestion, marchés par pays et outils de comparaison professionnels."
        keywords="OPCVM, Fonds, Finance, Afrique, Performance, Fundafrique, Investissement, Portefeuille, Valeur liquidative, UEMOA, BRVM"
        canonicalUrl={`${urlsite}/home`}
        structuredData={[organizationSchema, websiteSchema, breadcrumbSchema([
          { name: 'Accueil', url: `${urlsite}/home` },
        ])]}
      />
      <Header />

      {/* ══════════════════ HERO ══════════════════ */}
      <section style={{
        background: 'linear-gradient(135deg, #F8F9FB 0%, #EBF0F5 50%, #F0F2F5 100%)',
        padding: '80px 24px 64px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, right: 0, width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(27,58,92,0.04) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <span style={{
              width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#B8860B',
              animation: 'pulse 2s ease infinite',
            }} />
            <span style={{
              fontSize: '12px', fontWeight: 600, color: '#B8860B',
              letterSpacing: '0.08em', textTransform: 'uppercase' as const,
            }}>
              Plateforme professionnelle · OPCVM Africains
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: 300,
            lineHeight: 1.15,
            color: '#1A1A2E',
            marginBottom: '8px',
            fontFamily: 'Inter, sans-serif',
          }}>
            <span style={{ fontStyle: 'italic', color: '#B8860B', fontWeight: 400 }}>Analysez</span> les OPCVM africains
            <span style={{ display: 'block', fontWeight: 700, color: '#1B3A5C', fontSize: 'clamp(36px, 5.5vw, 56px)' }}>
              avec la rigueur d&apos;un professionnel.
            </span>
          </h1>

          <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#4A5568', maxWidth: '600px', margin: '24px 0 36px' }}>
            Données de performances, indicateurs de risque, fiches documentaires et vision par pays — tout ce qu&apos;un professionnel de la sélection de fonds attend, dans un environnement structuré et fiable.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' as const }}>
            <Link href="/funds/search" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 28px',
              background: 'linear-gradient(135deg, #1B3A5C, #2A5A8C)',
              color: 'white', fontWeight: 600, fontSize: '15px',
              borderRadius: '8px', textDecoration: 'none',
              transition: 'all 0.25s ease',
              boxShadow: '0 4px 12px rgba(27,58,92,0.2)',
            }}>
              Explorer les OPCVM →
            </Link>
            <Link href="/tools/comparison" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 24px',
              background: 'transparent',
              color: '#1B3A5C', fontSize: '15px', fontWeight: 500,
              borderRadius: '8px', textDecoration: 'none',
              border: '1px solid #CBD5E0',
              transition: 'all 0.25s ease',
            }}>
              Comparer des fonds
            </Link>
          </div>

          <div style={{
            display: 'flex', gap: '40px', marginTop: '48px', paddingTop: '32px',
            borderTop: '1px solid #E2E8F0', flexWrap: 'wrap' as const,
          }}>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#1B3A5C', lineHeight: 1 }}>Multi-pays</div>
              <div style={{ fontSize: '12px', color: '#8896A6', letterSpacing: '0.04em', textTransform: 'uppercase' as const, marginTop: '4px' }}>Couverture africaine</div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#1B3A5C', lineHeight: 1 }}>20+</div>
              <div style={{ fontSize: '12px', color: '#8896A6', letterSpacing: '0.04em', textTransform: 'uppercase' as const, marginTop: '4px' }}>Indicateurs analytiques</div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#1B3A5C', lineHeight: 1 }}>9</div>
              <div style={{ fontSize: '12px', color: '#8896A6', letterSpacing: '0.04em', textTransform: 'uppercase' as const, marginTop: '4px' }}>Outils métier</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ REASSURANCE ══════════════════ */}
      <div style={{
        background: '#FFFFFF', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0',
        padding: '14px 24px',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '32px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' as const }}>
          {['Données fonds structurées', 'Indicateurs professionnels', 'Bibliothèque documentaire', 'Vision multi-pays', 'Accès direct'].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#8896A6', fontWeight: 500 }}>
              <span style={{ color: '#B8860B', fontSize: '10px' }}>✦</span> {item}
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════ SOLUTIONS ══════════════════ */}
      <section style={{ padding: '80px 24px', background: '#F8F9FB' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap' as const, gap: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: '#B8860B', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '12px' }}>
                <span style={{ width: '24px', height: '1px', background: '#B8860B' }} />
                Nos solutions
              </div>
              <h2 style={{ fontSize: 'clamp(28px, 3vw, 38px)', fontWeight: 300, lineHeight: 1.2, color: '#1A1A2E' }}>
                Des solutions pour <strong style={{ fontWeight: 700, color: '#1B3A5C' }}>chaque besoin</strong> professionnel
              </h2>
            </div>
            <p style={{ fontSize: '15px', color: '#4A5568', lineHeight: 1.7, maxWidth: '420px' }}>
              Quelle que soit votre position dans la chaîne d&apos;investissement, la plateforme vous offre des solutions pensées pour votre métier.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {solutions.map((s, i) => (
              <div key={i} style={{
                ...cardStyle,
                borderTop: '3px solid transparent',
              }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 10px 25px rgba(0,0,0,0.06)';
                  (e.currentTarget as HTMLDivElement).style.borderTopColor = '#B8860B';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                  (e.currentTarget as HTMLDivElement).style.borderTopColor = 'transparent';
                }}
              >
                <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#B8860B', letterSpacing: '0.06em', marginBottom: '16px', opacity: 0.7 }}>{s.num}</div>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '16px', fontSize: '20px',
                  background: 'rgba(27,58,92,0.06)', border: '1px solid #E2E8F0',
                }}>{s.icon}</div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1B3A5C', marginBottom: '8px' }}>{s.title}</h3>
                <p style={{ fontSize: '13px', color: '#4A5568', lineHeight: 1.65, marginBottom: '16px' }}>{s.desc}</p>
                <Link href={s.link} style={{ fontSize: '13px', color: '#B8860B', textDecoration: 'none', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  {s.linkText} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ OUTILS ══════════════════ */}
      <section style={{ padding: '80px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: '#B8860B', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '12px' }}>
            <span style={{ width: '24px', height: '1px', background: '#B8860B' }} />
            Nos outils
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 3vw, 38px)', fontWeight: 300, lineHeight: 1.2, color: '#1A1A2E', marginBottom: '40px' }}>
            Des outils <strong style={{ fontWeight: 700, color: '#1B3A5C' }}>pensés pour le travail</strong> des professionnels
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {tools.map((t, i) => (
              <Link key={i} href={t.link} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '16px', borderRadius: '10px',
                  border: '1px solid #EDF2F7',
                  transition: 'all 0.2s ease',
                  background: 'white',
                }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = '#CBD5E0';
                    (e.currentTarget as HTMLDivElement).style.background = '#F8F9FB';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = '#EDF2F7';
                    (e.currentTarget as HTMLDivElement).style.background = 'white';
                  }}
                >
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '18px', background: 'rgba(27,58,92,0.06)',
                    flexShrink: 0,
                  }}>{t.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1B3A5C' }}>{t.name}</div>
                    <div style={{ fontSize: '12px', color: '#8896A6', marginTop: '2px' }}>{t.desc}</div>
                  </div>
                  <span style={{
                    padding: '3px 8px', background: 'rgba(184,134,11,0.08)',
                    border: '1px solid rgba(184,134,11,0.15)', borderRadius: '100px',
                    fontSize: '10px', color: '#B8860B', fontWeight: 500, flexShrink: 0,
                  }}>{t.badge}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ AUDIENCE ══════════════════ */}
      <section style={{ padding: '80px 24px', background: '#F8F9FB' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: '#B8860B', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '12px' }}>
            <span style={{ width: '24px', height: '1px', background: '#B8860B' }} />
            Pour qui
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 3vw, 38px)', fontWeight: 300, lineHeight: 1.2, color: '#1A1A2E', marginBottom: '40px' }}>
            Une plateforme pour les <strong style={{ fontWeight: 700, color: '#1B3A5C' }}>professionnels qui décident</strong>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {audiences.map((a, i) => (
              <div key={i} style={cardStyle}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 10px 25px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                }}
              >
                <span style={{ fontSize: '28px', display: 'block', marginBottom: '12px' }}>{a.emoji}</span>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1B3A5C', marginBottom: '8px' }}>{a.role}</h3>
                <p style={{ fontSize: '13px', color: '#4A5568', lineHeight: 1.6, marginBottom: '16px' }}>{a.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}>
                  {a.tags.map((tag, j) => (
                    <span key={j} style={{
                      padding: '4px 10px', background: 'rgba(27,58,92,0.05)',
                      border: '1px solid #E2E8F0', borderRadius: '100px',
                      fontSize: '11px', color: '#1B3A5C', fontWeight: 500,
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ COUNTRIES ══════════════════ */}
      <section style={{ padding: '80px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap' as const, gap: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: '#B8860B', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '12px' }}>
                <span style={{ width: '24px', height: '1px', background: '#B8860B' }} />
                Marchés couverts
              </div>
              <h2 style={{ fontSize: 'clamp(28px, 3vw, 38px)', fontWeight: 300, lineHeight: 1.2, color: '#1A1A2E' }}>
                Explorez les marchés <strong style={{ fontWeight: 700, color: '#1B3A5C' }}>par pays</strong>
              </h2>
            </div>
            <p style={{ fontSize: '15px', color: '#4A5568', lineHeight: 1.7, maxWidth: '420px' }}>
              Chaque place financière africaine est lisible sous forme de panorama structuré : acteurs, OPCVM, statistiques.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {countries.map((c, i) => (
              <Link key={i} href="/pays" style={{ textDecoration: 'none' }}>
                <div style={{
                  ...cardStyle, textAlign: 'center' as const,
                  padding: '24px 16px',
                }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 10px 25px rgba(0,0,0,0.06)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                  }}
                >
                  <span style={{ fontSize: '36px', display: 'block', marginBottom: '10px' }}>{c.flag}</span>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#1B3A5C', marginBottom: '4px' }}>{c.name}</div>
                  <div style={{ fontSize: '11px', color: '#8896A6' }}>{c.zone}</div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center' as const, marginTop: '32px' }}>
            <Link href="/pays" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', background: 'transparent', color: '#1B3A5C',
              fontSize: '14px', fontWeight: 500, borderRadius: '8px', textDecoration: 'none',
              border: '1px solid #CBD5E0', transition: 'all 0.25s ease',
            }}>
              Voir tous les marchés →
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════ HOW IT WORKS ══════════════════ */}
      <section style={{ padding: '80px 24px', background: 'linear-gradient(180deg, #F8F9FB 0%, #FFFFFF 100%)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: '#B8860B', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '12px' }}>
            <span style={{ width: '24px', height: '1px', background: '#B8860B' }} />
            Comment ça marche
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 3vw, 38px)', fontWeight: 300, lineHeight: 1.2, color: '#1A1A2E', marginBottom: '48px' }}>
            De la <strong style={{ fontWeight: 700, color: '#1B3A5C' }}>recherche</strong> à la <strong style={{ fontWeight: 700, color: '#1B3A5C' }}>conviction</strong>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>
            {steps.map((s, i) => (
              <div key={i} style={{ textAlign: 'center' as const }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'monospace', fontSize: '16px', fontWeight: 600,
                  color: 'white', background: 'linear-gradient(135deg, #1B3A5C, #2A5A8C)',
                  margin: '0 auto 16px',
                  boxShadow: '0 0 0 8px rgba(27,58,92,0.08)',
                }}>{s.num}</div>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1B3A5C', marginBottom: '8px' }}>{s.title}</h3>
                <p style={{ fontSize: '13px', color: '#4A5568', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ FAQ ══════════════════ */}
      <section style={{ padding: '80px 24px', background: '#F8F9FB' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: '#B8860B', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '12px' }}>
            <span style={{ width: '24px', height: '1px', background: '#B8860B' }} />
            Questions fréquentes
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 3vw, 38px)', fontWeight: 300, lineHeight: 1.2, color: '#1A1A2E', marginBottom: '40px' }}>
            Ce que vous devez <strong style={{ fontWeight: 700, color: '#1B3A5C' }}>savoir</strong>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))', gap: '16px' }}>
            {faqs.map((f, i) => (
              <div key={i} style={{
                background: 'white', border: '1px solid #E2E8F0',
                borderRadius: '10px', overflow: 'hidden',
                transition: 'border-color 0.2s',
              }}>
                <div
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    padding: '18px 20px', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px',
                  }}
                >
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#1A1A2E', lineHeight: 1.4 }}>{f.q}</span>
                  <span style={{
                    width: '24px', height: '24px', flexShrink: 0,
                    borderRadius: '50%', border: '1px solid #E2E8F0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: openFaq === i ? 'white' : '#B8860B', fontSize: '14px',
                    background: openFaq === i ? '#1B3A5C' : 'transparent',
                    transition: 'all 0.2s',
                  }}>{openFaq === i ? '−' : '+'}</span>
                </div>
                {openFaq === i && (
                  <div style={{ padding: '0 20px 18px' }}>
                    <p style={{
                      fontSize: '13px', color: '#4A5568', lineHeight: 1.7,
                      borderTop: '1px solid #EDF2F7', paddingTop: '14px',
                    }}>{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ CTA ══════════════════ */}
      <section style={{ padding: '80px 24px', background: '#FFFFFF', textAlign: 'center' as const }}>
        <div style={{
          maxWidth: '700px', margin: '0 auto', padding: '56px 40px',
          background: '#F8F9FB', border: '1px solid #E2E8F0', borderRadius: '16px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
            background: 'linear-gradient(90deg, #1B3A5C, #B8860B, #2A5A8C)',
          }} />
          <h2 style={{
            fontSize: 'clamp(24px, 3vw, 34px)', fontWeight: 300,
            color: '#1A1A2E', lineHeight: 1.3, marginBottom: '16px',
          }}>
            Prêt à explorer <strong style={{ fontWeight: 700, color: '#1B3A5C' }}>les OPCVM africains</strong> ?
          </h2>
          <p style={{ fontSize: '15px', color: '#4A5568', lineHeight: 1.7, marginBottom: '32px' }}>
            Accédez dès maintenant à la recherche, aux fiches analytiques et aux outils de comparaison.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' as const }}>
            <Link href="/funds/search" style={{
              padding: '14px 28px', background: 'linear-gradient(135deg, #1B3A5C, #2A5A8C)',
              color: 'white', fontWeight: 600, fontSize: '15px', borderRadius: '8px',
              textDecoration: 'none', boxShadow: '0 4px 12px rgba(27,58,92,0.2)',
            }}>
              Explorer les OPCVM →
            </Link>
            <Link href={userConnected ? '/panel/investor/dashboard' : '/panel/investor/login'} style={{
              padding: '14px 24px', background: 'transparent', color: '#1B3A5C',
              fontSize: '15px', fontWeight: 500, borderRadius: '8px', textDecoration: 'none',
              border: '1px solid #CBD5E0',
            }}>
              {userConnected ? 'Mon espace' : 'Créer un compte'}
            </Link>
          </div>
          <p style={{ marginTop: '20px', fontSize: '12px', color: '#8896A6' }}>
            Plateforme professionnelle d&apos;analyse · Données vérifiables
          </p>
        </div>
      </section>

      {/* ══════════════════ DISCLAIMER ══════════════════ */}
      <div style={{
        maxWidth: '1100px', margin: '0 auto 40px', padding: '0 24px',
      }}>
        <div style={{
          padding: '16px 20px', background: '#F8F9FB', border: '1px solid #E2E8F0',
          borderRadius: '8px', fontSize: '11px', color: '#8896A6', lineHeight: 1.7,
        }}>
          <strong style={{ color: '#4A5568' }}>Avertissement :</strong> Fundafrique est une plateforme d&apos;information et d&apos;analyse dédiée aux OPCVM africains.
          Elle ne constitue pas un conseil en investissement, une recommandation de souscription ou un service de réception et transmission d&apos;ordres.
          Les données présentées sont à caractère informatif uniquement. Tout investissement dans des organismes de placement collectif comporte des risques,
          notamment de perte en capital.
        </div>
      </div>
    </Fragment>
  );
}
