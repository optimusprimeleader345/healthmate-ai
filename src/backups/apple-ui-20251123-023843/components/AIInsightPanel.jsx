import React from 'react';
import { Card } from './Card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const AIInsightPanel = ({ title, insight, trendArrow, riskLevel }) => {
  const getTrendIcon = () => {
    if (trendArrow === 'up') return <TrendingUp className="w-5 h-5 text-green-500" />;
    if (trendArrow === 'down') return <TrendingDown className="w-5 h-5 text-red-500" />;
    return <Minus className="w-5 h-5 text-gray-500" />;
  };

  const getRiskColor = () => {
    if (riskLevel === 'low') return 'text-green-600 bg-green-100';
    if (riskLevel === 'medium') return 'text-yellow-600 bg-yellow-100';
    if (riskLevel === 'high') return 'text-red-600 bg-red-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold tracking-tight text-gray-900">{title}</h3>
        {getTrendIcon()}
      </div>
      <div className="border-t border-white/40 mt-4 pt-4">
        <p className="text-sm font-medium text-gray-600 mb-4">{insight}</p>
        <div className="flex items-center">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor()}`}>
            {riskLevel.toUpperCase()}
          </span>
          <span className="ml-2 text-sm text-gray-500">Risk Level</span>
        </div>
      </div>
    </Card>
  );
};

export default AIInsightPanel;
