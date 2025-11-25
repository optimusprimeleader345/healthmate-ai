import React from "react";

export default function EmergencyButton({ onOpen }) {
  return (
    <button
      aria-label="Emergency SOS"
      onClick={onOpen}
      className="fixed bottom-6 right-6 z-50 bg-red-600 text-white rounded-full px-4 py-3 shadow-lg animate-pulse"
    >
      Emergency SOS
    </button>
  );
}
