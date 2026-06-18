import React from 'react';

export const Spinner = ({ size = 'md', color = 'indigo' }) => {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const colors = {
    indigo: 'border-indigo-500',
    violet: 'border-violet-500',
    white: 'border-white',
  };

  return (
    <div className={`relative ${sizes[size] || sizes.md} rounded-full border-t-transparent animate-spin ${colors[color] || colors.indigo}`}></div>
  );
};

export const SkeletonCard = () => (
  <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="h-6 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
      <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
    </div>
    <div className="space-y-2">
      <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-md"></div>
      <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
    </div>
    <div className="pt-4 flex justify-between items-center border-t border-slate-100 dark:border-slate-800/60">
      <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
      <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5, cols = 4 }) => (
  <div className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm animate-pulse">
    <div className="bg-slate-50 dark:bg-slate-800/40 p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between">
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md" style={{ width: `${80 / cols}%` }}></div>
      ))}
    </div>
    <div className="divide-y divide-slate-100 dark:divide-slate-850">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="p-4 flex justify-between items-center">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="h-4 bg-slate-100 dark:bg-slate-800 rounded-md" style={{ width: `${80 / cols}%` }}></div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonDetails = () => (
  <div className="w-full max-w-4xl mx-auto p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6 animate-pulse">
    <div className="space-y-3">
      <div className="h-8 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
      <div className="h-5 w-1/4 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
    </div>
    <div className="border-t border-b border-slate-100 dark:border-slate-800/60 py-6 space-y-4">
      <div className="h-4 w-full bg-slate-100 dark:bg-slate-850 rounded-md"></div>
      <div className="h-4 w-full bg-slate-100 dark:bg-slate-850 rounded-md"></div>
      <div className="h-4 w-3/4 bg-slate-100 dark:bg-slate-850 rounded-md"></div>
    </div>
    <div className="flex gap-4">
      <div className="h-10 w-32 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
      <div className="h-10 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
    </div>
  </div>
);
