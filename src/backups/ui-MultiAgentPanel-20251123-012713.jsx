import React, { useState, useEffect } from "react";
import { runMultiAgentAnalysis } from "../agents/AgentNegotiator";

export default function MultiAgentPanel({ state }) {
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    if (state) {
      const result = runMultiAgentAnalysis(state);
      setAnalysis(result);
    }
  }, [state]);

  if (!analysis) return null;

  return (
    <div className="mt-6 p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-3">Multi-Agent Health Insights</h2>

      <div className="flex flex-col gap-3">
        {analysis.agents.map((agent, index) => (
          <div key={index} className="border p-3 rounded-lg bg-gray-50">
            <div className="font-semibold">{agent.agent}</div>
            <div className="text-sm">Score: {agent.score}</div>
            <ul className="ml-4 list-disc text-sm">
              {agent.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 rounded-lg bg-blue-100 text-blue-800">
        <div className="font-semibold">Overall Risk Level: {analysis.riskLevel}</div>
        <div>Total Score: {analysis.totalScore}</div>
      </div>
    </div>
  );
}
