import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, X, CheckCircle, AlertTriangle, Loader2, RotateCcw } from 'lucide-react';
import { Card } from '../../Card';
import { Button } from '../../Button';
import BiometricConsent from './BiometricConsent';
import * as faceapi from 'face-api.js';

const FacialRecognitionModal = ({
  onFaceDetected,
  onEnrollment,
  onCancel,
  mode = 'verify' // 'verify' or 'enroll'
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [detections, setDetections] = useState([]);
  const [enrollmentProgress, setEnrollmentProgress] = useState(0);
  const [capturedFaces, setCapturedFaces] = useState([]);
  const [matchConfidence, setMatchConfidence] = useState(0);

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models';

        // Load SSD MobileNet v1 model for face detection
        await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
        // Load 68 point face landmark detection model
        await faceapi.loadFaceLandmarkModel(MODEL_URL);
        // Load face recognition model
        await faceapi.loadFaceRecognitionModel(MODEL_URL);

        console.log('✅ Face recognition models loaded successfully');
        setModelsLoaded(true);
      } catch (error) {
        console.error('❌ Failed to load face recognition models:', error);
        setCameraError('Failed to load AI models. Please refresh and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadModels();
  }, []);

  // Start camera feed
  const startCamera = useCallback(async () => {
    if (!modelsLoaded) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: 'user'
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;

        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          startFaceDetection();
        };
      }
    } catch (error) {
      console.error('Camera access denied or unavailable:', error);
      if (error.name === 'NotAllowedError') {
        setCameraError('Camera access denied. Please allow camera access and try again.');
      } else if (error.name === 'NotFoundError') {
        setCameraError('No camera found. Please connect a camera and try again.');
      } else {
        setCameraError('Camera error: ' + error.message);
      }
    }
  }, [modelsLoaded]);

  // Stop camera feed
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  // Face detection loop
  const startFaceDetection = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const detectFaces = async () => {
      if (!videoRef.current || !modelsLoaded || !isScanning) return;

      try {
        const detection = await faceapi
          .detectSingleFace(videoRef.current)
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (detection) {
          // Resize canvas to video dimensions
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;

          // Clear previous drawings
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Draw face detection box
          const { x, y, width, height } = detection.detection.box;
          ctx.strokeStyle = mode === 'enroll' ? '#3b82f6' : '#10b981';
          ctx.lineWidth = 3;
          ctx.strokeRect(x, y, width, height);

          // Draw face landmarks
          faceapi.draw.drawFaceLandmarks(canvas, detection);

          setDetections([detection]);

          // Handle different modes
          if (mode === 'verify' && onFaceDetected) {
            // Verify against stored face templates
            await handleFaceVerification(detection);
          } else if (mode === 'enroll') {
            // Collect enrollment samples
            await handleFaceEnrollment(detection);
          }
        } else {
          // No face detected
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Draw "No face detected" message
          ctx.fillStyle = '#ef4444';
          ctx.font = '20px Arial';
          ctx.fillText('No face detected', 20, 40);
        }

        // Continue detection loop
        requestAnimationFrame(detectFaces);
      } catch (error) {
        console.error('Face detection error:', error);
        setCameraError('Face detection failed. Please try again.');
      }
    };

    // Start the detection loop
    setIsScanning(true);
    detectFaces();
  }, [isScanning, modelsLoaded, mode, onFaceDetected]);

  // Handle face verification
  const handleFaceVerification = useCallback(async (detection) => {
    try {
      // Get stored face descriptors
      const storedDescriptors = JSON.parse(localStorage.getItem('biometric_faces') || '[]');

      if (storedDescriptors.length === 0) {
        return; // No faces enrolled yet
      }

      // Create face matcher with stored faces
      const labeledDescriptors = storedDescriptors.map((stored, index) =>
        new faceapi.LabeledFaceDescriptors(`face-${index}`, stored.descriptor)
      );

      const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors);

      // Find matches
      const result = faceMatcher.findBestMatch(detection.descriptor);
      const confidence = result.distance;

      setMatchConfidence(confidence);

      if (confidence < 0.6) { // 60% similarity threshold
        // Face matches!
        onFaceDetected({
          success: true,
          confidence: confidence,
          descriptor: detection.descriptor
        });
        setIsScanning(false);
        stopCamera();
      }
    } catch (error) {
      console.error('Face verification error:', error);
    }
  }, [onFaceDetected, stopCamera]);

  // Handle face enrollment
  const handleFaceEnrollment = useCallback(async (detection) => {
    if (capturedFaces.length >= 5) return; // Max 5 samples

    // Add face descriptor to collection
    setCapturedFaces(prev => [...prev, detection.descriptor]);
    setEnrollmentProgress(((capturedFaces.length + 1) / 5) * 100);

    if (capturedFaces.length + 1 >= 3) { // Require at least 3 samples
      // Create face descriptor
      const descriptors = [...capturedFaces, detection.descriptor];
      const averageDescriptor = new Float32Array(descriptors[0]);

      // Average all descriptors for better accuracy
      for (let i = 1; i < descriptors.length; i++) {
        for (let j = 0; j < averageDescriptor.length; j++) {
          averageDescriptor[j] += descriptors[i][j];
        }
      }
      for (let j = 0; j < averageDescriptor.length; j++) {
        averageDescriptor[j] /= descriptors.length;
      }

      // Store the enrolled face
      const storedFaces = JSON.parse(localStorage.getItem('biometric_faces') || '[]');
      storedFaces.push({
        descriptor: Array.from(averageDescriptor),
        enrolledAt: new Date().toISOString(),
        samples: descriptors.length
      });

      localStorage.setItem('biometric_faces', JSON.stringify(storedFaces));

      // Enrollment complete
      onEnrollment({
        success: true,
        samples: descriptors.length,
        descriptor: Array.from(averageDescriptor)
      });

      setIsScanning(false);
      stopCamera();
    }
  }, [capturedFaces, onEnrollment, stopCamera]);

  // Handle consent
  const handleConsent = async (consentData) => {
    setHasConsent(true);

    // Store consent in localStorage
    localStorage.setItem('biometric_consent', JSON.stringify({
      granted: true,
      ...consentData,
      timestamp: new Date().toISOString()
    }));

    // Start camera after consent
    setTimeout(() => startCamera(), 500);
  };

  // Handle decline
  const handleDecline = () => {
    onCancel();
  };

  // Retry camera access
  const retryCamera = () => {
    setCameraError(null);
    startCamera();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  if (!hasConsent) {
    return (
      <BiometricConsent
        onConsent={handleConsent}
        onDecline={handleDecline}
        type="camera"
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="max-w-2xl w-full">
        <Card className="p-6 bg-gray-900 border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Camera className="h-8 w-8 text-blue-400" />
              <div>
                <h2 className="text-xl font-bold text-white">
                  {mode === 'verify' ? 'Face Recognition' : 'Face Enrollment'}
                </h2>
                <p className="text-gray-400 text-sm">
                  {mode === 'verify' ? 'Position your face in the camera' : 'Collect face samples for enrollment'}
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Camera/Error View */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-96 bg-gray-800 rounded-lg">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 text-blue-400 animate-spin mx-auto mb-4" />
                  <p className="text-white">Loading AI models...</p>
                  <p className="text-gray-400 text-sm">This may take a few moments</p>
                </div>
              </div>
            ) : cameraError ? (
              <div className="flex flex-col items-center justify-center h-96 bg-gray-800 rounded-lg">
                <AlertTriangle className="h-12 w-12 text-red-400 mb-4" />
                <p className="text-red-400 text-center mb-4">{cameraError}</p>
                <Button onClick={retryCamera} className="bg-blue-600 hover:bg-blue-700">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="relative">
                {/* Video Element */}
                <video
                  ref={videoRef}
                  className="w-full rounded-lg bg-gray-800"
                  style={{ height: '400px', objectFit: 'cover' }}
                  playsInline
                  muted
                />

                {/* Canvas Overlay */}
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full pointer-events-none rounded-lg"
                  style={{ height: '400px' }}
                />

                {/* Enrollment Progress */}
                {mode === 'enroll' && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black bg-opacity-75 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white text-sm">Enrollment Progress</span>
                        <span className="text-blue-400 text-sm">
                          {capturedFaces.length}/5 samples
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${enrollmentProgress}%` }}
                        />
                      </div>
                      <p className="text-gray-300 text-xs">
                        {capturedFaces.length >= 5
                          ? 'Enrollment complete!'
                          : 'Keep your face in the frame from different angles'
                        }
                      </p>
                    </div>
                  </div>
                )}

                {/* Verification Status */}
                {mode === 'verify' && matchConfidence > 0 && (
                  <div className="absolute top-4 right-4 bg-black bg-opacity-75 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <div className="text-xs">Similarity:</div>
                      <div className={`text-sm font-bold ${
                        matchConfidence < 0.6 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {(100 - matchConfidence * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Instructions */}
          {!cameraError && !isLoading && (
            <div className="mt-4 p-3 bg-gray-800 rounded-lg">
              <h3 className="text-white font-medium mb-2">
                {mode === 'verify' ? 'Verification Instructions:' : 'Enrollment Instructions:'}
              </h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>⚫ Ensure good lighting and face your camera</li>
                <li>⚫ Keep your face centered in the frame</li>
                <li>⚫ Avoid moving too quickly or wearing accessories</li>
                {mode === 'enroll' && (
                  <li>⚫ Slowly move your head to capture different angles</li>
                )}
                {mode === 'verify' && (
                  <li>⚫ Wait for green box and automatic verification</li>
                )}
              </ul>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <Button
              onClick={onCancel}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FacialRecognitionModal;
