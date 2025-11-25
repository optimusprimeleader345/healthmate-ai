import type {
  MedicationItem,
  MedicationSchedule,
  MedicationLog,
  MedicationReminder,
  RefillReminder,
  MedicationStats
} from '../types/medication';

// Mock medication database
export const mockMedications: MedicationItem[] = [
  {
    id: 'med-1',
    name: 'Lisinopril',
    genericName: 'Lisinopril',
    brandName: 'Prinivil',
    dosage: '10mg',
    form: 'tablet',
    strength: '10mg',
    instructions: 'Take once daily',
    sideEffects: ['Cough', 'Dizziness'],
    category: 'Blood Pressure',
    requiresPrescription: true
  },
  {
    id: 'med-2',
    name: 'Metformin',
    genericName: 'Metformin',
    brandName: 'Glucophage',
    dosage: '500mg',
    form: 'tablet',
    strength: '500mg',
    instructions: 'Take with meals',
    sideEffects: ['Nausea', 'Diarrhea'],
    category: 'Diabetes',
    requiresPrescription: true
  },
  {
    id: 'med-3',
    name: 'Ibuprofen',
    genericName: 'Ibuprofen',
    brandName: 'Advil',
    dosage: '200mg',
    form: 'tablet',
    strength: '200mg',
    instructions: 'Take with food, up to 3 times daily',
    sideEffects: ['Stomach upset', 'Headache'],
    category: 'Pain Relief',
    requiresPrescription: false
  }
];

// Generate medication logs for today
export const generateTodaysMedicationLogs = (): MedicationLog[] => {
  const today = new Date().toISOString().split('T')[0];
  const logs: MedicationLog[] = [];

  // Mock schedules for demo
  const mockSchedules = [
    {
      id: 'schedule-1',
      medicationId: 'med-1',
      medicationName: 'Lisinopril',
      dosage: '10mg',
      frequency: 'once-daily',
      timesPerDay: 1,
      specificTimes: ['08:00']
    },
    {
      id: 'schedule-2',
      medicationId: 'med-2',
      medicationName: 'Metformin',
      dosage: '500mg',
      frequency: 'twice-daily',
      timesPerDay: 2,
      specificTimes: ['08:00', '20:00']
    }
  ];

  mockSchedules.forEach(schedule => {
    schedule.specificTimes.forEach(time => {
      const scheduledDateTime = new Date();
      const [hours, minutes] = time.split(':');
      scheduledDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const currentTime = new Date();
      const isPast = scheduledDateTime < currentTime;

      // Random status for demo purposes
      const status = isPast
        ? (Math.random() > 0.2 ? 'taken' : 'skipped')
        : 'upcoming';

      logs.push({
        id: `log-${schedule.id}-${time}-${today}`,
        scheduleId: schedule.id,
        medicationName: schedule.medicationName,
        dosage: schedule.dosage,
        scheduledTime: time,
        taken: status === 'taken',
        skippedReason: status === 'skipped' ? 'Felt nauseous' : undefined,
        date: today,
        status: status
      });
    });
  });

  return logs.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
};

// Search medications
export const searchMedications = (query: string): MedicationItem[] => {
  if (!query) return mockMedications;
  return mockMedications.filter(med =>
    med.name.toLowerCase().includes(query.toLowerCase()) ||
    med.genericName?.toLowerCase().includes(query.toLowerCase()) ||
    med.brandName?.toLowerCase().includes(query.toLowerCase())
  );
};
