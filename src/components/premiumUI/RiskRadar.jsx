import React from "react";

export default function RiskRadar({ sleep, stress, hydration, activity }) {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-md border">
      <h3 className="font-semibold text-gray-800">Health Risk Radar</h3>
      <p className="text-sm text-gray-500 mb-3">Shows overall stability</p>
      <ul className="text-sm space-y-1">
        <li>😴 Sleep: {sleep}/10</li>
        <li>🧠 Stress: {stress}/10</li>
        <li>💧 Hydration: {hydration}/10</li>
        <li>🏃 Activity: {activity}/10</li>
      </ul>
    </div>
  );
}
