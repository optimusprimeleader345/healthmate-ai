import React, { useState } from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import ReportCard from '../components/ReportCard'
import PredictionChart from '../components/PredictionChart'
import ForecastCard from '../components/ForecastCard'
import CorrelationMatrix from '../components/CorrelationMatrix'
import RiskSummary from '../components/RiskSummary'
import { predictSleepTrend, predictHydrationTrend, predictStressTrend } from '../ml/predictionModels'
import { pearsonCorrelation, correlationInsight } from '../analytics/correlationEngine'
import { detectAllAnomalies } from '../analytics/anomalyDetection'
import AnomalyHeatmap from '../components/AnomalyHeatmap'
import reportService from '../services/reportService'
import pdfReportGenerator from '../utils/pdfReportGenerator'
import {
  TrendingUp,
  TrendingDown,
  Brain,
  Activity,
  Heart,
  AlertTriangle,
  FileText,
  PieChart as PieChartIcon,
  Calendar
} from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

const ReportsAnalytics = () => {
  // Prediction Insights Data
  const predictions = [
    {
      title: 'Cardiovascular Risk',
      value: 15,
      change: -3,
      icon: Heart,
      status: 'Low Risk',
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Diabetes Prediction',
      value: 22,
      change: 2,
      icon: Activity,
      status: 'Medium Risk',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Mental Health Score',
      value: 78,
      change: 5,
      icon: Brain,
      status: 'Excellent',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Allergy Risk',
      value: 8,
      change: 1,
      icon: AlertTriangle,
      status: 'Low Risk',
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    }
  ]

  const trendData = [
    { month: 'Jan', cardiovascular: 18, diabetes: 25, mental: 72 },
    { month: 'Feb', cardiovascular: 16, diabetes: 23, mental: 75 },
    { month: 'Mar', cardiovascular: 15, diabetes: 22, mental: 77 },
    { month: 'Apr', cardiovascular: 14, diabetes: 21, mental: 78 },
    { month: 'May', cardiovascular: 13, diabetes: 20, mental: 79 },
    { month: 'Jun', cardiovascular: 12, diabetes: 19, mental: 80 }
  ]

  const riskData = [
    { day: 'Mon', risk: 12 },
    { day: 'Tue', risk: 15 },
    { day: 'Wed', risk: 18 },
    { day: 'Thu', risk: 14 },
    { day: 'Fri', risk: 9 },
    { day: 'Sat', risk: 16 },
    { day: 'Sun', risk: 13 }
  ]

  // Analytics Dashboard Data
  const metrics = [
    { title: 'Total Check-ups', value: 127, icon: Activity, color: 'text-primary-500' },
    { title: 'Risk Alerts', value: 8, icon: AlertTriangle, color: 'text-red-500' },
    { title: 'Health Improvements', value: 23, icon: TrendingUp, color: 'text-green-500' },
    { title: 'Reports Generated', value: 45, icon: FileText, color: 'text-blue-500' }
  ]

  const healthBreakdownData = [
    { condition: 'Cardiovascular', count: 25, risk: 'Low' },
    { condition: 'Diabetes', count: 18, risk: 'Medium' },
    { condition: 'Mental Health', count: 35, risk: 'Low' },
    { condition: 'Respiratory', count: 22, risk: 'Low' },
    { condition: 'Nutrition', count: 27, risk: 'High' }
  ]

  // Health Distribution Data for Pie Chart
  const healthDistribution = [
    { name: 'Excellent', value: 35, color: '#10b981' },
    { name: 'Good', value: 45, color: '#3b82f6' },
    { name: 'Fair', value: 15, color: '#f59e0b' },
    { name: 'Poor', value: 5, color: '#ef4444' }
  ]

  // Reports List Data
  const reports = [
    {
      id: 1,
      title: 'Annual Health Assessment 2025',
      date: 'Jan 15, 2025',
      type: 'Comprehensive Report',
      size: '2.3 MB',
      pages: 12
    },
    {
      id: 2,
      title: 'Cardiovascular Risk Analysis',
      date: 'Dec 28, 2024',
      type: 'Specialized Report',
      size: '1.8 MB',
      pages: 8
    },
    {
      id: 3,
      title: 'Mental Health Evaluation',
      date: 'Nov 10, 2024',
      type: 'Assessment Report',
      size: '3.1 MB',
      pages: 15
    },
    {
      id: 4,
      title: 'Nutrition & Lifestyle Report',
      date: 'Oct 22, 2024',
      type: 'Lifestyle Report',
      size: '2.5 MB',
      pages: 10
    }
  ]

  const handleDownload = (report) => {
    console.log(`Downloading ${report.title}`)
    // Add download logic here
  }

  // ML Prediction Data
  const sleepPrediction = predictSleepTrend()
  const hydrationPrediction = predictHydrationTrend()
  const stressPrediction = predictStressTrend()

  // Correlation Data
  const sleepData = [8, 7.5, 8.2, 6.8, 7.9, 9, 8.5]
  const stressData = [4, 6, 5, 7, 5, 3, 4]
  const stepsData = [10000, 9500, 10500, 8000, 10200, 11000, 9800]
  const moodData = [7, 6, 8, 5, 7, 9, 6]
  const hydrationData = [2.1, 2.4, 2.0, 2.5, 2.3, 2.8, 2.6]
  const fatigueData = [6, 7, 5, 8, 6, 4, 5]

  const correlationMetrics = ['Sleep', 'Stress', 'Steps', 'Mood', 'Hydration', 'Fatigue']
  const datasets = [sleepData, stressData, stepsData, moodData, hydrationData, fatigueData]

  // Compute full correlation matrix
  const matrix = Array(6).fill(null).map(() => Array(6).fill(0))
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      if (i === j) {
        matrix[i][j] = 1.0 // Perfect correlation with itself
      } else {
        matrix[i][j] = pearsonCorrelation(datasets[i], datasets[j])
      }
    }
  }

  const fullCorrelationMatrix = {
    metrics: correlationMetrics,
    matrix: matrix
  }

  // mock user data
  const sleepSample = [7, 6.5, 6, 7.2, 6.8, 7, 7.1];
  const stressSample = [2, 3, 4, 3.5, 4, 3, 2.8];
  const hydrationSample = [2.0, 1.6, 1.2, 1.8, 2.1, 1.5, 1.7];
  const stepsSample = [3000, 4500, 2000, 3500, 3800, 2800, 3100];

  // compute correlations
  const corrSleepStress = pearsonCorrelation(sleepSample, stressSample);
  const corrHydrationFatigue = pearsonCorrelation(hydrationSample, sleepSample);
  const corrStepsMood = pearsonCorrelation(stepsSample, stressSample);

  // build matrix
  const relationMatrix = [
    { pair: "Sleep vs Stress", value: corrSleepStress, insight: correlationInsight("Sleep", "Stress", corrSleepStress) },
    { pair: "Hydration vs Fatigue", value: corrHydrationFatigue, insight: correlationInsight("Hydration", "Fatigue", corrHydrationFatigue) },
    { pair: "Steps vs Mood", value: corrStepsMood, insight: correlationInsight("Steps", "Mood", corrStepsMood) }
  ];

  const mockData = {
    sleep: sleepSample,
    hydration: hydrationSample,
    stress: stressSample,
    steps: stepsSample
  };
  const anomaliesReport = detectAllAnomalies(mockData);
  const totalAnomalies = anomaliesReport.sleep.zAnomalies.length + anomaliesReport.hydration.zAnomalies.length + anomaliesReport.stress.zAnomalies.length + anomaliesReport.steps.zAnomalies.length;

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-2">
          Comprehensive health insights and downloadable reports for your wellness journey.
        </p>
      </div>

      {/* Risk Overview */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Risk Overview</h2>
        <RiskSummary />
      </section>

      {/* Anomaly Report */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Anomaly Report</h2>
        <Card className="p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Anomalies This Week</h3>
          <div className="text-3xl font-bold text-gray-900">{totalAnomalies}</div>
          <p className="text-sm text-gray-600">Anomalies detected across all metrics</p>
        </Card>
        <AnomalyHeatmap dataMap={[
          { metric: 'Sleep', values: sleepSample },
          { metric: 'Hydration', values: hydrationSample },
          { metric: 'Stress', values: stressSample },
          { metric: 'Steps', values: stepsSample }
        ]} />
      </section>

      {/* Section 1: Prediction Insights */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Prediction Insights</h2>

        {/* AI Prediction Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {predictions.map((prediction, index) => (
            <Card key={index} className="p-6 rounded-2xl shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${prediction.bgColor}`}>
                  <prediction.icon className={`w-6 h-6 ${prediction.color}`} />
                </div>
                <div className={`flex items-center ${prediction.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {prediction.change > 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium ml-1">
                    {Math.abs(prediction.change)}%
                  </span>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{prediction.value}%</div>
              <div className="text-sm text-gray-600 mb-2">{prediction.title}</div>
              <div className={`text-sm font-medium ${prediction.color}`}>{prediction.status}</div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trend Forecast Panel */}
          <Card className="p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Trend Forecast</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
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
                    dataKey="cardiovascular"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
                    name="Cardiovascular"
                  />
                  <Line
                    type="monotone"
                    dataKey="diabetes"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
                    name="Diabetes"
                  />
                  <Line
                    type="monotone"
                    dataKey="mental"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                    name="Mental Health"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Risk Forecast Graph */}
          <Card className="p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Risk Forecast</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={riskData}>
                  <defs>
                    <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
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
                  <Area
                    type="monotone"
                    dataKey="risk"
                    stroke="#f59e0b"
                    fill="url(#riskGradient)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </section>

      {/* Section 2: Analytics Dashboard */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>

        {/* Multi-metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <Card key={index} className="p-6 rounded-2xl shadow-md">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-primary-50">
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                  <div className="text-sm text-gray-600">{metric.title}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Area Chart */}
          <Card className="p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Health Trends</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="mental"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                    name="Mental Health"
                  />
                  <Area
                    type="monotone"
                    dataKey="cardiovascular"
                    stackId="2"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.6}
                    name="Cardiovascular"
                  />
                  <Area
                    type="monotone"
                    dataKey="diabetes"
                    stackId="3"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.6}
                    name="Diabetes"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Health Distribution Pie Chart */}
          <Card className="p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Health Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={healthDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {healthDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {healthDistribution.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span>{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Health Breakdown Table */}
        <Card className="p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Breakdown Analysis</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Health Condition</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Cases</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Risk Level</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {healthBreakdownData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium text-gray-900">{item.condition}</td>
                    <td className="py-4 px-4 text-center">{item.count}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.risk === 'High' ? 'bg-red-100 text-red-800' :
                        item.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {item.risk} Risk
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">{((item.count / 127) * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* Section 3: Reports List */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Reports List</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              title={report.title}
              date={report.date}
              type={report.type}
              description={`${report.size} • ${report.pages} pages`}
            />
          ))}
        </div>
      </section>

      {/* Section 4: ML Prediction Engine */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">ML Prediction Engine</h2>
          <p className="text-gray-600 mt-2">
            AI-powered forecasting with confidence intervals for your health metrics.
          </p>
        </div>

        <div className="space-y-8">
          {/* Sleep Prediction */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="p-6 rounded-2xl shadow-lg">
                <PredictionChart
                  data={{ ...sleepPrediction, historical: [8, 7.5, 8.2, 6.8, 7.9, 9, 8.5, 7.8, 8.1, 7.2, 8.3, 7.9].slice(-7) }}
                  title="Sleep Duration Forecast"
                  unit="hrs"
                  color="#6366f1"
                />
              </Card>
            </div>
            <div>
              <ForecastCard
                type="sleep"
                data={sleepPrediction}
                confidenceLevel={Math.round(sleepPrediction.accuracy * 100)}
              />
            </div>
          </div>

          {/* Hydration Prediction */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="p-6 rounded-2xl shadow-lg">
                <PredictionChart
                  data={{ ...hydrationPrediction, historical: [2.1, 2.4, 2.0, 2.5, 2.3, 2.8, 2.6, 2.2, 2.7, 2.1, 2.9, 2.5].slice(-7) }}
                  title="Hydration Intake Forecast"
                  unit="L"
                  color="#3b82f6"
                />
              </Card>
            </div>
            <div>
              <ForecastCard
                type="hydration"
                data={hydrationPrediction}
                confidenceLevel={Math.round(hydrationPrediction.accuracy * 100)}
              />
            </div>
          </div>

          {/* Stress Prediction */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="p-6 rounded-2xl shadow-lg">
                <PredictionChart
                  data={{ ...stressPrediction, historical: [4, 6, 5, 7, 5, 3, 4, 6, 5, 7, 4, 3].slice(-7) }}
                  title="Stress Level Forecast"
                  unit=""
                  color="#f59e0b"
                />
              </Card>
            </div>
            <div>
              <ForecastCard
                type="stress"
                data={stressPrediction}
                confidenceLevel={Math.round(stressPrediction.accuracy * 100)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Relationship Explorer */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Relationship Explorer</h2>
          <p className="text-gray-600 mt-2">
            Explore correlations between your health metrics to understand key relationships.
          </p>
        </div>

        <div className="space-y-8">
          {/* Full Correlation Matrix */}
          <Card className="p-6 rounded-2xl shadow-lg">
            <CorrelationMatrix matrixData={fullCorrelationMatrix} />
          </Card>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Relationship Explorer</h2>
        <CorrelationMatrix matrix={matrix} />
      </section>
    </div>
  )
}

export default ReportsAnalytics
