"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Modal, Button } from 'react-bootstrap';
import Select, { SingleValue } from 'react-select';
import Header from '@/components/layout/Header';
import { urlconstant, urlsite } from "@/lib/constants";
import Swal from "sweetalert2";

interface Funds {
  data: {
    societes: any[];
  };
}
interface Pays {
  value: string;
}
interface Option {
  value: string;
  label: string;
}

async function getsociete() {
  const data = (await fetch(`${urlconstant}/api/getsocieterecherche`)).json();
  return data;
}

async function getpays() {
  const data = (await fetch(`${urlconstant}/api/getPays`)).json();
  return data;
}

export default function Comparaison() {
  const headers = [
    { label: 'Nom', key: 'nom' },
    { label: 'Pays', key: 'pays' },
    { label: 'Nombre de fonds', key: 'nombreFonds' },
    { label: 'Encours', key: 'sommeActifNet' },
  ];

  const [selectedSociete, setSelectedSociete] = useState<Option[]>([]);
  const [selectedPays, setSelectedPays] = useState<Pays | null>(null);
  const [optionsSociete, setOptionsSociete] = useState([]);
  const [optionsPays, setOptionsPays] = useState([]);
  const [funds, setFunds] = useState<Funds | null>(null);
  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, settotalPages] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

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
        const mappedOptions = data?.data.paysOptions.map((f: any) => ({
          value: f.value,
          label: f.label,
        }));
        setOptionsPays(mappedOptions);

        const data2 = await getsociete();
        const mappedOptions2 = data2?.data.societes.map((f: any) => ({
          value: f.nom,
          label: f.nom,
        }));
        setOptionsSociete(mappedOptions2);

        const response = await fetch(`${urlconstant}/api/listesociete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const responseData = await response.json();
        if (responseData && responseData.code === 200) {
          Swal.close();
          const totalItems = responseData?.data.societes.length || 0;
          settotalPages(Math.ceil(totalItems / itemsPerPage));
          setFunds(responseData);
        } else {
          Swal.close();
          setError("Aucun résultat trouvé.");
        }
      } catch (err) {
        Swal.close();
        console.error("Erreur lors de l'appel à l'API :", err);
      }
    }
    fetchData();
  }, []);

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    setFunds({ data: { societes: [] } });
    setError("");
    Swal.fire({
      title: 'Veuillez patienter',
      html: 'Chargement des résultats en cours...',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });
    const selectedValues = selectedSociete.map(option => option?.value);
    fetch(`${urlconstant}/api/listesociete?query=${selectedValues.join(',')}&selectedpays=${selectedPays?.value}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
      .then(response => response.json())
      .then(data => {
        Swal.close();
        if (data && data.code === 200) {
          setFunds(data);
          const totalItems = data?.data.societes.length || 0;
          settotalPages(Math.ceil(totalItems / itemsPerPage));
        } else {
          setError("Aucun résultat trouvé. Réessayez avec d'autres critères.");
        }
      })
      .catch(err => {
        Swal.close();
        setError("Erreur de connexion au serveur.");
        console.error('Erreur lors de l\'appel de l\'API :', err);
      });
  };

  const handleSort = (key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
    if (funds && funds.data.societes) {
      const sorted = [...funds.data.societes].filter(item => item[key] !== '-');
      sorted.sort((a, b) => {
        if (key === 'nom' || key === 'pays') {
          return direction === 'asc' ? (a[key] || '').localeCompare(b[key] || '') : (b[key] || '').localeCompare(a[key] || '');
        }
        const numA = parseFloat(a[key]), numB = parseFloat(b[key]);
        if (isNaN(numA) || isNaN(numB)) return 0;
        return direction === 'asc' ? numA - numB : numB - numA;
      });
      setFunds({ data: { societes: sorted } });
    }
  };

  const paginatedData = funds?.data?.societes?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) || [];

  return (
    <Fragment>
      <Header />

      <Modal show={showPopup} onHide={() => setShowPopup(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Action</Modal.Title>
        </Modal.Header>
        <Modal.Body>Pour s&eacute;lectionner 100 &eacute;l&eacute;ments par page, vous devez &ecirc;tre membre.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPopup(false)} style={{ backgroundColor: '#1B3A5C', border: 'none', borderRadius: '6px' }}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      <div style={{ background: 'linear-gradient(135deg, #F8F9FB 0%, #EBF0F5 50%, #F0F2F5 100%)', minHeight: '80vh', padding: '48px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {/* Page header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#B8860B', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Annuaire
            </span>
            <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#1B3A5C', marginTop: '8px', marginBottom: '12px', fontFamily: 'Inter, sans-serif' }}>
              Soci&eacute;t&eacute;s de gestion
            </h1>
            <p style={{ fontSize: '16px', color: '#4A5568' }}>
              Recherchez et comparez les soci&eacute;t&eacute;s de gestion op&eacute;rant sur les march&eacute;s africains.
            </p>
          </div>

          {/* Search card */}
          <div style={{
            background: 'white', borderRadius: '12px', padding: '24px',
            border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            marginBottom: '32px',
          }}>
            <form onSubmit={handleFormSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4A5568', marginBottom: '6px' }}>
                    Soci&eacute;t&eacute;s de gestion
                  </label>
                  <Select
                    isMulti
                    options={optionsSociete}
                    value={selectedSociete}
                    onChange={(newValue) => setSelectedSociete(newValue.map(option => option as Option))}
                    placeholder="Sélectionnez..."
                    styles={{
                      control: (base: any) => ({ ...base, borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '14px' }),
                    }}
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
                    placeholder="Sélectionnez un pays"
                    styles={{
                      control: (base: any) => ({ ...base, borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '14px' }),
                    }}
                  />
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <button type="submit" style={{
                  padding: '10px 32px', backgroundColor: '#1B3A5C', color: 'white',
                  border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                }}>
                  Rechercher
                </button>
              </div>
            </form>
            {error && <p style={{ textAlign: 'center', color: '#DC2626', marginTop: '12px', fontSize: '14px' }}>{error}</p>}
          </div>

          {/* Results table */}
          <div style={{
            background: 'white', borderRadius: '12px',
            border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#1B3A5C' }}>
                {funds?.data?.societes?.length || 0} soci&eacute;t&eacute;s
              </p>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (v === 100) { setShowPopup(true); return; }
                  setItemsPerPage(v); setCurrentPage(1);
                }}
                style={{ padding: '6px 10px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '13px', color: '#4A5568' }}
              >
                <option value={20}>20 / page</option>
                <option value={50}>50 / page</option>
                <option value={100}>100 / page</option>
              </select>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8F9FB' }}>
                    {headers.map((header) => (
                      <th key={header.key} onClick={() => handleSort(header.key)} style={{
                        padding: '12px 20px', textAlign: header.key === 'nom' ? 'left' : 'center',
                        fontSize: '13px', fontWeight: 600, color: '#1B3A5C', cursor: 'pointer',
                        borderBottom: '2px solid #E2E8F0', whiteSpace: 'nowrap',
                      }}>
                        {header.label} {sortConfig.key === header.key && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item: any, idx: number) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #EDF2F7' }}>
                      <td style={{ padding: '12px 20px' }}>
                        <Link href={`/fund-managers/${item.nom.replace(/ /g, '-')}`} style={{
                          color: '#1B3A5C', textDecoration: 'none', fontWeight: 500, fontSize: '14px',
                        }}>
                          {item.nom}
                        </Link>
                      </td>
                      <td style={{ padding: '12px 20px', textAlign: 'center', fontSize: '14px', color: '#4A5568' }}>{item.pays}</td>
                      <td style={{ padding: '12px 20px', textAlign: 'center', fontSize: '14px', color: '#4A5568' }}>{item.nombreFonds}</td>
                      <td style={{ padding: '12px 20px', textAlign: 'center', fontSize: '14px', color: '#4A5568' }}>{item.sommeActifNet}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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
        </div>
      </div>
    </Fragment>
  );
}
