import React from 'react';
import { Link } from 'react-router-dom';
import { FileWarning, Home } from 'lucide-react';
import { SectionCard } from '../../components/Common/ui';

const NotFound = () => {
  return (
    <SectionCard className="mx-auto max-w-2xl text-center">
      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-blue-50 text-blue-600"><FileWarning className="h-10 w-10" /></div>
      <h1 className="text-4xl font-bold text-slate-900">404</h1>
      <h2 className="mt-2 text-2xl font-bold text-slate-900">Page not found</h2>
      <p className="mt-3 text-sm leading-7 text-slate-500">The page you are trying to visit does not exist or may have moved.</p>
      <Link to="/jobs" className="btn-primary mt-6"><Home className="h-4 w-4" />Return to careers</Link>
    </SectionCard>
  );
};

export default NotFound;

