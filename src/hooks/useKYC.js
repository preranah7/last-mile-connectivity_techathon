import { useContext } from 'react';
import { KYCContext } from '../contexts/KYCContext';

export const useKYC = () => {
  const context = useContext(KYCContext);

  if (!context) {
    throw new Error(
      'useKYC must be used within KYCProvider. ' +
      'Make sure your component is wrapped in <KYCProvider>.'
    );
  }

  return context;
};

