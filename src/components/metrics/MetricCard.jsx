// src/components/metrics/MetricCard.jsx
import React from "react";
import { CarFront } from "lucide-react";

const MetricCard = ({ title, value, bg, iconBg }) => (
  <div
    className={`flex justify-between items-center px-5 py-4 rounded-xl border border-gray-200 shadow-sm ${bg}`}
  >
    <div>
      <p className="text-xs text-gray-500 mb-1">{title}</p>
      <p className="text-3xl font-semibold text-gray-900">{value}</p>
    </div>
    <div
      className={`h-10 w-10 rounded-lg ${iconBg} flex items-center justify-center`}
    >
      <CarFront className="h-5 w-5 text-gray-800" />
    </div>
  </div>
);

export default MetricCard;
