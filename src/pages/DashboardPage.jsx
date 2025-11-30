// src/pages/DashboardPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";
import MetricCard from "../components/metrics/MetricCard";
import RecentMovesTable from "../components/movimentacoes/RecentMovesTable";

function DashboardPage() {
  const [metrics, setMetrics] = useState({
    veiculos_no_patio: 0,
    entradas_hoje: 0,
    saidas_hoje: 0,
    movimentacoes_recentes: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // A função de logout foi movida para o DashboardLayout

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/movimentacoes/dashboard");
      setMetrics(response.data);
      setError(null);
    } catch (err) {
      console.error("Erro ao carregar dados do dashboard:", err);
      // O 401/403 será tratado no interceptor ou no layout
      setError(
        "Não foi possível carregar as métricas do servidor. Verifique sua conexão."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Busca inicial dos dados
    fetchDashboardData();
  }, [fetchDashboardData]);

  // --- Renderização ---

  if (loading && metrics.movimentacoes_recentes.length === 0) {
    // Exibe um loading inicial enquanto o Layout carrega
    return (
      <DashboardLayout
        pageTitle="Dashboard"
        pageSubtitle="Visão geral do sistema"
      >
        <div className="flex items-center justify-center h-64 text-sm text-gray-500">
          Carregando dados...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      pageTitle="Dashboard"
      pageSubtitle="Visão geral do sistema"
    >
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Cards de métricas */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <MetricCard
          title="Veículos no Pátio"
          value={metrics.veiculos_no_patio}
          bg="bg-blue-50"
          iconBg="bg-blue-100"
        />
        <MetricCard
          title="Entradas Hoje"
          value={metrics.entradas_hoje}
          bg="bg-emerald-50"
          iconBg="bg-emerald-100"
        />
        <MetricCard
          title="Saídas Hoje"
          value={metrics.saidas_hoje}
          bg="bg-rose-50"
          iconBg="bg-rose-100"
        />
      </section>

      {/* Movimentação Recente */}
      <RecentMovesTable
        movimentacoes={metrics.movimentacoes_recentes}
        onRefresh={fetchDashboardData}
        loading={loading}
      />
    </DashboardLayout>
  );
}

export default DashboardPage;
