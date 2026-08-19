import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { FullScreenLoader } from './ui/loading';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, fetchMe } = useAuthStore();

  useEffect(() => {
    // Validate session on mount
    fetchMe();
  }, [fetchMe]);

  if (isLoading) {
    return <FullScreenLoader message="Verifying access..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
