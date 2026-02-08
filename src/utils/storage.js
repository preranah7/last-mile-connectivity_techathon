const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  KYC_STATUS: 'kyc_status',
};


//saving access token in Local storage
export const setAccessToken = (token) => {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  }
};


//getting access token from local storage
export const getAccessToken = () => {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};


//saving refresh token in local storage
export const setRefreshToken = (token) => {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  }
};


//getting refresh token from local storage
export const getRefreshToken = () => {
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
};


//setting both tokens at one time
export const setTokens = (accessToken, refreshToken) => {
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
};


//clearing both tokens at one time
export const clearTokens = () => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
};



//user data set
export const setUserData = (userData) => {
  if (userData) {
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  }
};



//user data get
export const getUserData = () => {
  const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  try {
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};



//update user data
export const updateUserData = (updates) => {
  const currentData = getUserData();
  if (currentData) {
    const updatedData = { ...currentData, ...updates };
    setUserData(updatedData);
    return updatedData;
  }
  return null;
};


//after logout - clear data
export const clearUserData = () => {
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
};


//set kyc status
export const setKYCStatus = (status) => {
  if (status) {
    localStorage.setItem(STORAGE_KEYS.KYC_STATUS, status);
  }
};


//get will return - NOT_STARTED | IN_PROGRESS | VERIFIED
export const getKYCStatus = () => {
  return localStorage.getItem(STORAGE_KEYS.KYC_STATUS);
};


//clear status
export const clearKYCStatus = () => {
  localStorage.removeItem(STORAGE_KEYS.KYC_STATUS);
};



//clear all storage data
export const clearAllStorage = () => {
  clearTokens();
  clearUserData();
  clearKYCStatus();
};



/**
 * Check if user is authenticated
 * Quick check by looking for access token
 */
export const isAuthenticated = () => {
  return !!getAccessToken();
};



export { STORAGE_KEYS };