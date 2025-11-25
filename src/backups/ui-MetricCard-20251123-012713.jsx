import React from 'react'
import { Card } from './Card'

interface MetricCardProps {
  title: string
  value: string | number
  icon: React.ComponentType<any>
  status: string
  statusColor: string
  bgColor: string
  className?: string
  symbol?: string
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  status,
  statusColor,
  bgColor,
  className = '',
  symbol
}) => {
  return (
    <Card className={`p-6 rounded-2xl shadow-md ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className={`h-8 w-8 md:h-10 md:w-10 ${statusColor}`} />
        </div>
        <span className={`text-sm md:text-base font-medium ${statusColor}`}>
          {status}
        </span>
      </div>
      <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
        {value}
      </div>
      <div className="text-sm md:text-base text-gray-600 flex items-center gap-2">
        {symbol && <span className="text-xl">{symbol}</span>} {title}
      </div>
    </Card>
  )
}

export default MetricCard
