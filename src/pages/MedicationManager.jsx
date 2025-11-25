import React, { useState } from 'react';
import { Pills, Plus } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

// Temporarily simplified for debugging
const MedicationManager = () => {
  const [test, setTest] = useState('Hello World');

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-100 rounded-lg">
            <Pills className="h-6 w-6 text-teal-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medication Manager</h1>
            <p className="text-gray-600">Medication tracking feature</p>
            <p className="text-red-500">{test}</p>
          </div>
        </div>
        <Button onClick={() => setTest('Button Clicked!')}>
          <Plus className="h-4 w-4 mr-2" />
          Test Button
        </Button>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold">Debug Mode</h2>
        <p>Basic functionality working. Medication tracking components will be loaded here.</p>
        <div className="mt-4">
          <p className="text-sm text-gray-500">Status: Component renders successfully</p>
        </div>
      </Card>
    </div>
  );
};

export default MedicationManager;
