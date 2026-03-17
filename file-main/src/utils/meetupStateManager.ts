// Meetup State Manager - Tracks user's active meetups and their current screens

export interface MeetupState {
  meetupId: string;
  meetupName: string;
  cafeName?: string;
  date?: string;
  time?: string;
  currentScreen: 'voting' | 'chat' | 'menu-selection' | 'payment' | 'completed';
  status: 'Voting' | 'Chat' | 'Ordering' | 'Payment' | 'Completed';
  userRole: 'admin' | 'member';
  lastActive: string; // ISO timestamp
  isApproved: boolean; // For members
  memberCount?: number;
  cafeImage?: string;
}

const STORAGE_KEY = 'caffelino_user_meetups';

/**
 * Get all active meetups for a user
 */
export function getUserMeetups(userId: string): MeetupState[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const allMeetups: Record<string, MeetupState[]> = JSON.parse(stored);
    return allMeetups[userId] || [];
  } catch (error) {
    console.error('Error loading user meetups:', error);
    return [];
  }
}

/**
 * Save or update a meetup state for a user
 */
export function saveMeetupState(userId: string, meetup: MeetupState): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const allMeetups: Record<string, MeetupState[]> = stored ? JSON.parse(stored) : {};
    
    if (!allMeetups[userId]) {
      allMeetups[userId] = [];
    }
    
    // Find existing meetup or add new one
    const existingIndex = allMeetups[userId].findIndex(m => m.meetupId === meetup.meetupId);
    
    if (existingIndex >= 0) {
      allMeetups[userId][existingIndex] = {
        ...allMeetups[userId][existingIndex],
        ...meetup,
        lastActive: new Date().toISOString(),
      };
    } else {
      allMeetups[userId].push({
        ...meetup,
        lastActive: new Date().toISOString(),
      });
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allMeetups));
  } catch (error) {
    console.error('Error saving meetup state:', error);
  }
}

/**
 * Update the current screen for a meetup
 */
export function updateMeetupScreen(
  userId: string, 
  meetupId: string, 
  screen: MeetupState['currentScreen'],
  status: MeetupState['status']
): void {
  try {
    const meetups = getUserMeetups(userId);
    const meetup = meetups.find(m => m.meetupId === meetupId);
    
    if (meetup) {
      saveMeetupState(userId, {
        ...meetup,
        currentScreen: screen,
        status: status,
      });
    }
  } catch (error) {
    console.error('Error updating meetup screen:', error);
  }
}

/**
 * Remove a meetup (when user leaves or meetup is completed)
 */
export function removeMeetup(userId: string, meetupId: string): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    
    const allMeetups: Record<string, MeetupState[]> = JSON.parse(stored);
    
    if (allMeetups[userId]) {
      allMeetups[userId] = allMeetups[userId].filter(m => m.meetupId !== meetupId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allMeetups));
    }
  } catch (error) {
    console.error('Error removing meetup:', error);
  }
}

/**
 * Get a specific meetup state
 */
export function getMeetupState(userId: string, meetupId: string): MeetupState | undefined {
  const meetups = getUserMeetups(userId);
  return meetups.find(m => m.meetupId === meetupId);
}

/**
 * Mark meetup as completed
 */
export function completeMeetup(userId: string, meetupId: string): void {
  updateMeetupScreen(userId, meetupId, 'completed', 'Completed');
}

/**
 * Get only active (non-completed) meetups
 */
export function getActiveMeetups(userId: string): MeetupState[] {
  const meetups = getUserMeetups(userId);
  return meetups
    .filter(m => m.isApproved && m.currentScreen !== 'completed')
    .sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime());
}

/**
 * Helper to determine status from screen
 */
export function getStatusFromScreen(screen: MeetupState['currentScreen']): MeetupState['status'] {
  switch (screen) {
    case 'voting':
      return 'Voting';
    case 'chat':
      return 'Chat';
    case 'menu-selection':
      return 'Ordering';
    case 'payment':
      return 'Payment';
    case 'completed':
      return 'Completed';
    default:
      return 'Chat';
  }
}

/**
 * Helper to get the navigation page from screen
 */
export function getNavigationPageFromScreen(screen: MeetupState['currentScreen']): string {
  switch (screen) {
    case 'voting':
      return 'time-voting';
    case 'chat':
      return 'group-chat';
    case 'menu-selection':
      return 'menu-selection';
    case 'payment':
      return 'payment-options';
    case 'completed':
      return 'group-home';
    default:
      return 'group-chat';
  }
}
