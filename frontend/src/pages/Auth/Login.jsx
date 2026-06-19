import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Lock, LogIn, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../../utils/toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      // handled globally
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-panel rounded-[2.5rem] p-8 shadow-2xl shadow-blue-100/70">
      <div className="space-y-6">
        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-blue-600 to-sky-400 text-white shadow-lg shadow-blue-200">
            <LogIn className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-950">Welcome back</h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">Sign in to continue your learning-to-career journey.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Email address</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="field pl-11" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="field pl-11" />
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <LogIn className="h-4 w-4" />}
            <span>{isSubmitting ? 'Signing in...' : 'Sign in'}</span>
          </button>
        </form>

        <div className="rounded-[1.5rem] bg-white/70 p-4 text-center text-sm text-slate-500">
          New here?{' '}
          <Link to="/register" className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700">
            Create an account
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

