import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, HelpCircle } from 'lucide-react';

const ConfirmDialog = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
}) => {
  if (!isOpen) return null;

  const variants = {
    danger: {
      icon: <AlertTriangle className="h-6 w-6 text-rose-600" />,
      chip: 'bg-rose-50 text-rose-700',
      button: 'btn-danger',
    },
    warning: {
      icon: <AlertTriangle className="h-6 w-6 text-amber-600" />,
      chip: 'bg-amber-50 text-amber-700',
      button: 'btn-primary',
    },
    info: {
      icon: <HelpCircle className="h-6 w-6 text-blue-600" />,
      chip: 'bg-blue-50 text-blue-700',
      button: 'btn-primary',
    },
  };

  const tone = variants[type] || variants.info;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={onCancel} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="surface-card relative z-10 w-full max-w-md rounded-[2rem] p-6"
        >
          <div className="flex items-start gap-4">
            <div className={`rounded-2xl p-3 ${tone.chip}`}>{tone.icon}</div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">{title}</h3>
              <p className="text-sm leading-7 text-slate-500">{message}</p>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onCancel} className="btn-secondary">
              {cancelText}
            </button>
            <button type="button" onClick={onConfirm} className={tone.button}>
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmDialog;

