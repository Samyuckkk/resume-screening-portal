import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { toast } from '../../utils/toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine redirect page after successful login
  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const loggedUser = await login(email, password);
      
      // If a 'from' path is given, redirect there. Otherwise, redirect based on role.
      if (from) {
        navigate(from, { replace: true });
      } else {
        const roleRedirects = {
          applicant: '/candidate',
          recruiter: '/recruiter',
          admin: '/admin',
        };
        navigate(roleRedirects[loggedUser.role] || '/jobs', { replace: true });
      }
    } catch (err) {
      // Axios interceptor already handles showing the toast message
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-2xl flex flex-col gap-6">
      {/* Logo / Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-indigo-500/20 mb-2">
          A
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-850 dark:text-slate-100">Welcome Back</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Sign in to manage your resume screening process.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="email"
              required
              placeholder="candidate@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 mt-6"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </>
          )}
        </button>
      </form>

      {/* Footer link */}
      <div className="text-center pt-4 border-t border-slate-100 dark:border-slate-850">
        <p className="text-sm text-slate-505 dark:text-slate-400">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-bold text-indigo-500 hover:text-indigo-650 transition-colors inline-flex items-center gap-0.5"
          >
            <span>Register here</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
