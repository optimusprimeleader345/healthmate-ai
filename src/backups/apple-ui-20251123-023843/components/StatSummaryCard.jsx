import React from 'react';

const StatSummaryCard = ({ title, value }) => {
  return (
    <div className="rounded-2xl shadow-md p-6">
      <div className="text-center">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
          {title}
        </h3>
        <p className="mt-2 text-2xl font-bold text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
};

export default StatSummaryCard;
