import React, { useState } from 'react';
import { Search, Plus, Clock, Apple, AlertCircle, ExternalLink } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import MealCard from '../components/nutrition/MealCard';
import AddMealModal from '../components/nutrition/AddMealModal';
import NutritionSummaryCard from '../components/NutritionSummaryCard';
import { generateNutritionEntry, searchFoodItems } from '../utils/mockNutrition';
import { nutritionixAPI } from '../services/nutritionixService';

const NutritionTracker = () => {
  const [meals, setMeals] = useState([]); // All meals
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentMealType, setCurrentMealType] = useState('Breakfast');

  // Food search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [apiConfigured, setApiConfigured] = useState(nutritionixAPI.isConfigured());

  const todaysEntry = generateNutritionEntry();
  const currentMeals = meals.length > 0 ? meals : todaysEntry.meals;

  const handleAddMeal = (mealType) => {
    setCurrentMealType(mealType);
    setShowAddModal(true);
  };

  const handleSaveMeal = (newMeal) => {
    setMeals(prev => [...prev, newMeal]);
  };

  const groupedMeals = {
    Breakfast: currentMeals.filter(meal => meal.type === 'Breakfast'),
    Lunch: currentMeals.filter(meal => meal.type === 'Lunch'),
    Dinner: currentMeals.filter(meal => meal.type === 'Dinner'),
    Snacks: currentMeals.filter(meal => meal.type === 'Snacks')
  };

  // Food search handlers
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async () => {
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    setSearchError('');
    setSearchResults(null);

    try {
      const results = await searchFoodItems(searchQuery.trim());
      setSearchResults(results);
    } catch (error) {
      setSearchError('Failed to search foods. Please try again.');
      console.error('Food search error:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAdvancedSearch = () => {
    // For now, just trigger the same search
    // In future, this could open barcode scanner or advanced filters
    handleSearchSubmit();
  };

  const handleResetSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
    setSearchError('');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-100 rounded-lg">
            <Apple className="h-6 w-6 text-teal-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nutrition Tracker</h1>
            <p className="text-gray-600">Track your meals and nutrition goals</p>
          </div>
        </div>

        <Button
          onClick={() => {
            setCurrentMealType('Breakfast');
            setShowAddModal(true);
          }}
          className="bg-teal-500 hover:bg-teal-600 shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Quick Add Meal
        </Button>
      </div>

      {/* Today's Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-gray-500" />
              <h2 className="text-xl font-semibold text-gray-900">Today's Meals</h2>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-lg font-bold text-teal-600">
                  {currentMeals.reduce((sum, meal) => sum + meal.totalCalories, 0)}
                </div>
                <div className="text-xs text-gray-500">Calories</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {currentMeals.reduce((sum, meal) => sum + meal.totalProtein, 0)}g
                </div>
                <div className="text-xs text-gray-500">Protein</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">
                  {Math.round(currentMeals.reduce((sum, meal) => sum + meal.totalCarbs, 0))}g
                </div>
                <div className="text-xs text-gray-500">Carbs</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">
                  {Math.round(currentMeals.reduce((sum, meal) => sum + meal.totalFat, 0))}g
                </div>
                <div className="text-xs text-gray-500">Fat</div>
              </div>
            </div>

            {/* Meal Types Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(groupedMeals).map(([mealType, meals]) => (
                <MealCard
                  key={mealType}
                  mealType={mealType}
                  meals={meals}
                  onAddMeal={() => handleAddMeal(mealType)}
                />
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar with nutrition summary */}
        <div className="space-y-6">
          <NutritionSummaryCard />

          {/* Recent meals list */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Meals</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {currentMeals.slice(-5).reverse().map(meal => (
                <div key={meal.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{meal.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{meal.type.toLowerCase()}</div>
                  </div>
                  <div className="text-sm font-medium text-teal-600">
                    {meal.totalCalories} cal
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Nutrition goals */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Weekly Goals</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Average Daily Calories</span>
                <span className="font-medium">2,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Protein Goal</span>
                <span className="font-medium">150g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Water Intake</span>
                <span className="font-medium">8 cups</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Food Search Bar */}
      <Card className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
              placeholder="Search for foods (e.g., 'apple', '1 cup rice', 'pizza')"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              disabled={searchLoading}
            />
          </div>
          <Button
            onClick={handleSearchSubmit}
            disabled={searchLoading || !searchQuery.trim()}
            className="bg-teal-500 hover:bg-teal-600"
          >
            {searchLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Searching...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Search
              </div>
            )}
          </Button>
          <Button
            onClick={handleAdvancedSearch}
            variant="outline"
            disabled={searchLoading || !searchQuery.trim()}
          >
            Advanced Search
          </Button>
          {(searchQuery || searchResults) && (
            <Button
              onClick={handleResetSearch}
              variant="outline"
              size="sm"
            >
              Clear
            </Button>
          )}
        </div>

        {/* Search Status and API Info */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            {apiConfigured ? (
              <div className="flex items-center gap-1 text-green-600">
                <ExternalLink className="h-3 w-3" />
                <span>Nutritionix API Connected</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-amber-600">
                <AlertCircle className="h-3 w-3" />
                <span>Using Local Food Data</span>
              </div>
            )}
          </div>
          {searchResults?.fromAPI && (
            <div className="text-green-600">✓ Real-time nutrition data</div>
          )}
        </div>

        {/* Error Message */}
        {searchError && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span>{searchError}</span>
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchResults && (
          <div className="mt-4">
            <h3 className="font-medium text-gray-900 mb-3">
              {apiConfigured ? 'Nutritionix + Local Results' : 'Local Food Database'} ({searchResults.mock.length} found)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.mock.slice(0, 12).map((food) => (
                <div
                  key={food.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 cursor-pointer transition-all"
                  onClick={() => {
                    // Could be enhanced to add to meal
                    console.log('Selected food:', food);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-gray-900">{food.name}</h4>
                      <p className="text-xs text-gray-500 capitalize">{food.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-teal-600">{food.calories}</div>
                      <div className="text-xs text-gray-500">cal/{food.servingSize}{food.servingSizeUnit}</div>
                    </div>
                  </div>

                  {/* Nutrition Details */}
                  <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
                    <div className="text-center">
                      <div className="font-medium text-blue-600">{food.protein}g</div>
                      <div className="text-gray-500">Protein</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-purple-600">{food.carbs}g</div>
                      <div className="text-gray-500">Carbs</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-orange-600">{food.fat}g</div>
                      <div className="text-gray-500">Fat</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-green-600">{food.fiber}g</div>
                      <div className="text-gray-500">Fiber</div>
                    </div>
                  </div>

                  {searchResults.fromAPI && (
                    <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      Real-time data
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* API Results Section */}
            {searchResults.api && searchResults.api.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-green-600" />
                  API Results ({searchResults.api.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.api.slice(0, 6).map((food, index) => (
                    <div
                      key={`api_${index}`}
                      className="p-4 border-2 border-green-200 rounded-lg hover:border-teal-300 cursor-pointer transition-all bg-green-50"
                      onClick={() => {
                        console.log('Selected API food:', food);
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-gray-900">{food.name}</h4>
                          <p className="text-xs text-gray-500 capitalize">{food.category}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-teal-600">{food.calories}</div>
                          <div className="text-xs text-gray-500">cal/serving</div>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
                        <div className="text-center">
                          <div className="font-medium text-blue-600">{food.protein || 0}g</div>
                          <div className="text-gray-500">Protein</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-purple-600">{food.carbs || 0}g</div>
                          <div className="text-gray-500">Carbs</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-orange-600">{food.fat || 0}g</div>
                          <div className="text-gray-500">Fat</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-green-600">{food.fiber || 0}g</div>
                          <div className="text-gray-500">Fiber</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Search Help */}
        <div className="mt-3 text-xs text-gray-500">
          📝 Try natural language searches like "1 apple", "2 slices of pizza", or "1 cup cooked rice"
          {apiConfigured && <span className="text-green-600 ml-2">✓ API enabled</span>}
        </div>
      </Card>

      {/* Modals */}
      {showAddModal && (
        <AddMealModal
          mealType={currentMealType}
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveMeal}
        />
      )}
    </div>
  );
};

export default NutritionTracker;
