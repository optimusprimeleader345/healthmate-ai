import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Settings, Clock, Pill, AlertTriangle, Info } from 'lucide-react';
import { notificationService } from '../../utils/notificationService';

interface NotificationItem {
  id: number;
  title: string;
  body: string;
  type: string;
  timestamp: Date;
  read: boolean;
  actions?: Array<{ action: string; title: string }>;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'medication' | 'alerts' | 'settings'>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [permissionStatus, setPermissionStatus] = useState<string>('default');
  const [settings, setSettings] = useState(notificationService.getSettings());

  useEffect(() => {
    loadNotifications();
    setPermissionStatus(Notification.permission);
  }, []);

  const loadNotifications = () => {
    const mockNotifications: NotificationItem[] = [
      {
        id: 1,
        title: 'Time for Medication',
        body: 'Take 10mg of Aspirin. Next dose at 8:00 PM.',
        type: 'medication',
        timestamp: new Date(Date.now() - 3600000),
        read: false,
        actions: [{ action: 'taken', title: 'Mark Taken' }, { action: 'snooze', title: 'Snooze' }]
      },
      {
        id: 2,
        title: 'Health Alert',
        body: 'Your stress levels are higher than usual.',
        type: 'alert',
        timestamp: new Date(Date.now() - 7200000),
        read: false
      }
    ];
    setNotifications(mockNotifications);
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (activeTab) {
      case 'unread': return !notification.read;
      case 'medication': return notification.type === 'medication';
      case 'alerts': return ['alert', 'emergency'].includes(notification.type);
      default: return true;
    }
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'medication': return <Pill className="w-4 h-4 text-blue-500" />;
      case 'alert': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return '1h ago';
  };

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, x: 320 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 320 }}
            className={`fixed top-0 right-0 w-96 h-full bg-white shadow-2xl border-l border-gray-200 z-50 ${className}`}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Bell className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </div>
              <button onClick={onClose}><X className="w-5 h-5" /></button>
            </div>

            <div className="flex border-b border-gray-200">
              {[
                { id: 'all', label: 'All', count: notifications.length },
                { id: 'unread', label: 'Unread', count: notifications.filter(n => !n.read).length },
                { id: 'medication', label: 'Medication', count: notifications.filter(n => n.type === 'medication').length },
                { id: 'settings', label: 'Settings' }
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-3 text-sm ${activeTab === tab.id ? 'border-b-2 border-blue-500' : ''}`}>
                  {tab.label} {tab.count && <span>({tab.count})</span>}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredNotifications.map(notification => (
                <div key={notification.id} className="p-4 border-b border-gray-100" onClick={() => markAsRead(notification.id)}>
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div>
                      <div className="font-medium">{notification.title}</div>
                      <div className="text-sm text-gray-600">{notification.body}</div>
                      <div className="text-xs text-gray-400">{formatTimestamp(notification.timestamp)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200">
              <button onClick={markAllAsRead} className="w-full py-2 bg-blue-500 text-white rounded-lg">
                Mark All as Read
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationCenter;
