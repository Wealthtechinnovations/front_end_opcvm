"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DataRequesterSidebar from '@/components/layout/DataRequesterSidebar';
import Headermenu from '@/components/layout/HeaderMenu';

export default function DataRequesterDashboard() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/panel/data-requester/login');
    }
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <DataRequesterSidebar />

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        <Headermenu />
        <div className="p-6 mt-16">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Panel Data Requester</h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Bienvenue sur votre espace data</h2>
            <p className="text-gray-500">
              Vous pouvez accéder à vos données et gérer vos requêtes depuis le menu latéral.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
