import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';
import { Button } from './Button';

// Extend Navigator interface for iOS PWA support
declare global {
  interface Navigator {
    standalone?: boolean;
  }
}

interface PWAInstallBannerProps {
  className?: string;
}

const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({ className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    // Detect iOS for special instructions
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOSDevice = /ipad|iphone|ipod/.test(userAgent);

    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = navigator.standalone === true;

    setIsIOS(isIOSDevice);

    // Don't show if already installed
    if (isStandalone || isIOSStandalone) {
      return;
    }

    // Check if iOS PWA installation is supported
    const supportsIOSPWA = 'standalone' in navigator;

    // Listen for PWA install prompt
    const handleInstallAvailable = (e: any) => {
      setInstallPrompt(e.detail.prompt);
      setIsVisible(true);
    };

    // For iOS, show banner immediately if installation is supported
    if (isIOSDevice && supportsIOSPWA && !window.matchMedia('(display-mode: standalone)').matches) {
      setIsVisible(true);
    }

    window.addEventListener('pwaInstallAvailable', handleInstallAvailable);

    return () => {
      window.removeEventListener('pwaInstallAvailable', handleInstallAvailable);
    };
  }, []);

  const handleInstallClick = async () => {
    if (installPrompt) {
      // Standard PWA installation
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('PWA: User accepted the install prompt');
        setIsVisible(false);
      } else {
        console.log('PWA: User dismissed the install prompt');
      }
      setInstallPrompt(null);
    } else if (isIOS) {
      // iOS installation instructions
      alert('To install HealthMate:\n1. Tap the Share button (📤)\n2. Select "Add to Home Screen"\n3. Tap "Add"');
    }
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Remember user dismissal for 24 hours
    localStorage.setItem('pwaInstallDismissed', Date.now().toString());
  };

  // Don't show if user already dismissed recently
  useEffect(() => {
    const dismissedTime = localStorage.getItem('pwaInstallDismissed');
    if (dismissedTime) {
      const hoursSinceDismissal = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60);
      if (hoursSinceDismissal < 24) {
        setIsVisible(false);
      }
    }
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 shadow-lg border-b border-blue-500 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Smartphone className="h-6 w-6" />
          <div>
            <h3 className="font-semibold text-sm">
              Install HealthMate for Better Experience
            </h3>
            <p className="text-xs opacity-90">
              {isIOS
                ? 'Use this app like a native app with offline access'
                : 'Get offline access and app notifications'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={handleInstallClick}
            className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-1 text-sm font-medium rounded-full transition-colors"
            size="sm"
          >
            <Download className="h-4 w-4 mr-1" />
            Install
          </Button>

          <button
            onClick={handleDismiss}
            className="text-white/70 hover:text-white p-1 rounded-full transition-colors"
            aria-label="Dismiss install banner"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallBanner;
