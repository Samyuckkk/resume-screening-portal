import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGetJob } from '../../hooks/useJobs';
import { useAuth } from '../../context/AuthContext';
import { useGetCandidateResume } from '../../hooks/useResumes';
import { useApplyToJob, useGetApplications } from '../../hooks/useApplications';
import { SkeletonDetails } from '../../components/Common/Loaders';
import { MapPin, DollarSign, ArrowLeft, Send, CheckCircle, FileWarning, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Queries
  const { data: job, isLoading: isJobLoading, error: jobError } = useGetJob(id);
  const { data: resume, isLoading: isResumeLoading } = useGetCandidateResume(
    user?.role === 'applicant' ? user.id : null
  );
  const { data: applications } = useGetApplications(
    user?.role === 'applicant' ? 'applicant' : null,
    user?.role === 'applicant' ? user.id : null
  );

  // Mutation
  const applyMutation = useApplyToJob();

  const handleApply = async () => {
    if (!job || !user) return;
    applyMutation.mutate({
      job,
      candidate: user,
      resumeUrl: resume?.file_url,
    });
  };

  if (isJobLoading) {
    return <SkeletonDetails />;
  }

  if (jobError || !job) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-full mb-4">
          <FileWarning className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Job Not Found</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">The career posting you are looking for does not exist.</p>
        <Link
          to="/jobs"
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Jobs</span>
        </Link>
      </div>
    );
  }

  // Check if candidate has already applied to this specific job
  const hasApplied = applications?.some((app) => app.job_id === job.id);

  // Render applying options
  const renderActionSection = () => {
    if (!isAuthenticated) {
      return (
        <div className="p-6 rounded-2xl border border-slate-250 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 flex flex-col items-center text-center gap-4">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Sign in to your candidate account to submit an application.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-indigo-500/10 w-full sm:w-auto"
          >
            <LogIn className="w-4 h-4" />
            <span>Login to Apply</span>
          </Link>
        </div>
      );
    }

    if (user?.role !== 'applicant') {
      return (
        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/40 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Logged in as <span className="font-bold capitalize">{user.role}</span>. Applications are restricted to candidate accounts.
          </p>
        </div>
      );
    }

    if (isResumeLoading) {
      return (
        <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse w-full max-w-xs mx-auto"></div>
      );
    }

    // Candidate has no resume uploaded yet
    if (!resume) {
      return (
        <div className="p-6 rounded-2xl border border-dashed border-amber-300 dark:border-amber-800 bg-amber-50/20 dark:bg-amber-950/10 flex flex-col items-center text-center gap-4">
          <div className="text-amber-600 dark:text-amber-400">
            <FileWarning className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Resume Required</h4>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
              You must upload your PDF resume in the dashboard before applying for this job.
            </p>
          </div>
          <Link
            to="/candidate"
            className="inline-flex items-center justify-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
          >
            Go to Resume Upload
          </Link>
        </div>
      );
    }

    if (hasApplied) {
      return (
        <div className="flex items-center justify-center gap-2 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-800/30 text-emerald-700 dark:text-emerald-400 rounded-xl">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-semibold">Application Submitted</span>
        </div>
      );
    }

    return (
      <button
        onClick={handleApply}
        disabled={applyMutation.isPending}
        className="w-full flex items-center justify-center gap-2 px-8 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
      >
        {applyMutation.isPending ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Submitting Application...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Apply For This Job</span>
          </>
        )}
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Careers</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left main info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
            <div className="space-y-4">
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-555 dark:text-slate-450">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-450" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-slate-450" />
                  <span>{job.salary || 'Competitive'}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800/80 pt-6">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-3">Job Description</h2>
              <div className="text-slate-655 dark:text-slate-350 text-sm leading-relaxed whitespace-pre-line space-y-4">
                {job.description}
              </div>
            </div>
          </div>
        </div>

        {/* Right action widget */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm pb-3 border-b border-slate-100 dark:border-slate-850">
              Apply Section
            </h3>

            {renderActionSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
