import Constants from 'expo-constants';

/** Render backend — live production URL */
const PRODUCTION_API = 'https://caffelino90.onrender.com';

const extra = Constants.expoConfig?.extra as { apiBaseUrl?: string } | undefined;

/** Never use localhost on a physical device — always hit Render unless overridden in .env */
export const API_BASE_URL = PRODUCTION_API;

export const SOCKET_URL = API_BASE_URL;

export const FIREBASE_API_KEY =
  (Constants.expoConfig?.extra as { firebaseApiKey?: string } | undefined)?.firebaseApiKey ?? '';
