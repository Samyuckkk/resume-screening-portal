import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, UserPlus } from 'lucide-react';
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
    { value: 'applicant', label: 'Job Seeker', desc: 'Find and apply to jobs' },
    { value: 'recruiter', label: 'Employer', desc: 'Post jobs & hire talent' },
    { value: 'admin', label: 'Admin', desc: 'Manage the platform' },
  ];

  return (
    <div className="data-card">
      <div className="space-y-5">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#121224]">Create your account</h2>
          <p className="mt-1 text-sm text-[#717b9e]">Register to apply to jobs or post openings</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#474d6a]">Full Name</label>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-[#717b9e] shrink-0" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="field !px-3.5"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#474d6a]">Email ID</label>
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
                placeholder="Minimum 6 characters"
                className="field !px-3.5"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#474d6a]">I am a</label>
            <div className="grid gap-2">
              {roles.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setRole(item.value)}
                  className={`rounded border p-3 text-left ${
                    role === item.value
                      ? 'border-[#457eff] bg-[#eef3ff]'
                      : 'border-[#e8e8e8] bg-white hover:border-[#ccc]'
                  }`}
                >
                  <p className="text-sm font-semibold text-[#121224]">{item.label}</p>
                  <p className="text-xs text-[#717b9e]">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-orange w-full !py-3">
            {isSubmitting ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            <span>{isSubmitting ? 'Creating account...' : 'Register for free'}</span>
          </button>
        </form>

        <div className="border-t border-[#e8e8e8] pt-4 text-center text-sm text-[#717b9e]">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-[#457eff] hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
