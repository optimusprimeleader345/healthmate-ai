/**
 * Pharmacy & Medication Safety Service
 * Drug interaction checking, medication database, and pharmacy services
 */

// Pharmacy and medication APIs
class PharmacyHealthService {
  constructor() {
    this.drugInteractionCache = new Map();
    this.medicationCache = new Map();

    this.isDemoMode = import.meta.env.VITE_USE_DEMO_MODE === 'true';
  }

  /**
   * Check drug interactions between multiple medications
   * Returns potential interactions, severity levels, and recommendations
   */
  async checkDrugInteractions(medications) {
    if (!medications || medications.length < 2) {
      return {
        success: true,
        interactions: [],
        message: 'At least 2 medications required for interaction check'
      };
    }

    if (this.isDemoMode) {
      return this.getDemoInteractions(medications);
    }

    try {
      // Real API implementation would go here
      // This is a placeholder for actual pharmacy API integration

      // Example implementation:
      // const response = await fetch(`${PHARMACY_API_URL}/interactions`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${import.meta.env.VITE_PHARMACY_API_KEY}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ medications: medications.map(m => m.genericName || m.name) })
      // });
      // const data = await response.json();

      // For now, return demo data to maintain functionality
      return this.getDemoInteractions(medications);

    } catch (error) {
      console.error('Error checking drug interactions:', error);
      return {
        success: false,
        error: 'Unable to retrieve drug interaction information',
        interactions: []
      };
    }
  }

  /**
   * Search for medication information by name
   */
  async searchMedication(medicationName) {
    if (!medicationName || medicationName.length < 2) {
      return { success: false, error: 'Search term too short' };
    }

    if (this.isDemoMode) {
      return this.getDemoMedicationSearch(medicationName);
    }

    // Real API implementation
    try {
      // Placeholder for actual medication database API
      // const response = await fetch(`${PHARMACY_API_URL}/medications/search?q=${encodeURIComponent(medicationName)}`);
      // const data = await response.json();

      return this.getDemoMedicationSearch(medicationName);

    } catch (error) {
      console.error('Error searching medications:', error);
      return {
        success: false,
        error: 'Unable to search medications',
        results: []
      };
    }
  }

  /**
   * Get detailed medication information
   */
  async getMedicationInfo(medicationId) {
    if (this.isDemoMode) {
      return this.getDemoMedicationInfo(medicationId);
    }

    // Real API implementation
    try {
      // const response = await fetch(`${PHARMACY_API_URL}/medications/${medicationId}`);
      // const data = await response.json();
      return this.getDemoMedicationInfo(medicationId);

    } catch (error) {
      console.error('Error getting medication info:', error);
      return {
        success: false,
        error: 'Unable to retrieve medication information'
      };
    }
  }

  /**
   * Find nearby pharmacies
   */
  async findPharmacies(location, searchRadius = 10) {
    if (!location) {
      return { success: false, error: 'Location required' };
    }

    if (this.isDemoMode) {
      return this.getDemoPharmacies(location, searchRadius);
    }

    // Real API implementation
    try {
      // const response = await fetch(`${PHARMACY_API_URL}/pharmacies?lat=${location.lat}&lng=${location.lng}&radius=${searchRadius}`);
      // const data = await response.json();
      return this.getDemoPharmacies(location, searchRadius);

    } catch (error) {
      console.error('Error finding pharmacies:', error);
      return {
        success: false,
        error: 'Unable to find pharmacies',
        pharmacies: []
      };
    }
  }

  /**
   * Check medication side effects and warnings
   */
  async getMedicationWarnings(medication) {
    if (!medication) {
      return { success: false, error: 'Medication required' };
    }

    if (this.isDemoMode) {
      return this.getDemoWarnings(medication);
    }

    // Real API implementation
    try {
      return this.getDemoWarnings(medication);

    } catch (error) {
      console.error('Error getting medication warnings:', error);
      return {
        success: false,
        error: 'Unable to retrieve medication warnings',
        warnings: []
      };
    }
  }

  /**
   * Check medication contraindications with conditions
   */
  async checkContraindications(medication, conditions) {
    if (!medication || !conditions || conditions.length === 0) {
      return { success: true, contraindications: [] };
    }

    if (this.isDemoMode) {
      return this.getDemoContraindications(medication, conditions);
    }

    // Real API implementation
    try {
      return this.getDemoContraindications(medication, conditions);

    } catch (error) {
      console.error('Error checking contraindications:', error);
      return {
        success: false,
        error: 'Unable to check contraindications',
        contraindications: []
      };
    }
  }

  // ===================================
  // DEMO MODE IMPLEMENTATIONS
  // ===================================

  getDemoInteractions(medications) {
    // Simulate common real drug interactions for demo
    const interactionRules = [
      {
        drugs: ['Aspirin', 'Ibuprofen'],
        severity: 'moderate',
        description: 'Increased risk of gastrointestinal bleeding',
        recommendation: 'Consider alternative pain relief or consult pharmacist'
      },
      {
        drugs: ['Metformin', 'Furosemide'],
        severity: 'major',
        description: 'Increased risk of lactic acidosis',
        recommendation: 'Monitor blood glucose closely'
      },
      {
        drugs: ['Warfarin', 'Aspirin'],
        severity: 'major',
        description: 'Significantly increased bleeding risk',
        recommendation: 'Anticoagulation monitoring required'
      },
      {
        drugs: ['Lisinopril', 'Potassium'],
        severity: 'moderate',
        description: 'Risk of hyperkalemia',
        recommendation: 'Monitor potassium levels'
      }
    ];

    const medicationNames = medications.map(m => m.name || m.genericName || m).map(name => name.toLowerCase());
    const interactions = [];

    interactionRules.forEach(rule => {
      const ruleDrugs = rule.drugs.map(d => d.toLowerCase());
      const hasBoth = ruleDrugs.every(drug => medicationNames.includes(drug));

      if (hasBoth) {
        interactions.push({
          severity: rule.severity,
          drugs: rule.drugs,
          description: rule.description,
          recommendation: rule.recommendation,
          source: 'Demo Drug Interaction Database'
        });
      }
    });

    return {
      success: true,
      interactions: interactions,
      message: interactions.length > 0
        ? `${interactions.length} potential interaction(s) found`
        : 'No significant interactions detected'
    };
  }

  getDemoMedicationSearch(medicationName) {
    // Mock medication database
    const medications = [
      {
        id: 'asp001',
        name: 'Aspirin',
        genericName: 'acetylsalicylic acid',
        strength: '325mg',
        form: 'tablet',
        manufacturer: 'Bayer',
        class: 'NSAID',
        description: 'Pain reliever and anti-inflammatory'
      },
      {
        id: 'ibu001',
        name: 'Ibuprofen',
        genericName: 'ibuprofen',
        strength: '200mg',
        form: 'tablet',
        manufacturer: 'Various',
        class: 'NSAID',
        description: 'Non-steroidal anti-inflammatory drug'
      },
      {
        id: 'met001',
        name: 'Metformin',
        genericName: 'metformin hydrochloride',
        strength: '500mg',
        form: 'tablet',
        manufacturer: 'Various',
        class: 'Antidiabetic',
        description: 'Type 2 diabetes medication'
      }
    ];

    const query = medicationName.toLowerCase();
    const results = medications.filter(med =>
      med.name.toLowerCase().includes(query) ||
      med.genericName.toLowerCase().includes(query)
    );

    return {
      success: true,
      results: results,
      message: `Found ${results.length} medications`
    };
  }

  getDemoMedicationInfo(medicationId) {
    const medicationInfo = {
      asp001: {
        id: 'asp001',
        name: 'Aspirin',
        genericName: 'acetylsalicylic acid',
        class: 'NSAID',
        indications: ['Pain relief', 'Fever reduction', 'Anti-platelet therapy'],
        contraindications: ['Peptic ulcer disease', 'Bleeding disorders'],
        sideEffects: ['GI irritation', 'GI bleeding', 'Hearing loss (high doses)'],
        warnings: ['Avoid in children under 16', 'Take with food to reduce irritation'],
        dosage: '325-650mg every 4-6 hours as needed',
        interactions: ['Warfarin (increased bleeding)', 'NSAIDs (GI toxicity)']
      },

      ibu001: {
        id: 'ibu001',
        name: 'Ibuprofen',
        genericName: 'ibuprofen',
        class: 'NSAID',
        indications: ['Pain relief', 'Fever reduction', 'Anti-inflammatory'],
        contraindications: ['Severe renal impairment', 'Active GI bleeding'],
        sideEffects: ['Nausea', 'Abdominal pain', 'GI bleeding'],
        warnings: ['Avoid with aspirin in the elderly', 'Monitor renal function'],
        dosage: '200-400mg every 4-6 hours as needed',
        interactions: ['Aspirin (GI toxicity)', 'ACE inhibitors (renal effects)']
      },

      met001: {
        id: 'met001',
        name: 'Metformin',
        genericName: 'metformin hydrochloride',
        class: 'Antidiabetic',
        indications: ['Type 2 diabetes management'],
        contraindications: ['Severe renal impairment', 'Acute heart failure'],
        sideEffects: ['GI upset', 'Vitamin B12 deficiency', 'Lactic acidosis (rare)'],
        warnings: ['Monitor renal function', 'Hold before procedures with contrast'],
        dosage: '500mg twice daily, titrated to 1000-2000mg/day',
        interactions: ['Furosemide (lactic acidosis risk)']
      }
    };

    const info = medicationInfo[medicationId];

    if (!info) {
      return {
        success: false,
        error: 'Medication not found'
      };
    }

    return {
      success: true,
      medication: info
    };
  }

  getDemoPharmacies(location, searchRadius) {
    // Mock pharmacy data
    const pharmacies = [
      {
        id: 'pharm001',
        name: 'Healthcare Pharmacy',
        address: '123 Main St, Anytown, USA',
        phone: '(555) 123-4567',
        distance: 0.5,
        hours: 'Mon-Fri: 9AM-7PM, Sat: 9AM-5PM, Sun: 10AM-4PM',
        services: ['Prescription filling', 'Immunizations', 'Blood pressure checks'],
        coordinates: { lat: location.lat + 0.005, lng: location.lng + 0.005 }
      },
      {
        id: 'pharm002',
        name: 'Wellness Drugstore',
        address: '456 Oak Ave, Anytown, USA',
        phone: '(555) 987-6543',
        distance: 1.2,
        hours: '24/7',
        services: ['Prescription filling', 'Drive-thru', 'Over-the-counter medications'],
        coordinates: { lat: location.lat - 0.008, lng: location.lng + 0.012 }
      },
      {
        id: 'pharm003',
        name: 'Community Pharmacy',
        address: '789 Elm St, Anytown, USA',
        phone: '(555) 456-7890',
        distance: 2.1,
        hours: 'Mon-Sat: 8AM-9PM, Sun: 10AM-6PM',
        services: ['Prescription filling', 'Medication therapy management', 'Health consultations'],
        coordinates: { lat: location.lat + 0.015, lng: location.lng - 0.008 }
      }
    ];

    return {
      success: true,
      pharmacies: pharmacies.filter(pharma => pharma.distance <= searchRadius),
      message: `Found ${pharmacies.length} pharmacies within ${searchRadius} miles`
    };
  }

  getDemoWarnings(medication) {
    const warnings = {
      'aspirin': [
        'Avoid in children and teenagers with viral infections',
        'Increased risk of bleeding',
        'May cause gastrointestinal irritation',
        'Avoid with other NSAIDs'
      ],
      'ibuprofen': [
        'Increased cardiovascular risk with long-term use',
        'May cause kidney damage',
        'Avoid in pregnancy (after 30 weeks)',
        'Take with food to reduce stomach upset'
      ],
      'metformin': [
        'May cause lactic acidosis',
        'Monitor kidney function regularly',
        'Temporary diarrhea common when starting',
        'Hold medication before surgical procedures'
      ]
    };

    const medName = (medication.name || medication).toLowerCase();
    const medWarnings = warnings[medName] || ['Consult your healthcare provider for specific warnings'];

    return {
      success: true,
      warnings: medWarnings,
      medication: medName
    };
  }

  getDemoContraindications(medication, conditions) {
    const contraindications = [
      {
        condition: 'peptic ulcer',
        medication: 'aspirin',
        severity: 'major',
        description: 'Severe GI bleeding risk',
        alternative: 'Acetaminophen for pain'
      },
      {
        condition: 'renal impairment',
        medication: 'ibuprofen',
        severity: 'moderate',
        description: 'Further kidney damage possible',
        alternative: 'Acetaminophen for pain'
      },
      {
        condition: 'type 1 diabetes',
        medication: 'metformin',
        severity: 'major',
        description: 'Not indicated for type 1 diabetes',
        alternative: 'Insulin therapy'
      }
    ];

    const medName = (medication.name || medication).toLowerCase();
    const conditionNames = conditions.map(c => c.toLowerCase());

    const matchingContraindications = contraindications.filter(contraindication =>
      contraindication.medication === medName &&
      conditionNames.includes(contraindication.condition)
    );

    return {
      success: true,
      contraindications: matchingContraindications,
      message: matchingContraindications.length > 0
        ? 'Potential contraindications found'
        : 'No contraindications detected'
    };
  }

  // ===================================
  // UTILITY METHODS
  // ===================================

  /**
   * Clear all cached data
   */
  clearCache() {
    this.drugInteractionCache.clear();
    this.medicationCache.clear();
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      isDemoMode: this.isDemoMode,
      cacheSize: {
        interactions: this.drugInteractionCache.size,
        medications: this.medicationCache.size
      },
      capabilities: [
        'Drug Interaction Checking',
        'Medication Search',
        'Medication Information',
        'Pharmacy Locator',
        'Side Effect Warnings',
        'Contraindication Checking'
      ]
    };
  }
}

// Export singleton instance
export const pharmacyHealthService = new PharmacyHealthService();
