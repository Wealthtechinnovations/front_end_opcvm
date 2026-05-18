import "./globals.css";
import "./style/css/horizontal-menu.css";
import React from "react";
import "./style/css/style.css";
import "./style/css/skin_color.css";
import "./style/css/vendors_css.css";
import { urlsite } from '@/lib/constants';
import { Metadata } from "next";
import Script from "next/script";
import Providers from "./providers";

export const metadata: Metadata = {
  title: {
    default: "Fundafrique - Plateforme OPCVM Africains",
    template: "%s | Fundafrique",
  },
  description: "Plateforme d'analyse et de sélection des OPCVM Africains. Comparez, analysez et sélectionnez les meilleurs fonds d'investissement en Afrique. Classements, performances, ratios de risque et portefeuille virtuel.",
  applicationName: 'Fundafrique',
  referrer: 'origin-when-cross-origin',
  keywords: ['OPCVM', 'Fonds', 'Finance', 'Afrique', 'Performance', 'Fundafrique', 'Investissement', 'Portefeuille', 'Valeur liquidative'],
  authors: [{ name: 'Fundafrique', url: urlsite }],
  creator: 'Fundafrique',
  publisher: 'Fundafrique',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(urlsite),
  openGraph: {
    type: 'website',
    siteName: 'Fundafrique',
    locale: 'fr_FR',
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@fundafrique',
  },
  verification: {
    google: 'Mh5mrGhtOFCkCE7RB3ltUYEEhAqluJEHgGCBP2AO7Gk',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Fundafrique',
              description: "Plateforme d'analyse et de sélection des OPCVM Africains",
              url: urlsite,
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Fundafrique',
              url: urlsite,
              potentialAction: {
                '@type': 'SearchAction',
                target: `${urlsite}/funds/search?q={search_term_string}`,
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className="layout-top-nav light-skin theme-primary fixed" style={{ height: '100%', width: '100%' }}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-26P2WDEBF6"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-26P2WDEBF6');
          `}
        </Script>
        <Providers>
          <div className="wrapper bg-white" style={{ overflowY: 'scroll' }}>
            {children}
            <footer style={{
              backgroundColor: '#1B3A5C',
              color: 'white',
              padding: '48px 32px 24px',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            }}>
              <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', marginBottom: '32px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                      <span style={{
                        width: '32px', height: '32px',
                        background: 'linear-gradient(135deg, #B8860B, #D4A843)',
                        borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: 700, fontSize: '15px',
                      }}>F</span>
                      <span style={{ fontSize: '18px', fontWeight: 700 }}>
                        Fund<span style={{ color: '#D4A843' }}>afrique</span>
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', maxWidth: '280px' }}>
                      Plateforme d&apos;analyse et de s&eacute;lection des OPCVM Africains.
                    </p>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', color: '#D4A843' }}>Navigation</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <li><a href="/home" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>Accueil</a></li>
                      <li><a href="/funds/search" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>OPCVM</a></li>
                      <li><a href="/fund-managers/search" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>Soci&eacute;t&eacute;s de gestion</a></li>
                      <li><a href="/pays" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>Pays</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', color: '#D4A843' }}>Outils</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <li><a href="/tools/comparison" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>Comparaison</a></li>
                      <li><a href="/tools/search" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>S&eacute;lection OPCVM</a></li>
                      <li><a href="/news" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>Actualit&eacute;s</a></li>
                      <li><a href="/contact" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>Contact</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', color: '#D4A843' }}>Espace membre</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <li><a href="/panel/investor/login" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>Espace investisseur</a></li>
                      <li><a href="/panel/management/login" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>Espace soci&eacute;t&eacute; de gestion</a></li>
                    </ul>
                  </div>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                    &copy; {new Date().getFullYear()} Fundafrique. Tous droits r&eacute;serv&eacute;s.
                  </p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                    Les performances pass&eacute;es ne pr&eacute;jugent pas des performances futures.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
