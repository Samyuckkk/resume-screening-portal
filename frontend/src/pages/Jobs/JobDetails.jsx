import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Bookmark, CheckCircle, FileWarning, IndianRupee, LogIn, MapPin, Send, Share2 } from 'lucide-react';
import { useGetJob } from '../../hooks/useJobs';
import { useAuth } from '../../context/AuthContext';
import { useGetCandidateResume } from '../../hooks/useResumes';
import { useApplyToJob, useGetApplications } from '../../hooks/useApplications';
import { SkeletonDetails } from '../../components/Common/Loaders';
import { SectionCard } from '../../components/Common/ui';

const formatSalary = (salary) => {
  if (!salary) return 'Not disclosed';
  const num = Number(salary);
  if (Number.isNaN(num)) return salary;
  if (num >= 100000) return `${(num / 100000).toFixed(1)} Lacs PA`;
  return `${num.toLocaleString('en-IN')} PA`;
};

const JobDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { data: job, isLoading: isJobLoading, error: jobError } = useGetJob(id);
  const { data: resume, isLoading: isResumeLoading } = useGetCandidateResume(user?.role === 'applicant' ? user.id : null);
  const { data: applications } = useGetApplications(user?.role === 'applicant' ? 'applicant' : null, user?.role === 'applicant' ? user.id : null);
  const applyMutation = useApplyToJob();

  const handleApply = async () => {
    if (!job || !user) return;
    applyMutation.mutate({ job, candidate: user, resumeUrl: resume?.file_url });
  };

  if (isJobLoading) return <div className="mx-auto max-w-5xl px-4 py-6"><SkeletonDetails /></div>;

  if (jobError || !job) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <SectionCard className="mx-auto max-w-lg text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#fdeaea] text-[#e03939]">
            <FileWarning className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-[#121224]">Job not found</h2>
          <p className="mt-2 text-sm text-[#717b9e]">This job may have been removed or is no longer available.</p>
          <Link to="/jobs" className="btn-primary mt-5 inline-flex">
            <ArrowLeft className="h-4 w-4" />
            Back to jobs
          </Link>
        </SectionCard>
      </div>
    );
  }

  const hasApplied = applications?.some((app) => app.job_id === job.id);

  const renderApplySection = () => {
    if (!isAuthenticated) {
      return (
        <div className="space-y-3 text-center">
          <p className="text-sm text-[#717b9e]">Login to apply for this job</p>
          <Link to="/login" className="btn-primary w-full">
            <LogIn className="h-4 w-4" />
            Login to Apply
          </Link>
          <p className="text-xs text-[#717b9e]">
            New user? <Link to="/register" className="font-semibold text-[#457eff]">Register for free</Link>
          </p>
        </div>
      );
    }

    if (user?.role !== 'applicant') {
      return <p className="text-sm text-[#717b9e]">Only job seekers can apply to jobs.</p>;
    }

    if (isResumeLoading) return <div className="skeleton-shimmer h-11 rounded" />;

    if (!resume) {
      return (
        <div className="space-y-3 rounded-lg border border-amber-200 bg-[#fff8e6] p-4">
          <p className="text-sm font-semibold text-[#121224]">Upload resume to apply</p>
          <p className="text-sm text-[#717b9e]">Go to My Recruvo and upload your resume first.</p>
          <Link to="/candidate" className="btn-secondary w-full">Go to My Recruvo</Link>
        </div>
      );
    }

    if (hasApplied) {
      return (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-[#edf7ed] p-4 text-[#47b749]">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span className="text-sm font-semibold">You have already applied</span>
        </div>
      );
    }

    return (
      <button type="button" onClick={handleApply} disabled={applyMutation.isPending} className="btn-primary w-full !py-3">
        {applyMutation.isPending ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        <span>{applyMutation.isPending ? 'Applying...' : 'Apply on company site'}</span>
      </button>
    );
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 lg:px-6">
      <Link to="/jobs" className="mb-4 inline-flex items-center gap-1.5 text-sm text-[#717b9e] hover:text-[#457eff]">
        <ArrowLeft className="h-4 w-4" />
        Back to jobs
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <SectionCard>
            <div className="flex gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded border border-[#e8e8e8] bg-[#eef3ff] text-xl font-bold text-[#457eff]">
                {job.title.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#121224] md:text-2xl">{job.title}</h1>
                <p className="mt-1 text-sm text-[#717b9e]">Company · Posted recently</p>
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-[#474d6a]">
                  {job.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-[#717b9e]" />
                      {job.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <IndianRupee className="h-4 w-4 text-[#717b9e]" />
                    {formatSalary(job.salary)}
                  </span>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard className="space-y-4">
            <h2 className="text-lg font-semibold text-[#121224]">Job description</h2>
            <div className="whitespace-pre-line text-sm leading-7 text-[#474d6a]">{job.description}</div>
          </SectionCard>

          <SectionCard className="space-y-3">
            <h2 className="text-lg font-semibold text-[#121224]">About the company</h2>
            <p className="text-sm leading-relaxed text-[#717b9e]">
              We are a growing organization looking for talented professionals to join our team.
              Apply now to be part of an exciting opportunity.
            </p>
          </SectionCard>
        </div>

        <div className="space-y-4">
          <SectionCard className="sticky top-[72px] space-y-4">
            {renderApplySection()}
            <div className="flex gap-2">
              <button type="button" className="btn-secondary flex-1 !py-2">
                <Bookmark className="h-4 w-4" />
                Save
              </button>
              <button type="button" className="btn-secondary flex-1 !py-2">
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
