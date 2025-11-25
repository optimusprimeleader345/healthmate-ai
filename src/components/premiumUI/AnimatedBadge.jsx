import React from "react";

export default function AnimatedBadge({ children }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-50 to-sky-50 text-indigo-700 shadow-sm badge-pulse">
      {children}
    </div>
  );
}
