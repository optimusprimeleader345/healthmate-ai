import React, { useState, useCallback } from 'react';
import { Fingerprint, X, CheckCircle, AlertTriangle, Loader2, RotateCcw } from 'lucide-react';
import { Card } from '../../Card';
import { Button } from '../../Button';

const FingerprintModal = ({ onFingerprintDetected, onCancel, mode = 'verify' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [scanAttempts, setScanAttempts] = useState(0);

  const maxAttempts = 3;

  // Simulate fingerprint scanning
  const startScan = useCallback(() => {
    if (scanAttempts >= maxAttempts) return;

    setIsScanning(true);
    setScanProgress(0);
    setError(null);
    setScanComplete(false);

    // Simulate scanning progress
    const scanInterval = setInterval(() => {
      setScanProgress(prev => {
        const newProgress = prev + Math.random() * 15;

        if (newProgress >= 100) {
          clearInterval(scanInterval);
          handleScanComplete();
          return 100;
        }

        return newProgress;
      });
    }, 150);
  }, [scanAttempts]);

  const handleScanComplete = useCallback(() => {
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);

      // Simulate successful fingerprint recognition (90% success rate)
      const isSuccessful = Math.random() > 0.1;

      setTimeout(() => {
        if (isSuccessful) {
          onFingerprintDetected({
            success: true,
            confidence: 0.85 + Math.random() * 0.14, // 85-99% confidence
            fingerprintId: `fp_${Date.now()}`
          });
        } else {
          // Failed scan - increment attempts
          const newAttempts = scanAttempts + 1;
          setScanAttempts(newAttempts);

          if (newAttempts >= maxAttempts) {
            setError('Fingerprint not recognized after multiple attempts. Please try alternative authentication.');
          } else {
            setError(`Fingerprint not recognized (${newAttempts}/${maxAttempts} attempts)`);
            setScanProgress(0);
            setScanComplete(false);
          }
        }
      }, 500);
    }, 1000);
  }, [scanAttempts, onFingerprintDetected]);

  const resetScan = () => {
    setScanProgress(0);
    setScanComplete(false);
    setError(null);
    setScanAttempts(0);
  };

  const renderFingerprintStatus = () => {
    if (isScanning) {
      return (
        <>
          <div className="w-24 h-24 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center animate-pulse">
            <Fingerprint className="w-12 h-12 text-blue-600 animate-bounce" />
          </div>
          <div className="text-center">
            <p className="text-white font-medium mb-2">Scanning Fingerprint...</p>
            <div className="w-64 mx-auto bg-gray-700 rounded-full h-2 mb-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
            <p className="text-gray-300 text-sm">Place your finger on the scanner</p>
          </div>
        </>
      );
    }

    if (scanComplete) {
      return (
        <>
          <div className="w-24 h-24 mx-auto mb-4 bg-green-50 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <div className="text-center">
            <p className="text-white font-medium mb-2">Fingerprint Recognized!</p>
            <p className="text-green-400 text-sm">Verification successful</p>
          </div>
        </>
      );
    }

    return (
      <>
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
          <Fingerprint className="w-12 h-12 text-gray-400" />
        </div>
        <div className="text-center">
          <p className="text-white font-medium mb-2">Touch ID</p>
          <p className="text-gray-300 text-sm">Place your finger on the sensor</p>
        </div>
      </>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="max-w-sm w-full">
        <Card className="p-6 bg-gray-900 border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Fingerprint className="h-6 w-6 text-blue-400" />
              <div>
                <h2 className="text-lg font-bold text-white">
                  {mode === 'verify' ? 'Fingerprint Verification' : 'Fingerprint Enrollment'}
                </h2>
                <p className="text-gray-400 text-sm">Touch authentication</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Fingerprint Scanner Interface */}
          <div className="flex flex-col items-center mb-6">
            {renderFingerprintStatus()}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
              <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Instructions */}
          <div className="text-center mb-6">
            <div className="text-gray-300 text-sm space-y-1">
              <p>⚫ Ensure your finger is clean and dry</p>
              <p>⚫ Place the center of your fingertip on the sensor</p>
              <p>⚫ Apply firm but gentle pressure</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {!isScanning && !scanComplete && scanAttempts < maxAttempts && (
              <Button
                onClick={startScan}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Fingerprint className="h-4 w-4 mr-2" />
                Start Scan
              </Button>
            )}

            {scanAttempts > 0 && scanAttempts < maxAttempts && !isScanning && (
              <Button
                onClick={resetScan}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again ({scanAttempts}/{maxAttempts})
              </Button>
            )}

            <Button
              onClick={onCancel}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
          </div>

          {/* Footer Note */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Biometric data is processed locally and never stored
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FingerprintModal;
