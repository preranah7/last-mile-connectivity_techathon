import api, { handleApiError, createFormData } from './api';
import { KYC_ENDPOINTS } from '../utils/constants';

export const startKYC = async () => {
  try {
    const response = await api.post(KYC_ENDPOINTS.START);
    
    console.log('KYC started:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('Start KYC error:', error);
    throw handleApiError(error);
  }
};



export const submitAadhaar = async (aadhaarNumber) => {
  try {
    // Validate Aadhaar format (12 digits)
    if (!/^\d{12}$/.test(aadhaarNumber)) {
      throw new Error('Aadhaar must be exactly 12 digits');
    }

    const response = await api.post(KYC_ENDPOINTS.AADHAAR, {
      aadhaarLast4: aadhaarNumber.slice(-4), // Send last 4 digits
      // In production, you might send full number encrypted
    });
    
    console.log('Aadhaar verified:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('Aadhaar verification error:', error);
    throw handleApiError(error);
  }
};


export const submitFaceVerification = async (imageFile) => {
  try {
    // Validate file
    if (!imageFile) {
      throw new Error('Please provide an image file');
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(imageFile.type)) {
      throw new Error('Please upload a JPG or PNG image');
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (imageFile.size > maxSize) {
      throw new Error('Image size must be less than 5MB');
    }

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('image', imageFile);

    // Send multipart/form-data request
    const response = await api.post(KYC_ENDPOINTS.FACE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('Face verified:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('Face verification error:', error);
    throw handleApiError(error);
  }
};


export const submitFaceVerificationBase64 = async (base64Image) => {
  try {
    if (!base64Image) {
      throw new Error('Please provide an image');
    }

    const response = await api.post(KYC_ENDPOINTS.FACE, {
      image: base64Image, // Send as JSON
    });
    
    console.log('Face verified (base64):', response.data);
    return response.data;
    
  } catch (error) {
    console.error('Face verification error:', error);
    throw handleApiError(error);
  }
};


export const getKYCStatus = async () => {
  try {
    const response = await api.get(KYC_ENDPOINTS.STATUS);
    
    console.log('KYC status:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('Get KYC status error:', error);
    throw handleApiError(error);
  }
};





//helper function

//image to base 64 string
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      resolve(reader.result);
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsDataURL(file);
  });
};



export const isValidAadhaar = (aadhaar) => {
  // Must be exactly 12 digits
  return /^\d{12}$/.test(aadhaar);
};


export const formatAadhaar = (aadhaar) => {
  if (!aadhaar || aadhaar.length !== 12) return aadhaar;
  
  // Show only last 4 digits
  return `XXXX XXXX ${aadhaar.slice(-4)}`;
};



export const isKYCComplete = (status) => {
  if (!status) return false;
  
  return (
    status.aadhaar === 'VERIFIED' &&
    status.face === 'VERIFIED' &&
    status.overall === 'VERIFIED'
  );
};



export const getKYCProgress = (status) => {
  if (!status) return 0;
  
  let progress = 0;
  
  if (status.aadhaar === 'VERIFIED') progress += 50;
  if (status.face === 'VERIFIED') progress += 50;
  
  return progress;
};