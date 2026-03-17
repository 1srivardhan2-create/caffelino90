// Avatar data organized by gender and category

export interface AvatarOption {
  id: string;
  emoji: string;
  category: string;
  gender: 'male' | 'female';
  name: string;
}

export const avatarData: AvatarOption[] = [
  // MALE AVATARS
  // Student Category - Male
  { id: 'male-student-1', emoji: '👨‍🎓', category: 'Student', gender: 'male', name: 'Student 1' },
  { id: 'male-student-2', emoji: '🧑‍🎓', category: 'Student', gender: 'male', name: 'Student 2' },
  { id: 'male-student-3', emoji: '👨‍💼', category: 'Student', gender: 'male', name: 'Student 3' },
  
  // Doctor Category - Male
  { id: 'male-doctor-1', emoji: '👨‍⚕️', category: 'Doctor', gender: 'male', name: 'Doctor 1' },
  { id: 'male-doctor-2', emoji: '🧑‍⚕️', category: 'Doctor', gender: 'male', name: 'Doctor 2' },
  { id: 'male-doctor-3', emoji: '👨‍🔬', category: 'Doctor', gender: 'male', name: 'Doctor 3' },
  
  // Employee Category - Male
  { id: 'male-employee-1', emoji: '👨‍💻', category: 'Employee', gender: 'male', name: 'Employee 1' },
  { id: 'male-employee-2', emoji: '👨‍💼', category: 'Employee', gender: 'male', name: 'Employee 2' },
  { id: 'male-employee-3', emoji: '👨‍🏭', category: 'Employee', gender: 'male', name: 'Employee 3' },
  { id: 'male-employee-4', emoji: '👨‍🔧', category: 'Employee', gender: 'male', name: 'Employee 4' },
  
  // Business Professional Category - Male
  { id: 'male-business-1', emoji: '🤵', category: 'Business Professional', gender: 'male', name: 'Business 1' },
  { id: 'male-business-2', emoji: '👨‍💼', category: 'Business Professional', gender: 'male', name: 'Business 2' },
  { id: 'male-business-3', emoji: '🧑‍💼', category: 'Business Professional', gender: 'male', name: 'Business 3' },
  
  // Normal/Casual Category - Male
  { id: 'male-casual-1', emoji: '👨', category: 'Normal / Casual', gender: 'male', name: 'Casual 1' },
  { id: 'male-casual-2', emoji: '🧔', category: 'Normal / Casual', gender: 'male', name: 'Casual 2' },
  { id: 'male-casual-3', emoji: '👨‍🦱', category: 'Normal / Casual', gender: 'male', name: 'Casual 3' },
  { id: 'male-casual-4', emoji: '👨‍🦰', category: 'Normal / Casual', gender: 'male', name: 'Casual 4' },
  { id: 'male-casual-5', emoji: '👱‍♂️', category: 'Normal / Casual', gender: 'male', name: 'Casual 5' },
  
  // FEMALE AVATARS
  // Student Category - Female
  { id: 'female-student-1', emoji: '👩‍🎓', category: 'Student', gender: 'female', name: 'Student 1' },
  { id: 'female-student-2', emoji: '🧑‍🎓', category: 'Student', gender: 'female', name: 'Student 2' },
  { id: 'female-student-3', emoji: '👩‍💼', category: 'Student', gender: 'female', name: 'Student 3' },
  
  // Doctor Category - Female
  { id: 'female-doctor-1', emoji: '👩‍⚕️', category: 'Doctor', gender: 'female', name: 'Doctor 1' },
  { id: 'female-doctor-2', emoji: '🧑‍⚕️', category: 'Doctor', gender: 'female', name: 'Doctor 2' },
  { id: 'female-doctor-3', emoji: '👩‍🔬', category: 'Doctor', gender: 'female', name: 'Doctor 3' },
  
  // Employee Category - Female
  { id: 'female-employee-1', emoji: '👩‍💻', category: 'Employee', gender: 'female', name: 'Employee 1' },
  { id: 'female-employee-2', emoji: '👩‍💼', category: 'Employee', gender: 'female', name: 'Employee 2' },
  { id: 'female-employee-3', emoji: '👩‍🏭', category: 'Employee', gender: 'female', name: 'Employee 3' },
  { id: 'female-employee-4', emoji: '👩‍🔧', category: 'Employee', gender: 'female', name: 'Employee 4' },
  
  // Business Professional Category - Female
  { id: 'female-business-1', emoji: '👰', category: 'Business Professional', gender: 'female', name: 'Business 1' },
  { id: 'female-business-2', emoji: '👩‍💼', category: 'Business Professional', gender: 'female', name: 'Business 2' },
  { id: 'female-business-3', emoji: '🧑‍💼', category: 'Business Professional', gender: 'female', name: 'Business 3' },
  
  // Normal/Casual Category - Female
  { id: 'female-casual-1', emoji: '👩', category: 'Normal / Casual', gender: 'female', name: 'Casual 1' },
  { id: 'female-casual-2', emoji: '👩‍🦱', category: 'Normal / Casual', gender: 'female', name: 'Casual 2' },
  { id: 'female-casual-3', emoji: '👩‍🦰', category: 'Normal / Casual', gender: 'female', name: 'Casual 3' },
  { id: 'female-casual-4', emoji: '👱‍♀️', category: 'Normal / Casual', gender: 'female', name: 'Casual 4' },
  { id: 'female-casual-5', emoji: '🧕', category: 'Normal / Casual', gender: 'female', name: 'Casual 5' },
];

// Helper functions
export const getAvatarsByGender = (gender: 'male' | 'female'): AvatarOption[] => {
  return avatarData.filter(avatar => avatar.gender === gender);
};

export const getAvatarById = (id: string): AvatarOption | undefined => {
  return avatarData.find(avatar => avatar.id === id);
};

export const getCategoriesByGender = (gender: 'male' | 'female'): string[] => {
  const avatars = getAvatarsByGender(gender);
  const categories = [...new Set(avatars.map(a => a.category))];
  return categories;
};

export const getAvatarsByCategory = (gender: 'male' | 'female', category: string): AvatarOption[] => {
  return avatarData.filter(avatar => avatar.gender === gender && avatar.category === category);
};
