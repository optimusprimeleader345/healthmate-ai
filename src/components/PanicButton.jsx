import React from 'react';

const PanicButton = ({ setPanicMode }) => {
  return (
    <button
      onClick={() => setPanicMode(true)}
      className="fixed bottom-4 right-4 w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg animate-pulse hover:bg-red-700 transition-colors z-40"
    >
      <span className="text-2xl font-bold">!</span>
    </button>
  );
};

export default PanicButton;
