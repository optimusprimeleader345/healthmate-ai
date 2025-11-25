import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import {
  Zap,
  Brain,
  Cpu,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Play,
  Target
} from 'lucide-react';

// Mock AI service for training and optimization
const aiService = {
  trainModels: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        alert('AI Model Training Completed!\n\n📊 Training Results:\n✅ Accuracy improved by 3.2%\n✅ Response time reduced by 15ms\n✅ False positive rate decreased by 0.8%\n✅ New training data processed: 12,467 samples\n\n🧠 Model optimization scheduled for next maintenance window');
        resolve();
      }, 2500);
    });
  },

  optimizeNow: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        alert('AI System Optimization Complete!\n\n⚡ Performance Optimizations Applied:\n🔧 Memory usage reduced by 23%\n🏃 Real-time processing speed +18%\n🧠 Decision accuracy maintained at 98.7%\n🔄 Resource auto-scaling optimized\n⏰ System response time: 22ms avg\n\n✨ System ready for peak performance');
        resolve();
      }, 3000);
    });
  }
};

const AIPanel = ({ title, value, unit, icon: Icon, status, color = 'blue', details }) => {
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
          {details && <p className="text-xs opacity-75 mb-2">{details}</p>}
          <p className={`text-xs px-2 py-1 rounded-full inline-block ${
            status === 'optimal' ? 'bg-green-500' :
            status === 'warning' ? 'bg-yellow-500' :
            status === 'critical' ? 'bg-red-500' :
            'bg-gray-600'
          }`}>
            {status}
          </p>
        </div>
        <div className={`p-3 rounded-full bg-white bg-opacity-20`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </Card>
  );
};

export default function AdminAIAutonomous() {
  const [data, setData] = useState({
    aiAgents: {
      active: 8,
      totalDecisions: 1267,
      responseTime: 23,
      accuracy: 98.7
    },
    operations: {
      autonomousTasks: 45,
      alertsGenerated: 3,
      selfCorrections: 12,
      performance: 96
    }
  });

  const [isTraining, setIsTraining] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [lastAction, setLastAction] = useState('');

  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
      setData(prev => ({
        ...prev,
        aiAgents: {
          ...prev.aiAgents,
          totalDecisions: prev.aiAgents.totalDecisions + Math.floor(Math.random() * 20),
          responseTime: Math.max(10, prev.aiAgents.responseTime + Math.floor(Math.random() * 6 - 3))
        }
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Handle train models button
  const handleTrainModels = async () => {
    setIsTraining(true);
    setLastAction('');
    try {
      await aiService.trainModels();
      setLastAction('Training completed successfully!');
    } catch (error) {
      setLastAction('Training failed. Please try again.');
    } finally {
      setIsTraining(false);
    }
  };

  // Handle optimize button
  const handleOptimizeNow = async () => {
    setIsOptimizing(true);
    setLastAction('');
    try {
      await aiService.optimizeNow();
      setLastAction('Optimization completed successfully!');
    } catch (error) {
      setLastAction('Optimization failed. Please try again.');
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Autonomous Ops</h1>
          <p className="text-gray-600 mt-1">Self-healing AI operations center</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Last updated</p>
          <p className="text-lg font-medium text-gray-900">{lastUpdated.toLocaleTimeString()}</p>
        </div>
      </div>

      {/* AI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AIPanel
          title="Active AI Agents"
          value={data.aiAgents.active}
          unit=""
          icon={Brain}
          status="online"
          color="blue"
          details="Processing in realtime"
        />
        <AIPanel
          title="AI Efficiency"
          value={data.operations.performance}
          unit="%"
          icon={CheckCircle}
          status="optimal"
          color="green"
          details="SLA compliance"
        />
        <AIPanel
          title="Response Time"
          value={data.aiAgents.responseTime}
          unit="ms"
          icon={Zap}
          status="fast"
          color="purple"
          details="Avg latency"
        />
        <AIPanel
          title="Accuracy Rate"
          value={data.aiAgents.accuracy}
          unit="%"
          icon={Cpu}
          status="excellent"
          color="green"
          details="Decision quality"
        />
      </div>

      {/* Agent Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Agent Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Cpu className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Symptom Agent</p>
                  <p className="text-sm text-gray-600">Processing: Smart diagnosis</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Brain className="w-8 h-8 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Risk Agent</p>
                  <p className="text-sm text-gray-600">Monitoring health risks</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900">Optimization Agent</p>
                  <p className="text-sm text-gray-600">Performance tuning</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent AI Actions
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 py-2">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Auto-scaling initiated</p>
                <p className="text-xs text-gray-600">Increased server capacity by 25% due to traffic spike</p>
                <p className="text-xs text-gray-400">2 minutes ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3 py-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Risk assessment completed</p>
                <p className="text-xs text-gray-600">Processed 45 patient risk profiles</p>
                <p className="text-xs text-gray-400">5 minutes ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3 py-2">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Model optimization applied</p>
                <p className="text-xs text-gray-600">Updated prediction accuracy improved by 2.3%</p>
                <p className="text-xs text-gray-400">12 minutes ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3 py-2">
              <div className="w-2 h-2 rounded-full bg-orange-500 mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Anomaly detected</p>
                <p className="text-xs text-gray-600">Security pattern anomaly in API calls - auto-mitigated</p>
                <p className="text-xs text-gray-400">18 minutes ago</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* AI Operations Center */}
      <Card className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Operations Center</h3>
            <p className="text-sm text-gray-600">Monitor and control autonomous AI systems</p>
          </div>
          <div className="flex space-x-3">
            {data.operations.autonomousTasks > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-orange-100 text-orange-800 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">{data.operations.autonomousTasks} Tasks Active</span>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleTrainModels}
              disabled={isTraining}
              className="flex items-center gap-2"
            >
              <Brain className="w-4 h-4" />
              {isTraining ? 'Training...' : 'Train Models'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleOptimizeNow}
              disabled={isOptimizing}
              className="flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              {isOptimizing ? 'Optimizing...' : 'Optimize Now'}
            </Button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{data.aiAgents.totalDecisions}</p>
            <p className="text-sm text-gray-600">Decisions Made</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{data.operations.selfCorrections}</p>
            <p className="text-sm text-gray-600">Self-Corrections</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">98.7%</p>
            <p className="text-sm text-gray-600">Accuracy</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{data.operations.alertsGenerated}</p>
            <p className="text-sm text-gray-600">Alerts Generated</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
