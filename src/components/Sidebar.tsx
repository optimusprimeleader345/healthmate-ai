import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Stethoscope,
  Video,
  Bot,
  Heart,
  Shield,
  BarChart3,
  Apple,
  Pill,
  Lock,
  Settings,
  X
} from 'lucide-react'
import { cn } from '../utils/classNames'

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, active: true },
  { name: 'Symptom Checker', path: '/symptom-checker', icon: Stethoscope, active: false },
  { name: 'Telemedicine', path: '/telemedicine', icon: Video, active: false },
  { name: 'AI Assistant', path: '/ai-assistant', icon: Bot, active: false },
  { name: 'Daily Health Coach', path: '/daily-health-coach', icon: Heart, active: false },
  { name: 'First Aid', path: '/first-aid', icon: Shield, active: false },
  { name: 'Reports & Analytics', path: '/reports-analytics', icon: BarChart3, active: false },
  { name: 'Nutrition Tracker', path: '/nutrition-tracker', icon: Apple, active: false },
  { name: 'Medication Manager', path: '/medication-manager', icon: Pill, active: false },
  { name: 'Security', path: '/security', icon: Lock, active: false },
  { name: 'Settings', path: '/settings', icon: Settings, active: false },
]

const Sidebar = () => {
  const navigate = useNavigate()

  return (
    <div className="h-full">
      <div className="flex h-full flex-col p-6">
        {/* Logo or Title */}
        <div className="mb-8 text-2xl font-bold text-primary-600">
          HealthMate AI
        </div>

        {/* Menu items */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <div
              key={item.name}
              className={cn(
                'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors cursor-pointer',
                item.active
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default Sidebar
