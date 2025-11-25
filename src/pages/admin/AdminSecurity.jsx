import React, { useState, useEffect } from 'react';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Lock,
  Eye,
  UserCheck,
  Activity,
  Server,
  Unlock,
  Bell,
  Ban,
  RefreshCw
} from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

// Mock security data for enterprise demonstration
const mockSecurityData = {
  systemStatus: {
    overallStatus: 'SECURE',
    uptime: 99.97,
    activeUsers: 4876,
    totalUsers: 5342,
    activeSessions: 523,
    blockedIPs: 47
  },
  recentActivities: [
    {
      id: 1,
      timestamp: '2 minutes ago',
      event: 'Admin login',
      user: 'admin@healthmate.com',
      ip: '192.168.1.100',
      status: 'SUCCESS',
      risk: 'LOW'
    },
    {
      id: 2,
      timestamp: '15 minutes ago',
      event: 'Failed login attempt',
      user: 'unknown@user.com',
      ip: '45.67.89.234',
      status: 'BLOCKED',
      risk: 'HIGH'
    },
    {
      id: 3,
      timestamp: '32 minutes ago',
      event: 'Premium feature access',
      user: 'demo.patient@healthmate.com',
      ip: '10.0.1.50',
      status: 'ALLOWED',
      risk: 'LOW'
    },
    {
      id: 4,
      timestamp: '1 hour ago',
      event: 'Admin data export',
      user: 'admin@healthmate.com',
      ip: '192.168.1.100',
      status: 'ALLOWED',
      risk: 'MEDIUM'
    },
    {
      id: 5,
      timestamp: '2 hours ago',
      event: 'Multiple failed logins',
      user: 'suspicious@evil.com',
      ip: '203.45.67.89',
      status: 'BLOCKED',
      risk: 'CRITICAL'
    }
  ],
  securityMetrics: {
    successfulLogins: 5432,
    failedLogins: 123,
    activeSessions: 523,
    blockedIPs: 47,
    alertsToday: 12,
    complianceScore: 97.8
  },
  complianceAlerts: [
    {
      id: 1,
      type: 'HIPAA',
      message: 'All PHI data access logged and encrypted',
      status: 'PASSED',
      timestamp: 'Today'
    },
    {
      id: 2,
      type: 'GDPR',
      message: 'User consent verified for all data processing',
      status: 'PASSED',
      timestamp: 'Today'
    },
    {
      id: 3,
      type: 'SECURITY',
      message: 'Two-factor authentication recommended for admins',
      status: 'WARNING',
      timestamp: '2 days ago'
    }
  ],
  threatIndicators: [
    { type: 'High risk logins', count: 3, change: -15, trend: 'down' },
    { type: 'Blocked IPs', count: 47, change: +2, trend: 'up' },
    { type: 'Active alerts', count: 12, change: -5, trend: 'down' },
    { type: 'Successful authentications', count: 5432, change: +176, trend: 'up' }
  ]
};

const StatusBadge = ({ status, risk }) => {
  const getStatusColor = (status, risk) => {
    if (status === 'SUCCESS' || status === 'PASSED') return 'bg-green-100 text-green-800';
    if (status === 'BLOCKED') return 'bg-red-100 text-red-800';
    if (risk === 'CRITICAL') return 'bg-red-100 text-red-800';
    if (risk === 'HIGH') return 'bg-orange-100 text-orange-800';
    if (risk === 'MEDIUM') return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status, risk)}`}>
      {status}
    </span>
  );
};

export default function AdminSecurity() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [data, setData] = useState(mockSecurityData);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1500);
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'CRITICAL': return 'text-red-600';
      case 'HIGH': return 'text-orange-600';
      case 'MEDIUM': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? '↗️' : '↘️';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Security Monitoring</h1>
          <p className="text-gray-600 mt-1">Real-time security status and compliance monitoring</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm"
          >
            <option value="1h">Last hour</option>
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>

          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">System Status</p>
              <p className="text-3xl font-bold">SECURE</p>
              <div className="flex items-center mt-2">
                <CheckCircle className="w-4 h-4 mr-1" />
                <span className="text-sm text-green-100">All systems operational</span>
              </div>
            </div>
            <Shield className="w-8 h-8 text-green-100 opacity-75" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Active Sessions</p>
              <p className="text-3xl font-bold">{data.systemStatus.activeSessions}</p>
              <div className="flex items-center mt-2">
                <UserCheck className="w-4 h-4 mr-1" />
                <span className="text-sm text-blue-100">{data.systemStatus.activeUsers} active users</span>
              </div>
            </div>
            <Activity className="w-8 h-8 text-blue-100 opacity-75" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Compliance Score</p>
              <p className="text-3xl font-bold">{data.securityMetrics.complianceScore}%</p>
              <div className="flex items-center mt-2">
                <CheckCircle className="w-4 h-4 mr-1" />
                <span className="text-sm text-purple-100">HIPAA & GDPR compliant</span>
              </div>
            </div>
            <Lock className="w-8 h-8 text-purple-100 opacity-75" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-500 to-red-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Active Alerts</p>
              <p className="text-3xl font-bold">{data.systemStatus.activeSessions}</p>
              <div className="flex items-center mt-2">
                <AlertTriangle className="w-4 h-4 mr-1" />
                <span className="text-sm text-orange-100">{data.securityMetrics.alertsToday} alerts today</span>
              </div>
            </div>
            <Bell className="w-8 h-8 text-orange-100 opacity-75" />
          </div>
        </Card>
      </div>

      {/* Security Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {data.threatIndicators.map((indicator, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{indicator.type}</p>
                <p className="text-2xl font-bold text-gray-900">{indicator.count.toLocaleString()}</p>
              </div>
              <div className={`flex items-center ${indicator.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <span className="text-lg mr-1">{getTrendIcon(indicator.trend)}</span>
                <span className="text-sm font-medium">{Math.abs(indicator.change)}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity & Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Security Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Security Activity</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {data.recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  {activity.status === 'SUCCESS' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{activity.event}</p>
                    <StatusBadge status={activity.status} risk={activity.risk} />
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                    <span>by {activity.user}</span>
                    <span>•</span>
                    <span>IP: {activity.ip}</span>
                    <span>•</span>
                    <span>{activity.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Compliance Status */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Compliance Alerts</h3>
            <Shield className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {data.complianceAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  {alert.status === 'PASSED' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : alert.status === 'WARNING' ? (
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{alert.type} Compliance</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      alert.status === 'PASSED' ? 'bg-green-100 text-green-800' :
                      alert.status === 'WARNING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {alert.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-900 mt-1">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{alert.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Action Pane */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Security Actions</h3>
            <p className="text-sm text-gray-600">
              Manage security settings and respond to alerts
            </p>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" size="sm">
              <Unlock className="w-4 h-4 mr-2" />
              View Audit Logs
            </Button>
            <Button variant="outline" size="sm">
              <Ban className="w-4 h-4 mr-2" />
              Block IPs
            </Button>
            <Button size="sm">
              <Shield className="w-4 h-4 mr-2" />
              Security Report
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
