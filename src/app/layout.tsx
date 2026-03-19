import "./globals.css";
import "./style/css/horizontal-menu.css";
import React from "react";
import "./style/css/style.css";
import "./style/css/skin_color.css";
import "./style/css/vendors_css.css";
import { urlsite } from "./constants";
import { Metadata } from "next";

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
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-F4F52HS3TF"></script>
      </head>
      <body className="layout-top-nav light-skin theme-primary fixed" style={{ height: '100%', width: '100%' }}>
        <div className="wrapper bg-white" style={{ overflowY: 'scroll' }}>
          {children}
          <footer className="main-footer text-center" style={{ padding: '16px', borderTop: '1px solid #e5e7eb' }}>
            &copy; {new Date().getFullYear()} <a href="/accueil" style={{ color: '#3b82f6', textDecoration: 'none' }}>Fundafrique</a>. Tous droits réservés.
          </footer>
        </div>
      </body>
    </html>
  );
}
