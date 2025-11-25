/**
 * Data Export Utility
 * Safe, browser-native data export functionality for HealthMate
 */

// Mock health data (matches current app structure)
const generateMockHealthData = () => {
  return {
    user: {
      exportDate: new Date().toISOString(),
      appVersion: '1.0.0',
      platform: 'HealthMate'
    },
    healthMetrics: [
      {
        type: 'heart_rate',
        date: '2025-01-20',
        value: 75,
        unit: 'bpm',
        device: 'fitbit'
      },
      {
        type: 'sleep_hours',
        date: '2025-01-20',
        value: 8.2,
        unit: 'hours',
        device: 'fitbit'
      },
      {
        type: 'steps',
        date: '2025-01-20',
        value: 9850,
        unit: 'steps',
        device: 'fitbit'
      }
    ],
    medications: [
      {
        id: 1,
        name: 'Aspirin',
        dosage: '81mg',
        frequency: 'daily',
        schedule: '08:00',
        prescribedBy: 'Dr. Smith',
        startDate: '2025-01-15'
      }
    ],
    nutrition: [
      {
        date: '2025-01-20',
        meal: 'breakfast',
        calories: 450,
        protein: 25,
        carbs: 35,
        fat: 12
      }
    ],
    fitness: [
      {
        date: '2025-01-20',
        activity: 'running',
        duration: 30,
        distance: 3.2,
        calories: 280
      }
    ],
    symptoms: [
      {
        date: '2025-01-19',
        symptom: 'headache',
        severity: 3,
        notes: 'migraine, took medication'
      }
    ]
  };
};

/**
 * Export health data as JSON file
 */
export const exportHealthDataJSON = async () => {
  try {
    const data = generateMockHealthData();
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const filename = `healthmate-data-${new Date().toISOString().split('T')[0]}.json`;

    downloadFile(blob, filename);
    return { success: true, message: 'Health data exported successfully!' };
  } catch (error) {
    console.error('Export failed:', error);
    return { success: false, message: 'Export failed. Please try again.' };
  }
};

/**
 * Export health data as CSV file
 */
export const exportHealthDataCSV = async () => {
  try {
    const data = generateMockHealthData();

    // Convert health metrics to CSV
    const healthMetricsCSV = convertToCSV(data.healthMetrics, ['type', 'date', 'value', 'unit', 'device']);
    const medicationsCSV = convertToCSV(data.medications, ['name', 'dosage', 'frequency', 'schedule']);
    const nutritionCSV = convertToCSV(data.nutrition, ['date', 'meal', 'calories', 'protein', 'carbs', 'fat']);

    // Combine all CSV data
    const csvContent = [
      'HealthMate Data Export',
      `Export Date: ${new Date().toISOString()}`,
      '',
      '=== HEALTH METRICS ===',
      healthMetricsCSV,
      '',
      '=== MEDICATIONS ===',
      medicationsCSV,
      '',
      '=== NUTRITION ===',
      nutritionCSV
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const filename = `healthmate-data-${new Date().toISOString().split('T')[0]}.csv`;

    downloadFile(blob, filename);
    return { success: true, message: 'Health data exported successfully!' };
  } catch (error) {
    console.error('Export failed:', error);
    return { success: false, message: 'Export failed. Please try again.' };
  }
};

/**
 * Convert array of objects to CSV string
 */
const convertToCSV = (data, headers) => {
  if (!data || data.length === 0) return '';

  // Create header row
  const csvRows = [headers.join(',')];

  // Add data rows
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header] || '';
      // Escape commas and quotes in CSV
      return typeof value === 'string' && (value.includes(',') || value.includes('"'))
        ? `"${value.replace(/"/g, '""')}"`
        : value;
    });
    csvRows.push(values.join(','));
  });

  return csvRows.join('\n');
};

/**
 * Browser-native file download function
 */
const downloadFile = (blob, filename) => {
  try {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed:', error);
    throw new Error('File download failed');
  }
};

/**
 * Validate that browser supports file downloads
 */
export const isExportSupported = () => {
  try {
    const testBlob = new Blob(['test'], { type: 'text/plain' });
    return !!testBlob && typeof URL !== 'undefined' && 'createObjectURL' in URL;
  } catch (error) {
    return false;
  }
};
