// src/routes/ProtectedRoute.jsx

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ 
  children, 
  requireKYC = false,
  requireRole = null 
}) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-uber-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-uber-dark-gray">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated -> redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check KYC requirement
  if (requireKYC && user.kycStatus !== 'VERIFIED') {
    return <Navigate to="/kyc/start" replace />;
  }

  // Check role requirement
  if (requireRole && !user.roles?.includes(requireRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-uber-dark-gray mb-6">
            You don't have permission to access this page.
          </p>
          <Navigate to="/dashboard" replace />
        </div>
      </div>
    );
  }

  // All checks passed -> render children
  return children;
};

/**
 * Public Route Component
 * Redirects to dashboard if already authenticated
 * Used for login/signup pages
 */
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-uber-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Already authenticated -> redirect to where they came from or dashboard
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  // Not authenticated -> show public page
  return children;
};

/* 
 * USAGE EXAMPLES:
 * 
 * In AppRoutes.jsx:
 * 
 * // Public routes (redirect if logged in)
 * <Route path="/login" element={
 *   <PublicRoute>
 *     <Login />
 *   </PublicRoute>
 * } />
 * 
 * // Protected route (require auth)
 * <Route path="/dashboard" element={
 *   <ProtectedRoute>
 *     <Dashboard />
 *   </ProtectedRoute>
 * } />
 * 
 * // Protected + KYC required
 * <Route path="/driver/create-trip" element={
 *   <ProtectedRoute requireKYC={true}>
 *     <CreateTrip />
 *   </ProtectedRoute>
 * } />
 * 
 * // Protected + specific role
 * <Route path="/driver/*" element={
 *   <ProtectedRoute requireRole="DRIVER">
 *     <DriverDashboard />
 *   </ProtectedRoute>
 * } />
 * 
 * // Protected + KYC + role
 * <Route path="/admin/*" element={
 *   <ProtectedRoute requireKYC={true} requireRole="ADMIN">
 *     <AdminPanel />
 *   </ProtectedRoute>
 * } />
 */