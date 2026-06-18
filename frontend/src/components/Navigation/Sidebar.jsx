import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Briefcase,
  User,
  PlusSquare,
  FileText,
  Moon,
  Sun,
  LogOut,
  Users,
  Shield,
  FileSearch,
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' ||
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  useEffect(() => {
    const root = window.document.body;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getLinks = () => {
    switch (user?.role) {
      case 'applicant':
        return [
          { to: '/candidate', label: 'My Dashboard', icon: LayoutDashboard },
          { to: '/jobs', label: 'Explore Jobs', icon: Briefcase },
          { to: '/profile', label: 'My Profile', icon: User },
        ];
      case 'recruiter':
        return [
          { to: '/recruiter', label: 'Recruiter Dashboard', icon: LayoutDashboard },
          { to: '/jobs', label: 'Job Listings', icon: Briefcase },
          { to: '/recruiter/jobs/create', label: 'Post a Job', icon: PlusSquare },
          { to: '/profile', label: 'Profile Settings', icon: User },
        ];
      case 'admin':
        return [
          { to: '/admin', label: 'Admin Dashboard', icon: LayoutDashboard },
          { to: '/jobs', label: 'Job Board', icon: Briefcase },
          { to: '/admin/parser', label: 'Resume Parser', icon: FileSearch },
          { to: '/profile', label: 'Profile Settings', icon: User },
        ];
      default:
        return [
          { to: '/jobs', label: 'Explore Jobs', icon: Briefcase },
        ];
    }
  };

  const links = getLinks();

  const roleLabels = {
    applicant: 'Candidate',
    recruiter: 'Recruiter',
    admin: 'Administrator',
  };

  return (
    <aside className="w-64 h-screen flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 backdrop-blur-md flex flex-col justify-between p-4 select-none z-20">
      <div className="space-y-6">
        {/* Brand */}
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-500/20">
            R
          </div>
          <div>
            <h1 className="font-bold text-slate-800 dark:text-slate-100 tracking-tight leading-tight">Resume</h1>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Screening Portal</span>
          </div>
        </div>

        {/* User Card */}
        {user && (
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{user.name}</p>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-850/50 capitalize">
                {roleLabels[user.role] || user.role}
              </span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/candidate' || link.to === '/recruiter' || link.to === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/10'
                      : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/40 dark:hover:text-slate-200'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800/60">
        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/40 dark:hover:text-slate-200 transition-colors"
        >
          <div className="flex items-center gap-3">
            {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </div>
          <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
            {darkMode ? 'Dark' : 'Light'}
          </span>
        </button>

        {/* Logout */}
        {user ? (
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        ) : (
          <NavLink
            to="/login"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Login</span>
          </NavLink>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
