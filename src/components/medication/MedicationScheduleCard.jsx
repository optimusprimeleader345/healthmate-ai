import React from 'react';
import { Card } from '../Card';
import { Clock, Pill, Bell, Calendar, Doctor } from 'lucide-react';
import { Button } from '../Button';

const MedicationScheduleCard = ({
  schedule,
  todaysLogs = [],
  onTakeNow,
  onMarkSkipped,
  onViewDetails
}) => {
  const todaysLog = todaysLogs.find(log => log.scheduleId === schedule.id);
  const allTakenToday = schedule.specificTimes.every(time =>
    todaysLogs.some(log => log.scheduleId === schedule.id && log.scheduledTime === time && log.taken)
  );

  const nextDoseTime = schedule.specificTimes.find(time => {
    const [hours, minutes] = time.split(':');
    const doseTime = new Date();
    doseTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return doseTime > new Date();
  });

  const getStatusColor = () => {
    if (allTakenToday) return 'text-green-600 border-green-200 bg-green-50';
    if (schedule.specificTimes.some(time => {
      const [hours, minutes] = time.split(':');
      const doseTime = new Date();
      doseTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      return doseTime < new Date() && !todaysLogs.some(log =>
        log.scheduleId === schedule.id && log.scheduledTime === time && log.taken
      );
    })) return 'text-red-600 border-red-200 bg-red-50';
    return 'text-blue-600 border-blue-200 bg-blue-50';
  };

  const getStatusMessage = () => {
    if (allTakenToday) return 'All doses taken today ✅';
    if (nextDoseTime) return `Next dose: ${nextDoseTime}`;
    return 'Schedule completed for today';
  };

  const getFrequencyText = () => {
    switch (schedule.frequency) {
      case 'once-daily': return 'Once daily';
      case 'twice-daily': return 'Twice daily';
      case 'three-times-daily': return 'Three times daily';
      case 'four-times-daily': return 'Four times daily';
      case 'as-needed': return 'As needed';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      default: return schedule.frequency;
    }
  };

  return (
    <Card className={`p-4 hover:shadow-lg transition-all duration-200 border-2 ${getStatusColor()}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Pill className="h-5 w-5 text-teal-600" />
          <div>
            <h3 className="font-semibold text-gray-900">{schedule.medicationName}</h3>
            <p className="text-sm text-gray-500">{schedule.dosage}</p>
          </div>
        </div>

        <div className="flex gap-1">
          {schedule.prescribingDoctor && (
            <Doctor className="h-4 w-4 text-gray-400" />
          )}
          <Clock className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Frequency:</span>
          <span className="font-medium">{getFrequencyText()}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Times:</span>
          <div className="flex gap-1">
            {schedule.specificTimes.map((time, index) => {
              const isTaken = todaysLogs.some(log =>
                log.scheduleId === schedule.id && log.scheduledTime === time && log.taken
              );
              return (
                <span key={index} className={`px-2 py-1 rounded text-xs ${
                  isTaken ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {time}
                </span>
              );
            })}
          </div>
        </div>

        {schedule.prescribingDoctor && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Prescriber:</span>
            <span className="font-medium">{schedule.prescribingDoctor}</span>
          </div>
        )}

        <div className="text-xs text-gray-500">
          {getStatusMessage()}
        </div>

        {schedule.notes && (
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            📝 {schedule.notes}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {!allTakenToday && (
            <>
              {nextDoseTime && (
                <Button
                  size="sm"
                  onClick={() => onTakeNow(schedule, nextDoseTime)}
                  className="flex-1 bg-teal-500 hover:bg-teal-600"
                >
                  Take Now
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => onViewDetails(schedule)}
                className="text-sm"
              >
                Details
              </Button>
            </>
          )}

          {allTakenToday && (
            <div className="w-full text-center py-2">
              <span className="text-green-600 font-medium text-sm">✓ Completed for today</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MedicationScheduleCard;
