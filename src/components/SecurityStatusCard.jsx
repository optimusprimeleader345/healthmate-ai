import React from 'react';

const SecurityStatusCard = ({ riskLevel, lastPasswordChange, mfaEnabled, privacyMode }) => {
  const getRiskColor = () => {
    switch (riskLevel) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`rounded-2xl shadow-md p-4 border ${getRiskColor()}`}>
      <h3 className="text-lg font-semibold mb-2">Security Status</h3>
      <div className="space-y-2">
        <div className={`text-sm ${privacyMode ? 'blur-sm' : ''}`}>
          <span className="font-medium">Last Password Change:</span> {lastPasswordChange}
        </div>
        <div className="text-sm">
          <span className="font-medium">Risk Level:</span> {riskLevel}
        </div>
        <div className="text-sm">
          <span className="font-medium">MFA Enabled:</span> {mfaEnabled ? 'Yes' : 'No'}
        </div>
      </div>
    </div>
  );
};

export default SecurityStatusCard;
