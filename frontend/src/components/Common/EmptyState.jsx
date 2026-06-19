import React from 'react';
import { FolderOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const EmptyState = ({ title, description, icon: Icon = FolderOpen, action }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="surface-card flex flex-col items-center justify-center rounded-[2rem] px-6 py-12 text-center"
    >
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-blue-50 to-amber-50 text-blue-600 shadow-sm">
        <Icon className="h-9 w-9" />
      </div>
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      <p className="mt-3 max-w-md text-sm leading-7 text-slate-500">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </motion.div>
  );
};

export default EmptyState;

