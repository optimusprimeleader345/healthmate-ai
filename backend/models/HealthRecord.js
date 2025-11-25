import mongoose from 'mongoose';

const healthRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Vital Signs
  heartRate: {
    type: Number,
    min: 30,
    max: 250
  },

  bloodPressureSystolic: {
    type: Number,
    min: 70,
    max: 250
  },

  bloodPressureDiastolic: {
    type: Number,
    min: 40,
    max: 150
  },

  temperature: {
    type: Number,
    min: 95,
    max: 110
  },

  respiratoryRate: {
    type: Number,
    min: 8,
    max: 60
  },

  oxygenSaturation: {
    type: Number,
    min: 70,
    max: 100
  },

  // Body Measurements
  weight: {
    type: Number,
    min: 20,
    max: 500
  },

  height: {
    type: Number,
    min: 50,
    max: 250
  },

  bmi: {
    type: Number,
    min: 10,
    max: 60
  },

  // Fitness & Activity
  stepsCount: {
    type: Number,
    min: 0,
    max: 50000
  },

  caloriesBurned: {
    type: Number,
    min: 0,
    max: 10000
  },

  activeMinutes: {
    type: Number,
    min: 0,
    max: 1440
  },

  // Sleep
  sleepHours: {
    type: Number,
    min: 0,
    max: 24
  },

  sleepQuality: {
    type: String,
    enum: ['poor', 'fair', 'good', 'excellent'],
    default: 'good'
  },

  // Nutrition & Hydration
  waterIntake: {
    type: Number,
    min: 0,
    max: 10
  },

  caloriesConsumed: {
    type: Number,
    min: 0,
    max: 10000
  },

  // Mental Health
  stressLevel: {
    type: Number,
    min: 1,
    max: 10
  },

  mood: {
    type: String,
    enum: ['terrible', 'poor', 'fair', 'good', 'excellent'],
    default: 'good'
  },

  anxietyLevel: {
    type: Number,
    min: 1,
    max: 10
  },

  // Symptoms
  symptoms: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe'],
      default: 'mild'
    },
    notes: {
      type: String,
      trim: true
    }
  }],

  // Device & Source
  deviceType: {
    type: String,
    enum: ['manual', 'smartwatch', 'scale', 'blood-pressure-monitor', 'thermometer', 'pulse-oximeter'],
    default: 'manual'
  },

  source: {
    type: String,
    default: 'HealthMate App'
  },

  // Metadata
  recordedAt: {
    type: Date,
    default: Date.now,
    required: true
  },

  notes: {
    type: String,
    trim: true,
    maxlength: 500
  },

  tags: [{
    type: String,
    trim: true
  }],

  // Additional health metrics
  bloodGlucose: {
    type: Number,
    min: 20,
    max: 600
  },

  cholesterol: {
    total: { type: Number, min: 100, max: 400 },
    hdl: { type: Number, min: 20, max: 100 },
    ldl: { type: Number, min: 50, max: 200 },
    triglycerides: { type: Number, min: 50, max: 500 }
  },

  medicationsTaken: [{
    medicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medication'
    },
    dosage: {
      amount: Number,
      unit: String
    },
    takenAt: Date
  }],

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
healthRecordSchema.index({ userId: 1, recordedAt: -1 });
healthRecordSchema.index({ recordedAt: -1 });
healthRecordSchema.index({ userId: 1, deviceType: 1 });

// Update the updatedAt field before saving
healthRecordSchema.pre('save', function(next) {
  this.updatedAt = Date.now();

  // Calculate BMI if weight and height are provided
  if (this.weight && this.height && !this.bmi) {
    const heightInMeters = this.height / 100; // Convert cm to meters
    this.bmi = Math.round((this.weight / (heightInMeters * heightInMeters)) * 10) / 10;
  }

  next();
});

// Virtual for formatted date
healthRecordSchema.virtual('formattedDate').get(function() {
  return this.recordedAt.toISOString().split('T')[0];
});

// Static method to get recent records for a user
healthRecordSchema.statics.getRecentRecords = function(userId, limit = 10) {
  return this.find({ userId })
    .sort({ recordedAt: -1 })
    .limit(limit)
    .populate('userId', 'displayName email');
};

// Static method to get records for date range
healthRecordSchema.statics.getRecordsByDateRange = function(userId, startDate, endDate) {
  return this.find({
    userId,
    recordedAt: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ recordedAt: -1 });
};

const HealthRecord = mongoose.model('HealthRecord', healthRecordSchema);

export default HealthRecord;
