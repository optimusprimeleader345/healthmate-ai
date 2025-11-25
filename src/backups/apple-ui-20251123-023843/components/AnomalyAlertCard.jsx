import React from 'react';

const AnomalyAlertCard = ({ title, anomalies, severity }) => {
  const getBadgeColor = (sev) => {
    switch (sev) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <div className="rounded-2xl shadow-md p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className={`px-3 py-1 rounded-full text-white text-xs font-medium ${getBadgeColor(severity)}`}>
          {severity.toUpperCase()}
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        {anomalies.length} anomalies detected recently.
      </p>
      <button
        className="text-blue-500 text-sm hover:underline"
        onClick={() => alert("View details functionality to be implemented")}
      >
        View details
      </button>
    </div>
  );
};

export default AnomalyAlertCard;
