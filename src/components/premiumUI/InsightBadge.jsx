import React from 'react';
import { Brain } from 'lucide-react';

const InsightBadge = ({ text = 'AI', variant = 'primary', icon = Brain, className = '' }) => {
  const variantStyles = {
    primary: 'bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 text-white shadow-lg border border-teal-300/50',
    secondary: 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white shadow-lg border border-blue-300/50',
    success: 'bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white shadow-lg border border-green-300/50',
    warning: 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white shadow-lg border border-yellow-300/50',
    error: 'bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white shadow-lg border border-red-300/50'
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold transform hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out ${variantStyles[variant]} ${className}`}
    >
      {icon && React.createElement(icon, { className: 'w-3 h-3 mr-1.5' })}
      {text}
    </span>
  );
};

export default InsightBadge;
