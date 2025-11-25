import React from 'react';
import { Card } from './Card';
import { Button } from './Button';

const ReportCard = ({ title, date, type, description, className = '' }) => {
  return (
    <Card className={`p-6 rounded-2xl shadow-md ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{date}</p>
        </div>
        <span className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-xs font-medium">
          {type}
        </span>
      </div>
      <p className="text-sm text-gray-700 mb-4">{description}</p>
      <div className="flex space-x-2">
        <Button size="sm" variant="outline">View Details</Button>
        <Button size="sm" variant="outline">Download</Button>
      </div>
    </Card>
  );
};

export default ReportCard;
