/**
 * App Initialization Utility
 * Clears old cached data and sets up fresh state
 */

import { clearAllGroupData } from './groupStateManager';

const INIT_FLAG_KEY = 'caffelino_app_initialized';
const APP_VERSION = '2.0.0'; // Increment this to force a fresh start

/**
 * Initialize the app - clears old data on first run or version change
 */
export function initializeApp(): void {
  try {
    const currentInit = localStorage.getItem(INIT_FLAG_KEY);
    
    // If version changed or first time, clear all old data
    if (currentInit !== APP_VERSION) {
      console.log('🔄 Initializing app - clearing old data...');
      
      // Clear all group data
      clearAllGroupData();
      
      // Clear any other old cached data
      const keysToKeep = [INIT_FLAG_KEY];
      const allKeys = Object.keys(localStorage);
      
      allKeys.forEach(key => {
        if (!keysToKeep.includes(key) && key !== 'caffelino_user_groups') {
          // Keep user auth data but clear everything else
          if (!key.includes('auth') && !key.includes('user')) {
            localStorage.removeItem(key);
          }
        }
      });
      
      // Clear session storage completely
      sessionStorage.clear();
      
      // Mark as initialized with current version
      localStorage.setItem(INIT_FLAG_KEY, APP_VERSION);
      
      console.log('✅ App initialized successfully');
    } else {
      console.log('✅ App already initialized - using existing data');
    }
  } catch (error) {
    console.error('❌ Error initializing app:', error);
  }
}

/**
 * Force a complete reset of all app data
 */
export function resetAppData(): void {
  try {
    console.log('🔄 Resetting all app data...');
    
    // Clear everything from localStorage except auth
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      if (!key.includes('auth') && !key.includes('user')) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear session storage
    sessionStorage.clear();
    
    // Clear init flag to force re-initialization
    localStorage.removeItem(INIT_FLAG_KEY);
    
    console.log('✅ App data reset complete');
    
    // Reload the page to start fresh
    window.location.reload();
  } catch (error) {
    console.error('❌ Error resetting app:', error);
  }
}

/**
 * Get current app version
 */
export function getAppVersion(): string {
  return APP_VERSION;
}
