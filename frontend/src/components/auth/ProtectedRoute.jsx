import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/admin/login" replace />;
  }

  // Check if user has the required role
  if (requiredRole && !currentUser.roles.includes(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;