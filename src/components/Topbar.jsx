import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Settings, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import NotificationCenter from './ui/NotificationCenter';

const Topbar = () => {
  const navigate = useNavigate();
  const { user, userProfile, signOut, isAdmin } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-xl font-bold text-blue-600">
            HealthMate
          </Link>

          {isAdmin && (
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
              Admin
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications Bell */}
          <button
            onClick={() => setNotificationsOpen(true)}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {/* Notification badge - show for demo */}
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            <div className="text-right text-sm">
              <div className="font-medium text-gray-900">
                {userProfile?.displayName || userProfile?.name || 'User'}
              </div>
              <div className="text-gray-500 text-xs">
                {userProfile?.email || user?.email}
              </div>
            </div>

            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>

            {/* Dropdown Menu */}
            <div className="relative ml-2">
              <div className="flex gap-1">
                <Link
                  to="/settings"
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Settings"
                >
                  <Settings className="w-5 h-5" />
                </Link>

                <button
                  onClick={handleSignOut}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Center */}
      <NotificationCenter
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </>
  );
};

export default Topbar;
