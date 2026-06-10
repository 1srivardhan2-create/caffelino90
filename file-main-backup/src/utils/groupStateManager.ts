// Group State Manager - Tracks user's created and joined groups with their current stages

export interface GroupState {
  groupId: string;
  groupName: string;
  groupDescription?: string; // Short description of the group
  groupCode?: string;
  meetupDate?: string;
  meetupTime?: string;
  cafeName?: string;
  currentStage: 'created' | 'voting' | 'chat' | 'menu-selection' | 'payment' | 'completed';
  status: 'Created' | 'Voting' | 'Active' | 'Ordering' | 'Payment' | 'Completed';
  userRole: 'creator' | 'member';
  lastActive: string; // ISO timestamp
  isApproved: boolean; // For members - approved to join
  memberCount?: number;
  cafeImage?: string;
  // Navigation data
  lastNavigationPage: string; // The exact page to navigate to
  navigationData?: any; // Any additional data needed for navigation
}

const STORAGE_KEY = 'caffelino_user_groups';

/**
 * Clear ALL group data from storage (for reset/cleanup)
 * This performs a COMPLETE RESET of all groups
 */
export function clearAllGroupData(): void {
  try {
    // Clear main group storage
    localStorage.removeItem(STORAGE_KEY);
    
    // Clear initialization flag to prevent mock groups from reloading
    localStorage.removeItem('caffelino_groups_initialized');
    
    // Clear all session data
    sessionStorage.clear();
    
    // Clear any cafe orders related to groups
    localStorage.removeItem('cafeOrders');
    
    // Clear any payment status keys (they start with 'payment_status_')
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('payment_status_')) {
        localStorage.removeItem(key);
      }
    });
    
    console.log('✅ COMPLETE RESET: All group data cleared from storage');
    console.log('✅ All created groups removed');
    console.log('✅ All joined groups removed');
    console.log('✅ All cache and session data cleared');
  } catch (error) {
    console.error('Error clearing group data:', error);
  }
}

/**
 * Clear old/test groups - removes groups older than 30 days or test groups
 */
export function clearOldTestGroups(userId: string): void {
  try {
    const groups = getUserGroups(userId);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    
    const allGroups: Record<string, GroupState[]> = JSON.parse(stored);
    
    if (allGroups[userId]) {
      // Keep only recent groups (last 30 days) and non-test groups
      allGroups[userId] = allGroups[userId].filter(g => {
        const lastActive = new Date(g.lastActive);
        const isRecent = lastActive > thirtyDaysAgo;
        const isNotTest = !g.groupName.toLowerCase().includes('test') && 
                          !g.groupName.toLowerCase().includes('demo');
        return isRecent && isNotTest && g.currentStage !== 'completed';
      });
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allGroups));
      console.log('✅ Old and test groups cleared');
    }
  } catch (error) {
    console.error('Error clearing old groups:', error);
  }
}

/**
 * Get all groups for a user (both created and joined)
 */
export function getUserGroups(userId: string): GroupState[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const allGroups: Record<string, GroupState[]> = JSON.parse(stored);
    return allGroups[userId] || [];
  } catch (error) {
    console.error('Error loading user groups:', error);
    return [];
  }
}

/**
 * Save or update a group state for a user
 */
export function saveGroupState(userId: string, group: GroupState): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const allGroups: Record<string, GroupState[]> = stored ? JSON.parse(stored) : {};
    
    if (!allGroups[userId]) {
      allGroups[userId] = [];
    }
    
    // Find existing group or add new one
    const existingIndex = allGroups[userId].findIndex(g => g.groupId === group.groupId);
    
    if (existingIndex >= 0) {
      allGroups[userId][existingIndex] = {
        ...allGroups[userId][existingIndex],
        ...group,
        lastActive: new Date().toISOString(),
      };
    } else {
      allGroups[userId].push({
        ...group,
        lastActive: new Date().toISOString(),
      });
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allGroups));
  } catch (error) {
    console.error('Error saving group state:', error);
  }
}

/**
 * Update the current stage for a group
 */
export function updateGroupStage(
  userId: string, 
  groupId: string, 
  stage: GroupState['currentStage'],
  status: GroupState['status'],
  navigationPage: string,
  navigationData?: any
): void {
  try {
    const groups = getUserGroups(userId);
    const group = groups.find(g => g.groupId === groupId);
    
    if (group) {
      saveGroupState(userId, {
        ...group,
        currentStage: stage,
        status: status,
        lastNavigationPage: navigationPage,
        navigationData: navigationData,
      });
    }
  } catch (error) {
    console.error('Error updating group stage:', error);
  }
}

/**
 * Remove a group (when user leaves or group is deleted)
 */
export function removeGroup(userId: string, groupId: string): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    
    const allGroups: Record<string, GroupState[]> = JSON.parse(stored);
    
    if (allGroups[userId]) {
      allGroups[userId] = allGroups[userId].filter(g => g.groupId !== groupId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allGroups));
    }
  } catch (error) {
    console.error('Error removing group:', error);
  }
}

/**
 * Remove ALL groups for a user (used before re-syncing from backend)
 */
export function removeAllUserGroups(userId: string): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    
    const allGroups: Record<string, GroupState[]> = JSON.parse(stored);
    
    if (allGroups[userId]) {
      allGroups[userId] = [];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allGroups));
    }
  } catch (error) {
    console.error('Error removing all user groups:', error);
  }
}

/**
 * Get a specific group state
 */
export function getGroupState(userId: string, groupId: string): GroupState | undefined {
  const groups = getUserGroups(userId);
  return groups.find(g => g.groupId === groupId);
}

/**
 * Mark group as completed
 */
export function completeGroup(userId: string, groupId: string): void {
  updateGroupStage(userId, groupId, 'completed', 'Completed', 'home');
}

/**
 * Get only active (non-completed) groups
 */
export function getActiveGroups(userId: string): GroupState[] {
  const groups = getUserGroups(userId);
  return groups
    .filter(g => g.isApproved && g.currentStage !== 'completed')
    .sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime());
}

/**
 * Get groups created by user
 */
export function getCreatedGroups(userId: string): GroupState[] {
  const groups = getUserGroups(userId);
  return groups
    .filter(g => g.userRole === 'creator' && g.currentStage !== 'completed')
    .sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime());
}

/**
 * Get groups joined by user
 */
export function getJoinedGroups(userId: string): GroupState[] {
  const groups = getUserGroups(userId);
  return groups
    .filter(g => g.userRole === 'member' && g.isApproved && g.currentStage !== 'completed')
    .sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime());
}

/**
 * Helper to determine status from stage
 */
export function getStatusFromStage(stage: GroupState['currentStage']): GroupState['status'] {
  switch (stage) {
    case 'created':
      return 'Created';
    case 'voting':
      return 'Voting';
    case 'chat':
      return 'Active';
    case 'menu-selection':
      return 'Ordering';
    case 'payment':
      return 'Payment';
    case 'completed':
      return 'Completed';
    default:
      return 'Created';
  }
}

/**
 * Helper to get the default navigation page from stage
 */
export function getNavigationPageFromStage(stage: GroupState['currentStage']): string {
  switch (stage) {
    case 'created':
      return 'invite-members';
    case 'voting':
      return 'meetup-voting';
    case 'chat':
      return 'meetup-group-page';
    case 'menu-selection':
      return 'menu-selection';
    case 'payment':
      return 'order-based-billing';
    case 'completed':
      return 'home';
    default:
      return 'home';
  }
}

/**
 * Update group with cafe and time information
 */
export function updateGroupMeetupDetails(
  userId: string,
  groupId: string,
  details: {
    cafeName?: string;
    meetupDate?: string;
    meetupTime?: string;
    cafeImage?: string;
  }
): void {
  try {
    const groups = getUserGroups(userId);
    const group = groups.find(g => g.groupId === groupId);
    
    if (group) {
      saveGroupState(userId, {
        ...group,
        ...details,
      });
    }
  } catch (error) {
    console.error('Error updating group details:', error);
  }
}

/**
 * Check if user is member of a group
 */
export function isUserInGroup(userId: string, groupId: string): boolean {
  const groups = getUserGroups(userId);
  return groups.some(g => g.groupId === groupId);
}

/**
 * Approve member join request
 */
export function approveMemberJoin(userId: string, groupId: string): void {
  try {
    const groups = getUserGroups(userId);
    const group = groups.find(g => g.groupId === groupId);
    
    if (group) {
      saveGroupState(userId, {
        ...group,
        isApproved: true,
      });
    }
  } catch (error) {
    console.error('Error approving member:', error);
  }
}