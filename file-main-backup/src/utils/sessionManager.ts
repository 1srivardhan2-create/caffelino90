// Session Manager for Smart Group Resume System

export type SessionStep = 
  | 'VOTING'
  | 'CAFE_SELECTED'
  | 'ORDERING'
  | 'PAYMENT'
  | 'CHAT'
  | 'HISTORY'
  | 'COMPLETED';

interface ActiveSession {
  userId: string;
  groupId: string;
  currentStep: SessionStep;
  lastNavigationPage: string;
  navigationData: any;
  lastUpdated: string;
}

const SESSION_STORAGE_KEY = 'caffelino_active_session';

/**
 * Save active session for a user
 */
export function saveActiveSession(
  userId: string,
  groupId: string,
  currentStep: SessionStep,
  lastNavigationPage: string,
  navigationData: any = {}
): void {
  const session: ActiveSession = {
    userId,
    groupId,
    currentStep,
    lastNavigationPage,
    navigationData,
    lastUpdated: new Date().toISOString()
  };
  
  localStorage.setItem(`${SESSION_STORAGE_KEY}_${userId}`, JSON.stringify(session));
}

/**
 * Get active session for a user
 */
export function getActiveSession(userId: string): ActiveSession | null {
  const sessionStr = localStorage.getItem(`${SESSION_STORAGE_KEY}_${userId}`);
  if (!sessionStr) return null;
  
  try {
    const session = JSON.parse(sessionStr);
    return session;
  } catch (error) {
    console.error('Error parsing active session:', error);
    return null;
  }
}

/**
 * Clear active session for a user
 */
export function clearActiveSession(userId: string): void {
  localStorage.removeItem(`${SESSION_STORAGE_KEY}_${userId}`);
}

/**
 * Update session step
 */
export function updateSessionStep(
  userId: string,
  currentStep: SessionStep,
  lastNavigationPage: string,
  navigationData: any = {}
): void {
  const session = getActiveSession(userId);
  if (session) {
    saveActiveSession(
      userId,
      session.groupId,
      currentStep,
      lastNavigationPage,
      navigationData
    );
  }
}

/**
 * Check if user has an active session
 */
export function hasActiveSession(userId: string): boolean {
  return getActiveSession(userId) !== null;
}

/**
 * Map navigation page to session step
 */
export function getSessionStepFromPage(page: string): SessionStep {
  const pageToStepMap: Record<string, SessionStep> = {
    'meetup-voting': 'VOTING',
    'cafe-voting': 'VOTING',
    'voting-complete': 'CAFE_SELECTED',
    'meetup-group-page': 'CHAT',
    'menu-selection': 'ORDERING',
    'order-confirmation': 'ORDERING',
    'payment-gateway': 'PAYMENT',
    'payment-success': 'COMPLETED',
    'group-history': 'HISTORY',
  };
  
  return pageToStepMap[page] || 'CHAT';
}

/**
 * Get the active group ID for a user
 */
export function getActiveGroupId(userId: string): string | null {
  const session = getActiveSession(userId);
  return session ? session.groupId : null;
}
