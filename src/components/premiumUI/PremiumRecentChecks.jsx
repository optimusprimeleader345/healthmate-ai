import React from "react";
import { Clock, Heart, Thermometer, Droplets, Activity, CheckCircle } from "lucide-react";
import InsightBadge from "./InsightBadge";

const recentChecks = [
  {
    symptom: "Fatigue",
    time: "2 hours ago",
    status: "normal",
    icon: Activity,
    details: "Energy levels stable",
    lastValue: "Moderate"
  },
  {
    symptom: "Headache",
    time: "5 hours ago",
    status: "improving",
    icon: CheckCircle,
    details: "Pain reduced by 40%",
    lastValue: "Mild"
  },
  {
    symptom: "Dry throat",
    time: "1 day ago",
    status: "resolved",
    icon: Droplets,
    details: "Hydration improved",
    lastValue: "Resolved"
  },
  {
    symptom: "Fever",
    time: "2 days ago",
    status: "normal",
    icon: Thermometer,
    details: "Temperature normal",
    lastValue: "98.6°F"
  },
  {
    symptom: "Heart rate elevated",
    time: "3 days ago",
    status: "normal",
    icon: Heart,
    details: "Returned to baseline",
    lastValue: "72 bpm"
  }
];

const getStatusColor = (status) => {
  switch (status) {
    case "resolved": return "bg-green-500";
    case "improving": return "bg-blue-500";
    case "normal": return "bg-gray-400";
    default: return "bg-gray-400";
  }
};

const getStatusTextColor = (status) => {
  switch (status) {
    case "resolved": return "text-green-600";
    case "improving": return "text-blue-600";
    case "normal": return "text-gray-600";
    default: return "text-gray-600";
  }
};

export default function PremiumRecentChecks() {
  return (
    <div className="p-4 rounded-2xl bg-white shadow-soft border transition-all card-hover animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-indigo-600" />
          Recent Symptom Checks
        </h3>
        <InsightBadge text="Real-time" variant="secondary" />
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-200">
        {recentChecks.map((check, index) => (
          <div key={index} className="p-4 rounded-xl bg-white/70 backdrop-blur-sm shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${getStatusColor(check.status)}`}>
                  <check.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className={`font-semibold text-sm ${getStatusTextColor(check.status)}`}>
                    {check.symptom}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">{check.details}</p>
                  <div className="flex items-center space-x-3 mt-2">
                    <span className="text-xs text-gray-500">{check.time}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs font-medium text-gray-700">Latest: {check.lastValue}</span>
                  </div>
                </div>
              </div>
              <div className={`text-xs font-semibold px-2 py-1 rounded-full ${check.status === "resolved" ? "bg-green-100 text-green-700" : check.status === "improving" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}>
                {check.status.charAt(0).toUpperCase() + check.status.slice(1)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <button className="w-full py-2 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200">
          View Symptom History →
        </button>
      </div>
    </div>
  );
}
