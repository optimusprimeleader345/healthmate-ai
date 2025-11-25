import React from 'react';

const StatsRow = ({ weeklyImprovement, dayOverDay, anomaly }) => {
  return (
    <div className="rounded-2xl shadow-md p-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <h4 className="text-sm font-medium text-gray-500 uppercase">
            Weekly Improvement
          </h4>
          <p className="mt-1 text-xl font-bold text-green-600">
            {weeklyImprovement}
          </p>
        </div>
        <div className="text-center">
          <h4 className="text-sm font-medium text-gray-500 uppercase">
            Day-over-day Change
          </h4>
          <p className="mt-1 text-xl font-bold text-blue-600">
            {dayOverDay}
          </p>
        </div>
        <div className="text-center">
          <h4 className="text-sm font-medium text-gray-500 uppercase">
            Anomaly Indicator
          </h4>
          <p className="mt-1 text-sm font-semibold text-gray-700">
            {anomaly}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsRow;
