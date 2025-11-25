export function StressAgent(state) {
  let score = 0;
  let reasons = [];

  const stress = Number(state?.stress || 0);

  if (stress > 8) {
    score += 3;
    reasons.push("Critical stress spike");
  } else if (stress > 6) {
    score += 2;
    reasons.push("High stress pattern");
  } else {
    score += 0.5;
    reasons.push("Stress stable");
  }

  return { agent: "StressAgent", score, reasons };
}
