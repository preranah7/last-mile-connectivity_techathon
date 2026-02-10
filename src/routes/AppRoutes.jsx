// src/routes/AppRoutes.jsx

import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './ProtectedRoute';

// Auth pages
import { Login } from '../pages/auth/Login';
import { Signup } from '../pages/auth/Signup';

// KYC pages (we'll create these next)
// import { KYCStart } from '../pages/kyc/KYCStart';
// import { AadhaarVerification } from '../pages/kyc/AadhaarVerification';
// import { FaceVerification } from '../pages/kyc/FaceVerification';

// Dashboard pages (we'll create these next)
// import { Dashboard } from '../pages/dashboard/Dashboard';

// Temporary placeholder components
const KYCStart = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">KYC Verification</h1>
      <p className="text-uber-dark-gray">KYC pages coming soon...</p>
    </div>
  </div>
);

const Dashboard = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-uber-dark-gray">Dashboard coming soon...</p>
    </div>
  </div>
);

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* KYC routes (protected but don't require KYC) */}
      <Route
        path="/kyc/start"
        element={
          <ProtectedRoute>
            <KYCStart />
          </ProtectedRoute>
        }
      />

      {/* 404 Not Found */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-6xl font-bold mb-4">404</h1>
              <p className="text-uber-dark-gray mb-6">Page not found</p>
              <a href="/" className="text-uber-black hover:underline">
                Go home
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
};