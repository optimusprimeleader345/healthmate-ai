import React, { useState } from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { X, Search, Plus, Clock, Doctor } from 'lucide-react';

// Mock medication database - in real app this would be an API call
const mockMedicationsDB = [
  {
    id: 'med-1',
    name: 'Lisinopril',
    genericName: 'Lisinopril',
    brandName: 'Prinivil',
    dosages: ['5mg', '10mg', '20mg'],
    form: 'tablet',
    category: 'Blood Pressure',
    requiresPrescription: true,
    commonSideEffects: ['Cough', 'Dizziness', 'Headache'],
    commonInstructions: 'Take once daily'
  },
  {
    id: 'med-2',
    name: 'Metformin',
    genericName: 'Metformin',
    brandName: 'Glucophage',
    dosages: ['500mg', '1000mg'],
    form: 'tablet',
    category: 'Diabetes',
    requiresPrescription: true,
    commonSideEffects: ['Nausea', 'Diarrhea', 'Stomach upset'],
    commonInstructions: 'Take with meals'
  },
  {
    id: 'med-3',
    name: 'Ibuprofen',
    genericName: 'Ibuprofen',
    brandName: 'Advil',
    dosages: ['200mg', '400mg', '600mg'],
    form: 'tablet',
    category: 'Pain Relief',
    requiresPrescription: false,
    commonSideEffects: ['Stomach upset', 'Headache'],
    commonInstructions: 'Take with food, up to 3 times daily'
  }
];

const AddMedicationModal = ({ onClose, onSave }) => {
  const [step, setStep] = useState('search'); // search, details, schedule, confirm
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [selectedDosage, setSelectedDosage] = useState('');
  const [frequency, setFrequency] = useState('once-daily');
  const [times, setTimes] = useState(['08:00']);
  const [doctor, setDoctor] = useState('');
  const [notes, setNotes] = useState('');

  const filteredMedications = searchTerm
    ? mockMedicationsDB.filter(med =>
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.brandName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : mockMedicationsDB;

  const handleMedicationSelect = (medication) => {
    setSelectedMedication(medication);
    if (medication.dosages.length === 1) {
      setSelectedDosage(medication.dosages[0]);
    }
    setNotes(medication.commonInstructions || '');
    setStep('details');
  };

  const handleFrequencyChange = (newFrequency) => {
    setFrequency(newFrequency);

    // Set default times based on frequency
    switch (newFrequency) {
      case 'once-daily':
        setTimes(['08:00']);
        break;
      case 'twice-daily':
        setTimes(['08:00', '20:00']);
        break;
      case 'three-times-daily':
        setTimes(['08:00', '14:00', '20:00']);
        break;
      case 'four-times-daily':
        setTimes(['08:00', '12:00', '16:00', '20:00']);
        break;
      default:
        setTimes(['08:00']);
    }
  };

  const handleSave = () => {
    const schedule = {
      id: `schedule-${Date.now()}`,
      medicationId: selectedMedication.id,
      medicationName: selectedMedication.name,
      dosage: selectedDosage,
      frequency,
      timesPerDay: times.length,
      specificTimes: times,
      startDate: new Date(),
      active: true,
      prescribingDoctor: doctor.trim() || undefined,
      notes: notes.trim() || undefined
    };

    onSave(schedule);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Add Medication</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Progress indicator */}
          <div className="flex gap-2 mb-4">
            <div className={`h-2 flex-1 rounded-full ${step === 'search' || step === 'details' || step === 'schedule' || step === 'confirm' ? 'bg-teal-500' : 'bg-gray-200'}`}></div>
            <div className={`h-2 flex-1 rounded-full ${step === 'details' || step === 'schedule' || step === 'confirm' ? 'bg-teal-500' : 'bg-gray-200'}`}></div>
            <div className={`h-2 flex-1 rounded-full ${step === 'schedule' || step === 'confirm' ? 'bg-teal-500' : 'bg-gray-200'}`}></div>
            <div className={`h-2 flex-1 rounded-full ${step === 'confirm' ? 'bg-teal-500' : 'bg-gray-200'}`}></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {step === 'search' && (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for medication..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                  {filteredMedications.map(med => (
                    <div
                      key={med.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 cursor-pointer transition-all"
                      onClick={() => handleMedicationSelect(med)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{med.name}</div>
                          <div className="text-sm text-gray-600">
                            {med.brandName && med.brandName !== med.name && `${med.brandName} • `}
                            {med.genericName} • {med.category}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {med.requiresPrescription ? '℞ Required' : 'Over-the-counter'} • {med.form}
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          {med.dosages.join(', ')} available
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-2">Can't find your medication?</p>
                  <Button variant="outline" size="sm">
                    Add Custom Medication
                  </Button>
                </div>
              </div>
            )}

            {step === 'details' && selectedMedication && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">💊</div>
                  <h3 className="text-lg font-semibold">{selectedMedication.name}</h3>
                  <p className="text-gray-600 text-sm">{selectedMedication.category}</p>
                </div>

                {/* Dosage selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Dosage *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedMedication.dosages.map(dosage => (
                      <button
                        key={dosage}
                        onClick={() => setSelectedDosage(dosage)}
                        className={`p-2 border rounded-lg text-sm ${
                          selectedDosage === dosage
                            ? 'border-teal-500 bg-teal-50 text-teal-700'
                            : 'border-gray-300 hover:border-teal-300'
                        }`}
                      >
                        {dosage}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructions/Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Special instructions, side effects to watch for..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                  {selectedMedication.commonInstructions && (
                    <p className="text-xs text-gray-500 mt-1">
                      Suggested: {selectedMedication.commonInstructions}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button onClick={() => setStep('search')} variant="outline">
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep('schedule')}
                    disabled={!selectedDosage}
                    className="bg-teal-500 hover:bg-teal-600"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {step === 'schedule' && selectedMedication && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Set Schedule</h3>

                {/* Frequency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How often should this be taken? *
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { value: 'once-daily', label: 'Once daily' },
                      { value: 'twice-daily', label: 'Twice daily' },
                      { value: 'three-times-daily', label: 'Three times daily' },
                      { value: 'four-times-daily', label: 'Four times daily' },
                      { value: 'as-needed', label: 'As needed' }
                    ].map(option => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          name="frequency"
                          value={option.value}
                          checked={frequency === option.value}
                          onChange={(e) => handleFrequencyChange(e.target.value)}
                          className="mr-2"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Times (if not as-needed) */}
                {frequency !== 'as-needed' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred times *
                    </label>
                    {times.map((time, index) => (
                      <input
                        key={index}
                        type="time"
                        value={time}
                        onChange={(e) => {
                          const newTimes = [...times];
                          newTimes[index] = e.target.value;
                          setTimes(newTimes);
                        }}
                        className="mr-2 mb-2 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    ))}
                  </div>
                )}

                {/* Prescribing doctor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Doctor className="h-4 w-4" />
                      Prescribing Doctor (optional)
                    </div>
                  </label>
                  <input
                    type="text"
                    placeholder="Dr. Smith"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    value={doctor}
                    onChange={(e) => setDoctor(e.target.value)}
                  />
                </div>

                <div className="flex gap-3">
                  <Button onClick={() => setStep('details')} variant="outline">
                    Back
                  </Button>
                  <Button onClick={() => setStep('confirm')} className="bg-teal-500 hover:bg-teal-600">
                    Review
                  </Button>
                </div>
              </div>
            )}

            {step === 'confirm' && selectedMedication && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Confirm Medication Schedule</h3>

                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Medication:</span>
                    <span>{selectedMedication.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Dosage:</span>
                    <span>{selectedDosage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Frequency:</span>
                    <span className="capitalize">{frequency.replace('-', ' ')}</span>
                  </div>
                  {frequency !== 'as-needed' && (
                    <div className="flex justify-between">
                      <span className="font-medium">Times:</span>
                      <span>{times.join(', ')}</span>
                    </div>
                  )}
                  {doctor && (
                    <div className="flex justify-between">
                      <span className="font-medium">Doctor:</span>
                      <span>{doctor}</span>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Tip:</strong> You'll be reminded to take this medication at the scheduled times.
                    You can log doses as taken or skipped, and track your adherence over time.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button onClick={() => setStep('schedule')} variant="outline">
                    Back
                  </Button>
                  <Button onClick={handleSave} className="bg-teal-500 hover:bg-teal-600">
                    Add Medication
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AddMedicationModal;
