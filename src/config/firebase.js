import { initializeApp } from 'firebase/app';

import {  getAuth, GoogleAuthProvider, RecaptchaVerifier } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account' 
});


export const setupRecaptcha = (containerId = 'recaptcha-container') => {
  return new RecaptchaVerifier(auth, containerId, {
    size: 'invisible', // normal or invisible
    callback: (response) => {
      // after recaptcha is solved allow phone authentication
      console.log('reCAPTCHA verified');
    },
    'expired-callback': () => {
      // Response expired, user needs to solve reCAPTCHA again
      console.log('reCAPTCHA expired');
    }
  });
};


export default app;