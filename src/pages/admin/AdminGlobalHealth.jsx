import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import {
  Globe,
  MapPin,
  TrendingUp,
  Users,
  Heart,
  Activity,
  Zap,
  Calendar,
  AlertTriangle,
  FileText
} from 'lucide-react';

// Mock global health service
const globalHealthService = {
  generateGlobalReport: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        alert('Global Health Intelligence Report Generated!\n\n📊 Report Summary:\n✅ 6 world regions analyzed\n✅ 120,056 patient records processed\n✅ 93.6% average health compliance\n✅ 2 high-risk regions identified\n✅ Regional healthcare gaps analyzed\n\n🗺️ Trends: North America showing 4.1% improvement\n📈 Global health scores trending upward\n\n💾 Report saved to admin dashboard');
        resolve();
      }, 3000);
    });
  },

  sendRegionalAlert: async (regionName) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        alert(`Emergency Alert Dispatched!\n\n🚨 Alert Type: Health Crisis Management\n🏥 Region: ${regionName}\n📢 Destinations: All regional health authorities\n\n✅ WHO notified of situation\n✅ Local healthcare networks alerted\n✅ Emergency response teams activated\n✅ Real-time monitoring initiated\n\n⏰ Response time: < 5 minutes`);
        resolve();
      }, 2000);
    });
  },

  generateEmergencyReport: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        alert('Global Emergency Health Report - URGENT!\n\n🔴 CRITICAL SITUATIONS DETECTED:\n\n1. 🌍 Asia Pacific: 2,345 active critical cases\n   - Health Score: 96.3%\n   - Weekly Trend: +4.1%\n   - Action Required: Emergency medical deployment\n\n2. 🌎 Africa: 543 critical cases emerging\n   - Health Score: 87.4%\n   - Weekly Trend: -0.5%\n   - Action Required: Immediate resource allocation\n\n3. 🇪🇺 Europe: Decreased health scores\n   - Health Score: 92.1%\n   - Weekly Trend: -1.2%\n   - Action Required: Enhanced monitoring\n\n🌐 Global Network: 99.7% uptime maintained\n📊 AI predictions active across all regions\n🚑 Emergency response protocols initiated');
        resolve();
      }, 2500);
    });
  },

  viewGlobalView: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        alert('Global Health Satellite View Activated!\n\n🛰️ Live Data Feeds:\n\n• Real-time patient monitoring across 6 continents\n• Satellite telemedicine connections active\n• Global vaccine distribution tracking\n• Pandemic spread modeling\n• Healthcare resource mapping\n• Emergency response drone deployments\n\n📡 Network Status: All systems operational\n⚡ Data transfers: 99.9% reliable\n🌍 Coverage: 100% of world population');
        resolve();
      }, 1500);
    });
  },

  viewHealthTrends: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        alert('Global Health Trend Analysis Complete!\n\n📈 12-Month Trends:\n\n🔺 IMPROVING REGIONS:\n• North America: +2.3% health trajectory\n• Asia Pacific: +4.1% rapid improvement\n• Middle East: +1.9% steady growth\n• Latin America: +0.8% moderate increase\n\n🔻 CHALLENGING REGIONS:\n• Europe: -1.2% seasonal effects noted\n• Africa: -0.5% infrastructure challenges\n\n🎯 Global Target: 95% average health score\n📊 Current: 93.6% (+0.8% vs last month)\n\n🧠 AI Analysis: "Positive trajectory, continue interventions"');
        resolve();
      }, 2000);
    });
  }
};

const GlobalHealthPanel = ({ title, value, unit, icon: Icon, change, region, color = 'blue' }) => {
  const colors = {
    blue: { bg: 'bg-blue-500', text: 'text-blue-100' },
    green: { bg: 'bg-green-500', text: 'text-green-100' },
    purple: { bg: 'bg-purple-500', text: 'text-purple-100' },
    orange: { bg: 'bg-orange-500', text: 'text-orange-100' },
    red: { bg: 'bg-red-500', text: 'text-red-100' }
  };

  return (
    <Card className={`p-6 bg-gradient-to-br ${colors[color].bg} to-gray-700 text-white border-0`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium ${colors[color].text} mb-1`}>{title}</p>
          <p className="text-3xl font-bold mb-1">{value}{unit}</p>
          {region && <p className="text-xs opacity-75 mb-2">{region}</p>}
          <p className="text-xs">
            {change !== undefined && (
              <span className={`font-medium ${change >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                ↗ {Math.abs(change)}% this week
              </span>
            )}
          </p>
        </div>
        <div className={`p-3 rounded-full bg-white bg-opacity-20`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </Card>
  );
};

export default function AdminGlobalHealth() {
  const [globalData] = useState({
    regions: [
      { name: 'North America', patients: 23456, healthScore: 94.8, activeCases: 1234, change: 2.3 },
      { name: 'Europe', patients: 19876, healthScore: 92.1, activeCases: 987, change: -1.2 },
      { name: 'Asia Pacific', patients: 45678, healthScore: 96.3, activeCases: 2345, change: 4.1 },
      { name: 'Latin America', patients: 12345, healthScore: 89.7, activeCases: 876, change: 0.8 },
      { name: 'Africa', patients: 8765, healthScore: 87.4, activeCases: 543, change: -0.5 },
      { name: 'Middle East', patients: 9876, healthScore: 91.2, activeCases: 678, change: 1.9 }
    ],
    global: {
      totalPatients: 120056,
      avgHealthScore: 93.6,
      criticalRegions: 2,
      networkUptime: 99.7
    }
  });

  const [selectedRegion, setSelectedRegion] = useState(globalData.regions[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isViewingGlobal, setIsViewingGlobal] = useState(false);
  const [isViewingTrends, setIsViewingTrends] = useState(false);
  const [isGeneratingEmergency, setIsGeneratingEmergency] = useState(false);
  const [isSendingAlert, setIsSendingAlert] = useState(false);

  // Handle global view button
  const handleGlobalView = async () => {
    setIsViewingGlobal(true);
    try {
      await globalHealthService.viewGlobalView();
    } finally {
      setIsViewingGlobal(false);
    }
  };

  // Handle generate report button
  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      await globalHealthService.generateGlobalReport();
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle send alert button
  const handleSendAlert = async () => {
    setIsSendingAlert(true);
    try {
      await globalHealthService.sendRegionalAlert(selectedRegion.name);
    } finally {
      setIsSendingAlert(false);
    }
  };

  // Handle view trends button
  const handleViewTrends = async () => {
    setIsViewingTrends(true);
    try {
      await globalHealthService.viewHealthTrends();
    } finally {
      setIsViewingTrends(false);
    }
  };

  // Handle emergency report button
  const handleEmergencyReport = async () => {
    setIsGeneratingEmergency(true);
    try {
      await globalHealthService.generateEmergencyReport();
    } finally {
      setIsGeneratingEmergency(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Global Health Intelligence</h1>
          <p className="text-gray-600 mt-1">Real-time worldwide health network</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGlobalView}
            disabled={isViewingGlobal}
            className="flex items-center gap-2"
          >
            <Globe className="w-4 h-4" />
            {isViewingGlobal ? 'Viewing...' : 'Global View'}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            {isGenerating ? 'Generating...' : 'Generate Report'}
          </Button>
        </div>
      </div>

      {/* Global Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlobalHealthPanel
          title="Global Patients"
          value={globalData.global.totalPatients.toLocaleString()}
          unit=""
          icon={Users}
          change={undefined}
          color="blue"
        />
        <GlobalHealthPanel
          title="Avg Health Score"
          value={globalData.global.avgHealthScore}
          unit="%"
          icon={Heart}
          change={undefined}
          color="green"
        />
        <GlobalHealthPanel
          title="Network Uptime"
          value={globalData.global.networkUptime}
          unit="%"
          icon={Activity}
          change={undefined}
          color="purple"
        />
        <GlobalHealthPanel
          title="Active Cases"
          value={globalData.regions.reduce((sum, region) => sum + region.activeCases, 0).toLocaleString()}
          unit=""
          icon={Zap}
          change={undefined}
          color="orange"
        />
      </div>

      {/* Regional Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Regional Health Coverage
          </h3>
          <div className="space-y-4">
            {globalData.regions.map((region) => (
              <div
                key={region.name}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedRegion.name === region.name
                    ? 'bg-blue-50 border-2 border-blue-200'
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                }`}
                onClick={() => setSelectedRegion(region)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{region.name}</p>
                      <p className="text-sm text-gray-600">{region.patients.toLocaleString()} patients registered</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        region.healthScore >= 95 ? 'bg-green-100 text-green-800' :
                        region.healthScore >= 90 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {region.healthScore}%
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        region.change > 0 ? 'bg-green-100 text-green-700' :
                        region.change < 0 ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {region.change > 0 ? '+' : ''}{region.change}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{region.activeCases} active cases</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            {selectedRegion.name} Details
          </h3>

          <div className="space-y-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600 mb-1">{selectedRegion.healthScore}%</p>
              <p className="text-sm text-gray-600">Health Score</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Patients</span>
                <span className="font-medium text-gray-900">{selectedRegion.patients.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Cases</span>
                <span className="font-medium text-gray-900">{selectedRegion.activeCases.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Week Change</span>
                <span className={`font-medium ${
                  selectedRegion.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {selectedRegion.change >= 0 ? '+' : ''}{selectedRegion.change}%
                </span>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => alert(`Regional Details View Opened\n\n📍 Region: ${selectedRegion.name}\n📊 Full analytics dashboard loading...\n⏳ Preparing detailed regional health data...`)}
                className="flex-1"
              >
                View Details
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSendAlert}
                disabled={isSendingAlert}
                className="flex-1"
              >
                {isSendingAlert ? 'Sending...' : 'Send Alert'}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Global Health Network */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Health Network</h3>
            <p className="text-sm text-gray-600">Real-time health monitoring across continents</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewTrends}
              disabled={isViewingTrends}
              className="flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              {isViewingTrends ? 'Loading...' : 'View Trends'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleEmergencyReport}
              disabled={isGeneratingEmergency}
              className="flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              {isGeneratingEmergency ? 'Generating...' : 'Emergency Report'}
            </Button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{globalData.global.networkUptime}%</p>
            <p className="text-sm text-gray-600">Network Uptime</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{globalData.regions.length}</p>
            <p className="text-sm text-gray-600">Regions Covered</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{globalData.global.criticalRegions}</p>
            <p className="text-sm text-gray-600">Critical Regions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">24/7</p>
            <p className="text-sm text-gray-600">Monitoring</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
