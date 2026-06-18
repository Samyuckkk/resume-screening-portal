import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetJobs } from '../../hooks/useJobs';
import { useGetApplications } from '../../hooks/useApplications';
import { useGetInterviews } from '../../hooks/useInterviews';
import { SkeletonTable } from '../../components/Common/Loaders';
import EmptyState from '../../components/Common/EmptyState';
import {
  Shield,
  Briefcase,
  Users,
  Calendar,
  FileText,
  Settings,
  Server,
  UserCheck,
  Search,
} from 'lucide-react';

const AdminDashboard = () => {
  // Queries
  const { data: jobs, isLoading: isJobsLoading } = useGetJobs();
  const { data: applications, isLoading: isAppsLoading } = useGetApplications('admin');
  const { data: interviews, isLoading: isInterviewsLoading } = useGetInterviews('admin');

  // Mock User List for User Management UI
  const [userSearch, setUserSearch] = useState('');
  const mockUsers = [
    { id: 1, name: 'Alice applicant', email: 'candidate@screeningportal.com', role: 'applicant', status: 'active' },
    { id: 2, name: 'Bob recruiter', email: 'recruiter@screeningportal.com', role: 'recruiter', status: 'active' },
    { id: 3, name: 'System Admin', email: 'admin@screeningportal.com', role: 'admin', status: 'active' },
    { id: 4, name: 'Charlie Dev', email: 'charlie@company.com', role: 'applicant', status: 'active' },
    { id: 5, name: 'Diana Hr', email: 'diana@talent.com', role: 'recruiter', status: 'inactive' },
  ];

  const filteredUsers = mockUsers.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  // Stats calculation
  const totalJobs = jobs?.length || 0;
  const totalApplicants = applications?.length || 0;
  const totalInterviews = interviews?.length || 0;

  const roleStyles = {
    applicant: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-450 border-blue-200/50',
    recruiter: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-405 border-purple-200/50',
    admin: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-405 border-rose-200/50',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
          System Overview
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Perform administrative checks, verify portal integrity, and manage users.
        </p>
      </div>

      {/* Grid of Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Jobs Card */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-blue-650 dark:text-blue-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Job Postings</span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{isJobsLoading ? '...' : totalJobs}</span>
          </div>
        </div>

        {/* Applications Card */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-650 dark:text-indigo-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Applications</span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{isAppsLoading ? '...' : totalApplicants}</span>
          </div>
        </div>

        {/* Interviews Card */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl text-amber-650 dark:text-amber-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Interviews Scheduled</span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{isInterviewsLoading ? '...' : totalInterviews}</span>
          </div>
        </div>

        {/* System Health Card */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-650 dark:text-emerald-400">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Server Status</span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
              <span>Online</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Admin UI Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Management Section */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-850">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-rose-500" />
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-250">User Account Database</h2>
            </div>
            {/* Search */}
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/25 outline-none text-xs focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-405 font-bold uppercase">
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-850">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                    <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-250">{u.name}</td>
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400">{u.email}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full font-bold border capitalize ${roleStyles[u.role]}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className={`inline-flex items-center gap-1 font-semibold ${u.status === 'active' ? 'text-emerald-555' : 'text-slate-400'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                        <span className="capitalize">{u.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shortcuts Widget */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 h-fit">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-850">
            <h3 className="font-bold text-slate-800 dark:text-slate-250">Quick Admin Utilities</h3>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              to="/admin/parser"
              className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-rose-300 dark:border-slate-800 dark:hover:border-rose-900/50 bg-slate-50/50 dark:bg-slate-950/20 hover:bg-rose-50/10 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-50 dark:bg-rose-950/40 rounded-lg text-rose-500 group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-250">Resume Parser Console</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Parse user PDFs into skill indices.</p>
                </div>
              </div>
            </Link>

            <Link
              to="/jobs"
              className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-300 dark:border-slate-800 dark:hover:border-blue-900/50 bg-slate-50/50 dark:bg-slate-950/20 hover:bg-blue-50/10 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-lg text-blue-500 group-hover:scale-105 transition-transform">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-250">Monitor Job Board</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Edit or override job listings.</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
