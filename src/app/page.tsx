"use client";
import React, { Fragment } from "react";
import Header from "./Header";
import SEO from '@/components/common/SEO';
import { organizationSchema, websiteSchema } from '@/utils/structuredData';

export default function Home() {



  return (

    <Fragment>
      <SEO
        title="Plateforme OPCVM Africains"
        description="Plateforme d'analyse et de sélection des OPCVM Africains. Comparez, analysez et sélectionnez les meilleurs fonds d'investissement en Afrique."
        keywords="OPCVM, Fonds, Finance, Afrique, Performance, Fundafrique, Investissement"
        structuredData={[organizationSchema, websiteSchema]}
      />
      <Header />
      <div className="">
        <div className="container">
          <p>Bienvenu</p>
        </div>

      </div >
    </Fragment >

  );
}
