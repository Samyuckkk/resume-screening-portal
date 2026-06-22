import React from 'react';
import { motion } from 'framer-motion';

export const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: 'easeOut' },
};

export const PageHeader = ({ eyebrow, title, description, action, className = '', variant = 'light' }) => (
  <motion.div
    initial={fadeUp.initial}
    animate={fadeUp.animate}
    transition={fadeUp.transition}
    className={`${variant === 'hero' ? 'hero-panel rounded-lg p-6 md:p-8' : 'page-header-light'} ${className}`}
  >
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="max-w-3xl space-y-2">
        {eyebrow ? <div className={variant === 'hero' ? 'page-eyebrow' : 'text-xs font-semibold uppercase tracking-wide text-[#457eff]'}>{eyebrow}</div> : null}
        <div className="space-y-2">
          <h1 className={variant === 'hero' ? 'page-title' : 'text-2xl font-bold text-[#121224] md:text-3xl'}>{title}</h1>
          {description ? <p className={variant === 'hero' ? 'page-copy' : 'text-sm leading-relaxed text-[#717b9e] md:text-base'}>{description}</p> : null}
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
    className={`data-card ${className}`}
  >
    {children}
  </motion.div>
);

export const StatCard = ({ icon: Icon, label, value, tone = 'blue', hint }) => {
  const tones = {
    blue: 'bg-[#eef3ff] text-[#457eff]',
    amber: 'bg-[#fff8e6] text-[#d97706]',
    emerald: 'bg-[#edf7ed] text-[#47b749]',
    violet: 'bg-[#f3f0ff] text-[#7c3aed]',
    rose: 'bg-[#fdeaea] text-[#e03939]',
  };

  return (
    <motion.div initial={fadeUp.initial} animate={fadeUp.animate} transition={fadeUp.transition} className="metric-card">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-[#717b9e]">{label}</p>
          <p className="text-2xl font-bold text-[#121224]">{value}</p>
          {hint ? <p className="text-sm text-[#717b9e]">{hint}</p> : null}
        </div>
        {Icon ? (
          <div className={`rounded-lg p-2.5 ${tones[tone] || tones.blue}`}>
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </div>
    </motion.div>
  );
};

export const TabButton = ({ active, icon: Icon, children, onClick }) => (
  <button type="button" onClick={onClick} className={`tab-chip ${active ? 'tab-chip-active' : ''}`}>
    {Icon ? <Icon className="h-4 w-4" /> : null}
    <span>{children}</span>
  </button>
);

export const InfoPair = ({ label, value, className = '' }) => (
  <div className={`space-y-0.5 ${className}`}>
    <p className="text-xs font-medium text-[#717b9e]">{label}</p>
    <p className="text-sm font-semibold text-[#121224]">{value}</p>
  </div>
);
