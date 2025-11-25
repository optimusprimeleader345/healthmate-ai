export function predictSleepTrend(data) {
  return {
    forecast: smoothForecast(data),
    confidence: 0.85,
    trendDirection: getTrendDirection(data)
  };
}

export function predictHydrationTrend(data) {
  return {
    forecast: smoothForecast(data),
    confidence: 0.78,
    trendDirection: getTrendDirection(data)
  };
}

export function predictStressTrend(data) {
  return {
    forecast: smoothForecast(data),
    confidence: 0.72,
    trendDirection: getTrendDirection(data)
  };
}

// Helper function: moving average
function movingAverage(data, window = 3) {
  if (!data || data.length === 0) return [];
  const result = [];
  for (let i = window - 1; i < data.length; i++) {
    const slice = data.slice(i - window + 1, i + 1);
    const avg = slice.reduce((sum, val) => sum + val, 0) / window;
    result.push(avg);
  }
  return result;
}

// Helper function: exponential smoothing
function exponentialSmoothing(data, alpha = 0.3) {
  if (!data || data.length === 0) return [];
  const smoothed = [data[0]];
  for (let i = 1; i < data.length; i++) {
    smoothed.push(alpha * data[i] + (1 - alpha) * smoothed[i - 1]);
  }
  return smoothed;
}

// Helper function: getTrendDirection
function getTrendDirection(data) {
  if (!data || data.length < 2) return 'stable';
  const first = data[0];
  const last = data[data.length - 1];
  if (last > first * 1.05) return 'up';
  if (last < first * 0.95) return 'down';
  return 'stable';
}

// Helper function: smoothForecast
function smoothForecast(data) {
  if (!data || data.length === 0) return [];
  const ma = movingAverage(data);
  const es = exponentialSmoothing(data);
  // Simple combination
  const combined = [];
  for (let i = 0; i < Math.min(ma.length, es.length); i++) {
    combined.push((ma[i] + es[i]) / 2);
  }
  return combined;
}
