interface GenderAvatarProps {
  photo?: string;
  gender?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showBorder?: boolean;
}

export default function GenderAvatar({ 
  photo, 
  gender, 
  name, 
  size = 'md', 
  className = '',
  showBorder = false 
}: GenderAvatarProps) {
  const sizeClasses = {
    'xs': 'w-6 h-6 text-sm',
    'sm': 'w-8 h-8 text-xl',
    'md': 'w-12 h-12 text-3xl',
    'lg': 'w-20 h-20 text-5xl',
    'xl': 'w-24 h-24 text-6xl',
    '2xl': 'w-32 h-32 text-7xl'
  };

  const borderClass = showBorder ? 'border-4 border-[#be9d80]' : '';
  
  // Determine background gradient based on gender
  let bgGradient = 'bg-gradient-to-br from-indigo-100 to-purple-100'; // Default
  if (gender === 'male') {
    bgGradient = 'bg-gradient-to-br from-blue-100 to-blue-200';
  } else if (gender === 'female') {
    bgGradient = 'bg-gradient-to-br from-pink-100 to-pink-200';
  } else if (gender === 'other' || gender === 'prefer-not-to-say') {
    bgGradient = 'bg-gradient-to-br from-indigo-100 to-purple-100';
  }
  
  const baseClasses = `rounded-full overflow-hidden flex items-center justify-center ${bgGradient} ${sizeClasses[size]} ${borderClass} ${className}`;

  // If photo exists, display it
  if (photo) {
    return (
      <div className={baseClasses}>
        <img src={photo} alt={name || 'Profile'} className="w-full h-full object-cover" />
      </div>
    );
  }

  // If no photo, display gender-based cartoon avatar
  return (
    <div className={baseClasses}>
      {gender === 'male' ? (
        <span>👨</span>
      ) : gender === 'female' ? (
        <span>👩</span>
      ) : (
        <span>👤</span>
      )}
    </div>
  );
}