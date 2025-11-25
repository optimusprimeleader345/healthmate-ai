import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Target,
  Award,
  Zap,
  Calendar,
  Globe,
  Smartphone,
  Computer,
  Download,
  Clock,
  FileText,
  CheckCircle
} from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

// Mock analytics export service
const exportService = {
  exportCharts: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate PDF download
        alert('Charts export completed! (Demo - PDF would download in production)');
        resolve();
      }, 2000);
    });
  },

  scheduleReport: async (type, frequency) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        alert(`Report scheduled successfully!\nType: ${type}\nFrequency: ${frequency}\n(Demo - Would send to admin email in production)`);
        resolve();
      }, 1500);
    });
  },

  generateBusinessReport: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        alert('Business Report generated successfully!\nReport contains: Analytics Summary, Revenue Forecast, User Growth Trends\n(Demo - Would download comprehensive PDF in production)');
        resolve();
      }, 3000);
    });
  }
};

// Comprehensive analytics data for enterprise demonstration
const analyticsData = {
  revenue: {
    monthly: [
      { month: 'Jan', mrr: 45680, arr: 548160 },
      { month: 'Feb', mrr: 48320, arr: 579840 },
      { month: 'Mar', mrr: 52890, arr: 634680 },
      { month: 'Apr', mrr: 56870, arr: 682440 },
      { month: 'May', mrr: 62150, arr: 745800 },
      { month: 'Jun', mrr: 68720, arr: 824640 },
      { month: 'Jul', mrr: 72160, arr: 865920 },
      { month: 'Aug', mrr: 75890, arr: 910680 },
      { month: 'Sep', mrr: 80140, arr: 961680 },
      { month: 'Oct', mrr: 85320, arr: 1023840 },
      { month: 'Nov', mrr: 89450, arr: 1073400 },
      { month: 'Dec', mrr: 92560, arr: 1110720 }
    ],
    forecasts: {
      q1: 975000,
      q2: 1125000,
      q3: 1475000,
      q4: 1650000
    }
  },
  performance: {
    ltv: {
      free: 0,
      basic: 189,
      pro: 387
    },
    conversionFunnel: [
      { stage: 'Visitors', count: 150000, rate: 100 },
      { stage: 'Sign-ups', count: 32150, rate: 21.4 },
      { stage: 'Trial Complete', count: 12450, rate: 8.3 },
      { stage: 'Paid Users', count: 4876, rate: 3.25 }
    ],
    retention: [
      { month: 'M1', rate: 100 },
      { month: 'M3', rate: 85 },
      { month: 'M6', rate: 72 },
      { month: 'M12', rate: 62 }
    ]
  },
  platform: {
    usage: {
      peakHours: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 7, 8],
      byDevice: [
        { type: 'Mobile', count: 67342, percentage: 76.2 },
        { type: 'Tablet', count: 12567, percentage: 14.2 },
        { type: 'Desktop', count: 8788, percentage: 9.6 }
      ],
      byRegion: [
        { region: 'North America', users: 32450, revenue: 145200 },
        { region: 'Europe', users: 28590, revenue: 97680 },
        { region: 'Asia Pacific', users: 19830, revenue: 54320 },
        { region: 'Other', users: 6800, revenue: 18640 }
      ]
    }
  },
  predictions: {
    growthScenarios: [
      { scenario: 'Conservative', mrr2026: 128000, arr2026: 1536000 },
      { scenario: 'Moderate', mrr2026: 152000, arr2026: 1824000 },
      { scenario: 'Aggressive', mrr2026: 189000, arr2026: 2268000 }
    ],
    featureUtilization: {
      prediction: '85% feature adoption by Q3 2026',
      aiCoach: 94,
      smartNotifications: 78,
      calendarTracking: 67,
      pharmacyIntegration: 52
    }
  }
};

export default function AdminAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('12m');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [data, setData] = useState(analyticsData);
  const [isExporting, setIsExporting] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastAction, setLastAction] = useState('');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercent = (value) => `${value.toFixed(1)}%`;

  const revenueGrowth = data.revenue.monthly.length >= 2 ?
    ((data.revenue.monthly[data.revenue.monthly.length - 1].mrr -
      data.revenue.monthly[data.revenue.monthly.length - 2].mrr) /
     data.revenue.monthly[data.revenue.monthly.length - 2].mrr * 100) : 0;

  // Handle export functionality
  const handleExportCharts = async () => {
    setIsExporting(true);
    setLastAction('');

    try {
      await exportService.exportCharts();
      setLastAction('Chart export completed successfully!');
    } catch (error) {
      setLastAction('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Handle schedule reports
  const handleScheduleReports = async () => {
    setIsScheduling(true);
    setLastAction('');

    try {
      await exportService.scheduleReport('Weekly Analytics', 'Every Monday at 9:00 AM');
      setLastAction('Report scheduling completed!');
    } catch (error) {
      setLastAction('Scheduling failed. Please try again.');
    } finally {
      setIsScheduling(false);
    }
  };

  // Handle business report generation
  const handleBusinessReport = async () => {
    setIsGenerating(true);
    setLastAction('');

    try {
      await exportService.generateBusinessReport();
      setLastAction('Business report generated successfully!');
    } catch (error) {
      setLastAction('Report generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
          <p className="text-gray-600 mt-1">Deep business intelligence and predictive insights</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm"
          >
            <option value="3m">Last 3 months</option>
            <option value="6m">Last 6 months</option>
            <option value="12m">Last 12 months</option>
          </select>

          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm"
          >
            <option value="revenue">Revenue</option>
            <option value="users">Users</option>
            <option value="platforms">Platforms</option>
            <option value="predictions">Predictions</option>
          </select>
        </div>
      </div>

      {/* Success/Error Messages */}
      {lastAction && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          lastAction.includes('success') || lastAction.includes('completed')
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {lastAction.includes('success') || lastAction.includes('completed') ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <FileText className="w-5 h-5" />
          )}
          <span className="font-medium">{lastAction}</span>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Annual Recurring Revenue</p>
              <p className="text-3xl font-bold">{formatCurrency(data.revenue.monthly[data.revenue.monthly.length - 1].mrr * 12)}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm text-blue-100">{formatPercent(revenueGrowth)} growth</span>
              </div>
            </div>
            <DollarSign className="w-8 h-8 text-blue-100 opacity-75" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Premium User LTV</p>
              <p className="text-3xl font-bold">{formatCurrency(data.performance.ltv.pro)}</p>
              <div className="flex items-center mt-2">
                <Award className="w-4 h-4 mr-1" />
                <span className="text-sm text-green-100">Highest value tier</span>
              </div>
            </div>
            <Users className="w-8 h-8 text-green-100 opacity-75" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Conversion Rate</p>
              <p className="text-3xl font-bold">{formatPercent(
                (data.performance.conversionFunnel[3].count /
                 data.performance.conversionFunnel[0].count) * 100
              )}</p>
              <div className="flex items-center mt-2">
                <Target className="w-4 h-4 mr-1" />
                <span className="text-sm text-purple-100">Visitor to paid</span>
              </div>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-100 opacity-75" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-500 to-red-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Churn Rate</p>
              <p className="text-3xl font-bold">3.2%</p>
              <div className="flex items-center mt-2">
                <TrendingDown className="w-4 h-4 mr-1" />
                <span className="text-sm text-orange-100">Within industry avg</span>
              </div>
            </div>
            <Activity className="w-8 h-8 text-orange-100 opacity-75" />
          </div>
        </Card>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Forecasting */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">2026 Revenue Forecast</h3>
            <LineChart className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {data.predictions.growthScenarios.map((scenario, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{scenario.scenario} Growth</p>
                  <p className="text-sm text-gray-600">MRR: {formatCurrency(scenario.mrr2026)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{formatCurrency(scenario.arr2026)}</p>
                  <p className="text-xs text-gray-500">ARR</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Geographic Distribution */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue by Region</h3>
            <Globe className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {data.platform.usage.byRegion.map((region, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-gray-900">{region.region}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">{region.users.toLocaleString()} users</span>
                  <span className="font-semibold text-blue-600">{formatCurrency(region.revenue)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Usage */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Platform Distribution</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {data.platform.usage.byDevice.map((device, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {device.type === 'Mobile' ? <Smartphone className="w-5 h-5 text-blue-500" /> :
                   device.type === 'Tablet' ? <Globe className="w-5 h-5 text-green-500" /> :
                   <Computer className="w-5 h-5 text-purple-500" />}
                  <span className="font-medium text-gray-900">{device.type}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-green-500' : 'bg-purple-500'
                      }`}
                      style={{ width: `${device.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-16">{device.percentage}%</span>
                  <span className="text-sm text-gray-500 w-20">{device.count.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* AI Feature Adoption Forecast */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Feature Adoption Trends</h3>
            <Zap className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-900 mb-2">Predicted 85% Feature Adoption by Q3 2026</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">AI Health Coach</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">94%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700">Smart Notifications</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">78%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700">Calendar Dashboard</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">67%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700">Pharmacy Integration</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '52%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">52%</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Panel */}
      <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Actions</h3>
            <p className="text-sm text-gray-600">
              Export data, generate reports, or schedule custom analytics
            </p>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleScheduleReports}
              disabled={isScheduling}
            >
              <Calendar className="w-4 h-4 mr-2" />
              {isScheduling ? 'Scheduling...' : 'Schedule Reports'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCharts}
              disabled={isExporting}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Export Charts'}
            </Button>
            <Button
              size="sm"
              onClick={handleBusinessReport}
              disabled={isGenerating}
            >
              <FileText className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Business Report'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
