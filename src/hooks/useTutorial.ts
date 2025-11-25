import { useState, useEffect } from 'react';

// Tutorial state management hook
export interface TutorialState {
  isActive: boolean;
  currentStep: string | null;
  completedSteps: Set<string>;
  sequence: string[];
  totalSteps: number;
  currentStepIndex: number;
}

export interface TutorialActions {
  startTutorial: (sequence?: string[]) => void;
  nextStep: () => void;
  previousStep: () => void;
  skipTutorial: () => void;
  completeTutorial: () => void;
  goToStep: (stepId: string) => void;
  resetTutorial: () => void;
}

const TUTORIAL_SEQUENCES = {
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

export const useTutorial = () => {
  const [tutorialState, setTutorialState] = useState<TutorialState>(() => {
    // Initialize from localStorage if available
    const savedState = localStorage.getItem('healthmate-tutorial-state');
    if (savedState) {
      try {
        return JSON.parse(savedState);
      } catch (error) {
        console.warn('Failed to parse tutorial state from localStorage');
      }
    }

    return {
      isActive: false,
      currentStep: null,
      completedSteps: new Set<string>(),
      sequence: TUTORIAL_SEQUENCES.newUser,
      totalSteps: TUTORIAL_SEQUENCES.newUser.length,
      currentStepIndex: 0
    };
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('healthmate-tutorial-state', JSON.stringify(tutorialState));
  }, [tutorialState]);

  const actions: TutorialActions = {
    startTutorial: (sequence = TUTORIAL_SEQUENCES.newUser) => {
      setTutorialState({
        isActive: true,
        currentStep: sequence[0],
        completedSteps: new Set<string>(),
        sequence,
        totalSteps: sequence.length,
        currentStepIndex: 0
      });
    },

    nextStep: () => {
      setTutorialState(prev => {
        const currentIndex = prev.sequence.indexOf(prev.currentStep || '');
        const nextIndex = currentIndex + 1;

        if (nextIndex >= prev.sequence.length) {
          // Tutorial complete
          return {
            ...prev,
            isActive: false,
            currentStep: null,
            completedSteps: new Set([...prev.completedSteps, prev.currentStep || '']),
            currentStepIndex: nextIndex
          };
        }

        const nextStep = prev.sequence[nextIndex];
        return {
          ...prev,
          currentStep: nextStep,
          completedSteps: new Set([...prev.completedSteps, prev.currentStep || '']),
          currentStepIndex: nextIndex
        };
      });
    },

    previousStep: () => {
      setTutorialState(prev => {
        const currentIndex = prev.sequence.indexOf(prev.currentStep || '');
        const prevIndex = Math.max(currentIndex - 1, 0);
        const prevStep = prev.sequence[prevIndex];

        return {
          ...prev,
          currentStep: prevStep,
          currentStepIndex: prevIndex
        };
      });
    },

    skipTutorial: () => {
      setTutorialState(prev => ({
        ...prev,
        isActive: false,
        currentStep: null,
        completedSteps: new Set([...prev.completedSteps, 'skipped'])
      }));
    },

    completeTutorial: () => {
      setTutorialState(prev => ({
        ...prev,
        isActive: false,
        currentStep: null,
        completedSteps: new Set([...prev.completedSteps, prev.currentStep || '', 'completed'])
      }));
    },

    goToStep: (stepId: string) => {
      setTutorialState(prev => ({
        ...prev,
        currentStep: stepId,
        currentStepIndex: prev.sequence.indexOf(stepId)
      }));
    },

    resetTutorial: () => {
      setTutorialState({
        isActive: false,
        currentStep: null,
        completedSteps: new Set<string>(),
        sequence: TUTORIAL_SEQUENCES.newUser,
        totalSteps: TUTORIAL_SEQUENCES.newUser.length,
        currentStepIndex: 0
      });
      localStorage.removeItem('healthmate-tutorial-state');
    }
  };

  return {
    tutorialState,
    actions,
    isFirstVisit: tutorialState.completedSteps.size === 0,
    progress: tutorialState.isActive ?
      ((tutorialState.currentStepIndex + 1) / tutorialState.totalSteps) * 100 : 0
  };
};

export default useTutorial;
