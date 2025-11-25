import React from 'react'
import { Card } from './Card'

interface ChartCardProps {
  title: string
  children: React.ReactNode
  className?: string
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  children,
  className = ''
}) => {
  return (
    <Card className={`p-6 rounded-2xl shadow-md ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </Card>
  )
}

export default ChartCard
