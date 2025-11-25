import React, { useState } from 'react';

const PrivacyToggle = ({ privacyMode, setPrivacyMode }) => {
  return (
    <div className="flex items-center space-x-2">
      <label className="text-sm">Privacy Mode:</label>
      <button
        onClick={() => setPrivacyMode(!privacyMode)}
        className={`px-3 py-1 rounded ${privacyMode ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}
      >
        {privacyMode ? 'ON' : 'OFF'}
      </button>
    </div>
  );
};

export default PrivacyToggle;
