// anomalyDetection.js
export function zScoreAnomalies(values = [], threshold = 2.5) {
  if (!values || values.length === 0) return [];
  const mean = values.reduce((s, v) => s + Number(v || 0), 0) / values.length;
  const variance = values.reduce((s, v) => s + (Number(v || 0) - mean) ** 2, 0) / values.length;
  const std = Math.sqrt(variance);
  return values.map((v, i) => {
    const z = std === 0 ? 0 : (v - mean) / std;
    return { index: i, value: v, z: Number(z.toFixed(3)), isAnomaly: Math.abs(z) > threshold };
  }).filter(item => item.isAnomaly);
}

export function rollingDeviationAnomalies(values = [], window = 7, threshold = 2) {
  // returns anomalies where value deviates significantly from rolling mean
  const anomalies = [];
  for (let i = window; i < values.length; i++) {
    const windowSlice = values.slice(i - window, i);
    const mean = windowSlice.reduce((s, v) => s + Number(v || 0), 0) / windowSlice.length;
    const variance = windowSlice.reduce((s, v) => s + (Number(v || 0) - mean) ** 2, 0) / windowSlice.length;
    const std = Math.sqrt(variance);
    const z = std === 0 ? 0 : (values[i] - mean) / std;
    if (Math.abs(z) > threshold) {
      anomalies.push({ index: i, value: values[i], windowMean: Number(mean.toFixed(2)), z: Number(z.toFixed(2)), severity: Math.abs(z) });
    }
  }
  return anomalies;
}

export function detectAllAnomalies(dataObj = {}) {
  // dataObj example: { sleep: [...], hydration: [...], stress: [...], steps: [...] }
  const report = {};
  Object.keys(dataObj).forEach(k => {
    const arr = dataObj[k] || [];
    report[k] = {
      zAnomalies: zScoreAnomalies(arr, 2.5),
      rollingAnomalies: rollingDeviationAnomalies(arr, 7, 2)
    };
  });
  return report;
}
