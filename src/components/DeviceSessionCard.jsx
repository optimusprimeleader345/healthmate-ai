import React from 'react';

const DeviceSessionCard = ({ deviceName, location, ip, lastActive, privacyMode }) => {
  const handleRevoke = () => {
    console.log(`Revoking session for ${deviceName}`);
  };

  return (
    <div className="rounded-md border p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="font-medium">{deviceName}</div>
          <div className="text-sm text-gray-600">{location}</div>
          <div className={`text-sm text-gray-600 ${privacyMode ? 'blur-sm' : ''}`}>IP: {ip}</div>
          <div className="text-sm text-gray-600">Last active: {lastActive}</div>
        </div>
        <button
          onClick={handleRevoke}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Revoke
        </button>
      </div>
    </div>
  );
};

export default DeviceSessionCard;
