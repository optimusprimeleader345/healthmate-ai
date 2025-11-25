export interface SleepSession {
  id: string;
  userId: string;
  date: Date;
  bedtime: Date;
  wakeTime: Date;
  duration: number; // minutes total sleep time
  sleepEfficiency: number; // percentage (time asleep / time in bed)
  quality: number; // 1-10 overall quality rating
  stages: SleepStages;
  heartRate: SleepHeartRate;
  factors: SleepFactors[];
  notes?: string;
  wakefulness?: WakefulnessEpisode[];
  analysis: SleepQualityAnalysis;
}

export interface SleepStages {
  deep: number; // minutes in deep sleep
  rem: number; // minutes in REM sleep
  light: number; // minutes in light sleep
  awake: number; // minutes awake during sleep period
}

export interface SleepHeartRate {
  resting: number; // bpm
  average: number; // bpm during sleep
  lowest: number; // lowest bpm recorded
  variability: number; // HRV score
}

export type SleepFactors =
  | 'caffeine'
  | 'alcohol'
  | 'stress'
  | 'exercise'
  | 'heavy_meal'
  | 'medication'
  | 'room_temperature'
  | 'noise'
  | 'screen_time'
  | 'nap_during_day'
  | 'travel'
  | 'illness';

export interface WakefulnessEpisode {
  timestamp: Date;
  duration: number; // minutes
  reason?: string;
}

export interface SleepQualityAnalysis {
  overallScore: number; // 1-10
  sleepEfficiency: number; // percentage
  remPercentage: number; // % of sleep in REM
  deepSleepPercentage: number; // % of sleep in deep
  fragmentationIndex: number; // how fragmented the sleep was
  recommendations: SleepRecommendation[];
}

export interface SleepRecommendation {
  id: string;
  type: 'lifestyle' | 'environment' | 'health' | 'timing';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  category: string;
}

export interface SleepAnalytics {
  period: 'week' | 'month' | 'quarter';
  startDate: Date;
  endDate: Date;
  averageDuration: number; // minutes
  averageQuality: number; // 1-10
  averageEfficiency: number; // percentage
  sleepConsistencyScore: number; // 0-100
  mostCommonFactors: SleepFactors[];
  bestSleepDay?: string;
  worstSleepDay?: string;
  trends: SleepTrend[];
  correlations: SleepCorrelation[];
}

export interface SleepTrend {
  metric: 'duration' | 'quality' | 'efficiency' | 'deep_sleep';
  direction: 'improving' | 'declining' | 'stable';
  changeRate: number; // percentage or minutes
  period: string;
}

export interface SleepCorrelation {
  factor: SleepFactors;
  correlation: number; // -1 to 1 (negative = hurts sleep, positive = helps)
  confidence: 'high' | 'medium' | 'low';
  significance: number; // statistical significance
}

export interface SleepGoal {
  id: string;
  userId: string;
  targetHour: number; // desired hours of sleep
  targetQuality: number; // desired quality 1-10
  targetEfficiency: number; // desired efficiency %
  active: boolean;
  createdAt: Date;
  deadline?: Date;
}

export interface SleepHabit {
  id: string;
  userId: string;
  habit: string; // e.g., "no caffeine after 2pm"
  type: 'positive' | 'negative' | 'neutral';
  consistency: number; // % of days followed
  impactOnSleep: number; // estimated quality points
  active: boolean;
}

export interface BedtimeReminder {
  id: string;
  userId: string;
  enabled: boolean;
  reminderTime: string; // "22:00"
  daysOfWeek: number[]; // 0-6 (0=Sunday)
  message: string;
  snoozeEnabled: boolean;
  snoozeMinutes: number;
}

export interface CircadianRhythm {
  userId: string;
  chronotype: 'morning' | 'evening' | 'neutral'; // lark, owl, or neutral
  optimalBedtime: string;
  optimalWakeTime: string;
  averageBedtime: string;
  averageWakeTime: string;
  consistency: number; // % of time following natural rhythm
  lastUpdated: Date;
}
