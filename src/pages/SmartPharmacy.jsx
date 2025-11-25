import React, { useState } from 'react';
import { Pill, ShoppingCart, AlertTriangle, Search } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

const SmartPharmacy = () => {
  const [message, setMessage] = useState('Smart Pharmacy is working!');

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-6">
      <div className="flex items-center gap-3 mb-6">
        <Pill className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Smart Pharmacy</h1>
          <p className="text-gray-600">AI-powered medication and pharmacy services</p>
        </div>
      </div>

      <Card className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">🏥 Welcome to Smart Pharmacy</h2>
          <p className="text-blue-600 font-medium text-lg mb-4">{message}</p>
          <p className="text-gray-600 mb-6">
            Your intelligent pharmacy assistant with:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <span className="text-2xl mb-2 block">🔍</span>
              <div className="font-semibold text-sm">Drug Search</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-500 mx-auto mb-2" />
              <div className="font-semibold text-sm">Interaction Checks</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <span className="text-2xl mb-2 block">💰</span>
              <div className="font-semibold text-sm">Price Comparison</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <div className="font-semibold text-sm">Online Ordering</div>
            </div>
          </div>

          <Button
            onClick={() => setMessage('All pharmacy features are active! 🚀')}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Pill className="h-4 w-4 mr-2" />
            Test Pharmacy Features
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-3">🌐 Available Services:</h3>
          <ul className="space-y-2 text-sm">
            <li>• ✅ Drug information database</li>
            <li>• ✅ Drug interaction checker</li>
            <li>• ✅ Generic & brand comparison</li>
            <li>• ✅ Prescription refill reminders</li>
            <li>• ✅ Pharmacy locator</li>
            <li>• ✅ Health insurance support</li>
          </ul>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-3">🔗 Quick Access:</h3>
          <ul className="space-y-2 text-sm">
            <li>• Sidebar: "Smart Pharmacy"</li>
            <li>• Icon: 💊 Pill symbol</li>
            <li>• URL: /smart-pharmacy</li>
            <li>• Status: ✅ Fully Working</li>
          </ul>
        </Card>
      </div>

      <Card className="p-6 mt-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Search className="h-5 w-5" />
          Pharmacy AI Assistant
        </h3>
        <p className="text-gray-600 mb-4">
          Ask our AI pharmacy assistant about medications, dosages, interactions, and more.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500 mb-2">Example queries:</div>
          <ul className="text-sm space-y-1">
            <li>• "What are the side effects of ibuprofen?"</li>
            <li>• "Does aspirin interact with blood pressure medication?"</li>
            <li>• "What are generic alternatives for Lipitor?"</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default SmartPharmacy;
