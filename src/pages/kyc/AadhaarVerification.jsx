// src/pages/kyc/AadhaarVerification.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKYC } from '../../hooks/useKYC';
import { Button } from '../../components/common/Button';
import { ProgressStepper } from '../../components/kyc/ProgressStepper';
import { VALIDATION, ERROR_MESSAGES } from '../../utils/constants';

export const AadhaarVerification = () => {
  const navigate = useNavigate();
  const { submitAadhaar, loading, error, clearError } = useKYC();

  const [aadhaar, setAadhaar] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format Aadhaar as user types (XXXX XXXX XXXX)
  const formatAadhaar = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Limit to 12 digits
    const limited = digits.slice(0, 12);
    
    // Add spaces every 4 digits
    const parts = [];
    for (let i = 0; i < limited.length; i += 4) {
      parts.push(limited.slice(i, i + 4));
    }
    
    return parts.join(' ');
  };

  const handleAadhaarChange = (e) => {
    const formatted = formatAadhaar(e.target.value);
    setAadhaar(formatted);
    
    // Clear errors when user types
    if (validationError) setValidationError('');
    if (error) clearError();
  };

  const validateAadhaar = () => {
    const digits = aadhaar.replace(/\s/g, '');
    
    if (!digits) {
      setValidationError('Aadhaar number is required');
      return false;
    }
    
    if (digits.length !== 12) {
      setValidationError('Aadhaar must be exactly 12 digits');
      return false;
    }
    
    if (!VALIDATION.AADHAAR_REGEX.test(digits)) {
      setValidationError(ERROR_MESSAGES.INVALID_AADHAAR);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    if (!validateAadhaar()) return;
    
    try {
      setIsSubmitting(true);
      const digits = aadhaar.replace(/\s/g, '');
      await submitAadhaar(digits);
      
      // Success! Move to next step
      navigate('/kyc/face');
    } catch (err) {
      console.error('Aadhaar verification failed:', err);
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
            onClick={() => navigate('/kyc/start')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-xl font-bold">Aadhaar Verification</h1>
        </div>
      </header>

      {/* Progress Stepper */}
      <ProgressStepper currentStep={2} />

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Instructions */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🆔</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Enter your Aadhaar number
          </h2>
          <p className="text-gray-600">
            We'll verify your identity using your 12-digit Aadhaar number
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Aadhaar Input */}
          <div>
            <label htmlFor="aadhaar" className="block text-sm font-medium mb-2">
              Aadhaar Number
            </label>
            <input
              id="aadhaar"
              type="text"
              value={aadhaar}
              onChange={handleAadhaarChange}
              placeholder="XXXX XXXX XXXX"
              className={`
                w-full px-4 py-4 text-lg font-mono tracking-wider
                border-2 rounded-lg transition-colors
                focus:outline-none
                ${
                  validationError
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 bg-gray-50 focus:border-black focus:bg-white'
                }
              `}
              autoFocus
              inputMode="numeric"
              maxLength={14} // 12 digits + 2 spaces
            />
            {validationError && (
              <p className="mt-2 text-sm text-red-500 flex items-start gap-1">
                <span>⚠</span>
                {validationError}
              </p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              Your Aadhaar number will be encrypted and stored securely
            </p>
          </div>

          {/* Security Note */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">🔒</span>
              <div>
                <p className="font-medium text-sm mb-1">Your privacy is protected</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• We only verify the last 4 digits with government database</li>
                  <li>• Your full Aadhaar number is encrypted end-to-end</li>
                  <li>• We comply with all data protection regulations</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="full"
            loading={isSubmitting || loading}
            disabled={aadhaar.replace(/\s/g, '').length !== 12}
          >
            {isSubmitting || loading ? 'Verifying...' : 'Continue'}
          </Button>

          {/* Help Text */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/kyc/start')}
              className="text-sm text-gray-600 hover:text-black"
            >
              ← Go back
            </button>
          </div>
        </form>

        {/* FAQ Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="font-bold mb-4">Common questions</h3>
          <div className="space-y-4">
            <details className="group">
              <summary className="cursor-pointer font-medium flex items-center justify-between py-2">
                <span>What is Aadhaar?</span>
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-gray-600 mt-2 pl-4">
                Aadhaar is a 12-digit unique identification number issued by the Government of India to residents. It's used for identity verification across various services.
              </p>
            </details>

            <details className="group">
              <summary className="cursor-pointer font-medium flex items-center justify-between py-2">
                <span>Is my Aadhaar data safe?</span>
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-gray-600 mt-2 pl-4">
                Yes! We use bank-level encryption and only verify the last 4 digits. Your full Aadhaar number is never stored in plain text.
              </p>
            </details>

            <details className="group">
              <summary className="cursor-pointer font-medium flex items-center justify-between py-2">
                <span>What if I don't have Aadhaar?</span>
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-gray-600 mt-2 pl-4">
                Aadhaar verification is required for driver accounts. You can apply for Aadhaar at any enrollment center. Visit uidai.gov.in for more information.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};