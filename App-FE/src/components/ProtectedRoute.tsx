import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/data';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles,
  requireAuth = true
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-subtle">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect unauthenticated users to login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect authenticated users away from public pages
  if (!requireAuth && isAuthenticated && user) {
    const dashboardPath = getDashboardPath(user.role);
    return <Navigate to={dashboardPath} replace />;
  }

  // Check role permissions
  if (requireAuth && isAuthenticated && allowedRoles && user) {
    if (!allowedRoles.includes(user.role)) {
      // Redirect to user's appropriate dashboard
      const dashboardPath = getDashboardPath(user.role);
      return <Navigate to={dashboardPath} replace />;
    }
  }

  return <>{children}</>;
};

// Helper function to get dashboard path based on role
const getDashboardPath = (role: UserRole): string => {
  switch (role) {
    case UserRole.DONOR:
      return '/donor/dashboard';
    case UserRole.MANUFACTURER:
      return '/manufacturer/dashboard';
    case UserRole.BUYER:
      return '/buyer/dashboard';
    case UserRole.ADMIN:
      return '/admin/dashboard';
    default:
      return '/';
  }
};