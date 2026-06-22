import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, LogIn, Mail } from 'lucide-react';
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
    <div className="data-card">
      <div className="space-y-5">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#121224]">Login</h2>
          <p className="mt-1 text-sm text-[#717b9e]">Login to apply to jobs and manage your profile</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#474d6a]">Email ID / Username</label>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#717b9e] shrink-0" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="field !px-3.5"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#474d6a]">Password</label>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-[#717b9e] shrink-0" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="field !px-3.5"
              />
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full !py-3">
            {isSubmitting ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <LogIn className="h-4 w-4" />
            )}
            <span>{isSubmitting ? 'Logging in...' : 'Login'}</span>
          </button>
        </form>

        <div className="border-t border-[#e8e8e8] pt-4 text-center text-sm text-[#717b9e]">
          New to Recruvo?{' '}
          <Link to="/register" className="font-semibold text-[#457eff] hover:underline">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
