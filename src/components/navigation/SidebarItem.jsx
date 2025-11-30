// src/components/navigation/SidebarItem.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const SidebarItem = ({ icon: Icon, label, to }) => {
  const location = useLocation();
  // Usa startsWith para que /movimentacoes/entrada, por exemplo, marque /movimentacoes como ativo
  const active = location.pathname.startsWith(to);

  const Wrapper = to ? Link : "button";

  return (
    <Wrapper
      to={to}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition border ${
        active
          ? "bg-white border-gray-300 text-gray-900 shadow-sm"
          : "border-transparent text-gray-700 hover:bg-white hover:border-gray-200"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span className="text-xs font-medium">{label}</span>
    </Wrapper>
  );
};

export default SidebarItem;
