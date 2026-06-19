import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from '../../utils/toast';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = toast.subscribe((newToast) => {
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== newToast.id));
      }, newToast.duration);
    });

    return unsubscribe;
  }, []);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[80] flex w-full max-w-sm flex-col gap-3 px-2">
      <AnimatePresence>
        {toasts.map((item) => (
          <ToastItem key={item.id} toast={item} onClose={() => setToasts((prev) => prev.filter((toastItem) => toastItem.id !== item.id))} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem = ({ toast, onClose }) => {
  const config = {
    success: {
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
      accent: 'bg-emerald-50 border-emerald-100',
    },
    error: {
      icon: <XCircle className="h-5 w-5 text-rose-600" />,
      accent: 'bg-rose-50 border-rose-100',
    },
    warning: {
      icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
      accent: 'bg-amber-50 border-amber-100',
    },
    info: {
      icon: <Info className="h-5 w-5 text-blue-600" />,
      accent: 'bg-blue-50 border-blue-100',
    },
  };

  const tone = config[toast.type] || config.info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -18, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className={`pointer-events-auto rounded-[1.75rem] border p-4 shadow-xl backdrop-blur-xl ${tone.accent}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{tone.icon}</div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-800">{toast.message}</p>
        </div>
        <button type="button" onClick={onClose} className="rounded-full p-1 text-slate-400 hover:bg-white/70 hover:text-slate-600">
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

