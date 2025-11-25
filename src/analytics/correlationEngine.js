// compute Pearson correlation
export function pearsonCorrelation(arr1 = [], arr2 = []) {
  if (arr1.length !== arr2.length || arr1.length === 0) return 0;
  const n = arr1.length;

  const mean1 = arr1.reduce((a, b) => a + b, 0) / n;
  const mean2 = arr2.reduce((a, b) => a + b, 0) / n;

  let num = 0;
  let den1 = 0;
  let den2 = 0;

  for (let i = 0; i < n; i++) {
    const diff1 = arr1[i] - mean1;
    const diff2 = arr2[i] - mean2;
    num += diff1 * diff2;
    den1 += diff1 ** 2;
    den2 += diff2 ** 2;
  }

  const denom = Math.sqrt(den1 * den2);
  return denom === 0 ? 0 : Number((num / denom).toFixed(2));
}

// basic insight based on correlation
export function correlationInsight(label1, label2, value) {
  if (value > 0.6) return `${label1} and ${label2} are strongly correlated.`;
  if (value > 0.3) return `${label1} and ${label2} have mild correlation.`;
  if (value < -0.6) return `${label1} increases as ${label2} decreases.`;
  if (value < -0.3) return `${label1} and ${label2} have mild negative correlation.`;
  return `${label1} and ${label2} are mostly independent.`;
}
