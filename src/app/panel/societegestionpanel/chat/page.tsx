"use client";
import { urlconstant } from "@/app/constants";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
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

async function getsociete() {
  const data = (
    await fetch(`${urlconstant}/api/getSociete`)
  ).json();
  return data;
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

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    email: '',
    tel: '',
  });
  useEffect(() => {
    async function fetchData() {
      try {

        const data = await getsociete();

        setManagementCompany(data.data.societe);
        console.log(managementCompany);
      } catch (error) {
        console.error("Erreur lors de l'appel à l'API :", error);
      }
    }
    fetchData();
  }, []);

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    // Send the updated management company data to your Node.js backend
    fetch(`${urlconstant}/api/updateSociete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Data received from the backend
        // You can show a success message or handle the response as needed
      })
      .catch((error) => console.error('Error updating management company data:', error));
  };

  console.log(managementCompany);
  return (



    < Fragment >
    <div className="flex bg-gray-100">
      <Sidebar societeconneted={societeconneted} />
      <div className="flex-1 ml-64">
        <Headermenu />


        <div className="content-wrapper2">
          <div className="container-full">
            {/* Main content */}
            <section className="content">
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
            <div className="col-lg-4 col-12">
              <div className="box">
                <div className="box-header no-border p-0">
                  <ul className="nav nav-tabs nav-bordered" role="tablist">
                    <li className="nav-item"> <a className="nav-link active" data-bs-toggle="tab" href="#messages" role="tab">Chat </a> </li>
                    <li className="nav-item"> <a className="nav-link" data-bs-toggle="tab" href="#contacts" role="tab">New</a> </li>
                  </ul>
                </div>
                <div className="box-body">
                  <div className="tab-content">
                    <div className="tab-pane active" id="messages" role="tabpanel">
                      <div className="app-search">
                        <form>
                          <div className="mb-15 position-relative">
                            <input type="text" className="form-control" placeholder="People, groups &amp; messages..." />
                            <span className="mdi mdi-magnify search-icon"></span>
                          </div>
                        </form>
                      </div>
                      <div className="slimScrollDiv" style={{ position: 'relative', overflow: 'hidden', width: 'auto', height: '675px' }}>
                        <div className="chat-box-one-side3" style={{ overflow: 'hidden', width: 'auto', height: '675px' }}>
                          <div className="media-list media-list-hover">
                            <a href="javascript:void(0);" className="media p-0">
                              <div className="w-p100 d-flex align-items-center m-1 p-2">
                                <img src="../../../images/avatar/avatar-9.png" className="bg-light ms-0 me-2 rounded-circle" height="48" alt="Brandon Smith" />
                                <div className="w-p100 overflow-hidden">
                                  <h5 className="mt-0 mb-0 fs-14 fw-600">
                                    <span className="float-end text-muted fs-12 fw-400">4:30am</span>
                                    Brandon Smith
                                  </h5>
                                  <p className="mt-1 mb-0 text-muted fs-14">
                                    <span className="w-25 float-end text-end"><span className="badge badge-danger-light">3</span></span>
                                    <span className="w-75 text-dark">How are you today?</span>
                                  </p>
                                </div>
                              </div>
                            </a>

                            {/* Aquí sigue el resto de los elementos <a> */}

                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane" id="contacts" role="tabpanel">
                      <div className="slimScrollDiv" style={{ position: 'relative', overflow: 'hidden', width: 'auto', height: '675px' }}>
                        <div className="chat-box-one-side3" style={{ overflow: 'hidden', width: 'auto', height: '675px' }}>
                          <div className="media-list media-list-hover">
                            <div className="media py-10 px-0 align-items-center">
                              <a className="avatar avatar-lg status-success me-2" href="#">
                                <img src="../../../images/avatar/avatar-1.png" className="bg-light" alt="..." />
                              </a>
                              <div className="ms-0 media-body">
                                <p className="fs-14 fw-600">
                                  <a className="hover-primary" href="#">Sarah Kortney</a>
                                </p>
                              </div>
                            </div>

                            {/* Aquí sigue el resto de los elementos <div> */}

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-8 col-12">
              <div className="box">
                <div className="box-header">
                  <div className="media align-items-top p-0">
                    <a className="avatar avatar-lg status-success mx-0" href="#" data-bs-toggle="modal" data-bs-target="#right-modal">
                      <img src="../../../images/avatar/avatar-1.png" className="bg-light rounded-circle" alt="..." />
                    </a>
                    <div className="d-lg-flex d-block justify-content-between align-items-center w-p100">
                      <div className="media-body mb-lg-0 mb-20">
                        <p className="fs-16">
                          <a className="hover-primary fw-600" href="#" data-bs-toggle="modal" data-bs-target="#right-modal">Sarah Kortney</a>
                        </p>
                        <p className="fs-12 text-fade">Last Seen 10:30pm ago</p>
                      </div>
                      <div>
                        <ul className="list-inline mb-0 fs-18">
                          <li className="list-inline-item"><a href="#" className="hover-primary"><i className="fa fa-phone"></i></a></li>
                          <li className="list-inline-item"><a href="#" className="hover-primary"><i className="fa fa-video-camera"></i></a></li>
                          <li className="list-inline-item"><a href="#" className="hover-primary"><i className="fa fa-ellipsis-h"></i></a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="box-body">
                  <div className="slimScrollDiv" style={{ position: 'relative', overflow: 'hidden', width: 'auto', height: '580px' }}>
                    <div className="chat-box-one2" style={{ overflow: 'hidden', width: 'auto', height: '580px' }}>

                      <div className="card no-border d-inline-block my-20 float-start me-2 no-shadow max-w-p80">
                        <div className="d-flex flex-row pb-2 align-items-center">
                          <a className="d-flex align-items-center" href="#">
                            <img alt="Profile" src="../../../images/avatar/avatar-1.png" className="bg-light avatar rounded-circle me-10" />
                            <p className="mb-0 fs-14 fw-500 text-dark">Sarah Kortney</p>
                          </a>
                        </div>
                        <div className="mt-5 card-body p-15 bg-info-light rounded10 d-inline-block">
                          <div className="chat-text-start">
                            <p className="mb-0 text-dark">What do you think about our plans for this product launch?</p>
                          </div>
                        </div>
                        <div className="mt-5 card-body p-15 bg-info-light rounded10 d-inline-block">
                          <div className="chat-text-start">
                            <p className="mb-0 text-dark">It looks to me like you have a lot planned before your deadline. I would suggest you push your deadline back so you have time to run a successful advertising campaign.</p>
                          </div>
                        </div>
                        <p className="ps-5 mt-10 mb-0 fs-12 text-mute"><i className="me-5 fa fa-clock-o"></i>09:25</p>
                      </div>
                      <div className="clearfix"></div>

                      <div className="card no-border d-inline-block my-20 text-end float-end me-2 no-shadow max-w-p80">
                        <div className="d-flex flex-row pb-2 align-items-center justify-content-end">
                          <a className="d-flex align-items-center" href="#">
                            <p className="mb-0 fs-14 fw-500 text-dark">You</p>
                            <img alt="Profile" src="../../../images/avatar/avatar-2.png" className="bg-light avatar rounded-circle ms-10" />
                          </a>
                        </div>
                        <div className="mt-5 card-body p-15 bg-primary-light rounded10 d-inline-block">
                          <div className="chat-text-start">
                            <p className="mb-0 text-dark">I would suggest you discuss this further with the advertising team.</p>
                          </div>
                        </div>

                        <p className="pe-5 mt-10 mb-0 fs-12 text-mute"><i className="me-5 fa fa-clock-o"></i>09:25</p>
                      </div>
                      <div className="clearfix"></div>


                    </div>
                    <div className="slimScrollBar" style={{ background: 'rgb(228, 230, 239)', width: '4px', position: 'absolute', top: '0px', opacity: '0.8', display: 'none', borderRadius: '7px', zIndex: '99', right: '3px', height: '213.587px' }}></div>
                    <div className="slimScrollRail" style={{ width: '4px', height: '100%', position: 'absolute', top: '0px', display: 'none', borderRadius: '7px', background: 'rgb(51, 51, 51)', opacity: '0.2', zIndex: '90', right: '3px' }}></div>
                  </div>
                </div>
                <div className="box-footer no-border">
                  <div className="d-md-flex d-block justify-content-between align-items-center bg-white p-5 rounded10 b-1 overflow-hidden">
                    <input className="form-control b-0 py-10" type="text" placeholder="Say something..." />
                    <div className="d-flex justify-content-between align-items-center mt-md-0 mt-30">

                      <button type="button" className="waves-effect waves-circle btn btn-circle btn-primary">
                        <i className="mdi mdi-send"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </section>
      </div >
      </div>
      </div>
      </div>
    </Fragment >
  );
}