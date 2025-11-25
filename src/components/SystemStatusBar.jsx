import React from 'react';
import { Battery, Wifi, HeartPulse, Cloud, CloudSun } from "lucide-react";

export default function SystemStatusBar({ offline, lastSync }) {
  return (
    <div className="
      w-full backdrop-blur-xl bg-white/60 dark:bg-black/30
      border-b border-white/30 dark:border-white/10
      fixed top-0 left-0 z-50
      flex items-center justify-between
      px-6 py-2
      shadow-sm
    ">

      {/* Left Section */}
      <div className="flex items-center gap-4 text-gray-700 dark:text-gray-200 text-sm">
        <div className="flex items-center gap-1">
          <CloudSun size={16} />
          <span>27°C</span>
        </div>

        <div className="flex items-center gap-1">
          <HeartPulse size={16} />
          <span>76 bpm</span>
        </div>
      </div>

      {/* Center */}
      <div className="text-gray-800 dark:text-gray-200 font-semibold text-sm">
        HealthMate OS
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 text-gray-700 dark:text-gray-200 text-sm">
        <div className="flex items-center gap-1">
          <Wifi size={16} className={offline ? "text-red-500" : "text-green-500"} />
          <span>{offline ? "Offline" : "Online"}</span>
        </div>

        <div className="flex items-center gap-1">
          <Battery size={16} />
          <span>82%</span>
        </div>

        <span className="opacity-70">Sync: {lastSync}</span>
      </div>

    </div>
  );
}
