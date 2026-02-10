// src/pages/kyc/KYCStart.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKYC } from '../../hooks/useKYC';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common/Button';
import { ProgressStepper } from '../../components/kyc/ProgressStepper.jsx';

export const KYCStart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { startVerification, loading, error } = useKYC();
  const [starting, setStarting] = useState(false);

  // If already verified, redirect to dashboard
  if (user?.kycStatus === 'VERIFIED') {
    navigate('/dashboard');
    return null;
  }

  const handleStart = async () => {
    try {
      setStarting(true);
      await startVerification();
      navigate('/kyc/aadhaar');
    } catch (err) {
      console.error('Start KYC failed:', err);
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">LastMile</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-gray-600 hover:text-black"
          >
            Skip for now
          </button>
        </div>
      </header>

      {/* Progress Stepper */}
      <ProgressStepper currentStep={1} />

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🔒</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Verify your identity
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Complete KYC verification to unlock driver features and start earning with LastMile
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* What You Need Section */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-bold mb-4">What you'll need</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <p className="font-medium">Aadhaar number</p>
                <p className="text-sm text-gray-600">Your 12-digit Aadhaar card number</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <p className="font-medium">A clear selfie</p>
                <p className="text-sm text-gray-600">We'll use your camera to verify your identity</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <p className="font-medium">5 minutes</p>
                <p className="text-sm text-gray-600">The entire process is quick and simple</p>
              </div>
            </div>
          </div>
        </div>

        {/* Why We Need This */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4">Why we need this</h3>
          <div className="space-y-3 text-gray-600">
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">🛡️</span>
              <p className="text-sm">
                <span className="font-medium text-black">Safety first:</span> KYC helps us keep the LastMile community safe for everyone
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">✅</span>
              <p className="text-sm">
                <span className="font-medium text-black">Regulatory compliance:</span> Required by law to verify driver identities
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">🔐</span>
              <p className="text-sm">
                <span className="font-medium text-black">Your data is secure:</span> We use bank-level encryption to protect your information
              </p>
            </div>
          </div>
        </div>

        {/* Important Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0">ℹ️</span>
            <div>
              <p className="font-medium text-blue-900 mb-1">Important</p>
              <p className="text-sm text-blue-800">
                Make sure you have good lighting and your Aadhaar card handy. The verification typically takes 2-3 minutes.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            variant="primary"
            size="full"
            onClick={handleStart}
            loading={starting || loading}
          >
            Start verification
          </Button>

          <Button
            variant="secondary"
            size="full"
            onClick={() => navigate('/dashboard')}
            disabled={starting || loading}
          >
            I'll do this later
          </Button>
        </div>

        {/* Privacy Note */}
        <p className="text-xs text-center text-gray-500 mt-6">
          By continuing, you agree to share your information for verification purposes. 
          Read our{' '}
          <a href="#" className="underline hover:text-black">Privacy Policy</a>
          {' '}and{' '}
          <a href="#" className="underline hover:text-black">Terms of Service</a>
        </p>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <p>© 2026 LastMile Technologies Inc.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-black">Help</a>
              <a href="#" className="hover:text-black">Privacy</a>
              <a href="#" className="hover:text-black">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};