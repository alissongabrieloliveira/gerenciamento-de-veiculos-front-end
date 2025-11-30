// src/components/movimentacoes/RecentMovesTable.jsx
import React from "react";
import { RefreshCw, Clock } from "lucide-react";

const formatarDataHora = (timestamp) => {
  if (!timestamp) return "N/A";
  const date = new Date(timestamp);
  return date.toLocaleString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  });
};

function RecentMovesTable({ movimentacoes, onRefresh, loading }) {
  return (
    <section className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">
            Movimentação Recente
          </h2>
          <p className="text-xs text-gray-500">
            Últimas movimentações registradas
          </p>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className={`h-8 w-8 flex items-center justify-center rounded-md border border-gray-200 transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
          }`}
          title="Atualizar"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {movimentacoes.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400 text-xs">
          <div className="h-10 w-10 rounded-full border border-dashed border-gray-300 flex items-center justify-center mb-3">
            <Clock className="h-5 w-5" />
          </div>
          <p className="text-[11px] tracking-wide">
            Nenhuma movimentação registrada
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-gray-500 uppercase tracking-wide">
                <th className="px-6 py-3 text-left font-medium">Evento</th>
                <th className="px-6 py-3 text-left font-medium">Placa</th>
                <th className="px-6 py-3 text-left font-medium">Pessoa</th>
                <th className="px-6 py-3 text-left font-medium">Posto</th>
                <th className="px-6 py-3 text-left font-medium">Data/Hora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {movimentacoes.map((mov) => (
                <tr key={mov.id} className="text-gray-700">
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-[11px] leading-5 font-semibold rounded-full ${
                        mov.status === "saiu"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {mov.tipo_evento}
                    </span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">{mov.placa}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{mov.pessoa}</td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    {mov.posto_controle}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    {formatarDataHora(mov.data_evento)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {loading && (
        <div className="flex items-center justify-center py-4 text-sm text-gray-500">
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Atualizando...
        </div>
      )}
    </section>
  );
}

export default RecentMovesTable;
