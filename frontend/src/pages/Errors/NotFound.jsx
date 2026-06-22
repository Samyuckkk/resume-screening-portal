import React from 'react';
import { Link } from 'react-router-dom';
import { FileWarning, Home } from 'lucide-react';
import { SectionCard } from '../../components/Common/ui';

const NotFound = () => (
  <div className="mx-auto max-w-2xl px-4 py-16">
    <SectionCard className="text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#eef3ff] text-[#457eff]"><FileWarning className="h-8 w-8" /></div>
      <h1 className="text-4xl font-bold text-[#121224]">404</h1>
      <h2 className="mt-2 text-xl font-semibold text-[#121224]">Page not found</h2>
      <p className="mt-3 text-sm text-[#717b9e]">The page you are looking for does not exist.</p>
      <Link to="/jobs" className="btn-primary mt-6 inline-flex"><Home className="h-4 w-4" />Browse Jobs</Link>
    </SectionCard>
  </div>
);

export default NotFound;

