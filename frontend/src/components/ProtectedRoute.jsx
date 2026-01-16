import React from 'react';
import { Navigate } from 'react-router-dom';
import { adminAuthAPI } from '../services/api';

export default function ProtectedRoute({ children }) {
  const isAuthenticated = adminAuthAPI.isAuthenticated();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}