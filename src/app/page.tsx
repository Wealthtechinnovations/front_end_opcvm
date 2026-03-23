"use client";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import router from "next/router";
import Header from "./Header";
import SEO from '@/components/common/SEO';
import { organizationSchema, websiteSchema } from '@/utils/structuredData';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Select from 'react-select';

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
