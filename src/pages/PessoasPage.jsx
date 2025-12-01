// src/pages/PessoasPage.jsx
import React, { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";
import {
  PlusCircle,
  Edit,
  Trash2,
  Search,
  RefreshCw,
  Smartphone,
} from "lucide-react";

function PessoasPage() {
  const [pessoas, setPessoas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Estado para o Modal (Criação/Edição)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPessoa, setEditingPessoa] = useState(null);
  const [formState, setFormState] = useState({
    nome: "",
    documento: "",
    telefone: "", // Adicionado campo Telefone
    tipo: "Visitante", // Valor padrão ajustado para Visitante, mais comum em portaria
  });
  const [formError, setFormError] = useState("");

  // Função para buscar dados
  const fetchPessoas = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/pessoas");
      setPessoas(response.data);
    } catch (err) {
      console.error("Erro ao buscar pessoas:", err);
      setError("Não foi possível carregar a lista de pessoas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPessoas();
  }, []);

  // ----------------------------------------------------
  // Lógica do Modal/Formulário (CRUD)
  // ----------------------------------------------------

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = (pessoa = null) => {
    setFormError("");
    if (pessoa) {
      // Modo Edição
      setEditingPessoa(pessoa);
      setFormState({
        nome: pessoa.nome,
        documento: pessoa.documento,
        telefone: pessoa.telefone || "", // Preenche telefone
        tipo: pessoa.tipo,
      });
    } else {
      // Modo Criação
      setEditingPessoa(null);
      setFormState({
        nome: "",
        documento: "",
        telefone: "",
        tipo: "Visitante",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPessoa(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError("");

    try {
      const payload = {
        ...formState,
        // Garantir que ID não seja enviado no payload para criação ou atualização
        id: undefined,
      };

      if (editingPessoa) {
        // UPDATE
        await api.put(`/pessoas/${editingPessoa.id}`, payload);
      } else {
        // CREATE
        await api.post("/pessoas", payload);
      }

      handleCloseModal();
      fetchPessoas(); // Atualiza a lista
    } catch (err) {
      const message =
        err.response?.data?.error ||
        "Erro ao salvar a pessoa. Verifique os dados.";
      setFormError(message);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta pessoa?")) {
      try {
        await api.delete(`/pessoas/${id}`);
        fetchPessoas(); // Atualiza a lista
      } catch (err) {
        const message =
          err.response?.data?.error ||
          "Erro ao excluir a pessoa. Verifique se não há movimentações associadas.";
        alert(message);
      }
    }
  };

  // Filtro e Busca
  const filteredPessoas = pessoas.filter(
    (pessoa) =>
      pessoa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pessoa.documento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pessoa.telefone?.toLowerCase().includes(searchTerm.toLowerCase()) // Adiciona busca por telefone
  );

  // ----------------------------------------------------
  // Renderização
  // ----------------------------------------------------

  return (
    <DashboardLayout
      pageTitle="Cadastro de Pessoas"
      pageSubtitle="Gerencie funcionários, terceirizados e visitantes."
    >
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        {/* Cabeçalho e Ações */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, documento ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex space-x-3">
            <button
              onClick={fetchPessoas}
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
              Nova Pessoa
            </button>
          </div>
        </div>

        {/* Tabela de Pessoas */}
        {loading && !pessoas.length ? (
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
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefone {/* Coluna Telefone */}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredPessoas.map((pessoa) => (
                  <tr key={pessoa.id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {pessoa.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {pessoa.documento}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {pessoa.telefone} {/* Exibe Telefone */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          pessoa.tipo === "Funcionario"
                            ? "bg-blue-100 text-blue-800"
                            : pessoa.tipo === "Terceirizado"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {pessoa.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleOpenModal(pessoa)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(pessoa.id)}
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
            {filteredPessoas.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                Nenhuma pessoa encontrada.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de Criação/Edição */}
      {isModalOpen && (
        <PessoaModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          formState={formState}
          handleFormChange={handleFormChange}
          error={formError}
          isEditing={!!editingPessoa}
        />
      )}
    </DashboardLayout>
  );
}

// ----------------------------------------------------
// Componente Modal
// ----------------------------------------------------
const PessoaModal = ({
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
            {isEditing ? "Editar Pessoa" : "Nova Pessoa"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            &times;
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-4">
          {/* Nome */}
          <div>
            <label
              htmlFor="nome"
              className="block text-sm font-medium text-gray-700"
            >
              Nome Completo
            </label>
            <input
              type="text"
              name="nome"
              id="nome"
              required
              value={formState.nome}
              onChange={handleFormChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
            />
          </div>

          {/* Documento */}
          <div>
            <label
              htmlFor="documento"
              className="block text-sm font-medium text-gray-700"
            >
              Documento (CPF/RG/Passaporte)
            </label>
            <input
              type="text"
              name="documento"
              id="documento"
              required
              value={formState.documento}
              onChange={handleFormChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
            />
          </div>

          {/* Telefone */}
          <div>
            <label
              htmlFor="telefone"
              className="block text-sm font-medium text-gray-700"
            >
              Telefone
            </label>
            <input
              type="text"
              name="telefone"
              id="telefone"
              value={formState.telefone}
              onChange={handleFormChange}
              placeholder="(99) 99999-9999"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
            />
          </div>

          {/* Tipo */}
          <div>
            <label
              htmlFor="tipo"
              className="block text-sm font-medium text-gray-700"
            >
              Tipo de Vínculo
            </label>
            <select
              name="tipo"
              id="tipo"
              required
              value={formState.tipo}
              onChange={handleFormChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
            >
              <option value="Funcionario">Funcionário</option>
              <option value="Terceirizado">Terceirizado</option>
              <option value="Visitante">Visitante</option>
            </select>
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
              {isEditing ? "Salvar Alterações" : "Cadastrar Pessoa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PessoasPage;
