"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Select, { SingleValue } from 'react-select';
import Header from '@/components/layout/Header';
import { urlconstant, urlsite } from "@/lib/constants";

interface Funds {
  data: {
    countriesWithCompanies: any[];
  };
}
interface Pays {
  value: string;
}
interface Option {
  value: string;
  label: string;
}

async function getpays() {
  const data = (await fetch(`${urlconstant}/api/getPaysall`)).json();
  return data;
}

export default function Comparaison() {
  const [pays, setPays] = useState<Funds | null>(null);
  const [optionsPays, setOptionsPays] = useState([]);
  const [selectedPays, setSelectedPays] = useState<Pays | null>(null);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, settotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getpays();
        setPays(data);
        const totalItems = data?.data?.countriesWithCompanies.length || 0;
        settotalPages(Math.ceil(totalItems / itemsPerPage));
        const mappedOptions = data?.data.countriesWithCompanies.map((f: any) => ({
          value: f.pays,
          label: f.pays,
        }));
        setOptionsPays(mappedOptions);
      } catch (error) {
        console.error("Erreur lors de l'appel à l'API :", error);
      }
    }
    fetchData();
  }, []);

  const handlePaysChange = (selectedOption: any) => {
    setSelectedPays(selectedOption.value);
  };

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    if (selectedPays) {
      const filteredPays = pays?.data.countriesWithCompanies.filter(p => p.pays === selectedPays) as any[];
      if (filteredPays.length > 0) {
        setPays({ data: { countriesWithCompanies: filteredPays } });
      }
    }
  };

  const handleSort = (key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
    if (pays && pays.data.countriesWithCompanies) {
      const sorted = [...pays.data.countriesWithCompanies];
      sorted.sort((a, b) => {
        const aVal = a[key], bVal = b[key];
        if (typeof aVal === 'string') return direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        return direction === 'asc' ? (aVal - bVal) : (bVal - aVal);
      });
      setPays({ data: { countriesWithCompanies: sorted } });
    }
  };

  const paginatedData = pays?.data.countriesWithCompanies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) || [];

  return (
    <Fragment>
      <Header />

      <div style={{ background: 'linear-gradient(135deg, #F8F9FB 0%, #EBF0F5 50%, #F0F2F5 100%)', minHeight: '80vh', padding: '48px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Page header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#B8860B', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              G&eacute;ographie
            </span>
            <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#1B3A5C', marginTop: '8px', marginBottom: '12px', fontFamily: 'Inter, sans-serif' }}>
              Pays
            </h1>
            <p style={{ fontSize: '16px', color: '#4A5568' }}>
              Explorez les march&eacute;s financiers africains par pays.
            </p>
          </div>

          {/* Search card */}
          <div style={{
            background: 'white', borderRadius: '12px', padding: '24px',
            border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            marginBottom: '32px',
          }}>
            <form onSubmit={handleFormSubmit} style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '250px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4A5568', marginBottom: '6px' }}>
                  Rechercher un pays
                </label>
                <Select
                  options={optionsPays}
                  onChange={handlePaysChange}
                  placeholder="S&eacute;lectionnez un pays"
                  styles={{
                    control: (base: any) => ({ ...base, borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '14px' }),
                  }}
                />
              </div>
              <button type="submit" style={{
                padding: '10px 24px', backgroundColor: '#1B3A5C', color: 'white',
                border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600,
                cursor: 'pointer', height: '42px',
              }}>
                Rechercher
              </button>
            </form>
          </div>

          {/* Results table */}
          <div style={{
            background: 'white', borderRadius: '12px',
            border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#1B3A5C' }}>
                {pays?.data.countriesWithCompanies.length || 0} pays r&eacute;f&eacute;renc&eacute;s
              </p>
              <select
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(parseInt(e.target.value, 10)); setCurrentPage(1); }}
                style={{ padding: '6px 10px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '13px', color: '#4A5568' }}
              >
                <option value={20}>20 / page</option>
                <option value={50}>50 / page</option>
              </select>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8F9FB' }}>
                  <th onClick={() => handleSort('pays')} style={{
                    padding: '12px 20px', textAlign: 'left', fontSize: '13px', fontWeight: 600,
                    color: '#1B3A5C', cursor: 'pointer', borderBottom: '2px solid #E2E8F0',
                  }}>
                    Pays {sortConfig.key === 'pays' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                  </th>
                  <th onClick={() => handleSort('companyCount')} style={{
                    padding: '12px 20px', textAlign: 'center', fontSize: '13px', fontWeight: 600,
                    color: '#1B3A5C', cursor: 'pointer', borderBottom: '2px solid #E2E8F0',
                  }}>
                    Soci&eacute;t&eacute;s de gestion {sortConfig.key === 'companyCount' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item: any, idx: number) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #EDF2F7', transition: 'background 0.15s' }}>
                    <td style={{ padding: '12px 20px' }}>
                      <Link href={`/pays/${encodeURIComponent(item.pays.replace(/ /g, '-'))}`} style={{
                        color: '#1B3A5C', textDecoration: 'none', fontWeight: 500, fontSize: '14px',
                      }}>
                        {item.pays}
                      </Link>
                    </td>
                    <td style={{ padding: '12px 20px', textAlign: 'center', fontSize: '14px', color: '#4A5568' }}>
                      {item.companyCount}
                    </td>
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
        </div>
      </div>
    </Fragment>
  );
}
