import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/lib/data";

// Index page - redirects based on auth status
const Index = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Show loading while auth is being determined
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

  // Redirect authenticated users to their dashboard
  if (isAuthenticated && user) {
    switch (user.role) {
      case UserRole.DONOR:
        return <Navigate to="/donor/dashboard" replace />;
      case UserRole.MANUFACTURER:
        return <Navigate to="/manufacturer/dashboard" replace />;
      case UserRole.BUYER:
        return <Navigate to="/buyer/dashboard" replace />;
      case UserRole.ADMIN:
        return <Navigate to="/admin/dashboard" replace />;
      default:
        return <Navigate to="/landing" replace />;
    }
  }

  // Redirect unauthenticated users to landing page
  return <Navigate to="/landing" replace />;
};

export default Index;
