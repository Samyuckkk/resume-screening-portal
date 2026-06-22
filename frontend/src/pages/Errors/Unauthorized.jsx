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
    <div className="mx-auto max-w-2xl px-4 py-16">
      <SectionCard className="text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#fdeaea] text-[#e03939]"><ShieldAlert className="h-8 w-8" /></div>
        <h1 className="text-4xl font-bold text-[#121224]">403</h1>
        <h2 className="mt-2 text-xl font-semibold text-[#121224]">Access denied</h2>
        <p className="mt-3 text-sm text-[#717b9e]">You don&apos;t have permission to view this page.</p>
        <Link to={getHomePath()} className="btn-primary mt-6 inline-flex"><ArrowLeft className="h-4 w-4" />Go back</Link>
      </SectionCard>
    </div>
  );
};

export default Unauthorized;

