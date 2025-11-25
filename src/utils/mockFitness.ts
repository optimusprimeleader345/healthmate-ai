import type {
  FitnessGoal,
  WorkoutSession,
  FitnessExercise,
  WeeklyPlan,
  DailyWorkoutPlan,
  FitnessProfile,
  WorkoutProgress,
  AIWorkoutInsight,
  ExerciseLibraryItem,
  WorkoutTemplate,
  FitnessAnalytics,
  GoalProgress,
  ExerciseProgress,
  FitnessTrend
} from '../types/fitness';
import { fitbitAPI } from '../services/fitbitService';

// Mock fitness profile
export const mockFitnessProfile: FitnessProfile = {
  id: 'profile-1',
  userId: 'user-1',
  age: 30,
  gender: 'male',
  height: 175, // cm
  weight: 75, // kg
  fitnessLevel: 'intermediate',
  experience: 2,
  equipment: ['dumbbells', 'resistance_bands', 'yoga_mat', 'pull_up_bar'],
  weeklyTake: 4,
  preferences: {
    workoutTypes: ['strength', 'cardio', 'flexibility'],
    sessionDuration: 45,
    timeSlots: ['morning', 'evening'],
    intensity: 'medium'
  }
};

// Mock exercise library
export const mockExerciseLibrary: ExerciseLibraryItem[] = [
  {
    id: 'ex-1',
    name: 'Push-ups',
    category: 'upper_body',
    type: 'strength',
    difficulty: 'beginner',
    equipment: ['bodyweight'],
    targetMuscles: ['chest', 'shoulders', 'triceps'],
    instructions: 'Start in plank position, lower body to ground, push back up.',
    tips: ['Keep core tight', 'Maintain straight line from head to heels'],
    caloriesPerMinute: 5
  },
  {
    id: 'ex-2',
    name: 'Squats',
    category: 'lower_body',
    type: 'strength',
    difficulty: 'beginner',
    equipment: ['bodyweight'],
    targetMuscles: ['quadriceps', 'glutes', 'hamstrings'],
    instructions: 'Stand with feet shoulder-width apart, lower hips back and down, then stand back up.',
    tips: ['Keep knees behind toes', 'Keep chest up and core engaged'],
    caloriesPerMinute: 6
  },
  {
    id: 'ex-3',
    name: 'Plank',
    category: 'core',
    type: 'strength',
    difficulty: 'intermediate',
    equipment: ['bodyweight'],
    targetMuscles: ['core', 'shoulders'],
    instructions: 'Hold plank position on forearms and toes, keep body straight.',
    tips: ['Engage core muscles', 'Keep hips level'],
    caloriesPerMinute: 4
  },
  {
    id: 'ex-4',
    name: 'Running',
    category: 'cardio',
    type: 'cardio',
    difficulty: 'intermediate',
    equipment: ['running_shoes'],
    targetMuscles: ['legs', 'cardiovascular_system'],
    instructions: 'Run at a steady pace maintaining good form.',
    tips: ['Maintain good posture', 'Breathe rhythmically'],
    caloriesPerMinute: 8
  },
  {
    id: 'ex-5',
    name: 'Yoga Flow',
    category: 'flexibility',
    type: 'flexibility',
    difficulty: 'beginner',
    equipment: ['yoga_mat'],
    targetMuscles: ['full_body'],
    instructions: 'Follow vinyasa flow with controlled movements and breath.',
    tips: ['Focus on breath', 'Move slowly and mindfully'],
    caloriesPerMinute: 3
  }
];

// Mock fitness goals
export const mockFitnessGoals: FitnessGoal[] = [
  {
    id: 'goal-1',
    name: 'Weight Loss Goal',
    type: 'weight_loss',
    targetValue: 70,
    currentValue: 75,
    unit: 'kg',
    deadline: new Date('2025-03-01'),
    active: true
  },
  {
    id: 'goal-2',
    name: 'Weekly Cardio',
    type: 'general_fitness',
    targetValue: 240, // minutes per month
    currentValue: 180,
    unit: 'minutes',
    deadline: new Date('2025-02-01'),
    active: true
  }
];

// Generate weekly workout plan
export const generateWeeklyPlan = (goalId: string, weekStart: Date): WeeklyPlan => {
  const sessions: DailyWorkoutPlan[] = [];

  // Generate 4 sessions per week as per profile
  const workoutDays = [0, 2, 4, 6]; // Mon, Wed, Fri, Sun

  workoutDays.forEach(dayOffset => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + dayOffset);

    const session: DailyWorkoutPlan = {
      id: `session-${date.toISOString().split('T')[0]}`,
      date,
      sessions: [
        mockExerciseLibrary[0], // Push-ups
        mockExerciseLibrary[1], // Squats
        mockExerciseLibrary[2]  // Plank
      ],
      totalDuration: 45, // 45 minutes per session
      totalCalories: 225, // approx calories
      dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'long' }),
      completed: Math.random() > 0.3 // 70% completion rate for demo
    };

    sessions.push(session);
  });

  return {
    id: `plan-${weekStart.toISOString().split('T')[0]}`,
    weekStart,
    goalId,
    sessions,
    totalCalories: sessions.reduce((sum, s) => sum + s.totalCalories, 0),
    totalDuration: sessions.reduce((sum, s) => sum + s.totalDuration, 0),
    aiInsights: generateAIInsights()
  };
};

// Generate AI workout insights
export const generateAIInsights = (): AIWorkoutInsight[] => [
  {
    id: 'insight-1',
    type: 'difficulty_adjustment',
    title: 'Increase Weight Resistance',
    description: 'Based on your progress, we recommend adding 2-3kg to your dumbbell exercises for better muscle growth.',
    priority: 'high',
    actionable: true,
    generatedAt: new Date()
  },
  {
    id: 'insight-2',
    type: 'recovery_advice',
    title: 'Additional Rest Day Recommended',
    description: 'Your workout consistency is 95%, but adding one rest day per week could improve recovery and prevent overtraining.',
    priority: 'medium',
    actionable: true,
    generatedAt: new Date()
  },
  {
    id: 'insight-3',
    type: 'equipment_recommendation',
    title: 'Consider Resistance Bands',
    description: 'Resistance bands would complement your dumbbells and add variety to your home workouts.',
    priority: 'low',
    actionable: true,
    generatedAt: new Date()
  }
];

// Generate workout progress data for past month
export const generateWorkoutProgress = (days: number = 30): WorkoutProgress[] => {
  const progress: WorkoutProgress[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    progress.push({
      date,
      completedSessions: Math.floor(Math.random() * 2), // 0 or 1 session per day
      totalSessions: Math.floor(Math.random() * 2) + 1, // 1 or 2 planned
      caloriesBurned: Math.floor(Math.random() * 300) + 200,
      totalDuration: Math.floor(Math.random() * 45) + 30,
      averageQuality: Math.floor(Math.random() * 3) + 7 // 7-10 quality rating
    });
  }

  return progress;
};

// Generate fitness analytics
export const generateFitnessAnalytics = (period: 'week' | 'month' | 'quarter' = 'month'): FitnessAnalytics => {
  const progress = generateWorkoutProgress(period === 'week' ? 7 : period === 'month' ? 30 : 90);
  const totalWorkouts = progress.reduce((sum, p) => sum + p.completedSessions, 0);
  const totalDuration = progress.reduce((sum, p) => sum + p.totalDuration, 0);
  const totalCalories = progress.reduce((sum, p) => sum + p.caloriesBurned, 0);

  return {
    period,
    startDate: new Date(),
    endDate: new Date(),
    totalWorkouts,
    totalDuration,
    totalCalories,
    averageSessionsPerWeek: period === 'week' ? totalWorkouts : totalWorkouts / (period === 'month' ? 4.3 : 12),
    mostFrequentExerciseType: 'strength',
    consistencyScore: 85, // out of 100
    progressTowardsGoals: generateGoalProgress(),
    strengthGains: generateExerciseProgress(),
    trends: generateFitnessTrends()
  };
};

// Generate goal progress data
export const generateGoalProgress = (): GoalProgress[] => [
  {
    goalId: 'goal-1',
    goalName: 'Weight Loss Goal',
    progress: 57, // 57% to target (75kg to 70kg)
    startValue: 78,
    currentValue: 74,
    targetValue: 70,
    daysRemaining: 45,
    projectedCompletion: new Date('2025-02-20')
  },
  {
    goalId: 'goal-2',
    goalName: 'Weekly Cardio',
    progress: 75,
    startValue: 0,
    currentValue: 180,
    targetValue: 240,
    daysRemaining: 30
  }
];

// Generate exercise progress data
export const generateExerciseProgress = (): ExerciseProgress[] => [
  {
    exerciseName: 'Push-ups',
    lastReps: 15,
    maxWeight: 0, // bodyweight
    improvementRate: 23 // 23% improvement in last month
  },
  {
    exerciseName: 'Squats',
    lastReps: 20,
    maxWeight: 0,
    improvementRate: 18
  },
  {
    exerciseName: 'Plank',
    lastSets: 3,
    lastReps: 60, // seconds
    improvementRate: 15
  }
];

// Generate fitness trends
export const generateFitnessTrends = (): FitnessTrend[] => [
  {
    metric: 'total_workouts',
    trend: 'improving',
    changeRate: 12,
    confidence: 'high'
  },
  {
    metric: 'average_intensity',
    trend: 'improving',
    changeRate: 8,
    confidence: 'medium'
  },
  {
    metric: 'consistency_score',
    trend: 'stable',
    changeRate: 2,
    confidence: 'high'
  }
];

// Search exercises in library
export const searchExercises = (query: string, category?: string): ExerciseLibraryItem[] => {
  let filtered = mockExerciseLibrary;

  if (query) {
    filtered = filtered.filter(exercise =>
      exercise.name.toLowerCase().includes(query.toLowerCase()) ||
      exercise.category.toLowerCase().includes(query.toLowerCase()) ||
      exercise.targetMuscles.some(muscle =>
        muscle.toLowerCase().includes(query.toLowerCase())
      )
    );
  }

  if (category) {
    filtered = filtered.filter(exercise => exercise.category === category);
  }

  return filtered;
};

// Get exercise by ID
export const getExerciseById = (id: string): ExerciseLibraryItem | undefined => {
  return mockExerciseLibrary.find(ex => ex.id === id);
};

// Calculate calories burned estimate
export const calculateCaloriesBurned = (exercise: ExerciseLibraryItem, duration: number): number => {
  if (!exercise.caloriesPerMinute) return 0;
  return Math.round(exercise.caloriesPerMinute * (duration / 60));
};

// Fitbit API Integration Functions
export type FitbitDataResponse = {
  mockData?: any,
  apiData?: any,
  fromAPI: boolean,
  error?: string
};

/**
 * Get daily activity summary from Fitbit API
 */
export const getDailyActivitySummary = async (date: string = 'today'): Promise<FitbitDataResponse> => {
  try {
    // Try API first if connected
    const apiResponse = await fitbitAPI.getDailyActivitySummary(date);

    if (apiResponse.success && apiResponse.data) {
      // Convert API data to app format
      const fitnessData = convertFitbitActivityData(apiResponse.data);

      return {
        apiData: fitnessData,
        fromAPI: true
      };
    }

    // Fallback to mock data
    console.log('Using mock fitness data - Fitbit API not available');
    const mockData = fitbitAPI.getMockDailyActivitySummary();
    const fitnessData = convertFitbitActivityData(mockData);

    return {
      mockData: fitnessData,
      fromAPI: false
    };

  } catch (error) {
    console.warn('Fitbit activity data error, using mock data:', error);
    const mockData = fitbitAPI.getMockDailyActivitySummary();
    const fitnessData = convertFitbitActivityData(mockData);

    return {
      mockData: fitnessData,
      fromAPI: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Get sleep data from Fitbit API
 */
export const getSleepData = async (date: string = 'today'): Promise<FitbitDataResponse> => {
  try {
    const apiResponse = await fitbitAPI.getSleepLog(date);

    if (apiResponse.success && apiResponse.data) {
      const sleepData = convertFitbitSleepData(apiResponse.data);

      return {
        apiData: sleepData,
        fromAPI: true
      };
    }

    // Fallback to mock data
    const mockData = fitbitAPI.getMockSleepData();
    const sleepData = convertFitbitSleepData(mockData);

    return {
      mockData: sleepData,
      fromAPI: false
    };

  } catch (error) {
    console.warn('Fitbit sleep data error, using mock data:', error);
    const mockData = fitbitAPI.getMockSleepData();
    const sleepData = convertFitbitSleepData(mockData);

    return {
      mockData: sleepData,
      fromAPI: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Get heart rate data from Fitbit API
 */
export const getHeartRateData = async (date: string = 'today'): Promise<FitbitDataResponse> => {
  try {
    const apiResponse = await fitbitAPI.getHeartRateIntraday(date);

    if (apiResponse.success && apiResponse.data) {
      const heartRateData = convertFitbitHeartRateData(apiResponse.data);

      return {
        apiData: heartRateData,
        fromAPI: true
      };
    }

    // Fallback to mock data
    const mockData = fitbitAPI.getMockHeartRateData();
    const heartRateData = convertFitbitHeartRateData(mockData);

    return {
      mockData: heartRateData,
      fromAPI: false
    };

  } catch (error) {
    console.warn('Fitbit heart rate data error, using mock data:', error);
    const mockData = fitbitAPI.getMockHeartRateData();
    const heartRateData = convertFitbitHeartRateData(mockData);

    return {
      mockData: heartRateData,
      fromAPI: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Get time series data for fitness metrics
 */
export const getFitnessTimeSeries = async (
  resource: string,
  period: string = '30d'
): Promise<FitbitDataResponse> => {
  try {
    const apiResponse = await fitbitAPI.getActivityTimeSeries(resource, 'today', period);

    if (apiResponse.success && apiResponse.data) {
      return {
        apiData: apiResponse.data,
        fromAPI: true
      };
    }

    // Generate mock time series
    const mockData = generateMockTimeSeries(resource, period);
    return {
      mockData,
      fromAPI: false
    };

  } catch (error) {
    console.warn('Fitbit time series error, using mock data:', error);
    const mockData = generateMockTimeSeries(resource, period);
    return {
      mockData,
      fromAPI: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Data conversion functions to transform Fitbit API responses to app format
 */
const convertFitbitActivityData = (data: any) => {
  if (!data.summary) return null;

  const summary = data.summary;
  return {
    steps: summary.steps || 0,
    distance: summary.distances?.find((d: any) => d.activity === 'total')?.distance || 0,
    floors: summary.floors || 0,
    elevation: summary.elevation || 0,
    caloriesBurned: summary.caloriesOut || 0,
    activeMinutes: summary.fairlyActiveMinutes + summary.lightlyActiveMinutes + summary.veryActiveMinutes || 0,
    sedentaryMinutes: summary.sedentaryMinutes || 0,
    restingHeartRate: summary.restingHeartRate || 0,
    heartRateZones: {
      fatBurn: summary.heartRateZones?.fatBurn || 0,
      cardio: summary.heartRateZones?.cardio || 0,
      peak: summary.heartRateZones?.peak || 0
    },
    goals: data.goals || {
      steps: 10000,
      distance: 8.05,
      floors: 10,
      caloriesOut: 2000
    }
  };
};

const convertFitbitSleepData = (data: any) => {
  if (!data.sleep || data.sleep.length === 0) return null;

  const sleep = data.sleep[0];
  return {
    dateOfSleep: sleep.dateOfSleep,
    startTime: sleep.startTime,
    endTime: sleep.endTime,
    duration: sleep.duration,
    minutesAsleep: sleep.minutesAsleep || 0,
    minutesAwake: sleep.minutesAwake || 0,
    efficiency: sleep.efficiency || 0,
    timeInBed: sleep.timeInBed || 0,
    stages: {
      deep: sleep.levels?.summary?.deep?.minutes || 0,
      light: sleep.levels?.summary?.light?.minutes || 0,
      rem: sleep.levels?.summary?.rem?.minutes || 0,
      wake: sleep.levels?.summary?.wake?.minutes || 0
    },
    summary: data.summary || {
      totalMinutesAsleep: sleep.minutesAsleep || 0,
      totalSleepRecords: data.sleep.length,
      totalTimeInBed: sleep.timeInBed || 0
    }
  };
};

const convertFitbitHeartRateData = (data: any) => {
  if (!data['activities-heart-intraday'] || !data['activities-heart']) return null;

  const intraday = data['activities-heart-intraday'];
  const activities = data['activities-heart'];

  return {
    restingHeartRate: activities[0]?.value?.restingHeartRate || 0,
    heartRateZones: activities[0]?.value?.heartRateZones || {
      fatBurn: 0,
      cardio: 0,
      peak: 0
    },
    intradayData: intraday.dataset || [],
    datasetInterval: intraday.datasetInterval || 5,
    datasetType: intraday.datasetType || 'minute'
  };
};

const generateMockTimeSeries = (resource: string, period: string) => {
  const days = period.includes('d') ? parseInt(period.replace('d', '')) : 30;
  const data = [];

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    let value;
    switch (resource) {
      case 'steps':
        value = Math.floor(Math.random() * 5000) + 5000;
        break;
      case 'distance':
        value = Math.floor(Math.random() * 3) + 2;
        break;
      case 'calories':
        value = Math.floor(Math.random() * 300) + 1400;
        break;
      case 'minutesFairlyActive':
        value = Math.floor(Math.random() * 30) + 10;
        break;
      case 'floors':
        value = Math.floor(Math.random() * 15) + 3;
        break;
      default:
        value = 0;
    }

    data.push({
      dateTime: date.toISOString().split('T')[0],
      value
    });
  }

  return data;
};

/**
 * Check Fitbit API connection status
 */
export const getFitbitConnectionStatus = () => {
  return {
    isConfigured: fitbitAPI.isConfigured(),
    isConnected: fitbitAPI.isConnected(),
    isDemoMode: fitbitAPI.isDemoMode,
    rateLimit: fitbitAPI.getRateLimitStatus()
  };
};

/**
 * Disconnect Fitbit account
 */
export const disconnectFitbit = () => {
  fitbitAPI.disconnect();
};

/**
 * Initialize Fitbit OAuth connection
 */
export const connectFitbit = () => {
  fitbitAPI.initiateOAuthLogin();
};
