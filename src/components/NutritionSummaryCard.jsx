import React from 'react';
import { Card } from './Card';
import { Apple, Target, TrendingUp, AlertCircle } from 'lucide-react';
import { generateNutritionEntry } from '../utils/mockNutrition';

const NutritionSummaryCard = () => {
  // Generate today's nutrition data
  const todaysEntry = generateNutritionEntry();
  const { totals, goals, goalAchieved } = todaysEntry;

  // Calculate percentages
  const caloriePercent = Math.min((totals.calories / goals.dailyCalories) * 100, 100);
  const proteinPercent = Math.min((totals.protein / goals.dailyProtein) * 100, 100);

  const remainingCalories = Math.max(0, goals.dailyCalories - totals.calories);
  const remainingProtein = Math.max(0, goals.dailyProtein - totals.protein);

  return (
    <Card className="glass-card p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Apple className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Nutrition Today</h3>
        </div>
        <div className="flex gap-1">
          {goalAchieved.calories && <Target className="h-4 w-4 text-green-500" />}
          {!goalAchieved.calories && <AlertCircle className="h-4 w-4 text-orange-500" />}
        </div>
      </div>

      <div className="space-y-4">
        {/* Calories */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Calories</span>
            <span className="font-medium">
              {totals.calories} / {goals.dailyCalories}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                caloriePercent > 90 ? 'bg-red-500' : caloriePercent > 70 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${caloriePercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{remainingCalories} remaining</span>
            <span>{Math.round(caloriePercent)}%</span>
          </div>
        </div>

        {/* Protein */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Protein</span>
            <span className="font-medium">
              {totals.protein}g / {goals.dailyProtein}g
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                goalAchieved.protein ? 'bg-green-500' : 'bg-yellow-500'
              }`}
              style={{ width: `${proteinPercent}%` }}
            />
          </div>
        </div>

        {/* Macronutrients overview */}
        <div className="grid grid-cols-3 gap-4 pt-2 border-t">
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">{totals.carbs}g</div>
            <div className="text-xs text-gray-500">Carbs</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-purple-600">{totals.fat}g</div>
            <div className="text-xs text-gray-500">Fat</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-orange-600">{totals.fiber}g</div>
            <div className="text-xs text-gray-500">Fiber</div>
          </div>
        </div>

        {/* Goal Status */}
        <div className="flex gap-2 pt-2">
          {goalAchieved.calories && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              <TrendingUp className="h-3 w-3" />
              On Track
            </span>
          )}
          {!goalAchieved.calories && remainingCalories < 200 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
              <AlertCircle className="h-3 w-3" />
              Close to Limit
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default NutritionSummaryCard;
