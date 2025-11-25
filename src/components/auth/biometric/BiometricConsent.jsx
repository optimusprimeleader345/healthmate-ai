import React, { useState } from 'react';
import { Camera, Mic, Shield, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { Card } from '../../Card';
import { Button } from '../../Button';

const BiometricConsent = ({ onConsent, onDecline, type = 'camera' }) => {
  const [detailedView, setDetailedView] = useState(false);
  const [acceptedItems, setAcceptedItems] = useState({
    cameraAccess: false,
    dataStorage: false,
    processingTerms: false
  });

  const biometricTypes = {
    camera: {
      title: 'Camera Access for Facial Recognition',
      icon: Camera,
      description: 'Allow access to your camera for facial recognition authentication',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    voice: {
      title: 'Microphone Access for Voice Authentication',
      icon: Mic,
      description: 'Allow access to your microphone for voice recognition authentication',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  };

  const currentType = biometricTypes[type];

  const handleCheckboxChange = (item) => {
    setAcceptedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const handleAccept = () => {
    if (Object.values(acceptedItems).every(item => item)) {
      onConsent(acceptedItems);
    }
  };

  const IconComponent = currentType.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="max-w-lg w-full">
        <Card className={`p-6 border-2 ${currentType.borderColor}`}>
          {/* Header */}
          <div className="text-center mb-6">
            <div className={`mx-auto w-16 h-16 ${currentType.bgColor} rounded-full flex items-center justify-center mb-4`}>
              <IconComponent className={`h-8 w-8 ${currentType.color}`} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentType.title}
            </h2>
            <p className="text-gray-600">
              Enable advanced biometric authentication for seamless login
            </p>
          </div>

          {/* Main Consent Items */}
          <div className="space-y-4 mb-6">
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="cameraAccess"
                checked={acceptedItems.cameraAccess}
                onChange={() => handleCheckboxChange('cameraAccess')}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <label htmlFor="cameraAccess" className="text-sm font-medium text-gray-900 cursor-pointer">
                  Device Access
                </label>
                <p className="text-sm text-gray-600">
                  I grant permission for this app to access my camera/microphone for biometric authentication.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="dataStorage"
                checked={acceptedItems.dataStorage}
                onChange={() => handleCheckboxChange('dataStorage')}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <label htmlFor="dataStorage" className="text-sm font-medium text-gray-900 cursor-pointer">
                  Biometric Data Storage
                </label>
                <p className="text-sm text-gray-600">
                  I agree to local storage of biometric templates for authentication purposes.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="processingTerms"
                checked={acceptedItems.processingTerms}
                onChange={() => handleCheckboxChange('processingTerms')}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <label htmlFor="processingTerms" className="text-sm font-medium text-gray-900 cursor-pointer">
                  AI Processing Terms
                </label>
                <p className="text-sm text-gray-600">
                  I understand that facial/voice data is processed locally using machine learning.
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Information Toggle */}
          <div className="mb-6">
            <button
              onClick={() => setDetailedView(!detailedView)}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-2"
            >
              {detailedView ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {detailedView ? 'Hide Details' : 'View Technical Details'}
            </button>

            {detailedView && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <h4 className="font-medium text-blue-900 mb-2">Technical Information</h4>
                    <ul className="text-blue-800 space-y-1">
                      <li>• Data is processed entirely on your device</li>
                      <li>• No biometric data is transmitted to servers</li>
                      <li>• Facial recognition uses TensorFlow.js in your browser</li>
                      <li>• Templates are stored locally and encrypted</li>
                      <li>• You can delete all biometric data anytime</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Warning */}
          <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-yellow-800 font-medium mb-1">Important Notice</p>
              <p className="text-yellow-700">
                This feature is experimental and uses cutting-edge web technologies.
                Biometric accuracy may vary based on lighting, device quality, and environmental factors.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={onDecline || (() => window.history.back())}
              variant="outline"
              className="flex-1"
            >
              Decline
            </Button>
            <Button
              onClick={handleAccept}
              disabled={!Object.values(acceptedItems).every(item => item)}
              className={`flex-1 bg-gradient-to-r ${
                type === 'camera'
                  ? 'from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                  : 'from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700'
              }`}
            >
              Enable Biometric Auth
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              You can disable biometric authentication anytime in Settings → Security
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BiometricConsent;
