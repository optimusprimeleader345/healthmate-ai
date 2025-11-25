import React from "react";

export function VisuallyHidden({ children }) {
  return <span style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>{children}</span>;
}

export function IconButton({ label, onClick, children }) {
  return (
    <button aria-label={label} onClick={onClick} className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400">
      {children}
    </button>
  );
}
