import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from '../Navigation/Sidebar';
import { ToastContainer } from '../Common/Toast';

const DashboardLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen px-3 py-3 md:px-4 md:py-4">
      <ToastContainer />

      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[1600px] gap-4">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <AnimatePresence>
          {mobileSidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 md:hidden">
              <div className="absolute inset-0 bg-slate-900/25 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
              <div className="absolute inset-y-3 left-3">
                <Sidebar mobile onNavigate={() => setMobileSidebarOpen(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <header className="surface-card sticky top-3 z-30 flex items-center justify-between rounded-[1.75rem] px-4 py-3 md:hidden">
            <div>
              <p className="text-sm font-semibold text-slate-900">Antigravity Careers</p>
              <p className="text-xs text-slate-500">Modern screening experience</p>
            </div>
            <button type="button" onClick={() => setMobileSidebarOpen((value) => !value)} className="btn-ghost !rounded-xl !p-2.5">
              {mobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </header>

          <main className="min-w-0 flex-1">
            <div className="mx-auto w-full max-w-7xl space-y-6 pb-10">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

