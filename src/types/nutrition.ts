export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
  servingSize: string;
  servingSizeUnit?: string;
  category?: string;
}

export interface MealItem extends FoodItem {
  quantity: number; // multiplier for serving size
  mealId: string;
}

export interface Meal {
  id: string;
  name: string;
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  items: MealItem[];
  timestamp: Date;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  totalSodium: number;
}

export interface NutritionGoals {
  id: string;
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
  dailyFiber: number;
  dailySodium: number;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NutritionEntry {
  id: string;
  date: string; // YYYY-MM-DD format
  meals: Meal[];
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sodium: number;
  };
  goals: NutritionGoals;
  goalAchieved: {
    calories: boolean;
    protein: boolean;
    carbs: boolean;
    fat: boolean;
    fiber: boolean;
  };
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NutritionStats {
  period: 'day' | 'week' | 'month';
  averageCalories: number;
  totalCalories: number;
  averageProtein: number;
  averageCarbs: number;
  averageFat: number;
  goalAchievementRate: number;
  mostCommonFoods: Array<{ name: string; count: number }>;
  macronutrientDistribution: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

// Chart data interfaces
export interface NutrientChartData {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  goalCalories?: number;
  goalProtein?: number;
}

export interface MealTypeChartData {
  type: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}
