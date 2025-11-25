import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'text' | 'card' | 'avatar' | 'button' | 'chart';
  animate?: boolean;
  lines?: number;
}

// Skeleton loaders for better UX during data loading
const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className = '',
  variant = 'text',
  animate = true,
  lines = 1
}) => {
  const animationClass = animate ? 'skeleton' : '';

  switch (variant) {
    case 'avatar':
      return (
        <div className={`w-12 h-12 rounded-full ${animationClass} bg-gray-200 ${className}`} />
      );

    case 'button':
      return (
        <div className={`h-10 rounded-lg ${animationClass} bg-gray-200 ${className}`} />
      );

    case 'card':
      return (
        <div className={`p-6 rounded-2xl glass-card ${className}`}>
          <div className={`h-4 rounded mb-4 ${animationClass} bg-gray-200`} />
          <div className={`h-8 rounded mb-2 ${animationClass} bg-gray-200`} />
          <div className={`h-4 rounded w-3/4 ${animationClass} bg-gray-200`} />
        </div>
      );

    case 'chart':
      return (
        <div className={`p-6 rounded-2xl glass-card ${className}`}>
          <div className={`h-4 rounded mb-6 ${animationClass} bg-gray-200`} />
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded ${animationClass} bg-gray-200`}
                style={{ width: `${Math.random() * 60 + 40}%` }}
              />
            ))}
          </div>
        </div>
      );

    case 'text':
    default:
      return (
        <div className={`space-y-2 ${className}`}>
          {[...Array(lines)].map((_, i) => (
            <div
              key={i}
              className={`h-4 rounded ${animationClass} bg-gray-200`}
              style={{ width: i === lines - 1 ? '60%' : '100%' }}
            />
          ))}
        </div>
      );
  }
};

export default SkeletonLoader;
