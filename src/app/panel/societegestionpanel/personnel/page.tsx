"use client";
import { urlconstant, urlconstantimage } from "@/app/constants";

import Link from "next/link";
import { Fragment, Key, ReactNode, useEffect, useState } from "react";
import Select from 'react-select';


//import * as XLSX from 'xlsx';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
//import { router } from 'next/router';
import Header from '@/app/Header';
import Router from 'next/router';
import { magic } from "../../../../../magic";
import Headermenu from "@/app/Headermenu";
import Sidebar from "@/app/sidebar";

const options = [
  { value: 1, label: 'Option 1' },
  { value: 2, label: 'Option 2' },
  { value: 3, label: 'Option 3' },
  // Ajoutez plus d'options au besoin
];



interface Pays {
  value: any[]; // ou un type spécifique pour les éléments du tableau 'funds'

}
interface FormData {
  name: string;
  description: string;
  email: string;
  tel: string;
}
interface Document {
  nom: ReactNode;
  id: any;
  fonction: any;
  prenom: any;
  mois: any;
  photo: any;


}

type Documents = Document[];
async function getsociete() {
  const data = (
    await fetch(`${urlconstant}/api/getSociete`)
  ).json();
  return data;
}
async function getpath() {
  const response = await fetch(`${urlconstant}/api/upload`);
  const data = await response.json();
  return data.path; // Return only the path value from the response data
}

interface Option {
  value: string;
}

interface PageProps {
  searchParams: {
    selectedRows: any;
    id: any;
  };
}
export default function Profile(props: PageProps) {
  let societeconneted = props.searchParams.id;

  const [managementCompany, setManagementCompany] = useState<FormData>({
    name: '',
    description: '',
    email: '',
    tel: '',
  });
  const [path, setpath] = useState();

  const [personnel, setPersonnels] = useState<Documents | null>(null);


  useEffect(() => {
    const fetchDocuments = async () => {
      try {

        /*const datttt = await getpath();
        console.log(datttt)
        setpath(datttt);*/
        const response = await fetch(`${urlconstant}/api/personnel/${societeconneted}`);
        if (response.ok) {
          const data = await response.json();
          setPersonnels(data);
        } else {
          console.error('Erreur lors de la récupération des documents:', response.statusText);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des documents:', error);
      }
    };
    if (societeconneted) {
      fetchDocuments();
    }
  }, [societeconneted,]);

  console.log(managementCompany);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  return (



    < Fragment >
      <div className="flex bg-gray-100">
        <Sidebar societeconneted={societeconneted} />
        <div className="flex-1 ml-64">
          <Headermenu />


          <div className="content-wrapper2">
            <div className="container-full">
              {/* Main content */}
                <div className="row">
                  <div className="col-xl-12 col-lg-12 mb-4">
                    <div className="card text-center shadow-lg border-0 rounded-lg overflow-hidden">
                      <div className="card-body bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-500 text-white">
                        <img src="/images/avatar/avatar-13.png" className="bg-light rounded-circle avatar-lg img-thumbnail border-4 border-white mb-3" alt="profile-image" />
                        <h4 className="mb-0 mt-2">{societeconneted}</h4>



                        <ul className="social-list list-inline mt-3 mb-0">
                          <li className="list-inline-item">
                            <a href="#" className="btn btn-social-icon btn-circle text-white bg-facebook hover:bg-facebook-dark">
                              <i className="fa fa-facebook"></i>
                            </a>
                          </li>
                          <li className="list-inline-item">
                            <a href="#" className="btn btn-social-icon btn-circle text-white bg-twitter hover:bg-twitter-dark">
                              <i className="fa fa-twitter"></i>
                            </a>
                          </li>
                          <li className="list-inline-item">
                            <a href="#" className="btn btn-social-icon btn-circle text-white bg-google hover:bg-google-dark">
                              <i className="fa fa-google"></i>
                            </a>
                          </li>
                          <li className="list-inline-item">
                            <a href="#" className="btn btn-social-icon btn-circle text-white bg-instagram hover:bg-instagram-dark">
                              <i className="fa fa-instagram"></i>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
        <section className="content">
          <div className="text-right">
            <Link
              className={`btn btn-main active}`}
              style={{ backgroundColor: "#3b82f6", color: "white" }}
              href={`/panel/societegestionpanel/personnel/ajout?id=${societeconneted}`}
            >
              Ajouter un personnel
            </Link>
          </div>
          <br />
          <div className="box ">
            <div className="box-body">
              <div className="row">
                {/* Repeat the following block for each team member */}
                {personnel && personnel.map(person => (
                  <div className="col-12 col-lg-4" key={person.id}>
                    <div className="box ribbon-box">
                      {/* Replace the ribbon with dynamic data */}
                      <div className="ribbon-two ribbon-two-primary"><span>{person.fonction}</span></div>
                      <div className="box-header no-border p-0">
                        <a href="#">
                          <img className="img-fluid" src={person.photo ? `${urlconstantimage}/${person.photo}` : "/images/avatar/375x200/1.jpg"}
                            alt=""
                            style={{ width: '500px', height: '200px' }} />

                        </a>
                      </div>
                      <div className="box-body">
                        <div className="user-contact list-inline text-center">
                          <br />
                        </div>
                        <div className="text-center">
                          <h3 className="my-10"><a href="#">{person.nom} {person.prenom}</a></h3>
                          <h6 className="user-info mt-0 mb-10 text-fade">{person.fonction}</h6>
                        </div>
                        <div className="text-center">
                          <Link
                            className="btn btn-main active"
                            style={{ backgroundColor: "#3b82f6", color: "white", width: "150px" }} // Largeur fixe définie ici
                            href={{
                              pathname: '/panel/societegestionpanel/personnel/update',
                              query: { societeconneted: societeconneted, personid: person.id }
                            }}
                          >
                            Mise à jour
                          </Link> &nbsp;
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
                {/* End of team member block */}
              </div>
            </div>
          </div>

        </section>
        </div>
      </div >
      </div>
      </div>
      </div>
    </Fragment >
  );
}