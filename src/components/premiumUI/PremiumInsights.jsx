import React from "react";
import InsightBadge from "./InsightBadge";
import { TrendingUp, TrendingDown, Brain, Activity } from "lucide-react";

export default function PremiumInsights() {
  const insights = [
    { text: 'Sleep quality has improved by 12% this week', trend: 'up', icon: TrendingUp, status: 'success' },
    { text: 'Hydration levels are optimal, maintain intake', trend: 'up', icon: Activity, status: 'primary' },
    { text: 'Stress response detected, consider relaxation techniques', trend: 'down', icon: TrendingDown, status: 'warning' }
  ];

  return (
    <div className="p-4 rounded-2xl bg-white shadow-soft border transition-all card-hover animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <Brain className="w-5 h-5 mr-2 text-teal-600" />
          AI Health Insights
        </h3>
        <InsightBadge text="Premium" variant="primary" />
      </div>
      <div className="space-y-4" role="status" aria-live="polite">
        {insights.map((insight, index) => (
          <div key={index} className="p-4 rounded-xl bg-white/70 backdrop-blur-sm shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${insight.trend === 'up' ? 'bg-green-100' : 'bg-orange-100'}`}>
                <insight.icon className={`w-4 h-4 ${insight.trend === 'up' ? 'text-green-600' : 'text-orange-600'}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{insight.text}</p>
                <div className="mt-2 flex items-center space-x-2">
                  <span className={`text-xs font-semibold ${insight.trend === 'up' ? 'text-green-600' : 'text-orange-600'}`}>
                    {insight.trend === 'up' ? 'Improving' : 'Attention'}
                  </span>
                  <InsightBadge text="AI" variant={insight.status} className="scale-75" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <button className="w-full py-2 px-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400">
          View Detailed Analysis
        </button>
      </div>
    </div>
  );
}
