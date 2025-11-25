import React from 'react';

const LoginHistoryRow = ({ date, device, location, status, privacyMode }) => {
  return (
    <div className="flex items-center justify-between py-3 px-4 border-b">
      <div className="space-y-1">
        <div className={`text-sm ${privacyMode ? 'blur-sm' : ''}`}>Date: {date}</div>
        <div className="text-sm font-medium">{device}</div>
        <div className={`text-sm text-gray-600 ${privacyMode ? 'blur-sm' : ''}`}>Location: {location}</div>
      </div>
      <div className={`text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
        {status}
      </div>
    </div>
  );
};

export default LoginHistoryRow;
