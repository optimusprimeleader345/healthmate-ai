import React from 'react';

const SimulationControls = ({
  isRunning,
  onStartStop,
  speed,
  onSpeedChange,
  onReset,
  simulateAnomalies,
  onToggleAnomalies
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl shadow-md">
      <button
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          isRunning
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-green-500 hover:bg-green-600 text-white'
        }`}
        onClick={onStartStop}
        aria-label={isRunning ? 'Stop simulation' : 'Start simulation'}
      >
        {isRunning ? 'Stop' : 'Start'}
      </button>

      <div className="flex flex-col flex-1 min-w-0">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Speed: {speed}ms
        </label>
        <input
          type="range"
          min="200"
          max="2000"
          step="100"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <button
        className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
        onClick={onReset}
        aria-label="Reset simulation"
      >
        Reset
      </button>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="anomalies"
          checked={simulateAnomalies}
          onChange={onToggleAnomalies}
          className="rounded"
        />
        <label htmlFor="anomalies" className="text-sm font-medium text-gray-700">
          Simulate Anomalies
        </label>
      </div>
    </div>
  );
};

export default SimulationControls;
