// Advanced notification system for HealthMate
class NotificationService {
  constructor() {
    this.notifications = [];
    this.permissionStatus = 'default';
    this.worker = null;
    this.isInitialized = false;
  }

  // Initialize notification system
  async initialize() {
    if (this.isInitialized) return;

    try {
      // Request permission for notifications
      this.permissionStatus = await this.requestPermission();

      // Register service worker for background notifications
      if ('serviceWorker' in navigator) {
        await this.registerServiceWorker();
      }

      this.isInitialized = true;
      console.log('Notification service initialized');
    } catch (error) {
      console.error('Failed to initialize notification service:', error);
    }
  }

  // Request notification permission
  async requestPermission() {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      this.permissionStatus = permission;
      return permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }

  // Register service worker
  async registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service worker registered:', registration);
      this.worker = registration;
      return registration;
    } catch (error) {
      console.error('Failed to register service worker:', error);
    }
  }

  // Show notification
  async showNotification(title, options = {}) {
    if (this.permissionStatus !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    // Enhanced notification options for healthcare
    const notificationOptions = {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      timestamp: Date.now(),
      requireInteraction: false,
      silent: false,
      tag: 'healthmate-notification',
      ...options,
      data: {
        id: Date.now(),
        type: 'health',
        ...options.data
      }
    };

    // Handle different notification types
    switch (options.tag) {
      case 'medication':
        notificationOptions.actions = [
          { action: 'taken', title: 'Mark Taken', icon: '/icons/taken.png' },
          { action: 'snooze', title: 'Snooze 5 Min', icon: '/icons/snooze.png' }
        ];
        break;

      case 'emergency':
        notificationOptions.silent = false;
        notificationOptions.requireInteraction = true;
        notificationOptions.renotify = true;
        notificationOptions.vibrate = [200, 100, 200, 100, 200];
        break;

      case 'health':
        notificationOptions.actions = [
          { action: 'view', title: 'View Details', icon: '/icons/view.png' },
          { action: 'dismiss', title: 'Dismiss', icon: '/icons/dismiss.png' }
        ];
        break;
    }

    try {
      const notification = new Notification(title, notificationOptions);

      // Handle click events
      notification.onclick = function(event) {
        event.preventDefault();
        window.focus();

        // Handle different actions
        if (event.action === 'taken') {
          // Handle medication taken
          console.log('Medication marked as taken');
        } else if (event.action === 'snooze') {
          // Schedule snooze notification
          setTimeout(() => {
            new Notification('Medication Reminder', {
              body: 'Don\'t forget to take your medication',
              tag: 'medication-snooze'
            });
          }, 5 * 60 * 1000); // 5 minutes
        } else if (event.action === 'view') {
          // Navigate to relevant page
          window.location.href = '#/dashboard';
        }

        notification.close();
      };

      // Store notification
      this.notifications.push({
        id: notificationOptions.data.id,
        title,
        ...notificationOptions,
        timestamp: new Date()
      });

      // Auto-close after 5 seconds (unless it requires interaction)
      if (!options.requireInteraction) {
        setTimeout(() => notification.close(), 5000);
      }

      return notification;
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }

  // Schedule medication reminders
  scheduleMedicationReminder(medication, time, userId) {
    const reminderTime = new Date(time);
    const now = new Date();

    if (reminderTime > now) {
      const delay = reminderTime.getTime() - now.getTime();

      setTimeout(() => {
        this.showNotification(
          `Time for ${medication.name}`,
          {
            body: `Take ${medication.dose} ${medication.unit} of ${medication.name}\nNext dose: ${this.formatNextDoseTime(reminderTime, medication.frequency)}`,
            tag: 'medication',
            data: { medication, userId }
          }
        );
      }, delay);
    }
  }

  // Schedule health check reminders
  scheduleHealthCheckReminder(type, userId) {
    const messages = {
      daily: {
        title: 'Daily Health Check',
        body: 'Time for your daily health assessment. Let\'s track your vitals!'
      },
      weekly: {
        title: 'Weekly Health Review',
        body: 'Ready for your weekly health summary and recommendations?'
      },
      emergency: {
        title: 'Health Alert',
        body: 'Unusual health patterns detected. Please review your dashboard.'
      }
    };

    this.showNotification(
      messages[type].title,
      {
        body: messages[type].body,
        tag: 'health',
        data: { type, userId }
      }
    );
  }

  // Emergency notification system
  broadcastEmergencyAlert(type, details, contacts) {
    const emergencyMessage = this.getEmergencyMessage(type, details);

    // Send to emergency contacts (in real implementation, this would send to actual phone/email)
    contacts.forEach((contact, index) => {
      setTimeout(() => {
        this.showNotification(
          'EMERGENCY ALERT',
          {
            body: `${emergencyMessage}\nContact: ${contact.name}`,
            tag: 'emergency',
            icon: '/icons/emergency.png'
          }
        );
      }, index * 1000); // Stagger notifications
    });

    // Also play emergency sound if available
    if ('Audio' in window) {
      try {
        const audio = new Audio('/sounds/emergency.mp3');
        audio.play().catch(e => console.log('Audio play failed:', e));
      } catch (error) {
        console.log('Audio not available');
      }
    }
  }

  // Health insights notifications
  showHealthInsight(title, insight, type = 'info') {
    const icons = {
      improvement: '📈',
      warning: '⚠️',
      critical: '🚨',
      info: '💡'
    };

    this.showNotification(
      `${icons[type]} ${title}`,
      {
        body: insight.substring(0, 100) + (insight.length > 100 ? '...' : ''),
        tag: 'health-insight',
        data: { insight, type }
      }
    );
  }

  // Get specific emergency messages
  getEmergencyMessage(type, details) {
    const messages = {
      heart_attack: 'Possible heart attack detected. Please call emergency services immediately!',
      high_bp: 'Dangerously high blood pressure detected. Seek medical attention immediately.',
      low_bp: 'Critically low blood pressure symptoms. Call medical emergency services.',
      arrhythmia: 'Irregular heartbeat detected. Contact emergency services.',
      fall: 'Emergency fall detected. Imminent danger!',
      seizure: 'Seizure activity detected. Medical emergency!',
      diabetic_crisis: 'Diabetic emergency detected. Call emergency services!',
      general: 'Medical emergency alert triggered. Please respond immediately!'
    };

    return messages[type] || messages.general;
  }

  // Format next dose time
  formatNextDoseTime(currentDose, frequency) {
    const nextDose = new Date(currentDose);

    switch (frequency) {
      case 'daily':
        nextDose.setHours(nextDose.getHours() + 24);
        break;
      case 'twice-daily':
        nextDose.setHours(nextDose.getHours() + 12);
        break;
      case 'three-times-daily':
        nextDose.setHours(nextDose.getHours() + 8);
        break;
      case 'four-times-daily':
        nextDose.setHours(nextDose.getHours() + 6);
        break;
      case 'weekly':
        nextDose.setDate(nextDose.getDate() + 7);
        break;
      case 'as-needed':
        return 'As prescribed';
      default:
        nextDose.setHours(nextDose.getHours() + 24);
    }

    return nextDose.toLocaleString();
  }

  // Get all notifications
  getNotifications() {
    return this.notifications;
  }

  // Clear notifications
  clearNotifications() {
    this.notifications = [];
  }

  // Get notification permission status
  getPermissionStatus() {
    return this.permissionStatus;
  }

  // Update notification settings
  updateSettings(settings) {
    // Store in localStorage or send to server
    localStorage.setItem('healthmate-notification-settings', JSON.stringify(settings));
  }

  // Get notification settings
  getSettings() {
    const settings = localStorage.getItem('healthmate-notification-settings');
    return settings ? JSON.parse(settings) : {
      medicationReminders: true,
      healthAlerts: true,
      emergencyAlerts: true,
      dailySummaries: true,
      weeklyReports: true,
      desktopNotifications: true,
      soundEnabled: true,
      vibrationEnabled: true
    };
  }
}

// Create and export a singleton instance
export const notificationService = new NotificationService();

export default notificationService;
