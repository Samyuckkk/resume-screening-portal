import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Key, Lock, Mail, Shield, Trash2, User } from 'lucide-react';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import { SectionCard, PageHeader, InfoPair } from '../../components/Common/ui';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../../utils/toast';

const Profile = () => {
  const { user, changePassword, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
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
      // handled globally
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
      // handled globally
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
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 lg:px-6">
      <PageHeader
        eyebrow="Profile"
        title="Account settings"
        description="Manage your profile, update password, and account preferences."
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard className="space-y-6">
          <div className="rounded-lg bg-gradient-to-r from-[#457eff] to-[#5b8fff] p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-2xl font-bold uppercase">
                {user?.name?.charAt(0)}
              </div>
              <div>
                <p className="text-xl font-bold">{user?.name}</p>
                <p className="mt-1 text-sm text-white/80">{roleLabels[user?.role] || user?.role}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 rounded-lg bg-[#f8f9fa] p-5">
            <div className="flex items-start gap-3">
              <User className="mt-1 h-5 w-5 text-blue-600" />
              <InfoPair label="Full name" value={user?.name} />
            </div>
            <div className="flex items-start gap-3">
              <Mail className="mt-1 h-5 w-5 text-blue-600" />
              <InfoPair label="Email address" value={user?.email} />
            </div>
            <div className="flex items-start gap-3">
              <Award className="mt-1 h-5 w-5 text-blue-600" />
              <InfoPair label="Account role" value={roleLabels[user?.role] || user?.role} />
            </div>
          </div>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
                <Key className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Update password</h2>
                <p className="text-sm text-slate-500">Rotate your credentials without affecting any existing access rules.</p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Current password</label>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-slate-400 shrink-0" />
                  <input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="field !px-3.5" placeholder="Current password" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">New password</label>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-slate-400 shrink-0" />
                  <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="field !px-3.5" placeholder="At least 6 characters" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Confirm password</label>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-slate-400 shrink-0" />
                  <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="field !px-3.5" placeholder="Repeat new password" />
                </div>
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button type="submit" disabled={isChangingPassword} className="btn-primary min-w-44">
                  {isChangingPassword ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Shield className="h-4 w-4" />}
                  <span>{isChangingPassword ? 'Updating...' : 'Update password'}</span>
                </button>
              </div>
            </form>
          </SectionCard>

          <SectionCard className="space-y-4 border-rose-100 bg-rose-50/50">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-rose-100 p-3 text-rose-600">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Danger zone</h2>
                <p className="text-sm text-slate-500">Deleting your account removes jobs, resumes, interviews, and activity linked to it.</p>
              </div>
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={() => setIsDeleteModalOpen(true)} disabled={isDeleting} className="btn-danger">
                {isDeleting ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Trash2 className="h-4 w-4" />}
                <span>{isDeleting ? 'Deleting...' : 'Delete my account'}</span>
              </button>
            </div>
          </SectionCard>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        title="Delete account permanently?"
        message="This will erase your credentials, profile, resume data, and associated activity across the portal."
        confirmText="Yes, delete account"
        cancelText="Keep my account"
        type="danger"
        onConfirm={handleDeleteAccount}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default Profile;

