// Premium Subscription System Mock
export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  PREMIUM_TRIAL: 'premium_trial',
  PREMIUM_BASIC: 'premium_basic',
  PREMIUM_PRO: 'premium_pro'
};

export const PLAN_FEATURES = {
  [SUBSCRIPTION_PLANS.FREE]: {
    name: 'Free',
    price: 0,
    features: [
      'Basic health tracking',
      'Limited symptom checker',
      'Community support'
    ],
    limits: {
      monthlyHealthEntries: 50,
      aiQueries: 5,
      premiumReports: false
    }
  },
  [SUBSCRIPTION_PLANS.PREMIUM_TRIAL]: {
    name: 'Premium Trial',
    price: 0,
    trialDays: 7,
    features: [
      'All Premium Basic features',
      '7-day trial',
      'Priority support'
    ],
    limits: {
      monthlyHealthEntries: 1000,
      aiQueries: 50,
      premiumReports: true,
      advancedAnalytics: true
    }
  },
  [SUBSCRIPTION_PLANS.PREMIUM_BASIC]: {
    name: 'Premium Basic',
    price: 9.99,
    features: [
      'Unlimited health tracking',
      'Advanced AI assistant',
      'Premium analytics',
      'Smart notifications',
      'Calendar dashboard',
      'Priority support'
    ],
    limits: {
      monthlyHealthEntries: 1000,
      aiQueries: 100,
      premiumReports: true,
      advancedAnalytics: true,
      smartNotifications: true,
      calendarDashboard: true
    }
  },
  [SUBSCRIPTION_PLANS.PREMIUM_PRO]: {
    name: 'Premium Pro',
    price: 19.99,
    features: [
      'Everything in Basic, plus:',
      'Custom AI models',
      'Advanced health predictions',
      'Family account (4 users)',
      'White-label reports',
      '24/7 priority support',
      'API access'
    ],
    limits: {
      monthlyHealthEntries: -1, // unlimited
      aiQueries: -1, // unlimited
      premiumReports: true,
      advancedAnalytics: true,
      smartNotifications: true,
      calendarDashboard: true,
      customModels: true,
      familyAccounts: 4,
      whiteLabelReports: true,
      prioritySupport: true,
      apiAccess: true
    }
  }
};

// Mock user data - in real app this would come from backend
export const getMockUserSubscription = () => {
  const stored = localStorage.getItem('healthmate_subscription');
  if (stored) {
    return JSON.parse(stored);
  }

  // Default to free plan
  const defaultSubscription = {
    plan: SUBSCRIPTION_PLANS.FREE,
    status: 'active',
    trialEndsAt: null,
    subscribedAt: new Date().toISOString(),
    paymentMethod: null,
    nextBillingDate: null,
    usage: {
      monthlyHealthEntries: 12,
      aiQueries: 3,
      reportsGenerated: 0
    }
  };

  localStorage.setItem('healthmate_subscription', JSON.stringify(defaultSubscription));
  return defaultSubscription;
};

export const updateSubscription = (updates) => {
  const current = getMockUserSubscription();
  const updated = { ...current, ...updates };
  localStorage.setItem('healthmate_subscription', JSON.stringify(updated));
  return updated;
};

export const checkFeatureAccess = (feature, userSubscription) => {
  const planConfig = PLAN_FEATURES[userSubscription?.plan] || PLAN_FEATURES[SUBSCRIPTION_PLANS.FREE];
  const limits = planConfig.limits || {};

  switch (feature) {
    case 'monthlyHealthEntries':
      return limits.monthlyHealthEntries === -1 || (userSubscription?.usage?.monthlyHealthEntries || 0) < limits.monthlyHealthEntries;
    case 'aiQueries':
      return limits.aiQueries === -1 || (userSubscription?.usage?.aiQueries || 0) < limits.aiQueries;
    case 'premiumReports':
      return limits.premiumReports === true;
    case 'advancedAnalytics':
      return limits.advancedAnalytics === true;
    case 'smartNotifications':
      return limits.smartNotifications === true;
    case 'calendarDashboard':
      return limits.calendarDashboard === true;
    case 'customModels':
      return limits.customModels === true;
    case 'prioritySupport':
      return limits.prioritySupport === true;
    case 'apiAccess':
      return limits.apiAccess === true;
    default:
      return true; // Free feature
  }
};

export const upgradeToTrial = () => {
  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 7);

  const subscription = {
    plan: SUBSCRIPTION_PLANS.PREMIUM_TRIAL,
    status: 'trial',
    trialEndsAt: trialEndsAt.toISOString(),
    subscribedAt: new Date().toISOString(),
    paymentMethod: null,
    nextBillingDate: null,
    usage: {
      monthlyHealthEntries: 0,
      aiQueries: 0,
      reportsGenerated: 0
    }
  };

  localStorage.setItem('healthmate_subscription', JSON.stringify(subscription));
  return subscription;
};

export const upgradeToPaidPlan = (planType) => {
  const planConfig = PLAN_FEATURES[planType];
  if (!planConfig) throw new Error('Invalid plan type');

  const nextBillingDate = new Date();
  nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

  const subscription = {
    plan: planType,
    status: 'active',
    trialEndsAt: null,
    subscribedAt: new Date().toISOString(),
    paymentMethod: { type: 'card', last4: '4242' }, // Mock payment method
    nextBillingDate: nextBillingDate.toISOString(),
    usage: {
      monthlyHealthEntries: 0,
      aiQueries: 0,
      reportsGenerated: 0
    }
  };

  localStorage.setItem('healthmate_subscription', JSON.stringify(subscription));
  return subscription;
};
