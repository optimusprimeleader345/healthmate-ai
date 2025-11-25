import React, { useState, useEffect } from 'react';
import { Bell, Check, Clock, AlertTriangle, Trophy, Lightbulb, Heart, Trash, Trash2 } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import PremiumFeatureGate from '../components/PremiumFeatureGate';
import {
  getNotificationHistory,
  markNotificationAsRead,
  getUnreadNotificationCount,
  generateMorningSummary,
  saveNotification,
  NOTIFICATION_TYPES
} from '../utils/smartNotifications';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const notificationHistory = getNotificationHistory();
    setNotifications(notificationHistory);
  };

  const handleMarkAsRead = (notificationId) => {
    markNotificationAsRead(notificationId);
    loadNotifications();
  };

  const handleMarkAllAsRead = () => {
    notifications.forEach(notification => {
      if (!notification.isRead) {
        markNotificationAsRead(notification.timestamp.getTime());
      }
    });
    loadNotifications();
  };

  const handleClearOldNotifications = () => {
    if (window.confirm('Are you sure you want to clear notifications older than 30 days? This action cannot be undone.')) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const updatedNotifications = notifications.filter(notification => {
        return notification.timestamp > thirtyDaysAgo;
      });

      // In a real app, this would be saved to localStorage or database
      // For now, we'll just filter in memory
      setNotifications(updatedNotifications);
    }
  };

  const handleClearAllNotifications = () => {
    if (window.confirm('Are you sure you want to clear ALL notifications? This action cannot be undone.')) {
      setNotifications([]);
      // In a real app, clear localStorage
    }
  };

  const generateTestNotification = (type) => {
    let newNotification;

    switch (type) {
      case 'morning':
        newNotification = generateMorningSummary();
        break;
      case 'medication':
        newNotification = {
          type: NOTIFICATION_TYPES.MEDICATION_REMINDER,
          timestamp: new Date(),
          title: "💊 Medication Reminder",
          message: "Time to take your evening medication. Stay on track with your health!",
          urgent: true,
          medication: "Multivitamin"
        };
        break;
      case 'alert':
        newNotification = {
          type: NOTIFICATION_TYPES.HEALTH_ALERT,
          timestamp: new Date(),
          title: "❤️ Health Alert",
          message: "Your resting heart rate has been slightly elevated for 3 days. Consider monitoring this.",
          severity: 'medium'
        };
        break;
      case 'achievement':
        newNotification = {
          type: NOTIFICATION_TYPES.ACHIEVEMENT,
          timestamp: new Date(),
          title: "🏃‍♀️ Week Champion!",
          message: "Congratulations! You've completed all your health goals this week!",
          icon: "🏆"
        };
        break;
      default:
        return;
    }

    newNotification.isRead = false;
    saveNotification(newNotification);
    loadNotifications();
    setShowGenerateModal(false);
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    return notification.type === filter;
  });

  const unreadCount = getUnreadNotificationCount();

  const getNotificationIcon = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.MORNING_SUMMARY:
        return <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full flex items-center justify-center text-white text-lg">🌅</div>;
      case NOTIFICATION_TYPES.MEDICATION_REMINDER:
        return <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg">💊</div>;
      case NOTIFICATION_TYPES.HEALTH_ALERT:
        return <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-lg">⚠️</div>;
      case NOTIFICATION_TYPES.ACHIEVEMENT:
        return <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-lg">🏆</div>;
      case NOTIFICATION_TYPES.TIP:
        return <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-lg">💡</div>;
      default:
        return <Bell className="h-6 w-6 text-gray-400" />;
    }
  };

  const renderMorningSummary = (notification) => (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-lg">Health Score</h4>
          <div className="text-3xl font-bold text-blue-600">{notification.healthScore}/100</div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="bg-white/50 rounded p-2">
            <div className="text-xs text-gray-600">Sleep</div>
            <div className="font-semibold">{notification.summaryData.sleepHours.toFixed(1)} hrs</div>
          </div>
          <div className="bg-white/50 rounded p-2">
            <div className="text-xs text-gray-600">Steps</div>
            <div className="font-semibold">{notification.summaryData.steps.toLocaleString()}</div>
          </div>
          <div className="bg-white/50 rounded p-2">
            <div className="text-xs text-gray-600">Heart Rate</div>
            <div className="font-semibold">{notification.summaryData.heartRateAvg} bpm</div>
          </div>
          <div className="bg-white/50 rounded p-2">
            <div className="text-xs text-gray-600">Water</div>
            <div className="font-semibold">{notification.summaryData.waterIntake} cups</div>
          </div>
        </div>
      </div>

      {notification.mood && (
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <h5 className="font-medium text-green-800 dark:text-green-200 mb-1">Mood</h5>
          <p className="text-green-700 dark:text-green-300">{notification.mood}</p>
        </div>
      )}

      {notification.insights?.length > 0 && (
        <div>
          <h5 className="font-medium mb-2">Key Insights</h5>
          <ul className="space-y-1">
            {notification.insights.map((insight, index) => (
              <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {notification.recommendations?.length > 0 && (
        <div>
          <h5 className="font-medium mb-2 text-blue-700 dark:text-blue-300">💡 Recommendations</h5>
          <ul className="space-y-1">
            {notification.recommendations.map((rec, index) => (
              <li key={index} className="text-sm text-blue-600 dark:text-blue-400 flex items-start gap-2">
                <span className="mt-1">▶</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <PremiumFeatureGate
      feature="smartNotifications"
      upgradeMessage="Unlock intelligent morning health summaries, medication reminders, and personalized health alerts with Premium."
    >
      <div className="min-h-screen bg-[#F5F7FA] p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Bell className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Smart Notifications</h1>
              <p className="text-gray-600">Your personalized health insights and reminders</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setShowGenerateModal(true)}
              variant="secondary"
              size="sm"
            >
              Add Test Notification
            </Button>
            {unreadCount > 0 && (
              <Button
                onClick={handleMarkAllAsRead}
                variant="outline"
                size="sm"
              >
                <Check className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
            <div className="text-sm text-gray-600">Unread</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {notifications.filter(n => n.type === NOTIFICATION_TYPES.MORNING_SUMMARY).length}
            </div>
            <div className="text-sm text-gray-600">Health Summaries</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {notifications.filter(n => n.type === NOTIFICATION_TYPES.MEDICATION_REMINDER).length}
            </div>
            <div className="text-sm text-gray-600">Med Reminders</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {notifications.filter(n => n.type === NOTIFICATION_TYPES.ACHIEVEMENT).length}
            </div>
            <div className="text-sm text-gray-600">Achievements</div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setFilter('all')}
              variant={filter === 'all' ? 'primary' : 'secondary'}
              size="sm"
            >
              All ({notifications.length})
            </Button>
            <Button
              onClick={() => setFilter('unread')}
              variant={filter === 'unread' ? 'primary' : 'secondary'}
              size="sm"
            >
              Unread ({unreadCount})
            </Button>
            <Button
              onClick={() => setFilter(NOTIFICATION_TYPES.MORNING_SUMMARY)}
              variant={filter === NOTIFICATION_TYPES.MORNING_SUMMARY ? 'primary' : 'secondary'}
              size="sm"
            >
              Morning Summary
            </Button>
            <Button
              onClick={() => setFilter(NOTIFICATION_TYPES.MEDICATION_REMINDER)}
              variant={filter === NOTIFICATION_TYPES.MEDICATION_REMINDER ? 'primary' : 'secondary'}
              size="sm"
            >
              Medication
            </Button>
            <Button
              onClick={() => setFilter(NOTIFICATION_TYPES.HEALTH_ALERT)}
              variant={filter === NOTIFICATION_TYPES.HEALTH_ALERT ? 'primary' : 'secondary'}
              size="sm"
            >
              Alerts
            </Button>
          </div>
        </Card>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No notifications found</h3>
              <p className="text-gray-500">
                {filter === 'unread' ? 'All caught up!' : 'Notifications will appear here as we learn about your health.'}
              </p>
            </Card>
          ) : (
            filteredNotifications.map((notification, index) => (
              <Card
                key={`${notification.timestamp.getTime()}-${index}`}
                className={`p-6 ${!notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`text-lg font-semibold ${
                        notification.urgent ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        {notification.timestamp.toLocaleString()}
                        {!notification.isRead && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            New
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{notification.message}</p>

                    {notification.type === NOTIFICATION_TYPES.MORNING_SUMMARY && (
                      renderMorningSummary(notification)
                    )}

                    {notification.insights && notification.type !== NOTIFICATION_TYPES.MORNING_SUMMARY && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">{notification.insights}</p>
                      </div>
                    )}
                  </div>

                  {!notification.isRead && (
                    <div className="flex-shrink-0">
                      <Button
                        onClick={() => handleMarkAsRead(notification.timestamp.getTime())}
                        size="sm"
                        variant="outline"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Mark Read
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Test Notification Modal */}
        {showGenerateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Generate Test Notification</h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <Button
                  onClick={() => generateTestNotification('morning')}
                  className="flex flex-col items-center p-4 h-auto"
                  variant="outline"
                >
                  🌅 Morning
                  Summary
                </Button>
                <Button
                  onClick={() => generateTestNotification('medication')}
                  className="flex flex-col items-center p-4 h-auto"
                  variant="outline"
                >
                  💊 Medication
                  Reminder
                </Button>
                <Button
                  onClick={() => generateTestNotification('alert')}
                  className="flex flex-col items-center p-4 h-auto"
                  variant="outline"
                >
                  ⚠️ Health
                  Alert
                </Button>
                <Button
                  onClick={() => generateTestNotification('achievement')}
                  className="flex flex-col items-center p-4 h-auto"
                  variant="outline"
                >
                  🏆
                  Achievement
                </Button>
              </div>
              <Button
                onClick={() => setShowGenerateModal(false)}
                className="w-full"
                variant="secondary"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </PremiumFeatureGate>
  );
};

export default Notifications;
