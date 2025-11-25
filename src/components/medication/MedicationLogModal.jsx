import React, { useState } from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { X, Check, SkipForward, Clock, AlertTriangle } from 'lucide-react';

const MedicationLogModal = ({ schedule, scheduledTime, onClose, onConfirm }) => {
  const [action, setAction] = useState(null); // 'taken' or 'skipped'
  const [sideEffects, setSideEffects] = useState('');
  const [skipReason, setSkipReason] = useState('');

  const handleConfirm = () => {
    const logEntry = {
      scheduleId: schedule.id,
      medicationName: schedule.medicationName,
      dosage: schedule.dosage,
      scheduledTime,
      taken: action === 'taken',
      actualTime: action === 'taken' ? new Date() : null,
      skippedReason: action === 'skipped' ? skipReason : null,
      sideEffects: action === 'taken' && sideEffects ? sideEffects.split(',').map(s => s.trim()) : [],
      status: action
    };

    onConfirm(logEntry);
    onClose();
  };

  const getMedicationFormIcon = () => {
    // You could add more icons based on medication form
    return '💊';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Medication Reminder</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="text-center mb-6">
            <div className="text-4xl mb-2">{getMedicationFormIcon()}</div>
            <h3 className="text-lg font-semibold text-gray-900">
              {schedule.medicationName}
            </h3>
            <p className="text-gray-600">{schedule.dosage}</p>
            <p className="text-sm text-teal-600 font-medium mt-1">
              Scheduled for {scheduledTime}
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-600 text-center mb-4">
              Did you take this medication?
            </p>

            {!action && (
              <div className="flex gap-3">
                <Button
                  onClick={() => setAction('taken')}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Yes, Taken
                </Button>
                <Button
                  onClick={() => setAction('skipped')}
                  variant="outline"
                  className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-50"
                >
                  <SkipForward className="h-4 w-4 mr-2" />
                  Skip
                </Button>
              </div>
            )}

            {action === 'taken' && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-green-600 font-semibold mb-2">
                    ✓ Medication logged as taken
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Any side effects? (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., nausea, dizziness"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    value={sideEffects}
                    onChange={(e) => setSideEffects(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separate multiple effects with commas
                  </p>
                </div>
              </div>
            )}

            {action === 'skipped' && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-orange-600 mb-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-semibold">Medication skipped</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for skipping *
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    value={skipReason}
                    onChange={(e) => setSkipReason(e.target.value)}
                  >
                    <option value="">Select a reason...</option>
                    <option value="forgot">Forgot to take it</option>
                    <option value="busy">Too busy</option>
                    <option value="side-effects">Experiencing side effects</option>
                    <option value="not-needed">Don't think I need it</option>
                    <option value="no-medication">Out of medication</option>
                    <option value="travel">Traveling/schedule change</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {skipReason === 'other' && (
                  <input
                    type="text"
                    placeholder="Please specify..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    value={skipReason}
                    onChange={(e) => setSkipReason(e.target.value)}
                  />
                )}
              </div>
            )}
          </div>

          {action && (
            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setAction(null)}
                variant="outline"
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={action === 'skipped' && !skipReason}
                className="flex-1 bg-teal-500 hover:bg-teal-600 disabled:opacity-50"
              >
                Confirm
              </Button>
            </div>
          )}
        </div>

        {schedule.instructions && (
          <div className="px-6 pb-4 border-t bg-gray-50">
            <div className="text-xs text-gray-600">
              <strong>Instructions:</strong> {schedule.instructions}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default MedicationLogModal;
