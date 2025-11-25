export function HeartAgent(state) {
  let score = 0;
  let reasons = [];

  const heart = Number(state?.heart || 0);

  if (heart > 150) {
    score += 3;
    reasons.push("High heart rate spike detected");
  } else if (heart > 120) {
    score += 2;
    reasons.push("Elevated heart rate");
  } else if (heart < 50) {
    score += 2;
    reasons.push("Possible bradycardia pattern");
  } else {
    score += 0.5;
    reasons.push("Heart stable");
  }

  return { agent: "HeartAgent", score, reasons };
}
