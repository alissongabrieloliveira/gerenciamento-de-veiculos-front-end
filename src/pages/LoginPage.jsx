// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function LoginPage() {
  // 1. Estados
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 2. Função de Submissão
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Chamada POST para a rota de login do backend
      const response = await api.post("/auth/login", {
        email,
        senha,
      });

      const { token } = response.data;

      // 3. Salvar o Token JWT e Redirecionar
      localStorage.setItem("jwtToken", token);

      // Redireciona para o Dashboard ou rota principal (vamos usar '/' por enquanto)
      navigate("/dashboard");
    } catch (err) {
      // 4. Tratamento de Erro
      const errorMessage =
        err.response?.data?.error || "Erro ao conectar com o servidor.";
      setError(errorMessage);
      console.error("Erro de Login:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-2xl rounded-xl border border-gray-200 transform hover:scale-[1.01] transition duration-300">
        <h2 className="text-4xl font-extrabold text-gray-900 text-center">
          Bem-vindo!
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Entre na sua conta de Controle de Pátio
        </p>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Campo de Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150"
              placeholder="seu.email@empresa.com"
            />
          </div>

          {/* Campo de Senha */}
          <div>
            <label
              htmlFor="senha"
              className="block text-sm font-medium text-gray-700"
            >
              Senha
            </label>
            <input
              id="senha"
              name="senha"
              type="password"
              autoComplete="current-password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150"
              placeholder="********"
            />
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div
              className="p-3 text-sm text-red-700 bg-red-100 rounded-lg"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Botão de Submissão */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              } transition duration-150`}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
