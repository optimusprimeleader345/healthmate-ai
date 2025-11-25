export function SleepAgent(state) {
  let score = 0;
  let reasons = [];

  const hours = Number(state?.sleep || 0);

  if (hours < 4) {
    score += 3;
    reasons.push("Severe sleep deprivation");
  } else if (hours < 6) {
    score += 2;
    reasons.push("Low sleep duration");
  } else {
    score += 0.5;
    reasons.push("Sleep looks healthy");
  }

  return { agent: "SleepAgent", score, reasons };
}
