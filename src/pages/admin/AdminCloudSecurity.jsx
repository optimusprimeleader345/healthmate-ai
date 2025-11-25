import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import {
  Shield,
  AlertTriangle,
  Lock,
  Eye,
  Database,
  Server,
  User,
  Key,
  Globe,
  CheckCircle,
  Scan,
  Plus,
  Users
} from 'lucide-react';

// Mock cloud security services
const cloudSecurityService = {
  // Security scan - comprehensive threat assessment
  performSecurityScan: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        alert('Cloud Security Scan Complete!\n\n🔍 SCAN RESULTS:\n✅ Infrastructure Scanned: 247 servers\n✅ Vulnerabilities Found: 3 (all low-risk)\n✅ Compliance Violations: 0\n✅ Malware Presence: Negative\n✅ Access Controls: Verified\n\n🛡️ SECURITY STATUS: SECURE\n🔒 Encryption: 100% active\n🚨 Threat Level: Low\n\n💡 Recommendations: All systems secure, continue monitoring');
        resolve();
      }, 3000);
    });
  },

  // Incident response - activate emergency protocols
  initiateIncidentResponse: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        alert('Emergency Incident Response Protocol Activated!\n\n🚨 INCIDENT RESPONSE INITIATED:\n✅ Security team alerted (5 members notified)\n✅ System backups isolated for forensic analysis\n✅ Network segmentation activated\n✅ Communication channels secured\n✅ Legal compliance protocols engaged\n✅ Stakeholder notification queued\n\n⏰ RESPONSE METRICS:\n• Time to detection: 12 seconds\n• Team mobilization: 4 minutes\n• Containment ETA: 30 minutes\n• Recovery projection: 2 hours\n\n🔐 All sensitive data encrypted and secured during incident response');
        resolve();
      }, 2500);
    });
  },

  // Emergency lockdown - complete system shutdown
  emergencyLockdown: async () => {
    const confirmLockdown = confirm('⚠️ EMERGENCY LOCKDOWN PROTOCOL ⚠️\n\nThis will:\n• Temporarily suspend all system access\n• Activate emergency backups\n• Isolate critical infrastructure\n• Notify emergency response teams\n\nAre you sure you want to proceed with emergency lockdown?');
    if (!confirmLockdown) return;

    return new Promise((resolve) => {
      setTimeout(() => {
        alert('🚨 EMERGENCY LOCKDOWN EXECUTED!\n\n🔒 SYSTEM STATUS: LOCKDOWN ACTIVE\n\n✅ Medical Records: Full isolation\n✅ Patient Data: Encrypted and secured\n✅ Emergency Access: Authorized personnel only\n✅ Backup Systems: Activated\n✅ Communication: Secure channels only\n✅ GPS Tracking: Disabled for patient privacy\n\n⏱️ ESTIMATED DURATION: 24-48 hours\n📞 SUPPORT: Emergency hotline active\n🔄 STATUS: All systems secured\n\n⚠️ Only emergency service personnel can access systems during lockdown');
        resolve();
      }, 4000);
    });
  },

  // Security audit - deep security assessment
  performSecurityAudit: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        alert('Comprehensive Security Audit Completed!\n\n🔎 AUDIT SUMMARY:\n\nACCESS CONTROLS:\n• Multi-factor authentication: 99.7% adoption\n• Admin permissions: Properly segregated\n• User access reviews: Monthly completed\n\nDATA PROTECTION:\n• Encryption at rest: 100% compliant\n• Network transmission: HTTPS only\n• Backup security: Verified encrypted\n\nTHREAT DETECTION:\n• Intrusion detection: 7 false positives eliminated\n• Malware scanning: All databases clean\n• Vulnerability assessment: 2 patches pending\n\nCOMPLIANCE STATUS:\n• GDPR/Privacy: 98.5% compliant\n• HIPAA/Security: 97.2% compliant\n• SOC 2/Type 2: Full certification\n\n📋 TOTAL ISSUES: 3 (all low-severity)\n✅ CRITICAL VULNERABILITIES: 0\n🟢 AUDIT RESULT: PASS');
        resolve();
      }, 3500);
    });
  },

  // Data protection - enhance security measures
  enhanceDataProtection: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        alert('Enhanced Data Protection Protocols Activated!\n\n🔐 SECURITY ENHANCEMENTS:\n✅ End-to-end encryption: Upgraded to AES-256\n✅ Data masking: Applied to sensitive fields\n✅ Audit logging: Enhanced (real-time)\n✅ Access monitoring: Advanced behavioral analysis\n✅ Tokenization: Implemented for card data\n✅ Backup encryption: Double-encryption layer\n\n🏥 PATIENT DATA PROTECTION:\n• Medical records: ZKP verification added\n• Personal information: Anonymized for analytics\n• Research data: De-identified per HIPAA\n• Emergency access: Secure bypass protocols\n\n📊 PROTECTION METRICS:\n• Data breach prevention: +95% confidence\n• Unauthorized access blocked: Enhanced monitoring\n• Privacy compliance: 100% maintained\n• Recovery time objective: Reduced by 40%\n\n✨ System now operates under maximum security protocols');
        resolve();
      }, 4000);
    });
  },

  // Rotation encryption keys - security maintenance
  rotateEncryptionKeys: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        alert('Encryption Key Rotation Complete!\n\n🔄 KEY ROTATION LOG:\n\n🔑 MASTER KEYS:\n• Database encryption: Rotated successfully\n• File system keys: Updated and deployed\n• API authentication: New tokens generated\n\n🗝️ APPLICATION KEYS:\n• User sessions: Invalidated and refreshed\n• API endpoints: New keys distributed\n• External integrations: Updated securely\n\n⏰ TIMING:\n• Total rotation time: 45 seconds\n• Zero downtime achieved\n• Rollback capability: Ready if needed\n\n🛡️ SECURITY IMPACT:\n• Forward secrecy: Maintained\n• Current sessions: Unaffected\n• Log continuity: Preserved\n• Data integrity: Verified\n\n🔧 Automated rotation scheduled every 24 hours\n✨ Security posture strengthened');
        resolve();
      }, 1500);
    });
  },

  // Create compliance report
  generateComplianceReport: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        alert('Compliance Status Report Generated!\n\n📋 COMPLIANCE METRICS SUMMARY:\n\n🇪🇺 GDPR COMPLIANCE: 98.5%\n• Privacy by design: Implemented\n• Data subject rights: Fully automated\n• DPIA requirements: All assessments complete\n• International transfers: SCC agreements active\n\n🏥 HIPAA COMPLIANCE: 97.2%\n• PHI handling: Audit trails active\n• Breach notification: 60-minute response SOP\n• Security risk analysis: Updated quarterly\n• Business associate agreements: 100% compliant\n\n🌐 ISO 27001 CERTIFIED: 99.1%\n• Information security management: Implemented\n• Risk treatment plans: Active monitoring\n• Internal audits: Monthly completed\n• Continuous improvement: Documented\n\n💳 PCI DSS COMPLIANCE: 96.8%\n• Card data protection: Tokenization active\n• Security testing: Quarterly completed\n• Incident response: Tested and ready\n• Network security: Segregated and monitored\n\n🎯 OVERALL COMPLIANCE: 97.9%\n📈 TREND: Improving (+2.3% vs last quarter)\n\n✅ RECOMMENDATIONS: Minor policy updates only');
        resolve();
      }, 2500);
    });
  }
};

const SecurityPanel = ({ title, value, unit, icon: Icon, status, details, color = 'blue' }) => {
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
            status === 'secure' ? 'bg-green-500' :
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

export default function AdminCloudSecurity() {
  const [securityData] = useState({
    threats: {
      active: 12,
      blocked: 47,
      quarantine: 8,
      resolved: 23
    },
    compliance: {
      gdpr: 98.5,
      hipaa: 97.2,
      iso: 99.1,
      pci: 96.8
    },
    incidents: [
      { id: 1, type: 'Unauthorized Access', severity: 'High', status: 'Investigating', time: '15 mins ago' },
      { id: 2, type: 'DDoS Attempt', severity: 'Medium', status: 'Mitigated', time: '1 hour ago' },
      { id: 3, type: 'Data Breach', severity: 'Critical', status: 'Contained', time: '2 hours ago' },
      { id: 4, type: 'Malware Detection', severity: 'Low', status: 'Quarantined', time: '3 hours ago' }
    ]
  });

  const [userActivity] = useState([
    { user: 'admin@healthmate.com', action: 'Failed login attempt', location: 'New York, US', time: '2 min ago' },
    { user: 'user123@example.com', action: 'Password changed', location: 'London, UK', time: '5 min ago' },
    { user: 'doctor.wang@clinic.cn', action: 'Multi-factor auth enabled', location: 'Beijing, CN', time: '8 min ago' },
    { user: 'suspect.account@external.com', action: 'Account blocked - suspicious activity', location: 'Unknown', time: '12 min ago' }
  ]);

  const [encryptionStatus] = useState({
    databaseEncrypted: 99.7,
    dataInTransit: 100,
    backupsEncrypted: 98.5,
    keysRotated: '24h ago'
  });

  const [isScanning, setIsScanning] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [isLockingDown, setIsLockingDown] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [isProtecting, setIsProtecting] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  // Handle security scan button
  const handleSecurityScan = async () => {
    setIsScanning(true);
    try {
      await cloudSecurityService.performSecurityScan();
    } finally {
      setIsScanning(false);
    }
  };

  // Handle incident response button
  const handleIncidentResponse = async () => {
    setIsResponding(true);
    try {
      await cloudSecurityService.initiateIncidentResponse();
    } finally {
      setIsResponding(false);
    }
  };

  // Handle emergency lockdown button
  const handleEmergencyLockdown = async () => {
    setIsLockingDown(true);
    try {
      await cloudSecurityService.emergencyLockdown();
    } finally {
      setIsLockingDown(false);
    }
  };

  // Handle security audit button
  const handleSecurityAudit = async () => {
    setIsAuditing(true);
    try {
      await cloudSecurityService.performSecurityAudit();
    } finally {
      setIsAuditing(false);
    }
  };

  // Handle data protection button
  const handleDataProtection = async () => {
    setIsProtecting(true);
    try {
      await cloudSecurityService.enhanceDataProtection();
    } finally {
      setIsProtecting(false);
    }
  };

  // Handle rotate encryption keys button
  const handleRotateKeys = async () => {
    setIsRotating(true);
    try {
      await cloudSecurityService.rotateEncryptionKeys();
    } finally {
      setIsRotating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enterprise Security Ops</h1>
          <p className="text-gray-600 mt-1">Cloud security operations center</p>
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
            variant="primary"
            size="sm"
            onClick={handleIncidentResponse}
            disabled={isResponding}
            className="flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            {isResponding ? 'Responding...' : 'Incident Response'}
          </Button>
        </div>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SecurityPanel
          title="Active Threats"
          value={securityData.threats.active}
          unit=""
          icon={AlertTriangle}
          status="warning"
          details="Being monitored"
          color="orange"
        />
        <SecurityPanel
          title="Blocked Attacks"
          value={securityData.threats.blocked}
          unit=""
          icon={Shield}
          status="secure"
          details="Past 24 hours"
          color="green"
        />
        <SecurityPanel
          title="Data Encrypted"
          value={encryptionStatus.databaseEncrypted}
          unit="%"
          icon={Lock}
          status="secure"
          details="At rest & in transit"
          color="blue"
        />
        <SecurityPanel
          title="Compliance Score"
          value={(securityData.compliance.gdpr + securityData.compliance.hipaa + securityData.compliance.iso + securityData.compliance.pci) / 4}
          unit="%"
          icon={CheckCircle}
          status="secure"
          details="Average across standards"
          color="green"
        />
      </div>

      {/* Security Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Security Incidents
          </h3>

          <div className="space-y-3">
            {securityData.incidents.map((incident) => (
              <div key={incident.id} className={`p-4 rounded-lg border-l-4 ${
                incident.severity === 'Critical' ? 'border-red-500 bg-red-50' :
                incident.severity === 'High' ? 'border-orange-500 bg-orange-50' :
                incident.severity === 'Medium' ? 'border-yellow-500 bg-yellow-50' :
                'border-green-500 bg-green-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{incident.type}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    incident.severity === 'Critical' ? 'bg-red-200 text-red-800' :
                    incident.severity === 'High' ? 'bg-orange-200 text-orange-800' :
                    incident.severity === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-green-200 text-green-800'
                  }`}>
                    {incident.severity}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status: {incident.status}</span>
                  <span className="text-sm text-gray-500">{incident.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Global Security Coverage
          </h3>

          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">GDPR Compliance</span>
                <span className="text-lg font-bold text-green-600">{securityData.compliance.gdpr}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${securityData.compliance.gdpr}%` }}></div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">HIPAA Compliance</span>
                <span className="text-lg font-bold text-blue-600">{securityData.compliance.hipaa}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${securityData.compliance.hipaa}%` }}></div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">ISO 27001</span>
                <span className="text-lg font-bold text-purple-600">{securityData.compliance.iso}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${securityData.compliance.iso}%` }}></div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">PCI DSS</span>
                <span className="text-lg font-bold text-orange-600">{securityData.compliance.pci}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full" style={{ width: `${securityData.compliance.pci}%` }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* User Activity & Encryption */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Recent User Activity
          </h3>

          <div className="space-y-3">
            {userActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 py-2 border-b border-gray-200 last:border-0">
                <div className="w-2 h-2 rounded-full bg-gray-400 mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{activity.location}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-400">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Encryption Status
          </h3>

          <div className="space-y-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600 mb-1">{encryptionStatus.dataInTransit}%</p>
              <p className="text-sm text-gray-600">Data in Transit Encrypted</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Database Encryption</span>
                <span className="font-medium text-gray-900">{encryptionStatus.databaseEncrypted}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Backup Encryption</span>
                <span className="font-medium text-gray-900">{encryptionStatus.backupsEncrypted}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Keys Last Rotated</span>
                <span className="font-medium text-gray-900">{encryptionStatus.keysRotated}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handleRotateKeys}
              disabled={isRotating}
              className="w-full flex items-center gap-2"
            >
              <Key className="w-4 h-4" />
              {isRotating ? 'Rotating Keys...' : 'Rotate Encryption Keys'}
            </Button>
          </div>
        </Card>
      </div>

      {/* Security Operations Center */}
      <Card className="p-6 bg-gradient-to-r from-red-50 to-pink-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Cloud Security Operations Center</h3>
            <p className="text-sm text-gray-600">Comprehensive cloud security monitoring and response</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSecurityAudit}
              disabled={isAuditing}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {isAuditing ? 'Auditing...' : 'Security Audit'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDataProtection}
              disabled={isProtecting}
              className="flex items-center gap-2"
            >
              <Database className="w-4 h-4" />
              {isProtecting ? 'Enhancing...' : 'Data Protection'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleEmergencyLockdown}
              disabled={isLockingDown}
              className="flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              {isLockingDown ? 'Locking Down...' : 'Emergency Lockdown'}
            </Button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{securityData.threats.quarantine}</p>
            <p className="text-sm text-gray-600">Files Quarantined</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{securityData.threats.resolved}</p>
            <p className="text-sm text-gray-600">Incidents Resolved</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">3</p>
            <p className="text-sm text-gray-600">Active SIEM Rules</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">24/7</p>
            <p className="text-sm text-gray-600">Response Time</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
