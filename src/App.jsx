// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
// Importe a página Dashboard quando criarmos
// import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<LoginPage />} />{" "}
          {/* Rota raiz aponta para login */}
          {/* Rotas Protegidas (Futuramente) */}
          {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
          {/* ... outras rotas ... */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
