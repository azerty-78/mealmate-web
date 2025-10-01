import React from 'react';
import { Person } from '@mui/icons-material';

interface MealmateLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const MealmateLogo: React.FC<MealmateLogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl'
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Logo icon */}
      <div className={`${sizeClasses[size]} relative flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-md`}>
        <Person 
          className="text-white" 
          style={{ 
            fontSize: size === 'sm' ? '24px' : 
                     size === 'md' ? '32px' : 
                     size === 'lg' ? '48px' : '64px' 
          }} 
        />
      </div>
      
      {/* App name */}
      {showText && (
        <div className="mt-4 text-center">
          <h1 className={`${textSizes[size]} font-bold text-gray-800 tracking-wide`}>
            MEALMATE
          </h1>
          <p className="text-sm text-gray-600 mt-1 font-medium">
            Gestion du diabète
          </p>
        </div>
      )}
    </div>
  );
};

export default MealmateLogo;
