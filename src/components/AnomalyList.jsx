import React from 'react';

const AnomalyList = ({ anomalies }) => {
  return (
    <div role="list" aria-label="Anomaly details list">
      {anomalies.map((anomaly, idx) => (
        <div
          key={idx}
          className="flex justify-between py-2 border-b border-gray-200"
          role="listitem"
          aria-label={`Anomaly ${idx + 1}: Day ${anomaly.index + 1}, value ${anomaly.value}, z-score ${anomaly.z}, severity ${anomaly.severity}`}
        >
          <span>Day {anomaly.index + 1}</span>
          <span>{anomaly.value}</span>
          <span>{anomaly.z}</span>
          <span>{anomaly.severity}</span>
        </div>
      ))}
    </div>
  );
};

export default AnomalyList;
