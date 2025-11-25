import React from 'react';
export default function RiskIndicatorCard({ title, level, probability, details }) {
  const color = level === 'high' ? 'bg-red-100 text-red-700' : level === 'medium' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700';
  return (
    <div className={`rounded-2xl shadow-md p-4 ${color}`} role="region" aria-label={`${title} risk card`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="text-sm font-medium">{Math.round(probability * 100)}%</div>
      </div>
      <p className="mt-2 text-sm text-gray-700">{details}</p>
    </div>
  );
}
