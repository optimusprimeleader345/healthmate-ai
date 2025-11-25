import React from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../utils/classNames'

interface SidebarItemProps {
  name: string
  icon: LucideIcon
  active?: boolean
  onClick?: () => void
  className?: string
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  name,
  icon: Icon,
  active = false,
  onClick,
  className = ''
}) => {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors cursor-pointer',
        active
          ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg'
          : 'text-gray-700 hover:bg-gray-100',
        className
      )}
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      <span>{name}</span>
    </div>
  )
}

export default SidebarItem
