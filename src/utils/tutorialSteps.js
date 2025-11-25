// Tutorial steps configuration for the HealthMate app
// Each step highlights specific UI elements and provides guidance

export const TUTORIAL_STEPS = {
  // Welcome and overview
  welcome: {
    id: 'welcome',
    title: 'Welcome to HealthMate AI!',
    content: 'Your comprehensive health companion. Let me show you around the key features.',
    position: 'center',
    highlightElement: null,
    allowInteraction: false,
    nextText: 'Get Started'
  },

  // Navigation sidebar
  sidebar: {
    id: 'sidebar',
    title: 'Navigation Menu',
    content: 'Use this sidebar to navigate between different health tracking features. Each icon represents a different health aspect.',
    position: 'right',
    highlightElement: '.sidebar-nav',
    allowInteraction: true,
    showArrow: true,
    arrowDirection: 'left',
    nextText: 'Next: Dashboard'
  },

  // Dashboard overview
  dashboard: {
    id: 'dashboard',
    title: 'Health Dashboard',
    content: 'This is your main health overview. See your daily metrics, recent insights, and quick actions.',
    position: 'center',
    highlightElement: null,
    allowInteraction: true,
    nextText: 'Next: Sleep Tracker'
  },

  // Sleep tracker
  sleep: {
    id: 'sleep',
    title: 'Sleep Tracker',
    content: 'Monitor your sleep quality, patterns, and get personalized recommendations for better rest.',
    position: 'right',
    highlightElement: '[data-tutorial="sleep-tracker"]',
    allowInteraction: true,
    showArrow: true,
    arrowDirection: 'left'
  },

  // Fitness planner
  fitness: {
    id: 'fitness',
    title: 'AI Fitness Planner',
    content: 'Let AI create personalized workout plans based on your goals, schedule, and current fitness level.',
    position: 'right',
    highlightElement: '[data-tutorial="ai-fitness"]',
    allowInteraction: true,
    showArrow: true,
    arrowDirection: 'left'
  },

  // AI Assistant
  aiAssistant: {
    id: 'ai-assistant',
    title: 'AI Health Assistant',
    content: 'Get instant health advice, symptom guidance, and connect with specialized health agents.',
    position: 'right',
    highlightElement: '[data-tutorial="ai-assistant"]',
    allowInteraction: true,
    showArrow: true,
    arrowDirection: 'left'
  },

  // Video tutorials
  videoTutorials: {
    id: 'video-tutorials',
    title: 'Video Tutorials',
    content: 'Access visual guides, expert interviews, and step-by-step tutorials for all features.',
    position: 'right',
    highlightElement: '[data-tutorial="video-tutorials"]',
    allowInteraction: true,
    showArrow: true,
    arrowDirection: 'left'
  },

  // Help features
  voiceAssistant: {
    id: 'voice-assistant',
    title: 'Voice Assistant',
    content: 'Use voice commands to quickly log health data, get insights, or ask health questions.',
    position: 'top-right',
    highlightElement: '[data-tutorial="voice-bubble"]',
    allowInteraction: true,
    showArrow: true,
    arrowDirection: 'up'
  },

  // Final step - complete
  complete: {
    id: 'complete',
    title: 'You\'re All Set!',
    content: 'You can always restart this tutorial from Settings > Help. Explore the app and enjoy better health management!',
    position: 'center',
    highlightElement: null,
    allowInteraction: false,
    nextText: 'Finish Tutorial',
    showProgress: false
  }
};

// Tutorial sequences for different user journeys
export const TUTORIAL_SEQUENCES = {
  newUser: [
    'welcome',
    'sidebar',
    'dashboard',
    'sleep',
    'fitness',
    'aiAssistant',
    'videoTutorials',
    'voiceAssistant',
    'complete'
  ],

  sleepFocus: [
    'welcome',
    'sleep',
    'aiAssistant',
    'complete'
  ],

  fitnessFocus: [
    'welcome',
    'fitness',
    'sidebar',
    'complete'
  ]
};

// Helper function to get step data by ID
export const getTutorialStep = (stepId) => {
  return TUTORIAL_STEPS[stepId];
};

// Helper function to get next step in sequence
export const getNextStep = (currentStepId, sequence = TUTORIAL_SEQUENCES.newUser) => {
  const currentIndex = sequence.indexOf(currentStepId);
  if (currentIndex === -1) return null;
  return sequence[currentIndex + 1] || null;
};

// Helper function to get previous step in sequence
export const getPreviousStep = (currentStepId, sequence = TUTORIAL_SEQUENCES.newUser) => {
  const currentIndex = sequence.indexOf(currentStepId);
  if (currentIndex <= 0) return null;
  return sequence[currentIndex - 1];
};

export default {
  TUTORIAL_STEPS,
  TUTORIAL_SEQUENCES,
  getTutorialStep,
  getNextStep,
  getPreviousStep
};
