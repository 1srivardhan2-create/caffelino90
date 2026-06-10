// Mock groups data for testing - Replace with real database calls
import { GroupState, saveGroupState } from './groupStateManager';

/**
 * Initialize some mock groups for testing
 * In production, this would be replaced with actual database queries
 */
export function initializeMockGroupsForUser(userId: string): void {
  // Check if already initialized
  const existing = localStorage.getItem('caffelino_groups_initialized');
  if (existing === userId) return;

  // Mock group 1: Creator - Just created, inviting members
  const group1: GroupState = {
    groupId: 'GRP001',
    groupName: 'Sunday Brunch Club',
    groupDescription: 'Weekend brunch with friends and family',
    groupCode: 'SUN4K7',
    meetupDate: undefined, // Not decided yet
    meetupTime: undefined,
    cafeName: undefined,
    currentStage: 'created',
    status: 'Created',
    userRole: 'creator',
    lastActive: new Date().toISOString(),
    isApproved: true,
    memberCount: 3,
    lastNavigationPage: 'invite-members',
    navigationData: {
      groupId: 'GRP001',
      groupName: 'Sunday Brunch Club',
      groupCode: 'SUN4K7',
      isAdmin: true,
    },
  };

  // Mock group 2: Creator - In voting stage
  const group2: GroupState = {
    groupId: 'GRP002',
    groupName: 'Tech Meetup Dec',
    groupDescription: 'Monthly tech discussion and networking',
    groupCode: 'TCH8M2',
    meetupDate: '2024-12-20',
    meetupTime: undefined, // Voting in progress
    cafeName: undefined,
    currentStage: 'voting',
    status: 'Voting',
    userRole: 'creator',
    lastActive: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    isApproved: true,
    memberCount: 7,
    lastNavigationPage: 'meetup-voting',
    navigationData: {
      meetupId: 'GRP002',
      meetupName: 'Tech Meetup Dec',
      groupCode: 'TCH8M2',
      isAdmin: true,
    },
  };

  // Mock group 3: Member - Active chat stage
  const group3: GroupState = {
    groupId: 'GRP003',
    groupName: 'Book Lovers Gathering',
    groupDescription: 'Discussing our favorite books over coffee',
    groupCode: 'BOK3L5',
    meetupDate: '2024-12-18',
    meetupTime: '4:00 PM',
    cafeName: 'Café Milano',
    cafeImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400',
    currentStage: 'chat',
    status: 'Active',
    userRole: 'member',
    lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    isApproved: true,
    memberCount: 6,
    lastNavigationPage: 'meetup-group-page',
    navigationData: {
      meetupId: 'GRP003',
      meetupName: 'Book Lovers Gathering',
      cafeName: 'Café Milano',
      isAdmin: false,
    },
  };

  // Mock group 4: Member - Menu selection stage
  const group4: GroupState = {
    groupId: 'GRP004',
    groupName: 'Fitness Friends Meetup',
    groupDescription: 'Weekly fitness meetups with friends',
    groupCode: 'FIT9X1',
    meetupDate: '2024-12-16',
    meetupTime: '6:30 PM',
    cafeName: 'The Daily Grind',
    cafeImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400',
    currentStage: 'menu-selection',
    status: 'Ordering',
    userRole: 'member',
    lastActive: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
    isApproved: true,
    memberCount: 5,
    lastNavigationPage: 'menu-selection',
    navigationData: {
      meetupId: 'GRP004',
      meetupName: 'Fitness Friends Meetup',
      cafeName: 'The Daily Grind',
      isAdmin: false,
    },
  };

  // Mock group 5: Creator - Payment stage
  const group5: GroupState = {
    groupId: 'GRP005',
    groupName: 'Family Reunion 2024',
    groupDescription: 'Annual family reunion celebration',
    groupCode: 'FAM5R6',
    meetupDate: '2024-12-15',
    meetupTime: '1:00 PM',
    cafeName: 'Corner Café',
    cafeImage: 'https://images.unsplash.com/photo-1559496417-e7f25c2c2c0c?w=400',
    currentStage: 'payment',
    status: 'Payment',
    userRole: 'creator',
    lastActive: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 mins ago
    isApproved: true,
    memberCount: 12,
    lastNavigationPage: 'order-based-billing',
    navigationData: {
      meetupId: 'GRP005',
      meetupName: 'Family Reunion 2024',
      cafeName: 'Corner Café',
      isAdmin: true,
    },
  };

  // Save mock groups
  saveGroupState(userId, group1);
  saveGroupState(userId, group2);
  saveGroupState(userId, group3);
  saveGroupState(userId, group4);
  saveGroupState(userId, group5);

  // Mark as initialized
  localStorage.setItem('caffelino_groups_initialized', userId);
}

/**
 * Clear mock initialization (for testing)
 */
export function resetMockGroups(): void {
  localStorage.removeItem('caffelino_groups_initialized');
}