"use client";
import { urlconstant } from "@/lib/constants";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Swal from "sweetalert2";
import Headermenu from '@/components/layout/HeaderMenu';
import Sidebar from '@/components/layout/AdminSidebar';
import PageHeader from "@/components/common/PageHeader";

export default function PendingAccounts() {
  const [id, setId] = useState<string>('');
  const router = useRouter();
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('userId');
    if (stored) setId(stored);
  }, []);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const response = await fetch(`${urlconstant}/api/pending-accounts`);
      const data = await response.json();
      setPendingUsers(data?.data?.userss || []);
    } catch (error) {
      console.error("Erreur lors du chargement des comptes en attente:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleActivateUser = async (userId: number) => {
    Swal.fire({
      title: 'Valider ce compte ?',
      text: "L'utilisateur pourra accéder à son espace après validation.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, valider',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#22c55e',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${urlconstant}/api/activate-user/${userId}`, {
            method: 'POST',
          });
          if (response.ok) {
            Swal.fire({
              title: 'Validé !',
              text: "Le compte a été activé avec succès.",
              icon: 'success',
              confirmButtonText: 'OK',
            });
            fetchPendingUsers();
          } else {
            throw new Error('Erreur lors de la validation');
          }
        } catch (error) {
          Swal.fire({
            title: 'Erreur',
            text: "Une erreur est survenue lors de la validation.",
            icon: 'error',
          });
        }
      }
    });
  };

  const handleRejectUser = async (userId: number) => {
    Swal.fire({
      title: 'Rejeter ce compte ?',
      text: "Le compte sera supprimé définitivement.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, rejeter',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#ef4444',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${urlconstant}/api/reject-user/${userId}`, {
            method: 'POST',
          });
          if (response.ok) {
            Swal.fire({
              title: 'Rejeté',
              text: "Le compte a été supprimé.",
              icon: 'success',
              confirmButtonText: 'OK',
            });
            fetchPendingUsers();
          } else {
            throw new Error('Erreur lors du rejet');
          }
        } catch (error) {
          Swal.fire({
            title: 'Erreur',
            text: "Une erreur est survenue lors du rejet.",
            icon: 'error',
          });
        }
      }
    });
  };

  const getTypeLabel = (typeId: any) => {
    const types: Record<string, string> = {
      '0': 'Administrateur',
      '1': 'Particulier',
      '2': 'Société de gestion',
      '3': 'Investisseur institutionnel',
      '4': 'Data requester',
      '5': 'Pays / Régulateur',
      '6': 'Distributeur',
    };
    return types[String(typeId)] || typeId;
  };

  return (
    <Fragment>
      <div className="flex bg-gray-100">
        <Sidebar id={id} />
        <div className="flex-1 ml-64">
          <Headermenu />
          <div className="content-wrapper2">
            <div className="container-full">
              <section className="content">
                <PageHeader
                  title="Comptes à valider"
                  breadcrumbs={[
                    { label: 'Admin', link: `/panel/admin/dashboard` },
                    { label: 'Comptes à valider' },
                  ]}
                />
                <div className="col-12">
                  <div className="box">
                    <div className="box-body">
                      <p>
                        <span className="text-primary">Demandes de comptes en attente de validation</span>
                      </p>
                      <hr />

                      {loading ? (
                        <div className="text-center p-4">Chargement...</div>
                      ) : pendingUsers.length === 0 ? (
                        <div className="text-center p-4 text-muted">
                          Aucun compte en attente de validation.
                        </div>
                      ) : (
                        <div className="table-responsive">
                          <table className="table table-bordered table-hover">
                            <thead className="table-header">
                              <tr>
                                <th>Email</th>
                                <th>Type</th>
                                <th>Dénomination</th>
                                <th>Pays</th>
                                <th>Date inscription</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {pendingUsers.map((user: any) => (
                                <tr key={user.id}>
                                  <td>{user.email}</td>
                                  <td>{getTypeLabel(user.typeusers_id)}</td>
                                  <td>{user.denomination || '-'}</td>
                                  <td>{user.pays || '-'}</td>
                                  <td>{user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : '-'}</td>
                                  <td>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                      <button
                                        className="btn btn-success btn-sm"
                                        onClick={() => handleActivateUser(user.id)}
                                      >
                                        Valider
                                      </button>
                                      <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleRejectUser(user.id)}
                                      >
                                        Rejeter
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
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
