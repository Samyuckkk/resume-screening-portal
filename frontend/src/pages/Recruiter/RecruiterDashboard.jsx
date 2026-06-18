import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGetJobs, useDeleteJob } from '../../hooks/useJobs';
import { useGetApplications, useUpdateApplicationStatus } from '../../hooks/useApplications';
import { useGetInterviews, useDeleteInterview, useUpdateFeedback } from '../../hooks/useInterviews';
import { SkeletonTable } from '../../components/Common/Loaders';
import EmptyState from '../../components/Common/EmptyState';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import {
  Briefcase,
  Users,
  Calendar,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  MessageSquare,
  ClipboardList,
  Eye,
  CheckCircle,
  Video,
} from 'lucide-react';
import { toast } from '../../utils/toast';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Queries
  const { data: jobs, isLoading: isJobsLoading } = useGetJobs();
  const { data: applications, isLoading: isAppsLoading } = useGetApplications('recruiter', user?.id);
  const { data: interviews, isLoading: isInterviewsLoading } = useGetInterviews(user?.role);

  // Mutations
  const deleteJobMutation = useDeleteJob();
  const deleteInterviewMutation = useDeleteInterview();
  const updateStatusMutation = useUpdateApplicationStatus();
  const updateFeedbackMutation = useUpdateFeedback();

  // Component States
  const [activeTab, setActiveTab] = useState('jobs');
  
  // Job Delete States
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isJobDeleteOpen, setIsJobDeleteOpen] = useState(false);

  // Interview Delete States
  const [selectedInterviewId, setSelectedInterviewId] = useState(null);
  const [isInterviewDeleteOpen, setIsInterviewDeleteOpen] = useState(false);

  // Feedback states
  const [feedbackInterviewId, setFeedbackInterviewId] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // Filter recruiter specific items (Admins see all)
  const myJobs = jobs?.filter((job) => user?.role === 'admin' || job.recruiter_id === user?.id) || [];
  
  // Filter candidate applications applying to my jobs
  const myJobApplications = applications?.filter((app) => 
    myJobs.some((job) => job.id === app.job_id)
  ) || [];

  // Filter interviews scheduled by me or for my jobs
  const myInterviews = interviews?.filter((interview) => 
    myJobApplications.some((app) => app.id === interview.application_id)
  ) || [];

  const handleConfirmDeleteJob = async () => {
    if (!selectedJobId) return;
    try {
      await deleteJobMutation.mutateAsync(selectedJobId);
    } catch (err) {
      // Handled globally
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
      // Handled globally
    } finally {
      setIsInterviewDeleteOpen(false);
      setSelectedInterviewId(null);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ id: appId, status: newStatus });
    } catch (e) {
      // Handled globally
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
      await updateFeedbackMutation.mutateAsync({
        id: feedbackInterviewId,
        feedback: feedbackText,
      });
      setIsFeedbackModalOpen(false);
      setFeedbackInterviewId(null);
      setFeedbackText('');
    } catch (err) {
      // Handled globally
    }
  };

  // Status badge styling
  const statusColors = {
    'Applied': 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200/50',
    'Shortlisted': 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/50',
    'Interview Scheduled': 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-200/50',
    'Selected': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/50',
    'Rejected': 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200/50',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">
            Recruiting Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage job postings, parse applicant submissions, and schedule virtual evaluations.
          </p>
        </div>

        <Link
          to="/recruiter/jobs/create"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-indigo-500/15"
        >
          <Plus className="w-4 h-4" />
          <span>Post a Job</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 select-none">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-semibold text-sm transition-colors ${
            activeTab === 'jobs'
              ? 'border-indigo-500 text-indigo-650 dark:text-indigo-400'
              : 'border-transparent text-slate-550 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-205'
          }`}
        >
          <Briefcase className="w-4.5 h-4.5" />
          <span>Jobs Posted ({myJobs.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('candidates')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-semibold text-sm transition-colors ${
            activeTab === 'candidates'
              ? 'border-indigo-500 text-indigo-650 dark:text-indigo-400'
              : 'border-transparent text-slate-550 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-205'
          }`}
        >
          <Users className="w-4.5 h-4.5" />
          <span>Candidate Tracking ({myJobApplications.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('interviews')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-semibold text-sm transition-colors ${
            activeTab === 'interviews'
              ? 'border-indigo-500 text-indigo-650 dark:text-indigo-400'
              : 'border-transparent text-slate-550 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-205'
          }`}
        >
          <Calendar className="w-4.5 h-4.5" />
          <span>Interviews Scheduled ({myInterviews.length})</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div>
        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Active Job Positions</h2>

            {isJobsLoading ? (
              <SkeletonTable cols={4} rows={4} />
            ) : myJobs.length === 0 ? (
              <EmptyState
                title="No Jobs Posted Yet"
                description="Create a listing to receive resume submissions and screen candidates."
                icon={Briefcase}
                action={
                  <Link
                    to="/recruiter/jobs/create"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/10"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create First Job</span>
                  </Link>
                }
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-850 text-xs font-bold text-slate-400 uppercase">
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Salary</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-850 text-sm">
                    {myJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-slate-55/40 dark:hover:bg-slate-900/40 transition-colors">
                        <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-200">
                          {job.title}
                        </td>
                        <td className="py-4 px-4 text-slate-500 dark:text-slate-400">{job.location}</td>
                        <td className="py-4 px-4 text-slate-500 dark:text-slate-400">{job.salary || 'Competitive'}</td>
                        <td className="py-4 px-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <Link
                              to={`/recruiter/jobs/edit/${job.id}`}
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-500 dark:text-slate-450 transition-colors"
                              title="Edit Job"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              onClick={() => {
                                setSelectedJobId(job.id);
                                setIsJobDeleteOpen(true);
                              }}
                              className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/30 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-455 transition-colors"
                              title="Delete Job"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Candidates Tab */}
        {activeTab === 'candidates' && (
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Applicant Pipelines</h2>

            {isAppsLoading ? (
              <SkeletonTable cols={5} rows={4} />
            ) : myJobApplications.length === 0 ? (
              <EmptyState
                title="No Applicants Yet"
                description="Applicants will appear here once they apply to your jobs. Make sure your listings are active!"
                icon={Users}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-850 text-xs font-bold text-slate-400 uppercase">
                      <th className="py-3 px-4">Candidate</th>
                      <th className="py-3 px-4">Job Applied</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Pipeline Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-850 text-sm">
                    {myJobApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-55/40 dark:hover:bg-slate-900/40 transition-colors">
                        <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-200">
                          {app.candidate_name}
                          <span className="block text-xs font-medium text-slate-400 mt-0.5">{app.candidate_email}</span>
                        </td>
                        <td className="py-4 px-4 text-slate-700 dark:text-slate-300 font-semibold">{app.job_title}</td>
                        <td className="py-4 px-4 text-slate-500 dark:text-slate-400">
                          {new Date(app.applied_date).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app.id, e.target.value)}
                            className={`px-2 py-1 rounded-full text-xs font-bold border outline-none bg-white dark:bg-slate-900 cursor-pointer ${statusColors[app.status] || 'bg-slate-100 border-slate-200 text-slate-650'}`}
                          >
                            <option value="Applied">Applied</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Interview Scheduled">Interview Scheduled</option>
                            <option value="Selected">Selected</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            {app.resume_url ? (
                              <Link
                                to={`/resumes/candidate/${app.candidate_id}`}
                                className="p-1.5 rounded-lg border border-indigo-200 dark:border-indigo-900/30 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 transition-colors flex items-center gap-1 text-xs font-bold"
                                title="View Candidate Profile & Resume"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Resume</span>
                              </Link>
                            ) : (
                              <span className="text-xs text-slate-400 italic">No Resume</span>
                            )}
                            
                            <Link
                              to={`/recruiter/interviews/schedule?app_id=${app.id}`}
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-55 dark:hover:bg-slate-850 text-slate-500 dark:text-slate-450 transition-colors flex items-center gap-1 text-xs font-bold"
                              title="Schedule Interview"
                            >
                              <Calendar className="w-3.5 h-3.5" />
                              <span>Schedule</span>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Interviews Tab */}
        {activeTab === 'interviews' && (
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Scheduled Technical Evaluations</h2>

            {isInterviewsLoading ? (
              <SkeletonTable cols={5} rows={4} />
            ) : myInterviews.length === 0 ? (
              <EmptyState
                title="No Interviews Set"
                description="Interviews will show up here once scheduled for active candidates."
                icon={Calendar}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-850 text-xs font-bold text-slate-400 uppercase">
                      <th className="py-3 px-4">Candidate</th>
                      <th className="py-3 px-4">Job</th>
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4">Meeting URL</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-850 text-sm">
                    {myInterviews.map((interview) => {
                      const app = myJobApplications.find((a) => a.id === interview.application_id);
                      return (
                        <tr key={interview.id} className="hover:bg-slate-55/40 dark:hover:bg-slate-900/40 transition-colors">
                          <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-200">
                            {app?.candidate_name || 'Candidate'}
                          </td>
                          <td className="py-4 px-4 text-slate-700 dark:text-slate-300 font-semibold">{app?.job_title || 'N/A'}</td>
                          <td className="py-4 px-4 text-slate-500 dark:text-slate-400">
                            <span className="block font-medium">{interview.interview_date}</span>
                            <span className="block text-xs mt-0.5">{interview.interview_time}</span>
                          </td>
                          <td className="py-4 px-4">
                            {interview.meeting_link ? (
                              <a
                                href={interview.meeting_link}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-600 font-bold"
                              >
                                <Video className="w-3.5 h-3.5" />
                                <span>Join Link</span>
                              </a>
                            ) : (
                              <span className="text-xs text-slate-400 italic">No link</span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => handleOpenFeedback(interview)}
                                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-500 dark:text-slate-400 transition-colors flex items-center gap-1 text-xs font-bold"
                                title="Update Interview Feedback"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>Feedback</span>
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedInterviewId(interview.id);
                                  setIsInterviewDeleteOpen(true);
                                }}
                                className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/30 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-455 transition-colors"
                                title="Cancel/Delete Interview"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Feedback Update Modal */}
      {isFeedbackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs" onClick={() => setIsFeedbackModalOpen(false)} />
          <div className="relative w-full max-w-md p-6 rounded-2xl glass border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl z-10">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-indigo-500" />
              <span>Hiring Feedback</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">Provide details about technical aptitude, soft skills, or grading decision.</p>
            <textarea
              rows={4}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Candidate demonstrated strong knowledge of coding schemas..."
              className="w-full p-3 text-sm rounded-xl border border-slate-205 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 dark:text-slate-200 outline-none"
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setIsFeedbackModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-650 dark:text-slate-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveFeedback}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white transition-all shadow-md"
              >
                Save Feedback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={isJobDeleteOpen}
        title="Delete Job Posting?"
        message="Are you sure you want to delete this job listing? Any candidates in screening will no longer be visible."
        confirmText="Delete Posting"
        onConfirm={handleConfirmDeleteJob}
        onCancel={() => setIsJobDeleteOpen(false)}
        type="danger"
      />

      <ConfirmDialog
        isOpen={isInterviewDeleteOpen}
        title="Cancel Interview?"
        message="Are you sure you want to cancel and delete this scheduled interview? This action is permanent."
        confirmText="Cancel Interview"
        onConfirm={handleConfirmDeleteInterview}
        onCancel={() => setIsInterviewDeleteOpen(false)}
        type="danger"
      />
    </div>
  );
};

export default RecruiterDashboard;
