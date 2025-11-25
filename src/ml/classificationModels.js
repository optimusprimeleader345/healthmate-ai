/* classificationModels.js */
export function classifyStressLevel(data) {
  // data: array of daily stress scores or numeric features
  // simple logistic-like heuristic:
  const avg = mean(data);
  const prob = Math.min(1, Math.max(0, (avg - 3) / 4)); // map avg to 0-1
  const level = prob > 0.7 ? "high" : prob > 0.4 ? "medium" : "low";
  return { level, probability: Number(prob.toFixed(2)) };
}

export function classifyFatigueRisk(data) {
  // data: object {sleepHours: [...], steps: [...], hydration: [...]}
  const sleepAvg = mean(data.sleepHours || []);
  const stepsAvg = mean(data.steps || []);
  // simple weighted score
  const score = Math.max(0, (6 - sleepAvg) * 0.6 + (2000 - stepsAvg) / 4000 * 0.4);
  const prob = Math.min(1, Math.max(0, score));
  const level = prob > 0.6 ? "high" : prob > 0.3 ? "medium" : "low";
  return { level, probability: Number(prob.toFixed(2)) };
}

export function classifyDehydrationRisk(data) {
  // data: array of daily hydration liters
  const avg = mean(data || []);
  const prob = avg < 1.8 ? Math.min(1, (1.8 - avg) / 1.2) : 0;
  const level = prob > 0.6 ? "high" : prob > 0.3 ? "medium" : "low";
  return { level, probability: Number(prob.toFixed(2)) };
}

/* helpers */
function mean(arr = []) {
  if (!arr.length) return 0;
  return arr.reduce((s, v) => s + Number(v || 0), 0) / arr.length;
}
