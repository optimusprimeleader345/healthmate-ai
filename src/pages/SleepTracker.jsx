import React, { useState, useEffect } from 'react';
import { Moon, Clock, Zap, Target, TrendingUp, AlertCircle } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import {
  generateMockSleepSessions,
  generateSleepAnalytics,
  getTodaysSleepSession,
  mockSleepProfile
} from '../utils/mockSleep';

const SleepTracker = () => {
  const [currentView, setCurrentView] = useState('overview');
  const [sleepSessions, setSleepSessions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [todaySession, setTodaySession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setSleepSessions(generateMockSleepSessions(7));
      setAnalytics(generateSleepAnalytics('week'));
      setTodaySession(getTodaysSleepSession());
      setLoading(false);
    }, 500);
  }, []);

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] p-6 flex items-center justify-center">
        <div className="text-center">
          <Moon className="h-12 w-12 text-blue-400 mx-auto animate-pulse mb-4" />
          <p className="text-gray-600">Loading sleep data...</p>
        </div>
      </div>
    );
  }

  const avgMetrics = analytics ? {
    duration: `~${Math.round(analytics.averageDuration / 60)}h ${analytics.averageDuration % 60}m`,
    quality: `${analytics.averageQuality}/10`,
    efficiency: `${analytics.averageEfficiency}%`
  } : { duration: '0h 0m', quality: '0/10', efficiency: '0%' };

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Moon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sleep Tracker</h1>
            <p className="text-gray-600">Monitor and optimize your sleep quality</p>
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
            variant={currentView === 'history' ? 'default' : 'outline'}
            onClick={() => setCurrentView('history')}
          >
            History
          </Button>
          <Button
            variant={currentView === 'insights' ? 'default' : 'outline'}
            onClick={() => setCurrentView('insights')}
          >
            Insights
          </Button>
        </div>
      </div>

      {/* Profile Overview */}
      <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{mockSleepProfile.averageSleepHours}h</div>
            <div className="text-sm opacity-90">Average Sleep</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{mockSleepProfile.sleepEfficiency}%</div>
            <div className="text-sm opacity-90">Efficiency</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{mockSleepProfile.chronotype}</div>
            <div className="text-sm opacity-90">Chronotype</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-300">82%</div>
            <div className="text-sm opacity-90">Consistency</div>
          </div>
        </div>
      </Card>

      {currentView === 'overview' && (
        <>
          {/* Today's Sleep */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Moon className="h-5 w-5 text-blue-500" />
                Today's Sleep
              </h2>
              <span className="text-sm text-gray-500">
                {new Date().toLocaleDateString()}
              </span>
            </div>

            {todaySession ? (
              <div className="space-y-6">
                {/* Sleep Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <div className="text-lg font-semibold">{formatDuration(todaySession.duration)}</div>
                    <div className="text-sm text-gray-600">Total Sleep</div>
                  </div>
                  <div className="text-center">
                    <Zap className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <div className="text-lg font-semibold">{todaySession.quality}/10</div>
                    <div className="text-sm text-gray-600">Quality Score</div>
                  </div>
                  <div className="text-center">
                    <Target className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                    <div className="text-lg font-semibold">{todaySession.sleepEfficiency}%</div>
                    <div className="text-sm text-gray-600">Efficiency</div>
                  </div>
                  <div className="text-center">
                    <Moon className="h-8 w-8 mx-auto mb-2 text-indigo-500" />
                    <div className="text-lg font-semibold">{formatTime(todaySession.bedtime)}</div>
                    <div className="text-sm text-gray-600">Bedtime</div>
                  </div>
                </div>

                {/* Sleep Stages */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Sleep Stages</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded mb-1">Deep</div>
                      <span className="font-semibold">{formatDuration(todaySession.stages.deep)}</span>
                    </div>
                    <div className="text-center">
                      <div className="bg-purple-100 text-purple-800 px-3 py-2 rounded mb-1">REM</div>
                      <span className="font-semibold">{formatDuration(todaySession.stages.rem)}</span>
                    </div>
                    <div className="text-center">
                      <div className="bg-green-100 text-green-800 px-3 py-2 rounded mb-1">Light</div>
                      <span className="font-semibold">{formatDuration(todaySession.stages.light)}</span>
                    </div>
                    <div className="text-center">
                      <div className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded mb-1">Awake</div>
                      <span className="font-semibold">{formatDuration(todaySession.stages.awake)}</span>
                    </div>
                  </div>
                </div>

                {/* Heart Rate */}
                {todaySession.heartRate && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <span className="text-red-500">❤️</span>
                      Heart Rate During Sleep
                    </h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-500">{todaySession.heartRate.resting}</div>
                        <div>Average BPM</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{todaySession.heartRate.lowest}</div>
                        <div>Lowest BPM</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-400">{todaySession.heartRate.variability}</div>
                        <div>HRV Score</div>
                      </div>
                    </div>
                  </div>
                )}

                <Button className="w-full bg-indigo-500 hover:bg-indigo-600">
                  Log Sleep Session
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Moon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No sleep data for today yet.</p>
                <Button className="bg-indigo-500 hover:bg-indigo-600">
                  Start Sleep Tracking
                </Button>
              </div>
            )}
          </Card>

          {/* Weekly Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-6 w-6 text-blue-500" />
                <div>
                  <h3 className="font-semibold">Average Sleep</h3>
                  <p className="text-sm text-gray-600">Last 7 days</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600">{avgMetrics.duration}</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="h-6 w-6 text-green-500" />
                <div>
                  <h3 className="font-semibold">Sleep Quality</h3>
                  <p className="text-sm text-gray-600">Last 7 days</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600">{avgMetrics.quality}</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="h-6 w-6 text-purple-500" />
                <div>
                  <h3 className="font-semibold">Sleep Efficiency</h3>
                  <p className="text-sm text-gray-600">Last 7 days</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-purple-600">{avgMetrics.efficiency}</div>
            </Card>
          </div>
        </>
      )}

      {currentView === 'history' && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Sleep History</h2>

          <div className="space-y-4">
            {sleepSessions.map((session, index) => (
              <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">
                    {session.date.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {session.quality}/10
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDuration(session.duration)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Bedtime</div>
                    <div className="font-medium">{formatTime(session.bedtime)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Wake Time</div>
                    <div className="font-medium">{formatTime(session.wakeTime)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Efficiency</div>
                    <div className="font-medium">{session.sleepEfficiency}%</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Deep Sleep</div>
                    <div className="font-medium">{formatDuration(session.stages.deep)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {currentView === 'insights' && analytics && (
        <div className="space-y-6">
          {/* Sleep Insights */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Sleep Insights & Recommendations
            </h2>

            <div className="space-y-4">
              {analytics.trends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-semibold capitalize">{trend.metric.replace('_', ' ')} Trend</h3>
                    <p className="text-sm text-gray-600">{trend.period}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      trend.direction === 'improving' ? 'text-green-500' :
                      trend.direction === 'declining' ? 'text-red-500' :
                      'text-gray-500'
                    }`}>
                      {trend.changeRate > 0 ? '+' : ''}{trend.changeRate}
                    </div>
                    <div className="text-sm text-gray-600 capitalize">{trend.direction}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Factor Correlations */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Sleep Factor Analysis</h2>

            <div className="space-y-4">
              {analytics.correlations.map((correlation, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertCircle className={`h-5 w-5 ${
                      correlation.correlation > 0 ? 'text-green-500' : 'text-red-500'
                    }`} />
                    <div>
                      <h3 className="font-semibold capitalize">{correlation.factor}</h3>
                      <p className="text-sm text-gray-600">
                        {Math.abs(correlation.correlation) > 0.5 ? 'Strong' : 'Moderate'}
                        {correlation.correlation > 0 ? ' positive' : ' negative'} impact
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      correlation.correlation > 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {(correlation.correlation * 100).toFixed(0)}%
                    </div>
                    <div className="text-sm text-gray-600 capitalize">{correlation.confidence}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SleepTracker;
