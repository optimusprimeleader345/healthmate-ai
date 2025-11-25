import React from 'react'

interface SectionHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
  icon?: string
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  actions,
  className = '',
  icon
}) => {
  return (
    <div className={`flex flex-col md:flex-row md:items-center md:justify-between ${className}`}>
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight mb-4 md:mb-6">{icon && <span className="mr-2 text-xl">{icon}</span>}{title}</h1>
        <div className="w-12 h-1 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full mb-4"></div>
        {description && (
          <p className="text-gray-600 mt-2">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="mt-4 md:mt-0">
          {actions}
        </div>
      )}
    </div>
  )
}

export default SectionHeader
