import React from "react";
import { AlertTriangle, Calendar, Pill, Activity, Clock, CheckCircle2 } from "lucide-react";
import InsightBadge from "./InsightBadge";

const pendingActions = [
  {
    title: "Medication Reminder",
    subtitle: "Take Vitamin D supplement",
    time: "Due in 2 hours",
    priority: "high",
    icon: Pill,
    actionType: "reminder"
  },
  {
    title: "Doctor Appointment",
    subtitle: "Follow-up with Dr. Johnson",
    time: "Tomorrow 10:00 AM",
    priority: "medium",
    icon: Calendar,
    actionType: "appointment"
  },
  {
    title: "Exercise Goal Check",
    subtitle: "10,000 steps target",
    time: "Complete today",
    priority: "medium",
    icon: Activity,
    actionType: "goal"
  },
  {
    title: "Blood Pressure Reading",
    subtitle: "Weekly monitoring",
    time: "Overdue by 1 day",
    priority: "high",
    icon: AlertTriangle,
    actionType: "monitoring"
  },
  {
    title: "Sleep Tracking",
    subtitle: "Review sleep patterns",
    time: "This evening",
    priority: "low",
    icon: Clock,
    actionType: "review"
  }
];

const getPriorityColor = (priority) => {
  switch (priority) {
    case "high": return "border-l-red-500 bg-red-50/50";
    case "medium": return "border-l-yellow-500 bg-yellow-50/50";
    case "low": return "border-l-green-500 bg-green-50/50";
    default: return "border-l-gray-300 bg-gray-50/50";
  }
};

const getIconColor = (actionType) => {
  switch (actionType) {
    case "reminder": return "text-red-600";
    case "appointment": return "text-blue-600";
    case "goal": return "text-green-600";
    case "monitoring": return "text-orange-600";
    case "review": return "text-purple-600";
    default: return "text-gray-600";
  }
};

export default function PremiumActions() {
  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-cyan-50 shadow-sm border border-emerald-100/50 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-600" />
          Pending Actions
        </h3>
        <InsightBadge text="Active" variant="success" />
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-200">
        {pendingActions.map((action, index) => (
          <div key={index} className={`p-3 rounded-lg border-l-4 ${getPriorityColor(action.priority)} bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group`}>
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-full bg-white/80 ${getIconColor(action.actionType)}`}>
                <action.icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-gray-900 group-hover:text-gray-700">
                  {action.title}
                </h4>
                <p className="text-xs text-gray-600 mt-1">{action.subtitle}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">{action.time}</span>
                  <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    action.priority === "high" ? "bg-red-100 text-red-700" :
                    action.priority === "medium" ? "bg-yellow-100 text-yellow-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                    {action.priority === "high" ? "Urgent" : action.priority.charAt(0).toUpperCase() + action.priority.slice(1)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <button className="w-full py-2 px-4 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200">
          Manage All Actions →
        </button>
      </div>
    </div>
  );
}
