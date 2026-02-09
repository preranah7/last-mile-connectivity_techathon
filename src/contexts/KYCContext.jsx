import { createContext, useState, useEffect, useCallback } from 'react';
import {
  startKYC,
  submitAadhaar as submitAadhaarService,
  submitFaceVerification,
  getKYCStatus as getKYCStatusService,
  isKYCComplete,
  getKYCProgress,
} from '../services/kycService';
import { useAuth } from '../hooks/useAuth';


export const KYCContext = createContext(null);

export const KYCProvider = ({ children }) => {
    const [kycStatus, setKycStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(null);

    const [currentStep, setCurrentStep] = useState(1);

    const [progress, setProgress] = useState(0);

    const { user, updateUser } = useAuth();

    useEffect(() => {
    const fetchKYCStatus = async () => {
      // Only fetch if user is logged in
      if (!user) return;

      try {
        setLoading(true);
        const status = await getKYCStatusService();
        setKycStatus(status);

        // Calculate progress
        const progressValue = getKYCProgress(status);
        setProgress(progressValue);

        // Determine current step
        determineCurrentStep(status);

        console.log('KYC status loaded:', status);
      } catch (err) {
        console.error('Error fetching KYC status:', err);
        // Don't set error if user just hasn't started KYC
        if (err.status !== 404) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchKYCStatus();
  }, [user]);

  const determineCurrentStep = (status) => {
    if (!status) {
      setCurrentStep(1); // Start
      return;
    }

    if (isKYCComplete(status)) {
      setCurrentStep(4); // Complete
    } else if (status.aadhaar === 'VERIFIED' && status.face !== 'VERIFIED') {
      setCurrentStep(3); // Face verification
    } else if (status.aadhaar !== 'VERIFIED') {
      setCurrentStep(2); // Aadhaar verification
    } else {
      setCurrentStep(1); // Start
    }
  };

   const refreshKYCStatus = async () => {
    try {
      const status = await getKYCStatusService();
      setKycStatus(status);

      const progressValue = getKYCProgress(status);
      setProgress(progressValue);

      determineCurrentStep(status);

      // If KYC is complete, update user context
      if (isKYCComplete(status)) {
        updateUser({ kycStatus: 'VERIFIED' });
      }

      return status;
    } catch (err) {
      console.error('Error refreshing KYC status:', err);
      throw err;
    }
  };


  const startVerification = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await startKYC();

      // Update user context
      updateUser({ kycStatus: 'IN_PROGRESS' });

      // Move to next step
      setCurrentStep(2);

      console.log('KYC started:', result);
      return result;

    } catch (err) {
      console.error('Start KYC error:', err);
      setError(err.message || 'Failed to start KYC');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [updateUser]);

  const submitAadhaar = useCallback(async (aadhaarNumber) => {
    try {
      setLoading(true);
      setError(null);

      const result = await submitAadhaarService(aadhaarNumber);

      // Refresh KYC status
      await refreshKYCStatus();

      // Move to next step if verified
      if (result.aadhaarStatus === 'VERIFIED') {
        setCurrentStep(3);
        setProgress(50);
      }

      console.log('Aadhaar verified:', result);
      return result;

    } catch (err) {
      console.error('Aadhaar verification error:', err);
      setError(err.message || 'Aadhaar verification failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);


  const submitFace = useCallback(async (imageFile) => {
    try {
      setLoading(true);
      setError(null);

      const result = await submitFaceVerification(imageFile);

      // Refresh KYC status
      const status = await refreshKYCStatus();

      // If all verified, mark as complete
      if (isKYCComplete(status)) {
        setCurrentStep(4);
        setProgress(100);
        updateUser({ kycStatus: 'VERIFIED' });
      }

      console.log('Face verified:', result);
      return result;

    } catch (err) {
      console.error('Face verification error:', err);
      setError(err.message || 'Face verification failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [updateUser]);


  const checkStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const status = await refreshKYCStatus();
      return status;

    } catch (err) {
      console.error('Check status error:', err);
      setError(err.message || 'Failed to check KYC status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);


  const resetKYC = useCallback(() => {
    setKycStatus(null);
    setCurrentStep(1);
    setProgress(0);
    setError(null);
  }, []);

   const clearError = useCallback(() => {
    setError(null);
  }, []);


  const isAadhaarVerified = kycStatus?.aadhaar === 'VERIFIED';

  const isFaceVerified = kycStatus?.face === 'VERIFIED';

  const isVerified = kycStatus && isKYCComplete(kycStatus);

  const isInProgress = user?.kycStatus === 'IN_PROGRESS';

  const isNotStarted = !user?.kycStatus || user?.kycStatus === 'NOT_STARTED';

  const value = {
    // State
    kycStatus,                  // Full KYC status object
    loading,                    // Is operation in progress?
    error,                      // Error message
    currentStep,                // Current step (1-4)
    progress,                   // Progress percentage (0-100)

    // Status checks
    isAadhaarVerified,          // Is Aadhaar verified?
    isFaceVerified,             // Is face verified?
    isVerified,                 // Is KYC complete?
    isInProgress,               // Is KYC in progress?
    isNotStarted,               // Is KYC not started?

    // Actions
    startVerification,          // Start KYC process
    submitAadhaar,              // Submit Aadhaar
    submitFace,                 // Submit face photo
    checkStatus,                // Refresh KYC status
    resetKYC,                   // Reset state (testing)
    clearError,                 // Clear error message
  };


  return (
    <KYCContext.Provider value={value}>
      {children}
    </KYCContext.Provider>
  );
};