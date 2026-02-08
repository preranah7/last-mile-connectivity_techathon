import api, { handleApiError } from './api';
import { AUTH_ENDPOINTS } from '../utils/constants';
import { setTokens, setAccessToken,getAccessToken, setUserData, clearAllStorage } from '../utils/storage';
import { auth, googleProvider, setupRecaptcha } from '../config/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithPhoneNumber,
  signOut as firebaseSignOut,
} from 'firebase/auth';


export const loginWithEmail = async (email, password) => {
  try {
    // Step 1: Authenticate with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Step 2: Get Firebase ID token
    const firebaseToken = await userCredential.user.getIdToken();
    
    // Step 3: Send to backend
    const response = await api.post(AUTH_ENDPOINTS.LOGIN, {
      firebaseToken,
      provider: 'email',
    });
    
    const { accessToken, refreshToken, user } = response.data;
    
    // Step 4: Store tokens and user data
    setTokens(accessToken, refreshToken);
    setUserData(user);
    
    return { user, accessToken, refreshToken };
    
  } catch (error) {
    console.error('Email login error:', error);
    throw handleApiError(error);
  }
};




export const signupWithEmail = async (email, password, name = '') => {
  try {
    // Step 1: Create Firebase account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Step 2: Get Firebase ID token
    const firebaseToken = await userCredential.user.getIdToken();
    
    // Step 3: Send to backend
    const response = await api.post(AUTH_ENDPOINTS.LOGIN, {
      firebaseToken,
      provider: 'email',
      name, // Optional: Include user name
    });
    
    const { accessToken, refreshToken, user } = response.data;
    
    // Step 4: Store tokens and user data
    setTokens(accessToken, refreshToken);
    setUserData(user);
    
    return { user, accessToken, refreshToken };
    
  } catch (error) {
    console.error('Email signup error:', error);
    throw handleApiError(error);
  }
};




export const loginWithGoogle = async () => {
  try {
    // Step 1 & 2: Open Google popup and authenticate
    const result = await signInWithPopup(auth, googleProvider);
    
    // Step 3: Get Firebase ID token
    const firebaseToken = await result.user.getIdToken();
    
    // Step 4: Send to backend
    const response = await api.post(AUTH_ENDPOINTS.LOGIN, {
      firebaseToken,
      provider: 'google',
      name: result.user.displayName, // Google provides name
      photoUrl: result.user.photoURL, // Google provides photo
    });
    
    const { accessToken, refreshToken, user } = response.data;
    
    // Step 5: Store tokens and user data
    setTokens(accessToken, refreshToken);
    setUserData(user);
    
    return { user, accessToken, refreshToken };
    
  } catch (error) {
    console.error('Google login error:', error);
    
    // Handle specific Google errors
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in cancelled');
    }
    
    throw handleApiError(error);
  }
};




let confirmationResult = null;
export const sendOTP = async (phoneNumber) => {
  try {
    // Step 1: Setup reCAPTCHA (required for phone auth)
    const recaptchaVerifier = setupRecaptcha();
    
    // Step 2: Send OTP
    confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      recaptchaVerifier
    );
    
    console.log('OTP sent successfully');
    
  } catch (error) {
    console.error('Send OTP error:', error);
    
    // Handle specific phone errors
    if (error.code === 'auth/invalid-phone-number') {
      throw new Error('Invalid phone number');
    }
    if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many requests. Please try again later.');
    }
    
    throw handleApiError(error);
  }
};



export const verifyOTP = async (otp) => {
  try {
    if (!confirmationResult) {
      throw new Error('Please request OTP first');
    }
    
    // Step 1: Verify OTP
    const userCredential = await confirmationResult.confirm(otp);
    
    // Step 2: Get Firebase ID token
    const firebaseToken = await userCredential.user.getIdToken();
    
    // Step 3: Send to backend
    const response = await api.post(AUTH_ENDPOINTS.LOGIN, {
      firebaseToken,
      provider: 'phone',
      phone: userCredential.user.phoneNumber,
    });
    
    const { accessToken, refreshToken, user } = response.data;
    
    // Step 4: Store tokens and user data
    setTokens(accessToken, refreshToken);
    setUserData(user);
    
    // Clear confirmation result
    confirmationResult = null;
    
    return { user, accessToken, refreshToken };
    
  } catch (error) {
    console.error('Verify OTP error:', error);
    
    // Handle specific OTP errors
    if (error.code === 'auth/invalid-verification-code') {
      throw new Error('Invalid OTP. Please try again.');
    }
    if (error.code === 'auth/code-expired') {
      throw new Error('OTP expired. Please request a new one.');
    }
    
    throw handleApiError(error);
  }
};





export const logout = async () => {
  try {
    // Step 1: Call backend logout
    // This invalidates the refresh token on the server
    await api.post(AUTH_ENDPOINTS.LOGOUT);
    
    // Step 2: Sign out from Firebase
    await firebaseSignOut(auth);
    
    // Step 3: Clear local storage
    clearAllStorage();
    
  } catch (error) {
    console.error('Logout error:', error);
    
    // Even if backend call fails, clear local data
    await firebaseSignOut(auth);
    clearAllStorage();
  }
};



export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await api.post(AUTH_ENDPOINTS.REFRESH, {
      refreshToken,
    });
    
    const { accessToken } = response.data;
    setAccessToken(accessToken);
    
    return accessToken;
    
  } catch (error) {
    console.error('Token refresh error:', error);
    
    // If refresh fails, logout user
    clearAllStorage();
    throw handleApiError(error);
  }
};



export const isAuthenticated = () => {
  return !!getAccessToken();
};


export const getCurrentFirebaseUser = () => {
  return auth.currentUser;
};