import React, { useState, useEffect } from 'react';
import { Lock, Crown, Zap } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { getMockUserSubscription, checkFeatureAccess, PLAN_FEATURES } from '../utils/subscriptionUtils';

const PremiumFeatureGate = ({
  feature,
  children,
  fallback: FallbackComponent,
  showUpgradePrompt = true,
  upgradeMessage = null,
  className = ""
}) => {
  const [subscription, setSubscription] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    const userSubscription = getMockUserSubscription();
    setSubscription(userSubscription);
    const access = checkFeatureAccess(feature, userSubscription);
    setHasAccess(access);
  }, [feature]);

  const handleUpgradeClick = () => {
    setShowUpgradeModal(true);
  };

  const handleUpgradeToTrial = () => {
    // This would normally redirect to payment flow
    // For now, just simulate the upgrade
    alert('Would normally start trial - redirecting to payment...');
    setShowUpgradeModal(false);
  };

  const handleUpgradeToPaid = (plan) => {
    // This would normally redirect to payment flow
    alert(`Would normally upgrade to ${PLAN_FEATURES[plan].name} - redirecting to payment...`);
    setShowUpgradeModal(false);
  };

  // If user has access, render the feature
  if (hasAccess) {
    return children;
  }

  // If no access and no fallback component, show upgrade prompt
  if (!hasAccess && !FallbackComponent && showUpgradePrompt) {
    return (
      <Card className={`p-6 text-center border-2 border-dashed border-gray-300 ${className}`}>
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mb-4">
            <Crown className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Feature</h3>
          <p className="text-gray-600 mb-4">
            {upgradeMessage || 'Unlock this advanced feature with a Premium subscription'}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span>Get access to advanced analytics, smart notifications, and more</span>
          </div>

          <Button
            onClick={handleUpgradeClick}
            className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
          >
            <Crown className="h-4 w-4 mr-2" />
            Upgrade to Premium
          </Button>
        </div>

        {/* Upgrade Modal */}
        {showUpgradeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Choose Your Plan</h3>

              <div className="space-y-4 mb-6">
                <div className="border rounded-lg p-4 hover:border-purple-300">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Premium Trial</h4>
                    <span className="text-2xl font-bold text-green-600">FREE</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">7-day trial of all premium features</p>
                  <Button
                    onClick={handleUpgradeToTrial}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Start Free Trial
                  </Button>
                </div>

                <div className="border rounded-lg p-4 bg-gradient-to-br from-purple-50 to-blue-50 hover:border-purple-300">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Premium Basic</h4>
                    <span className="text-2xl font-bold">$9.99<span className="text-sm font-normal">/mo</span></span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Smart notifications, calendar dashboard, unlimited tracking</p>
                  <Button
                    onClick={() => handleUpgradeToPaid('premium_basic')}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Upgrade Now
                  </Button>
                </div>
              </div>

              <Button
                onClick={() => setShowUpgradeModal(false)}
                variant="secondary"
                className="w-full"
              >
                Maybe Later
              </Button>
            </div>
          </div>
        )}
      </Card>
    );
  }

  // If user provided a custom fallback component
  if (FallbackComponent) {
    return <FallbackComponent onUpgrade={handleUpgradeClick} />;
  }

  // Minimal fallback - just lock icon
  return (
    <div className={`flex items-center justify-center p-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg ${className}`}>
      <div className="text-center">
        <Lock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600">Premium Feature</p>
        <Button
          onClick={handleUpgradeClick}
          size="sm"
          className="mt-2"
        >
          Upgrade
        </Button>
      </div>
    </div>
  );
};

export default PremiumFeatureGate;
