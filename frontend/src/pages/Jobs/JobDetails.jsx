import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, DollarSign, FileWarning, LogIn, MapPin, Send } from 'lucide-react';
import { useGetJob } from '../../hooks/useJobs';
import { useAuth } from '../../context/AuthContext';
import { useGetCandidateResume } from '../../hooks/useResumes';
import { useApplyToJob, useGetApplications } from '../../hooks/useApplications';
import { SkeletonDetails } from '../../components/Common/Loaders';
import { PageHeader, SectionCard } from '../../components/Common/ui';

const JobDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { data: job, isLoading: isJobLoading, error: jobError } = useGetJob(id);
  const { data: resume, isLoading: isResumeLoading } = useGetCandidateResume(user?.role === 'applicant' ? user.id : null);
  const { data: applications } = useGetApplications(user?.role === 'applicant' ? 'applicant' : null, user?.role === 'applicant' ? user.id : null);
  const applyMutation = useApplyToJob();

  const handleApply = async () => {
    if (!job || !user) return;
    applyMutation.mutate({
      job,
      candidate: user,
      resumeUrl: resume?.file_url,
    });
  };

  if (isJobLoading) return <SkeletonDetails />;

  if (jobError || !job) {
    return (
      <SectionCard className="mx-auto max-w-2xl text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-rose-50 text-rose-600">
          <FileWarning className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Job not found</h2>
        <p className="mt-3 text-sm leading-7 text-slate-500">The role you are trying to view no longer exists or is unavailable.</p>
        <Link to="/jobs" className="btn-primary mt-6">
          <ArrowLeft className="h-4 w-4" />
          Back to roles
        </Link>
      </SectionCard>
    );
  }

  const hasApplied = applications?.some((app) => app.job_id === job.id);

  const renderActionSection = () => {
    if (!isAuthenticated) {
      return (
        <div className="space-y-4 rounded-[1.75rem] bg-slate-50 p-5 text-center">
          <p className="text-sm leading-7 text-slate-500">Sign in with a candidate account to submit your application.</p>
          <Link to="/login" className="btn-primary w-full">
            <LogIn className="h-4 w-4" />
            Login to apply
          </Link>
        </div>
      );
    }

    if (user?.role !== 'applicant') {
      return <div className="rounded-[1.75rem] bg-slate-50 p-5 text-sm leading-7 text-slate-500">Applications can only be submitted from candidate accounts.</div>;
    }

    if (isResumeLoading) {
      return <div className="skeleton-shimmer h-14 rounded-2xl" />;
    }

    if (!resume) {
      return (
        <div className="space-y-4 rounded-[1.75rem] border border-amber-100 bg-amber-50/70 p-5">
          <p className="text-sm font-semibold text-slate-800">Resume required before applying</p>
          <p className="text-sm leading-7 text-slate-500">Upload your resume from the candidate dashboard so the application can include your profile.</p>
          <Link to="/candidate" className="btn-secondary w-full">
            Go to candidate dashboard
          </Link>
        </div>
      );
    }

    if (hasApplied) {
      return (
        <div className="flex items-center gap-3 rounded-[1.75rem] border border-emerald-100 bg-emerald-50/80 p-5 text-emerald-700">
          <CheckCircle className="h-5 w-5" />
          <span className="text-sm font-semibold">Application already submitted</span>
        </div>
      );
    }

    return (
      <button type="button" onClick={handleApply} disabled={applyMutation.isPending} className="btn-primary w-full">
        {applyMutation.isPending ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Send className="h-4 w-4" />}
        <span>{applyMutation.isPending ? 'Submitting application...' : 'Apply for this role'}</span>
      </button>
    );
  };

  return (
    <div className="space-y-6">
      <Link to="/jobs" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800">
        <ArrowLeft className="h-4 w-4" />
        Back to roles
      </Link>

      <PageHeader eyebrow="Role overview" title={job.title} description="Review the opportunity, confirm your fit, and apply without leaving the guided career experience." />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <SectionCard className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.75rem] bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-slate-500">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">Location</span>
              </div>
              <p className="mt-3 text-base font-semibold text-slate-900">{job.location}</p>
            </div>
            <div className="rounded-[1.75rem] bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-slate-500">
                <DollarSign className="h-4 w-4 text-blue-500" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">Salary</span>
              </div>
              <p className="mt-3 text-base font-semibold text-slate-900">{job.salary || 'Competitive'}</p>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">What you’ll work on</h2>
            <div className="mt-4 whitespace-pre-line text-sm leading-8 text-slate-600">{job.description}</div>
          </div>
        </SectionCard>

        <SectionCard className="h-fit space-y-5">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Application panel</h3>
            <p className="mt-2 text-sm leading-7 text-slate-500">Submit once your resume is ready and keep the existing workflow exactly intact.</p>
          </div>
          {renderActionSection()}
        </SectionCard>
      </div>
    </div>
  );
};

export default JobDetails;

