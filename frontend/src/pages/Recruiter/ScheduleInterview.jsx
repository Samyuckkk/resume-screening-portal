import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useCreateInterview } from '../../hooks/useInterviews';
import { useGetApplication } from '../../hooks/useApplications';
import { ArrowLeft, Calendar, Clock, Video, User, Briefcase, Plus } from 'lucide-react';
import { toast } from '../../utils/toast';

const ScheduleInterview = () => {
  const [searchParams] = useSearchParams();
  const appId = searchParams.get('app_id');
  const navigate = useNavigate();

  // Queries/Mutations
  const { data: application, isLoading: isAppLoading } = useGetApplication(appId);
  const createInterviewMutation = useCreateInterview();

  // Form State
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
      await createInterviewMutation.mutateAsync({
        application_id: appId,
        interview_date: date,
        interview_time: time,
        meeting_link: meetingLink,
      });
      navigate('/recruiter');
    } catch (err) {
      // Handled globally
    }
  };

  if (isAppLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Back link */}
      <div>
        <Link
          to="/recruiter"
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Form Card */}
      <div className="p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Schedule Interview</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Book a screening evaluation and generate a video link for the applicant.
          </p>
        </div>

        {/* Selected Candidate Metadata */}
        {application && (
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800/50 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-500 flex-shrink-0" />
              <div>
                <span className="text-xs font-medium text-slate-400 block">Candidate</span>
                <span className="font-bold text-slate-750 dark:text-slate-200">{application.candidate_name}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-500 flex-shrink-0" />
              <div>
                <span className="text-xs font-medium text-slate-400 block">Target Position</span>
                <span className="font-bold text-slate-750 dark:text-slate-200">{application.job_title}</span>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Interview Date</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-205 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm text-slate-805 dark:text-slate-200 outline-none"
              />
            </div>

            {/* Time */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Interview Time</span>
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-205 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm text-slate-805 dark:text-slate-200 outline-none"
              />
            </div>
          </div>

          {/* Meeting Link */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Video className="w-4 h-4 text-slate-400" />
              <span>Meeting Link (Zoom / Google Meet)</span>
            </label>
            <input
              type="url"
              placeholder="https://meet.google.com/abc-defg-hij"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-205 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm text-slate-805 dark:text-slate-200 outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="pt-4 flex justify-end gap-3">
            <Link
              to="/recruiter"
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 text-sm font-semibold transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={createInterviewMutation.isPending}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-400 text-white font-bold rounded-xl text-sm transition-all shadow-md focus:outline-none"
            >
              {createInterviewMutation.isPending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Schedule Interview</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleInterview;
