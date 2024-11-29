"use client";

import Link from "next/link";
import { ChangeEvent, Fragment, useState } from "react";
import Swal from "sweetalert2";
import Sidebar from "@/app/sidebar";
import Headermenu from "@/app/Headermenu";
import { urlconstant } from "@/app/constants";
import { Button } from "react-bootstrap";

interface PageProps {
  searchParams: {
    id: any;
    societeconneted: any;
  };
}

const buttonStyle = {
  backgroundColor: "#3b82f6",
  color: "white",
  padding: "10px 20px", // Adjust padding to control the button size
  borderRadius: "5px", // Add rounded corners for a consistent look
  cursor: "pointer", // Add a pointer cursor on hover for better user experience
  width: "100%", // Set button width to 100%
};

export default function Importvl(props: PageProps) {
  const societeconneted = props.searchParams.id;

  const [file, setFile] = useState<File | null>(null); // État du fichier sélectionné
  const [message, setMessage] = useState(""); // État du message d'erreur ou de succès

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setMessage(""); // Réinitialiser le message d'erreur lors de la sélection d'un fichier
    }
  };

  const handleUpload = async (e: any) => {
    e.preventDefault();

    if (!file) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Erreur",
        html: `<p>Veuillez sélectionner un fichier avant de soumettre.</p>`,
        showConfirmButton: true,
      });
      setMessage("Veuillez sélectionner un fichier.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("id", societeconneted.toString());

      const response = await fetch(`${urlconstant}/api/uploadsocietefilenew/${societeconneted}`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Succès",
          html: `<p>Données enregistrées avec succès.</p>`,
          showConfirmButton: false,
          timer: 3000,
        });
        setMessage("");
      } else {
        throw new Error("Erreur lors de l'enregistrement des données.");
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Erreur",
        html: `<p>Erreur lors de l'importation des données.</p>`,
        showConfirmButton: false,
        timer: 5000,
      });
      console.error("Erreur lors de l'importation des données:", error);
      setMessage("Erreur lors de l'importation des données.");
    }
  };

  return (
    <Fragment>
      <div className="flex bg-gray-100 min-h-screen">
        {/* Sidebar */}
        <Sidebar societeconneted={societeconneted} />

        {/* Main Content */}
        <div className="flex-1 ml-64">
          {/* Header Menu */}
          <Headermenu />

          {/* Page Content */}
          <div className="content-wrapper2 p-6">
            <div className="container-full">
              <section className="content">
                <div className="row">
                  {/* Profile Section */}
                  <div className="col-xl-12 col-lg-12 mb-4">
                    <div className="card text-center shadow-lg border-0 rounded-lg overflow-hidden">
                      <div className="card-body bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-500 text-white">
                        <img
                          src="/images/avatar/avatar-13.png"
                          className="bg-light rounded-circle avatar-lg img-thumbnail border-4 border-white mb-3"
                          alt="profile-image"
                        />
                        <h4 className="mb-0 mt-2">{societeconneted}</h4>

                        {/* Social Media Icons */}
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

                  {/* Upload Section */}
                  <div className="col-12">
                    <div className="box p-4 rounded-lg shadow-lg bg-white">
                      <div className="box-body">
                        {/* Heading */}
                        <h4 className="font-bold text-xl text-indigo-700 mb-4">Importation des données</h4>
                        <hr className="my-4 border-t-2 border-gray-200" />

                        <Link href="/excel-files/FondVlimport.xlsx" passHref>
                          <Button className="inline-block mb-6 text-blue-500 hover:text-blue-700 font-semibold underline">
                            Télécharger le modèle Excel
                          </Button>
                        </Link>

                        {/* File Upload Input */}
                        <form onSubmit={handleUpload} className="w-full">
                          <div className="col-md-12 mb-4">
                            <label htmlFor="file" className="block text-lg font-medium text-gray-700 mb-2">
                              Sélectionner un fichier :
                            </label>
                            <input
                              type="file"
                              id="file"
                              className="form-control border border-gray-300 p-2 rounded-lg w-full"
                              name="file"
                              onChange={handleFileChange}
                              required
                            />
                          </div>

                          {/* Message Display */}
                          {message && <p className="text-red-500 font-semibold mb-4">{message}</p>}

                          {/* Submit Button */}
                          <button
                            type="submit"
                            className="w-full py-3 px-5 text-lg font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition duration-200"
                          >
                            Enregistrer
                          </button>
                        </form>
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
