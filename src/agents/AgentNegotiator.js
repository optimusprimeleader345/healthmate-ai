import { HeartAgent } from "./HeartAgent";
import { StressAgent } from "./StressAgent";
import { SleepAgent } from "./SleepAgent";

export function runMultiAgentAnalysis(state) {
  const results = [
    HeartAgent(state),
    StressAgent(state),
    SleepAgent(state),
  ];

  const totalScore = results.reduce((sum, r) => sum + r.score, 0);
  let riskLevel = "Low";

  if (totalScore > 7) riskLevel = "Critical";
  else if (totalScore > 4) riskLevel = "High";
  else if (totalScore > 2) riskLevel = "Moderate";

  return {
    agents: results,
    totalScore,
    riskLevel,
    timestamp: Date.now(),
  };
}
