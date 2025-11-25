import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateDailyInsight } from '../../utils/aiInsightMock';

// Web Speech API types
declare global {
  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    abort(): void;
    onstart: ((event: Event) => void) | null;
    onresult: ((event: any) => void) | null;
    onerror: ((event: any) => void) | null;
    onend: ((event: Event) => void) | null;
  }

  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
    SpeechRecognition: new () => SpeechRecognition;
  }
}

interface VoiceCommand {
  command: string;
  action: string;
  confidence: number;
  timestamp: Date;
}

interface VoiceAssistantProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  isOpen = false,
  onClose,
  className = ''
}) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [commandHistory, setCommandHistory] = useState<VoiceCommand[]>([]);
  const [currentResponse, setCurrentResponse] = useState<string>('');

  const commandRef = useRef<string>('');

  useEffect(() => {
    // Initialize Web Speech API
    const initSpeech = () => {
      if ('webkitSpeechRecognition' in window) {
        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          speakText('Listening for your health command...');
        };

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript || '';
          commandRef.current = transcript;
          processVoiceCommand(transcript, event.results[0][0].confidence || 0.9);
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          speakText('Sorry, I couldn\'t hear that. Please try again.');
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognition);
      }

      // Initialize speech synthesis
      if ('speechSynthesis' in window) {
        setSpeechSynthesis(window.speechSynthesis);
      }
    };

    initSpeech();
  }, []);

  const speakText = useCallback((text: string, pitch: number = 1, rate: number = 1) => {
    setCurrentResponse(text);

    if (speechSynthesis) {
      // Cancel any current speech
      speechSynthesis.cancel();

      setIsSpeaking(true);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = pitch;
      utterance.rate = rate;

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      speechSynthesis.speak(utterance);
    }
  }, [speechSynthesis]);

  const processVoiceCommand = useCallback((transcript: string, confidence: number) => {
    const command: VoiceCommand = {
      command: transcript,
      action: 'processing',
      confidence,
      timestamp: new Date()
    };

    const lowerTranscript = transcript.toLowerCase();

    // Health status inquiries
    if (lowerTranscript.includes('how am i') || lowerTranscript.includes('health status')) {
      const healthScore = Math.floor(Math.random() * 30) + 70;
      const response = `Your current health score is ${healthScore}%. ${generateDailyInsight().message}.
                    ${healthScore > 80 ? 'Excellent job!' : 'Keep working on your health goals!'}`;

      command.action = 'health_status_check';
      speakText(response);
    }
    // Log health data
    else if (lowerTranscript.includes('log') || lowerTranscript.includes('record')) {
      if (lowerTranscript.includes('sleep')) {
        const hours = extractNumericValue(lowerTranscript) || 8;
        command.action = 'log_sleep';
        speakText(`Logged ${hours} hours of sleep. Great rest! 💤`);
      }
      else if (lowerTranscript.includes('walk') || lowerTranscript.includes('step')) {
        const steps = extractNumericValue(lowerTranscript) * 1000 || 5000;
        command.action = 'log_activity';
        speakText(`Logged ${steps.toLocaleString()} steps. You're staying active! 🏃‍♂️`);
      }
      else if (lowerTranscript.includes('weight')) {
        const weight = extractNumericValue(lowerTranscript) || 150;
        command.action = 'log_weight';
        speakText(`Logged ${weight} pounds. Tracking your progress! 📊`);
      }
      else {
        command.action = 'log_unknown';
        speakText("What health metric would you like to log? Sleep, activity, weight, or water intake?");
      }
    }
    // Medication reminders
    else if (lowerTranscript.includes('medication') || lowerTranscript.includes('medicine') || lowerTranscript.includes('pill')) {
      command.action = 'medication_reminder';
      speakText("I can help you with medication reminders. Would you like me to remind you to take your medication?");
    }
    // Ask questions about health
    else if (lowerTranscript.includes('recommend') || lowerTranscript.includes('suggest') || lowerTranscript.includes('should i')) {
      const insight = generateDailyInsight();
      command.action = 'health_recommendation';
      speakText(`My recommendation: ${insight.message}. Would you like more details?`);
    }
    // Emergency help
    else if (lowerTranscript.includes('emergency') || lowerTranscript.includes('help') || lowerTranscript.includes('urgent')) {
      command.action = 'emergency_help';
      speakText("Emergency detected. Please contact emergency services at 911 or your local emergency number immediately. Stay safe!");
    }
    // Ask for specific health metrics
    else if (lowerTranscript.includes('heart rate') || lowerTranscript.includes('pulse')) {
      const heartRate = Math.floor(Math.random() * 40) + 60;
      command.action = 'heart_rate_check';
      speakText(`Your heart rate is approximately ${heartRate} beats per minute. ${heartRate > 100 ? 'Please consult a doctor if you feel unwell.' : 'Looking good!'}`);
    }
    else if (lowerTranscript.includes('blood pressure')) {
      const systolic = Math.floor(Math.random() * 40) + 100;
      const diastolic = Math.floor(Math.random() * 20) + 70;
      command.action = 'blood_pressure_check';
      speakText(`Your blood pressure reading is ${systolic}/${diastolic}. ${systolic > 130 || diastolic > 85 ? 'Please consult with your healthcare provider.' : 'Great blood pressure!'}`);
    }
    // Common FAQs
    else if (lowerTranscript.includes('who are you') || lowerTranscript.includes('what are you')) {
      command.action = 'introduce_assistant';
      speakText('I\'m HealthMate AI, your personal healthcare assistant. I can help you track your health, provide insights, and answer medical questions. I\'m designed to work like a nurse or health coach!');
    }
    else if (lowerTranscript.includes('capabilities') || lowerTranscript.includes('can you do') || lowerTranscript.includes('help me')) {
      command.action = 'list_capabilities';
      speakText('I can help you check your health status, log sleep and activity data, set medication reminders, provide health recommendations, track vital signs, and answer general health questions. What would you like to know?');
    }
    // Polite responses
    else if (lowerTranscript.includes('thank you') || lowerTranscript.includes('thanks')) {
      command.action = 'gratitude_response';
      speakText('You\'re very welcome! Remember, I\'m here 24/7 to help with your health journey. Stay healthy!');
    }
    else if (lowerTranscript.includes('hello') || lowerTranscript.includes('hi') || lowerTranscript.includes('hey')) {
      command.action = 'greeting_response';
      speakText('Hello! How can I assist with your health today?');
    }
    else {
      // Unknown command - try to be helpful
      command.action = 'unknown_command';
      speakText("I'm not sure about that. Try asking about your health status, logging data, or getting health recommendations. You can also say 'help me' to hear what I can do!");
    }

    command.action = command.action === 'processing' ? 'completed' : command.action;
    setCommandHistory(prev => [...prev, command]);
  }, [speakText]);

  const extractNumericValue = (text: string): number | null => {
    const matches = text.match(/\d+(\.\d+)?/);
    return matches ? parseFloat(matches[0]) : null;
  };

  const startListening = () => {
    if (recognition && !isListening) {
      setCurrentResponse('');
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  const toggleVoiceResponse = () => {
    if (speechSynthesis) {
      if (isSpeaking) {
        speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        if (currentResponse) {
          speakText(currentResponse);
        } else {
          speakText('Try saying something like "How am I doing?" or "Log my sleep hours"');
        }
      }
    }
  };

  if (generateDailyInsight && typeof generateDailyInsight.message === 'string') {
    // Safe to call generateDailyInsight
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className={`fixed bottom-6 right-6 z-50 ${className}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="voice-assistant-title"
          aria-describedby="voice-assistant-status"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 w-80 max-w-[calc(100vw-2rem)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isListening ? 'bg-red-500 animate-pulse' :
                    isSpeaking ? 'bg-blue-500' : 'bg-green-500'
                  }`}
                  aria-label={`Voice assistant status: ${isListening ? 'listening' : isSpeaking ? 'speaking' : 'ready'}`}
                >
                  {isListening ? <Mic className="w-5 h-5 text-white" /> :
                   isSpeaking ? <Volume2 className="w-5 h-5 text-white" /> :
                   <Mic className="w-5 h-5 text-white" />}
                </div>
                <div>
                  <h3 id="voice-assistant-title" className="font-semibold text-gray-800">HealthMate AI</h3>
                  <div
                    id="voice-assistant-status"
                    className={`text-xs px-2 py-1 rounded-full ${
                      isListening ? 'bg-red-100 text-red-800' :
                      isSpeaking ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}
                  >
                    {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Ready'}
                  </div>
                </div>
              </div>
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                  aria-label="Close voice assistant"
                >
                  ✕
                </button>
              )}
            </div>

            {currentResponse && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 bg-blue-50 rounded-lg"
                role="region"
                aria-live="polite"
              >
                <p className="text-sm text-gray-800">{currentResponse}</p>
              </motion.div>
            )}

            <div className="flex gap-2 mb-4">
              <button
                onClick={isListening ? stopListening : startListening}
                className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-colors ${
                  isListening
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
                aria-label={isListening ? 'Stop listening for commands' : 'Start listening for voice commands'}
              >
                {isListening ? 'Stop Listening' : 'Start Voice Command'}
              </button>

              <button
                onClick={toggleVoiceResponse}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                aria-label={isSpeaking ? 'Stop speech synthesis' : 'Repeat last response'}
              >
                {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>

            <div className="text-xs text-gray-500 mb-3" aria-label="Suggested voice commands">Try saying:</div>
            <div className="grid grid-cols-1 gap-2 text-xs" role="list">
              <button
                onClick={() => processVoiceCommand("How am I doing?", 0.9)}
                className="text-left hover:bg-gray-50 p-2 rounded"
                role="listitem"
                aria-label="Example command: How am I doing?"
              >
                💊 "How am I doing?"
              </button>
              <button
                onClick={() => processVoiceCommand("Log my sleep for 8 hours", 0.9)}
                className="text-left hover:bg-gray-50 p-2 rounded"
                role="listitem"
                aria-label="Example command: Log my sleep for 8 hours"
              >
                😴 "Log my sleep for 8 hours"
              </button>
              <button
                onClick={() => processVoiceCommand("What's my heart rate?", 0.9)}
                className="text-left hover:bg-gray-50 p-2 rounded"
                role="listitem"
                aria-label="Example command: What's my heart rate?"
              >
                ♥️ "What's my heart rate?"
              </button>
            </div>

            {commandHistory.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200" role="region" aria-labelledby="command-history-title">
                <div id="command-history-title" className="text-xs text-gray-500 mb-2">Recent commands:</div>
                <div className="max-h-20 overflow-y-auto space-y-1" role="list" aria-label="Recent voice commands">
                  {commandHistory.slice(-3).map((cmd, index) => (
                    <div key={index} className="text-xs text-gray-600 bg-gray-50 p-2 rounded" role="listitem">
                      <div className="font-medium">{cmd.action.replace('_', ' ').toUpperCase()}</div>
                      <div>"{cmd.command}"</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoiceAssistant;
