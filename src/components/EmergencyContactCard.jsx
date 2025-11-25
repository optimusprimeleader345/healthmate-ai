import React from "react";

export default function EmergencyContactCard({ name, phone, relation }) {
  return (
    <div className="rounded-xl shadow-md border border-red-200 p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-lg font-semibold text-red-700">{name}</div>
          <div className="text-sm text-gray-600">{relation}</div>
          <div className="text-sm text-gray-700 mt-2">{phone}</div>
        </div>
        <div className="flex flex-col gap-2">
          <button
            className="px-3 py-1 bg-red-600 text-white rounded-md text-sm"
            onClick={() => window.open(`tel:${phone}`)}
            aria-label={`Call ${name}`}
          >
            Call
          </button>
          <button
            className="px-3 py-1 border rounded-md text-sm"
            onClick={() => console.log("Family Notified:", name, phone)}
            aria-label={`Notify ${name}`}
          >
            Notify
          </button>
        </div>
      </div>
    </div>
  );
}
