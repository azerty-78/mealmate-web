import React from 'react';
import logo from '../assets/mealmate.jpg';

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
      {/* Logo image */}
      <div className={`${sizeClasses[size]} relative`}>
        <img 
          src={logo} 
          alt="Logo MEALMATE" 
          className="w-full h-full object-contain rounded-2xl shadow-md"
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
