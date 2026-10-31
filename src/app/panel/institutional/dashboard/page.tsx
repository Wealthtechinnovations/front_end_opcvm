"use client";

import InstitutionalSidebar from "@/components/layout/InstitutionalSidebar";
import HeaderMenu from "@/components/layout/HeaderMenu";

export default function InstitutionalDashboard() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <InstitutionalSidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <HeaderMenu />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Panel Investisseur Institutionnel
          </h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-lg">
              Bienvenue sur votre espace institutionnel
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
