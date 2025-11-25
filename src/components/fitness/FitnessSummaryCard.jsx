import React from 'react';
import { Card } from '../Card';
import { Target, TrendingUp, Calendar, Award } from 'lucide-react';

const FitnessSummaryCard = ({ progress, goals, analytics }) => {
  const weeklyProgress = progress.reduce((sum, p) => sum + p.completedSessions, 0);
  const avgQuality = progress.length > 0
    ? Math.round(progress.reduce((sum, p) => sum + p.averageQuality, 0) / progress.length)
    : 0;

  const activeGoals = goals.filter(goal => goal.active);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Fitness Overview</h3>
        <Award className="h-5 w-5 text-yellow-500" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{weeklyProgress}</div>
          <div className="text-sm text-gray-600">This Week</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{avgQuality}/10</div>
          <div className="text-sm text-gray-600">Avg Quality</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{activeGoals.length}</div>
          <div className="text-sm text-gray-600">Active Goals</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {analytics?.consistencyScore || '85'}%
          </div>
          <div className="text-sm text-gray-600">Consistency</div>
        </div>
      </div>

      <div className="space-y-3">
        {activeGoals.map(goal => {
          const progressPercent = Math.min((goal.currentValue / goal.targetValue) * 100, 100);
          return (
            <div key={goal.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{goal.name}</span>
                <span className="text-xs text-gray-500">
                  {goal.currentValue}/{goal.targetValue} {goal.unit}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-green-500 h-1.5 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default FitnessSummaryCard;
