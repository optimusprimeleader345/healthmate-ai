import React, { useState, useEffect } from 'react';
import { Pill, Plus, AlertTriangle, CheckCircle, XCircle, Search } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { pharmacyHealthService } from '../services/pharmacyService';

const MedicationManagerNew = () => {
  const [medications, setMedications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: ''
  });

  // Check interactions when medications change
  useEffect(() => {
    if (medications.length >= 2) {
      checkInteractions();
    } else {
      setInteractions([]);
    }
  }, [medications]);

  // Search for medications
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const result = await pharmacyHealthService.searchMedication(searchTerm);
      if (result.success) {
        setSearchResults(result.results || []);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check drug interactions
  const checkInteractions = async () => {
    if (medications.length < 2) return;

    try {
      const result = await pharmacyHealthService.checkDrugInteractions(medications);
      if (result.success) {
        setInteractions(result.interactions || []);
      }
    } catch (error) {
      console.error('Interaction check error:', error);
    }
  };

  // Add medication to list
  const addMedication = (medication) => {
    setMedications(prev => [...prev, { ...medication, id: Date.now() }]);
    setNewMedication({ name: '', dosage: '', frequency: '' });
    setShowAddForm(false);
    setSearchResults([]);
    setSearchTerm('');
  };

  // Remove medication
  const removeMedication = (id) => {
    setMedications(prev => prev.filter(med => med.id !== id));
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'major': return 'bg-red-100 text-red-800 border-red-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'minor': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-6">
      <div className="flex items-center gap-3 mb-6">
        <Pill className="h-8 w-8 text-teal-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medication Manager</h1>
          <p className="text-gray-600">Safe medication tracking with drug interaction checking</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Medication List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Medication Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Current Medications</h2>
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-teal-500 hover:bg-teal-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Medication
              </Button>
            </div>

            {showAddForm && (
              <div className="border-t pt-4 mb-4 space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search medication (e.g., aspirin, ibuprofen)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={loading}
                    className="absolute right-1 top-1 bottom-1 bg-blue-500 hover:bg-blue-600 px-3"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>

                {searchResults.length > 0 && (
                  <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg">
                    {searchResults.map((med) => (
                      <button
                        key={med.id}
                        onClick={() => addMedication({ name: med.name, dosage: med.strength, frequency: 'daily' })}
                        className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0 flex justify-between"
                      >
                        <div>
                          <div className="font-medium">{med.name}</div>
                          <div className="text-sm text-gray-600">{med.strength} - {med.form}</div>
                        </div>
                        <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {medications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Pill className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No medications added yet</p>
                <p className="text-sm">Click "Add Medication" to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {medications.map((medication) => (
                  <div key={medication.id} className="flex items-center justify-between p-4 bg-white border rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{medication.name}</h3>
                      <p className="text-sm text-gray-600">{medication.dosage} • {medication.frequency}</p>
                    </div>
                    <button
                      onClick={() => removeMedication(medication.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Interactions Check Section */}
          {medications.length >= 2 && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                Drug Interaction Check
              </h2>

              {interactions.length === 0 ? (
                <div className="text-center py-4">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-green-600 font-medium">No significant interactions detected</p>
                  <p className="text-sm text-gray-600">Your medications appear safe to take together</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {interactions.map((interaction, index) => (
                    <div key={index} className={`p-4 border rounded-lg ${getSeverityColor(interaction.severity)}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium capitalize">{interaction.severity} Interaction</h3>
                        <span className="text-xs font-medium">
                          {interaction.drugs.join(' + ')}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{interaction.description}</p>
                      <p className="text-xs font-medium">{interaction.recommendation}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-3">📊 Medication Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Total Medications</span>
                <span className="font-semibold">{medications.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Interactions Found</span>
                <span className={`font-semibold ${interactions.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {interactions.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Safety Status</span>
                <span className={`text-xs font-medium ${interactions.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {interactions.length > 0 ? 'Review Needed' : 'Safe'}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-3">🛡️ Safety Features</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Drug Interaction Checking</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Pharmacy Locator</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Medication Database</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Smart Reminders</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-3">💡 Health Tips</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• Take medications as prescribed</p>
              <p>• Check for interactions regularly</p>
              <p>• Store medications safely</p>
              <p>• Keep a medication list with you</p>
              <p>• Consult pharmacists for questions</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MedicationManagerNew;
