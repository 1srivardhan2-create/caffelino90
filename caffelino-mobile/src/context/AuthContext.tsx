import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { userApi, ApiError } from '../api';
import {
  demoSendOtp,
  demoResendOtp,
  demoValidateOtp,
  demoVerifyExistingUser,
  demoRegisterUser,
  buildLocalDemoUser,
  DEMO_OTP,
} from '../services/demoAuth.service';
import {
  getToken,
  getUser,
  setToken,
  setUser,
  clearSession,
  isOnboardingComplete,
  isLocationGranted,
} from '../services/storage.service';
import type { User } from '../types';
import { toIndianE164 } from '../utils/phone';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  hasLocationPermission: boolean;
}

interface AuthContextValue extends AuthState {
  bootstrap: () => Promise<void>;
  sendPhoneOtp: (localDigits: string) => Promise<{ isNewUser: boolean }>;
  resendPhoneOtp: () => Promise<void>;
  verifyPhoneOtp: (
    localDigits: string,
    otp: string,
    isNewUser: boolean,
  ) => Promise<{ isNewUser: boolean }>;
  finishOnboarding: (data: {
    fullName: string;
    mobileNumber: string;
    avatarId: string;
    gender: 'male' | 'female';
  }) => Promise<void>;
  completeProfile: (data: {
    fullName: string;
    username: string;
    avatarId: string;
    mobileNumber: string;
    city?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  markLocationGranted: (city?: string) => Promise<void>;
  refreshUser: (user: User) => Promise<void>;
  demoOtp: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function mapApiUser(raw: {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNumber?: string;
  avatarId?: string;
  username?: string;
  gender?: string;
  city?: string;
  role?: string;
  profileCompleted?: boolean;
}): User {
  return {
    id: raw.id,
    name: raw.name ?? '',
    firstName: raw.firstName,
    lastName: raw.lastName,
    email: raw.email,
    mobileNumber: raw.mobileNumber,
    avatarId: raw.avatarId,
    username: raw.username,
    gender: raw.gender,
    city: raw.city,
    role: raw.role ?? 'user',
    profileCompleted: raw.profileCompleted ?? false,
  };
}

function generateUsername(fullName: string): string {
  const base = fullName.trim().split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '') || 'user';
  return `${base}${String(Date.now()).slice(-4)}`;
}

async function markOnboardingDone(
  token: string,
  user: User,
  setState: React.Dispatch<React.SetStateAction<AuthState>>,
) {
  await setToken(token);
  await setUser(user);
  const { setOnboardingComplete, setLocationGranted } = await import('../services/storage.service');
  await setOnboardingComplete();
  await setLocationGranted();
  setState({
    token,
    user,
    isLoading: false,
    isAuthenticated: true,
    hasCompletedOnboarding: true,
    hasLocationPermission: true,
  });
}

function hasCompletedNewOnboarding(user: User | null, localDone: boolean): boolean {
  if (!user || !localDone) return false;
  return Boolean(user.profileCompleted && user.avatarId?.includes('illust'));
}

async function applySession(
  token: string,
  user: User,
  setState: React.Dispatch<React.SetStateAction<AuthState>>,
  completeOnboarding = false,
) {
  await setToken(token);
  await setUser(user);

  if (completeOnboarding || user.profileCompleted) {
    const { setOnboardingComplete, setLocationGranted } = await import('../services/storage.service');
    await setOnboardingComplete();
    await setLocationGranted();
  }

  setState((s) => ({
    ...s,
    token,
    user,
    isAuthenticated: true,
    hasCompletedOnboarding:
      completeOnboarding || user.profileCompleted ? true : s.hasCompletedOnboarding,
    hasLocationPermission:
      completeOnboarding || user.profileCompleted ? true : s.hasLocationPermission,
  }));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
    hasCompletedOnboarding: false,
    hasLocationPermission: false,
  });

  const bootstrap = useCallback(async () => {
    const [token, user, onboarding, location] = await Promise.all([
      getToken(),
      getUser(),
      isOnboardingComplete(),
      isLocationGranted(),
    ]);

    setState({
      token,
      user,
      isLoading: false,
      isAuthenticated: !!token && !!user,
      hasCompletedOnboarding: onboarding,
      hasLocationPermission: location,
    });
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const sendPhoneOtp = useCallback(async (localDigits: string) => {
    return demoSendOtp(localDigits);
  }, []);

  const resendPhoneOtp = useCallback(async () => {
    demoResendOtp();
  }, []);

  const verifyPhoneOtp = useCallback(
    async (localDigits: string, otp: string, _isNewUser: boolean) => {
      demoValidateOtp(otp);
      const e164 = toIndianE164(localDigits);
      const localOnboardingDone = await isOnboardingComplete();

      try {
        const { token, user: raw } = await demoVerifyExistingUser(e164);
        const user = mapApiUser(raw);
        const profileDone = hasCompletedNewOnboarding(user, localOnboardingDone);

        await applySession(token, user, setState, profileDone);

        return { isNewUser: !profileDone };
      } catch (error) {
        if (error instanceof ApiError && (error.status === 404 || error.status === 400)) {
          // Brand-new number — profile is created at the end of onboarding
          return { isNewUser: true };
        }

        // Server slow/offline — still run onboarding (no auto-login)
        return { isNewUser: true };
      }
    },
    [],
  );

  const finishOnboarding = useCallback(
    async (data: {
      fullName: string;
      mobileNumber: string;
      avatarId: string;
      gender: 'male' | 'female';
    }) => {
      const { fullName, mobileNumber, avatarId, gender } = data;
      const username = generateUsername(fullName);
      const [firstName, ...rest] = fullName.trim().split(' ');
      const lastName = rest.join(' ');

      const existingUser = state.user;
      const existingToken = state.token;

      // Returning account updating profile through new onboarding
      if (existingToken && existingUser?.id) {
        try {
          if (!existingUser.id.startsWith('local-')) {
            const profileRes = await userApi.updateProfile(existingUser.id, {
              firstName,
              lastName,
              username,
              avatarId,
              mobileNumber,
              gender,
              markComplete: true,
            });
            const user = mapApiUser({
              ...profileRes.user,
              id: existingUser.id,
              name: fullName,
              username,
              gender,
              profileCompleted: true,
            });
            await markOnboardingDone(existingToken, user, setState);
            return;
          }
        } catch {
          // Fall through to local save below
        }

        const user: User = {
          ...existingUser,
          name: fullName,
          firstName,
          lastName,
          username,
          avatarId,
          gender,
          mobileNumber,
          profileCompleted: true,
        };
        await markOnboardingDone(existingToken, user, setState);
        return;
      }

      try {
        const { token, user: raw } = await demoRegisterUser(fullName, mobileNumber);
        const userId = raw.id;

        try {
          const profileRes = await userApi.updateProfile(userId, {
            firstName,
            lastName,
            username,
            avatarId,
            mobileNumber,
            gender,
            markComplete: true,
          });

          const user = mapApiUser({
            ...profileRes.user,
            id: userId,
            name: fullName,
            username,
            gender,
            profileCompleted: true,
          });
          await markOnboardingDone(token, user, setState);
        } catch {
          const user = mapApiUser({
            ...raw,
            id: userId,
            name: fullName,
            username,
            avatarId,
            gender,
            profileCompleted: true,
          });
          await markOnboardingDone(token, user, setState);
        }
      } catch {
        const local = buildLocalDemoUser(mobileNumber, {
          name: fullName,
          username,
          avatarId,
          profileCompleted: true,
        });
        const user = { ...local.user, gender };
        await markOnboardingDone(local.token, user, setState);
      }
    },
    [state.user, state.token],
  );

  const completeProfile = useCallback(
    async (data: {
      fullName: string;
      username: string;
      avatarId: string;
      mobileNumber: string;
      city?: string;
    }) => {
      const userId = state.user?.id;
      if (!userId) {
        throw new ApiError('Not signed in', 401);
      }

      const [firstName, ...rest] = data.fullName.trim().split(' ');
      const profileRes = await userApi.updateProfile(userId, {
        firstName,
        lastName: rest.join(' '),
        username: data.username.replace(/^@/, ''),
        avatarId: data.avatarId,
        mobileNumber: data.mobileNumber,
        gender: data.avatarId.startsWith('female') ? 'female' : 'male',
        city: data.city,
        markComplete: true,
      });

      const user = mapApiUser({ ...profileRes.user, id: userId, name: data.fullName });
      await setUser(user);
      setState((s) => ({ ...s, user }));
    },
    [state.user?.id],
  );

  const logout = useCallback(async () => {
    await clearSession();
    setState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      hasCompletedOnboarding: false,
      hasLocationPermission: false,
    });
  }, []);

  const markLocationGranted = useCallback(
    async (city?: string) => {
      if (city && state.user?.id && !state.user.id.startsWith('local-')) {
        try {
          await userApi.updateProfile(state.user.id, { city, markComplete: true });
        } catch {
          // Continue — local onboarding should still finish
        }
        const updated = { ...state.user, city, profileCompleted: true };
        await setUser(updated);
        setState((s) => ({ ...s, user: updated }));
      } else if (state.user) {
        const updated = { ...state.user, city: city ?? state.user.city, profileCompleted: true };
        await setUser(updated);
        setState((s) => ({ ...s, user: updated }));
      }
      const { setLocationGranted, setOnboardingComplete } = await import(
        '../services/storage.service'
      );
      await setLocationGranted();
      await setOnboardingComplete();
      setState((s) => ({
        ...s,
        hasLocationPermission: true,
        hasCompletedOnboarding: true,
      }));
    },
    [state.user],
  );

  const refreshUser = useCallback(async (user: User) => {
    await setUser(user);
    setState((s) => ({ ...s, user }));
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      bootstrap,
      sendPhoneOtp,
      resendPhoneOtp,
      verifyPhoneOtp,
      finishOnboarding,
      completeProfile,
      logout,
      markLocationGranted,
      refreshUser,
      demoOtp: DEMO_OTP,
    }),
    [
      state,
      bootstrap,
      sendPhoneOtp,
      resendPhoneOtp,
      verifyPhoneOtp,
      finishOnboarding,
      completeProfile,
      logout,
      markLocationGranted,
      refreshUser,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
