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
    <Card className={`p-6 bg-gradient-to-br from-white to-[#F1F5F9] backdrop-blur-xl border border-white/40 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 parallax-subtle ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="bg-white/80 shadow-sm p-3 rounded-2xl backdrop-blur">
          <Icon className="h-8 w-8 md:h-10 md:w-10 text-gray-800 opacity-70" />
        </div>
        <span className={`text-sm md:text-base font-medium ${statusColor}`}>
          {status}
        </span>
      </div>
      <div className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 mb-1">
        {value}
      </div>
      <div className="text-sm md:text-base font-medium text-gray-600 flex items-center gap-2">
        {symbol && <span className="text-xl">{symbol}</span>} {title}
      </div>
    </Card>
  )
}

export default MetricCard
