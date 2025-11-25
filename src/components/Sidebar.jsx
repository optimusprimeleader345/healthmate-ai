import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Stethoscope,
  Video,
  Bot,
  Dumbbell,
  Moon,
  Heart,
  Shield,
  BarChart3,
  Apple,
  Pill,
  Lock,
  Settings,
  X,
  Crown,
  Bell,
  Calendar,
  Users,
  Monitor
} from 'lucide-react'
import { cn } from '../utils/classNames'
import { useAuth } from '../contexts/AuthContext'

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, active: true, tutorialId: 'dashboard-overview' },
  { name: 'Symptom Checker', path: '/symptom-checker', icon: Stethoscope, active: false, tutorialId: 'symptom-checker' },
  { name: 'Telemedicine', path: '/telemedicine', icon: Video, active: false, tutorialId: 'telemedicine' },
  { name: 'AI Assistant', path: '/ai-assistant', icon: Bot, active: false, tutorialId: 'ai-assistant' },
  { name: 'AI Fitness Planner', path: '/ai-fitness-planner', icon: Dumbbell, active: false, tutorialId: 'ai-fitness' },
  { name: 'Sleep Tracker', path: '/sleep-tracker', icon: Moon, active: false, tutorialId: 'sleep-tracker' },
  { name: 'Daily Health Coach', path: '/daily-health-coach', icon: Heart, active: false, tutorialId: 'daily-health-coach' },
  { name: 'First Aid', path: '/first-aid', icon: Shield, active: false, tutorialId: 'first-aid' },
  { name: 'Reports & Analytics', path: '/reports-analytics', icon: BarChart3, active: false, tutorialId: 'reports-analytics' },
  { name: 'Nutrition Tracker', path: '/nutrition-tracker', icon: Apple, active: false, tutorialId: 'nutrition-tracker' },
  { name: 'Medication Manager', path: '/medication-manager', icon: Pill, active: false, tutorialId: 'medication-manager' },
  { name: 'Smart Pharmacy', path: '/smart-pharmacy', icon: Pill, active: false, tutorialId: 'smart-pharmacy' },
  {
    name: 'Subscription',
    path: '/subscription',
    icon: Crown,
    active: false,
    tutorialId: 'subscription',
    premium: true
  },
  {
    name: 'Smart Notifications',
    path: '/notifications',
    icon: Bell,
    active: false,
    tutorialId: 'notifications',
    premium: true
  },
  {
    name: 'Calendar Dashboard',
    path: '/calendar-dashboard',
    icon: Calendar,
    active: false,
    tutorialId: 'calendar-dashboard',
    premium: true
  },
  { name: 'Settings', path: '/settings', icon: Settings, active: false, tutorialId: 'settings' },
]

// Admin menu items removed - admin features are accessible only via AdminLayout (/admin routes)

const Sidebar = () => {
  const navigate = useNavigate()
  const { user, isAdmin: userIsAdmin } = useAuth()

  // Only show patient menu items - admin features are accessed separately via AdminLayout
  const allMenuItems = menuItems

  return (
    <div className="h-full">
      <div className="flex h-full flex-col p-6">
        {/* Logo or Title */}
        <div className="mb-8 text-2xl font-bold text-primary-600">
          HealthMate AI
        </div>

        {/* Menu items */}
        <nav className="space-y-2">
          {/* Combined menu items */}
          {allMenuItems.map((item) => (
            <div
              key={item.name}
              data-tutorial={item.tutorialId}
              className={cn(
                'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors cursor-pointer',
                item.admin
                  ? 'bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 hover:from-red-100 hover:to-orange-100'
                  : item.premium
                    ? 'bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 hover:from-purple-100 hover:to-blue-100'
                    : item.active
                      ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
              )}
              onClick={() => navigate(item.path)}
            >
              <item.icon className={cn(
                'h-5 w-5',
                item.admin && 'text-red-600',
                item.premium && 'text-purple-600'
              )} />
              <span className={cn(
                item.admin && 'text-red-700 font-semibold',
                item.premium && 'text-purple-700 font-semibold'
              )}>{item.name}</span>
              {(item.premium || item.admin) && (
                <div className="ml-auto">
                  <div className={cn(
                    "w-2 h-2 rounded-full animate-pulse",
                    item.admin ? 'bg-gradient-to-br from-red-500 to-orange-500' : 'bg-gradient-to-br from-purple-500 to-blue-500'
                  )}></div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default Sidebar
