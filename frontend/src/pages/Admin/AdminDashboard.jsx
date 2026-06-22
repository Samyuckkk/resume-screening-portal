import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Calendar, FileText, Search, Server, Shield, Users } from 'lucide-react';
import { useGetJobs } from '../../hooks/useJobs';
import { useGetApplications } from '../../hooks/useApplications';
import { useGetInterviews } from '../../hooks/useInterviews';
import { PageHeader, SectionCard, StatCard } from '../../components/Common/ui';

const AdminDashboard = () => {
  const { data: jobs, isLoading: isJobsLoading } = useGetJobs();
  const { data: applications, isLoading: isAppsLoading } = useGetApplications('admin');
  const { data: interviews, isLoading: isInterviewsLoading } = useGetInterviews('admin');

  const [userSearch, setUserSearch] = useState('');
  const mockUsers = [
    { id: 1, name: 'Alice applicant', email: 'candidate@screeningportal.com', role: 'applicant', status: 'active' },
    { id: 2, name: 'Bob recruiter', email: 'recruiter@screeningportal.com', role: 'recruiter', status: 'active' },
    { id: 3, name: 'System Admin', email: 'admin@screeningportal.com', role: 'admin', status: 'active' },
    { id: 4, name: 'Charlie Dev', email: 'charlie@company.com', role: 'applicant', status: 'active' },
    { id: 5, name: 'Diana Hr', email: 'diana@talent.com', role: 'recruiter', status: 'inactive' },
  ];

  const filteredUsers = mockUsers.filter((user) =>
    user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  const roleStyles = {
    applicant: 'bg-blue-50 text-blue-700',
    recruiter: 'bg-violet-50 text-violet-700',
    admin: 'bg-rose-50 text-rose-700',
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 lg:px-6">
      <PageHeader eyebrow="Admin" title="Platform overview" description="Monitor jobs, applications, interviews, and resume parsing activity." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Briefcase} label="Jobs" value={isJobsLoading ? '...' : jobs?.length || 0} />
        <StatCard icon={Users} label="Applications" value={isAppsLoading ? '...' : applications?.length || 0} tone="violet" />
        <StatCard icon={Calendar} label="Interviews" value={isInterviewsLoading ? '...' : interviews?.length || 0} tone="amber" />
        <StatCard icon={Server} label="Server status" value="Online" tone="emerald" hint="All systems responding" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard className="space-y-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">User directory</h2>
              <p className="mt-2 text-sm leading-7 text-slate-500">Search the mock operational roster used by the current admin surface.</p>
            </div>
            <div className="relative w-full md:max-w-xs flex items-center gap-2">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <input value={userSearch} onChange={(e) => setUserSearch(e.target.value)} className="field !px-3.5" placeholder="Search users..." />
            </div>
          </div>
          <div className="grid gap-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{user.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{user.email}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`soft-pill ${roleStyles[user.role] || 'bg-slate-100 text-slate-700'}`}>{user.role}</span>
                    <span className={`soft-pill ${user.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{user.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Quick admin actions</h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">Jump into the most important tools without changing any logic underneath.</p>
          </div>
          <Link to="/admin/parser" className="flex items-center justify-between rounded-[1.75rem] bg-slate-50 p-5 hover:bg-white"><div className="flex items-center gap-3"><div className="rounded-2xl bg-rose-50 p-3 text-rose-600"><FileText className="h-5 w-5" /></div><div><p className="font-semibold text-slate-900">Resume parser studio</p><p className="text-sm text-slate-500">Trigger AI parsing and inspect results.</p></div></div></Link>
          <Link to="/jobs" className="flex items-center justify-between rounded-[1.75rem] bg-slate-50 p-5 hover:bg-white"><div className="flex items-center gap-3"><div className="rounded-2xl bg-blue-50 p-3 text-blue-600"><Briefcase className="h-5 w-5" /></div><div><p className="font-semibold text-slate-900">Career catalog</p><p className="text-sm text-slate-500">Review the public-facing jobs experience.</p></div></div></Link>
        </SectionCard>
      </div>
    </div>
  );
};

export default AdminDashboard;

