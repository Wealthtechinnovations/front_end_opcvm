// components/Header.tsx
export default function Header() {
    return (
      <header className="bg-blue-700 text-white p-6 shadow-lg flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-3xl font-bold">Société de Gestion - Dashboard</h1>
        <button className="bg-white text-blue-700 px-5 py-2 rounded-lg hover:bg-blue-100 transition duration-300 shadow-md">
          Déconnexion
        </button>
      </header>
    );
  }
  