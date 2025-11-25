import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dailyAgent from '../automation/dailyAgent';
import useTutorial from '../hooks/useTutorial';
import { exportHealthDataJSON, exportHealthDataCSV } from '../utils/dataExport';
import PremiumFeatureGate from '../components/PremiumFeatureGate';

// Icons
import {
  Bell,
  FileText,
  Lock,
  Moon,
  Sun,
  User,
  Shield,
  Database,
  Download,
  Settings as SettingsIcon,
  Camera,
  Heart,
  Mail,
  Globe,
  Cloud,
  Server,
  Users,
  Key,
  BarChart3,
  AlertTriangle,
  Zap,
  FileCheck,
  Building,
  Network,
  Activity,
  Clock,
  Smartphone
} from 'lucide-react';

// Components
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

const Settings = () => {
  const navigate = useNavigate();
  const { actions: { resetTutorial } } = useTutorial();

  // Add customer service function
  const contactSupport = () => {
    const subject = encodeURIComponent('HealthMate App Support Request');
    const body = encodeURIComponent(`Hello HealthMate Support Team,

I need assistance with the HealthMate application. Please help me with the following:

[Describe your issue here]

Application Version: ${process.env.REACT_APP_VERSION || 'Unknown'}
Browser: ${navigator.userAgent}
Timestamp: ${new Date().toISOString()}

Thank you!

Best regards,
HealthMate User`);

    // Open email client with pre-filled support email
    window.open(`mailto:support@healthmate.app?subject=${subject}&body=${body}`, '_blank');
  };

  // State management
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    healthAlerts: true,
    medicationReminders: true,
    workoutReminders: false,
    weeklyReports: true,
    securityAlerts: true
  });
  const [privacySettings, setPrivacySettings] = useState({
    dataSharing: false,
    analyticsTracking: true,
    thirdPartyAccess: false
  });

  // Profile state
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: null
  });

  // Security state
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    biometricEnabled: false
  });

  // Handle exports
  const handleDataExport = (format) => {
    try {
      if (format === 'json') {
        exportHealthDataJSON();
      } else {
        exportHealthDataCSV();
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  // Toggle settings
  const toggleNotification = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const togglePrivacy = (key) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleSecurity = (key) => {
    setSecurity(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <SettingsIcon className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        </div>

        {/* Profile Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Profile Settings</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <Input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <Input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <Input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
              <div className="flex items-center gap-2">
                <Button variant="secondary" className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Upload Photo
                </Button>
                {profile.avatar && (
                  <img src={profile.avatar} alt="Profile" className="w-10 h-10 rounded-full" />
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Appearance Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            {darkMode ? <Moon className="h-6 w-6 text-blue-600" /> : <Sun className="h-6 w-6 text-blue-600" />}
            <h2 className="text-xl font-semibold">Appearance</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Dark Mode</h3>
              <p className="text-sm text-gray-600">Switch to dark theme</p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                darkMode ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>
          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</h3>
                  <p className="text-sm text-gray-600">
                    {key === 'healthAlerts' && 'Critical health alerts and emergency notifications'}
                    {key === 'medicationReminders' && 'Medication schedule reminders'}
                    {key === 'workoutReminders' && 'Fitness and workout reminders'}
                    {key === 'weeklyReports' && 'Weekly health summary reports'}
                    {key === 'securityAlerts' && 'Security and login notifications'}
                  </p>
                </div>
                <button
                  onClick={() => toggleNotification(key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Privacy & Security */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Privacy & Security</h2>
          </div>
          <div className="space-y-6">
            {/* Privacy Settings */}
            <div>
              <h3 className="font-medium mb-4">Privacy Settings</h3>
              <div className="space-y-4">
                {Object.entries(privacySettings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</h4>
                      <p className="text-sm text-gray-600">
                        {key === 'dataSharing' && 'Share anonymized data for research'}
                        {key === 'analyticsTracking' && 'Help improve app with usage analytics'}
                        {key === 'thirdPartyAccess' && 'Allow third-party app integrations'}
                      </p>
                    </div>
                    <button
                      onClick={() => togglePrivacy(key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Settings */}
            <div>
              <h3 className="font-medium mb-4">Security Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                  </div>
                  <PremiumFeatureGate feature="2fa">
                    <button
                      onClick={() => toggleSecurity('twoFactorAuth')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        security.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          security.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </PremiumFeatureGate>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Biometric Authentication</h4>
                    <p className="text-sm text-gray-600">Use fingerprint or face recognition</p>
                  </div>
                  <button
                    onClick={() => toggleSecurity('biometricEnabled')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      security.biometricEnabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        security.biometricEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Data Export */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Database className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Data Management</h2>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Export Your Health Data</h3>
              <p className="text-sm text-gray-600 mb-4">
                Download your health data in JSON or CSV format for backup or analysis.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => handleDataExport('json')}
                  className="flex items-center gap-2"
                  variant="secondary"
                >
                  <Download className="h-4 w-4" />
                  Export JSON
                </Button>
                <Button
                  onClick={() => handleDataExport('csv')}
                  className="flex items-center gap-2"
                  variant="secondary"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Customer Service */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Customer Service</h2>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Contact Support</h3>
              <p className="text-sm text-gray-600 mb-4">
                Need help or have questions? We're here to assist you 24/7.
              </p>
              <Button
                onClick={contactSupport}
                className="flex items-center gap-2"
                variant="secondary"
              >
                <Mail className="h-4 w-4" />
                Email Support
              </Button>
            </div>

            <div>
              <h3 className="font-medium mb-2">Frequently Asked Questions</h3>
              <p className="text-sm text-gray-600 mb-4">
                Check our knowledge base for answers to common questions.
              </p>
              <Button variant="secondary">
                View FAQ
              </Button>
            </div>
          </div>
        </Card>

        {/* App Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <SettingsIcon className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">App Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Reset Tutorial</h3>
              <p className="text-sm text-gray-600 mb-3">
                Start the onboarding tutorial from the beginning.
              </p>
              <Button onClick={resetTutorial} variant="secondary">
                Reset Tutorial
              </Button>
            </div>

            <div>
              <h3 className="font-medium mb-2">Run Daily Health Agent</h3>
              <p className="text-sm text-gray-600 mb-3">
                Manually trigger the daily health analysis and insights generation.
              </p>
              <Button
                onClick={() => dailyAgent.runDailyAutomation()}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <Heart className="h-4 w-4" />
                Run Daily Analysis
              </Button>
            </div>
          </div>
        </Card>

        {/* Enterprise Integration */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Building className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Enterprise Integration</h2>
          </div>
          <div className="space-y-6">
            {/* SSO & Authentication */}
            <div>
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Key className="h-5 w-5 text-gray-600" />
                SSO & Authentication
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">SAML SSO Integration</h4>
                    <p className="text-sm text-gray-600">Enable single sign-on with corporate identity provider</p>
                  </div>
                  <PremiumFeatureGate feature="sso">
                    <button className="bg-gray-200 text-gray-600 px-3 py-1 rounded-lg text-sm">
                      Configure SAML
                    </button>
                  </PremiumFeatureGate>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">SCIM User Provisioning</h4>
                    <p className="text-sm text-gray-600">Automatic user management and synchronization</p>
                  </div>
                  <PremiumFeatureGate feature="scim">
                    <button className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700">
                      Configure SCIM
                    </button>
                  </PremiumFeatureGate>
                </div>
              </div>
            </div>

            {/* API Management */}
            <div>
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Network className="h-5 w-5 text-gray-600" />
                API & Integrations
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">API Keys Management</h4>
                    <p className="text-sm text-gray-600">Manage API access tokens and permissions</p>
                  </div>
                  <button className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700">
                    Manage Keys
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Webhook Endpoints</h4>
                    <p className="text-sm text-gray-600">Configure real-time data streaming to external systems</p>
                  </div>
                  <button className="bg-purple-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-purple-700">
                    Configure Webhooks
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Advanced Analytics & Monitoring */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Analytics & Monitoring</h2>
          </div>
          <div className="space-y-6">
            {/* Usage Analytics */}
            <div>
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-gray-600" />
                System Analytics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Performance Metrics</h4>
                    <p className="text-sm text-gray-600">Monitor system performance and response times</p>
                  </div>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700">
                    View Metrics
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Usage Statistics</h4>
                    <p className="text-sm text-gray-600">Detailed analytics on feature adoption and usage patterns</p>
                  </div>
                  <button className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-indigo-700">
                    View Reports
                  </button>
                </div>
              </div>
            </div>

            {/* System Monitoring */}
            <div>
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-gray-600" />
                System Health
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Error Monitoring</h4>
                    <p className="text-sm text-gray-600">Real-time error tracking and alerting system</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">All Systems Operational</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Security Alerts</h4>
                    <p className="text-sm text-gray-600">Monitor security events and potential threats</p>
                  </div>
                  <button className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700">
                    Review Incidents
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Compliance & Data Governance */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <FileCheck className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Compliance & Data Governance</h2>
          </div>
          <div className="space-y-6">
            {/* GDPR & Privacy */}
            <div>
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-gray-600" />
                Data Privacy
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">GDPR Compliance Mode</h4>
                    <p className="text-sm text-gray-600">Enhanced privacy controls for EU data protection</p>
                  </div>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700">
                    GDPR Settings
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">HIPAA Compliance</h4>
                    <p className="text-sm text-gray-600">Healthcare data protection standards</p>
                  </div>
                  <PremiumFeatureGate feature="hipaa">
                    <button className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700">
                      HIPAA Mode
                    </button>
                  </PremiumFeatureGate>
                </div>
              </div>
            </div>

            {/* Data Retention */}
            <div>
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-600" />
                Data Lifecycle
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Retention Policies</h4>
                    <p className="text-sm text-gray-600">Configure automatic data deletion schedules</p>
                  </div>
                  <button className="bg-orange-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-orange-700">
                    Set Policies
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Audit Logs</h4>
                    <p className="text-sm text-gray-600">Comprehensive logging of all data access and modifications</p>
                  </div>
                  <button className="bg-gray-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-700">
                    View Logs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Global Infrastructure */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Global Infrastructure</h2>
          </div>
          <div className="space-y-6">
            {/* Multi-Region */}
            <div>
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Server className="h-5 w-5 text-gray-600" />
                Data Residency
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Primary Region</h4>
                    <p className="text-sm text-gray-600">EU-West (Frankfurt) - Selected for GDPR compliance</p>
                  </div>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700">
                    Change Region
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Cross-Region Replication</h4>
                    <p className="text-sm text-gray-600">Automated data synchronization across geographies</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cloud Services */}
            <div>
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Cloud className="h-5 w-5 text-gray-600" />
                Cloud Integration
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">AWS Integration</h4>
                    <p className="text-sm text-gray-600">Direct integration with corporate cloud infrastructure</p>
                  </div>
                  <PremiumFeatureGate feature="aws-integration">
                    <button className="bg-orange-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-orange-700">
                      Configure AWS
                    </button>
                  </PremiumFeatureGate>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Azure Kubernetes</h4>
                    <p className="text-sm text-gray-600">Containerized deployment on AKS</p>
                  </div>
                  <button className="bg-blue-700 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-800">
                    Manage Clusters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Team Collaboration */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Users className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Team & Collaboration</h2>
          </div>
          <div className="space-y-6">
            {/* User Management */}
            <div>
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-600" />
                User Management
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Team Members</h4>
                    <p className="text-sm text-gray-600">Manage team access and role assignments</p>
                  </div>
                  <button className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700">
                    Manage Team
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Role-Based Access</h4>
                    <p className="text-sm text-gray-600">Configure granular permissions and data access controls</p>
                  </div>
                  <button className="bg-purple-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-purple-700">
                    Configure RBAC
                  </button>
                </div>
              </div>
            </div>

            {/* Collaboration Features */}
            <div>
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-gray-600" />
                Advanced Features
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Shared Dashboards</h4>
                    <p className="text-sm text-gray-600">Create collaborative health dashboards for teams</p>
                  </div>
                  <PremiumFeatureGate feature="collaboration">
                    <button className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-indigo-700">
                      Create Shared
                    </button>
                  </PremiumFeatureGate>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Workflow Automation</h4>
                    <p className="text-sm text-gray-600">Automate health monitoring and reporting workflows</p>
                  </div>
                  <button className="bg-teal-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-teal-700">
                    Configure Workflows
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Mobile & Device Management */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Smartphone className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Mobile & Device Management</h2>
          </div>
          <div className="space-y-6">
            {/* Device Policies */}
            <div>
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-gray-600" />
                Device Policies
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">MDM Integration</h4>
                    <p className="text-sm text-gray-600">Centralized mobile device management</p>
                  </div>
                  <PremiumFeatureGate feature="mdm">
                    <button className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700">
                      Configure MDM
                    </button>
                  </PremiumFeatureGate>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Remote Wipe</h4>
                    <p className="text-sm text-gray-600">Emergency data removal from lost or stolen devices</p>
                  </div>
                  <button className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700">
                    Configure Wipe
                  </button>
                </div>
              </div>
            </div>

            {/* App Deployment */}
            <div>
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Server className="h-5 w-5 text-gray-600" />
                Enterprise App Store
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Private App Distribution</h4>
                    <p className="text-sm text-gray-600">Deploy custom health apps to enterprise devices</p>
                  </div>
                  <button className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700">
                    Manage Apps
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Zero-Trust Security</h4>
                    <p className="text-sm text-gray-600">Device-level security verification and continuous monitoring</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Enabled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Save Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </Button>
          <Button>
            Save Changes
          </Button>
        </div>
    </div>
  );
};

export default Settings;
