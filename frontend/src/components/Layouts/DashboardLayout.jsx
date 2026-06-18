import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Navigation/Sidebar';
import { Menu, X } from 'lucide-react';
import { ToastContainer } from '../Common/Toast';

const DashboardLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-55 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      {/* Toast notifications */}
      <ToastContainer />

      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Backdrop & Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          {/* Sidebar drawer */}
          <div className="absolute top-0 left-0 w-64 h-full bg-white dark:bg-slate-900 shadow-2xl z-10">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="flex md:hidden items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-850 z-30">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">
              R
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-100 text-sm tracking-tight">Resume Screening Portal</span>
          </div>

          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-500 dark:text-slate-400"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:p-8">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
