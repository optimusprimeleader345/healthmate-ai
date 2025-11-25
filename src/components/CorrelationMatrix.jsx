import React from 'react';

const CorrelationMatrix = ({ matrix, matrixData }) => {
  if (matrixData) {
    // Full Correlation Matrix mode
    const { metrics, matrix: matrix2D } = matrixData;
    const n = metrics.length;

    const getCellColor = (correlation) => {
      const absValue = Math.abs(correlation);
      if (correlation > 0) {
        if (absValue >= 0.8) return 'bg-teal-800 text-white';
        if (absValue >= 0.6) return 'bg-teal-600 text-white';
        if (absValue >= 0.3) return 'bg-teal-400 text-white';
        return 'bg-orange-300 text-gray-900';
      } else if (correlation < 0) {
        if (absValue >= 0.8) return 'bg-red-800 text-white';
        if (absValue >= 0.6) return 'bg-red-600 text-white';
        if (absValue >= 0.3) return 'bg-red-400 text-white';
        return 'bg-orange-300 text-gray-900';
      } else {
        return 'bg-orange-400 text-gray-900';
      }
    };

    const formatCorrelation = (value) => {
      if (Math.abs(value) < 0.01) return '0.00';
      return value.toFixed(2);
    };

    return (
      <div className="w-full">
        <div className="text-sm text-gray-600 mb-4 text-center">
          Health Metrics Correlation Matrix
        </div>
        <div className="grid" style={{ gridTemplateColumns: `repeat(${n + 1}, minmax(60px, 1fr))` }}>
          <div className="bg-gray-100 p-3 font-semibold text-gray-900"></div>
          {metrics.map((metric, index) => (
            <div key={`header-${index}`} className="bg-gray-50 p-3 font-semibold text-gray-900 text-center text-xs" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)', maxWidth: '60px' }}>
              {metric}
            </div>
          ))}
          {metrics.map((rowMetric, rowIndex) => (
            <React.Fragment key={rowIndex}>
              <div className="bg-gray-50 p-3 font-semibold text-gray-900 text-center text-xs">{rowMetric}</div>
              {matrix2D[rowIndex].map((cell, colIndex) => (
                <div key={`${rowIndex}-${colIndex}`} className={`p-2 text-center text-xs font-medium border-r border-b ${getCellColor(cell)} min-h-[50px] flex items-center justify-center transition-colors`}>
                  {formatCorrelation(cell)}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <div className="flex gap-4 justify-center">
            <div className="flex items-center"><div className="w-4 h-4 bg-teal-800 rounded mr-2"></div>Strong Positive</div>
            <div className="flex items-center"><div className="w-4 h-4 bg-teal-400 rounded mr-2"></div>Weak Positive</div>
            <div className="flex items-center"><div className="w-4 h-4 bg-orange-400 rounded mr-2"></div>No Correlation</div>
            <div className="flex items-center"><div className="w-4 h-4 bg-red-400 rounded mr-2"></div>Weak Negative</div>
            <div className="flex items-center"><div className="w-4 h-4 bg-red-800 rounded mr-2"></div>Strong Negative</div>
          </div>
        </div>
      </div>
    );
  } else if (matrix) {
    // New Correlation Cards mode
    const getBgColor = (value) => {
      if (value > 0.6) return 'bg-green-300';
      if (value > 0.3) return 'bg-green-100';
      if (value < -0.6) return 'bg-red-300';
      if (value < -0.3) return 'bg-red-100';
      return 'bg-gray-100';
    };

    return (
      <div className="rounded-2xl shadow-md p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matrix.map((item, index) => (
          <div key={index} className={`rounded-lg p-3 text-center ${getBgColor(item.value)}`}>
            <div className="font-semibold text-sm">{item.pair}</div>
            <div className="text-lg font-bold">{item.value}</div>
            <div className="text-xs text-gray-700 mt-1">{item.insight}</div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default CorrelationMatrix;
