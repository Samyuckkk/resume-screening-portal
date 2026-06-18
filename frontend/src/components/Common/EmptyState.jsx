import React from 'react';
import { FolderOpen } from 'lucide-react';

const EmptyState = ({
  title,
  description,
  icon: Icon = FolderOpen,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/10">
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600 mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{title}</h3>
      <p className="mt-2 text-sm text-slate-550 dark:text-slate-400 max-w-sm leading-relaxed">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;
