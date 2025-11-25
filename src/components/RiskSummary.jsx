import React from 'react';
import RiskIndicatorCard from './RiskIndicatorCard';
import { classifyStressLevel, classifyFatigueRisk, classifyDehydrationRisk } from '../ml/classificationModels';

export default function RiskSummary({ riskData }) {
  const hasRiskData = riskData && riskData.stress && riskData.fatigue && riskData.dehydration;
  let riskDataToUse;

  if (hasRiskData) {
    riskDataToUse = riskData;
  } else {
    // Mock data if not provided
    const sleepSample = [7, 6.5, 6, 7.2, 6.8, 7, 7.1];
    const stressSample = [2, 3, 4, 3.5, 4, 3, 2.8];
    const hydrationSample = [2.0, 1.6, 1.2, 1.8, 2.1, 1.5, 1.7];
    const stress = classifyStressLevel(stressSample);
    const fatigue = classifyFatigueRisk({ sleepHours: sleepSample, steps: [3000,4000,2000,3500,3000,3200,2900], hydration: hydrationSample });
    const dehydration = classifyDehydrationRisk(hydrationSample);
    riskDataToUse = { stress, fatigue, dehydration };
  }

  const cards = [
    { title: 'Stress', ...riskDataToUse.stress },
    { title: 'Fatigue', ...riskDataToUse.fatigue },
    { title: 'Dehydration', ...riskDataToUse.dehydration },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <RiskIndicatorCard
          key={index}
          title={card.title}
          level={card.level}
          probability={card.probability}
          details={`${Math.round(card.probability * 100)}% probability of ${card.level.charAt(0).toUpperCase() + card.level.slice(1)} risk`}
        />
      ))}
    </div>
  );
}
