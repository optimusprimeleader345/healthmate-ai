import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Search, Bell, User, LogOut, Shield } from 'lucide-react'
import { Input } from './Input'
import CloudSyncBadge from './CloudSyncBadge'
import { useAuth } from '../contexts/AuthContext'
import { getUnreadNotificationCount, generateMorningSummary, saveNotification } from '../utils/smartNotifications'

const Topbar = () => {
  const navigate = useNavigate()
  const { user, signOut, isAdmin } = useAuth()
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle')
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // Update notification count periodically
  useEffect(() => {
    const interval = setInterval(() => {
      // Update sync status
      const now = new Date().toISOString()
      setLastSyncTime(now)
      setSyncStatus('idle')

      // Update notification count
      setUnreadCount(getUnreadNotificationCount())
    }, 1000) // Update every second

    // Generate welcome notification on first load
    if (getUnreadNotificationCount() === 0) {
      const welcomeNotification = {
        type: 'tip',
        timestamp: new Date(),
        title: "🎉 Welcome to HealthMate!",
        message: "Thank you for choosing HealthMate! Start by exploring your dashboard or scheduling a telemedicine appointment.",
        category: 'welcome',
        isRead: false
      };
      saveNotification(welcomeNotification);
    }

    // Initial count
    setUnreadCount(getUnreadNotificationCount())

    return () => clearInterval(interval)
  }, [])

  const handleLogout = async () => {
    try {
      setShowUserMenu(false)
      await signOut()
      // Navigate to login page after signing out
      navigate('/login', { replace: true })
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <header className="flex h-16 items-center justify-between backdrop-blur-2xl bg-white/50 border border-white/40 shadow-sm rounded-2xl px-6">
      {/* Search bar */}
      <div className="flex flex-1 items-center justify-center lg:justify-start">
        <div className="relative w-96 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search health records..."
            className="rounded-full border-gray-200 bg-gray-50 pl-10 pr-4 shadow-sm focus:bg-white"
          />
        </div>
      </div>

      {/* Right side: Icons */}
      <div className="flex items-center gap-4">
        {/* Cloud Sync Badge */}
        <CloudSyncBadge
          status={syncStatus}
          lastSyncTime={lastSyncTime}
          className="text-xs"
        />

        {/* Admin Badge - shows for admin users */}
        {isAdmin && (
          <div className="flex items-center gap-1 text-xs text-purple-700 bg-purple-100 px-2 py-1 rounded-full">
            <Shield className="h-3 w-3" />
            Admin
          </div>
        )}

        {/* Notifications */}
        <button
          onClick={() => window.location.href = '#/dashboard/notifications'}
          className="rounded-lg p-2 text-gray-600 hover:text-gray-800 relative transition-colors"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full min-w-[20px] h-5">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {/* User Avatar with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="text-sm font-semibold">
              {user?.avatar || '👤'}
            </span>
          </button>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                    <span className="text-lg">{user?.avatar || '👤'}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{user?.name || 'User'}</div>
                    <div className="text-sm text-gray-600">{user?.email}</div>
                    <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
                  </div>
                </div>
              </div>

              <div className="p-2">
                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    // Could add profile/settings navigation here
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Profile & Settings
                </button>

                <hr className="my-1" />

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Topbar
