import React, { useState } from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { X, Search, Plus, Check, Minus } from 'lucide-react';
import { mockFoodItems, calculateFoodNutrition } from '../../utils/mockNutrition';

const AddMealModal = ({ onClose, onSave, mealType = 'Breakfast' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFoods, setSelectedFoods] = useState([]); // Array of { food, quantity }
  const [mealName, setMealName] = useState('');
  const [step, setStep] = useState('search'); // search, quantities, confirm

  // Filter foods based on search term
  const filteredFoods = searchTerm
    ? mockFoodItems.filter(food =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : mockFoodItems;

  const handleAddFood = (food, initialQuantity = 1) => {
    const existing = selectedFoods.find(item => item.food.id === food.id);

    if (existing) {
      // If already selected, increase quantity
      setSelectedFoods(prev => prev.map(item =>
        item.food.id === food.id
          ? { ...item, quantity: item.quantity + initialQuantity }
          : item
      ));
    } else {
      // Add new food item
      setSelectedFoods(prev => [...prev, { food, quantity: initialQuantity }]);
    }
  };

  const handleUpdateQuantity = (foodId, newQuantity) => {
    if (newQuantity <= 0) {
      setSelectedFoods(prev => prev.filter(item => item.food.id !== foodId));
    } else {
      setSelectedFoods(prev => prev.map(item =>
        item.food.id === foodId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const calculateMealTotals = () => {
    return selectedFoods.reduce(
      (totals, item) => ({
        calories: totals.calories + (item.food.calories * item.quantity),
        protein: totals.protein + (item.food.protein * item.quantity),
        carbs: totals.carbs + (item.food.carbs * item.quantity),
        fat: totals.fat + (item.food.fat * item.quantity),
        fiber: totals.fiber + (item.food.fiber * item.quantity),
        sodium: totals.sodium + (item.food.sodium * item.quantity)
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0 }
    );
  };

  const handleSaveMeal = () => {
    const name = mealName.trim() || `${mealType} - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const totals = calculateMealTotals();

    const meal = {
      id: `meal-${Date.now()}`,
      name,
      type: mealType,
      items: selectedFoods.map(item => ({
        ...item.food,
        quantity: item.quantity,
        mealId: `meal-${Date.now()}`
      })),
      timestamp: new Date(),
      totalCalories: Math.round(totals.calories),
      totalProtein: Math.round(totals.protein),
      totalCarbs: Math.round(totals.carbs),
      totalFat: Math.round(totals.fat),
      totalFiber: Math.round(totals.fiber),
      totalSodium: Math.round(totals.sodium)
    };

    onSave(meal);
    onClose();
  };

  const totals = calculateMealTotals();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Add {mealType} Meal
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Progress indicator */}
          <div className="flex gap-2 mb-4">
            <div className={`h-2 flex-1 rounded-full ${step === 'search' || step === 'quantities' || step === 'confirm' ? 'bg-teal-500' : 'bg-gray-200'}`}></div>
            <div className={`h-2 flex-1 rounded-full ${step === 'quantities' || step === 'confirm' ? 'bg-teal-500' : 'bg-gray-200'}`}></div>
            <div className={`h-2 flex-1 rounded-full ${step === 'confirm' ? 'bg-teal-500' : 'bg-gray-200'}`}></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {step === 'search' && (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for food items..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {filteredFoods.map(food => (
                    <div
                      key={food.id}
                      className="p-3 border border-gray-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 cursor-pointer transition-all"
                      onClick={() => handleAddFood(food)}
                    >
                      <div className="font-medium text-gray-900">{food.name}</div>
                      <div className="text-sm text-gray-600">
                        {food.calories} cal • {food.protein}g protein
                      </div>
                      <div className="text-xs text-gray-500">{food.servingSize}{food.servingSizeUnit}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(step === 'quantities' || selectedFoods.length > 0) && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Selected Foods</h3>
                  {selectedFoods.length > 0 && (
                    <Button
                      onClick={() => setStep('confirm')}
                      className="bg-teal-500 hover:bg-teal-600"
                    >
                      Continue
                    </Button>
                  )}
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {selectedFoods.map(item => (
                    <div key={item.food.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{item.food.name}</div>
                        <div className="text-sm text-gray-600">
                          {Math.round(item.food.calories * item.quantity)} cal • {Math.round(item.food.protein * item.quantity)}g protein
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.food.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center font-medium">
                          {item.quantity}x
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.food.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 'confirm' && (
              <div className="space-y-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meal Name (optional)
                  </label>
                  <input
                    type="text"
                    placeholder={`e.g. ${mealType} with ${selectedFoods[0]?.food.name || 'food'}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    value={mealName}
                    onChange={(e) => setMealName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-teal-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold text-teal-700">{Math.round(totals.calories)}</div>
                    <div className="text-xs text-gray-600">Calories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-teal-700">{Math.round(totals.protein)}g</div>
                    <div className="text-xs text-gray-600">Protein</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-teal-700">{Math.round(totals.carbs)}g</div>
                    <div className="text-xs text-gray-600">Carbs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-teal-700">{Math.round(totals.fat)}g</div>
                    <div className="text-xs text-gray-600">Fat</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setStep('quantities')}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleSaveMeal}
                    className="flex-1 bg-teal-500 hover:bg-teal-600"
                  >
                    Save Meal
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom actions */}
        {selectedFoods.length > 0 && step === 'search' && (
          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {selectedFoods.reduce((sum, item) => sum + item.quantity, 0)} items selected
              </div>
              <Button onClick={() => setStep('quantities')} className="bg-teal-500 hover:bg-teal-600">
                Customize Quantities ({Math.round(totals.calories)} cal)
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AddMealModal;
