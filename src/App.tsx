import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import TransitionWrapper from "./components/TransitionWrapper"
import ErrorBoundary from "./components/ErrorBoundary"
import MainLayout from "./layouts/MainLayout"
import ProtectedRoute from "./components/ProtectedRoute"
import { AuthProvider } from "./contexts/AuthContext"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import SymptomChecker from "./pages/SymptomChecker"
import Telemedicine from "./pages/Telemedicine"
import AIAssistant from "./pages/AIAssistant"
import DailyHealthCoach from "./pages/DailyHealthCoach"
import FirstAid from "./pages/FirstAid"
import ReportsAnalytics from "./pages/ReportsAnalytics"
import Security from "./pages/Security"
import Settings from "./pages/Settings"
import SmartPharmacy from "./pages/SmartPharmacy"
import Subscription from "./pages/Subscription"
import Notifications from "./pages/Notifications"
import CalendarDashboard from "./pages/CalendarDashboard"
import NutritionTracker from "./pages/NutritionTracker"
import MedicationManagerNew from "./pages/MedicationManagerNew"
import AIFitnessPlanner from "./pages/AIFitnessPlanner"
import SleepTracker from "./pages/SleepTracker"
import AdminLayout from "./layouts/AdminLayout"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminUsers from "./pages/admin/AdminUsers"
import AdminSecurity from "./pages/admin/AdminSecurity"
import AdminAnalytics from "./pages/admin/AdminAnalytics"
import AdminCloudControl from "./pages/admin/AdminCloudControl"
import AdminAIAutonomous from "./pages/admin/AdminAIAutonomous"
import AdminGlobalHealth from "./pages/admin/AdminGlobalHealth"
import AdminPredictiveAI from "./pages/admin/AdminPredictiveAI"
import AdminCloudSecurity from "./pages/admin/AdminCloudSecurity"
import AdminBusinessAI from "./pages/admin/AdminBusinessAI"

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <TransitionWrapper>
              <Routes>
                {/* Default route - Show login page */}
                <Route path="/" element={<Login />} />

                {/* Login route */}
                <Route path="/login" element={<Login />} />

                {/* Direct routes - redirect to dashboard routes */}
                <Route path="/telemedicine" element={<Navigate to="/dashboard/telemedicine" replace />} />
                <Route path="/symptom-checker" element={<Navigate to="/dashboard/symptom-checker" replace />} />
                <Route path="/ai-assistant" element={<Navigate to="/dashboard/ai-assistant" replace />} />
                <Route path="/daily-health-coach" element={<Navigate to="/dashboard/daily-health-coach" replace />} />
                <Route path="/first-aid" element={<Navigate to="/dashboard/first-aid" replace />} />
                <Route path="/reports-analytics" element={<Navigate to="/dashboard/reports-analytics" replace />} />
                <Route path="/nutrition-tracker" element={<Navigate to="/dashboard/nutrition-tracker" replace />} />
                <Route path="/medication-manager" element={<Navigate to="/dashboard/medication-manager" replace />} />
                <Route path="/smart-pharmacy" element={<Navigate to="/dashboard/smart-pharmacy" replace />} />
                <Route path="/settings" element={<Navigate to="/dashboard/settings" replace />} />
                <Route path="/notifications" element={<Navigate to="/dashboard/notifications" replace />} />
                <Route path="/subscription" element={<Navigate to="/dashboard/subscription" replace />} />
                <Route path="/calendar-dashboard" element={<Navigate to="/dashboard/calendar-dashboard" replace />} />
                <Route path="/ai-fitness-planner" element={<Navigate to="/dashboard/ai-fitness-planner" replace />} />
                <Route path="/sleep-tracker" element={<Navigate to="/dashboard/sleep-tracker" replace />} />
                <Route path="/security" element={<Navigate to="/dashboard/security" replace />} />

                {/* Admin routes */}
                <Route path="/admin" element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<AdminDashboard />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="security" element={<AdminSecurity />} />
                  <Route path="cloud-control" element={<AdminCloudControl />} />
                  <Route path="ai-autonomous" element={<AdminAIAutonomous />} />
                  <Route path="global-health" element={<AdminGlobalHealth />} />
                  <Route path="predictive-ai" element={<AdminPredictiveAI />} />
                  <Route path="cloud-security" element={<AdminCloudSecurity />} />
                  <Route path="business-ai" element={<AdminBusinessAI />} />
                </Route>

                {/* Patient routes - Protected Dashboard area */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Dashboard />} />
                  <Route path="symptom-checker" element={<SymptomChecker />} />
                  <Route path="telemedicine" element={<Telemedicine />} />
                  <Route path="ai-assistant" element={<AIAssistant />} />
                  <Route path="daily-health-coach" element={<DailyHealthCoach />} />
                  <Route path="first-aid" element={<FirstAid />} />
                  <Route path="reports-analytics" element={<ReportsAnalytics />} />
                  <Route path="nutrition-tracker" element={<NutritionTracker />} />
                  <Route path="medication-manager" element={<MedicationManagerNew />} />
                  <Route path="smart-pharmacy" element={<SmartPharmacy />} />

                  {/* Premium enterprise features */}
                  <Route path="subscription" element={
                    <ProtectedRoute>
                      <Subscription />
                    </ProtectedRoute>
                  } />
                  <Route path="notifications" element={<Notifications />} />
                  <Route path="calendar-dashboard" element={<CalendarDashboard />} />

                  <Route path="ai-fitness-planner" element={<AIFitnessPlanner />} />
                  <Route path="sleep-tracker" element={<SleepTracker />} />
                  <Route path="security" element={<Security />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Routes>
            </TransitionWrapper>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
