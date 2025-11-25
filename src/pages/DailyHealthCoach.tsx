import React from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import SectionHeader from '../components/SectionHeader'
import InsightCard from '../components/InsightCard'
import {
  Droplets,
  Moon,
  Footprints,
  Heart,
  CheckCircle,
  Target
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

const DailyHealthCoach = () => {
  // Sample data
  const waterData = [
    { day: 'Mon', progress: 65 },
    { day: 'Tue', progress: 80 },
    { day: 'Wed', progress: 90 },
    { day: 'Thu', progress: 75 },
    { day: 'Fri', progress: 85 },
    { day: 'Sat', progress: 95 },
    { day: 'Sun', progress: 70 }
  ]

  const stepsData = [
    { day: 'Mon', steps: 7500 },
    { day: 'Tue', steps: 8200 },
    { day: 'Wed', steps: 9100 },
    { day: 'Thu', steps: 7800 },
    { day: 'Fri', steps: 8500 },
    { day: 'Sat', steps: 9500 },
    { day: 'Sun', steps: 7000 }
  ]

  const sleepData = [
    { day: 'Mon', hours: 7.2 },
    { day: 'Tue', hours: 6.8 },
    { day: 'Wed', hours: 7.5 },
    { day: 'Thu', hours: 7.0 },
    { day: 'Fri', hours: 6.9 },
    { day: 'Sat', hours: 8.0 },
    { day: 'Sun', hours: 7.7 }
  ]

  const currentWaterIntake = 2.1 // liters
  const targetWaterIntake = 2.5
  const currentSleep = 7.5 // hours
  const targetSleep = 8
  const currentSteps = 8500
  const targetSteps = 10000

  const streakData = 12; // days
  const maxStreak = 15;
  const recommendations = [
    {
      title: 'Personalized Recommendations',
      insights: [
        {
          text: 'You\'re only 1,500 steps away from your daily goal. A short 15-minute walk will help you reach it.',
          icon: Footprints,
          aiBadge: true
        },
        {
          text: 'Going to bed 30 minutes earlier tonight can improve your sleep quality and morning energy.',
          icon: Moon,
          aiBadge: true
        },
        {
          text: 'You\'ve reached 84% of your water goal. One more glass to go!',
          icon: Droplets,
          aiBadge: true
        }
      ]
    }
  ]

  const handleMarkComplete = (activityType: string) => {
    console.log(`Marked ${activityType} as complete`)
    // Add logic to mark activity as complete
  }

  const CircleProgress: React.FC<{ progress: number; size?: number; strokeWidth?: number; color?: string }> = ({ progress, size = 120, strokeWidth = 8, color = '#14b8a6' }) => {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const strokeDasharray = `${circumference} ${circumference}`
    const strokeDashoffset = circumference - (progress / 100) * circumference

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{Math.round(progress)}%</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <SectionHeader
        title="Daily Health Coach"
        description="Track your health habits and get personalized guidance to stay on top of your wellness goals."
        actions={
          <Button className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-xl shadow-md font-medium">
            <Heart className="w-4 h-4 mr-2" />
            View Weekly Report
          </Button>
        }
      />

      {/* Trackers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Water Tracker */}
        <Card className="p-6 rounded-2xl shadow-md">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Droplets className="w-8 h-8 text-teal-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Water Intake</h3>
            </div>
            <CircleProgress progress={(currentWaterIntake / targetWaterIntake) * 100} color="#14b8a6" />
            <p className="mt-4 text-sm text-gray-600">
              {currentWaterIntake}L / {targetWaterIntake}L today
            </p>
            <Button
              className="mt-4 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg"
              onClick={() => handleMarkComplete('water')}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark Complete
            </Button>
          </div>
        </Card>

        {/* Sleep Tracker */}
        <Card className="p-6 rounded-2xl shadow-md">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Moon className="w-8 h-8 text-indigo-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Sleep Hours</h3>
            </div>
            <CircleProgress progress={(currentSleep / targetSleep) * 100} color="#6366f1" />
            <p className="mt-4 text-sm text-gray-600">
              {currentSleep}hrs / {targetSleep}hrs target
            </p>
            <Button
              className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg"
              onClick={() => handleMarkComplete('sleep')}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark Complete
            </Button>
          </div>
        </Card>

        {/* Steps Tracker */}
        <Card className="p-6 rounded-2xl shadow-md">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Footprints className="w-8 h-8 text-blue-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Daily Steps</h3>
            </div>
            <CircleProgress progress={(currentSteps / targetSteps) * 100} color="#3b82f6" />
            <p className="mt-4 text-sm text-gray-600">
              {currentSteps.toLocaleString()} / {targetSteps.toLocaleString()} steps
            </p>
            <Button
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              onClick={() => handleMarkComplete('steps')}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark Complete
            </Button>
          </div>
        </Card>
      </div>

      {/* Progress Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Water Trend */}
        <Card className="p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Water Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={waterData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line
                type="monotone"
                dataKey="progress"
                stroke="#14b8a6"
                strokeWidth={3}
                dot={{ fill: '#14b8a6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#14b8a6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Sleep Trend */}
        <Card className="p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sleep Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={sleepData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line
                type="monotone"
                dataKey="hours"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#6366f1' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Steps Trend */}
        <Card className="p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Steps Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={stepsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line
                type="monotone"
                dataKey="steps"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recommendation Cards */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Personalized Recommendations</h2>
        <InsightCard title={recommendations[0].title} insights={recommendations[0].insights} />
      </div>
    </div>
  )
}

export default DailyHealthCoach
