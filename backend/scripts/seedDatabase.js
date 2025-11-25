import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectDB } from '../config/database.js';
import User from '../models/User.js';
import HealthRecord from '../models/HealthRecord.js';
import Medication from '../models/Medication.js';
import Notification from '../models/Notification.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('🌱 Starting database seeding...');

    // Clear existing data (optional - remove in production)
    console.log('🧹 Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      HealthRecord.deleteMany({}),
      Medication.deleteMany({}),
      Notification.deleteMany({})
    ]);

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const salt = await bcrypt.genSalt(12);
    const hashedAdminPassword = await bcrypt.hash(adminPassword, salt);

    const adminUser = await User.create({
      email: process.env.ADMIN_EMAIL || 'admin@healthmate.com',
      password: hashedAdminPassword,
      displayName: 'Healthcare Administrator',
      role: 'admin',
      subscription: 'enterprise',
      preferences: {
        notifications: true,
        theme: 'light',
        language: 'en'
      }
    });

    // Create regular patient user
    console.log('👤 Creating patient user...');
    const patientPassword = 'patient123';
    const patientSalt = await bcrypt.genSalt(12);
    const hashedPatientPassword = await bcrypt.hash(patientPassword, patientSalt);

    const patientUser = await User.create({
      email: 'patient@healthmate.com',
      password: hashedPatientPassword,
      displayName: 'John Smith',
      role: 'patient',
      subscription: 'free',
      preferences: {
        notifications: true,
        theme: 'light',
        language: 'en',
        dashboardWidgets: ['health_metrics', 'medication_schedule', 'upcoming_appointments']
      }
    });

    // Create health records for patient
    console.log('📊 Creating health records...');
    const healthRecords = [];

    // Generate last 30 days of health data
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const healthRecord = {
        userId: patientUser._id,
        heartRate: Math.floor(Math.random() * 40) + 60, // 60-100 bpm
        bloodPressureSystolic: Math.floor(Math.random() * 30) + 110, // 110-140 mmHg
        bloodPressureDiastolic: Math.floor(Math.random() * 20) + 70, // 70-90 mmHg
        temperature: (Math.random() * 2 + 97).toFixed(1), // 97-99°F
        stepsCount: Math.floor(Math.random() * 8000) + 4000, // 4000-12000 steps
        sleepHours: (Math.random() * 4 + 6).toFixed(1), // 6-10 hours
        sleepQuality: ['poor', 'fair', 'good', 'excellent'][Math.floor(Math.random() * 4)],
        waterIntake: Math.floor(Math.random() * 2) + 2, // 2-4 liters
        activeMinutes: Math.floor(Math.random() * 120) + 30, // 30-150 minutes
        stressLevel: Math.floor(Math.random() * 10) + 1, // 1-10
        mood: ['terrible', 'poor', 'fair', 'good', 'excellent'][Math.floor(Math.random() * 5)],
        weight: (Math.random() * 50 + 140).toFixed(1), // 140-190 lbs
        height: 175, // cm
        caloriesConsumed: Math.floor(Math.random() * 800) + 1800, // 1800-2600 calories
        bloodGlucose: Math.floor(Math.random() * 50) + 80, // 80-130 mg/dL
        deviceType: 'smartwatch',
        recordedAt: date,
        notes: 'Generated sample data',
        tags: ['daily_reading']
      };

      healthRecords.push(healthRecord);
    }

    await HealthRecord.insertMany(healthRecords);

    // Create sample medications
    console.log('💊 Creating medications...');
    const medications = [
      {
        userId: patientUser._id,
        name: 'Lisinopril',
        genericName: 'Lisinopril',
        dosage: { amount: 10, unit: 'mg' },
        frequency: 'once_daily',
        schedule: [{ time: '08:00', taken: false }],
        quantity: { current: 30, total: 30 },
        prescribedBy: 'Dr. Sarah Johnson',
        condition: 'Hypertension',
        instructions: 'Take with or without food',
        sideEffects: 'Cough, headache, dizziness',
        remindersEnabled: true,
        category: 'prescription',
        pharmacy: {
          name: 'CVS Pharmacy',
          phone: '(555) 123-4567'
        },
        startedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        tags: ['hypertension', 'ACE inhibitor']
      },
      {
        userId: patientUser._id,
        name: 'Metformin',
        genericName: 'Metformin HCl',
        dosage: { amount: 500, unit: 'mg' },
        frequency: 'twice_daily',
        schedule: [
          { time: '08:00', taken: false },
          { time: '20:00', taken: false }
        ],
        quantity: { current: 60, total: 60 },
        prescribedBy: 'Dr. Michael Chen',
        condition: 'Type 2 Diabetes',
        instructions: 'Take with meals',
        sideEffects: 'Nausea, diarrhea, stomach upset',
        remindersEnabled: true,
        category: 'prescription',
        pharmacy: {
          name: 'Walmart Pharmacy',
          phone: '(555) 987-6543'
        },
        startedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
        tags: ['diabetes', 'blood sugar']
      },
      {
        userId: patientUser._id,
        name: 'Aspirin',
        genericName: 'Aspirin',
        dosage: { amount: 81, unit: 'mg' },
        frequency: 'once_daily',
        schedule: [{ time: '08:00', taken: false }],
        quantity: { current: 30, total: 30 },
        prescribedBy: 'Dr. Emily Davis',
        condition: 'Cardiovascular Protection',
        instructions: 'Take with food to prevent stomach upset',
        sideEffects: 'Heartburn, stomach irritation',
        remindersEnabled: false,
        category: 'otc',
        tags: ['heart health', 'blood thinner']
      }
    ];

    await Medication.insertMany(medications);

    // Create sample notifications
    console.log('🔔 Creating notifications...');
    const notifications = [
      {
        userId: patientUser._id,
        title: 'Welcome to HealthMate!',
        message: 'Thank you for joining HealthMate. Your health journey starts here.',
        type: 'system_update',
        category: 'system',
        priority: 'low',
        deliveryChannels: [{ type: 'in_app' }],
        isRead: false
      },
      {
        userId: patientUser._id,
        title: 'Medication Reminder: Lisinopril',
        message: 'Time to take your 10mg Lisinopril',
        type: 'medication_reminder',
        category: 'medication',
        priority: 'high',
        deliveryChannels: [{ type: 'in_app' }, { type: 'push' }],
        isRead: false,
        scheduledFor: new Date(),
        relatedEntity: {
          type: 'medication',
          metadata: { medicationName: 'Lisinopril' }
        },
        actions: [
          { label: 'Mark Taken', action: 'take_medication' },
          { label: 'Snooze', action: 'dismiss' }
        ]
      },
      {
        userId: patientUser._id,
        title: 'Health Check: Blood Pressure Reading',
        message: 'Your recent blood pressure reading shows values within normal range.',
        type: 'health_alert',
        category: 'health',
        priority: 'medium',
        deliveryChannels: [{ type: 'in_app' }],
        isRead: false,
        actions: [
          { label: 'View Details', action: 'view_details', url: '/dashboard' }
        ]
      },
      {
        userId: patientUser._id,
        title: 'Weekly Activity Goal Achieved! 🎉',
        message: 'Congratulations! You\'ve reached your weekly step goal. Keep up the great work!',
        type: 'wellness_tip',
        category: 'wellness',
        priority: 'low',
        deliveryChannels: [{ type: 'in_app' }, { type: 'push' }],
        isRead: true,
        readAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // Read 2 days ago
      },
      {
        userId: patientUser._id,
        title: 'New Feature: Symptom Checker',
        message: 'Try our new AI-powered symptom checker to understand your health concerns better.',
        type: 'educational',
        category: 'education',
        priority: 'low',
        deliveryChannels: [{ type: 'in_app' }],
        isRead: false,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires in 7 days
        actions: [
          { label: 'Try Now', action: 'open_link', url: '/symptom-checker' }
        ]
      }
    ];

    await Notification.insertMany(notifications);

    console.log('✅ Database seeding completed successfully!');
    console.log(`👤 Admin User: ${adminUser.email}`);
    console.log(`👤 Patient User: ${patientUser.email}`);
    console.log(`📊 Health Records Created: ${healthRecords.length}`);
    console.log(`💊 Medications Created: ${medications.length}`);
    console.log(`🔔 Notifications Created: ${notifications.length}`);

    // Close database connection
    await mongoose.connection.close();
    console.log('👋 Database connection closed.');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding only if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export default seedDatabase;
