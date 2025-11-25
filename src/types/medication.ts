export interface MedicationItem {
  id: string;
  name: string;
  genericName?: string;
  brandName?: string;
  dosage: string; // e.g., "10mg", "500mg"
  form: 'tablet' | 'capsule' | 'liquid' | 'injection' | 'cream' | 'drops' | 'inhaler';
  strength: string;
  instructions: string; // e.g., "Take with food", "Take on empty stomach"
  sideEffects?: string[];
  category?: string;
  requiresPrescription: boolean;
}

export interface MedicationSchedule {
  id: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  frequency: 'once-daily' | 'twice-daily' | 'three-times-daily' | 'four-times-daily' | 'as-needed' | 'weekly' | 'monthly';
  timesPerDay: number;
  specificTimes: string[]; // e.g., ["08:00", "20:00"] for twice daily
  startDate: Date;
  endDate?: Date;
  active: boolean;
  prescribingDoctor?: string;
  notes?: string;
}

export interface MedicationLog {
  id: string;
  scheduleId: string;
  medicationName: string;
  dosage: string;
  scheduledTime: string; // "08:00"
  actualTime?: Date;
  taken: boolean;
  skippedReason?: string;
  sideEffects?: string[];
  date: string; // YYYY-MM-DD
  status: 'taken' | 'skipped' | 'missed' | 'upcoming';
}

export interface MedicationReminder {
  id: string;
  scheduleId: string;
  medicationName: string;
  dosage: string;
  scheduledTime: string;
  date: string;
  notified: boolean;
  reminderTime: Date;
}

export interface RefillReminder {
  id: string;
  medicationId: string;
  medicationName: string;
  daysRemaining: number;
  refillDate: Date;
  pharmacy?: string;
  prescriptionNumber?: string;
}

export interface MedicationInteractions {
  medication1: string;
  medication2: string;
  severity: 'major' | 'moderate' | 'minor';
  description: string;
  advice: string;
}

export interface MedicationStats {
  period: 'week' | 'month';
  totalMedications: number;
  adherenceRate: number; // percentage as decimal (0.95 = 95%)
  dosesTaken: number;
  dosesMissed: number;
  commonSkipReasons: string[];
  mostTakenTime?: string;
  refillAlerts: number;
  upcomingDoses: MedicationLog[];
}
