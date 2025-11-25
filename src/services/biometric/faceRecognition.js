// Face Recognition Service using face-api.js
// Handles face enrollment, verification, and management

import * as faceapi from 'face-api.js';

class FaceRecognitionService {
  constructor() {
    this.modelsLoaded = false;
    this.isInitializing = false;
  }

  // Initialize face-api.js models
  async initialize() {
    if (this.modelsLoaded || this.isInitializing) return this.modelsLoaded;

    try {
      this.isInitializing = true;

      const MODEL_URL = '/models';

      // Load all required models
      await Promise.all([
        faceapi.loadSsdMobilenetv1Model(MODEL_URL),          // Face detection
        faceapi.loadFaceLandmarkModel(MODEL_URL),             // Landmarks
        faceapi.loadFaceRecognitionModel(MODEL_URL),          // Recognition
        // Uncomment if using TinyFaceDetector instead:
        // faceapi.loadTinyFaceDetectorModel(MODEL_URL),
      ]);

      this.modelsLoaded = true;
      console.log('✅ Face recognition models loaded successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to load face recognition models:', error);
      return false;
    } finally {
      this.isInitializing = false;
    }
  }

  // Detect face in video/image element
  async detectFace(input) {
    if (!this.modelsLoaded) {
      throw new Error('Face recognition models not loaded');
    }

    try {
      const detection = await faceapi
        .detectSingleFace(input)
        .withFaceLandmarks()
        .withFaceDescriptor()
        .withFaceExpressions(); // Optional: detect facial expressions

      return detection || null;
    } catch (error) {
      console.error('Face detection error:', error);
      return null;
    }
  }

  // Enroll a new face
  async enrollFace(input, samples = 5) {
    if (!this.modelsLoaded) {
      throw new Error('Face recognition models not loaded');
    }

    try {
      const descriptors = [];

      // Collect multiple samples for better accuracy
      for (let i = 0; i < samples; i++) {
        const detection = await faceapi
          .detectSingleFace(input)
          .withFaceDescriptor();

        if (detection) {
          descriptors.push(detection.descriptor);
          console.log(`Sample ${i + 1}/${samples} captured`);
        }

        // Wait a bit between captures for different angles/frames
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      if (descriptors.length < 3) {
        throw new Error('Insufficient face samples. Need at least 3 clear samples.');
      }

      // Average descriptors for robustness
      const averageDescriptor = this.averageDescriptors(descriptors);

      return {
        success: true,
        descriptor: averageDescriptor,
        samples: descriptors.length,
        quality: this.assessFaceQuality(descriptors)
      };

    } catch (error) {
      console.error('Face enrollment error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Verify face against stored templates
  async verifyFace(input) {
    if (!this.modelsLoaded) {
      throw new Error('Face recognition models not loaded');
    }

    try {
      // Get current face descriptor
      const detection = await faceapi
        .detectSingleFace(input)
        .withFaceDescriptor();

      if (!detection) {
        return {
          success: false,
          error: 'No face detected. Please ensure your face is clearly visible.'
        };
      }

      // Get stored face descriptors
      const storedDescriptors = this.getStoredDescriptors();

      if (storedDescriptors.length === 0) {
        return {
          success: false,
          error: 'No enrolled faces found. Please enroll your face first.'
        };
      }

      // Create face matcher
      const labeledDescriptors = storedDescriptors.map((stored, index) =>
        new faceapi.LabeledFaceDescriptors(`face-${index}`, stored.descriptor)
      );

      const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors);

      // Find best match
      const result = faceMatcher.findBestMatch(detection.descriptor);

      // Calculate confidence (lower distance = higher confidence)
      const confidence = 1 - result.distance;
      const similarity = (1 - result.distance) * 100; // Convert to percentage

      // Consider it a match if confidence > 70%
      const isMatch = confidence > 0.7;

      return {
        success: isMatch,
        confidence: confidence,
        similarity: similarity,
        distance: result.distance,
        matchedFace: isMatch ? result.label : null,
        error: isMatch ? null : 'Face not recognized. Please try again or enroll your face.'
      };

    } catch (error) {
      console.error('Face verification error:', error);
      return {
        success: false,
        error: 'Verification failed. Please try again.'
      };
    }
  }

  // Helper: Average face descriptors for enrollment
  averageDescriptors(descriptors) {
    if (descriptors.length === 0) return null;

    const average = new Float32Array(descriptors[0].length);

    // Sum all descriptors
    descriptors.forEach(desc => {
      desc.forEach((val, idx) => {
        average[idx] += val;
      });
    });

    // Calculate average
    descriptors.forEach((_, idx) => {
      average[idx] /= descriptors.length;
    });

    return Array.from(average);
  }

  // Helper: Assess face quality (experimental)
  assessFaceQuality(descriptors) {
    if (descriptors.length < 3) return 'low';

    try {
      // Check descriptor variance (higher variance = better quality)
      const variances = descriptors[0].map((_, idx) => {
        const values = descriptors.map(desc => desc[idx]);
        const mean = values.reduce((a, b) => a + b) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        return variance;
      });

      const averageVariance = variances.reduce((a, b) => a + b) / variances.length;

      if (averageVariance > 0.05) return 'high';     // Good variance
      if (averageVariance > 0.02) return 'medium';   // Moderate variance
      return 'low';                                  // Poor variance
    } catch {
      return 'unknown';
    }
  }

  // Storage management
  getStoredDescriptors() {
    try {
      const stored = localStorage.getItem('biometric_faces');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading stored face descriptors:', error);
      return [];
    }
  }

  storeDescriptor(descriptor, metadata = {}) {
    try {
      const storedFaces = this.getStoredDescriptors();
      storedFaces.push({
        descriptor: descriptor,
        enrolledAt: new Date().toISOString(),
        quality: this.assessFaceQuality([descriptor]),
        ...metadata
      });

      localStorage.setItem('biometric_faces', JSON.stringify(storedFaces));
      return { success: true };
    } catch (error) {
      console.error('Error storing face descriptor:', error);
      return { success: false, error: error.message };
    }
  }

  clearStoredDescriptors() {
    localStorage.removeItem('biometric_faces');
    return { success: true };
  }

  // Utility: Check if camera is available
  async checkCameraAccess() {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return { available: false, error: 'Camera API not supported' };
      }

      // Request permission temporarily
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop()); // Stop immediately

      return { available: true };
    } catch (error) {
      if (error.name === 'NotAllowedError') {
        return { available: false, error: 'Camera access denied' };
      }
      if (error.name === 'NotFoundError') {
        return { available: false, error: 'No camera found' };
      }
      return { available: false, error: error.message };
    }
  }

  // Utility: Get face detection status
  getStatus() {
    return {
      modelsLoaded: this.modelsLoaded,
      isInitializing: this.isInitializing,
      storedFacesCount: this.getStoredDescriptors().length,
      cameraSupported: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    };
  }
}

// Create singleton instance
const faceRecognition = new FaceRecognitionService();
export default faceRecognition;

// Helper: Initialize on module load (optional)
// faceRecognition.initialize();
