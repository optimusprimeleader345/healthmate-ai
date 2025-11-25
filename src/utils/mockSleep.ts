import type {
  SleepSession,
  SleepAnalytics,
  SleepRecommendation
} from '../types/sleep';

export const generateMockSleepSessions = (days: number = 7): SleepSession[] => {
  const sessions: SleepSession[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    date.setHours(Math.floor(Math.random() * 2) + 22, Math.floor(Math.random() * 30) + 30); // 10:30 PM to 12:00 AM

    const bedtime = new Date(date);
    const duration = Math.floor(Math.random() * 120) + 360; // 6-8 hours
    const wakeTime = new Date(bedtime.getTime() + duration * 60 * 1000);

    // Calculate sleep stages
    const deepSleep = Math.floor(duration * 0.2);
    const remSleep = Math.floor(duration * 0.25);
    const lightSleep = Math.floor(duration * 0.5);
    const awake = Math.floor(duration * 0.05);
    const efficiency = Math.round((duration / (duration + awake)) * 100);
    const quality = Math.max(1, Math.min(10, Math.round(efficiency / 10)));

    const session: SleepSession = {
      id: `sleep-${date.toISOString().split('T')[0]}`,
      userId: 'user-1',
      date,
      bedtime,
      wakeTime,
      duration,
      sleepEfficiency: efficiency,
      quality,
      stages: { deep: deepSleep, rem: remSleep, light: lightSleep, awake },
      heartRate: {
        resting: 65 + Math.floor(Math.random() * 10),
        average: 60 + Math.floor(Math.random() * 15),
        lowest: 50 + Math.floor(Math.random() * 10),
        variability: 20 + Math.floor(Math.random() * 20)
      },
      factors: ['caffeine'],
      analysis: {
        overallScore: quality,
        sleepEfficiency: efficiency,
        remPercentage: Math.round((remSleep / duration) * 100),
        deepSleepPercentage: Math.round((deepSleep / duration) * 100),
        fragmentationIndex: Math.floor(Math.random() * 20) + 5,
        recommendations: generateSleepRecommendations(quality, efficiency, duration)
      }
    };
    sessions.push(session);
  }
  return sessions.sort((a, b) => b.date.getTime() - a.date.getTime());
};

const generateSleepRecommendations = (quality: number, efficiency: number, duration: number): SleepRecommendation[] => {
  const recommendations: SleepRecommendation[] = [];

  if (efficiency < 85) {
    recommendations.push({
      id: 'rec-1',
      type: 'lifestyle',
      title: 'Improve Sleep Environment',
      description: 'Consider cooler room temperature and blackout curtains for better efficiency.',
      impact: 'high',
      actionable: true,
      category: 'Sleep Environment'
    });
  }

  if (quality < 7) {
    recommendations.push({
      id: 'rec-2',
      type: 'lifestyle',
      title: 'Caffeine Timing',
      description: 'Avoid caffeine 8 hours before bedtime to improve sleep quality.',
      impact: 'high',
      actionable: true,
      category: 'Lifestyle Choices'
    });
  }

  if (duration < 420) { // Less than 7 hours
    recommendations.push({
      id: 'rec-3',
      type: 'timing',
      title: 'Extend Sleep Duration',
      description: 'Aim for 7-8 hours of sleep. Go to bed 30 minutes earlier.',
      impact: 'high',
      actionable: true,
      category: 'Sleep Duration'
    });
  }

  return recommendations;
};

export const generateSleepAnalytics = (period: 'week' | 'month' = 'week'): SleepAnalytics => {
  const sessions = generateMockSleepSessions(period === 'week' ? 7 : 30);
  const duration = sessions.length > 0 ? sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length : 0;
  const quality = sessions.length > 0 ? sessions.reduce((sum, s) => sum + s.quality, 0) / sessions.length : 0;
  const efficiency = sessions.length > 0 ? sessions.reduce((sum, s) => sum + s.sleepEfficiency, 0) / sessions.length : 0;

  return {
    period,
    startDate: sessions.length > 0 ? sessions[sessions.length - 1].date : new Date(),
    endDate: sessions.length > 0 ? sessions[0].date : new Date(),
    averageDuration: Math.round(duration),
    averageQuality: Math.round(quality * 10) / 10,
    averageEfficiency: Math.round(efficiency),
    sleepConsistencyScore: Math.max(0, Math.min(100, 85 + Math.floor(Math.random() * 10) - 5)),
    mostCommonFactors: ['caffeine', 'stress', 'exercise'],
    bestSleepDay: 'Wednesday',
    worstSleepDay: 'Monday',
    trends: [
      { metric: 'quality', direction: 'improving', changeRate: 8, period: 'last 7 days' },
      { metric: 'duration', direction: 'stable', changeRate: 2, period: 'last 7 days' }
    ],
    correlations: [
      { factor: 'caffeine', correlation: -0.6, confidence: 'high', significance: 95 },
      { factor: 'exercise', correlation: 0.4, confidence: 'medium', significance: 78 }
    ]
  };
};

export const getTodaysSleepSession = (): SleepSession | null => {
  const sessions = generateMockSleepSessions(1);
  return sessions[0] || null;
};

export const mockSleepProfile = {
  averageSleepHours: 7.2,
  sleepEfficiency: 83,
  chronotype: 'morning',
  optimalBedtime: '22:30',
  optimalWakeTime: '06:00'
};
