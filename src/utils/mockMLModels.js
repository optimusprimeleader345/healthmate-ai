/**
 * Mock ML Models for Time-Series Forecasting
 */

// Sample historical data
const sleepHistorical = [8, 7.5, 8.2, 6.8, 7.9, 9, 8.5, 7.8, 8.1, 7.2, 8.3, 7.9];
const hydrationHistorical = [2.1, 2.4, 2.0, 2.5, 2.3, 2.8, 2.6, 2.2, 2.7, 2.1, 2.9, 2.5];
const stressHistorical = [4, 6, 5, 7, 5, 3, 4, 6, 5, 7, 4, 3];

// Utility function for moving average
function calculateMovingAverage(data, windowSize = 3) {
  const result = [];
  for (let i = windowSize - 1; i < data.length; i++) {
    const slice = data.slice(i - windowSize + 1, i + 1);
    const average = slice.reduce((sum, val) => sum + val, 0) / windowSize;
    result.push(average);
  }
  return result;
}

// Utility function for exponential smoothing
function exponentialSmoothing(data, alpha = 0.3) {
  const smoothed = [data[0]];
  for (let i = 1; i < data.length; i++) {
    const smoothedValue = alpha * data[i] + (1 - alpha) * smoothed[i - 1];
    smoothed.push(smoothedValue);
  }
  return smoothed;
}

// Combined forecasting function
function generateForecast(data, period = 7) {
  const ma = calculateMovingAverage(data, 3);
  const es = exponentialSmoothing(data, 0.3);

  const forecast = [];
  const confidenceLower = [];
  const confidenceUpper = [];

  // Calculate standard deviation from recent data
  const recentData = data.slice(-5);
  const mean = recentData.reduce((sum, val) => sum + val, 0) / recentData.length;
  const variance = recentData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / recentData.length;
  const stdDev = Math.sqrt(variance);

  for (let i = 0; i < period; i++) {
    const maValue = ma[ma.length - 1 - i] || ma[ma.length - 1];
    const esValue = es[es.length - 1 - i] || es[es.length - 1];

    const combined = (maValue + esValue) / 2 + (Math.random() - 0.5) * 0.5; // Add small noise

    forecast.push(combined);
    confidenceLower.push(combined - 1.96 * stdDev); // 95% confidence interval
    confidenceUpper.push(combined + 1.96 * stdDev);
  }

  return {
    forecast: forecast.reverse(),
    confidenceLower: confidenceLower.reverse(),
    confidenceUpper: confidenceUpper.reverse(),
    accuracy: Math.max(0.75 + Math.random() * 0.2, 0.8) // Mock accuracy 80-95%
  };
}

/**
 * Predict sleep trend for the next 7 days
 * @returns {Object} Forecast object with forecast array, confidence intervals, and accuracy
 */
export function predictSleepTrend() {
  return generateForecast(sleepHistorical);
}

/**
 * Predict hydration trend for the next 7 days
 * @returns {Object} Forecast object with forecast array, confidence intervals, and accuracy
 */
export function predictHydrationTrend() {
  return generateForecast(hydrationHistorical);
}

/**
 * Predict stress trend for the next 7 days
 * @returns {Object} Forecast object with forecast array, confidence intervals, and accuracy
 */
export function predictStressTrend() {
  return generateForecast(stressHistorical);
}
