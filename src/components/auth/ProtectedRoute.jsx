import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Simple protection - checks if admin is logged in via localStorage
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page, but save the current location for redirecting after login
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;