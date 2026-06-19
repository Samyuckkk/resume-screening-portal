import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, User, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../../utils/toast';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('applicant');
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
      // handled globally
    } finally {
      setIsSubmitting(false);
    }
  };

  const roles = [
    { value: 'applicant', label: 'Applicant', desc: 'Build a standout career profile' },
    { value: 'recruiter', label: 'Recruiter', desc: 'Guide talent through the funnel' },
    { value: 'admin', label: 'Admin', desc: 'Operate the platform experience' },
  ];

  return (
    <div className="glass-panel rounded-[2.5rem] p-8 shadow-2xl shadow-blue-100/70">
      <div className="space-y-6">
        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-blue-600 to-amber-400 text-white shadow-lg shadow-blue-200">
            <UserPlus className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-950">Create your account</h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">Join the premium workspace for hiring, learning, and career progress.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Full name</label>
            <div className="relative">
              <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Johnson" className="field pl-11" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Email address</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@domain.com" className="field pl-11" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" className="field pl-11" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Choose your portal role</label>
            <div className="grid gap-3 md:grid-cols-3">
              {roles.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setRole(item.value)}
                  className={`rounded-[1.5rem] border p-4 text-left ${
                    role === item.value
                      ? 'border-blue-200 bg-blue-50 shadow-md shadow-blue-100'
                      : 'border-slate-200 bg-white/70 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                  <p className="mt-1 text-xs leading-6 text-slate-500">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <UserPlus className="h-4 w-4" />}
            <span>{isSubmitting ? 'Creating account...' : 'Create account'}</span>
          </button>
        </form>

        <div className="rounded-[1.5rem] bg-white/70 p-4 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700">
            Sign in
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

