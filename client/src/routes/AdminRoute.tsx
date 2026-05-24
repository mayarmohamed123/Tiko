import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PageLoader } from '../components/common/PageLoader';

const AdminRoute: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <PageLoader />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
