export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'patient' | 'doctor' | 'admin';
  isAuthenticated: boolean;
  createdAt: Date;
  lastLogin?: Date;
  profilePicture?: string;
  medicalId?: string; // For doctors/patients

  // Extended profile fields
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  address?: Address;
  emergencyContacts: EmergencyContact[];
  preferences: UserPreferences;

  // Health profile
  healthProfile?: HealthProfile;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
}

export interface UserPreferences {
  units: 'metric' | 'imperial';
  language: string;
  timezone: string;
  notifications: NotificationPreferences;
  privacy: PrivacySettings;
  accessibility: AccessibilitySettings;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  healthReminders: boolean;
  dailyReports: boolean;
  weeklySummaries: boolean;
  emergencyAlerts: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  dataSharing: 'none' | 'anonymized' | 'limited' | 'full';
  researchParticipation: boolean;
  marketingEmails: boolean;
  analyticsTracking: boolean;
}

export interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  voiceCommands: boolean;
}

export interface HealthProfile {
  height: number; // cm
  weight: number; // kg
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  allergies: string[];
  chronicConditions: ChronicCondition[];
  medications: UserMedication[];
  surgeries: Surgery[];
  familyHistory: FamilyHistory[];
  lifestyle: LifestyleFactors;
  healthGoals: HealthGoal[];
  riskFactors: RiskAssessment;
}

export interface ChronicCondition {
  condition: string;
  diagnosedDate: Date;
  severity: 'mild' | 'moderate' | 'severe';
  managedWith: string[];
  notes?: string;
}

export interface UserMedication {
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  prescribedBy?: string;
  purpose?: string;
  sideEffects?: string[];
}

export interface Surgery {
  procedure: string;
  date: Date;
  hospital?: string;
  surgeon?: string;
  complications?: string;
  recoveryNotes?: string;
}

export interface FamilyHistory {
  relation: string;
  condition: string;
  ageOfOnset?: number;
  deceased: boolean;
  notes?: string;
}

export interface LifestyleFactors {
  exerciseFrequency: 'never' | 'rarely' | 'weekly' | '2-3_times_week' | 'daily' | 'multiple_daily';
  dietType: 'omnivore' | 'vegetarian' | 'vegan' | 'pescatarian' | 'keto' | 'paleo' | 'mediterranean' | 'other';
  smokingStatus: 'never' | 'former' | 'current' | 'occasional';
  alcoholConsumption: 'none' | 'occasional' | 'moderate' | 'heavy';
  sleepHours: number;
  stressLevel: 'low' | 'moderate' | 'high';
  caffeineIntake: 'none' | 'low' | 'moderate' | 'high';
}

export interface HealthGoal {
  id: string;
  category: 'weight' | 'fitness' | 'sleep' | 'nutrition' | 'mental_health' | 'general';
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  targetDate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused' | 'cancelled';
}

export interface RiskAssessment {
  cvdRisk: number; // Cardiovascular disease risk % (0-100)
  diabetesRisk: number;
  cancerRisk: number;
  mentalHealthRisk: number;
  overallHealthScore: number; // Composite score (0-100)
  lastUpdated: Date;
  assessmentMethod: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends Omit<User, 'id' | 'isAuthenticated' | 'createdAt' | 'lastLogin'> {
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
  healthAssessmentCompleted: boolean;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  lastActivity: Date;
}

export interface LoginAttempt {
  id: string;
  email: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  failureReason?: string;
}

export interface SessionInfo {
  id: string;
  deviceType: string;
  browser: string;
  ipAddress: string;
  location: string;
  lastActivity: Date;
  currentSession: boolean;
}

export interface SecuritySettings {
  passwordLastChanged: Date;
  twoFactorEnabled: boolean;
  twoFactorMethod: 'sms' | 'email' | 'app';
  backupCodesGenerated: boolean;
  trustedDevices: DeviceAuthentication[];
  loginAlerts: boolean;
  suspiciousActivityAlerts: boolean;
}

export interface DeviceAuthentication {
  id: string;
  name: string;
  type: string;
  verified: boolean;
  lastLogin: Date;
  trusted: boolean;
}

export interface SecurityEvent {
  id: string;
  type: 'login' | 'password_change' | '2fa_enabled' | 'device_verified' | 'suspicious_activity';
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  location: string;
  success: boolean;
  details?: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  reason?: string;
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  preventCommonPasswords: boolean;
  passwordHistoryCheck: number; // prevent reuse of last N passwords
}

export interface TwoFactorSetup {
  method: 'sms' | 'email' | 'app';
  phone?: string;
  backupCodes: string[];
  verified: boolean;
  setupDate?: Date;
}

export {};
