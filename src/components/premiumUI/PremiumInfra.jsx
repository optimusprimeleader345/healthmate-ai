import React from "react";
import { Server, CheckCircle, XCircle, AlertCircle, Activity } from "lucide-react";

const infraServices = [
  { name: "Health Analytics Engine", status: "online", uptime: "99.9%", load: 23 },
  { name: "Real-time Monitoring", status: "online", uptime: "100%", load: 45 },
  { name: "AI Prediction Services", status: "maintenance", uptime: "99.8%", load: 67 },
  { name: "Data Synchronization", status: "online", uptime: "99.7%", load: 12 }
];

export default function PremiumInfra() {
  const getStatusIcon = (status) => {
    switch (status) {
      case "online": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "maintenance": return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case "offline": return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "online": return "text-green-600";
      case "maintenance": return "text-orange-600";
      case "offline": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-gray-50 shadow-sm border border-slate-100/50 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <Server className="w-5 h-5 mr-2 text-slate-600" />
          System Infrastructure
        </h3>
        <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
          All Systems Operational
        </span>
      </div>

      <div className="space-y-3">
        {infraServices.map((service, index) => (
          <div key={index} className="p-3 rounded-lg bg-white/60 backdrop-blur-sm shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(service.status)}
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{service.name}</p>
                  <p className={`text-xs font-medium ${getStatusColor(service.status)}`}>
                    {service.status === "maintenance" ? "Under Maintenance" : service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-gray-600">Uptime: {service.uptime}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Load:</span>
                  <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-teal-500 rounded-full"
                      style={{ width: `${service.load}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-gray-700">{service.load}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-600">Real-time monitoring active</span>
          </div>
          <button className="text-teal-600 hover:text-teal-700 font-semibold text-sm">
            View Logs →
          </button>
        </div>
      </div>
    </div>
  );
}
