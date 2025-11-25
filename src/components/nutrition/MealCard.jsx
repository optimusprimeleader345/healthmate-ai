import React from 'react';
import { Card } from '../Card';
import { Clock, Plus } from 'lucide-react';
import { Button } from '../Button';

const MealCard = ({ mealType, meals = [], onAddMeal }) => {
  const totalCalories = meals.reduce((sum, meal) => sum + meal.totalCalories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.totalProtein, 0);

  return (
    <Card className="p-4 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <h3 className="font-semibold text-gray-900 capitalize">{mealType}</h3>
        </div>
        <span className="text-xs text-gray-500">
          {meals.length} item{meals.length !== 1 ? 's' : ''}
        </span>
      </div>

      {meals.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm mb-3">No meals logged yet</p>
          <Button
            onClick={onAddMeal}
            size="sm"
            className="bg-transparent border-2 border-dashed border-gray-300 hover:border-teal-300 text-gray-600 hover:text-teal-600"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add {mealType}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold text-teal-600">{totalCalories}</div>
            <div className="text-sm text-gray-500">{totalProtein}g protein</div>
          </div>

          <div className="space-y-2">
            {meals.slice(0, 2).map(meal => (
              <div key={meal.id} className="flex items-center justify-between py-1">
                <div className="flex-1">
                  <div className="font-medium text-sm truncate">{meal.name}</div>
                  <div className="text-xs text-gray-500">
                    {meal.totalCalories} cal • {meal.items.length} items
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(meal.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            ))}

            {meals.length > 2 && (
              <div className="text-xs text-gray-500 text-center">
                +{meals.length - 2} more meals
              </div>
            )}
          </div>

          <Button
            onClick={onAddMeal}
            size="sm"
            className="w-full mt-3 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add More
          </Button>
        </div>
      )}
    </Card>
  );
};

export default MealCard;
