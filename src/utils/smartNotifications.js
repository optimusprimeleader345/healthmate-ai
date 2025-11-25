// Smart Notification Engine
// Generates intelligent morning health summaries and personalized notifications

export const NOTIFICATION_TYPES = {
  MORNING_SUMMARY: 'morning_summary',
  MEDICATION_REMINDER: 'medication_reminder',
  HEALTH_ALERT: 'health_alert',
  ACHIEVEMENT: 'achievement',
  TIP: 'tip',
  APPOINTMENT: 'appointment'
};

// Generate morning health summary based on last 24 hours data
export const generateMorningSummary = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  // Mock health data from last 24 hours
  const healthData = {
    sleepHours: Math.random() * 4 + 5, // 5-9 hours
    steps: Math.floor(Math.random() * 5000) + 3000, // 3000-8000 steps
    heartRateAvg: Math.floor(Math.random() * 20) + 65, // 65-85 bpm
    waterIntake: Math.floor(Math.random() * 4) + 4, // 4-8 cups
    mood: ['good', 'excellent', 'fair', 'great'][Math.floor(Math.random() * 4)],
    symptoms: Math.random() > 0.7 ? ['headache', 'fatigue', 'stomach discomfort'][Math.floor(Math.random() * 3)] : null
  };

  // Calculate health score (70-95)
  const healthScore = Math.floor(70 + ((healthData.sleepHours / 9) * 10) +
                                ((healthData.steps / 10000) * 8) +
                                ((healthData.heartRateAvg > 60 && healthData.heartRateAvg < 85) ? 7 : 0));

  // Generate personalized insights
  const insights = [];

  if (healthData.sleepHours < 7) {
    insights.push(`💤 Your sleep duration (${healthData.sleepHours.toFixed(1)} hrs) was below optimal. Consider adjusting your bedtime routine.`);
  } else {
    insights.push(`🛌 Excellent sleep! ${healthData.sleepHours.toFixed(1)} hours of rest supports optimal recovery.`);
  }

  if (healthData.steps < 5000) {
    insights.push(`👟 You walked ${healthData.steps.toLocaleString()} steps yesterday. Aim for 7,000+ tomorrow for better fitness.`);
  } else {
    insights.push(`🚶‍♀️ Great activity level! ${healthData.steps.toLocaleString()} steps yesterday is fantastic for cardiovascular health.`);
  }

  if (healthData.waterIntake < 6) {
    insights.push(`💧 Hydration goal not met. Consider drinking more water throughout the day.`);
  }

  if (healthData.symptoms) {
    insights.push(`⚠️ You logged ${healthData.symptoms} as a symptom. Track this and consult with your healthcare provider if persistent.`);
  }

  return {
    type: NOTIFICATION_TYPES.MORNING_SUMMARY,
    timestamp: new Date(),
    title: "🌅 Good Morning! Your Health Summary",
    healthScore,
    summaryData: healthData,
    insights,
    recommendations: generatePersonalizedRecommendations(healthData),
    mood: generateMoodMessage(healthData.mood)
  };
};

// Generate personalized recommendations
const generatePersonalizedRecommendations = (data) => {
  const recommendations = [];

  if (data.sleepHours < 7) {
    recommendations.push("Consider a consistent bedtime routine to improve sleep quality");
  }

  if (data.steps < 6000) {
    recommendations.push("Try a 20-minute walk after dinner to boost your daily activity");
  }

  if (data.waterIntake < 6) {
    recommendations.push("Set a hydration reminder on your phone for better water intake");
  }

  if (data.heartRateAvg > 80) {
    recommendations.push("Monitor stress levels - consider mindfulness exercises");
  }

  // Always include some positive reinforcement
  recommendations.push("Continue tracking your health - consistency drives results!");

  return recommendations;
};

// Generate mood-based message
const generateMoodMessage = (mood) => {
  switch (mood) {
    case 'excellent':
      return "🎉 You're feeling excellent today! Keep up the great habits!";
    case 'good':
      return "😊 You're feeling good. Small, consistent health wins add up!";
    case 'fair':
      return "🤔 You're feeling okay. Pay special attention to your body's signals today.";
    case 'great':
      return "✨ You reported feeling great! Share what worked for you!";
    default:
      return "🙂 Hope you're having a wonderful day!";
  }
};

// Generate achievement notifications
export const generateAchievementNotification = () => {
  const achievements = [
    {
      title: "🏃‍♀️ Activity Champion",
      message: "Congratulations! You've maintained an active lifestyle for 7 consecutive days!",
      icon: "🏆"
    },
    {
      title: "💧 Hydration Hero",
      message: "You've been staying well-hydrated! Your body thanks you.",
      icon: "💦"
    },
    {
      title: "😴 Sleep Champion",
      message: "Perfect! 7 days of quality sleep! Your recovery is optimized.",
      icon: "🌙"
    }
  ];

  const randomAchievement = achievements[Math.floor(Math.random() * achievements.length)];

  return {
    type: NOTIFICATION_TYPES.ACHIEVEMENT,
    timestamp: new Date(),
    title: randomAchievement.title,
    message: randomAchievement.message,
    icon: randomAchievement.icon
  };
};

// Generate medication reminders
export const generateMedicationReminder = (medicationName = "your medication") => {
  return {
    type: NOTIFICATION_TYPES.MEDICATION_REMINDER,
    timestamp: new Date(),
    title: "💊 Medication Reminder",
    message: `It's time to take ${medicationName}. Don't forget your prescribed dosage.`,
    urgent: true,
    medication: medicationName
  };
};

// Generate health alerts for concerning trends
export const generateHealthAlert = (alertType = 'heart_rate') => {
  const alerts = {
    heart_rate: {
      title: "❤️ Heart Rate Alert",
      message: "Your resting heart rate is elevated. Consider consulting your healthcare provider.",
      severity: 'medium'
    },
    sleep: {
      title: "😴 Sleep Alert",
      message: "Your sleep quality has declined over the past 3 days. Focus on sleep hygiene.",
      severity: 'low'
    },
    activity: {
      title: "⚡ Activity Alert",
      message: "You haven't logged activity for 2 days. Regular movement supports overall health.",
      severity: 'low'
    }
  };

  return {
    type: NOTIFICATION_TYPES.HEALTH_ALERT,
    timestamp: new Date(),
    ...alerts[alertType],
    urgent: alerts[alertType].severity === 'high'
  };
};

// Generate daily tips
export const generateDailyTip = () => {
  const tips = [
    "💡 Pro tip: Take the stairs instead of the elevator for extra calorie burn!",
    "🌅 Morning routine: Spend 5 minutes in sunlight to help regulate your circadian rhythm.",
    "🍎 Healthy snack: Apple slices with almond butter provide sustained energy.",
    "🚶‍♂️ Movement break: Stand up and stretch every hour to improve circulation.",
    "🧘‍♀️ Stress management: Try deep breathing exercises when feeling overwhelmed.",
    "💧 Hydration hack: Infuse your water with lemon or cucumber for better taste.",
    "🏃‍♀️ Fitness tip: Interval training (30s sprint, 30s walk) maximizes calorie burn.",
    "😴 Sleep hygiene: Keep your bedroom cool and dark for optimal rest."
  ];

  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  return {
    type: NOTIFICATION_TYPES.TIP,
    timestamp: new Date(),
    title: "💡 Daily Health Tip",
    message: randomTip,
    category: 'prevention'
  };
};

// Mock notification history
export const getNotificationHistory = () => {
  const stored = localStorage.getItem('healthmate_notifications');
  if (stored) {
    return JSON.parse(stored).map(n => ({ ...n, timestamp: new Date(n.timestamp) }));
  }

  // Generate sample notifications
  const sampleNotifications = [
    generateMorningSummary(),
    generateMedicationReminder("Vitamin D"),
    generateAchievementNotification(),
    generateDailyTip()
  ];

  // Add some older ones
  for (let i = 1; i < 5; i++) {
    const olderNotification = {
      ...generateMorningSummary(),
      timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      isRead: Math.random() > 0.5
    };
    sampleNotifications.push(olderNotification);
  }

  localStorage.setItem('healthmate_notifications', JSON.stringify(sampleNotifications));
  return sampleNotifications;
};

// Save notification
export const saveNotification = (notification) => {
  const history = getNotificationHistory();
  history.unshift(notification); // Add to beginning for chronological order

  // Keep only last 100 notifications
  if (history.length > 100) {
    history.splice(100);
  }

  localStorage.setItem('healthmate_notifications', JSON.stringify(history));
  return history;
};

// Mark notification as read
export const markNotificationAsRead = (notificationId) => {
  const history = getNotificationHistory();
  const updatedHistory = history.map(notification =>
    notification.timestamp.getTime() === notificationId
      ? { ...notification, isRead: true }
      : notification
  );
  localStorage.setItem('healthmate_notifications', JSON.stringify(updatedHistory));
  return updatedHistory;
};

// Get unread count
export const getUnreadNotificationCount = () => {
  return getNotificationHistory().filter(n => !n.isRead).length;
};

// Schedule morning summary (mock - in real app this would be server-side)
export const scheduleMorningSummary = () => {
  const now = new Date();
  const morningSummaryTime = new Date(now);
  morningSummaryTime.setHours(7, 0, 0, 0); // 7:00 AM

  if (now > morningSummaryTime) {
    morningSummaryTime.setDate(morningSummaryTime.getDate() + 1);
  }

  // In a real app, this would schedule a server-side job
  console.log(`Morning summary scheduled for: ${morningSummaryTime.toLocaleString()}`);

  return {
    scheduledFor: morningSummaryTime,
    message: "Morning health summary scheduled successfully"
  };
};
