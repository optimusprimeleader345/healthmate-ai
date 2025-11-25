import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, loading, isAdmin } = useAuth();

  useEffect(() => {
    // If still loading, don't redirect yet
    if (loading) return;

    // If not authenticated and done loading, will redirect below
  }, [isAuthenticated, loading, user]);

  // Show loading state while determining authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If admin-only route and user is not admin, redirect to dashboard
  if (adminOnly && !isAdmin) {
    console.log('Admin-only route accessed by non-admin, redirecting to dashboard', { user: user?.email, role: user?.role, isAdmin });
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and has proper permissions
  return children;
};

export default ProtectedRoute;
