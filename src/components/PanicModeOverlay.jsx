import React from 'react';

const PanicModeOverlay = ({ contacts, onNotify, onClose }) => {
  const handleCallEmergency = () => {
    console.log("Calling emergency services...");
    // In real app, could trigger dial: window.location.href = "tel:108";
  };

  const handleShareLocation = () => {
    console.log("Sharing location...");
    // Mock share location
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-screen bg-gradient-to-br from-red-600 to-red-800 z-50 flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl font-bold mb-8 text-center">Emergency Mode Activated</h1>
      {contacts.length === 0 ? (
        <p className="text-xl mb-8">No contacts added.</p>
      ) : (
        <div className="space-y-4">
          <button
            onClick={handleCallEmergency}
            className="block w-full px-6 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Call Emergency Services
          </button>
          <button
            onClick={onNotify}
            className="block w-full px-6 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Notify All Contacts
          </button>
          <button
            onClick={handleShareLocation}
            className="block w-full px-6 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Share My Location
          </button>
        </div>
      )}
      <button
        onClick={onClose}
        className="mt-8 px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
      >
        Exit Panic Mode
      </button>
    </div>
  );
};

export default PanicModeOverlay;
