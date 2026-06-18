import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, User, UserPlus, ArrowRight, UserCheck } from 'lucide-react';
import { toast } from '../../utils/toast';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('applicant'); // Default role
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !role) {
      toast.warning('Please fill in all registration fields.');
      return;
    }

    if (password.length < 6) {
      toast.warning('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      const loggedUser = await register(name, email, password, role);
      const roleRedirects = {
        applicant: '/candidate',
        recruiter: '/recruiter',
        admin: '/admin',
      };
      navigate(roleRedirects[loggedUser.role] || '/jobs', { replace: true });
    } catch (err) {
      // Axios global interceptors handle showing the specific details
    } finally {
      setIsSubmitting(false);
    }
  };

  const roles = [
    { value: 'applicant', label: 'Applicant', desc: 'Find your dream job' },
    { value: 'recruiter', label: 'Recruiter', desc: 'Hire top talent' },
    { value: 'admin', label: 'Admin', desc: 'Manage portal assets' },
  ];

  return (
    <div className="w-full p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-2xl flex flex-col gap-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-indigo-500/20 mb-2">
          A
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-850 dark:text-slate-100">Create Account</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Join us to streamline resume parsing and hiring.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Full Name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              required
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="email"
              required
              placeholder="name@domain.com"
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
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        {/* Role Selector Segmented Controls */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Select Portal Role</label>
          <div className="grid grid-cols-3 gap-2">
            {roles.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${
                  role === r.value
                    ? 'border-indigo-500 bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-400'
                }`}
              >
                <span className="text-xs">{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 mt-6"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Create Account</span>
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="text-center pt-4 border-t border-slate-100 dark:border-slate-850">
        <p className="text-sm text-slate-505 dark:text-slate-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-bold text-indigo-500 hover:text-indigo-650 transition-colors inline-flex items-center gap-0.5"
          >
            <span>Login here</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
