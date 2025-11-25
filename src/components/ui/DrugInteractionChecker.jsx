import React, { useState, useEffect } from 'react';
import { AlertTriangle, Pill, CheckCircle, X, Search, Shield } from 'lucide-react';
import { Card } from '../Card';
import { Button } from '../Button';
import { Input } from '../Input';

const DrugInteractionChecker = ({ onClose }) => {
  const [medications, setMedications] = useState(['', '']);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Mock drug database with common medications
  const drugDatabase = [
    'Aspirin (Acetylsalicylic Acid)',
    'Ibuprofen (Advil)',
    'Warfarin (Coumadin)',
    'Lisinopril (ACE inhibitor)',
    'Metformin (Glucophage)',
    'Omeprazole (Prilosec)',
    'Simvastatin (Zocor)',
    'Amlodipine (Norvasc)',
    'Metoprolol (Lopressor)',
    'Prednisone',
    'Paracetamol (Acetaminophen)',
    'Amoxicillin',
    'Citalopram (Celexa)',
    'Albuterol (Ventolin)'
  ];

  // Mock interaction database
  const interactionRules = {
    'Aspirin (Acetylsalicylic Acid)': {
      'Warfarin (Coumadin)': { severity: 'Severe', description: 'Increases risk of bleeding', category: 'Bleeding Risk' },
      'Ibuprofen (Advil)': { severity: 'Major', description: 'Increased gastrointestinal bleeding', category: 'GI Bleeding' },
      'Prednisone': { severity: 'Moderate', description: 'Increased risk of gastrointestinal ulcers', category: 'GI Ulceration' },
      'Citalopram (Celexa)': { severity: 'Major', description: 'Increased risk of bleeding', category: 'Bleeding Risk' }
    },
    'Warfarin (Coumadin)': {
      'Aspirin (Acetylsalicylic Acid)': { severity: 'Severe', description: 'Increased bleeding risk', category: 'Bleeding Risk' },
      'Ibuprofen (Advil)': { severity: 'Major', description: 'Enhanced anticoagulant effect', category: 'Anticoagulation' },
      'Omeprazole (Prilosec)': { severity: 'Major', description: 'Reduced anticoagulant effect', category: 'Effect Reduction' },
      'Simvastatin (Zocor)': { severity: 'Moderate', description: 'Increased myopathy risk', category: 'Muscle Effects' }
    },
    'Ibuprofen (Advil)': {
      'Aspirin (Acetylsalicylic Acid)': { severity: 'Major', description: 'Reduced antiplatelet effect', category: 'Effect Reduction' },
      'Warfarin (Coumadin)': { severity: 'Major', description: 'Increased bleeding risk', category: 'Bleeding Risk' },
      'Lisinopril (ACE inhibitor)': { severity: 'Major', description: 'Reduced antihypertensive effect', category: 'Blood Pressure' },
      'Prednisone': { severity: 'Moderate', description: 'Increased gastrointestinal bleeding risk', category: 'GI Risk' }
    }
  };

  const handleMedicationChange = (index, value) => {
    const updatedMeds = [...medications];
    updatedMeds[index] = value;
    setMedications(updatedMeds);
  };

  const addMedication = () => {
    if (medications.length < 6) {
      setMedications([...medications, '']);
    }
  };

  const removeMedication = (index) => {
    if (medications.length > 2) {
      const updatedMeds = medications.filter((_, i) => i !== index);
      setMedications(updatedMeds);
    }
  };

  const checkInteractions = () => {
    setLoading(true);
    setShowResults(false);

    // Simulate API call
    setTimeout(() => {
      const results = [];
      const checkedMeds = medications.filter(med => med.trim() !== '');

      for (let i = 0; i < checkedMeds.length; i++) {
        for (let j = i + 1; j < checkedMeds.length; j++) {
          const med1 = checkedMeds[i];
          const med2 = checkedMeds[j];

          // Check for interactions
          const med1Interactions = interactionRules[med1];
          const med2Interactions = interactionRules[med2];

          if (med1Interactions && med1Interactions[med2]) {
            results.push({
              drugs: [med1, med2],
              ...med1Interactions[med2]
            });
          } else if (med2Interactions && med2Interactions[med1]) {
            results.push({
              drugs: [med1, med2],
              ...med2Interactions[med1]
            });
          }
        }
      }

      // Sort by severity
      const severityOrder = { 'Severe': 0, 'Major': 1, 'Moderate': 2, 'Minor': 3 };
      results.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

      setInteractions(results);
      setShowResults(true);
      setLoading(false);
    }, 1500);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Severe': return 'text-red-600 bg-red-50';
      case 'Major': return 'text-orange-600 bg-orange-50';
      case 'Moderate': return 'text-yellow-600 bg-yellow-50';
      case 'Minor': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'Severe': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'Major': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'Moderate': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'Minor': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <Shield className="w-5 h-5 text-gray-500" />;
    }
  };

  const filteredDrugs = (query) => {
    if (!query) return drugDatabase;
    return drugDatabase.filter(drug =>
      drug.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <Shield className="w-8 h-8 text-blue-600" />
                Drug Interaction Checker
              </h2>
              <p className="text-gray-600 mt-1">Clinical decision support for medication safety</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Medication Input Section */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Select Medications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {medications.map((medication, index) => (
                <div key={index} className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medication {index + 1} {index < 2 && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      list={`medications-${index}`}
                      value={medication}
                      onChange={(e) => handleMedicationChange(index, e.target.value)}
                      placeholder="Type to search medications..."
                      className="w-full pr-10"
                    />
                    <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />

                    {medications.length > 2 && index >= 2 && (
                      <button
                        onClick={() => removeMedication(index)}
                        className="absolute -right-8 top-2 p-1 text-red-500 hover:text-red-700"
                        title="Remove medication"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <datalist id={`medications-${index}`}>
                    {filteredDrugs(medication).map((drug, i) => (
                      <option key={i} value={drug} />
                    ))}
                  </datalist>
                </div>
              ))}
            </div>

            {medications.length < 6 && (
              <Button
                onClick={addMedication}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Pill className="w-4 h-4" />
                Add Another Medication
              </Button>
            )}
          </div>

          {/* Check Interactions Button */}
          <div className="flex justify-center mb-6">
            <Button
              onClick={checkInteractions}
              disabled={loading || medications.filter(m => m.trim()).length < 2}
              className="px-8 py-3 text-lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Analyzing Interactions...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 mr-2" />
                  Check for Interactions
                </>
              )}
            </Button>
          </div>

          {/* Results Section */}
          {showResults && (
            <div className="space-y-6">
              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Interaction Results</h3>

                {interactions.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-green-600 mb-2">No Interactions Found</h4>
                    <p className="text-gray-600">
                      The medications you selected appear to be safe to take together.
                      However, always consult with your healthcare provider.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-400">
                      <p className="text-blue-800 text-sm">
                        <strong>Important:</strong> This is a decision support tool. Always consult your healthcare provider before making changes to your medication regimen.
                      </p>
                    </div>

                    {interactions.map((interaction, index) => (
                      <Card key={index} className="p-6">
                        <div className="flex items-start gap-4">
                          {getSeverityIcon(interaction.severity)}

                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {interaction.drugs.map((drug, i) => (
                                  <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                                    {drug}
                                  </span>
                                ))}
                              </div>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(interaction.severity)}`}>
                                {interaction.severity} Risk
                              </span>
                            </div>

                            <h4 className="font-semibold text-gray-800 mb-2">
                              {interaction.description}
                            </h4>

                            <div className="bg-gray-50 p-3 rounded-lg">
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                Category: {interaction.category}
                              </span>
                            </div>

                            <div className="mt-4 flex gap-2">
                              <Button size="sm" variant="outline">
                                Adjust Dosage
                              </Button>
                              <Button size="sm" variant="outline">
                                Consult Provider
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrugInteractionChecker;
