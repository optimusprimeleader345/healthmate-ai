import React, { useState, useEffect } from "react";

export default function DynamicIsland({ events = [] }) {
  const [localEvents, setLocalEvents] = useState(events);

  // Listener for external events
  useEffect(() => {
    function onAlert(e) {
      const payload = e.detail;
      setLocalEvents(prev => [payload, ...prev].slice(0, 3));

      // Auto-remove after 6 seconds
      setTimeout(() => {
        setLocalEvents(prev =>
          prev.filter(p => p.id !== payload.id)
        );
      }, 6000);
    }

    window.addEventListener("healthmate:alert", onAlert);
    return () =>
      window.removeEventListener("healthmate:alert", onAlert);
  }, []);

  if (localEvents.length === 0) return null;

  const e = localEvents[0];

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[999] select-none">
      <div className="px-5 py-3 glass-card rounded-3xl shadow-lg backdrop-blur-2xl border border-white/40 transition-all duration-300 hover:scale-[1.02]">
        <div className="text-sm font-semibold text-gray-900">
          {e.title}
        </div>
        <div className="text-xs text-gray-600">{e.subtitle}</div>
      </div>
    </div>
  );
}
