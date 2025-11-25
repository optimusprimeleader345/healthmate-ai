import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Heart, Droplet, Moon, Zap } from 'lucide-react';
import { Card } from '../components/Card';
import PremiumFeatureGate from '../components/PremiumFeatureGate';

// Mock calendar data generator
const generateCalendarData = (month, year) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const data = {};
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    data[dateKey] = {
      activities: [],
      completionRate: Math.random() * 100,
      goalsMet: Math.floor(Math.random() * 4),
      totalGoals: 4
    };

    // Add random health activities
    const activities = ['medication', 'workout', 'sleep', 'water', 'heart', 'meal'];
    const activityIcons = {
      medication: '💊',
      workout: '🏃‍♀️',
      sleep: '😴',
      water: '💧',
      heart: '❤️',
      meal: '🍽️'
    };

    // Add 1-4 activities per day
    const numActivities = Math.floor(Math.random() * 4) + 1;
    for (let i = 0; i < numActivities; i++) {
      const activity = activities[Math.floor(Math.random() * activities.length)];
      if (!data[dateKey].activities.includes(activity)) {
        data[dateKey].activities.push(activity);
      }
    }

    data[dateKey].activities = data[dateKey].activities.slice(0, 4); // Max 4 activities per day
  }

  return data;
};

const CalendarDashboard = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const data = generateCalendarData(month, year);
      setCalendarData(data);
      setLoading(false);
    }, 300);
  }, [month, year]);

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(year, month + direction, 1));
    setSelectedDate(null);
  };

  const getActivityIcon = (activity) => {
    const icons = {
      medication: '💊',
      workout: '⚡',
      sleep: '😴',
      water: '💧',
      heart: '❤️',
      meal: '🍽️'
    };
    return icons[activity] || '📅';
  };

  const getCompletionRing = (completionRate) => {
    const circumference = 2 * Math.PI * 15;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (completionRate / 100) * circumference;

    return {
      strokeDasharray,
      strokeDashoffset,
      r: 15,
      cx: 16,
      cy: 16
    };
  };

  const renderCalendarGrid = () => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const rows = [];
    let day = 1;

    for (let week = 0; week < 6; week++) {
      const weekRow = [];
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        if ((week === 0 && dayOfWeek < firstDay) || day > daysInMonth) {
          weekRow.push(<td key={dayOfWeek} className="p-1"></td>);
        } else {
          const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayData = calendarData[dateKey] || { activities: [], completionRate: 0, goalsMet: 0, totalGoals: 4 };
          const isSelected = selectedDate === dateKey;
          const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

          weekRow.push(
            <td key={dayOfWeek} className="p-1">
              <button
                onClick={() => setSelectedDate(dateKey)}
                className={`relative w-full aspect-square flex flex-col items-center justify-center rounded-lg border-2 transition-all hover:scale-105 ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50 shadow-md'
                    : isToday
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <span className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                  {day}
                </span>

                {/* Activity indicators */}
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
                  {dayData.activities.slice(0, 2).map((activity, index) => (
                    <span key={index} className="w-1.5 h-1.5 rounded-full text-xs">
                      {getActivityIcon(activity)}
                    </span>
                  ))}
                  {dayData.activities.length > 2 && (
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full flex items-center justify-center text-xs">•</span>
                  )}
                </div>

                {/* Completion ring */}
                <svg className="absolute inset-0 w-8 h-8 -rotate-90" viewBox="0 0 32 32">
                  <circle
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                    r="15"
                    cx="16"
                    cy="16"
                  />
                  <circle
                    fill="none"
                    stroke={dayData.completionRate > 80 ? '#10b981' : dayData.completionRate > 60 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="3"
                    strokeLinecap="round"
                    {...getCompletionRing(dayData.completionRate)}
                  />
                </svg>
              </button>
            </td>
          );
          day++;
        }
      }
      rows.push(<tr key={week}>{weekRow}</tr>);
      if (day > daysInMonth) break;
    }

    return rows;
  };

  const selectedDateData = selectedDate ? calendarData[selectedDate] : null;

  return (
    <PremiumFeatureGate
      feature="calendarDashboard"
      upgradeMessage="Unlock the visual Calendar Dashboard to track all your health activities in one beautiful month view, just like Apple Fitness."
    >
      <div className="min-h-screen bg-[#F5F7FA] p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Health Calendar</h1>
            <p className="text-gray-600">Track your health activities across the month</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Grid */}
          <div className="lg:col-span-2">
            <Card className={`p-6 ${loading ? 'opacity-50' : ''}`}>
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  disabled={loading}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <h2 className="text-xl font-bold text-gray-900">
                  {monthNames[month]} {year}
                </h2>

                <button
                  onClick={() => navigateMonth(1)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  disabled={loading}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Calendar */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      {dayNames.map(day => (
                        <th key={day} className="p-2 text-sm font-medium text-gray-600 border-b">
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {renderCalendarGrid()}
                  </tbody>
                </table>
              </div>

              {/* Legend */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Activity Legend</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span>💊</span>
                    <span>Medication</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>⚡</span>
                    <span>Workout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>😴</span>
                    <span>Sleep</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>💧</span>
                    <span>Water</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>❤️</span>
                    <span>Vitals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🍽️</span>
                    <span>Meals</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Details Panel */}
          <div>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedDate ?
                  new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  }) :
                  'Select a date'
                }
              </h3>

              {selectedDate && selectedDateData ? (
                <div className="space-y-4">
                  {/* Completion Summary */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Daily Goals</span>
                      <span className="text-lg font-bold text-green-600">
                        {selectedDateData.goalsMet}/{selectedDateData.totalGoals}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                        style={{ width: `${(selectedDateData.goalsMet / selectedDateData.totalGoals) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {Math.round((selectedDateData.goalsMet / selectedDateData.totalGoals) * 100)}% completed
                    </p>
                  </div>

                  {/* Activities List */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Activities Completed</h4>
                    <div className="space-y-2">
                      {selectedDateData.activities.map((activity, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                          <span className="text-lg">{getActivityIcon(activity)}</span>
                          <span className="text-sm capitalize font-medium">{activity}</span>
                          <span className="ml-auto text-green-600">✓</span>
                        </div>
                      ))}
                      {selectedDateData.activities.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4">
                          No activities recorded
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Health Insights */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Health Insights</h4>
                    <div className="space-y-2 text-sm">
                      {selectedDateData.completionRate > 80 && (
                        <div className="flex items-center gap-2 text-green-700">
                          <Zap className="h-4 w-4" />
                          <span>Excellent day! All goals achieved</span>
                        </div>
                      )}
                      {selectedDateData.activities.includes('workout') && (
                        <div className="flex items-center gap-2 text-blue-700">
                          <Zap className="h-4 w-4" />
                          <span>Great workout session completed!</span>
                        </div>
                      )}
                      {selectedDateData.activities.includes('sleep') && (
                        <div className="flex items-center gap-2 text-purple-700">
                          <Moon className="h-4 w-4" />
                          <span>Quality sleep logged</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-sm">
                    Click on any date to view detailed health activities and progress
                  </p>
                </div>
              )}
            </Card>

            {/* Monthly Stats */}
            <Card className="p-6 mt-6">
              <h4 className="font-medium text-gray-900 mb-4">Monthly Overview</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Perfect Days</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Activities</span>
                  <span className="font-medium">186</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg. Completion</span>
                  <span className="font-medium">78%</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Streaks</span>
                  <span className="font-medium">5 days</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PremiumFeatureGate>
  );
};

export default CalendarDashboard;
