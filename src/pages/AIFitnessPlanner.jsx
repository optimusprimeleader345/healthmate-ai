import React, { useState, useEffect } from 'react';
import { Activity, Target, TrendingUp, Dumbbell, Clock, Flame, Award, Bot } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import {
  mockFitnessProfile,
  generateWeeklyPlan,
  generateWorkoutProgress,
  generateFitnessAnalytics,
  generateAIInsights,
  mockFitnessGoals,
  mockExerciseLibrary
} from '../utils/mockFitness';

const AIFitnessPlanner = () => {
  const [currentView, setCurrentView] = useState('overview');
  const [weeklyPlan, setWeeklyPlan] = useState(null);
  const [progress, setProgress] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    // Initialize fitness data
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Start of week

    setWeeklyPlan(generateWeeklyPlan('goal-1', weekStart));
    setProgress(generateWorkoutProgress(7));
    setAnalytics(generateFitnessAnalytics('week'));
    setInsights(generateAIInsights());
  }, []);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todaysSession = weeklyPlan?.sessions.find(session =>
    session.dayOfWeek === today
  );

  const progressStats = {
    thisWeek: progress.slice(-7),
    totalWorkouts: progress.reduce((sum, p) => sum + p.completedSessions, 0),
    totalCalories: progress.reduce((sum, p) => sum + p.caloriesBurned, 0),
    averageQuality: Math.round(progress.reduce((sum, p) => sum + p.averageQuality, 0) / progress.length),
    weeklyGoal: mockFitnessProfile.weeklyTake
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Bot className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Fitness Planner</h1>
            <p className="text-gray-600">Personalized workout plans powered by AI</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={currentView === 'overview' ? 'default' : 'outline'}
            onClick={() => setCurrentView('overview')}
          >
            Overview
          </Button>
          <Button
            variant={currentView === 'plan' ? 'default' : 'outline'}
            onClick={() => setCurrentView('plan')}
          >
            Weekly Plan
          </Button>
          <Button
            variant={currentView === 'analytics' ? 'default' : 'outline'}
            onClick={() => setCurrentView('analytics')}
          >
            Analytics
          </Button>
        </div>
      </div>

      {/* Profile Banner */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{mockFitnessProfile.fitnessLevel}</div>
            <div className="text-sm opacity-90">Fitness Level</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{progressStats.totalWorkouts}</div>
            <div className="text-sm opacity-90">This Week</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{progressStats.totalCalories}</div>
            <div className="text-sm opacity-90">Calories Burned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{progressStats.averageQuality}/10</div>
            <div className="text-sm opacity-90">Average Quality</div>
          </div>
        </div>
      </Card>

      {currentView === 'overview' && (
        <>
          {/* Today's Workout */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Today's Workout</h2>
              <div className="text-sm text-gray-500">{today}</div>
            </div>

            {todaysSession ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <Clock className="h-6 w-6 mx-auto mb-1 text-blue-500" />
                    <div className="text-lg font-semibold">{todaysSession.totalDuration}min</div>
                    <div className="text-sm text-gray-500">Duration</div>
                  </div>
                  <div className="text-center">
                    <Flame className="h-6 w-6 mx-auto mb-1 text-orange-500" />
                    <div className="text-lg font-semibold">{todaysSession.totalCalories}cal</div>
                    <div className="text-sm text-gray-500">Calories</div>
                  </div>
                  <div className="text-center">
                    <Dumbbell className="h-6 w-6 mx-auto mb-1 text-green-500" />
                    <div className="text-lg font-semibold">{todaysSession.sessions.length}</div>
                    <div className="text-sm text-gray-500">Exercises</div>
                  </div>
                </div>

                <div className="space-y-2">
                  {todaysSession.sessions.map((exercise, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{exercise.name}</div>
                        <div className="text-sm text-gray-500">
                          Target: {exercise.targetMuscles.join(', ')} • {exercise.type}
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        {exercise.sets ? `${exercise.sets} sets` : ''}
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="w-full bg-green-500 hover:bg-green-600">
                  {todaysSession.completed ? '✓ Workout Completed' : 'Start Workout'}
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <Activity className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">Rest day! Your body needs recovery.</p>
              </div>
            )}
          </Card>

          {/* AI Insights */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bot className="h-5 w-5 text-blue-500" />
              <h2 className="text-xl font-semibold">AI Workout Insights</h2>
            </div>

            <div className="space-y-3">
              {insights.map((insight) => (
                <div key={insight.id} className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-blue-900">{insight.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${
                      insight.priority === 'high' ? 'bg-red-100 text-red-700' :
                      insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {insight.priority}
                    </span>
                  </div>
                  <p className="text-sm text-blue-800 mb-3">{insight.description}</p>
                  {insight.actionable && (
                    <Button size="sm" variant="outline" className="text-blue-600 border-blue-300">
                      Take Action
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Goals Progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-green-500" />
                <h2 className="text-xl font-semibold">Active Goals</h2>
              </div>

              <div className="space-y-4">
                {mockFitnessGoals.map((goal) => (
                  <div key={goal.id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{goal.name}</span>
                      <span className="text-sm text-gray-500">
                        {goal.currentValue}/{goal.targetValue} {goal.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${Math.min((goal.currentValue / goal.targetValue) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Deadline: {goal.deadline.toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                <h2 className="text-xl font-semibold">Weekly Progress</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{progressStats.weeklyGoal}</div>
                  <div className="text-sm text-gray-600">Target Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{progressStats.totalWorkouts}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{Math.round(progressStats.totalCalories / 7)}</div>
                  <div className="text-sm text-gray-600">Avg/Day</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{progressStats.averageQuality}/10</div>
                  <div className="text-sm text-gray-600">Quality</div>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}

      {currentView === 'plan' && weeklyPlan && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Weekly Workout Plan</h2>
            <div className="text-sm text-gray-500">
              {weeklyPlan.totalDuration}min • {weeklyPlan.totalCalories}cal
            </div>
          </div>

          <div className="space-y-4">
            {weeklyPlan.sessions.map((session) => (
              <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{session.dayOfWeek}</h3>
                  {session.completed ? (
                    <span className="text-green-600 font-medium">✓ Completed</span>
                  ) : (
                    <span className="text-blue-600 font-medium">Scheduled</span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-500" />
                    {session.totalDuration} min
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame className="h-4 w-4 text-gray-500" />
                    {session.totalCalories} cal
                  </div>
                  <div className="flex items-center gap-1">
                    <Dumbbell className="h-4 w-4 text-gray-500" />
                    {session.sessions.length} exercises
                  </div>
                </div>

                <div className="space-y-2">
                  {session.sessions.slice(0, 2).map((exercise, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      • {exercise.name}
                    </div>
                  ))}
                  {session.sessions.length > 2 && (
                    <div className="text-sm text-gray-500">
                      +{session.sessions.length - 2} more exercises
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {currentView === 'analytics' && analytics && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Fitness Analytics</h2>
              <div className="text-sm text-gray-500">{analytics.period} view</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{analytics.totalWorkouts}</div>
                <div className="text-sm text-gray-600">Total Workouts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{analytics.totalDuration}</div>
                <div className="text-sm text-gray-600">Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{analytics.totalCalories}</div>
                <div className="text-sm text-gray-600">Calories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{analytics.consistencyScore}%</div>
                <div className="text-sm text-gray-600">Consistency</div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Goal Progress</h3>
              <div className="space-y-4">
                {analytics.progressTowardsGoals.map((goalProgress) => (
                  <div key={goalProgress.goalId}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{goalProgress.goalName}</span>
                      <span className="text-sm text-gray-500">
                        {goalProgress.progress.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${goalProgress.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Strength Progress</h3>
              <div className="space-y-4">
                {analytics.strengthGains.map((gain) => (
                  <div key={gain.exerciseName} className="flex items-center justify-between">
                    <span className="font-medium">{gain.exerciseName}</span>
                    <span className="text-green-600 font-semibold">
                      +{gain.improvementRate}%
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIFitnessPlanner;
