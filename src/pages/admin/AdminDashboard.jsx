import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import {
  Users,
  Shield,
  Activity,
  AlertTriangle,
  Server,
  BarChart3,
  Clock,
  CheckCircle,
  TrendingUp,
  UserCheck,
  Zap,
  Database
} from 'lucide-react';

const adminMetrics = {
  system: {
    uptime: 99.97,
    activeUsers: 4876,
    totalUsers: 5342,
    apiCallsToday: 56429,
    serverLoad: 42,
    responseTime: 187,
    databaseConnections: 67
  },
  security: {
    activeSessions: 523,
    blockedAttempts: 47,
    complianceScore: 97.8,
    alertsToday: 12,
    failedLogins: 23,
    encryptedData: 99.9
  },
  users: {
    newRegistrations: 89,
    premiumUsers: 1843,
    activeToday: 3247,
    InactiveUsers: 466,
    averageSessionTime: 127,
    mobileUsers: 76.2
  },
  performance: {
    aiResponses: 2340,
    symptomChecks: 1127,
    telemedicineSessions: 93,
    reportsGenerated: 56,
    dataPoints: 891234
  }
};

const SystemMetricCard = ({ title, value, unit, icon: Icon, change, description, color = 'blue' }) => {
  const colors = {
    blue: { bg: 'bg-blue-500', text: 'text-blue-100' },
    green: { bg: 'bg-green-500', text: 'text-green-100' },
    purple: { bg: 'bg-purple-500', text: 'text-purple-100' },
    orange: { bg: 'bg-orange-500', text: 'text-orange-100' }
  };

  return (
    <Card className={`p-6 bg-gradient-to-br ${colors[color].bg} to-gray-700 text-white border-0`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium ${colors[color].text} mb-1`}>{title}</p>
          <p className="text-3xl font-bold mb-1">{value}{unit}</p>
          {description && <p className="text-xs opacity-75">{description}</p>}
        </div>
        <div className={`p-3 rounded-full bg-white bg-opacity-20`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
      {change && (
        <div className={`mt-3 text-sm ${change >= 0 ? 'text-green-300' : 'text-red-300'}`}>
          {change >= 0 ? '↗' : '↘'} {Math.abs(change)}% from yesterday
        </div>
      )}
    </Card>
  );
};

const ActivityFeed = ({ activities }) => (
  <Card className="p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
    <div className="space-y-3">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-center space-x-3 py-2">
          <div className={`w-2 h-2 rounded-full ${
            activity.type === 'login' ? 'bg-green-500' :
            activity.type === 'error' ? 'bg-red-500' :
            'bg-blue-500'
          }`} />
          <div className="flex-1 text-sm text-gray-600">
            <span className="font-medium text-gray-900">{activity.user}</span>
            {' '}{activity.action}
          </div>
          <div className="text-xs text-gray-400">{activity.time}</div>
        </div>
      ))}
    </div>
  </Card>
);

const OverviewStats = ({ stats }) => (
  <Card className="p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Overview</h3>
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center">
        <p className="text-2xl font-bold text-blue-600">{stats.online}</p>
        <p className="text-sm text-gray-600">Online Now</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-green-600">{stats.total}</p>
        <p className="text-sm text-gray-600">Total Users</p>
      </div>
    </div>

    <div className="mt-4 grid grid-cols-4 gap-2">
      <div className="text-center">
        <p className="text-lg font-semibold text-purple-600">{stats.premium}</p>
        <p className="text-xs text-gray-600">Premium</p>
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold text-orange-600">{stats.inactive}</p>
        <p className="text-xs text-gray-600">Inactive</p>
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold text-cyan-600">{stats.alerts}</p>
        <p className="text-xs text-gray-600">Alerts</p>
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold text-green-600">{stats.uptime}</p>
        <p className="text-xs text-gray-600">Uptime</p>
      </div>
    </div>
  </Card>
);

export default function AdminDashboard() {
  const [data, setData] = useState(adminMetrics);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
      // Simulate live data updates
      setData(prev => ({
        ...prev,
        system: {
          ...prev.system,
          apiCallsToday: prev.system.apiCallsToday + Math.floor(Math.random() * 100 - 50),
          activeUsers: Math.max(0, prev.system.activeUsers + Math.floor(Math.random() * 20 - 10))
        }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const recentActivities = [
    { user: 'admin@healthmate.com', action: 'logged into admin dashboard', time: '2 min ago', type: 'login' },
    { user: 'john.doe@example.com', action: 'completed symptom check', time: '5 min ago', type: 'activity' },
    { user: 'sarah.wilson@pro.com', action: 'scheduled telemedicine session', time: '12 min ago', type: 'activity' },
    { user: 'system', action: 'detected anomalous login attempt', time: '18 min ago', type: 'security' },
    { user: 'mike.jenkins@example.com', action: 'generated health report', time: '25 min ago', type: 'activity' },
    { user: 'api.gateway', action: 'processed 1,247 API calls', time: '30 min ago', type: 'system' }
  ];

  const overviewStats = {
    online: data.system.activeUsers,
    total: data.system.totalUsers,
    premium: data.users.premiumUsers,
    inactive: data.users.InactiveUsers,
    alerts: data.security.alertsToday,
    uptime: data.system.uptime + '%'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">System overview and health monitoring</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Last updated</p>
          <p className="text-lg font-medium text-gray-900">{lastUpdated.toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SystemMetricCard
          title="Active Users"
          value={data.system.activeUsers.toLocaleString()}
          unit=""
          icon={Users}
          change={12}
          description="Currently online"
          color="blue"
        />
        <SystemMetricCard
          title="System Uptime"
          value={data.system.uptime}
          unit="%"
          icon={CheckCircle}
          description="24/7 operational"
          color="green"
        />
        <SystemMetricCard
          title="API Calls Today"
          value={data.system.apiCallsToday.toLocaleString()}
          unit=""
          icon={Zap}
          change={8.5}
          description="Processed requests"
          color="purple"
        />
        <SystemMetricCard
          title="Security Alerts"
          value={data.security.alertsToday}
          unit=""
          icon={AlertTriangle}
          change={-15}
          description="Active issues"
          color="orange"
        />
      </div>

      {/* Second Row - Security & System Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SystemMetricCard
          title="Active Sessions"
          value={data.security.activeSessions}
          unit=""
          icon={Shield}
          description="Secure connections"
          color="blue"
        />
        <SystemMetricCard
          title="Response Time"
          value={data.system.responseTime}
          unit="ms"
          icon={Activity}
          change={-3}
          description="Average latency"
          color="green"
        />
        <SystemMetricCard
          title="Server Load"
          value={data.system.serverLoad}
          unit="%"
          icon={Server}
          description="Resource usage"
          color="purple"
        />
        <SystemMetricCard
          title="AI Interactions"
          value={data.performance.aiResponses.toLocaleString()}
          unit=""
          icon={BarChart3}
          change={22}
          description="Daily responses"
          color="orange"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platform Overview */}
        <div className="lg:col-span-1">
          <OverviewStats stats={overviewStats} />
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <ActivityFeed activities={recentActivities} />
        </div>
      </div>

      {/* Action Panel */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Actions</h3>
            <p className="text-sm text-gray-600">Access key administrative functions</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Manage Users
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              View Analytics
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Security Center
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
