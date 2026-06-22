import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
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
    <div className="min-h-screen bg-[#f8f9fa]">
      <ToastContainer />

      {/* Minimal header */}
      <header className="border-b border-[#e8e8e8] bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 lg:px-6">
          <Link to="/jobs" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded bg-[#457eff] text-sm font-extrabold text-white">
              R
            </div>
            <span className="text-lg font-bold text-[#121224]">
              Recruvo
            </span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/jobs" className="text-[#474d6a] hover:text-[#457eff]">Browse Jobs</Link>
          </div>
        </div>
      </header>

      <div className="mx-auto grid min-h-[calc(100vh-56px)] max-w-6xl items-center gap-8 px-4 py-10 lg:grid-cols-2 lg:px-6">
        <div className="hidden lg:block">
          <div className="rounded-lg bg-gradient-to-br from-[#457eff] to-[#5b8fff] p-10 text-white">
            <h1 className="text-3xl font-bold leading-tight">
              Find your dream job now
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/85">
              5 lakh+ jobs for you to explore. Create your profile, upload resume, and apply to top companies in one click.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-white/15 p-4 backdrop-blur">
                <p className="text-2xl font-bold">AI</p>
                <p className="mt-1 text-xs text-white/80">Resume parsing</p>
              </div>
              <div className="rounded-lg bg-white/15 p-4 backdrop-blur">
                <p className="text-2xl font-bold">1-Click</p>
                <p className="mt-1 text-xs text-white/80">Apply to jobs</p>
              </div>
              <div className="rounded-lg bg-white/15 p-4 backdrop-blur">
                <p className="text-2xl font-bold">Free</p>
                <p className="mt-1 text-xs text-white/80">For job seekers</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
