import type { FoodItem, Meal, NutritionGoals, NutritionEntry, NutrientChartData } from '../types/nutrition';
import { nutritionixAPI } from '../services/nutritionixService';

// Mock food database
export const mockFoodItems: FoodItem[] = [
  {
    id: '1',
    name: 'Chicken Breast',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    sodium: 74,
    servingSize: '100',
    servingSizeUnit: 'g',
    category: 'Protein'
  },
  {
    id: '2',
    name: 'Brown Rice',
    calories: 111,
    protein: 2.6,
    carbs: 22.9,
    fat: 0.9,
    fiber: 1.8,
    sodium: 4,
    servingSize: '100',
    servingSizeUnit: 'g',
    category: 'Grains'
  },
  {
    id: '3',
    name: 'Broccoli',
    calories: 34,
    protein: 2.8,
    carbs: 6.6,
    fat: 0.4,
    fiber: 2.6,
    sodium: 33,
    servingSize: '100',
    servingSizeUnit: 'g',
    category: 'Vegetables'
  },
  {
    id: '4',
    name: 'Banana',
    calories: 89,
    protein: 1.1,
    carbs: 22.8,
    fat: 0.3,
    fiber: 2.6,
    sodium: 1,
    servingSize: '100',
    servingSizeUnit: 'g',
    category: 'Fruits'
  },
  {
    id: '5',
    name: 'Greek Yogurt',
    calories: 100,
    protein: 17,
    carbs: 6,
    fat: 0,
    fiber: 0,
    sodium: 55,
    servingSize: '100',
    servingSizeUnit: 'g',
    category: 'Dairy'
  },
  {
    id: '6',
    name: 'Avocado',
    calories: 234,
    protein: 2.9,
    carbs: 12.1,
    fat: 21.4,
    fiber: 10,
    sodium: 7,
    servingSize: '100',
    servingSizeUnit: 'g',
    category: 'Fruits'
  },
  {
    id: '7',
    name: 'Almonds',
    calories: 579,
    protein: 21.2,
    carbs: 21.6,
    fat: 49.4,
    fiber: 12.5,
    sodium: 1,
    servingSize: '100',
    servingSizeUnit: 'g',
    category: 'Nuts & Seeds'
  },
  {
    id: '8',
    name: 'Salmon',
    calories: 208,
    protein: 25,
    carbs: 0,
    fat: 12,
    fiber: 0,
    sodium: 59,
    servingSize: '100',
    servingSizeUnit: 'g',
    category: 'Protein'
  },
  {
    id: '9',
    name: 'Quinoa',
    calories: 120,
    protein: 4.4,
    carbs: 21.3,
    fat: 1.9,
    fiber: 2.8,
    sodium: 5,
    servingSize: '100',
    servingSizeUnit: 'g',
    category: 'Grains'
  },
  {
    id: '10',
    name: 'Spinach',
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    fiber: 2.2,
    sodium: 79,
    servingSize: '100',
    servingSizeUnit: 'g',
    category: 'Vegetables'
  }
];

// Mock default nutrition goals
export const mockNutritionGoals: NutritionGoals = {
  id: 'user-goals-1',
  dailyCalories: 2000,
  dailyProtein: 150,
  dailyCarbs: 200,
  dailyFat: 65,
  dailyFiber: 25,
  dailySodium: 2300,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date()
};

// Generate sample meals for today
export const generateSampleMeals = (): Meal[] => {
  const today = new Date();

  return [
    {
      id: 'meal-1',
      name: 'Greek Yogurt Parfait',
      type: 'Breakfast',
      items: [
        { ...mockFoodItems[4], quantity: 1.5, mealId: 'meal-1' }, // Greek Yogurt 150g
        { ...mockFoodItems[3], quantity: 1, mealId: 'meal-1' },   // Banana 100g
        { ...mockFoodItems[6], quantity: 0.2, mealId: 'meal-1' }  // Almonds 20g
      ],
      timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 0),
      totalCalories: Math.round(100 * 1.5 + 89 * 1 + 579 * 0.2),
      totalProtein: Math.round(17 * 1.5 + 1.1 * 1 + 21.2 * 0.2),
      totalCarbs: Math.round(6 * 1.5 + 22.8 * 1 + 21.6 * 0.2),
      totalFat: Math.round(0 * 1.5 + 0.3 * 1 + 49.4 * 0.2),
      totalFiber: Math.round(0 * 1.5 + 2.6 * 1 + 12.5 * 0.2),
      totalSodium: Math.round(55 * 1.5 + 1 * 1 + 1 * 0.2)
    },
    {
      id: 'meal-2',
      name: 'Grilled Chicken Salad',
      type: 'Lunch',
      items: [
        { ...mockFoodItems[0], quantity: 1.5, mealId: 'meal-2' }, // Chicken Breast 150g
        { ...mockFoodItems[2], quantity: 2, mealId: 'meal-2' },   // Broccoli 200g
        { ...mockFoodItems[9], quantity: 1, mealId: 'meal-2' }    // Spinach 100g
      ],
      timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 0),
      totalCalories: Math.round(165 * 1.5 + 34 * 2 + 23 * 1),
      totalProtein: Math.round(31 * 1.5 + 2.8 * 2 + 2.9 * 1),
      totalCarbs: Math.round(0 * 1.5 + 6.6 * 2 + 3.6 * 1),
      totalFat: Math.round(3.6 * 1.5 + 0.4 * 2 + 0.4 * 1),
      totalFiber: Math.round(0 * 1.5 + 2.6 * 2 + 2.2 * 1),
      totalSodium: Math.round(74 * 1.5 + 33 * 2 + 79 * 1)
    },
    {
      id: 'meal-3',
      name: 'Salmon with Quinoa',
      type: 'Dinner',
      items: [
        { ...mockFoodItems[7], quantity: 1.2, mealId: 'meal-3' }, // Salmon 120g
        { ...mockFoodItems[8], quantity: 1, mealId: 'meal-3' },   // Quinoa 100g
        { ...mockFoodItems[5], quantity: 0.5, mealId: 'meal-3' }  // Avocado 50g
      ],
      timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 19, 0),
      totalCalories: Math.round(208 * 1.2 + 120 * 1 + 234 * 0.5),
      totalProtein: Math.round(25 * 1.2 + 4.4 * 1 + 2.9 * 0.5),
      totalCarbs: Math.round(0 * 1.2 + 21.3 * 1 + 12.1 * 0.5),
      totalFat: Math.round(12 * 1.2 + 1.9 * 1 + 21.4 * 0.5),
      totalFiber: Math.round(0 * 1.2 + 2.8 * 1 + 10 * 0.5),
      totalSodium: Math.round(59 * 1.2 + 5 * 1 + 7 * 0.5)
    },
    {
      id: 'meal-4',
      name: 'Evening Snack',
      type: 'Snacks',
      items: [
        { ...mockFoodItems[6], quantity: 0.3, mealId: 'meal-4' },  // Almonds 30g
        { ...mockFoodItems[3], quantity: 0.5, mealId: 'meal-4' }   // Banana 50g
      ],
      timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 0),
      totalCalories: Math.round(579 * 0.3 + 89 * 0.5),
      totalProtein: Math.round(21.2 * 0.3 + 1.1 * 0.5),
      totalCarbs: Math.round(21.6 * 0.3 + 22.8 * 0.5),
      totalFat: Math.round(49.4 * 0.3 + 0.3 * 0.5),
      totalFiber: Math.round(12.5 * 0.3 + 2.6 * 0.5),
      totalSodium: Math.round(1 * 0.3 + 1 * 0.5)
    }
  ];
};

// Generate nutrition entry for a specific date
export const generateNutritionEntry = (date?: Date): NutritionEntry => {
  const targetDate = date || new Date();
  const meals = generateSampleMeals();

  const totals = meals.reduce((acc, meal) => ({
    calories: acc.calories + meal.totalCalories,
    protein: acc.protein + meal.totalProtein,
    carbs: acc.carbs + meal.totalCarbs,
    fat: acc.fat + meal.totalFat,
    fiber: acc.fiber + meal.totalFiber,
    sodium: acc.sodium + meal.totalSodium
  }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0 });

  const goals = mockNutritionGoals;

  return {
    id: `entry-${targetDate.toISOString().split('T')[0]}`,
    date: targetDate.toISOString().split('T')[0],
    meals,
    totals,
    goals,
    goalAchieved: {
      calories: totals.calories <= goals.dailyCalories,
      protein: totals.protein <= goals.dailyProtein,
      carbs: totals.carbs <= goals.dailyCarbs,
      fat: totals.fat <= goals.dailyFat,
      fiber: totals.fiber >= goals.dailyFiber
    },
    createdAt: targetDate,
    updatedAt: targetDate
  };
};

// Generate chart data for the past week
export const generateWeeklyNutritionData = (): NutrientChartData[] => {
  const data: NutrientChartData[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const entry = generateNutritionEntry(date);
    data.push({
      date: entry.date,
      calories: entry.totals.calories,
      protein: entry.totals.protein,
      carbs: entry.totals.carbs,
      fat: entry.totals.fat,
      goalCalories: entry.goals.dailyCalories,
      goalProtein: entry.goals.dailyProtein
    });
  }

  return data;
};

// Search food items by name (with API integration)
export const searchFoodItems = async (query: string): Promise<{ mock: FoodItem[], api?: FoodItem[], fromAPI: boolean }> => {
  const lowercaseQuery = query?.toLowerCase().trim() || '';

  // Always return mock results as fallback
  const mockResults = lowercaseQuery
    ? mockFoodItems.filter(food => food.name.toLowerCase().includes(lowercaseQuery))
    : mockFoodItems.slice(0, 20); // Return first 20 if no query

  try {
    // Try API if configured and query is meaningful
    if (nutritionixAPI.isConfigured() && lowercaseQuery.length >= 2) {
      const apiResponse = await nutritionixAPI.naturalLanguageQuery(lowercaseQuery);

      if (apiResponse.success && apiResponse.data?.foods) {
        // Convert API results to our FoodItem format
        const apiResults = apiResponse.data.foods.map((item: any) => ({
          id: item.nix_item_id || item.food_name || `api_${Date.now()}_${Math.random()}`,
          name: item.food_name || item.brand_name || 'Unknown Food',
          calories: item.nf_calories || 0,
          protein: item.nf_protein || 0,
          carbs: item.nf_total_carbohydrates || 0,
          fat: item.nf_total_fat || 0,
          fiber: item.nf_dietary_fiber || 0,
          sodium: item.nf_sodium || 0,
          servingSize: item.serving_qty ? item.serving_qty.toString() : '1',
          servingSizeUnit: item.serving_unit || 'serving',
          category: item.nix_brand_name || 'General'
        }));

        return {
          mock: mockResults,
          api: apiResults,
          fromAPI: true
        };
      }
    }

    // Return mock results if API fails or not configured
    console.log('Using mock food data - API not available or query invalid');
    return {
      mock: mockResults,
      fromAPI: false
    };

  } catch (error) {
    console.warn('Food search API error, using mock data:', error);
    return {
      mock: mockResults,
      fromAPI: false
    };
  }
};

// Deprecated synchronous version (kept for backward compatibility)
export const searchFoodItemsSync = (query: string): FoodItem[] => {
  if (!query) return mockFoodItems;
  return mockFoodItems.filter(food =>
    food.name.toLowerCase().includes(query.toLowerCase())
  );
};

// Calculate nutrition totals for food items with quantities
export const calculateFoodNutrition = (items: Array<{ food: FoodItem; quantity: number }>) => {
  return items.reduce((totals, item) => ({
    calories: totals.calories + (item.food.calories * item.quantity),
    protein: totals.protein + (item.food.protein * item.quantity),
    carbs: totals.carbs + (item.food.carbs * item.quantity),
    fat: totals.fat + (item.food.fat * item.quantity),
    fiber: totals.fiber + (item.food.fiber * item.quantity),
    sodium: totals.sodium + (item.food.sodium * item.quantity)
  }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0 });
};
