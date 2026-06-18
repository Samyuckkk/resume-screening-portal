import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import { Shield, Key, Trash2, User, Mail, Award, Lock } from 'lucide-react';
import { toast } from '../../utils/toast';

const Profile = () => {
  const { user, changePassword, deleteAccount } = useAuth();
  const navigate = useNavigate();

  // State for change password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // State for delete account dialog
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.warning('Please fill in all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.warning('New password and password confirmation do not match.');
      return;
    }
    if (newPassword.length < 6) {
      toast.warning('New password must be at least 6 characters.');
      return;
    }

    setIsChangingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      // Axios interceptor shows error detail
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleteModalOpen(false);
    setIsDeleting(true);
    try {
      await deleteAccount();
      navigate('/login');
    } catch (err) {
      // Handled globally
    } finally {
      setIsDeleting(false);
    }
  };

  const roleLabels = {
    applicant: 'Candidate / Applicant',
    recruiter: 'Recruiter / Hiring Manager',
    admin: 'System Administrator',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          Account Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal details, change security passwords, or manage your account status.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* User Card info */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 text-white font-extrabold text-3xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4 select-none">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">{user?.name}</h3>
            <span className="mt-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-850/50 capitalize">
              {user?.role}
            </span>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-850">
            <div className="flex items-center gap-3 text-sm">
              <User className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</p>
                <p className="font-semibold text-slate-700 dark:text-slate-350">{user?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                <p className="font-semibold text-slate-700 dark:text-slate-350">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <Award className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Role</p>
                <p className="font-semibold text-slate-700 dark:text-slate-350">{roleLabels[user?.role] || user?.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password & Delete Account */}
        <div className="lg:col-span-2 space-y-6">
          {/* Change Password Card */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-850">
              <Key className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-250">Update Password</h2>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-455 uppercase tracking-wider">Current Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="Current Password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>
                <div className="hidden md:block"></div>
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-455 uppercase tracking-wider">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="At least 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-455 uppercase tracking-wider">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-500 hover:bg-indigo-650 disabled:bg-indigo-400 text-white font-bold rounded-xl text-sm transition-all shadow-md focus:outline-none"
                >
                  {isChangingPassword ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span>Update Password</span>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Delete Account Card */}
          <div className="p-6 rounded-2xl border border-rose-200 dark:border-rose-950/20 bg-rose-50/20 dark:bg-rose-950/5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-rose-100 dark:border-rose-950/25">
              <Trash2 className="w-5 h-5 text-rose-500" />
              <h2 className="text-lg font-bold text-rose-600 dark:text-rose-400">Danger Zone</h2>
            </div>
            
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Once you delete your account, all data including your posted jobs, resumes, scheduling, and interview feedback will be permanently removed. This action cannot be undone.
            </p>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-rose-650 hover:bg-rose-700 disabled:bg-rose-400 text-white font-bold rounded-xl text-sm transition-colors shadow-sm focus:outline-none"
              >
                {isDeleting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>Delete My Account</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        title="Delete Account permanently?"
        message="Are you absolutely sure you want to delete your screening account? This will erase your credentials, resume details, applications, and all associated portal records."
        confirmText="Yes, Delete Permanently"
        cancelText="No, Keep Account"
        type="danger"
        onConfirm={handleDeleteAccount}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default Profile;
