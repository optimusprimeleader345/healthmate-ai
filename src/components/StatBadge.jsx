import React from 'react';

const StatBadge = ({ label, value, type = 'neutral', className = '' }) => {
  const colorClasses = {
    neutral: 'bg-neutral-100 text-neutral-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    teal: 'bg-teal-100 text-teal-700'
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClasses[type]} ${className}`}>
      {label}: {value}
    </span>
  );
};

export default StatBadge;
