import React, { useState } from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import StatBadge from '../components/StatBadge'
import {
  Activity,
  AlertTriangle,
  Heart,
  Brain,
  Thermometer,
  Wind,
  Shield,
  Download,
  Cpu
} from 'lucide-react'
// @ts-ignore
import healthGraph from '../graph/healthGraph'

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState('')
  const [hasResults, setHasResults] = useState(false)

  // Sample condition results
  const conditions = [
    {
      name: 'Common Cold',
      description: 'Mild viral infection affecting upper respiratory tract',
      riskLevel: 'Low',
      riskColor: 'text-accent-600 bg-accent-50',
      icon: Thermometer
    },
    {
      name: 'Flu',
      description: 'Influenza virus causing fever and respiratory symptoms',
      riskLevel: 'Medium',
      riskColor: 'text-yellow-600 bg-yellow-50',
      icon: Wind
    },
    {
      name: 'Allergies',
      description: 'Immune response to environmental triggers',
      riskLevel: 'Low',
      riskColor: 'text-accent-600 bg-accent-50',
      icon: Shield
    },
    {
      name: 'COVID-19',
      description: 'Respiratory illness from SARS-CoV-2 virus',
      riskLevel: 'High',
      riskColor: 'text-red-600 bg-red-50',
      icon: AlertTriangle
    }
  ]

  const aiSummary = {
    text: "Based on your symptom description, you appear to have mild cold symptoms. While it's likely nothing serious, monitoring your temperature and getting plenty of rest is recommended. If symptoms worsen or persist beyond 10 days, consult a healthcare professional. Your hydration levels are good, which will help your recovery."
  }

  const handleSubmit = () => {
    if (symptoms.trim()) {
      setHasResults(true)
      // In a real app, this would send to API
    }
  }

  const handleDownloadPDF = () => {
    console.log('Downloading PDF report')
    // Add PDF download logic here
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {!hasResults ? (
        /* Symptom Input Section */
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Symptom Checker</h1>
            <p className="text-gray-600 mt-2">
              Describe your symptoms to get AI-powered health insights and potential conditions.
            </p>
          </div>
          <Card className="p-6 rounded-2xl shadow-md">
            <div className="space-y-4">
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Describe your symptoms…"
                className="w-full h-32 p-4 rounded-2xl border border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={4}
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmit}
                  disabled={!symptoms.trim()}
                  className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-2xl shadow-md font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Analyze Symptoms
                </Button>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <>
          {/* Conditions Result Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Possible Conditions</h2>
                <p className="text-gray-600 mt-1">
                  Based on the symptoms you described
                </p>
              </div>
              <Button
                onClick={() => setHasResults(false)}
                variant="outline"
                className="text-primary-600 hover:text-primary-700"
              >
                Check Different Symptoms
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {conditions.map((condition, index) => (
                <Card key={index} className="p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`p-3 rounded-lg ${condition.riskColor} bg-opacity-20`}>
                        <condition.icon className={`w-6 h-6`} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {condition.name}
                        </h3>
                        <StatBadge label="Risk" value={condition.riskLevel} />
                      </div>
                      <p className="text-gray-600">{condition.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* AI Summary Box */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">AI Health Summary</h2>
            <Card className="p-6 rounded-2xl shadow-md">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="p-3 rounded-lg bg-primary-50">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700 mb-2">
                      AI
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-700 leading-relaxed mb-6">{aiSummary.text}</p>
                  <div className="flex justify-end">
                    <Button
                      onClick={handleDownloadPDF}
                      className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white px-6 py-3 rounded-2xl shadow-md font-medium transition-all duration-200 flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download PDF</span>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Health Graph Explorer */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Health Graph Explorer</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Connected Conditions */}
              <Card className="p-6 rounded-2xl shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  Connected Conditions
                </h3>
                {(() => {
                  const inputWords = symptoms.toLowerCase().split(/\s+/);
                  const matchedSymptoms = healthGraph.nodes.filter(n =>
                    n.type === 'symptom' && inputWords.some(word =>
                      n.name.toLowerCase().includes(word) || word.includes(n.name.toLowerCase())
                    )
                  );
                  const connectedConditions = [...new Set(matchedSymptoms.flatMap(symp =>
                    healthGraph.getConnectedNodes(symp.name)
                      .filter(n => n.type === 'condition')
                      .map(n => n.name)
                  ))];

                  return connectedConditions.length > 0 ? (
                    <ul className="space-y-2">
                      {connectedConditions.map((condition, idx) => (
                        <li key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-700">{condition}</span>
                          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">Condition</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No connected conditions found in the health graph.</p>
                  );
                })()}
              </Card>

              {/* Risk Assessment */}
              <Card className="p-6 rounded-2xl shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Risk Assessment
                </h3>
                {(() => {
                  const inputWords = symptoms.toLowerCase().split(/\s+/);
                  const matchedSymptoms = healthGraph.nodes.filter(n =>
                    n.type === 'symptom' && inputWords.some(word =>
                      n.name.toLowerCase().includes(word) || word.includes(n.name.toLowerCase())
                    )
                  );
                  const riskPaths = matchedSymptoms.flatMap(symp => healthGraph.getRiskPaths(symp.name));

                  return riskPaths.length > 0 ? (
                    <div className="space-y-3">
                      {riskPaths.slice(0, 5).map((path, idx) => (
                        <div key={idx} className="p-3 bg-red-50 border-l-4 border-red-400 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{path.riskNode}</span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              path.riskLevel > 0.7 ? 'bg-red-200 text-red-800' :
                              path.riskLevel > 0.4 ? 'bg-yellow-200 text-yellow-800' :
                              'bg-green-200 text-green-800'
                            }`}>
                              Risk: {(path.riskLevel * 100).toFixed(0)}%
                            </span>
                          </div>
                          {path.conditions.length > 0 && (
                            <div className="text-sm text-gray-600">
                              Via conditions: {path.conditions.join(', ')}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No risk paths identified in the health graph.</p>
                  );
                })()}
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default SymptomChecker
