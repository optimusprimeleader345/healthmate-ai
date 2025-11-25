import React from "react";

export default function DigitalTwinCard({ sleep, stress, hydration }) {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-md border">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Digital Twin</h3>

      <div className="space-y-3">
        <div className="p-3 bg-gray-50 rounded-lg flex justify-between text-sm">
          <span className="font-medium">Sleep Hours</span>
          <span>{sleep}</span>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg flex justify-between text-sm">
          <span className="font-medium">Stress Level</span>
          <span>{stress}</span>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg flex justify-between text-sm">
          <span className="font-medium">Hydration (L)</span>
          <span>{hydration}</span>
        </div>
      </div>
    </div>
  );
}
