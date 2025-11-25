import React from 'react';

const AIChatBubble = ({ message, isUser, isAI, timestamp, className = '' }) => {
  return (
    <div className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'} ${className}`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-md ${
        isUser ? 'bg-teal-500 text-white' : 'bg-neutral-100 text-gray-900'
      }`}>
        {isAI && (
          <div className="flex items-center mb-1">
            <span className="text-xs font-medium text-teal-600">AI</span>
          </div>
        )}
        <p className="text-sm">{message}</p>
        <span className="text-xs opacity-70 mt-1 block">{timestamp}</span>
      </div>
    </div>
  );
};

export default AIChatBubble;
