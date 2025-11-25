import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import SkeletonLoader from './SkeletonLoader';

interface DataLoadingWrapperProps {
  isLoading: boolean;
  children: React.ReactNode;
  skeletonType?: 'card' | 'chart' | 'text' | 'avatar' | 'button';
  delay?: number;
  fadeIn?: boolean;
  className?: string;
}

// Enhanced data loading wrapper with skeleton states and animations
const DataLoadingWrapper: React.FC<DataLoadingWrapperProps> = ({
  isLoading,
  children,
  skeletonType = 'card',
  delay = 0,
  fadeIn = true,
  className = ''
}) => {
  const [showContent, setShowContent] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(!isLoading);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    if (!isLoading && fadeIn) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isLoading, delay, fadeIn]);

  useEffect(() => {
    if (!isLoading) {
      setHasLoaded(true);
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div ref={ref} className={className}>
        <SkeletonLoader variant={skeletonType} className="animate-pulse" />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`${className} ${fadeIn && showContent ? 'animate-fadeIn' : ''}`}
    >
      {inView && hasLoaded && children}
    </div>
  );
};

export default DataLoadingWrapper;
