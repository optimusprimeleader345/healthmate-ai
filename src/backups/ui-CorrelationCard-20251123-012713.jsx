import React from 'react';

const CorrelationCard = ({ title, value }) => {
  return (
    <div className="rounded-2xl shadow-md p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {title}
        </h3>
        <span className="text-2xl font-bold text-blue-600">
          {value}
        </span>
      </div>
    </div>
  );
};

export default CorrelationCard;
