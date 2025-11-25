import React from 'react';
import { cn } from '../utils/classNames';

const CloudSyncBadge = ({
  status = 'idle',
  lastSyncTime = null,
  className = ''
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'syncing':
        return 'bg-yellow-100 text-yellow-700';
      case 'idle':
        return 'bg-green-100 text-green-700';
      case 'error':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'syncing':
        return '⟳'; // Simple rotating sync icon
      case 'idle':
        return '✓'; // Checkmark for idle
      case 'error':
        return '✗'; // X mark for error
      default:
        return '○'; // Circle for unknown
    }
  };

  const formatLastSyncTime = (lastSyncTime) => {
    if (!lastSyncTime) return 'Never';

    const now = new Date();
    const diff = now - new Date(lastSyncTime);

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return new Date(lastSyncTime).toLocaleDateString();
  };

  return (
    <div className={cn(
      'inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm',
      className
    )}>
      {/* Cloud icon */}
      <span className="text-lg">☁️</span>

      {/* Status indicator */}
      <span className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        getStatusColor(status)
      )}>
        <span className={status === 'syncing' ? 'animate-spin' : ''}>
          {getStatusIcon(status)}
        </span>
        <span className="capitalize">{status}</span>
      </span>

      {/* Last sync info */}
      <span className="text-gray-500">
        Last sync: {formatLastSyncTime(lastSyncTime)}
      </span>
    </div>
  );
};

export default CloudSyncBadge;
