// src/services/api.js
import axios from "axios";

// 1. Crie a instância do Axios
const api = axios.create({
  // A porta 3000 é do backend Node.js
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Interceptor para anexar o JWT em TODAS as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");

    if (token) {
      // Envia o token no formato Bearer, conforme o backend espera
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Interceptor para tratamento de erro (opcional, mas útil)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Exemplo: Se o token for inválido/expirado (401), desloga o usuário
    if (error.response && error.response.status === 401) {
      console.error("Token expirado ou inválido. Deslogando...");
      // Você pode adicionar a lógica de logout aqui (ex: redirecionar para /login)
      localStorage.removeItem("jwtToken");
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
