import React from 'react';

const AnomalyHeatmap = ({ dataMap }) => {
  const getColor = (value, values) => {
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min;
    const normalized = (value - min) / range;
    if (normalized > 0.75) return 'bg-red-500';
    if (normalized > 0.5) return 'bg-orange-400';
    if (normalized > 0.25) return 'bg-yellow-300';
    return 'bg-green-300';
  };

  return (
    <div className="space-y-2">
      {dataMap.map(({ metric, values }) => (
        <div key={metric} className="flex items-center">
          <span className="w-20 text-sm font-medium">{metric}</span>
          <div className="flex space-x-1 ml-4">
            {values.map((value, idx) => (
              <div
                key={idx}
                className={`w-4 h-4 rounded ${getColor(value, values)}`}
                title={`${metric} Day ${idx + 1}: ${value}`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnomalyHeatmap;
