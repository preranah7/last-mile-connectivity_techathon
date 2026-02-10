// src/pages/kyc/FaceVerification.jsx

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKYC } from '../../hooks/useKYC';
import { Button } from '../../components/common/Button';
import { ProgressStepper } from '../../components/kyc/ProgressStepper';

export const FaceVerification = () => {
  const navigate = useNavigate();
  const { submitFace, loading, error, clearError } = useKYC();
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Start camera on mount
  useEffect(() => {
    startCamera();
    return () => {
      // Cleanup: stop camera on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      setCameraError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user', // Front camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera error:', err);
      setCameraError(
        'Unable to access camera. Please grant camera permission and try again.'
      );
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    context.drawImage(video, 0, 0);
    
    // Convert to blob
    canvas.toBlob((blob) => {
      setCapturedImage(blob);
      
      // Stop camera to save resources
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }, 'image/jpeg', 0.9);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    clearError();
    startCamera();
  };

  const handleSubmit = async () => {
    if (!capturedImage) return;
    
    try {
      setIsSubmitting(true);
      clearError();
      
      // Convert blob to file
      const file = new File([capturedImage], 'face-photo.jpg', {
        type: 'image/jpeg'
      });
      
      await submitFace(file);
      
      // Success! Go to completion page
      navigate('/kyc/complete');
    } catch (err) {
      console.error('Face verification failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/kyc/aadhaar')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-xl font-bold">Face Verification</h1>
        </div>
      </header>

      {/* Progress Stepper */}
      <ProgressStepper currentStep={3} />

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Instructions */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📸</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Take a selfie
          </h2>
          <p className="text-gray-600">
            Position your face in the frame and capture a clear photo
          </p>
        </div>

        {/* Error Messages */}
        {(error || cameraError) && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <p className="text-sm text-red-700">{error || cameraError}</p>
          </div>
        )}

        {/* Camera/Photo Section */}
        <div className="mb-6">
          <div className="relative bg-black rounded-lg overflow-hidden aspect-[4/3] max-w-lg mx-auto">
            {!capturedImage ? (
              <>
                {/* Live Camera Feed */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                
                {/* Face Guide Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative">
                    {/* Oval face guide */}
                    <div className="w-48 h-64 border-4 border-white rounded-full opacity-50"></div>
                    {/* Corner guides */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white"></div>
                  </div>
                </div>

                {/* Instructions Overlay */}
                {!cameraError && (
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    <div className="inline-block bg-black bg-opacity-75 text-white px-4 py-2 rounded-full text-sm">
                      Position your face in the oval
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Captured Photo Preview */}
                <img
                  src={URL.createObjectURL(capturedImage)}
                  alt="Captured selfie"
                  className="w-full h-full object-cover"
                />
                
                {/* Checkmark Overlay */}
                <div className="absolute top-4 right-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl">✓</span>
                  </div>
                </div>
              </>
            )}

            {/* Hidden canvas for capturing */}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Tips */}
          {!capturedImage && !cameraError && (
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <p className="font-medium text-sm mb-2">Tips for a good photo:</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>✓ Remove glasses and face coverings</li>
                <li>✓ Ensure good lighting on your face</li>
                <li>✓ Look directly at the camera</li>
                <li>✓ Keep a neutral expression</li>
              </ul>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {!capturedImage ? (
            <>
              {!cameraError && (
                <Button
                  variant="primary"
                  size="full"
                  onClick={capturePhoto}
                  disabled={!stream}
                >
                  Capture Photo
                </Button>
              )}
              
              {cameraError && (
                <Button
                  variant="primary"
                  size="full"
                  onClick={startCamera}
                >
                  Try Again
                </Button>
              )}
            </>
          ) : (
            <>
              <Button
                variant="primary"
                size="full"
                onClick={handleSubmit}
                loading={isSubmitting || loading}
              >
                {isSubmitting || loading ? 'Verifying...' : 'Submit Photo'}
              </Button>

              <Button
                variant="secondary"
                size="full"
                onClick={retakePhoto}
                disabled={isSubmitting || loading}
              >
                Retake Photo
              </Button>
            </>
          )}
        </div>

        {/* Security Note */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0">🔒</span>
            <div>
              <p className="font-medium text-sm text-blue-900 mb-1">
                Your photo is secure
              </p>
              <p className="text-xs text-blue-800">
                We use face verification technology to match your photo with your Aadhaar. 
                Your image is encrypted and used only for verification purposes.
              </p>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <button className="text-sm text-gray-600 hover:text-black">
            Having trouble? Get help →
          </button>
        </div>
      </div>
    </div>
  );
};