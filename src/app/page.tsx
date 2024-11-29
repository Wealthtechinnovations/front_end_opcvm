"use client";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import router from "next/router";
import Header from "./Header";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Select from 'react-select';

export default function Home() {



  return (

    <Fragment>
      <Header />
      <div className="">
        <div className="container">
          <p>Bienvenu</p>
        </div>

      </div >
    </Fragment >

  );
}
