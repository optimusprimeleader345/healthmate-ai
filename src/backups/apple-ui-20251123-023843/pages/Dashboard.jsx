import React, { useState, useEffect } from 'react';
import SectionHeader from '../components/SectionHeader';
import MetricCard from '../components/MetricCard';
import TrendChart from '../components/TrendChart';
import InsightCard from '../components/InsightCard';
import AIInsightPanel from '../components/AIInsightPanel';
import StatSummaryCard from '../components/StatSummaryCard';
import CorrelationCard from '../components/CorrelationCard';
import StatsRow from '../components/StatsRow';
import RiskIndicatorCard from '../components/RiskIndicatorCard';
import RiskSummary from '../components/RiskSummary';
import { Button } from '../components/Button';
import { calculateMean, calculateMedian, calculateVariance, correlations, generateInsights } from '../utils/mockAnalytics';
import { generateDailyInsight, generateRiskInsight, generateBehaviorInsight } from '../utils/aiInsightMock';
import { classifyStressLevel, classifyFatigueRisk, classifyDehydrationRisk } from '../ml/classificationModels';
import { detectAllAnomalies } from '../analytics/anomalyDetection';
import AnomalyAlertCard from '../components/AnomalyAlertCard';
import AnomalyList from '../components/AnomalyList';

import OfflineStatusBadge from '../components/OfflineStatusBadge';
import { isOffline } from '../utils/offlineUtils';
import useOfflineData from '../hooks/useOfflineData';
import RealTimePanel from "../components/RealTimePanel";
import EmergencyButton from "../components/EmergencyButton";
import EmergencyContactCard from "../components/EmergencyContactCard";
import AddEmergencyModal from "../components/AddEmergencyModal";
import { evaluateRiskForEmergency } from "../engine/EmergencyAlertEngine";
import PanicButton from "../components/PanicButton";
import PanicModeOverlay from "../components/PanicModeOverlay";
import { broadcastEmergency } from "../engine/CommunicationEngine";
import SymptomTimelinePanel from "../components/SymptomTimelinePanel";
import MultiAgentPanel from "../components/MultiAgentPanel";
import TextEmotionPanel from "../components/TextEmotionPanel";

// Premium UI components (Phase 2/4)
import DigitalTwinCard from "../components/premiumUI/DigitalTwinCard";
import RiskRadar from "../components/premiumUI/RiskRadar";
import AgentGraph from "../components/premiumUI/AgentGraph";
import EmotionalSupportPanel from "../components/premiumUI/EmotionalSupportPanel";
import { generateDailyRecommendations } from "../features/recommendationEngine";
import { forecastTrend } from "../features/forecastEngine";

// Assume some icons, use placeholder or inline svgs if needed. Let's use lucide-react
import { Heart, AlertTriangle, Target, Gauge, Droplets, Moon, Brain } from 'lucide-react';

// Sample data
const metricData = [
  { title: 'Health Score', value: '87%', icon: Heart, status: '+5%', statusColor: 'text-green-500', bgColor: 'bg-green-100' },
  { title: 'Symptom Risk', value: 'Low', icon: AlertTriangle, status: 'Stable', statusColor: 'text-teal-500', bgColor: 'bg-teal-100' },
  { title: 'Habit Streak', value: '12 days', icon: Target, status: 'Active', statusColor: 'text-neutral-500', bgColor: 'bg-neutral-100' },
  { title: 'Stress Level', value: 'Moderate', icon: Gauge, status: '-2%', statusColor: 'text-red-500', bgColor: 'bg-red-100' }
];

const sleepData = [
  { date: 'Mon', hours: 8 }, { date: 'Tue', hours: 7.5 }, { date: 'Wed', hours: 8.2 }, { date: 'Thu', hours: 6.8 }, { date: 'Fri', hours: 7.9 }, { date: 'Sat', hours: 9 }, { date: 'Sun', hours: 8.5 }
];

const hydrationData = [
  { date: 'Mon', intake: 2.1 }, { date: 'Tue', intake: 2.4 }, { date: 'Wed', intake: 2.0 }, { date: 'Thu', intake: 2.5 }, { date: 'Fri', intake: 2.3 }, { date: 'Sat', intake: 2.8 }, { date: 'Sun', intake: 2.6 }
];

const stressData = [
  { date: 'Mon', level: 4 }, { date: 'Tue', level: 6 }, { date: 'Wed', hours: 5 }, { date: 'Thu', hours: 7 }, { date: 'Fri', hours: 5 }, { date: 'Sat', hours: 3 }, { date: 'Sun', hours: 4 }
];

const mockData = {
  sleep: [7,6.5,6,7.2,6.8,7,7.1,3.5,7],
  hydration: [2.0,1.6,1.2,1.8,2.1,1.5,1.7,0.6,1.9],
  stress: [2,3,4,3.5,4,3,2.8,8,3],
  steps: [3000,4500,2000,3500,3800,2800,3100,12000,3200]
};

const sampleHealthData = {
  heartRate: 75,
  sleepHours: 8,
  hydrationLiters: 2.5,
  activitySteps: 10000,
  recoveryScore: 90,
  bodyTemp: 98.6,
  environmentTemp: 75
};

const insights = [
  { text: 'Your sleep pattern is improving, aim for 8 hours nightly.', aiBadge: true, icon: Moon },
  { text: 'Hydration is on track; maintain 2-3 liters daily.', aiBadge: true, icon: Droplets },
  { text: 'Consider stress reduction techniques like meditation.', aiBadge: true, icon: Brain }
];

export default function Dashboard() {
  const anomaliesReport = detectAllAnomalies(mockData);
  const [showLists, setShowLists] = useState({});
  const [offline, setOffline] = useState(isOffline());
  const [lastSync, setLastSync] = useState('Just now');
  const [contacts, setContacts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [emergencyTriggered, setEmergencyTriggered] = useState(false);
  const [panicMode, setPanicMode] = useState(false);

  useEffect(() => {
    const handleStatus = (state) => {
      setOffline(!state);
      if (state) setLastSync(new Date().toLocaleTimeString());
    };

    window.addEventListener('online', () => handleStatus(true));
    window.addEventListener('offline', () => handleStatus(false));

    return () => {
      window.removeEventListener('online', () => {});
      window.removeEventListener('offline', () => {});
    };
  }, []);

  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem("emergencyContacts") || "[]");
      setContacts(existing);
    } catch (e) {
      setContacts([]);
    }
  }, []);

  useEffect(() => {
    function onEmergency(e) {
      setEmergencyTriggered(true);
      broadcastEmergency(contacts, e.detail.alerts || ["Emergency Detected"]);
      setPanicMode(true);
      console.log("Emergency event:", e.detail);
    }
    window.addEventListener("healthmate:emergency", onEmergency);
    return () => window.removeEventListener("healthmate:emergency", onEmergency);
  }, [contacts]);

  const fetchSleepData = async () => sleepData;
  const sleepDataCached = useOfflineData('sleep-data', fetchSleepData, sleepData);

  const toggleList = (key) => {
    setShowLists(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const AlertCard = ({ title, anomalies, keyName }) => {
    const severity = anomalies && anomalies.length > 2 ? 'high' : anomalies && anomalies.length ? 'medium' : 'low';
    return (
      <div>
        <AnomalyAlertCard title={title} anomalies={anomalies || []} severity={severity} />
        <button
          className="text-blue-500 text-sm hover:underline mt-2"
          onClick={() => toggleList(keyName)}
        >
          {showLists[keyName] ? 'Hide details' : 'Show details'}
        </button>
        {showLists[keyName] && anomalies && <AnomalyList anomalies={anomalies} />}
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#F5F7FA] px-6 pt-4 pb-8 space-y-8 animate-fadeIn">
      <div className="mt-2 md:mt-4">
        <SectionHeader
          title="Health Overview"
          description="Your personalized health dashboard"
          actions={
            <Button className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
              Run Daily Check-In
            </Button>
          }
        />
      </div>

      {emergencyTriggered && (
        <div className="bg-red-600 text-white p-3 rounded mb-4">
          Emergency detected — notifying contacts.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricData.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            status={metric.status}
            statusColor={metric.statusColor}
            bgColor={metric.bgColor}
          />
        ))}
      </div>

      <div className="space-y-6">
        <SectionHeader title="Advanced Analytics" description="Detailed health metrics and correlations" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatSummaryCard title="Mean Sleep Hours" value={calculateMean(sleepDataCached.map(d => d.hours))} />
          <StatSummaryCard title="Median Sleep Hours" value={calculateMedian(sleepDataCached.map(d => d.hours))} />
          <StatSummaryCard title="Variance Sleep Hours" value={calculateVariance(sleepDataCached.map(d => d.hours))} />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Correlation Table</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {correlations.map((corr, index) => (
            <CorrelationCard key={index} title={corr.title} value={corr.value} />
          ))}
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Trend Insights</h3>
        <StatsRow
          weeklyImprovement={generateInsights().weeklyImprovement}
          dayOverDay={generateInsights().dayOverDay}
          anomaly={generateInsights().anomaly}
        />
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Risk Classification</h2>
        <RiskSummary />
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Trends</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TrendChart title="Sleep Trend" data={sleepDataCached} dataKey="hours" color="#14B8A6" />
          <TrendChart title="Hydration Trend" data={hydrationData} dataKey="intake" color="#0EA5E9" />
          <TrendChart title="Stress Trend" data={stressData} dataKey="level" color="#F59E0B" />
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">AI Insights</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AIInsightPanel
            title="Sleep Insight"
            insight={generateDailyInsight()}
            trendArrow="up"
            riskLevel="low"
          />
          <AIInsightPanel
            title="Hydration Insight"
            insight={generateRiskInsight()}
            trendArrow="neutral"
            riskLevel="low"
          />
          <AIInsightPanel
            title="Stress Insight"
            insight={generateBehaviorInsight()}
            trendArrow="down"
            riskLevel="medium"
          />
        </div>
      </div>

      <section className="mt-10">
        <TextEmotionPanel />
      </section>

      <section className="mt-10">
        <SymptomTimelinePanel />
      </section>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Health Alerts</h2>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <AlertCard title="Sleep Alerts" anomalies={anomaliesReport.sleep.zAnomalies} keyName="sleep" />
          <AlertCard title="Hydration Alerts" anomalies={anomaliesReport.hydration.zAnomalies} keyName="hydration" />
          <AlertCard title="Stress Alerts" anomalies={anomaliesReport.stress.zAnomalies} keyName="stress" />
          <AlertCard title="Steps Alerts" anomalies={anomaliesReport.steps.zAnomalies} keyName="steps" />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Previous AI Insights</h2>
        <InsightCard title="Personalized Recommendations" insights={insights} />
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Live Simulation</h2>
        <RealTimePanel />
      </section>

      <section className="mt-10">
        <MultiAgentPanel state={{ heart: sampleHealthData.heartRate, stress: 3, sleep: sampleHealthData.sleepHours }} />
      </section>

      {/* Phase 4 Premium Block (safe, additive) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
        <div className="space-y-6 col-span-2">
          <DigitalTwinCard sleep={7} stress={3} hydration={2.5} />
          <RiskRadar sleep={7} stress={4} hydration={8} activity={6} />
          <EmotionalSupportPanel />
        </div>

        <div className="space-y-6 col-span-1">
          <AgentGraph />
          <div className="p-6 bg-white rounded-2xl shadow-md border">
            <h3 className="font-semibold text-gray-800">AI Recommendations</h3>

            {generateDailyRecommendations({ hydration: 2.7, sleep: 7.5 }).map((r, i) => (
              <div key={i} className="mt-2 p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                <div className="text-xl">{r.icon}</div>
                <div>
                  <div className="font-medium">{r.title}</div>
                  <div className="text-xs text-gray-500">{r.message}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Contacts Section */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4 text-red-700">Emergency Contacts</h2>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded-lg"
          onClick={() => setShowAddModal(true)}
        >
          Add Contact
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {contacts.map((c, i) => (
            <EmergencyContactCard key={i} {...c} />
          ))}
        </div>
      </section>
      <EmergencyButton onOpen={() => setShowAddModal(true)} />
      {showAddModal && (
        <AddEmergencyModal
          onClose={() => setShowAddModal(false)}
          onSave={(updated) => setContacts(updated)}
        />
      )}
      {panicMode && (
        <PanicModeOverlay
          contacts={contacts}
          onNotify={() => broadcastEmergency(contacts, ["Manual Panic Triggered"]) }
          onClose={() => setPanicMode(false)}
        />
      )}
      <PanicButton setPanicMode={setPanicMode} />
    </div>
  );
}
