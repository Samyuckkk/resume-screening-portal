import React from 'react';
import { Link } from 'react-router-dom';
import { FileWarning, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
      <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-full border border-indigo-100 dark:border-indigo-850/50 text-indigo-500 mb-6">
        <FileWarning className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight">404</h1>
      <h2 className="text-xl font-bold text-slate-700 dark:text-slate-350 mt-2">Page Not Found</h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
        The page you are trying to visit does not exist or was moved.
      </p>
      <Link
        to="/jobs"
        className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-650 text-white rounded-xl text-sm font-semibold transition-all shadow-md"
      >
        <Home className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
};

export default NotFound;
