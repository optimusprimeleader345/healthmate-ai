import React, { useState, useCallback } from 'react';
import { AlertTriangle, CheckCircle, Info, Search, Plus, X } from 'lucide-react';
import { Button } from '../Button';
import { Input } from '../Input';

const DrugInteractionChecker = () => {
  const [medications, setMedications] = useState(['']);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // Mock medication database
  const medicationDatabase = [
    // Pain medications
    { name: 'Aspirin', type: 'Non-steroidal anti-inflammatory (NSAID)', common: true },
    { name: 'Ibuprofen', type: 'Non-steroidal anti-inflammatory (NSAID)', common: true },
    { name: 'Naproxen', type: 'Non-steroidal anti-inflammatory (NSAID)', common: true },
    { name: 'Acetaminophen', type: 'Analgesic/Antipyretic', common: true },
    { name: 'Tramadol', type: 'Opioid Analgesic', common: true },
    { name: 'Oxycodone', type: 'Opioid Analgesic', common: false },

    // Cardiovascular medications
    { name: 'Amlodipine', type: 'Calcium Channel Blocker', common: true },
    { name: 'Lisinopril', type: 'ACE Inhibitor', common: true },
    { name: 'Atorvastatin', type: 'HMG-CoA Reductase Inhibitor (Statin)', common: true },
    { name: 'Warfarin', type: 'Anticoagulant', common: false },
    { name: 'Digoxin', type: 'Cardiac Glycoside', common: false },
    { name: 'Metoprolol', type: 'Beta Blocker', common: true },

    // Diabetes medications
    { name: 'Metformin', type: 'Biguanide', common: true },
    { name: 'Insulin', type: 'Insulin Hormone', common: true },
    { name: 'Glipizide', type: 'Sulfonylurea', common: true },
    { name: 'Januvia', type: 'DPP-4 Inhibitor', common: true },

    // Mental Health medications
    { name: 'Sertraline', type: 'SSRI Antidepressant', common: true },
    { name: 'Alprazolam', type: 'Benzodiazepine', common: true },
    { name: 'Escitalopram', type: 'SSRI Antidepressant', common: true },
    { name: 'Duloxetine', type: 'SNRI Antidepressant', common: true },

    // Antibiotics
    { name: 'Azithromycin', type: 'Macrolide Antibiotic', common: true },
    { name: 'Amoxicillin', type: 'Penicillin Antibiotic', common: true },
    { name: 'Ciprofloxacin', type: 'Fluoroquinolone Antibiotic', common: true },
    { name: 'Doxycycline', type: 'Tetracycline Antibiotic', common: true },
  ];

  const interactionDatabase = {
    // Major Interactions
    'warfarin+aspirin': {
      severity: 'major',
      description: 'Significantly increases bleeding risk due to dual anticoagulant effects. Can lead to internal bleeding or stroke.',
      advice: 'Monitor INR closely; may need dose adjustment. Consider alternative pain management.',
      risk: 'high'
    },
    'warfarin+ibuprofen': {
      severity: 'major',
      description: 'NSAIDs can interfere with warfarin\'s anticoagulant effect and increase bleeding risk.',
      advice: 'Avoid concurrent use if possible. Use acetaminophen instead.',
      risk: 'high'
    },

    // Moderate Interactions
    'amlodipine+lisinopril': {
      severity: 'moderate',
      description: 'Combined blood pressure lowering effects may cause excessive hypotension.',
      advice: 'Monitor blood pressure closely. Adjust doses as needed.',
      risk: 'moderate'
    },
    'atorvastatin+grapefruit_juice': {
      severity: 'moderate',
      description: 'Grapefruit can increase statin levels, raising risk of muscle damage.',
      advice: 'Limit grapefruit juice to 8oz/day. Monitor for muscle pain.',
      risk: 'moderate'
    },

    // Minor Interactions
    'ibuprofen+acetaminophen': {
      severity: 'minor',
      description: 'May increase stomach irritation but generally well tolerated.',
      advice: 'Take with food to reduce GI upset. Monitor for stomach discomfort.',
      risk: 'low'
    },

    // Multiple NSAID warning
    'nsaid_combo': {
      severity: 'major',
      description: 'Multiple NSAIDs significantly increase risk of gastrointestinal bleeding and kidney damage.',
      advice: 'Avoid using multiple NSAIDs together. Consult pharmacist.',
      risk: 'high'
    }
  };

  const addMedication = () => {
    setMedications([...medications, '']);
  };

  const removeMedication = (index) => {
    if (medications.length > 1) {
      const newMeds = medications.filter((_, i) => i !== index);
      setMedications(newMeds);
      checkInteractions(newMeds);
    }
  };

  const updateMedication = (index, value) => {
    const newMeds = [...medications];
    newMeds[index] = value;
    setMedications(newMeds);
    checkInteractions(newMeds);
  };

  const checkInteractions = useCallback((medList) => {
    setLoading(true);

    setTimeout(() => {
      const foundInteractions = [];
      const validMeds = medList.filter(med => med.trim() !== '');

      if (validMeds.length < 2) {
        setInteractions(foundInteractions);
        setLoading(false);
        return;
      }

      // Check specific interactions
      for (let i = 0; i < validMeds.length; i++) {
        for (let j = i + 1; j < validMeds.length; j++) {
          const med1 = validMeds[i].toLowerCase().replace(/\s+/g, '_');
          const med2 = validMeds[j].toLowerCase().replace(/\s+/g, '_');

          const key = `${med1}+${med2}`;

          if (interactionDatabase[key] || interactionDatabase[key.split('+').reverse().join('+')]) {
            const interactionKey = interactionDatabase[key] ||
                                 interactionDatabase[key.split('+').reverse().join('+')];

            foundInteractions.push({
              medicines: [validMeds[i], validMeds[j]],
              ...interactionKey
            });
          }
        }
      }

      // Check for multiple NSAIDs
      const nsainds = validMeds.filter(med =>
        ['ibuprofen', 'aspirin', 'naproxen'].some(nsaid =>
          med.toLowerCase().includes(nsaid)
        )
      );

      if (nsainds.length >= 2) {
        foundInteractions.push({
          medicines: nsainds,
          ...interactionDatabase.nsaid_combo
        });
      }

      // Add general warnings for common combinations
      if (validMeds.length >= 3) {
        foundInteractions.push({
          medicines: ['Multiple Medications'],
          severity: 'moderate',
          description: 'Taking multiple medications together requires careful monitoring and consultation.',
          advice: 'Schedule a medication review with your pharmacist or doctor.',
          risk: 'moderate'
        });
      }

      setInteractions(foundInteractions);
      setLoading(false);
    }, 1000);
  }, []);

  const getMedicationSuggestions = (searchValue) => {
    if (searchValue.length < 2) {
      setSuggestions([]);
      return;
    }

    const filtered = medicationDatabase
      .filter(med =>
        med.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        med.type.toLowerCase().includes(searchValue.toLowerCase())
      )
      .slice(0, 5);

    setSuggestions(filtered);
  };

  const addSuggestion = (medication) => {
    const firstEmptyIndex = medications.findIndex(med => med.trim() === '');
    if (firstEmptyIndex !== -1) {
      updateMedication(firstEmptyIndex, medication.name);
    } else {
      setMedications([...medications, medication.name]);
      checkInteractions([...medications, medication.name]);
    }
    setSearchTerm('');
    setSuggestions([]);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'major': return 'text-red-600 bg-red-50 border-red-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'minor': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'major': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'moderate': return <Info className="w-5 h-5 text-yellow-500" />;
      case 'minor': return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default: return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 mr-3 text-purple-500" />
          Drug Interaction Checker
        </h1>
        <p className="text-gray-600 mt-2">
          Check for potential interactions between your medications and supplements
        </p>
      </div>

      {/* Medication Input Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Medications</h2>

        <div className="space-y-3">
          {medications.map((medication, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  placeholder={`Medication ${index + 1}`}
                  value={medication}
                  onChange={(e) => {
                    updateMedication(index, e.target.value);
                    getMedicationSuggestions(e.target.value);
                  }}
                  className="w-full"
                />
                {suggestions.length > 0 && medication.length >= 2 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {suggestions.map((suggestion, idx) => (
                      <div
                        key={idx}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => addSuggestion(suggestion)}
                      >
                        <div className="font-medium text-gray-900">{suggestion.name}</div>
                        <div className="text-sm text-gray-600">{suggestion.type}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {medications.length > 1 && (
                <button
                  onClick={() => removeMedication(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <Button onClick={addMedication} variant="outline" className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Medication
          </Button>

          <Button
            onClick={() => checkInteractions(medications)}
            disabled={loading}
            className="bg-purple-500 hover:bg-purple-600 text-white"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Checking...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Check Interactions
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Results Section */}
      {(interactions.length > 0 || loading) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Interaction Results</h2>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
              <p className="text-gray-600 mt-2">Analyzing medication interactions...</p>
            </div>
          ) : interactions.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Interactions Found</h3>
              <p className="text-gray-600">
                Based on our database, the medications you've entered can generally be taken together safely.
                However, always consult your healthcare provider for personalized advice.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {interactions.map((interaction, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${getSeverityColor(interaction.severity)}`}
                >
                  <div className="flex items-start">
                    {getSeverityIcon(interaction.severity)}
                    <div className="ml-3 flex-1">
                      <h4 className="font-semibold text-lg mb-2">
                        {interaction.severity.toUpperCase()} Interaction
                      </h4>
                      <p className="text-sm font-medium mb-2">
                        Medications: {interaction.medicines.join(', ')}
                      </p>
                      <p className="text-sm mb-3">{interaction.description}</p>
                      <div className="bg-white bg-opacity-50 p-3 rounded border-l-4 border-current">
                        <p className="font-semibold text-sm mb-1">Recommendation:</p>
                        <p className="text-sm">{interaction.advice}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Important Disclaimer</h4>
                <p className="text-blue-800 text-sm">
                  This tool provides general information based on available medical knowledge.
                  It does not replace professional medical advice. Always consult your healthcare
                  provider before starting, stopping, or changing any medication.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Educational Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Medication Safety Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">When to Check Interactions</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Starting new medications</li>
              <li>• Adding supplements</li>
              <li>• Changing dosages</li>
              <li>• Experiencing new symptoms</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">What to Tell Your Doctor</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• All medications (prescription & OTC)</li>
              <li>• Vitamins & supplements</li>
              <li>• Allergies & medical conditions</li>
              <li>• Recent health changes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrugInteractionChecker;
