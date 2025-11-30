// src/layouts/DashboardLayout.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import SidebarItem from "../components/navigation/SidebarItem";
import {
  LayoutDashboard,
  CarFront,
  FileText,
  Users,
  User,
  LogOut,
} from "lucide-react";

// Definição da Navegação
const sidebarNavigation = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
    category: "Menu Principal",
  },
  {
    label: "Movimentações",
    to: "/movimentacoes",
    icon: CarFront,
    category: "Menu Principal",
  },
  {
    label: "Relatórios",
    to: "/relatorios",
    icon: FileText,
    category: "Menu Principal",
  },

  { label: "Pessoas", to: "/pessoas", icon: User, category: "Cadastros" },
  { label: "Veículos", to: "/veiculos", icon: CarFront, category: "Cadastros" },
  { label: "Usuários", to: "/usuarios", icon: Users, category: "Cadastros" },
];

// Reestrutura os links por categoria
const categories = sidebarNavigation.reduce((acc, item) => {
  if (!acc[item.category]) {
    acc[item.category] = [];
  }
  acc[item.category].push(item);
  return acc;
}, {});

function DashboardLayout({ children, pageTitle, pageSubtitle }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-neutral-50 text-gray-900">
      {/* SIDEBAR */}
      <aside className="w-72 bg-gray-100 border-r border-gray-200 flex flex-col">
        {/* Logo + título */}
        <div className="px-6 py-5 border-b border-gray-200 flex items-center gap-3">
          <div className="h-10 w-10 rounded bg-green-700 flex items-center justify-center text-white font-bold text-xl">
            T
          </div>
          <div className="leading-tight">
            <div className="font-semibold text-sm tracking-wide">
              Calcário <span className="font-bold">Terra Branca</span>
            </div>
            <div className="text-xs text-gray-500">
              Portaria · Controle de Acesso
            </div>
          </div>
        </div>

        {/* MENU PRINCIPAL */}
        <nav className="flex-1 px-4 py-5 space-y-6 text-sm">
          {Object.entries(categories).map(([category, items]) => (
            <div key={category}>
              <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.14em] mb-2">
                {category}
              </div>
              <div className="space-y-1">
                {items.map((item) => (
                  <SidebarItem key={item.label} {...item} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* USUÁRIO / LOGOUT */}
        <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-semibold">
              J
            </div>
            <div className="leading-tight">
              <div className="text-xs font-semibold text-gray-900">
                Jhon Doe dos Santos
              </div>
              <div className="text-[11px] text-gray-500">Porteiro</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-200 transition"
            title="Sair"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 px-10 py-8 overflow-y-auto">
        {/* Cabeçalho dinâmico */}
        <header className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">{pageTitle}</h1>
          <p className="text-sm text-gray-500 mt-1">{pageSubtitle}</p>
        </header>
        {/* Conteúdo da página filha */}
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
