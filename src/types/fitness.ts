export interface FitnessGoal {
  id: string;
  name: string;
  type: 'weight_loss' | 'weight_gain' | 'muscle_building' | 'endurance' | 'general_fitness';
  targetValue: number; // e.g., target weight, hours per week
  currentValue: number;
  unit: string; // kg, lbs, hours, sessions, etc.
  deadline: Date;
  active: boolean;
}

export interface WorkoutSession {
  id: string;
  name: string;
  type: 'cardio' | 'strength' | 'flexibility' | 'sports' | 'mixed';
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: FitnessExercise[];
  caloriesBurned: number;
  completedDate: Date;
  workoutQuality: number; // 1-10 rating
  notes?: string;
}

export interface FitnessExercise {
  id: string;
  name: string;
  category: string; // e.g., 'cardio', 'strength', 'core'
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number; // for time-based exercises
  distance?: number; // for cardio
  restTime?: number; // seconds between sets
  equipment?: string[];
  instructions: string;
  targetMuscles: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface WeeklyPlan {
  id: string;
  weekStart: Date;
  goalId: string;
  sessions: DailyWorkoutPlan[];
  totalCalories: number;
  totalDuration: number;
  aiInsights: AIWorkoutInsight[];
}

export interface DailyWorkoutPlan {
  id: string;
  date: Date;
  sessions: FitnessExercise[];
  totalDuration: number;
  totalCalories: number;
  dayOfWeek: string;
  completed: boolean;
  completedAt?: Date;
}

export interface FitnessProfile {
  id: string;
  userId: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // cm
  weight: number; // kg
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  experience: number; // years
  medicalConditions?: string[];
  equipment: string[]; // available equipment
  weeklyTake: number; // available workout days per week
  preferences: {
    workoutTypes: string[]; // preferred workout types
    sessionDuration: number; // preferred session length
    timeSlots: string[]; // preferred time slots
    intensity: 'low' | 'medium' | 'high';
  };
}

export interface WorkoutProgress {
  date: Date;
  completedSessions: number;
  totalSessions: number;
  caloriesBurned: number;
  totalDuration: number;
  averageQuality: number;
}

export interface AIWorkoutInsight {
  id: string;
  type: 'difficulty_adjustment' | 'equipment_recommendation' | 'recovery_advice' | 'form_improvement';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  generatedAt: Date;
}

export interface ExerciseLibraryItem {
  id: string;
  name: string;
  category: string;
  type: 'strength' | 'cardio' | 'flexibility';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  targetMuscles: string[];
  instructions: string;
  videoUrl?: string;
  images?: string[];
  tips: string[];
  caloriesPerMinute?: number;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  type: 'full_body' | 'upper_body' | 'lower_body' | 'cardio' | 'core' | 'flexibility';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // estimated duration in minutes
  exercises: ExerciseTemplateItem[];
  tags: string[];
  suitableFor: string[]; // beginner, weight_loss, muscle_gain, etc.
}

export interface ExerciseTemplateItem {
  exerciseId: string;
  sets: number;
  reps?: number;
  weightSuggestion?: string;
  duration?: number;
  restTime: number;
  order: number; // order in the workout
}

export interface FitnessAnalytics {
  period: 'week' | 'month' | 'quarter';
  startDate: Date;
  endDate: Date;
  totalWorkouts: number;
  totalDuration: number; // minutes
  totalCalories: number;
  averageSessionsPerWeek: number;
  mostFrequentExerciseType: string;
  consistencyScore: number; // 0-100
  progressTowardsGoals: GoalProgress[];
  strengthGains: ExerciseProgress[];
  trends: FitnessTrend[];
}

export interface GoalProgress {
  goalId: string;
  goalName: string;
  progress: number; // percentage
  startValue: number;
  currentValue: number;
  targetValue: number;
  daysRemaining: number;
  projectedCompletion?: Date;
}

export interface ExerciseProgress {
  exerciseName: string;
  lastWeight?: number;
  maxWeight?: number;
  lastSets?: number;
  lastReps?: number;
  improvementRate: number; // percentage improvement over time
}

export interface FitnessTrend {
  metric: string;
  trend: 'improving' | 'declining' | 'stable';
  changeRate: number; // percentage
  confidence: 'low' | 'medium' | 'high';
}
