import React from "react";

export default function DigitalTwinCard({ sleep, stress, hydration }) {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-md border">
      <h3 className="font-semibold text-gray-800">Digital Twin (Lite)</h3>
      <p className="text-sm text-gray-500 mt-2">Predicted tomorrow status:</p>

      <div className="mt-4 space-y-2">
        <div>❤️ Heart Stability: <strong>{heart > 85 ? "Strong" : "Normal"}</strong></div>
        <div>🧠 Stress State: <strong>{stress > 5 ? "High Risk" : "Stable"}</strong></div>
        <div>💧 Hydration: <strong>{hydration > 2 ? "Optimal" : "Needs Increase"}</strong></div>
      </div>
    </div>
  );
}
