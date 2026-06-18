import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ToastContainer } from '../Common/Toast';

const AuthLayout = () => {
  const { isAuthenticated, user } = useAuth();

  // If already authenticated, redirect to their role homepage
  if (isAuthenticated && user) {
    const roleRedirects = {
      applicant: '/candidate',
      recruiter: '/recruiter',
      admin: '/admin',
    };
    return <Navigate to={roleRedirects[user.role] || '/jobs'} replace />;
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 py-12 px-4 overflow-hidden">
      {/* Toast notifications */}
      <ToastContainer />

      {/* Decorative Blobs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-violet-500/10 dark:bg-violet-500/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />

      {/* Main card */}
      <div className="relative w-full max-w-md z-10">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
