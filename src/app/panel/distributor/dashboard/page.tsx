"use client";
import { urlconstant } from "@/lib/constants";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Headermenu from '@/components/layout/HeaderMenu';
import DistributorSidebar from '@/components/layout/DistributorSidebar';

export default function DistributorDashboard() {
  const router = useRouter();
  const [id, setId] = useState<string>('');
  useEffect(() => {
    const stored = localStorage.getItem('userId');
    if (stored) setId(stored);
  }, []);

  return (
    <Fragment>
    <div className="flex bg-gray-100">
      <DistributorSidebar id={id} />
      <div className="flex-1 ml-64">
        <Headermenu />
      <div className="content-wrapper2">
        {/* Main content */}
        <section className="content">
          <div className="p-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Panel Distributeur</h1>
          </div>

        <div className="col-xl-12 col-lg-12 mb-4">
                    <div className="card text-center shadow-lg border-0 rounded-lg overflow-hidden">
                      <div className="card-body bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-500 text-white">
                        <img src="/images/avatar/avatar-13.png" className="bg-light rounded-circle avatar-lg img-thumbnail border-4 border-white mb-3" alt="profile-image" />
                        <h4 className="mb-0 mt-2">Bienvenue sur votre espace distributeur</h4>
                      </div>
                    </div>
                  </div>
        </section>
      </div>
      </div>
      </div>
    </Fragment>
  );
}
