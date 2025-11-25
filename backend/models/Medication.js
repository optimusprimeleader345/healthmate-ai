import mongoose from 'mongoose';

const medicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Basic medication information
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },

  genericName: {
    type: String,
    trim: true,
    maxlength: 200
  },

  brandName: {
    type: String,
    trim: true,
    maxlength: 200
  },

  // Dosage information
  dosage: {
    amount: {
      type: Number,
      required: true,
      min: 0.1
    },
    unit: {
      type: String,
      required: true,
      enum: ['mg', 'ml', 'mcg', 'g', 'IU', 'units', 'tablets', 'capsules', 'drops', 'sprays'],
      default: 'mg'
    }
  },

  // Frequency and schedule
  frequency: {
    type: String,
    required: true,
    enum: ['once_daily', 'twice_daily', 'three_times_daily', 'four_times_daily', 'every_6_hours', 'every_8_hours', 'every_12_hours', 'as_needed', 'weekly', 'monthly'],
    default: 'once_daily'
  },

  schedule: [{
    time: {
      type: String,
      required: true,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ // HH:MM format
    },
    taken: {
      type: Boolean,
      default: false
    },
    takenAt: Date,
    skipped: {
      type: Boolean,
      default: false
    },
    skippedReason: {
      type: String,
      trim: true,
      maxlength: 200
    }
  }],

  // Prescription details
  prescribedBy: {
    type: String,
    trim: true,
    maxlength: 100
  },

  prescriptionNumber: {
    type: String,
    trim: true,
    maxlength: 50
  },

  prescriptionDate: {
    type: Date
  },

  refillDate: {
    type: Date
  },

  quantity: {
    current: {
      type: Number,
      required: true,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    }
  },

  // Instructions
  instructions: {
    type: String,
    trim: true,
    maxlength: 500
  },

  sideEffects: {
    type: String,
    trim: true,
    maxlength: 500
  },

  warnings: {
    type: String,
    trim: true,
    maxlength: 500
  },

  // Medical details
  purpose: {
    type: String,
    enum: ['treatment', 'prevention', 'supplement', 'maintenance', 'as_needed'],
    default: 'treatment'
  },

  condition: {
    type: String,
    trim: true,
    maxlength: 200
  },

  // Status and tracking
  status: {
    type: String,
    enum: ['active', 'paused', 'completed', 'discontinued', 'expired'],
    default: 'active'
  },

  startedAt: {
    type: Date,
    default: Date.now
  },

  completedAt: {
    type: Date
  },

  discontinuedAt: {
    type: Date
  },

  discontinueReason: {
    type: String,
    trim: true,
    maxlength: 200
  },

  // Reminders and notifications
  remindersEnabled: {
    type: Boolean,
    default: true
  },

  reminderSound: {
    type: String,
    default: 'default'
  },

  reminderMessage: {
    type: String,
    trim: true,
    maxlength: 200,
    default: 'Time to take your medication'
  },

  // Pharmacy information
  pharmacy: {
    name: {
      type: String,
      trim: true,
      maxlength: 100
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 20
    },
    address: {
      type: String,
      trim: true,
      maxlength: 200
    }
  },

  // Logging and tracking
  adherenceLog: [{
    scheduledFor: {
      type: Date,
      required: true
    },
    taken: {
      type: Boolean,
      default: false
    },
    takenAt: Date,
    actualDosage: {
      amount: Number,
      unit: String
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 200
    },
    loggedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Tags and categories
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }],

  category: {
    type: String,
    enum: ['prescription', 'otc', 'supplement', 'vaccine', 'other'],
    default: 'prescription'
  },

  // Emergency and critical medication flags
  criticalMedication: {
    type: Boolean,
    default: false
  },

  emergencyContactNotified: {
    type: Boolean,
    default: false
  },

  // Additional metadata
  notes: {
    type: String,
    trim: true,
    maxlength: 1000
  },

  customFields: {
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
medicationSchema.index({ userId: 1, status: 1 });
medicationSchema.index({ userId: 1, startedAt: -1 });
medicationSchema.index({ userId: 1, 'schedule.time': 1 });
medicationSchema.index({ name: 'text' }); // For search functionality

// Update the updatedAt field before saving
medicationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for adherence rate
medicationSchema.virtual('adherenceRate').get(function() {
  if (!this.adherenceLog || this.adherenceLog.length === 0) {
    return 0;
  }

  const takenCount = this.adherenceLog.filter(log => log.taken).length;
  return Math.round((takenCount / this.adherenceLog.length) * 100);
});

// Virtual for next dose
medicationSchema.virtual('nextDose').get(function() {
  if (this.status !== 'active' || !this.schedule || this.schedule.length === 0) {
    return null;
  }

  const now = new Date();
  const today = now.toISOString().split('T')[0];

  // Find next scheduled dose today or tomorrow
  for (const dose of this.schedule) {
    if (!dose.taken) {
      const doseTime = `${today}T${dose.time}:00.000Z`;
      const doseDateTime = new Date(doseTime);

      if (doseDateTime > now) {
        return doseDateTime;
      }
    }
  }

  // If all doses today are taken, schedule for tomorrow
  if (this.schedule.length > 0) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    const firstDose = this.schedule[0];

    return new Date(`${tomorrowStr}T${firstDose.time}:00.000Z`);
  }

  return null;
});

// Static method to get active medications for a user
medicationSchema.statics.getActiveMedications = function(userId) {
  return this.find({
    userId,
    status: 'active',
    $or: [
      { completedAt: { $exists: false } },
      { completedAt: null }
    ]
  }).sort({ startedAt: -1 });
};

// Static method to get medications due now
medicationSchema.statics.getDueMedications = function(userId) {
  const now = new Date();
  const currentTime = now.toISOString().slice(0, 5); // HH:MM format

  return this.find({
    userId,
    status: 'active',
    schedule: {
      $elemMatch: {
        time: currentTime,
        taken: false
      }
    }
  });
};

// Method to mark dose as taken
medicationSchema.methods.markDoseTaken = function(scheduleIndex, actualDosage = null) {
  if (this.schedule[scheduleIndex]) {
    this.schedule[scheduleIndex].taken = true;
    this.schedule[scheduleIndex].takenAt = new Date();

    // Add to adherence log
    this.adherenceLog.push({
      scheduledFor: new Date(),
      taken: true,
      takenAt: new Date(),
      actualDosage: actualDosage || this.dosage
    });

    // Decrease quantity if tracking
    if (this.quantity.current > 0) {
      this.quantity.current -= this.dosage.amount;
    }
  }
};

// Method to reset daily schedule
medicationSchema.methods.resetDailySchedule = function() {
  this.schedule.forEach(dose => {
    dose.taken = false;
    dose.takenAt = null;
    dose.skipped = false;
    dose.skippedReason = '';
  });
};

const Medication = mongoose.model('Medication', medicationSchema);

export default Medication;
