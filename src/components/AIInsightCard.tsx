import React from 'react'
import { Card } from './Card'

interface Insight {
  icon: React.ComponentType<any>
  text: string
  aiBadge: boolean
}

interface AIInsightCardProps {
  title: string
  insights: Insight[]
  className?: string
}

const AIInsightCard: React.FC<AIInsightCardProps> = ({
  title,
  insights,
  className = ''
}) => {
  return (
    <Card className={`p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {insight.aiBadge && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                  AI
                </span>
              )}
            </div>
            <div className="flex-shrink-0">
              <div className={`p-2 rounded-lg ${insight.aiBadge ? 'bg-primary-50' : 'bg-accent-50'}`}>
                <insight.icon className={`w-4 h-4 ${insight.aiBadge ? 'text-primary-500' : 'text-accent-500'}`} />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700">{insight.text}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default AIInsightCard
