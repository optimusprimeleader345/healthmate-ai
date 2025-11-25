import React from 'react';

export default function OfflineStatusBadge({ isOffline, lastSync }) {
  return (
    <div className={`px-3 py-1 rounded-full text-sm font-medium shadow-md
        ${isOffline ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
      >
      {isOffline ? "Offline — Cached Mode" : `Online — Synced: ${lastSync}`}
    </div>
  );
}
