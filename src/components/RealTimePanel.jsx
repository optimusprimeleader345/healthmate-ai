import React, { useRef, useState, useEffect } from 'react';
import { createSimulator } from '../utils/realtimeSimulator';
import SimulationControls from './SimulationControls';
import RealtimeMiniChart from './RealtimeMiniChart';
import { Heart, Droplets, Brain, Activity } from 'lucide-react';
import { evaluateRiskForEmergency } from '../engine/EmergencyAlertEngine';

const MAX_BUFFER_SIZE = 60;

const MetricCard = ({ title, value, icon: Icon, bgColor, color, highlight }) => (
  <div className={`p-4 rounded-2xl shadow-md bg-white transition-all duration-300 ${
    highlight ? 'ring-2 ring-red-400' : bgColor
  }`}>
    <div className="flex items-center gap-3">
      <Icon className="w-6 h-6" style={{ color }} />
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  </div>
);

const RealTimePanel = () => {
  const simulatorRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [simulateAnomalies, setSimulateAnomalies] = useState(false);
  const [highlights, setHighlights] = useState({});
  const [paused, setPaused] = useState(false);
  const [metrics, setMetrics] = useState({
    heart: 70,
    steps: 0,
    hydration: 1.8,
    stress: 3
  });

  const [buffers, setBuffers] = useState({
    heart: [],
    steps: [],
    hydration: [],
    stress: []
  });

  useEffect(() => {
    const handleTick = (data) => {
      if (paused) return;

      const newMetrics = { ...data };

      // Inject anomalies if enabled
      if (simulateAnomalies && Math.random() < 0.1) { // 10% chance per tick
        const anomalyType = Math.random();
        if (anomalyType < 0.25) {
          // Stress spike
          newMetrics.stress += Math.random() * 6 + 2; // +2 to +8
          setHighlights(prev => ({ ...prev, stress: Date.now() }));
        } else if (anomalyType < 0.5) {
          // Hydration drop
          newMetrics.hydration = Math.max(0, newMetrics.hydration - (Math.random() * 0.8 + 0.5)); // -0.5 to -1.3
          setHighlights(prev => ({ ...prev, hydration: Date.now() }));
        } else {
          // Heart spike
          newMetrics.heart += Math.random() * 30 + 10; // +10 to +40
          setHighlights(prev => ({ ...prev, heart: Date.now() }));
        }
      }

      setMetrics(newMetrics);

      const emergency = evaluateRiskForEmergency(newMetrics);
      if (emergency.isEmergency) {
        // fire a browser-level event for Dashboard to catch
        window.dispatchEvent(new CustomEvent("healthmate:emergency", { detail: emergency }));
      }

      setBuffers(prev => {
        const newBuffers = {};
        Object.keys(prev).forEach(key => {
          const newArray = [...prev[key], { t: data.t, value: newMetrics[key] }];
          if (newArray.length > MAX_BUFFER_SIZE) newArray.shift();
          newBuffers[key] = newArray;
        });
        return newBuffers;
      });
    };

    simulatorRef.current = createSimulator({
      onTick: handleTick,
      interval: speed
    });

    return () => {
      if (simulatorRef.current) {
        simulatorRef.current.stop();
      }
    };
  }, [speed, simulateAnomalies, paused]);

  useEffect(() => {
    // Clear highlights after 2 seconds
    const interval = setInterval(() => {
      setHighlights(prev => {
        const now = Date.now();
        const newHighlights = {};
        Object.keys(prev).forEach(key => {
          if (prev[key] && now - prev[key] < 2000) {
            newHighlights[key] = prev[key];
          }
        });
        return newHighlights;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const handleStartStop = () => {
    if (isRunning) {
      simulatorRef.current.stop();
    } else {
      simulatorRef.current.start();
    }
    setIsRunning(!isRunning);
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
    if (simulatorRef.current) {
      simulatorRef.current.setInterval(newSpeed);
    }
  };

  const handleReset = () => {
    setMetrics({ heart: 70, steps: 0, hydration: 1.8, stress: 3 });
    setBuffers({ heart: [], steps: [], hydration: [], stress: [] });
    setHighlights({});
  };

  const handleToggleAnomalies = () => {
    setSimulateAnomalies(!simulateAnomalies);
  };

  const handleExport = () => {
    const latest60 = {};
    Object.keys(buffers).forEach(key => {
      const arr = buffers[key];
      latest60[key] = arr.length >= 60 ? arr.slice(-60) : arr;
    });
    const data = {
      exportedAt: new Date().toISOString(),
      data: latest60,
      simulatorState: metrics
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'simulation-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const chartsData = {};
  Object.keys(buffers).forEach(key => {
    chartsData[key] = buffers[key].map(item => ({ ...item }));
  });

  return (
    <div className="space-y-6">
      <SimulationControls
        isRunning={isRunning}
        onStartStop={handleStartStop}
        speed={speed}
        onSpeedChange={handleSpeedChange}
        onReset={handleReset}
        simulateAnomalies={simulateAnomalies}
        onToggleAnomalies={handleToggleAnomalies}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <MetricCard
            title="Heart Rate"
            value={`${metrics.heart} bpm`}
            icon={Heart}
            bgColor="bg-red-50"
            color="#dc2626"
            highlight={highlights.heart}
          />
          <RealtimeMiniChart data={chartsData.heart} color="#dc2626" />
        </div>
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <MetricCard
            title="Steps"
            value={metrics.steps}
            icon={Activity}
            bgColor="bg-green-50"
            color="#16a34a"
            highlight={highlights.steps}
          />
          <RealtimeMiniChart data={chartsData.steps} color="#16a34a" />
        </div>
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <MetricCard
            title="Hydration"
            value={`${metrics.hydration}L`}
            icon={Droplets}
            bgColor="bg-blue-50"
            color="#2563eb"
            highlight={highlights.hydration}
          />
          <RealtimeMiniChart data={chartsData.hydration} color="#2563eb" />
        </div>
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <MetricCard
            title="Stress"
            value={`${metrics.stress}`}
            icon={Brain}
            bgColor="bg-purple-50"
            color="#7c3aed"
            highlight={highlights.stress}
          />
          <RealtimeMiniChart data={chartsData.stress} color="#7c3aed" />
        </div>
      </div>

      <div className="text-center">
        <button
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          onClick={handleExport}
          aria-label="Export last 60 ticks"
        >
          Export Last 60 Ticks (JSON)
        </button>
      </div>
    </div>
  );
};

export default RealTimePanel;
