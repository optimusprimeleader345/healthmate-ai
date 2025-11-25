import React, { useState } from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import {
  Shield,
  Lock,
  AlertTriangle,
  Trash2,
  Eye,
  EyeOff,
  Key
} from 'lucide-react'
import { getMockSessions, getMockLoginHistory, getSecurityStatus } from "../utils/securityUtils";
import SecurityStatusCard from "../components/SecurityStatusCard";
import DeviceSessionCard from "../components/DeviceSessionCard";
import LoginHistoryRow from "../components/LoginHistoryRow";
import PrivacyToggle from "../components/PrivacyToggle";

const Security = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const status = getSecurityStatus();
  const sessionsMock = getMockSessions();
  const history = getMockLoginHistory();
  const [privacyMode, setPrivacyMode] = useState(false);

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters long')
      return
    }
    console.log('Changing password')
    // Add password change logic here
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const handleDeleteAccount = () => {
    console.log('Deleting account')
    // Add account deletion logic here
    setShowDeleteModal(false)
  }

  // Mock session data
  const sessions = [
    { device: 'Chrome on Windows', location: 'Mumbai, India', current: true },
    { device: 'Safari on iPhone', location: 'Mumbai, India', current: false },
    { device: 'Chrome on MacBook', location: 'Mumbai, India', current: false }
  ]

  const handleRevokeSession = (device) => {
    console.log(`Revoking session for ${device}`)
  }

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
          <Shield className="w-8 h-8 mr-3 text-primary-500" />
          Security
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your account security and privacy settings.
        </p>
      </div>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Security Overview</h2>
        <SecurityStatusCard
          riskLevel={status.riskLevel}
          lastPasswordChange={status.lastPasswordChange}
          mfaEnabled={status.mfaEnabled}
          privacyMode={privacyMode}
        />
        <div className="mt-4">
          <PrivacyToggle privacyMode={privacyMode} setPrivacyMode={setPrivacyMode} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Active Device Sessions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sessionsMock.map((s, idx) => (
            <DeviceSessionCard key={idx} {...s} privacyMode={privacyMode} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Login History</h2>
        <div className="divide-y rounded-lg border bg-white shadow-sm">
          {history.map((row, idx) => (
            <LoginHistoryRow key={idx} {...row} privacyMode={privacyMode} />
          ))}
        </div>
      </section>

      {/* Change Password */}
      <section className="space-y-6">
        <Card className="p-6 rounded-2xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Lock className="w-5 h-5 mr-2 text-primary-500" />
            Change Password
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <div className="pt-4">
              <Button
                onClick={handlePasswordChange}
                disabled={!currentPassword || !newPassword || !confirmPassword}
                className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-xl shadow-md font-medium transition-all duration-200"
              >
                Change Password
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Session Devices */}
      <section className="space-y-6">
        <Card className="p-6 rounded-2xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Key className="w-5 h-5 mr-2 text-primary-500" />
            Session Devices
          </h2>
          <div className="space-y-4">
            {sessions.map((session, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-neutral-100">
                    <Shield className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{session.device}</p>
                    <p className="text-sm text-gray-600">{session.location}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {session.current && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Current
                    </span>
                  )}
                  {!session.current && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRevokeSession(session.device)}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Account Deletion */}
      <section className="space-y-6">
        <Card className="p-6 rounded-2xl border-red-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
            Danger Zone
          </h2>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-red-50 border border-red-200">
              <div className="flex items-start space-x-3">
                <Trash2 className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900">Delete Account</h3>
                  <p className="text-sm text-red-700 mt-1">
                    Permanently delete your account and all associated data.
                    This action cannot be undone.
                  </p>
                  <Button
                    onClick={() => setShowDeleteModal(true)}
                    className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl shadow-md font-medium transition-all duration-200"
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 rounded-2xl max-w-md w-full mx-4">
            <div className="text-center">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Account</h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to permanently delete your account?
                All your data will be lost and this cannot be undone.
              </p>
              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowDeleteModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteAccount}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default Security
