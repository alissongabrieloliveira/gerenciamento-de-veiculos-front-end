// src/pages/MovimentacoesPage.jsx
import React, { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";
import {
  Truck,
  Search,
  LogIn,
  LogOut,
  ArrowRightCircle,
  ArrowLeftCircle,
  AlertTriangle,
} from "lucide-react";

function MovimentacoesPage() {
  const [placa, setPlaca] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'entrada' | 'saida' | 'nao_encontrado'
  const [veiculoEmPatio, setVeiculoEmPatio] = useState(null); // movimentação ativa (saida)
  const [error, setError] = useState(null);

  // Entrada
  const [pessoaDoc, setPessoaDoc] = useState("");
  const [pessoaData, setPessoaData] = useState(null);
  const [postoControle, setPostoControle] = useState("Portaria Principal");
  const [veiculoCadastrado, setVeiculoCadastrado] = useState(null);

  // ➕ Novos estados da ENTRADA
  const [kmEntrada, setKmEntrada] = useState("");
  const [motivoVisita, setMotivoVisita] = useState("");
  const [setorVisitadoId, setSetorVisitadoId] = useState("");

  // Saída
  const [kmSaida, setKmSaida] = useState("");
  const [observacao, setObservacao] = useState("");

  // ----------------------------------------------------
  // Busca por Placa
  // ----------------------------------------------------

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    setStatus(null);
    setLoading(true);
    setVeiculoEmPatio(null);
    setVeiculoCadastrado(null);
    setPessoaData(null);
    setKmSaida("");
    setObservacao("");

    // limpar campos da entrada
    setKmEntrada("");
    setMotivoVisita("");
    setSetorVisitadoId("");

    try {
      const response = await api.get(`/movimentacoes/status/${placa}`);
      const data = response.data;

      if (data.status === "patio") {
        // veículo está dentro → registrar SAÍDA
        setStatus("saida");
        setVeiculoEmPatio(data.movimentacao);
        setVeiculoCadastrado(data.movimentacao.veiculo);
        setPessoaData(data.movimentacao.pessoa);
      } else if (data.status === "fora") {
        // veículo cadastrado, mas fora → registrar ENTRADA
        setStatus("entrada");
        setVeiculoCadastrado(data.veiculo);
      } else {
        // placa não cadastrada
        setStatus("nao_encontrado");
      }
    } catch (err) {
      console.error("Erro na busca:", err);
      setError(
        err.response?.data?.error || "Erro ao consultar status da placa."
      );
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // Entrada (CHECK-IN)
  // ----------------------------------------------------

  const handlePessoaSearch = async () => {
    setError(null);
    setPessoaData(null);
    if (!pessoaDoc) return;

    try {
      const response = await api.get(`/pessoas/documento/${pessoaDoc}`);
      setPessoaData(response.data);
    } catch (err) {
      console.error("Pessoa não encontrada:", err);
      setError(
        "Pessoa não encontrada. Cadastre-a antes de registrar a entrada."
      );
      setPessoaData(null);
    }
  };

  const handleEntradaSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!veiculoCadastrado || !pessoaData) {
      setError("Veículo ou Pessoa inválida para o registro de Entrada.");
      return;
    }

    // validações dos novos campos
    if (!kmEntrada || !motivoVisita || !setorVisitadoId) {
      setError(
        "KM de entrada, motivo da visita e setor visitado são obrigatórios."
      );
      return;
    }

    // mapear descrição do posto para ID (ajuste esses IDs conforme sua tabela)
    const postosMap = {
      "Portaria Principal": 1,
      "Portaria Secundaria": 2,
    };

    const id_posto_controle = postosMap[postoControle];

    if (!id_posto_controle) {
      setError("Posto de controle inválido.");
      return;
    }

    try {
      await api.post("/movimentacoes/entrada", {
        id_veiculo: veiculoCadastrado.id,
        id_pessoa: pessoaData.id,
        km_entrada: kmEntrada,
        motivo_da_visita: motivoVisita,
        id_setor_visitado: setorVisitadoId,
        id_posto_controle,
      });

      alert("Entrada registrada com sucesso!");
      setPlaca("");
      setPessoaDoc("");
      setStatus(null);
      setPessoaData(null);
      setVeiculoCadastrado(null);
      setKmEntrada("");
      setMotivoVisita("");
      setSetorVisitadoId("");
    } catch (err) {
      console.error("Erro ao registrar entrada:", err);
      setError(err.response?.data?.error || "Erro ao registrar entrada.");
    }
  };

  // ----------------------------------------------------
  // Saída (CHECK-OUT)
  // ----------------------------------------------------

  const handleSaidaSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!veiculoEmPatio || !veiculoEmPatio.id) {
      setError("Nenhuma movimentação ativa encontrada para registrar a saída.");
      return;
    }

    if (!kmSaida) {
      setError("O KM de saída é obrigatório.");
      return;
    }

    try {
      await api.put(`/movimentacoes/saida/${veiculoEmPatio.id}`, {
        km_saida: kmSaida,
        observacao: observacao || null,
      });

      alert("Saída registrada com sucesso!");
      setPlaca("");
      setStatus(null);
      setVeiculoEmPatio(null);
      setVeiculoCadastrado(null);
      setPessoaData(null);
      setKmSaida("");
      setObservacao("");
    } catch (err) {
      console.error("Erro ao registrar saída:", err);
      setError(err.response?.data?.error || "Erro ao registrar saída.");
    }
  };

  // ----------------------------------------------------
  // Render
  // ----------------------------------------------------

  return (
    <DashboardLayout
      pageTitle="Controle de Movimentação"
      pageSubtitle="Registre entrada e saída de veículos do pátio."
    >
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        {/* 1. Busca Principal */}
        <form
          onSubmit={handleSearch}
          className="flex gap-4 items-end border-b pb-6 mb-6"
        >
          <div className="flex-grow max-w-sm">
            <label
              htmlFor="placa"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Buscar Placa
            </label>
            <div className="relative">
              <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="placa"
                value={placa}
                onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                placeholder="Ex: ABC1234"
                required
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-lg font-bold uppercase focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || placa.length < 7}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-md disabled:bg-gray-400"
            >
              <Search className="h-5 w-5 mr-2" />
              {loading ? "Buscando..." : "Consultar Placa"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" /> {error}
          </div>
        )}

        {/* 2. Fluxo */}
        {status && (
          <div className="mt-4 p-6 border-2 border-dashed rounded-xl bg-gray-50">
            {status === "entrada" && veiculoCadastrado && (
              <EntradaForm
                veiculo={veiculoCadastrado}
                pessoaDoc={pessoaDoc}
                setPessoaDoc={setPessoaDoc}
                pessoaData={pessoaData}
                handlePessoaSearch={handlePessoaSearch}
                postoControle={postoControle}
                setPostoControle={setPostoControle}
                kmEntrada={kmEntrada}
                setKmEntrada={setKmEntrada}
                motivoVisita={motivoVisita}
                setMotivoVisita={setMotivoVisita}
                setorVisitadoId={setorVisitadoId}
                setSetorVisitadoId={setSetorVisitadoId}
                handleEntradaSubmit={handleEntradaSubmit}
                error={error}
              />
            )}

            {status === "saida" && veiculoEmPatio && (
              <SaidaForm
                movimentacao={veiculoEmPatio}
                veiculo={veiculoCadastrado}
                pessoa={pessoaData}
                postoControle={postoControle}
                setPostoControle={setPostoControle}
                kmSaida={kmSaida}
                setKmSaida={setKmSaida}
                observacao={observacao}
                setObservacao={setObservacao}
                handleSaidaSubmit={handleSaidaSubmit}
              />
            )}

            {status === "nao_encontrado" && (
              <div className="text-center py-10">
                <h3 className="text-xl font-semibold text-red-600 mb-2">
                  Placa Não Encontrada
                </h3>
                <p className="text-gray-600">
                  O veículo com a placa <strong>{placa}</strong> não está
                  cadastrado.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Por favor, cadastre o veículo antes de registrar a
                  movimentação.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// ----------------------------------------------------
// ENTRADA
// ----------------------------------------------------

const EntradaForm = ({
  veiculo,
  pessoaDoc,
  setPessoaDoc,
  pessoaData,
  handlePessoaSearch,
  postoControle,
  setPostoControle,
  kmEntrada,
  setKmEntrada,
  motivoVisita,
  setMotivoVisita,
  setorVisitadoId,
  setSetorVisitadoId,
  handleEntradaSubmit,
  error,
}) => {
  // Ajuste esses IDs/Nomes conforme suas tabelas de referência
  const SETORES = [
    { id: 1, nome: "Carregamento" },
    { id: 2, nome: "Escritório" },
    // ...
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-green-600 flex items-center border-b pb-2">
        <LogIn className="h-6 w-6 mr-2" />
        Registro de ENTRADA
      </h3>

      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
        <p className="text-sm font-semibold text-green-700">
          Veículo Cadastrado:
        </p>
        <p className="text-lg font-bold text-green-900 mt-1">
          {veiculo.placa} - {veiculo.modelo}
        </p>
      </div>

      <div className="border p-4 rounded-lg">
        <label
          htmlFor="pessoaDoc"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Documento da Pessoa (Motorista/Visitante)
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            id="pessoaDoc"
            value={pessoaDoc}
            onChange={(e) => setPessoaDoc(e.target.value)}
            placeholder="CPF/RG"
            required
            className="flex-grow px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <button
            onClick={handlePessoaSearch}
            type="button"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
          >
            Buscar Pessoa
          </button>
        </div>

        {pessoaData && (
          <div className="mt-3 p-3 bg-indigo-50 rounded-lg">
            <p className="text-sm font-semibold text-indigo-700">
              Pessoa Encontrada:
            </p>
            <p className="text-md font-bold">{pessoaData.nome}</p>
            <p className="text-xs text-indigo-600">
              {pessoaData.tipo ? `${pessoaData.tipo} - ` : ""}
              Doc: {pessoaData.documento}
            </p>
          </div>
        )}
        {!pessoaData && pessoaDoc && (
          <p className="mt-3 text-sm text-red-600">
            Pessoa não encontrada. Por favor, cadastre em{" "}
            <strong>Cadastros &gt; Pessoas</strong>.
          </p>
        )}
      </div>

      {/* KM de Entrada */}
      <div>
        <label
          htmlFor="kmEntrada"
          className="block text-sm font-medium text-gray-700"
        >
          KM de Entrada
        </label>
        <input
          id="kmEntrada"
          type="number"
          min="0"
          step="0.1"
          value={kmEntrada}
          onChange={(e) => setKmEntrada(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
          placeholder="Informe o KM atual do veículo"
        />
      </div>

      {/* Motivo da Visita */}
      <div>
        <label
          htmlFor="motivoVisita"
          className="block text-sm font-medium text-gray-700"
        >
          Motivo da Visita
        </label>
        <input
          id="motivoVisita"
          type="text"
          value={motivoVisita}
          onChange={(e) => setMotivoVisita(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
          placeholder="Ex: Entrega de carga, visita ao escritório..."
        />
      </div>

      {/* Setor Visitado */}
      <div>
        <label
          htmlFor="setorVisitado"
          className="block text-sm font-medium text-gray-700"
        >
          Setor Visitado
        </label>
        <select
          id="setorVisitado"
          value={setorVisitadoId}
          onChange={(e) => setSetorVisitadoId(Number(e.target.value))}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
        >
          <option value="">Selecione um setor</option>
          {SETORES.map((setor) => (
            <option key={setor.id} value={setor.id}>
              {setor.nome}
            </option>
          ))}
        </select>
      </div>

      {/* Posto de Controle */}
      <div>
        <label
          htmlFor="postoControle"
          className="block text-sm font-medium text-gray-700"
        >
          Posto de Controle
        </label>
        <select
          id="postoControle"
          value={postoControle}
          onChange={(e) => setPostoControle(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
        >
          <option value="Portaria Principal">Portaria Principal</option>
          <option value="Portaria Secundaria">Portaria Secundária</option>
        </select>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <button
        onClick={handleEntradaSubmit}
        disabled={
          !veiculo ||
          !pessoaData ||
          !kmEntrada ||
          !motivoVisita ||
          !setorVisitadoId
        }
        className="w-full flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg text-lg font-bold hover:bg-green-700 transition shadow-md disabled:bg-gray-400"
      >
        <ArrowRightCircle className="h-6 w-6 mr-3" />
        CONFIRMAR ENTRADA
      </button>
    </div>
  );
};

// ----------------------------------------------------
// SAÍDA
// ----------------------------------------------------

const SaidaForm = ({
  movimentacao,
  veiculo,
  pessoa,
  postoControle,
  setPostoControle,
  kmSaida,
  setKmSaida,
  observacao,
  setObservacao,
  handleSaidaSubmit,
}) => (
  <div className="space-y-6">
    <h3 className="text-2xl font-bold text-red-600 flex items-center border-b pb-2">
      <LogOut className="h-6 w-6 mr-2" />
      Registro de SAÍDA
    </h3>

    <div className="grid grid-cols-2 gap-4">
      <InfoBox title="Veículo" value={`${veiculo.placa} - ${veiculo.modelo}`} />
      <InfoBox
        title="Pessoa"
        value={`${pessoa.nome}${pessoa.tipo ? ` (${pessoa.tipo})` : ""}`}
      />
      <InfoBox
        title="Entrada em"
        value={new Date(movimentacao.data_entrada).toLocaleString("pt-BR")}
      />
      <InfoBox title="Posto de Entrada" value={movimentacao.posto_controle} />
    </div>

    {/* KM de Saída */}
    <div>
      <label
        htmlFor="kmSaida"
        className="block text-sm font-medium text-gray-700"
      >
        KM de Saída
      </label>
      <input
        id="kmSaida"
        type="number"
        min="0"
        step="0.1"
        value={kmSaida}
        onChange={(e) => setKmSaida(e.target.value)}
        required
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
        placeholder="Informe o KM atual do veículo"
      />
    </div>

    {/* Posto de Controle de Saída */}
    <div>
      <label
        htmlFor="postoControleSaida"
        className="block text-sm font-medium text-gray-700"
      >
        Posto de Controle de Saída
      </label>
      <select
        id="postoControleSaida"
        value={postoControle}
        onChange={(e) => setPostoControle(e.target.value)}
        required
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
      >
        <option value="Portaria Principal">Portaria Principal</option>
        <option value="Portaria Secundaria">Portaria Secundária</option>
      </select>
    </div>

    {/* Observação opcional */}
    <div>
      <label
        htmlFor="observacaoSaida"
        className="block text-sm font-medium text-gray-700"
      >
        Observações (opcional)
      </label>
      <textarea
        id="observacaoSaida"
        rows={3}
        value={observacao}
        onChange={(e) => setObservacao(e.target.value)}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
        placeholder="Ex: veículo saiu com lacre conferido..."
      />
    </div>

    <button
      onClick={handleSaidaSubmit}
      disabled={!kmSaida}
      className="w-full flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg text-lg font-bold hover:bg-red-700 transition shadow-md disabled:bg-gray-400"
    >
      <ArrowLeftCircle className="h-6 w-6 mr-3" />
      CONFIRMAR SAÍDA
    </button>
  </div>
);

// Auxiliar
const InfoBox = ({ title, value }) => (
  <div className="p-3 bg-gray-100 rounded-lg">
    <p className="text-xs font-medium text-gray-500">{title}</p>
    <p className="text-sm font-bold text-gray-800 mt-1">{value}</p>
  </div>
);

export default MovimentacoesPage;
