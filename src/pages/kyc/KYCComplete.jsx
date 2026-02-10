// src/pages/kyc/KYCComplete.jsx

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common/Button';
import { ProgressStepper } from '../../components/kyc/ProgressStepper';

export const KYCComplete = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // If not verified, redirect back
  useEffect(() => {
    if (user?.kycStatus !== 'VERIFIED') {
      navigate('/kyc/start');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">LastMile</h1>
        </div>
      </header>

      {/* Progress Stepper */}
      <ProgressStepper currentStep={4} />

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Success Hero */}
        <div className="text-center mb-8">
          {/* Animated Success Icon */}
          <div className="relative inline-block mb-6">
            <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-6xl">✓</span>
            </div>
            {/* Confetti effect (optional) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-4xl animate-bounce">🎉</div>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Verification complete!
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Congratulations! Your identity has been verified successfully.
          </p>
        </div>

        {/* What's Next Section */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <span>🚀</span>
            What's next?
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm flex-shrink-0 mt-1">
                1
              </div>
              <div>
                <p className="font-medium">Set up your driver profile</p>
                <p className="text-sm text-gray-600">
                  Add your vehicle details and preferences
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm flex-shrink-0 mt-1">
                2
              </div>
              <div>
                <p className="font-medium">Complete your training</p>
                <p className="text-sm text-gray-600">
                  Quick tutorial on how to use the driver app
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm flex-shrink-0 mt-1">
                3
              </div>
              <div>
                <p className="font-medium">Start earning!</p>
                <p className="text-sm text-gray-600">
                  Create your first trip and connect with riders
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-8">
          <h3 className="font-bold mb-4">You can now:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg">
              <span className="text-2xl flex-shrink-0">🚗</span>
              <div>
                <p className="font-medium text-sm">Create trips</p>
                <p className="text-xs text-gray-600">Offer rides and earn money</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg">
              <span className="text-2xl flex-shrink-0">💰</span>
              <div>
                <p className="font-medium text-sm">Earn rewards</p>
                <p className="text-xs text-gray-600">Access driver benefits</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg">
              <span className="text-2xl flex-shrink-0">📊</span>
              <div>
                <p className="font-medium text-sm">Track earnings</p>
                <p className="text-xs text-gray-600">Monitor your income</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg">
              <span className="text-2xl flex-shrink-0">🛡️</span>
              <div>
                <p className="font-medium text-sm">Safety features</p>
                <p className="text-xs text-gray-600">Protected every trip</p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0">ℹ️</span>
            <div>
              <p className="font-medium text-sm text-blue-900 mb-1">
                Important information
              </p>
              <p className="text-xs text-blue-800">
                Your verification is valid for 1 year. We'll notify you before it expires. 
                You can view your verification status anytime in your profile settings.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            variant="primary"
            size="full"
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </Button>

          <Button
            variant="secondary"
            size="full"
            onClick={() => navigate('/driver/setup')}
          >
            Set up Driver Profile
          </Button>
        </div>

        {/* Thank You Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Thank you for completing verification! 
            If you have any questions, our{' '}
            <a href="#" className="text-black font-medium hover:underline">
              support team
            </a>{' '}
            is here to help.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <p>© 2026 LastMile Technologies Inc.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-black">Help Center</a>
              <a href="#" className="hover:text-black">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};