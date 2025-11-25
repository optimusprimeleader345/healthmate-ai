import React from "react";

export default function TimelineCard({ date, title, severity, notes }) {
  return (
    <div className="border-l-4 border-blue-500 pl-4 py-3 mb-4 bg-white shadow-sm rounded">
      <div className="text-sm text-gray-500">{date}</div>
      <div className="text-lg font-semibold">{title}</div>
      <div className="text-sm text-red-600 font-medium">Severity: {severity}</div>
      <div className="mt-1 text-sm">{notes}</div>
    </div>
  );
}
