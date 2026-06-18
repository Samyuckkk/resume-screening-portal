import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Unauthorized = () => {
  const { user } = useAuth();
  
  const getHomePath = () => {
    if (!user) return '/login';
    const routes = {
      applicant: '/candidate',
      recruiter: '/recruiter',
      admin: '/admin',
    };
    return routes[user.role] || '/jobs';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
      <div className="p-4 bg-rose-50 dark:bg-rose-950/40 rounded-full border border-rose-100 dark:border-rose-850/50 text-rose-500 mb-6">
        <ShieldAlert className="w-12 h-12" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">403</h1>
      <h2 className="text-xl font-bold text-slate-700 dark:text-slate-350 mt-2">Access Denied</h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
        You do not have administrative permissions to view this dashboard section.
      </p>
      <Link
        to={getHomePath()}
        className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-900 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900 text-white rounded-xl text-sm font-semibold transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};

export default Unauthorized;
