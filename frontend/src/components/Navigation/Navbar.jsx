import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Briefcase, ChevronDown, LogOut, Menu, User, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/jobs');
    setMobileOpen(false);
    setUserMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/jobs';
    const links = { applicant: '/candidate', recruiter: '/recruiter', admin: '/admin' };
    return links[user.role] || '/jobs';
  };

  const getDashboardLabel = () => {
    const labels = { applicant: 'My Recruvo', recruiter: 'Recruiter Dashboard', admin: 'Admin Panel' };
    return labels[user?.role] || 'Dashboard';
  };

  const navLinks = [
    { to: '/jobs', label: 'Jobs', end: true },
    ...(user?.role === 'recruiter' || user?.role === 'admin'
      ? [{ to: '/recruiter/jobs/create', label: 'Post a Job', end: false }]
      : []),
    ...(user?.role === 'admin' ? [{ to: '/admin/parser', label: 'Resume Parser', end: false }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#e8e8e8] bg-white shadow-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 lg:px-6">
        <div className="flex items-center gap-6">
          <Link to="/jobs" className="flex shrink-0 items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded bg-[#457eff] text-sm font-extrabold text-white">
              R
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-[#121224]">Recruvo</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `rounded px-3 py-2 text-sm font-medium ${
                    isActive ? 'text-[#457eff] bg-[#eef3ff]' : 'text-[#474d6a] hover:text-[#121224] hover:bg-gray-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated && user ? (
            <>
              <Link to={getDashboardLink()} className="text-sm font-medium text-[#474d6a] hover:text-[#457eff]">
                {getDashboardLabel()}
              </Link>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 rounded border border-[#e8e8e8] px-3 py-1.5 text-sm font-medium text-[#121224] hover:border-[#457eff]"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#457eff] text-xs font-bold text-white">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{user.name?.split(' ')[0]}</span>
                  <ChevronDown className="h-4 w-4 text-[#717b9e]" />
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 z-50 mt-2 w-52 rounded-lg border border-[#e8e8e8] bg-white py-1 shadow-lg">
                      <div className="border-b border-[#e8e8e8] px-4 py-3">
                        <p className="truncate text-sm font-semibold text-[#121224]">{user.name}</p>
                        <p className="truncate text-xs text-[#717b9e]">{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#474d6a] hover:bg-gray-50"
                      >
                        <User className="h-4 w-4" />
                        My Profile
                      </Link>
                      <Link
                        to={getDashboardLink()}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#474d6a] hover:bg-gray-50"
                      >
                        <Briefcase className="h-4 w-4" />
                        {getDashboardLabel()}
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-[#e03939] hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-[#457eff] hover:text-[#3468d9]">
                Login
              </Link>
              <Link to="/register" className="btn-orange !py-2 !px-4">
                Register
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded p-2 text-[#474d6a] md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-[#e8e8e8] bg-white px-4 py-4 md:hidden">
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block rounded px-3 py-2.5 text-sm font-medium ${
                    isActive ? 'bg-[#eef3ff] text-[#457eff]' : 'text-[#474d6a]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {isAuthenticated && user ? (
              <>
                <Link
                  to={getDashboardLink()}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded px-3 py-2.5 text-sm font-medium text-[#474d6a]"
                >
                  {getDashboardLabel()}
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded px-3 py-2.5 text-sm font-medium text-[#474d6a]"
                >
                  My Profile
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full rounded px-3 py-2.5 text-left text-sm font-medium text-[#e03939]"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary flex-1 !py-2">
                  Login
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-orange flex-1 !py-2">
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
