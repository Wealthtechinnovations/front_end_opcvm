"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Modal, Button } from 'react-bootstrap';
import Select, { SingleValue } from 'react-select';
import Header from '@/components/layout/Header';
import { urlconstant } from "@/lib/constants";
import Swal from "sweetalert2";
import { generateFundSlug } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}
interface Funds {
  data: {
    fonds: any[];
  };
}
interface Pays {
  value: string;
}
interface Societe {
  value: any[];
  label: any[];
}

async function getfonds() {
  const response = await fetch(`${urlconstant}/api/searchFunds`);
  if (!response.ok) return null;
  return response.json();
}
async function getallsociete() {
  const response = await fetch(`${urlconstant}/api/getsocieterecherche`);
  if (!response.ok) return null;
  return response.json();
}
async function getpays() {
  const response = await fetch(`${urlconstant}/api/getPays`);
  if (!response.ok) return null;
  return response.json();
}

const optionsCategorie = [
  { value: "Obligations", label: 'Obligations' },
  { value: "Actions", label: 'Actions' },
  { value: "Diversifié", label: 'Diversifié' },
  { value: "Monétaire", label: 'Monétaire' },
  { value: "ETF", label: 'ETF' },
  { value: "Infrastructure", label: 'Infrastructure' },
  { value: "Immobilier", label: 'Immobilier' },
  { value: "Private equity", label: 'Private equity' },
  { value: "Alternatif", label: 'Alternatif' },
  { value: "Autres", label: 'Autres' },
];

export default function Comparaison() {
  const headers = {
    tabAccueil: [
      { label: 'Nom', key: 'nom_fond' },
      { label: 'Pays', key: 'pays' },
      { label: 'Société de gestion', key: 'societe_gestion' },
    ],
  };

  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [selectedOptions1, setSelectedOptions1] = useState<SingleValue<Option> | null>(null);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [funds, setFunds] = useState<Funds | null>(null);
  const [error, setError] = useState("");
  const [optionsSociete, setOptionsSociete] = useState([]);
  const [selectedSociete, setSelectedSociete] = useState<Societe | null>(null);
  const [optionsPays, setOptionsPays] = useState([]);
  const [selectedPays, setSelectedPays] = useState<Pays | null>(null);
  const [fundsOptions, setFundsOptions] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, settotalPages] = useState(1);
  const [userConnected, setUserConnected] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('isLoggedIn');
    const userId = localStorage.getItem('userId');
    if (stored === 'true' && userId !== null) {
      setIsLoggedIn(true);
      setUserConnected(parseInt(userId, 10));
    }
  }, []);

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    setFunds({ data: { fonds: [] } });
    setError("");
    Swal.fire({
      title: 'Veuillez patienter',
      html: 'Chargement des résultats en cours...',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });
    const selectedValues = selectedOptions.map(option => option?.value);
    fetch(`${urlconstant}/api/listeopcvm?query=${selectedValues.join(',')}&selectedpays=${selectedPays?.value}&selectedsociete=${selectedSociete?.value}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(data => {
        Swal.close();
        if (data && data.code === 200) {
          setFunds(data);
          const totalItems = data?.data?.societes?.length || data?.data?.fonds?.length || 0;
          settotalPages(Math.ceil(totalItems / itemsPerPage));
        } else {
          setError("Aucun résultat trouvé. Réessayez avec d'autres critères.");
        }
      })
      .catch(err => {
        Swal.close();
        setError("Erreur de connexion au serveur.");
        console.error('Erreur API :', err);
      });
  };

  useEffect(() => {
    async function fetchData() {
      try {
        Swal.fire({
          title: 'Veuillez patienter',
          html: 'Chargement des résultats en cours...',
          allowOutsideClick: false,
          didOpen: () => { Swal.showLoading(); }
        });
        const data = await getpays();
        setOptionsPays(data?.data.paysOptions.map((f: any) => ({ value: f.value, label: f.label })));

        const data3 = await getallsociete();
        setOptionsSociete((data3?.data?.societes || []).map((f: any) => ({ value: f.nom, label: f.nom })));

        const data2 = await getfonds();
        setFundsOptions((data2?.data?.funds || []).map((f: any) => ({ value: f.value, label: f.label })));

        const response = await fetch(`${urlconstant}/api/listeopcvm`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const responseData = await response.json();
        if (responseData && responseData.code === 200) {
          Swal.close();
          const totalItems = responseData?.data?.fonds?.length || 0;
          settotalPages(Math.ceil(totalItems / itemsPerPage));
          setFunds(responseData);
        } else {
          Swal.close();
          setError("Aucun résultat trouvé.");
        }
      } catch (error) {
        Swal.close();
        console.error("Erreur lors de l'appel à l'API :", error);
        setError("Impossible de contacter le serveur. Veuillez réessayer plus tard.");
      }
    }
    fetchData();
  }, []);

  const handleSort = (key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });

    if (funds && funds.data.fonds) {
      const sorted = [...funds.data.fonds];
      sorted.sort((a, b) => {
        const aVal = a[key], bVal = b[key];
        if (key === "nom_fond" || key === "pays" || key === "societe_gestion") {
          if (typeof aVal === 'string' && typeof bVal === 'string') {
            return direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
          }
          return 0;
        }
        const numA = parseFloat(aVal), numB = parseFloat(bVal);
        if (isNaN(numA) || isNaN(numB)) return 0;
        return direction === 'asc' ? numA - numB : numB - numA;
      });
      setFunds({ data: { fonds: sorted } });
    }
  };

  const handleItemsPerPageChange = (e: { target: { value: string } }) => {
    const val = parseInt(e.target.value, 10);
    if (val === 100) {
      setShowPopup(true);
      setItemsPerPage(20);
    } else {
      setItemsPerPage(val);
    }
    setCurrentPage(1);
  };

  const paginatedData = funds?.data?.fonds.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) || [];

  const selectStyles = {
    control: (base: any) => ({ ...base, borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '14px' }),
  };

  return (
    <Fragment>
      <Header />

      {/* Membership popup */}
      <Modal show={showPopup} onHide={() => setShowPopup(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Action</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Pour s&eacute;lectionner 100 &eacute;l&eacute;ments par page, vous devez &ecirc;tre membre.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" style={{ backgroundColor: '#1B3A5C', color: 'white', borderRadius: '6px' }} onClick={() => setShowPopup(false)}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      <div style={{ background: 'linear-gradient(135deg, #F8F9FB 0%, #EBF0F5 50%, #F0F2F5 100%)', minHeight: '80vh', padding: '48px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {/* Page header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#B8860B', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Moteur de recherche
            </span>
            <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#1B3A5C', marginTop: '8px', marginBottom: '12px', fontFamily: 'Inter, sans-serif' }}>
              Rechercher des OPCVM
            </h1>
            <p style={{ fontSize: '16px', color: '#4A5568', maxWidth: '550px', margin: '0 auto' }}>
              Recherchez et comparez les fonds d&apos;investissement africains par nom, pays ou soci&eacute;t&eacute; de gestion.
            </p>
          </div>

          {/* Search form card */}
          <div style={{
            background: 'white', borderRadius: '12px', padding: '28px',
            border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            marginBottom: '32px',
          }}>
            <form onSubmit={handleFormSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4A5568', marginBottom: '6px' }}>
                  Fonds (Nom / ISIN)
                </label>
                <Select
                  options={fundsOptions}
                  isMulti
                  isSearchable
                  value={selectedOptions}
                  onChange={(newValue) => setSelectedOptions(newValue.map(option => option as Option))}
                  placeholder="Rechercher un fonds..."
                  styles={selectStyles}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4A5568', marginBottom: '6px' }}>
                    Soci&eacute;t&eacute; de gestion
                  </label>
                  <Select
                    options={optionsSociete}
                    value={selectedSociete}
                    onChange={setSelectedSociete}
                    placeholder="S&eacute;lectionnez une soci&eacute;t&eacute;"
                    styles={selectStyles}
                    isClearable
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4A5568', marginBottom: '6px' }}>
                    Pays
                  </label>
                  <Select
                    options={optionsPays}
                    value={selectedPays}
                    onChange={setSelectedPays}
                    placeholder="S&eacute;lectionnez un pays"
                    styles={selectStyles}
                    isClearable
                  />
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <button type="submit" style={{
                  padding: '10px 32px', backgroundColor: '#1B3A5C', color: 'white',
                  border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600,
                  cursor: 'pointer',
                }}>
                  Rechercher
                </button>
              </div>
            </form>
            {error && (
              <p style={{ textAlign: 'center', color: '#e53e3e', marginTop: '16px', fontSize: '14px' }}>{error}</p>
            )}
          </div>

          {/* Results table */}
          {funds && funds.data.fonds.length > 0 && (
            <div style={{
              background: 'white', borderRadius: '12px',
              border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              overflow: 'hidden',
            }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#1B3A5C' }}>
                  {funds.data.fonds.length} fonds trouv&eacute;s
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    style={{ padding: '6px 10px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '13px', color: '#4A5568' }}
                  >
                    <option value={20}>20 / page</option>
                    <option value={50}>50 / page</option>
                    <option value={100}>100 / page</option>
                  </select>
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8F9FB' }}>
                    {headers.tabAccueil.map((header) => (
                      <th key={header.key} onClick={() => handleSort(header.key)} style={{
                        padding: '12px 20px', textAlign: 'left', fontSize: '13px', fontWeight: 600,
                        color: '#1B3A5C', cursor: 'pointer', borderBottom: '2px solid #E2E8F0',
                      }}>
                        {header.label} {sortConfig.key === header.key && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item: any) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #EDF2F7', transition: 'background 0.15s' }}>
                      <td style={{ padding: '12px 20px' }}>
                        <Link href={`/funds/${generateFundSlug(item?.nom_fond || '', item?.code_ISIN || '', item.id)}`} style={{
                          color: '#1B3A5C', textDecoration: 'none', fontWeight: 500, fontSize: '14px',
                        }}>
                          {item?.nom_fond}
                        </Link>
                      </td>
                      <td style={{ padding: '12px 20px', fontSize: '14px', color: '#4A5568' }}>{item.pays}</td>
                      <td style={{ padding: '12px 20px', fontSize: '14px', color: '#4A5568' }}>{item.societe_gestion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ padding: '16px 20px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
                  {currentPage > 1 && (
                    <button onClick={() => setCurrentPage(currentPage - 1)} style={{
                      padding: '8px 16px', backgroundColor: '#EBF0F5', color: '#1B3A5C',
                      border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                    }}>
                      Pr&eacute;c&eacute;dent
                    </button>
                  )}
                  <span style={{ fontSize: '13px', color: '#4A5568' }}>{currentPage} / {totalPages}</span>
                  {currentPage < totalPages && (
                    <button onClick={() => setCurrentPage(currentPage + 1)} style={{
                      padding: '8px 16px', backgroundColor: '#1B3A5C', color: 'white',
                      border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                    }}>
                      Suivant
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}
