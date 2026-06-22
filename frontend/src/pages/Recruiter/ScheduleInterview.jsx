import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Briefcase, Calendar, Clock, Plus, User, Video } from 'lucide-react';
import { useCreateInterview } from '../../hooks/useInterviews';
import { useGetApplication } from '../../hooks/useApplications';
import { PageHeader, SectionCard } from '../../components/Common/ui';
import { toast } from '../../utils/toast';

const ScheduleInterview = () => {
  const [searchParams] = useSearchParams();
  const appId = searchParams.get('app_id');
  const navigate = useNavigate();
  const { data: application, isLoading: isAppLoading } = useGetApplication(appId);
  const createInterviewMutation = useCreateInterview();

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [meetingLink, setMeetingLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!appId) {
      toast.error('Invalid application ID.');
      return;
    }
    if (!date || !time) {
      toast.warning('Please select a valid date and time.');
      return;
    }

    try {
      await createInterviewMutation.mutateAsync({ application_id: appId, interview_date: date, interview_time: time, meeting_link: meetingLink });
      navigate('/recruiter');
    } catch (err) {
      // handled globally
    }
  };

  if (isAppLoading) {
    return <div className="surface-card flex justify-center rounded-[2rem] p-10"><div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" /></div>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 lg:px-6">
      <Link to="/recruiter" className="inline-flex items-center gap-2 text-sm text-[#717b9e] hover:text-[#457eff]"><ArrowLeft className="h-4 w-4" />Back to dashboard</Link>
      <PageHeader eyebrow="Schedule Interview" title="Book an interview" description="Set date, time, and meeting link for the candidate." />
      <SectionCard className="space-y-6">
        {application && (
          <div className="grid gap-4 rounded-[1.75rem] bg-slate-50 p-5 md:grid-cols-2">
            <div className="flex items-start gap-3"><User className="mt-1 h-5 w-5 text-blue-600" /><div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Candidate</p><p className="mt-2 text-sm font-semibold text-slate-900">{application.candidate_name}</p></div></div>
            <div className="flex items-start gap-3"><Briefcase className="mt-1 h-5 w-5 text-blue-600" /><div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Role</p><p className="mt-2 text-sm font-semibold text-slate-900">{application.job_title}</p></div></div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Interview date</label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="field !px-3.5" required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Interview time</label>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="field !px-3.5" required />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Meeting link</label>
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4 text-slate-400 shrink-0" />
              <input type="url" value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} className="field !px-3.5" placeholder="https://meet.google.com/..." />
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link to="/recruiter" className="btn-secondary">Cancel</Link>
            <button type="submit" disabled={createInterviewMutation.isPending} className="btn-primary">
              {createInterviewMutation.isPending ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Plus className="h-4 w-4" />}
              <span>{createInterviewMutation.isPending ? 'Scheduling...' : 'Schedule interview'}</span>
            </button>
          </div>
        </form>
      </SectionCard>
    </div>
  );
};

export default ScheduleInterview;

