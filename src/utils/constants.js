export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',           // POST - Email/Password/Phone/Google login
  REFRESH: '/auth/refresh',       // POST - Get new access token
  LOGOUT: '/auth/logout',         // POST - Invalidate tokens
};


export const USER_ENDPOINTS = {
  ME: '/user/me',                 // GET - Get current user data
  UPDATE_PROFILE: '/user/profile', // POST - Update basic profile
};


export const KYC_ENDPOINTS = {
  START: '/kyc/start',            // POST - Initialize KYC process
  AADHAAR: '/kyc/aadhaar',        // POST - Submit Aadhaar
  FACE: '/kyc/face',              // POST - Submit face verification
  STATUS: '/kyc/status',          // GET - Check KYC verification status
};



export const TRIP_ENDPOINTS = {
  CREATE: '/trip/create',         // POST - Create trip (Driver)
  NEARBY: '/trip/nearby',         // GET - View nearby trips (Rider)
  JOIN: '/trip/join',             // POST - Join a trip (Rider)
  DETAILS: '/trip/:id',           // GET - Get trip details
};


export const WS_ENDPOINTS = {
  LOCATION: '/ws/location',       // WebSocket for real-time location
};


export const KYC_STATUS = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED',           // In case verification fails
};


export const USER_ROLES = {
  RIDER: 'RIDER',
  DRIVER: 'DRIVER',
  ADMIN: 'ADMIN',                 // Future: Admin panel
};


export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  
  // Protected routes
  DASHBOARD: '/dashboard',
  DRIVER_DASHBOARD: '/driver/dashboard',
  RIDER_DASHBOARD: '/rider/dashboard',
  
  // KYC routes
  KYC_START: '/kyc/start',
  KYC_AADHAAR: '/kyc/aadhaar',
  KYC_FACE: '/kyc/face',
  KYC_STATUS: '/kyc/status',
  
  // Trip routes
  CREATE_TRIP: '/trip/create',
  BROWSE_TRIPS: '/trip/browse',
  TRIP_DETAILS: '/trip/:id',
};


export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[6-9]\d{9}$/,              // Indian phone numbers
  AADHAAR_REGEX: /^\d{12}$/,                // 12 digit Aadhaar
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
};



export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Session expired. Please login again.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  SERVER_ERROR: 'Something went wrong. Please try again later.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  EMAIL_REQUIRED: 'Email is required.',
  PASSWORD_REQUIRED: 'Password is required.',
  PHONE_REQUIRED: 'Phone number is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PHONE: 'Please enter a valid 10-digit phone number.',
  INVALID_AADHAAR: 'Please enter a valid 12-digit Aadhaar number.',
  PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters.`,
};


export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  SIGNUP_SUCCESS: 'Account created successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  KYC_STARTED: 'KYC verification started.',
  AADHAAR_VERIFIED: 'Aadhaar verified successfully!',
  FACE_VERIFIED: 'Face verification completed!',
  TRIP_CREATED: 'Trip created successfully!',
  TRIP_JOINED: 'You have joined the trip!',
};


export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  KYC_STATUS: 'kyc_status',
};


export const AUTH_PROVIDERS = {
  EMAIL: 'email',
  PHONE: 'phone',
  GOOGLE: 'google',
};


export const APP_CONFIG = {
  REQUEST_TIMEOUT: 30000,         // 30 seconds
  TOKEN_REFRESH_BUFFER: 60000,    // Refresh 1 min before expiry
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB for face photo
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png'],
};



export const TRIP_TYPES = {
  FIXED_SHARED: 'FIXED_SHARED',
  SHARED: 'SHARED',
  LIVE: 'LIVE',
  LONG: 'LONG',
};


export const TRIP_STATUS = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};