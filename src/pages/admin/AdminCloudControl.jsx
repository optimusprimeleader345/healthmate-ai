import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import {
  Server,
  Settings,
  Globe,
  Zap,
  Shield,
  Database,
  Network,
  Cloud,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const cloudControlService = {
  configureCloud: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        alert('Cloud configuration applied successfully!\n\n- Scaling policies updated\n- Load balancer configured\n- Security groups optimized\n\n(Demo - Would update cloud infrastructure in production)');
        resolve();
      }, 2500);
    });
  },
  deployUpdate: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        alert('Cloud deployment initiated!\n\n🚀 Rolling update started\n📊 Monitoring active clusters\n⏱️ ETA: 5 minutes\n\n(Demo - Would deploy to real cloud environment in production)');
        resolve();
      }, 3000);
    });
  },
  runSecurityScan: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        alert('Cloud Security Scan Complete!\n\n✅ 23 servers scanned\n🛡️ Security patches applied\n⚠️ 2 minor vulnerabilities resolved\n🔒 Compliance: 98.5%\n\n(Demo - Would scan real infrastructure in production)');
        resolve();
      }, 2000);
    });
  },
  executeBackup: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        alert('Cloud Backup Successfully Executed!\n\n💾 1.2TB backed up\n🏔️ Multi-region redundancy\n🔄 Incremental backup completed\n⏰ Last backup: Just now\n\n(Demo - Would backup to cloud storage in production)');
        resolve();
      }, 1800);
    });
  }
};

const CloudControlPanel = ({ title, value, unit, icon: Icon, status, color = 'blue' }) => {
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
          <p className={`text-xs px-2 py-1 rounded-full inline-block ${
            status === 'online' ? 'bg-green-500' :
            status === 'warning' ? 'bg-yellow-500' :
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

export default function AdminCloudControl() {
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [lastAction, setLastAction] = useState('');

  const [cloudMetrics] = useState({
    servers: { count: 12, online: 11, warning: 1, offline: 0 },
    databases: { instances: 3, connections: 67, latency: 12, load: 42 },
    networks: { bandwidth: 95, vpn: 8, cdn: 4, api: 156 }
  });

  const handleConfigure = async () => {
    setIsConfiguring(true);
    setLastAction('');
    try {
      await cloudControlService.configureCloud();
      setLastAction('Cloud configuration completed successfully!');
    } catch (error) {
      setLastAction('Configuration failed. Please try again.');
    } finally {
      setIsConfiguring(false);
    }
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    setLastAction('');
    try {
      await cloudControlService.deployUpdate();
      setLastAction('Cloud deployment completed successfully!');
    } catch (error) {
      setLastAction('Deployment failed. Please try again.');
    } finally {
      setIsDeploying(false);
    }
  };

  const handleSecurityScan = async () => {
    setIsScanning(true);
    setLastAction('');
    try {
      await cloudControlService.runSecurityScan();
      setLastAction('Security scan completed successfully!');
    } catch (error) {
      setLastAction('Security scan failed. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleBackup = async () => {
    setIsBackingUp(true);
    setLastAction('');
    try {
      await cloudControlService.executeBackup();
      setLastAction('Cloud backup completed successfully!');
    } catch (error) {
      setLastAction('Backup failed. Please try again.');
    } finally {
      setIsBackingUp(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cloud Control Center</h1>
          <p className="text-gray-600 mt-1">Quantum-ready cloud infrastructure management</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm" onClick={handleConfigure} disabled={isConfiguring} className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            {isConfiguring ? 'Configuring...' : 'Configure'}
          </Button>
          <Button variant="primary" size="sm" onClick={handleDeploy} disabled={isDeploying} className="flex items-center gap-2">
            <Server className="w-4 h-4" />
            {isDeploying ? 'Deploying...' : 'Deploy'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CloudControlPanel
          title="Active Servers"
          value={cloudMetrics.servers.online}
          unit=" online"
          icon={Server}
          status="online"
          color="blue"
        />
        <CloudControlPanel
          title="Server Load"
          value={cloudMetrics.databases.load}
          unit="%"
          icon={Zap}
          status="normal"
          color="green"
        />
        <CloudControlPanel
          title="Network I/O"
          value={cloudMetrics.networks.bandwidth}
          unit="%"
          icon={Network}
          status="optimal"
          color="purple"
        />
        <CloudControlPanel
          title="Cloud Security"
          value="99.9"
          unit="%"
          icon={Shield}
          status="secured"
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Server className="w-5 h-5" />
            Server Status
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Server-01 (Primary)</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Online</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Server-02 (Backup)</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Online</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Server-03 (Backup)</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Warning</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Database className="w-5 h-5" />
            Database Instances
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">HealthMate DB</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Analytics DB</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Archive DB</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Cloud Operations Center</h3>
            <p className="text-sm text-gray-600">Manage cloud infrastructure and deploy updates</p>
            {lastAction && (
              <div className={`p-3 rounded-lg mt-3 flex items-center gap-2 text-sm font-medium ${lastAction.includes('success') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {lastAction.includes('success') ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                <span>{lastAction}</span>
              </div>
            )}
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSecurityScan}
              disabled={isScanning}
              className="flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              {isScanning ? 'Scanning...' : 'Security Scan'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackup}
              disabled={isBackingUp}
              className="flex items-center gap-2"
            >
              <Cloud className="w-4 h-4" />
              {isBackingUp ? 'Backing Up...' : 'Backup Now'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
