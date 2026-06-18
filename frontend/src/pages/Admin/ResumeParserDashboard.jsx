import React, { useState } from 'react';
import { useGetApplications } from '../../hooks/useApplications';
import { useParseResume } from '../../hooks/useResumes';
import { FileText, Cpu, CheckCircle2, RefreshCcw, Eye, Play, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '../../utils/toast';

const ResumeParserDashboard = () => {
  // Queries/Mutations
  const { data: applications, isLoading: isAppsLoading } = useGetApplications('admin');
  const parseResumeMutation = useParseResume();

  // State
  const [manualResumeId, setManualResumeId] = useState('');
  const [parsedResult, setParsedResult] = useState(null);

  // Filter applications that have a resume URL
  const appsWithResumes = applications?.filter(app => app.resume_url) || [];

  const handleManualParse = async (e) => {
    e.preventDefault();
    if (!manualResumeId) {
      toast.warning('Please enter a valid Resume ID.');
      return;
    }

    try {
      const result = await parseResumeMutation.mutateAsync(manualResumeId);
      setParsedResult(result);
    } catch (err) {
      // Handled globally
    }
  };

  const handleListParse = async (app) => {
    // In mock data, let's assign a mock resume ID if there is no explicit id.
    // The admin can parse this resume using a default ID (e.g. 1) or a random integer,
    // or let the backend handle it. We can try parsing using resume_id = 1 or a mock ID.
    const resumeId = app.resume_id || 1;
    
    try {
      const result = await parseResumeMutation.mutateAsync(resumeId);
      setParsedResult({
        candidate_name: app.candidate_name,
        ...result,
      });
    } catch (err) {
      // Handled globally
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin"
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: Input Console */}
        <div className="space-y-6 lg:col-span-1">
          {/* Manual parse console */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h2 className="text-md font-bold text-slate-800 dark:text-slate-250 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-850">
              <Cpu className="w-5 h-5 text-rose-500" />
              <span>Parser Terminal</span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Manually trigger the backend OCR + Deep LLM pipeline for a specific database Resume ID.
            </p>

            <form onSubmit={handleManualParse} className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Resume ID</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 42"
                  value={manualResumeId}
                  onChange={(e) => setManualResumeId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-205 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20 focus:outline-none focus:ring-1 focus:ring-rose-500 text-sm text-slate-805 dark:text-slate-200 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={parseResumeMutation.isPending}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                {parseResumeMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Run AI Parse</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Applications list / Parsed Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Output Display Card */}
          {parsedResult && (
            <div className="p-6 rounded-2xl border border-emerald-200 dark:border-emerald-950/30 bg-emerald-50/10 dark:bg-emerald-950/5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-450 flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-555" />
                <span>Parse Response for {parsedResult.candidate_name || `Resume ID`}</span>
              </h3>
              
              {/* Skills */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Parsed Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {parsedResult.skills?.length > 0 ? (
                    parsedResult.skills.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-350">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">None found</span>
                  )}
                </div>
              </div>

              {/* Education / Experience */}
              <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Education</span>
                  {parsedResult.education?.length > 0 ? (
                    <ul className="list-disc pl-4 space-y-1 text-slate-650 dark:text-slate-350">
                      {parsedResult.education.map((e, idx) => (
                        <li key={idx}>{typeof e === 'object' ? `${e.degree} at ${e.school}` : e}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-xs text-slate-400 italic">None found</span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Experience</span>
                  {parsedResult.experience?.length > 0 ? (
                    <ul className="list-disc pl-4 space-y-1 text-slate-650 dark:text-slate-350">
                      {parsedResult.experience.map((e, idx) => (
                        <li key={idx}>{typeof e === 'object' ? `${e.role} at ${e.company}` : e}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-xs text-slate-400 italic">None found</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* List of applications with resumes */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Candidate Submission Queue</h2>

            {isAppsLoading ? (
              <div className="h-20 bg-slate-100 dark:bg-slate-850 rounded animate-pulse"></div>
            ) : appsWithResumes.length === 0 ? (
              <EmptyState
                title="No PDF Resumes in Queue"
                description="Once candidates upload PDF documents and apply for jobs, they will appear in this administrative queue."
                icon={FileText}
              />
            ) : (
              <div className="divide-y divide-slate-50 dark:divide-slate-850">
                {appsWithResumes.map((app) => (
                  <div key={app.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate">{app.candidate_name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Applied: {app.job_title}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={app.resume_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 border border-slate-205 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-500 dark:text-slate-400 rounded-lg transition-colors"
                        title="View PDF Document"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      
                      <button
                        onClick={() => handleListParse(app)}
                        disabled={parseResumeMutation.isPending}
                        className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-400 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <RefreshCcw className="w-3.5 h-3.5" />
                        <span>Run AI Parse</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeParserDashboard;
