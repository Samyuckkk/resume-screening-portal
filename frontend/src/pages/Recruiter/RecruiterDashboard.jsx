import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Calendar,
  Edit2,
  Eye,
  MessageSquare,
  Plus,
  Trash2,
  Users,
  Video,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGetJobs, useDeleteJob } from '../../hooks/useJobs';
import { useGetApplications, useUpdateApplicationStatus } from '../../hooks/useApplications';
import { useGetInterviews, useDeleteInterview, useUpdateFeedback } from '../../hooks/useInterviews';
import EmptyState from '../../components/Common/EmptyState';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import { PageHeader, SectionCard, StatCard, TabButton } from '../../components/Common/ui';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const { data: jobs, isLoading: isJobsLoading } = useGetJobs();
  const { data: applications, isLoading: isAppsLoading } = useGetApplications('recruiter', user?.id);
  const { data: interviews, isLoading: isInterviewsLoading } = useGetInterviews(user?.role);

  const deleteJobMutation = useDeleteJob();
  const deleteInterviewMutation = useDeleteInterview();
  const updateStatusMutation = useUpdateApplicationStatus();
  const updateFeedbackMutation = useUpdateFeedback();

  const [activeTab, setActiveTab] = useState('jobs');
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isJobDeleteOpen, setIsJobDeleteOpen] = useState(false);
  const [selectedInterviewId, setSelectedInterviewId] = useState(null);
  const [isInterviewDeleteOpen, setIsInterviewDeleteOpen] = useState(false);
  const [feedbackInterviewId, setFeedbackInterviewId] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const myJobs = jobs?.filter((job) => user?.role === 'admin' || job.recruiter_id === user?.id) || [];
  const myJobApplications = applications?.filter((app) => myJobs.some((job) => job.id === app.job_id)) || [];
  const myInterviews = interviews?.filter((interview) => myJobApplications.some((app) => app.id === interview.application_id)) || [];

  const handleConfirmDeleteJob = async () => {
    if (!selectedJobId) return;
    try {
      await deleteJobMutation.mutateAsync(selectedJobId);
    } catch (err) {
      // handled globally
    } finally {
      setIsJobDeleteOpen(false);
      setSelectedJobId(null);
    }
  };

  const handleConfirmDeleteInterview = async () => {
    if (!selectedInterviewId) return;
    try {
      await deleteInterviewMutation.mutateAsync(selectedInterviewId);
    } catch (err) {
      // handled globally
    } finally {
      setIsInterviewDeleteOpen(false);
      setSelectedInterviewId(null);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ id: appId, status: newStatus });
    } catch (err) {
      // handled globally
    }
  };

  const handleOpenFeedback = (interview) => {
    setFeedbackInterviewId(interview.id);
    setFeedbackText(interview.feedback || '');
    setIsFeedbackModalOpen(true);
  };

  const handleSaveFeedback = async () => {
    if (!feedbackInterviewId) return;
    try {
      await updateFeedbackMutation.mutateAsync({ id: feedbackInterviewId, feedback: feedbackText });
      setIsFeedbackModalOpen(false);
      setFeedbackInterviewId(null);
      setFeedbackText('');
    } catch (err) {
      // handled globally
    }
  };

  const statusColors = {
    Applied: 'bg-blue-50 text-blue-700',
    Shortlisted: 'bg-amber-50 text-amber-700',
    'Interview Scheduled': 'bg-violet-50 text-violet-700',
    Selected: 'bg-emerald-50 text-emerald-700',
    Rejected: 'bg-rose-50 text-rose-700',
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Recruiter studio"
        title="Manage hiring like a premium cohort experience"
        description="Publish roles, coach candidates through each stage, and keep interviews organized in a modern recruiting workspace."
        action={<Link to="/recruiter/jobs/create" className="btn-primary"><Plus className="h-4 w-4" />Post a job</Link>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={Briefcase} label="Open roles" value={myJobs.length} />
        <StatCard icon={Users} label="Applicants" value={myJobApplications.length} tone="violet" />
        <StatCard icon={Calendar} label="Interviews" value={myInterviews.length} tone="amber" />
      </div>

      <div className="flex flex-wrap gap-3">
        <TabButton active={activeTab === 'jobs'} icon={Briefcase} onClick={() => setActiveTab('jobs')}>Jobs</TabButton>
        <TabButton active={activeTab === 'candidates'} icon={Users} onClick={() => setActiveTab('candidates')}>Candidates</TabButton>
        <TabButton active={activeTab === 'interviews'} icon={Calendar} onClick={() => setActiveTab('interviews')}>Interviews</TabButton>
      </div>

      {activeTab === 'jobs' && (
        <SectionCard className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Published roles</h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">Review, edit, or remove any role without changing the underlying flow.</p>
          </div>

          {isJobsLoading ? (
            <div className="space-y-3">
              <div className="skeleton-shimmer h-28 rounded-[1.75rem]" />
              <div className="skeleton-shimmer h-28 rounded-[1.75rem]" />
            </div>
          ) : myJobs.length === 0 ? (
            <EmptyState title="No jobs posted yet" description="Create your first listing to start receiving applications." icon={Briefcase} action={<Link to="/recruiter/jobs/create" className="btn-primary"><Plus className="h-4 w-4" />Create first job</Link>} />
          ) : (
            <div className="grid gap-4">
              {myJobs.map((job) => (
                <div key={job.id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">{job.location}</p>
                      <p className="mt-3 text-sm text-slate-600">{job.salary || 'Competitive'}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link to={`/recruiter/jobs/edit/${job.id}`} className="btn-secondary"><Edit2 className="h-4 w-4" />Edit</Link>
                      <button type="button" onClick={() => { setSelectedJobId(job.id); setIsJobDeleteOpen(true); }} className="btn-danger"><Trash2 className="h-4 w-4" />Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      )}

      {activeTab === 'candidates' && (
        <SectionCard className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Candidate pipeline</h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">A responsive view of every applicant across your roles.</p>
          </div>

          {isAppsLoading ? (
            <div className="space-y-3">
              <div className="skeleton-shimmer h-32 rounded-[1.75rem]" />
            </div>
          ) : myJobApplications.length === 0 ? (
            <EmptyState title="No applicants yet" description="Applications will appear here once candidates start applying." icon={Users} />
          ) : (
            <div className="grid gap-4">
              {myJobApplications.map((app) => (
                <div key={app.id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-5">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{app.candidate_name}</h3>
                        <p className="text-sm text-slate-500">{app.candidate_email}</p>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Applied role</p>
                          <p className="mt-2 text-sm font-semibold text-slate-800">{app.job_title}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Date</p>
                          <p className="mt-2 text-sm font-semibold text-slate-800">{new Date(app.applied_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3 xl:w-72">
                      <select value={app.status} onChange={(e) => handleStatusChange(app.id, e.target.value)} className={`select-field ${statusColors[app.status] || 'bg-slate-100 text-slate-700'}`}>
                        <option value="Applied">Applied</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview Scheduled">Interview Scheduled</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                      <div className="flex flex-wrap gap-2">
                        {app.resume_url ? (
                          <Link to={`/resumes/candidate/${app.candidate_id}`} className="btn-secondary"><Eye className="h-4 w-4" />Resume</Link>
                        ) : (
                          <span className="soft-pill bg-slate-100 text-slate-600">No resume</span>
                        )}
                        <Link to={`/recruiter/interviews/schedule?app_id=${app.id}`} className="btn-primary"><Calendar className="h-4 w-4" />Schedule</Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      )}

      {activeTab === 'interviews' && (
        <SectionCard className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Scheduled interviews</h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">Manage sessions, feedback, and meeting links in one place.</p>
          </div>

          {isInterviewsLoading ? (
            <div className="space-y-3">
              <div className="skeleton-shimmer h-32 rounded-[1.75rem]" />
            </div>
          ) : myInterviews.length === 0 ? (
            <EmptyState title="No interviews set" description="Interviews will appear here once they are scheduled." icon={Calendar} />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {myInterviews.map((interview) => {
                const app = myJobApplications.find((item) => item.id === interview.application_id);
                return (
                  <div key={interview.id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{app?.candidate_name || 'Candidate'}</h3>
                        <p className="mt-1 text-sm text-slate-500">{app?.job_title || 'Role unavailable'}</p>
                      </div>
                      <span className="soft-pill bg-violet-50 text-violet-700">Scheduled</span>
                    </div>
                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                      <div>{interview.interview_date}</div>
                      <div>{interview.interview_time}</div>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {interview.meeting_link ? <a href={interview.meeting_link} target="_blank" rel="noreferrer" className="btn-secondary"><Video className="h-4 w-4" />Join link</a> : <span className="soft-pill bg-slate-100 text-slate-600">No link</span>}
                      <button type="button" onClick={() => handleOpenFeedback(interview)} className="btn-primary"><MessageSquare className="h-4 w-4" />Feedback</button>
                      <button type="button" onClick={() => { setSelectedInterviewId(interview.id); setIsInterviewDeleteOpen(true); }} className="btn-danger"><Trash2 className="h-4 w-4" />Delete</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>
      )}

      {isFeedbackModalOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={() => setIsFeedbackModalOpen(false)} />
          <div className="surface-card relative z-10 w-full max-w-lg rounded-[2rem] p-6">
            <h3 className="text-xl font-bold text-slate-900">Interview feedback</h3>
            <p className="mt-2 text-sm leading-7 text-slate-500">Capture evaluation notes without altering the existing feedback flow.</p>
            <textarea rows={5} value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} className="textarea-field mt-4" placeholder="Add notes about the session..." />
            <div className="mt-5 flex justify-end gap-3">
              <button type="button" onClick={() => setIsFeedbackModalOpen(false)} className="btn-secondary">Cancel</button>
              <button type="button" onClick={handleSaveFeedback} className="btn-primary">Save feedback</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog isOpen={isJobDeleteOpen} title="Delete job posting?" message="Any related candidate activity will no longer be visible from this listing." confirmText="Delete posting" onConfirm={handleConfirmDeleteJob} onCancel={() => setIsJobDeleteOpen(false)} type="danger" />
      <ConfirmDialog isOpen={isInterviewDeleteOpen} title="Delete interview?" message="This will permanently remove the scheduled session from the portal." confirmText="Delete interview" onConfirm={handleConfirmDeleteInterview} onCancel={() => setIsInterviewDeleteOpen(false)} type="danger" />
    </div>
  );
};

export default RecruiterDashboard;

