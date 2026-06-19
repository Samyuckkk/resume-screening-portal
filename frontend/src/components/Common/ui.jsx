import React from 'react';
import { motion } from 'framer-motion';

export const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: 'easeOut' },
};

export const PageHeader = ({ eyebrow, title, description, action, className = '' }) => (
  <motion.div
    initial={fadeUp.initial}
    animate={fadeUp.animate}
    transition={fadeUp.transition}
    className={`hero-panel rounded-[2rem] p-6 md:p-8 ${className}`}
  >
    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
      <div className="max-w-3xl space-y-4">
        {eyebrow ? <div className="page-eyebrow">{eyebrow}</div> : null}
        <div className="space-y-3">
          <h1 className="page-title">{title}</h1>
          {description ? <p className="page-copy">{description}</p> : null}
        </div>
      </div>
      {action ? <div className="flex shrink-0 items-center">{action}</div> : null}
    </div>
  </motion.div>
);

export const SectionCard = ({ children, className = '' }) => (
  <motion.div
    initial={fadeUp.initial}
    animate={fadeUp.animate}
    transition={fadeUp.transition}
    className={`surface-card rounded-[2rem] p-5 md:p-6 ${className}`}
  >
    {children}
  </motion.div>
);

export const StatCard = ({ icon: Icon, label, value, tone = 'blue', hint }) => {
  const tones = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    violet: 'bg-violet-50 text-violet-600 border-violet-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
  };

  return (
    <motion.div
      initial={fadeUp.initial}
      animate={fadeUp.animate}
      transition={fadeUp.transition}
      className="metric-card"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
          {hint ? <p className="text-sm text-slate-500">{hint}</p> : null}
        </div>
        {Icon ? (
          <div className={`rounded-2xl border p-3 ${tones[tone] || tones.blue}`}>
            <Icon className="h-6 w-6" />
          </div>
        ) : null}
      </div>
    </motion.div>
  );
};

export const TabButton = ({ active, icon: Icon, children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`tab-chip ${active ? 'tab-chip-active' : ''}`}
  >
    {Icon ? <Icon className="h-4 w-4" /> : null}
    <span>{children}</span>
  </button>
);

export const InfoPair = ({ label, value, className = '' }) => (
  <div className={`space-y-1 ${className}`}>
    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">{label}</p>
    <p className="text-sm font-semibold text-slate-800">{value}</p>
  </div>
);

