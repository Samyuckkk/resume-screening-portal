import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SectionCard } from '../../components/Common/ui';

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
    <SectionCard className="mx-auto max-w-2xl text-center">
      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-rose-50 text-rose-600"><ShieldAlert className="h-10 w-10" /></div>
      <h1 className="text-4xl font-bold text-slate-900">403</h1>
      <h2 className="mt-2 text-2xl font-bold text-slate-900">Access denied</h2>
      <p className="mt-3 text-sm leading-7 text-slate-500">You do not have permission to view this section with the current role.</p>
      <Link to={getHomePath()} className="btn-primary mt-6"><ArrowLeft className="h-4 w-4" />Return to dashboard</Link>
    </SectionCard>
  );
};

export default Unauthorized;

