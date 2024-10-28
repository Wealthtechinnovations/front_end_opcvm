"use client";
import { urlconstant, urlconstantimage } from "@/app/constants";
import Link from "next/link";
import { Fragment, useEffect, useState, ChangeEvent, useCallback } from "react";
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faComments, faClock } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/sidebar";
import Headermenu from "@/app/Headermenu";

interface Actualite {
  date: string;
  description: string;
  image: string;
  type: string;
  username: string;
}

async function getactualite() {
  const data = await fetch(`${urlconstant}/api/getactualite`, {
    method: 'GET',
  }).then((res) => res.json());
  return data;
}

interface PageProps {
  searchParams: {
    selectedRows: any;
    id: any;
  };
}

export default function Pagehome(props: PageProps) {
  let societeconneted = props.searchParams.id;
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const data8 = await getactualite();
        setActualites(data8);
      } catch (error) {
        console.error("Erreur lors de l'appel à l'API :", error);
      }
    }
    fetchData();
  }, []);

  const router = useRouter();

  const handleSubmitactu = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const formDatass = new FormData();
    formDatass.append('description', description);
    if (image) formDatass.append('fichier', image);
    formDatass.append('type', type);
    formDatass.append('user_id', societeconneted);
    formDatass.append('username', societeconneted);

    try {
      const response = await fetch(`${urlconstant}/api/actualite`, {
        method: 'POST',
        body: formDatass
      });

      if (response.status === 200) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          html: `<p> Données enregistrées.</p>`,
          showConfirmButton: false,
          timer: 5000,
        });
        setTimeout(() => {
          window.location.href = `/panel/societegestionpanel/actualite?id=${societeconneted}`;
        }, 2000);
      }
    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        html: `<p> "Error" </p>`,
        showConfirmButton: false,
        timer: 10000,
      });
      console.error('Error uploading article:', error);
    }
  };

   // State pour gérer l'affichage de la Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fonction pour basculer l'état de la Sidebar
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  return (
    <Fragment>
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar societeconneted={societeconneted} />
        <div className="flex-1 ml-64">
          <Headermenu />

          <div className="content-wrapper2">
            <div className="container-full">
              <section className="content">
                <div className="row">
                  <div className="col-xl-12 mb-4">
                    <div className="card text-center shadow-lg border-0 rounded-lg overflow-hidden">
                      <div className="card-body bg-gradient-to-b from-white to-blue-200 text-white p-5">
                        <img src="/images/avatar/avatar-13.png" className="bg-light rounded-circle avatar-lg img-thumbnail border-4 border-white mb-3" alt="profile-image" />
                        <h4 className="mb-0 mt-2 font-bold text-black-50">{societeconneted}</h4>

                      
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-12">
                    <div className="  border-0 rounded-lg overflow-hidden">
                      <div className=" p-4">
                        <div className="border rounded mt-2 mb-4 p-4 shadow-sm bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300">
                          <form onSubmit={handleSubmitactu} action="#" className="comment-area-box">
                            <input className="form-control rounded-lg mb-3" type="text" placeholder="Titre de la publication" value={type} onChange={(e) => setType(e.target.value)} />
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="form-control border-0 resize-none rounded-lg mb-3" placeholder="Description..."></textarea>
                            <input type="file" name="fichier" onChange={handleFileChange} className="form-control rounded-lg mb-3" />
                            <button type="submit" className="btn btn-primary w-100 rounded-lg shadow-sm">Poster</button>
                          </form>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {actualites.map((actualite, index) => (
                            <div key={index} className="p-6 border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                                <div className="d-flex align-items-center mb-4">
                                    <img className="rounded-circle bg-light" src="/images/avatar/avatar-1.png" alt="Avatar" height="50" width="50" />
                                    <div className="ml-3">
                                        <h5 className="text-lg font-semibold text-gray-800">{actualite.username}</h5>
                                        <p className="text-gray-500 text-sm"><i className="fa fa-clock"></i> {actualite.date}</p>
                                    </div>
                                </div>
                                <p className="text-gray-700 mb-4">{actualite.description}</p>
                                {actualite.image && (
                                    <img className="img-fluid rounded-lg mb-4" src={`${urlconstantimage}/${actualite.image}`} alt="Image" style={{ maxHeight: "300px", maxWidth: "100%" }} />
                                )}
                                <div className="flex justify-between items-center">
                                    <button className="btn btn-outline-primary btn-sm px-4 rounded-full">J aime</button>
                                    <button className="btn btn-outline-secondary btn-sm px-4 rounded-full">Commenter</button>
                                </div>
                            </div>
                        ))}
                    </div>

                        <div className="text-center">
                          <a href="#" className="text-primary hover:text-red-500 transition duration-300"><i className="mdi mdi-spin mdi-loading me-1"></i> Charger plus </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
