import { apiRequest } from './client';
import type { AuthResponse } from '../types';

export const authApi = {
  sendOtp(mobileNumber: string, timeout = 10000) {
    return apiRequest<AuthResponse>('/api/auth/mobile-login', {
      method: 'POST',
      body: JSON.stringify({ mobileNumber }),
      timeout,
    });
  },

  verifyOtp(mobileNumber: string, otp: string, timeout = 12000) {
    return apiRequest<AuthResponse>('/api/auth/mobile-verify-otp', {
      method: 'POST',
      body: JSON.stringify({ mobileNumber, otp }),
      timeout,
    });
  },

  signup(fullName: string, mobileNumber: string, timeout = 12000) {
    return apiRequest<AuthResponse>('/api/auth/mobile-signup', {
      method: 'POST',
      body: JSON.stringify({ fullName, mobileNumber }),
      timeout,
    });
  },

  firebasePhoneLogin(idToken: string) {
    return apiRequest<AuthResponse & { isNewUser?: boolean }>('/api/auth/firebase-phone', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
  },
};
