import React from 'react';
import { Card } from './Card';

const FirstAidCategoryCard = ({ title, description, icon: Icon, className = '' }) => {
  return (
    <Card className={`p-6 rounded-2xl shadow-md cursor-pointer hover:shadow-lg transition-shadow ${className}`}>
      <div className="flex items-center space-x-4">
        <div className="p-3 rounded-lg bg-teal-100">
          <Icon className="w-6 h-6 text-teal-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </Card>
  );
};

export default FirstAidCategoryCard;
