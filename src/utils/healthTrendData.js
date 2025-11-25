// Comprehensive health trend data for interactive charts
export const healthTrendData = {
  // 7 days of health metrics with timestamps
  week: [
    {
      date: '2025-11-13',
      value: 82,
      timestamp: new Date('2025-11-13'),
      category: 'Health Score',
      details: {
        sleepHours: 7.8,
        heartRate: 72,
        steps: 8500,
        stressLevel: 'Low',
        hydrationLiters: 2.8
      }
    },
    {
      date: '2025-11-14',
      value: 79,
      timestamp: new Date('2025-11-14'),
      category: 'Health Score',
      details: {
        sleepHours: 6.9,
        heartRate: 75,
        steps: 9200,
        stressLevel: 'Medium',
        hydrationLiters: 2.1
      }
    },
    {
      date: '2025-11-15',
      value: 86,
      timestamp: new Date('2025-11-15'),
      category: 'Health Score',
      details: {
        sleepHours: 8.2,
        heartRate: 70,
        steps: 12000,
        stressLevel: 'Low',
        hydrationLiters: 3.0
      }
    },
    {
      date: '2025-11-16',
      value: 88,
      timestamp: new Date('2025-11-16'),
      category: 'Health Score',
      details: {
        sleepHours: 8.5,
        heartRate: 68,
        steps: 10500,
        stressLevel: 'Low',
        hydrationLiters: 2.9
      }
    },
    {
      date: '2025-11-17',
      value: 84,
      timestamp: new Date('2025-11-17'),
      category: 'Health Score',
      details: {
        sleepHours: 7.6,
        heartRate: 74,
        steps: 7800,
        stressLevel: 'Medium',
        hydrationLiters: 2.4
      }
    },
    {
      date: '2025-11-18',
      value: 90,
      timestamp: new Date('2025-11-18'),
      category: 'Health Score',
      details: {
        sleepHours: 8.8,
        heartRate: 71,
        steps: 13500,
        stressLevel: 'Low',
        hydrationLiters: 3.2
      }
    },
    {
      date: '2025-11-19',
      value: 87,
      timestamp: new Date('2025-11-19'),
      category: 'Health Score',
      details: {
        sleepHours: 8.1,
        heartRate: 73,
        steps: 9800,
        stressLevel: 'Low',
        hydrationLiters: 2.7
      }
    }
  ],

  // 30 days of sleep data
  monthlySleep: [
    { date: '2025-10-21', value: 7.2, timestamp: new Date('2025-10-21'), category: 'Sleep Hours' },
    { date: '2025-10-22', value: 6.8, timestamp: new Date('2025-10-22'), category: 'Sleep Hours' },
    { date: '2025-10-23', value: 8.1, timestamp: new Date('2025-10-23'), category: 'Sleep Hours' },
    { date: '2025-10-24', value: 7.9, timestamp: new Date('2025-10-24'), category: 'Sleep Hours' },
    { date: '2025-10-25', value: 8.3, timestamp: new Date('2025-10-25'), category: 'Sleep Hours' },
    { date: '2025-10-26', value: 7.5, timestamp: new Date('2025-10-26'), category: 'Sleep Hours' },
    { date: '2025-10-27', value: 6.9, timestamp: new Date('2025-10-27'), category: 'Sleep Hours' },
    { date: '2025-10-28', value: 8.5, timestamp: new Date('2025-10-28'), category: 'Sleep Hours' },
    { date: '2025-10-29', value: 7.7, timestamp: new Date('2025-10-29'), category: 'Sleep Hours' },
    { date: '2025-10-30', value: 8.0, timestamp: new Date('2025-10-30'), category: 'Sleep Hours' },
    { date: '2025-10-31', value: 7.8, timestamp: new Date('2025-10-31'), category: 'Sleep Hours' },
    { date: '2025-11-01', value: 8.2, timestamp: new Date('2025-11-01'), category: 'Sleep Hours' },
    { date: '2025-11-02', value: 7.4, timestamp: new Date('2025-11-02'), category: 'Sleep Hours' },
    { date: '2025-11-03', value: 6.7, timestamp: new Date('2025-11-03'), category: 'Sleep Hours' },
    { date: '2025-11-04', value: 8.4, timestamp: new Date('2025-11-04'), category: 'Sleep Hours' },
    { date: '2025-11-05', value: 7.9, timestamp: new Date('2025-11-05'), category: 'Sleep Hours' },
    { date: '2025-11-06', value: 8.1, timestamp: new Date('2025-11-06'), category: 'Sleep Hours' },
    { date: '2025-11-07', value: 7.6, timestamp: new Date('2025-11-07'), category: 'Sleep Hours' },
    { date: '2025-11-08', value: 8.3, timestamp: new Date('2025-11-08'), category: 'Sleep Hours' },
    { date: '2025-11-09', value: 7.8, timestamp: new Date('2025-11-09'), category: 'Sleep Hours' },
    { date: '2025-11-10', value: 6.9, timestamp: new Date('2025-11-10'), category: 'Sleep Hours' },
    { date: '2025-11-11', value: 8.6, timestamp: new Date('2025-11-11'), category: 'Sleep Hours' },
    { date: '2025-11-12', value: 7.3, timestamp: new Date('2025-11-12'), category: 'Sleep Hours' },
    { date: '2025-11-13', value: 8.2, timestamp: new Date('2025-11-13'), category: 'Sleep Hours' },
    { date: '2025-11-14', value: 7.7, timestamp: new Date('2025-11-14'), category: 'Sleep Hours' },
    { date: '2025-11-15', value: 8.5, timestamp: new Date('2025-11-15'), category: 'Sleep Hours' },
    { date: '2025-11-16', value: 8.1, timestamp: new Date('2025-11-16'), category: 'Sleep Hours' },
    { date: '2025-11-17', value: 7.9, timestamp: new Date('2025-11-17'), category: 'Sleep Hours' },
    { date: '2025-11-18', value: 8.3, timestamp: new Date('2025-11-18'), category: 'Sleep Hours' },
    { date: '2025-11-19', value: 7.8, timestamp: new Date('2025-11-19'), category: 'Sleep Hours' }
  ],

  // Heart rate trends
  heartRate: [
    { date: '2025-11-13', value: 72, timestamp: new Date('2025-11-13'), category: 'Heart Rate' },
    { date: '2025-11-14', value: 75, timestamp: new Date('2025-11-14'), category: 'Heart Rate' },
    { date: '2025-11-15', value: 70, timestamp: new Date('2025-11-15'), category: 'Heart Rate' },
    { date: '2025-11-16', value: 68, timestamp: new Date('2025-11-16'), category: 'Heart Rate' },
    { date: '2025-11-17', value: 74, timestamp: new Date('2025-11-17'), category: 'Heart Rate' },
    { date: '2025-11-18', value: 71, timestamp: new Date('2025-11-18'), category: 'Heart Rate' },
    { date: '2025-11-19', value: 73, timestamp: new Date('2025-11-19'), category: 'Heart Rate' },
    { date: '2025-11-20', value: 69, timestamp: new Date('2025-11-20'), category: 'Heart Rate' },
    { date: '2025-11-21', value: 72, timestamp: new Date('2025-11-21'), category: 'Heart Rate' },
    { date: '2025-11-22', value: 76, timestamp: new Date('2025-11-22'), category: 'Heart Rate' }
  ],

  // Activity levels (steps per day)
  activity: [
    { date: '2025-11-13', value: 8500, timestamp: new Date('2025-11-13'), category: 'Daily Steps' },
    { date: '2025-11-14', value: 9200, timestamp: new Date('2025-11-14'), category: 'Daily Steps' },
    { date: '2025-11-15', value: 12000, timestamp: new Date('2025-11-15'), category: 'Daily Steps' },
    { date: '2025-11-16', value: 10500, timestamp: new Date('2025-11-16'), category: 'Daily Steps' },
    { date: '2025-11-17', value: 7800, timestamp: new Date('2025-11-17'), category: 'Daily Steps' },
    { date: '2025-11-18', value: 13500, timestamp: new Date('2025-11-18'), category: 'Daily Steps' },
    { date: '2025-11-19', value: 9800, timestamp: new Date('2025-11-19'), category: 'Daily Steps' },
    { date: '2025-11-20', value: 11200, timestamp: new Date('2025-11-20'), category: 'Daily Steps' },
    { date: '2025-11-21', value: 8900, timestamp: new Date('2025-11-21'), category: 'Daily Steps' },
    { date: '2025-11-22', value: 10100, timestamp: new Date('2025-11-22'), category: 'Daily Steps' }
  ],

  // Stress levels
  stress: [
    { date: '2025-11-13', value: 25, timestamp: new Date('2025-11-13'), category: 'Stress Level' },
    { date: '2025-11-14', value: 45, timestamp: new Date('2025-11-14'), category: 'Stress Level' },
    { date: '2025-11-15', value: 20, timestamp: new Date('2025-11-15'), category: 'Stress Level' },
    { date: '2025-11-16', value: 15, timestamp: new Date('2025-11-16'), category: 'Stress Level' },
    { date: '2025-11-17', value: 35, timestamp: new Date('2025-11-17'), category: 'Stress Level' },
    { date: '2025-11-18', value: 10, timestamp: new Date('2025-11-18'), category: 'Stress Level' },
    { date: '2025-11-19', value: 30, timestamp: new Date('2025-11-19'), category: 'Stress Level' },
    { date: '2025-11-20', value: 25, timestamp: new Date('2025-11-20'), category: 'Stress Level' },
    { date: '2025-11-21', value: 40, timestamp: new Date('2025-11-21'), category: 'Stress Level' },
    { date: '2025-11-22', value: 18, timestamp: new Date('2025-11-22'), category: 'Stress Level' }
  ]
};

// Helper function to generate trend data for different time periods
export const generateTrendData = (baseMetric, days = 30, trend = 'stable') => {
  const data = [];
  const today = new Date();

  let baseValue = baseMetric.baseValue;
  const variance = baseMetric.variance || 15;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Apply trend bias
    let trendBias = 0;
    if (trend === 'improving') {
      trendBias = (days - i) * 2; // Gradual improvement
    } else if (trend === 'declining') {
      trendBias = -(days - i) * 1.5; // Gradual decline
    }

    // Add some randomness
    const randomVariance = (Math.random() - 0.5) * variance * 2;
    let value = Math.max(0, Math.min(100, baseValue + trendBias + randomVariance));

    // Ensure realistic ranges for different metrics
    if (baseMetric.name === 'sleep') {
      value = Math.max(2, Math.min(12, baseValue + trendBias + randomVariance));
    } else if (baseMetric.name === 'steps') {
      value = Math.max(0, Math.min(25000, baseValue + trendBias + randomVariance));
    } else if (baseMetric.name === 'heartrate') {
      value = Math.max(45, Math.min(120, baseValue + trendBias + randomVariance));
    }

    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value),
      timestamp: new Date(date),
      category: baseMetric.category
    });
  }

  return data;
};

// Metric configurations for different health areas
export const healthMetricConfigs = {
  overall: { baseValue: 85, variance: 8, category: 'Health Score' },
  sleep: { baseValue: 8, variance: 1.5, category: 'Sleep Hours' },
  heartrate: { baseValue: 72, variance: 5, category: 'Heart Rate (BPM)' },
  steps: { baseValue: 10500, variance: 3000, category: 'Daily Steps' },
  stress: { baseValue: 30, variance: 20, category: 'Stress Level (%)' },
  hydration: { baseValue: 2.5, variance: 0.8, category: 'Hydration (L)' }
};
