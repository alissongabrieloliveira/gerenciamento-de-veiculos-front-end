// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PessoasPage from "./pages/PessoasPage";
import VeiculosPage from "./pages/VeiculosPage";
import MovimentacoesPage from "./pages/MovimentacoesPage";
import RelatoriosPage from "./pages/RelatoriosPage";

// Componente para proteger rotas
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/login" element={<LoginPage />} />

          {/* Rota Raiz - Redireciona para o Dashboard se logado, senão para Login */}
          <Route
            path="/"
            element={
              localStorage.getItem("jwtToken") ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Rotas Protegidas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/*Rota de Pessoas */}
          <Route
            path="/pessoas"
            element={
              <ProtectedRoute>
                <PessoasPage />
              </ProtectedRoute>
            }
          />

          {/* Rota de Veículos */}
          <Route
            path="/veiculos"
            element={
              <ProtectedRoute>
                <VeiculosPage />
              </ProtectedRoute>
            }
          />

          {/*Rota de Movimentações */}
          <Route
            path="/movimentacoes"
            element={
              <ProtectedRoute>
                <MovimentacoesPage />
              </ProtectedRoute>
            }
          />

          {/* Rota de Relatórios */}
          <Route
            path="/relatorios"
            element={
              <ProtectedRoute>
                <RelatoriosPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
