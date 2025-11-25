import React, { useEffect, useState } from 'react';
import { X, ArrowLeft, ArrowRight, SkipForward } from 'lucide-react';
import { getTutorialStep, getNextStep, getPreviousStep } from '../../utils/tutorialSteps';
import useTutorial from '../../hooks/useTutorial';

interface TutorialWalkthroughProps {
  onClose?: () => void;
}

const TutorialWalkthrough: React.FC<TutorialWalkthroughProps> = ({ onClose }) => {
  const { tutorialState, actions, progress } = useTutorial();
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [tooltipArrowPosition, setTooltipArrowPosition] = useState({ direction: 'bottom', position: 0 });

  const currentStep = tutorialState.currentStep ? getTutorialStep(tutorialState.currentStep) : null;

  useEffect(() => {
    if (currentStep?.highlightElement) {
      updateHighlightedElement();
      window.addEventListener('resize', updateHighlightedElement);
      return () => window.removeEventListener('resize', updateHighlightedElement);
    }
  }, [currentStep]);

  const updateHighlightedElement = () => {
    if (!currentStep?.highlightElement) return;

    const element = document.querySelector(currentStep.highlightElement);
    setHighlightedElement(element);

    if (element) {
      updateTooltipPosition(element, currentStep.position);
    }
  };

  const updateTooltipPosition = (element: Element, position: string) => {
    const rect = element.getBoundingClientRect();
    let top = 0, left = 0, arrowDirection = 'bottom', arrowPos = 0;

    switch (position) {
      case 'center':
        top = window.innerHeight / 2 - 100;
        left = window.innerWidth / 2 - 200;
        break;

      case 'right':
        top = rect.top + rect.height / 2 - 100;
        left = rect.left + rect.width + 20;
        arrowDirection = 'left';
        arrowPos = top + 100;
        break;

      case 'top-right':
        top = rect.top - 160;
        left = rect.left + rect.width / 2 - 200;
        arrowDirection = 'bottom';
        arrowPos = left + 200;
        break;

      case 'left':
        top = rect.top + rect.height / 2 - 100;
        left = rect.left - 420;
        arrowDirection = 'right';
        arrowPos = top + 100;
        break;

      default:
        top = rect.top + rect.height + 10;
        left = rect.left + rect.width / 2 - 200;
    }

    // Keep tooltip within viewport bounds
    top = Math.max(10, Math.min(top, window.innerHeight - 230));
    left = Math.max(10, Math.min(left, window.innerWidth - 420));

    setTooltipPosition({ top, left });
    setTooltipArrowPosition({ direction: arrowDirection, position: arrowPos });
  };

  const handleNext = () => {
    actions.nextStep();
  };

  const handlePrevious = () => {
    actions.previousStep();
  };

  const handleSkip = () => {
    actions.skipTutorial();
    onClose?.();
  };

  const handleClose = () => {
    if (tutorialState.currentStep === 'complete') {
      actions.completeTutorial();
    } else {
      actions.skipTutorial();
    }
    onClose?.();
  };

  if (!tutorialState.isActive || !currentStep) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none"
      style={{
        backgroundColor: highlightedElement ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0)',
        transition: 'background-color 0.3s ease'
      }}
    >
      {/* Highlight overlay */}
      {highlightedElement && (
        <div
          className="absolute bg-black bg-opacity-0"
          style={{
            top: highlightedElement.getBoundingClientRect().top - 4,
            left: highlightedElement.getBoundingClientRect().left - 4,
            width: highlightedElement.getBoundingClientRect().width + 8,
            height: highlightedElement.getBoundingClientRect().height + 8,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7), inset 0 0 0 4px #3b82f6',
            borderRadius: '4px',
            animation: 'pulse 2s infinite'
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className="pointer-events-auto bg-white rounded-xl shadow-2xl max-w-md mx-4"
        style={{
          position: 'absolute',
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
          transform: 'translateY(-10px)',
          animation: 'slideIn 0.3s ease-out forwards'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {tutorialState.currentStepIndex + 1}
              </span>
            </div>
            <h2 className="font-semibold text-lg text-gray-900">{currentStep.title}</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Progress Bar */}
        {currentStep.showProgress !== false && (
          <div className="px-4 pt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1 text-center">
              Step {tutorialState.currentStepIndex + 1} of {tutorialState.totalSteps}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          <p className="text-gray-700 leading-relaxed">{currentStep.content}</p>

          {/* Arrow */}
          {currentStep.showArrow && (
            <div
              className="absolute w-0 h-0 border-8"
              style={{
                [tooltipArrowPosition.direction]: '-8px',
                [tooltipArrowPosition.direction === 'left' || tooltipArrowPosition.direction === 'right' ? 'top' : 'left']:
                  `${Math.min(Math.max(tooltipArrowPosition.position - tooltipPosition.left - 16, 16), 384)}px`,
                borderColor: `transparent ${
                  tooltipArrowPosition.direction === 'left' ? 'white #ffffff transparent transparent' :
                  tooltipArrowPosition.direction === 'right' ? 'white transparent transparent #ffffff' :
                  tooltipArrowPosition.direction === 'top' ? 'white white transparent transparent' :
                  'transparent transparent white white'
                }`
              }}
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex gap-2">
            {getPreviousStep(tutorialState.currentStep, tutorialState.sequence) && (
              <button
                onClick={handlePrevious}
                className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            )}
            {tutorialState.currentStepIndex > 0 && (
              <button
                onClick={handleSkip}
                className="flex items-center gap-1 px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors text-sm"
              >
                <SkipForward className="w-4 h-4" />
                Skip All
              </button>
            )}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            {currentStep.nextText || 'Next'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialWalkthrough;
