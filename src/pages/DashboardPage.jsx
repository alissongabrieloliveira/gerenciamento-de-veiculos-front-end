// src/pages/DashboardPage.jsx
import React from "react";

function DashboardPage() {
  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    window.location.href = "/login"; // Redireciona para login
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8 pb-4 border-b">
        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard de Controle de Pátio
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-150"
        >
          Sair
        </button>
      </div>

      <p className="text-lg text-gray-600">
        Parabéns! Você está logado. Este é o painel principal.
      </p>
      <div className="mt-8 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Próximos Passos</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            Adicionar lógica para carregar as métricas do backend (veículos no
            pátio, entradas/saídas hoje).
          </li>
          <li>
            Implementar um componente de rotas privadas (`ProtectedRoute`).
          </li>
          <li>
            Criar páginas de cadastro (Pessoas, Veículos) e o fluxo de
            Movimentações.
          </li>
        </ul>
      </div>
    </div>
  );
}

export default DashboardPage;
