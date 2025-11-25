import React from 'react';
import { Card } from './Card';

const InsightCard = ({ title, insights, className = '' }) => {
  return (
    <Card className={`p-6 rounded-2xl shadow-md ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {insight.aiBadge && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-700">
                  AI
                </span>
              )}
            </div>
            <div className="flex-shrink-0">
              <div className={`p-2 rounded-lg ${insight.aiBadge ? 'bg-teal-50' : 'bg-neutral-50'}`}>
                <insight.icon className={`w-4 h-4 ${insight.aiBadge ? 'text-teal-500' : 'text-neutral-500'}`} />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700">{insight.text}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default InsightCard;
