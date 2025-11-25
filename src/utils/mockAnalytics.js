// Mock data for analytics
const sleepData = [8, 7.5, 8.2, 6.8, 7.9, 9, 8.5];
const stressData = [4, 6, 5, 7, 5, 3, 4];
const hydrationData = [2.1, 2.4, 2.0, 2.5, 2.3, 2.8, 2.6];
const fatigueData = [6, 7, 5, 8, 6, 4, 5];
const stepsData = [10000, 9500, 10500, 8000, 10200, 11000, 9800];
const moodData = [7, 6, 8, 5, 7, 9, 6];

// Utility functions
export function calculateMean(data) {
  const sum = data.reduce((acc, val) => acc + val, 0);
  return (sum / data.length).toFixed(2);
}

export function calculateMedian(data) {
  const sorted = [...data].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? ((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2) : sorted[mid].toFixed(2);
}

export function calculateVariance(data) {
  const mean = parseFloat(calculateMean(data));
  const squaredDiffs = data.map(val => (val - mean) ** 2);
  const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / data.length;
  return variance.toFixed(2);
}

export function calculateCorrelation(data1, data2) {
  const n = data1.length;
  const sum1 = data1.reduce((acc, val) => acc + val, 0);
  const sum2 = data2.reduce((acc, val) => acc + val, 0);
  const sum1Sq = data1.reduce((acc, val) => acc + val ** 2, 0);
  const sum2Sq = data2.reduce((acc, val) => acc + val ** 2, 0);
  const pSum = data1.reduce((acc, val, i) => acc + val * data2[i], 0);

  const numerator = pSum - (sum1 * sum2) / n;
  const denominator = Math.sqrt((sum1Sq - sum1 ** 2 / n) * (sum2Sq - sum2 ** 2 / n));
  return denominator === 0 ? 0 : (numerator / denominator).toFixed(2);
}

export function generateInsights() {
  // Mock insights based on hypothetical improvements
  return {
    weeklyImprovement: "+5.2%",
    dayOverDay: "-0.8%",
    anomaly: "Slight sleep variation on Thursday"
  };
}

// Export mock correlations
export const correlations = [
  { title: 'Sleep vs Stress', value: calculateCorrelation(sleepData, stressData) },
  { title: 'Hydration vs Fatigue', value: calculateCorrelation(hydrationData, fatigueData) },
  { title: 'Steps vs Mood', value: calculateCorrelation(stepsData, moodData) }
];
