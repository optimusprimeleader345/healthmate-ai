<div className="space-y-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight mb-4 md:mb-6"><span className="mr-2 text-xl">🚨</span>Health Alerts</h2>
<div className="w-12 h-1 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full mb-4"></div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <AlertCard title="Sleep Alerts" anomalies={anomaliesReport.sleep.zAnomalies} keyName="sleep" />
          <AlertCard title="Hydration Alerts" anomalies={anomaliesReport.hydration.zAnomalies} keyName="hydration" />
          <AlertCard title="Stress Alerts" anomalies={anomaliesReport.stress.zAnomalies} keyName="stress" />
          <AlertCard title="Steps Alerts" anomalies={anomaliesReport.steps.zAnomalies} keyName="steps" />
        </div>
      </div>
