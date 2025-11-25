import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Notification content
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },

  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },

  // Notification type and category
  type: {
    type: String,
    enum: ['medication_reminder', 'appointment_reminder', 'health_alert', 'symptom_checker', 'emergency_alert', 'system_update', 'educational', 'wellness_tip', 'custom'],
    default: 'health_alert'
  },

  category: {
    type: String,
    enum: ['medication', 'appointment', 'health', 'emergency', 'education', 'wellness', 'system', 'custom'],
    default: 'health'
  },

  // Priority and urgency levels
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },

  urgency: {
    type: String,
    enum: ['normal', 'urgent', 'immediate'],
    default: 'normal'
  },

  // Status and delivery tracking
  isRead: {
    type: Boolean,
    default: false
  },

  readAt: {
    type: Date
  },

  isArchived: {
    type: Boolean,
    default: false
  },

  archivedAt: {
    type: Date
  },

  // Delivery channels and status
  deliveryChannels: [{
    type: {
      type: String,
      enum: ['in_app', 'push', 'email', 'sms'],
      required: true
    },
    sent: {
      type: Boolean,
      default: false
    },
    sentAt: Date,
    delivered: {
      type: Boolean,
      default: false
    },
    deliveredAt: Date,
    failed: {
      type: Boolean,
      default: false
    },
    failureReason: {
      type: String,
      trim: true
    }
  }],

  // Scheduling and timing
  scheduledFor: {
    type: Date
  },

  expiresAt: {
    type: Date
  },

  // Associated data (for medication reminders, appointments, etc.)
  relatedEntity: {
    type: {
      type: String,
      enum: ['medication', 'appointment', 'health_record', 'emergency_contact', 'none'],
      default: 'none'
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },

  // Action buttons and deep links
  actions: [{
    label: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    action: {
      type: String,
      required: true,
      enum: ['dismiss', 'view_details', 'mark_read', 'schedule_appointment', 'take_medication', 'call_emergency', 'open_link'],
      trim: true
    },
    url: {
      type: String,
      trim: true
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  }],

  // Push notification specifics
  pushData: {
    title: String,
    body: String,
    icon: String,
    badge: String,
    tag: String,
    requireInteraction: {
      type: Boolean,
      default: false
    },
    silent: {
      type: Boolean,
      default: false
    },
    actions: [{
      action: String,
      title: String,
      icon: String
    }]
  },

  // Analytics and tracking
  clickCount: {
    type: Number,
    default: 0,
    min: 0
  },

  lastClickedAt: {
    type: Date
  },

  // Geographic and contextual data
  locationContext: {
    latitude: Number,
    longitude: Number,
    locationName: {
      type: String,
      trim: true,
      maxlength: 100
    },
    radius: {
      type: Number,
      min: 0
    }
  },

  // Custom data and metadata
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }],

  source: {
    type: String,
    enum: ['system', 'medication_reminder', 'appointment_scheduler', 'health_monitor', 'emergency_system', 'manual', 'integration'],
    default: 'system'
  },

  notes: {
    type: String,
    trim: true,
    maxlength: 500
  },

  customData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for performance
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, type: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, priority: 1, createdAt: -1 });
notificationSchema.index({ scheduledFor: 1 });
notificationSchema.index({ expiresAt: 1 });

// Update the updatedAt field before saving
notificationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for notification age
notificationSchema.virtual('age').get(function() {
  return Date.now() - this.createdAt.getTime();
});

// Virtual for is expired
notificationSchema.virtual('isExpired').get(function() {
  return this.expiresAt && this.expiresAt < new Date();
});

// Static method to get unread notifications for a user
notificationSchema.statics.getUnreadNotifications = function(userId, limit = 20) {
  return this.find({
    userId,
    isRead: false,
    isArchived: { $ne: true },
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } }
    ]
  })
  .sort({ priority: -1, createdAt: -1 })
  .limit(limit);
};

// Static method to mark notifications as read
notificationSchema.statics.markAsRead = function(userId, notificationIds) {
  return this.updateMany(
    { _id: { $in: notificationIds }, userId },
    { $set: { isRead: true, readAt: new Date() } }
  );
};

// Static method to get pending scheduled notifications
notificationSchema.statics.getPendingScheduledNotifications = function() {
  return this.find({
    scheduledFor: { $lte: new Date() },
    'deliveryChannels.sent': false,
    isArchived: { $ne: true },
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } }
    ]
  });
};

// Instance method to mark as clicked
notificationSchema.methods.markAsClicked = function() {
  this.clickCount += 1;
  this.lastClickedAt = new Date();
  return this.save();
};

// Instance method to add delivery status
notificationSchema.methods.addDeliveryStatus = function(channel, status, timestamp = new Date()) {
  const deliveryChannel = this.deliveryChannels.find(ch => ch.type === channel);
  if (deliveryChannel) {
    deliveryChannel.sent = status.sent || deliveryChannel.sent;
    deliveryChannel.sentAt = status.sentAt || deliveryChannel.sentAt || timestamp;
    deliveryChannel.delivered = status.delivered || deliveryChannel.delivered;
    deliveryChannel.deliveredAt = status.deliveredAt || deliveryChannel.deliveredAt || timestamp;

    if (status.failed) {
      deliveryChannel.failed = true;
      deliveryChannel.failureReason = status.failureReason;
    }
  }
};

// Instance method to check if should send via channel
notificationSchema.methods.shouldSendViaChannel = function(channelType) {
  const channel = this.deliveryChannels.find(ch => ch.type === channelType);
  return channel && !channel.sent && !channel.failed;
};

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
