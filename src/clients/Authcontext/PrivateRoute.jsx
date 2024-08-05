import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Authcontext/AuthContext';

// PrivateRoute component
const PrivateRoute = ({ element }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  // Check if user is authenticated
  if (currentUser) {
    return element;
  }

  // Redirect to login page if not authenticated, and preserve the original location
  return <Navigate to="/login" state={{ from: location }} />;
};

export default PrivateRoute;
