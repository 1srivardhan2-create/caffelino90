import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { toIndianE164 } from '../utils/phone';

let pendingConfirmation: FirebaseAuthTypes.ConfirmationResult | null = null;

export function getFirebaseAuth() {
  return auth();
}

/** Send real SMS OTP via Firebase (India +91…) */
export async function sendFirebasePhoneOtp(localDigits: string): Promise<void> {
  const e164 = `+${toIndianE164(localDigits)}`;
  pendingConfirmation = await auth().signInWithPhoneNumber(e164);
}

export async function resendFirebasePhoneOtp(localDigits: string): Promise<void> {
  await sendFirebasePhoneOtp(localDigits);
}

/** Confirm 6-digit OTP and return Firebase ID token for backend JWT exchange */
export async function verifyFirebasePhoneOtp(otpCode: string): Promise<string> {
  if (!pendingConfirmation) {
    throw new Error('No OTP session. Go back and request a new code.');
  }

  const credential = await pendingConfirmation.confirm(otpCode);
  pendingConfirmation = null;

  if (!credential?.user) {
    throw new Error('Invalid OTP. Please try again.');
  }

  const idToken = await credential.user.getIdToken(true);
  return idToken;
}

export function clearFirebaseOtpSession(): void {
  pendingConfirmation = null;
}

export async function signOutFirebase(): Promise<void> {
  clearFirebaseOtpSession();
  const current = auth().currentUser;
  if (current) {
    await auth().signOut();
  }
}
