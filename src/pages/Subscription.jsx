import React, { useState, useEffect } from 'react';
import { Crown, CreditCard, Calendar, BarChart3, Zap, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { getMockUserSubscription, updateSubscription, PLAN_FEATURES } from '../utils/subscriptionUtils';

const Subscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    const userSubscription = getMockUserSubscription();
    setSubscription(userSubscription);
  }, []);

  const handleManageBilling = () => {
    alert('Would normally redirect to billing management platform');
  };

  const handleCancelSubscription = () => {
    alert('Would normally cancel subscription with confirmation flow');
  };

  const handleUpgradeToPaid = (planType) => {
    // This would normally redirect to payment processing
    alert(`Would normally upgrade to ${PLAN_FEATURES[planType].name} and redirect to payment gateway`);
    setShowUpgradeModal(false);
  };

  const currentPlan = subscription ? PLAN_FEATURES[subscription.plan] : null;
  const usagePercentage = subscription ?
    Math.min((subscription.usage.monthlyHealthEntries / (currentPlan?.limits.monthlyHealthEntries === -1 ? 1000 : currentPlan?.limits.monthlyHealthEntries)) * 100, 100) : 0;

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-6">
      <div className="flex items-center gap-3 mb-6">
        <Crown className="h-8 w-8 text-purple-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subscription & Billing</h1>
          <p className="text-gray-600">Manage your premium subscription and billing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Current Plan Card */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Current Plan</h2>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    subscription?.status === 'trial' ? 'bg-green-100 text-green-800' :
                    subscription?.status === 'active' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {subscription?.status === 'trial' && '🆓 Trial'}
                    {subscription?.status === 'active' && '✓ Active'}
                    {subscription?.status === 'expired' && '⏰ Expired'}
                  </span>
                  <span className="text-2xl font-bold text-purple-600">
                    {currentPlan?.name || 'Free'}
                  </span>
                </div>
              </div>
              {subscription?.status === 'trial' && (
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Trial ends</div>
                  <div className="text-lg font-semibold text-orange-600">
                    {subscription.trialEndsAt ? new Date(subscription.trialEndsAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Monthly usage</span>
                <span>{subscription?.usage.monthlyHealthEntries || 0} / {currentPlan?.limits.monthlyHealthEntries === -1 ? '∞' : currentPlan?.limits.monthlyHealthEntries || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                  style={{ width: `${usagePercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {currentPlan?.limits.monthlyHealthEntries === -1 ? 'Unlimited tracking' : `${Math.round(usagePercentage)}% used this month`}
              </p>
            </div>

            <div className="flex gap-3">
              {subscription?.plan === 'free' && (
                <Button
                  onClick={() => setShowUpgradeModal(true)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Premium
                </Button>
              )}
              {subscription?.plan !== 'free' && (
                <Button
                  onClick={handleManageBilling}
                  variant="secondary"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Manage Billing
                </Button>
              )}
              {subscription?.plan !== 'free' && (
                <Button
                  onClick={handleCancelSubscription}
                  variant="danger"
                  className="ml-auto"
                >
                  Cancel Subscription
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Billing Info Card */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Billing Information
          </h3>

          {subscription?.paymentMethod ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Payment Method</span>
                <span className="text-sm font-medium">•••• •••• •••• {subscription.paymentMethod.last4}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Next Billing</span>
                <span className="text-sm font-medium">
                  {subscription.nextBillingDate ? new Date(subscription.nextBillingDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Amount</span>
                <span className="text-lg font-bold text-purple-600">${currentPlan?.price?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600">No payment method on file</p>
          )}
        </Card>
      </div>

      {/* Plan Comparison */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Choose the Perfect Plan</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(PLAN_FEATURES).map(([planKey, plan]) => {
            const isCurrentPlan = subscription?.plan === planKey;
            const isFree = plan.price === 0;

            return (
              <Card
                key={planKey}
                className={`p-6 hover:shadow-lg transition-shadow ${
                  isCurrentPlan ? 'ring-2 ring-purple-500 bg-purple-50' : ''
                }`}
              >
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-gray-900">${plan.price.toFixed(2)}</span>
                    {!isFree && <span className="text-gray-600 text-base">/month</span>}
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleUpgradeToPaid(planKey)}
                  disabled={isCurrentPlan}
                  className={`w-full ${
                    isCurrentPlan
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : isFree
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  {isCurrentPlan ? 'Current Plan' : isFree ? 'Free Forever' : 'Upgrade'}
                </Button>
              </Card>
            );
          })}
        </div>
      </Card>

      {/* Usage Statistics */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          Usage Statistics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {subscription?.usage?.monthlyHealthEntries || 0}
            </div>
            <div className="text-sm text-blue-700">Health Entries</div>
            <div className="text-xs text-blue-600">This month</div>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {subscription?.usage?.aiQueries || 0}
            </div>
            <div className="text-sm text-green-700">AI Queries</div>
            <div className="text-xs text-green-600">This month</div>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {subscription?.usage?.reportsGenerated || 0}
            </div>
            <div className="text-sm text-purple-700">Reports Generated</div>
            <div className="text-xs text-purple-600">This month</div>
          </div>
        </div>
      </Card>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Start Your Premium Trial</h3>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <div className="font-semibold text-green-800">7-Day Free Trial</div>
                  <div className="text-sm text-green-700">Cancel anytime, no credit card required</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">What you'll unlock:</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Unlimited health tracking</li>
                  <li>• Advanced AI insights</li>
                  <li>• Smart morning notifications</li>
                  <li>• Calendar dashboard</li>
                  <li>• Premium analytics & reports</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowUpgradeModal(false)}
                variant="secondary"
                className="flex-1"
              >
                Maybe Later
              </Button>
              <Button
                onClick={() => handleUpgradeToPaid('premium_trial')}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Zap className="h-4 w-4 mr-2" />
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscription;
