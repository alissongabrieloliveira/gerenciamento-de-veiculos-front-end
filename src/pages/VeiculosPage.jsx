// src/pages/VeiculosPage.jsx
import React, { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";
import {
  PlusCircle,
  Edit,
  Trash2,
  Search,
  RefreshCw,
  CarFront,
} from "lucide-react";

function VeiculosPage() {
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Estado para o Modal (Criação/Edição)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVeiculo, setEditingVeiculo] = useState(null);
  const [formState, setFormState] = useState({
    placa: "",
    modelo: "",
    cor: "",
  });
  const [formError, setFormError] = useState("");

  // Função para buscar dados
  const fetchVeiculos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/veiculos");
      setVeiculos(response.data);
    } catch (err) {
      console.error("Erro ao buscar veículos:", err);
      setError("Não foi possível carregar a lista de veículos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVeiculos();
  }, []);

  // ----------------------------------------------------
  // Lógica do Modal/Formulário (CRUD)
  // ----------------------------------------------------

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    // Normaliza a placa para maiúsculas
    if (name === "placa") {
      setFormState((prev) => ({ ...prev, [name]: value.toUpperCase() }));
      return;
    }

    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = (veiculo = null) => {
    setFormError("");
    if (veiculo) {
      // Modo Edição
      setEditingVeiculo(veiculo);
      setFormState({
        placa: veiculo.placa,
        modelo: veiculo.modelo,
        cor: veiculo.cor,
      });
    } else {
      // Modo Criação
      setEditingVeiculo(null);
      setFormState({ placa: "", modelo: "", cor: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVeiculo(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError("");

    // Validação básica da placa
    if (formState.placa.length < 7 || formState.placa.length > 8) {
      setFormError("A placa deve ter entre 7 e 8 caracteres.");
      return;
    }

    try {
      if (editingVeiculo) {
        // UPDATE
        await api.put(`/veiculos/${editingVeiculo.id}`, formState);
      } else {
        // CREATE
        await api.post("/veiculos", formState);
      }

      handleCloseModal();
      fetchVeiculos(); // Atualiza a lista
    } catch (err) {
      const message =
        err.response?.data?.error ||
        "Erro ao salvar o veículo. Verifique os dados.";
      setFormError(message);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Tem certeza que deseja excluir este veículo? Se ele estiver no pátio, a exclusão será bloqueada."
      )
    ) {
      try {
        await api.delete(`/veiculos/${id}`);
        fetchVeiculos(); // Atualiza a lista
      } catch (err) {
        const message =
          err.response?.data?.error ||
          "Erro ao excluir o veículo. (Pode estar em uso no pátio)";
        alert(message);
      }
    }
  };

  // Filtro e Busca
  const filteredVeiculos = veiculos.filter(
    (veiculo) =>
      veiculo.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      veiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ----------------------------------------------------
  // Renderização
  // ----------------------------------------------------

  return (
    <DashboardLayout
      pageTitle="Cadastro de Veículos"
      pageSubtitle="Gerencie veículos registrados para acesso."
    >
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        {/* Cabeçalho e Ações */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por placa ou modelo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex space-x-3">
            <button
              onClick={fetchVeiculos}
              className="flex items-center justify-center p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition"
              title="Atualizar lista"
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-md"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Novo Veículo
            </button>
          </div>
        </div>

        {/* Tabela de Veículos */}
        {loading && !veiculos.length ? (
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
                    Placa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Modelo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cor
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredVeiculos.map((veiculo) => (
                  <tr key={veiculo.id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {veiculo.placa}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {veiculo.modelo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {veiculo.cor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleOpenModal(veiculo)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(veiculo.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredVeiculos.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                Nenhum veículo encontrado.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de Criação/Edição */}
      {isModalOpen && (
        <VeiculoModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          formState={formState}
          handleFormChange={handleFormChange}
          error={formError}
          isEditing={!!editingVeiculo}
        />
      )}
    </DashboardLayout>
  );
}

// ----------------------------------------------------
// Componente Modal
// ----------------------------------------------------
const VeiculoModal = ({
  isOpen,
  onClose,
  onSave,
  formState,
  handleFormChange,
  error,
  isEditing,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 transition-opacity">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {isEditing ? "Editar Veículo" : "Novo Veículo"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            &times;
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-4">
          {/* Placa */}
          <div>
            <label
              htmlFor="placa"
              className="block text-sm font-medium text-gray-700"
            >
              Placa
            </label>
            <input
              type="text"
              name="placa"
              id="placa"
              required
              maxLength={8}
              value={formState.placa}
              onChange={handleFormChange}
              disabled={isEditing} // Impedir edição da placa para evitar problemas de integridade
              className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm uppercase ${
                isEditing ? "bg-gray-100" : ""
              }`}
            />
            {isEditing && (
              <p className="text-xs text-gray-500 mt-1">
                A placa não pode ser alterada após o cadastro.
              </p>
            )}
          </div>

          {/* Modelo */}
          <div>
            <label
              htmlFor="modelo"
              className="block text-sm font-medium text-gray-700"
            >
              Modelo (Ex: Iveco Tector, Toyota Bandeirante)
            </label>
            <input
              type="text"
              name="modelo"
              id="modelo"
              required
              value={formState.modelo}
              onChange={handleFormChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
            />
          </div>

          {/* Cor */}
          <div>
            <label
              htmlFor="cor"
              className="block text-sm font-medium text-gray-700"
            >
              Cor
            </label>
            <input
              type="text"
              name="cor"
              id="cor"
              required
              value={formState.cor}
              onChange={handleFormChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
            />
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-md"
            >
              {isEditing ? "Salvar Alterações" : "Cadastrar Veículo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VeiculosPage;
