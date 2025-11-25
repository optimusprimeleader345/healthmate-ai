import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Shield,
  Settings,
  UserCheck,
  Activity,
  Lock,
  Zap,
  Globe,
  TrendingUp,
  DollarSign,
  LogOut,
  User,
  Clock,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const adminMenuItems = [
  {
    name: 'Admin Dashboard',
    path: '/admin/dashboard',
    icon: LayoutDashboard,
    description: 'System overview and metrics'
  },
  {
    name: 'User Management',
    path: '/admin/users',
    icon: Users,
    description: 'Manage user accounts and permissions'
  },
  {
    name: 'Cloud Control Center',
    path: '/admin/cloud-control',
    icon: Settings,
    description: 'Quantum-ready cloud infrastructure'
  },
  {
    name: 'AI Autonomous Ops',
    path: '/admin/ai-autonomous',
    icon: Zap,
    description: 'Self-healing AI operations center'
  },
  {
    name: 'Global Health Intelligence',
    path: '/admin/global-health',
    icon: Globe,
    description: 'Real-time worldwide health network'
  },
  {
    name: 'Predictive Infrastructure AI',
    path: '/admin/predictive-ai',
    icon: TrendingUp,
    description: 'AI-driven capacity & SLA monitoring'
  },
  {
    name: 'Enterprise Security Ops',
    path: '/admin/cloud-security',
    icon: Lock,
    description: 'Cloud security operations center'
  },
  {
    name: 'Business AI Autopilot',
    path: '/admin/business-ai',
    icon: DollarSign,
    description: 'Real-time business AI optimization'
  },
  {
    name: 'Analytics & Reports',
    path: '/admin/analytics',
    icon: BarChart3,
    description: 'Business intelligence and insights'
  },
  {
    name: 'Security Monitoring',
    path: '/admin/security',
    icon: Shield,
    description: 'Security status and compliance'
  }
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(true);
  };

  return (
    <div style={{
      backgroundColor: '#0f172a',
      color: 'white',
      minHeight: '100vh',
      display: 'flex'
    }}>
      {/* Admin Sidebar */}
      <div style={{
        width: '280px',
        backgroundColor: '#1e293b',
        borderRight: '1px solid #334155',
        padding: '20px 0',
        minHeight: '100vh'
      }}>
        {/* Header */}
        <div style={{ padding: '0 20px 30px' }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#06b6d4',
            marginBottom: '4px'
          }}>
            HealthMate Admin
          </h2>
          <p style={{ fontSize: '12px', color: '#94a3b8' }}>
            Enterprise Management
          </p>
        </div>

        {/* Navigation Menu */}
        <nav style={{ padding: '0 16px' }}>
          {adminMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <div
                key={item.name}
                style={{
                  marginBottom: '8px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: isActive ? '#06b6d4' : 'transparent',
                  border: isActive ? '1px solid #0891b2' : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: isActive ? 1 : 0.8
                }}
                onClick={() => navigate(item.path)}
                onMouseOver={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#374151';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <item.icon style={{
                    width: '20px',
                    height: '20px',
                    color: isActive ? 'white' : '#cbd5e1'
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: isActive ? '600' : '500',
                      color: isActive ? 'white' : '#e2e8f0'
                    }}>
                      {item.name}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: isActive ? '#cffafe' : '#64748b',
                      marginTop: '2px'
                    }}>
                      {item.description}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Quick Stats */}
        <div style={{
          marginTop: '40px',
          padding: '0 16px'
        }}>
          <h4 style={{
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#94a3b8',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Quick Stats
          </h4>

          <div style={{
            backgroundColor: '#334155',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <UserCheck style={{ width: '14px', height: '14px', color: '#34d399' }} />
              <span style={{ fontSize: '13px', color: '#e2e8f0' }}>
                4,876 Active Users
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Activity style={{ width: '14px', height: '14px', color: '#fbbf24' }} />
              <span style={{ fontSize: '13px', color: '#e2e8f0' }}>
                99.97% Uptime
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield style={{ width: '14px', height: '14px', color: '#06b6d4' }} />
              <span style={{ fontSize: '13px', color: '#e2e8f0' }}>
                Secure Status
              </span>
            </div>
          </div>
        </div>

        {/* User Session & Logout */}
        <div style={{
          marginTop: '40px',
          padding: '0 16px',
          borderTop: '1px solid #334155',
          paddingTop: '16px'
        }}>
          <div style={{
            backgroundColor: '#334155',
            borderRadius: '8px',
            padding: '16px'
          }}>
            {/* User Info */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
              paddingBottom: '12px',
              borderBottom: '1px solid #475569'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#06b6d4',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <User style={{ width: '18px', height: '18px', color: 'white' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#e2e8f0',
                  marginBottom: '2px'
                }}>
                  {user?.name || 'Administrator'}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#94a3b8'
                }}>
                  {user?.email || 'admin@healthmate.com'}
                </div>
              </div>
            </div>

            {/* Session Info */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '4px'
              }}>
                <Clock style={{ width: '12px', height: '12px', color: '#94a3b8' }} />
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                  Session Active
                </span>
              </div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>
                Last activity: {new Date().toLocaleTimeString()}
              </div>
            </div>

            {/* Logout Button */}
            <div style={{
              display: 'flex',
              gap: '8px'
            }}>
              <button
                onClick={confirmLogout}
                disabled={isLoggingOut}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  opacity: isLoggingOut ? 0.6 : 1
                }}
                onMouseOver={(e) => {
                  if (!isLoggingOut) {
                    e.currentTarget.style.backgroundColor = '#b91c1c';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isLoggingOut) {
                    e.currentTarget.style.backgroundColor = '#dc2626';
                  }
                }}
              >
                <LogOut style={{ width: '14px', height: '14px' }} />
                {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
              </button>

              <button
                onClick={() => window.location.reload()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                  backgroundColor: '#374151',
                  color: '#cbd5e1',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#4b5563';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#374151';
                }}
              >
                <RefreshCw style={{ width: '14px', height: '14px' }} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#1e293b',
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '400px',
            width: '90%',
            border: '1px solid #334155'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <AlertTriangle style={{ width: '24px', height: '24px', color: '#f59e0b' }} />
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#e2e8f0',
                margin: 0
              }}>
                Confirm Sign Out
              </h3>
            </div>

            <p style={{
              fontSize: '14px',
              color: '#94a3b8',
              marginBottom: '24px',
              lineHeight: '1.5'
            }}>
              Are you sure you want to sign out? Any unsaved changes will be lost.
            </p>

            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  backgroundColor: '#374151',
                  color: '#cbd5e1',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#4b5563';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#374151';
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  opacity: isLoggingOut ? 0.6 : 1
                }}
                onMouseOver={(e) => {
                  if (!isLoggingOut) {
                    e.currentTarget.style.backgroundColor = '#b91c1c';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isLoggingOut) {
                    e.currentTarget.style.backgroundColor = '#dc2626';
                  }
                }}
              >
                {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        padding: '24px',
        backgroundColor: '#0f172a'
      }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
