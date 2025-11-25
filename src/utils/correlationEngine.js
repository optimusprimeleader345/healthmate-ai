/**
 * Correlation Engine Utilities
 */

/**
 * Compute Pearson correlation coefficient
 * Measures linear relationship between two variables
 * @param {Array<number>} x - First dataset
 * @param {Array<number>} y - Second dataset
 * @returns {number} Pearson correlation coefficient (-1 to 1)
 */
export function computePearson(x, y) {
  if (x.length !== y.length || x.length < 2) {
    throw new Error('Dataset arrays must have equal length and at least 2 elements');
  }

  const n = x.length;

  // Calculate means
  const meanX = x.reduce((sum, val) => sum + val, 0) / n;
  const meanY = y.reduce((sum, val) => sum + val, 0) / n;

  // Calculate covariance and variances
  let covariance = 0;
  let varX = 0;
  let varY = 0;

  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    covariance += dx * dy;
    varX += dx * dx;
    varY += dy * dy;
  }

  // Return correlation
  const denominator = Math.sqrt(varX) * Math.sqrt(varY);
  return denominator === 0 ? 0 : covariance / denominator;
}

/**
 * Compute Spearman rank correlation coefficient
 * Measures monotonic relationship between two ranked variables
 * @param {Array<number>} x - First dataset
 * @param {Array<number>} y - Second dataset
 * @returns {number} Spearman correlation coefficient (-1 to 1)
 */
export function computeSpearman(x, y) {
  if (x.length !== y.length || x.length < 2) {
    throw new Error('Dataset arrays must have equal length and at least 2 elements');
  }

  // Create rank arrays
  const rankX = getRanks(x);
  const rankY = getRanks(y);

  // Use Pearson on ranks
  return computePearson(rankX, rankY);
}

/**
 * Compute covariance between two datasets
 * Measures how two variables change together
 * @param {Array<number>} x - First dataset
 * @param {Array<number>} y - Second dataset
 * @returns {number} Covariance
 */
export function computeCovariance(x, y) {
  if (x.length !== y.length || x.length < 1) {
    throw new Error('Dataset arrays must have equal length and at least 1 element');
  }

  const n = x.length;

  // Calculate means
  const meanX = x.reduce((sum, val) => sum + val, 0) / n;
  const meanY = y.reduce((sum, val) => sum + val, 0) / n;

  // Calculate covariance
  let covariance = 0;
  for (let i = 0; i < n; i++) {
    covariance += (x[i] - meanX) * (y[i] - meanY);
  }

  // Return unbiased estimator (divide by n-1 for sample covariance)
  return covariance / (n - 1);
}

/**
 * Helper function to compute ranks for Spearman correlation
 * @param {Array<number>} data - Dataset to rank
 * @returns {Array<number>} Rank array (1-based)
 */
function getRanks(data) {
  // Create array of objects with original value and index
  const withIndices = data.map((value, index) => ({ value, index }));

  // Sort by value
  withIndices.sort((a, b) => a.value - b.value);

  // Assign ranks, handling ties
  const ranks = new Array(data.length);
  let i = 0;

  while (i < withIndices.length) {
    let j = i;
    let rankSum = 0;
    let count = 0;

    // Find group of equal values
    while (j < withIndices.length && withIndices[j].value === withIndices[i].value) {
      rankSum += j + 1;
      count++;
      j++;
    }

    // Assign average rank to all in group
    const avgRank = rankSum / count;
    for (let k = i; k < j; k++) {
      ranks[withIndices[k].index] = avgRank;
    }

    i = j;
  }

  return ranks;
}
