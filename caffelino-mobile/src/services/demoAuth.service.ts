import { authApi, ApiError } from '../api';
import { toIndianE164 } from '../utils/phone';
import type { User } from '../types';

/** Demo mode — no Firebase SMS. Matches backend demo OTP. */
export const DEMO_OTP = '123456';

/** Suggested test number (any valid 10-digit Indian number works) */
export const DEMO_PHONE_HINT = '9876543210';

const AUTH_TIMEOUT_MS = 12000;

/** Instant — never block the UI waiting for the network */
export function demoSendOtp(_localDigits: string): { isNewUser: boolean } {
  return { isNewUser: true };
}

export function demoResendOtp(): void {
  // Demo: no-op
}

export function demoValidateOtp(otp: string): void {
  if (otp !== DEMO_OTP) {
    throw new Error(`Invalid OTP. Use demo code ${DEMO_OTP}.`);
  }
}

export function buildLocalDemoUser(
  mobileNumber: string,
  opts?: {
    name?: string;
    username?: string;
    avatarId?: string;
    profileCompleted?: boolean;
  },
): { token: string; user: User } {
  const digits = mobileNumber.replace(/\D/g, '');
  const id = `local-${digits}`;

  const name = opts?.name ?? 'Coffee Lover';
  const [firstName, ...rest] = name.split(' ');

  return {
    token: `local-token-${digits}`,
    user: {
      id,
      name,
      firstName,
      lastName: rest.join(' ') || undefined,
      mobileNumber,
      username: opts?.username ?? `user${digits.slice(-4)}`,
      avatarId: opts?.avatarId ?? 'male-casual-1',
      gender: opts?.avatarId?.startsWith('female') ? 'female' : 'male',
      role: 'user',
      profileCompleted: opts?.profileCompleted ?? true,
      city: 'Hyderabad',
    },
  };
}

export async function demoVerifyExistingUser(e164: string): Promise<{
  token: string;
  user: NonNullable<Awaited<ReturnType<typeof authApi.verifyOtp>>['user']>;
}> {
  demoValidateOtp(DEMO_OTP);
  const res = await authApi.verifyOtp(e164, DEMO_OTP, AUTH_TIMEOUT_MS);

  if (!res.token || !res.user) {
    throw new ApiError('Login failed', 500);
  }

  return { token: res.token, user: res.user };
}

export async function demoRegisterUser(
  fullName: string,
  mobileNumber: string,
): Promise<{
  token: string;
  user: NonNullable<Awaited<ReturnType<typeof authApi.signup>>['user']>;
}> {
  const res = await authApi.signup(fullName, mobileNumber, AUTH_TIMEOUT_MS);

  if (!res.token || !res.user) {
    throw new ApiError('Registration failed', 500);
  }

  return { token: res.token, user: res.user };
}

export function isNetworkError(error: unknown): boolean {
  return error instanceof ApiError && (error.status === 0 || error.status >= 500);
}
