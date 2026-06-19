import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ToastContainer } from '../Common/Toast';

const AuthLayout = () => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    const roleRedirects = {
      applicant: '/candidate',
      recruiter: '/recruiter',
      admin: '/admin',
    };
    return <Navigate to={roleRedirects[user.role] || '/jobs'} replace />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-10">
      <ToastContainer />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,0.28),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(251,191,36,0.18),_transparent_25%)]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="hidden lg:block">
            <div className="hero-panel rounded-[2.5rem] p-10">
              <div className="page-eyebrow">Career acceleration platform</div>
              <div className="mt-6 space-y-5">
                <h1 className="text-5xl font-bold leading-tight text-slate-950">
                  Learn faster, apply smarter, get hired with clarity.
                </h1>
                <p className="max-w-xl text-base leading-8 text-slate-600">
                  A polished educational and career workspace for candidates, recruiters, and admins to move from resume to interview with confidence.
                </p>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1.5rem] bg-white/80 p-4">
                  <p className="text-2xl font-bold text-slate-900">100%</p>
                  <p className="mt-1 text-sm text-slate-500">Existing flows preserved</p>
                </div>
                <div className="rounded-[1.5rem] bg-white/80 p-4">
                  <p className="text-2xl font-bold text-slate-900">AI</p>
                  <p className="mt-1 text-sm text-slate-500">Resume parsing at a glance</p>
                </div>
                <div className="rounded-[1.5rem] bg-white/80 p-4">
                  <p className="text-2xl font-bold text-slate-900">Mobile</p>
                  <p className="mt-1 text-sm text-slate-500">Responsive across every step</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

