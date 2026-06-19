import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  FileSearch,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Sparkles,
  User,
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ mobile = false, onNavigate }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    onNavigate?.();
  };

  const getLinks = () => {
    switch (user?.role) {
      case 'applicant':
        return [
          { to: '/candidate', label: 'Learning Hub', icon: LayoutDashboard },
          { to: '/jobs', label: 'Career Paths', icon: Briefcase },
          { to: '/profile', label: 'My Profile', icon: User },
        ];
      case 'recruiter':
        return [
          { to: '/recruiter', label: 'Talent Studio', icon: LayoutDashboard },
          { to: '/jobs', label: 'Published Roles', icon: Briefcase },
          { to: '/recruiter/jobs/create', label: 'Create Role', icon: GraduationCap },
          { to: '/profile', label: 'My Profile', icon: User },
        ];
      case 'admin':
        return [
          { to: '/admin', label: 'Command Center', icon: LayoutDashboard },
          { to: '/jobs', label: 'Career Catalog', icon: Briefcase },
          { to: '/admin/parser', label: 'Parser Studio', icon: FileSearch },
          { to: '/profile', label: 'My Profile', icon: User },
        ];
      default:
        return [{ to: '/jobs', label: 'Career Paths', icon: Briefcase }];
    }
  };

  const links = getLinks();
  const roleLabels = {
    applicant: 'Learner',
    recruiter: 'Mentor',
    admin: 'Operator',
  };

  return (
    <motion.aside
      initial={mobile ? { x: -30, opacity: 0 } : false}
      animate={mobile ? { x: 0, opacity: 1 } : false}
      className={`${mobile ? 'w-[86vw] max-w-[320px]' : collapsed ? 'w-[96px]' : 'w-[290px]'} h-full rounded-[2rem] glass-panel flex flex-col justify-between p-4 md:p-5`}
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3 rounded-[1.5rem] bg-white/70 p-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-sky-500 to-amber-300 text-white shadow-lg shadow-blue-200">
              <Sparkles className="h-5 w-5" />
            </div>
            {(!collapsed || mobile) && (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">Antigravity Careers</p>
                <p className="text-xs text-slate-500">Premium learning to placement</p>
              </div>
            )}
          </div>
          {!mobile && (
            <button
              type="button"
              onClick={() => setCollapsed((value) => !value)}
              className="btn-ghost !rounded-xl !p-2"
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          )}
        </div>

        {user && (
          <div className="rounded-[1.75rem] bg-gradient-to-br from-slate-900 to-blue-950 p-4 text-white shadow-xl shadow-blue-100">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/14 text-lg font-bold uppercase">
                {user.name?.charAt(0)}
              </div>
              {(!collapsed || mobile) && (
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{user.name}</p>
                  <p className="text-xs text-blue-100/80">{roleLabels[user.role] || user.role}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/candidate' || link.to === '/recruiter' || link.to === '/admin'}
                onClick={() => onNavigate?.()}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold ${
                    isActive
                      ? 'bg-white text-blue-700 shadow-lg shadow-blue-100'
                      : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
                  }`
                }
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600">
                  <Icon className="h-4 w-4" />
                </span>
                {(!collapsed || mobile) && <span className="truncate">{link.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="space-y-3 rounded-[1.5rem] bg-white/70 p-3">
        {user ? (
          <button type="button" onClick={handleLogout} className="btn-danger w-full !justify-start">
            <LogOut className="h-4 w-4" />
            {(!collapsed || mobile) && <span>Sign Out</span>}
          </button>
        ) : (
          <NavLink to="/login" onClick={() => onNavigate?.()} className="btn-primary w-full !justify-start">
            <LogOut className="h-4 w-4" />
            {(!collapsed || mobile) && <span>Sign In</span>}
          </NavLink>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;

