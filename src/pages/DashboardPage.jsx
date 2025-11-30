// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from "react";
import api from "../services/api";

function DashboardPage() {
  const [metrics, setMetrics] = useState({
    veiculos_no_patio: 0,
    entradas_hoje: 0,
    saidas_hoje: 0,
    movimentacoes_recentes: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    window.location.href = "/login";
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Chamada GET para o novo endpoint de dashboard
        const response = await api.get("/movimentacoes/dashboard");
        setMetrics(response.data);
        setError(null);
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard:", err);
        setError("Não foi possível carregar as métricas do servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatarDataHora = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    });
  };

  // --- Componente de Renderização ---

  if (loading) {
    return (
      <div className="p-8 text-center text-lg">Carregando Dashboard...</div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 font-bold">{error}</div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-300">
        <h1 className="text-3xl font-bold text-gray-800">
          Painel de Operações
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-150"
        >
          Sair
        </button>
      </div>

      {/* 1. Cards de Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <MetricCard
          title="Veículos no Pátio"
          value={metrics.veiculos_no_patio}
          color="bg-blue-100"
        />
        <MetricCard
          title="Entradas Hoje"
          value={metrics.entradas_hoje}
          color="bg-green-100"
        />
        <MetricCard
          title="Saídas Hoje"
          value={metrics.saidas_hoje}
          color="bg-yellow-100"
        />
      </div>

      {/* 2. Movimentações Recentes */}
      <div className="bg-white p-6 shadow-2xl rounded-xl">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
          Movimentações Recentes (Últimos 10)
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Evento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Placa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pessoa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Posto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data/Hora
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {metrics.movimentacoes_recentes.map((mov) => (
                <tr key={mov.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        mov.status === "saiu"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {mov.tipo_evento}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {mov.placa}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {mov.pessoa}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {mov.posto_controle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatarDataHora(mov.data_evento)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {metrics.movimentacoes_recentes.length === 0 && (
          <p className="text-gray-500 mt-4 text-center">
            Nenhuma movimentação recente encontrada.
          </p>
        )}
      </div>
    </div>
  );
}

// Componente auxiliar para os cards de métricas
const MetricCard = ({ title, value, color }) => (
  <div
    className={`p-6 ${color} rounded-xl shadow-lg border border-gray-200 transform hover:scale-[1.02] transition duration-300`}
  >
    <h3 className="text-lg font-medium text-gray-600">{title}</h3>
    <p className="text-5xl font-extrabold text-gray-900 mt-2">{value}</p>
  </div>
);

export default DashboardPage;
