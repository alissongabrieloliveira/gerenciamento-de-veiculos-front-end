// src/pages/RelatoriosPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";
import {
  FileText,
  Search,
  RefreshCw,
  Calendar,
  Truck,
  User,
} from "lucide-react";

function RelatoriosPage() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtros de data
  const today = new Date().toISOString().split("T")[0];
  const [dataInicio, setDataInicio] = useState(today);
  const [dataFim, setDataFim] = useState(today);

  // ----------------------------------------------------
  // Lógica de Busca de Movimentações
  // ----------------------------------------------------

  const fetchMovimentacoes = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        dataInicio,
        dataFim,
      }).toString();

      const response = await api.get(`/movimentacoes/relatorio?${params}`);
      setMovimentacoes(response.data || []);
    } catch (err) {
      console.error("Erro ao buscar histórico:", err);
      setError("Não foi possível carregar o histórico de movimentações.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Busca inicial para o dia atual
    fetchMovimentacoes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // só na montagem

  // ----------------------------------------------------
  // Lógica de Filtro na Tabela
  // ----------------------------------------------------

  const formatDateTime = (isoString) => {
    if (!isoString) return "Pátio";
    return new Date(isoString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredMovimentacoes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return movimentacoes;

    return movimentacoes.filter((mov) => {
      // Placa
      if (mov.veiculo?.placa?.toLowerCase().includes(term)) return true;

      // Nome
      if (mov.pessoa?.nome?.toLowerCase().includes(term)) return true;

      // Documento (pode ser numérico ou string)
      const documento = mov.pessoa?.documento;
      if (documento && String(documento).toLowerCase().includes(term))
        return true;

      return false;
    });
  }, [movimentacoes, searchTerm]);

  // ----------------------------------------------------
  // KPIs / Resumo Rápido
  // ----------------------------------------------------

  const totalRegistros = filteredMovimentacoes.length;
  const emPatio = filteredMovimentacoes.filter((m) => !m.data_saida).length;
  const finalizadas = totalRegistros - emPatio;
  const veiculosUnicos = useMemo(() => {
    const setPlacas = new Set(
      filteredMovimentacoes
        .map((m) => m.veiculo?.placa)
        .filter((p) => Boolean(p))
    );
    return setPlacas.size;
  }, [filteredMovimentacoes]);

  // ----------------------------------------------------
  // Renderização
  // ----------------------------------------------------

  return (
    <DashboardLayout
      pageTitle="Relatório de Histórico"
      pageSubtitle="Consulte, filtre e analise todas as movimentações registradas."
    >
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
        {/* Cabeçalho, Filtros e Ações */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="flex gap-4 flex-wrap">
              {/* Filtro Data Início */}
              <div>
                <label
                  htmlFor="dataInicio"
                  className="block text-xs font-medium text-gray-500 mb-1"
                >
                  Data Início
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    id="dataInicio"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Filtro Data Fim */}
              <div>
                <label
                  htmlFor="dataFim"
                  className="block text-xs font-medium text-gray-500 mb-1"
                >
                  Data Fim
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    id="dataFim"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Botão de Aplicar/Atualizar */}
            <button
              onClick={fetchMovimentacoes}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:bg-gray-400"
              title="Atualizar relatório"
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              {loading ? "Buscando..." : "Aplicar Filtro"}
            </button>
          </div>

          {/* Barra de Busca (Filtro Local) */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Filtrar por placa, nome ou documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div>
              <p className="text-xs text-gray-500">Total de registros</p>
              <p className="text-xl font-semibold text-gray-900">
                {totalRegistros}
              </p>
            </div>
            <FileText className="h-8 w-8 text-indigo-500" />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div>
              <p className="text-xs text-gray-500">Veículos distintos</p>
              <p className="text-xl font-semibold text-gray-900">
                {veiculosUnicos}
              </p>
            </div>
            <Truck className="h-8 w-8 text-emerald-500" />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div>
              <p className="text-xs text-gray-500">Em pátio</p>
              <p className="text-xl font-semibold text-gray-900">{emPatio}</p>
            </div>
            <User className="h-8 w-8 text-amber-500" />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div>
              <p className="text-xs text-gray-500">Finalizadas</p>
              <p className="text-xl font-semibold text-gray-900">
                {finalizadas}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-emerald-600" />
          </div>
        </div>

        {/* Tabela de Movimentações */}
        {loading && movimentacoes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Carregando dados...
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Placa / Veículo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pessoa / Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entrada (Data/KM)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saída (Data/KM)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Motivo/Setor
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredMovimentacoes.map((mov) => (
                  <tr key={mov.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          mov.data_saida === null
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {mov.data_saida === null ? "No Pátio" : "Finalizada"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {mov.veiculo?.placa}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {mov.veiculo?.modelo}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {mov.pessoa?.nome}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {mov.pessoa?.tipo} - Doc: {mov.pessoa?.documento ?? "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {formatDateTime(mov.data_entrada)}
                      </div>
                      <div className="text-gray-500 text-xs">
                        KM: {mov.km_entrada ?? "-"} - Posto:{" "}
                        {mov.posto_controle}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {mov.data_saida ? formatDateTime(mov.data_saida) : "-"}
                      </div>
                      <div className="text-gray-500 text-xs">
                        KM: {mov.km_saida || "-"}
                        {mov.observacao &&
                          ` - Obs: ${mov.observacao.substring(0, 20)}...`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-normal max-w-xs">
                      <div className="font-medium text-gray-900">
                        {mov.setor_visitado?.nome}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {mov.motivo_da_visita}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredMovimentacoes.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                Nenhuma movimentação encontrada para o período e filtros.
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default RelatoriosPage;
