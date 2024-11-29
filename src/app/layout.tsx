import Link from "next/link";
import "./globals.css";
import "./style/css/horizontal-menu.css";
import React, { Fragment, useEffect, useState } from "react";
import "./style/css/style.css";
import "./style/css/skin_color.css";
import "./style/css/vendors_css.css";
import Head from "next/head";
import router from "next/router";
import RechercheBar from "./RechercheBar";
import { GetServerSideProps } from 'next';
import { urlsite } from "./constants";
const myStyle = {
  width: '20em',
  minWidth: '10em',
  display: 'none',
  maxWidth: '20em',
  top: 'auto',
  left: '0px',
  marginLeft: '1px',
  marginTop: '0px'
};

export const metadata = {
  title: {
    default: "Plateforme Fundafrique - OPCVM Africains",
    template: "%s - Plateforme Fundafrique - OPCVM Africains",
  },
  description: "Plateforme d'analyse et de selection des OPCVM Africains. Comparer, analyser, selectionner, creer son portefeuille virtuel, voir le classement et les performences des fonds des pays africains. Sur Fundafrique, vous pouvez analyser les ratios de performence et de risque pour trouver le meilleur fonds investissement en Afrique",
  generator: 'Plateforme Fundafrique - OPCVM Africains',
  applicationName: 'Plateforme Fundafrique - OPCVM Africains',
  referrer: 'origin-when-cross-origin',
  keywords: [ 'OPCVM', 'Fonds', 'Finance', 'ratios', 'Performance', 'Fundafrique'],
  authors: [{ name: 'Fundafrique' }, { name: 'Fundafrique', url: urlsite }],
  creator: 'Fundafrique',
  publisher: 'Fundafrique',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: 'Mh5mrGhtOFCkCE7RB3ltUYEEhAqluJEHgGCBP2AO7Gk',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

    <html>
      <head>
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-F4F52HS3TF"></script>
     {/* <script>
        window.dataLayer = window.dataLayer || [];
        function gtag() {
          window.dataLayer.push(arguments);
          
        }
        gtag('js', new Date());
          gtag('config', 'G-F4F52HS3TF');
        </script>*/}
      </head>

      <body className="layout-top-nav light-skin theme-primary fixed" style={{ height: '100%', width: '100%' }}>
        <div className="wrapper bg-white" style={{ overflowY: 'scroll' }}>
          {/*<div id="loader"></div>*/}




          {children}
          <footer className="main-footer text-center">
            &copy; {new Date().getFullYear()} <a href="#">OPCVM</a>. Tous droits réservés.
          </footer>
        </div >
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-F4F52HS3TF"></script>
     {/* <script>
        window.dataLayer = window.dataLayer || [];
        function gtag() {
          window.dataLayer.push(arguments);
          
        }
        gtag('js', new Date());
          gtag('config', 'G-F4F52HS3TF');
        </script>*/}
      </body >
    </html>



  );
}
async function searchFunds(searchTerm: any) {
  // const response = await fetch(`/api/searchFunds?query=${searchTerm}`);
  const response = await fetch(`/api/searchFunds`);
  const data = await response.json();
  console.log(data);
  return data;
}