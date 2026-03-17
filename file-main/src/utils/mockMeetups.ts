// Mock meetups data for testing - Replace with real database calls
import { MeetupState, saveMeetupState } from './meetupStateManager';

/**
 * Initialize some mock meetups for testing
 * In production, this would be replaced with actual database queries
 */
export function initializeMockMeetupsForUser(userId: string): void {
  // Check if already initialized
  const existing = localStorage.getItem('caffelino_mock_initialized');
  if (existing === userId) return;

  // Mock meetup 1: Currently in voting stage
  const meetup1: MeetupState = {
    meetupId: 'MTG001',
    meetupName: 'Weekend Coffee Meetup',
    cafeName: undefined, // Not selected yet
    date: '2024-12-15',
    time: undefined, // Voting in progress
    currentScreen: 'voting',
    status: 'Voting',
    userRole: 'admin',
    lastActive: new Date().toISOString(),
    isApproved: true,
    memberCount: 5,
  };

  // Mock meetup 2: In chat stage with cafe selected
  const meetup2: MeetupState = {
    meetupId: 'MTG002',
    meetupName: 'Family Brunch',
    cafeName: 'Café Milano',
    date: '2024-12-14',
    time: '11:00 AM',
    currentScreen: 'chat',
    status: 'Chat',
    userRole: 'member',
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    isApproved: true,
    memberCount: 8,
  };

  // Mock meetup 3: In menu selection stage
  const meetup3: MeetupState = {
    meetupId: 'MTG003',
    meetupName: 'Team Catch-up',
    cafeName: 'The Daily Grind',
    date: '2024-12-13',
    time: '3:00 PM',
    currentScreen: 'menu-selection',
    status: 'Ordering',
    userRole: 'admin',
    lastActive: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    isApproved: true,
    memberCount: 6,
  };

  // Save mock meetups
  saveMeetupState(userId, meetup1);
  saveMeetupState(userId, meetup2);
  saveMeetupState(userId, meetup3);

  // Mark as initialized
  localStorage.setItem('caffelino_mock_initialized', userId);
}

/**
 * Clear mock initialization (for testing)
 */
export function resetMockMeetups(): void {
  localStorage.removeItem('caffelino_mock_initialized');
}
