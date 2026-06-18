import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGetCandidateResume, useUploadResume } from '../../hooks/useResumes';
import { useGetApplications } from '../../hooks/useApplications';
import { useGetInterviews } from '../../hooks/useInterviews';
import { SkeletonCard, Spinner } from '../../components/Common/Loaders';
import EmptyState from '../../components/Common/EmptyState';
import {
  FileText,
  Upload,
  Calendar,
  Layers,
  GraduationCap,
  Briefcase,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Video,
  AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '../../utils/toast';

const CandidateDashboard = () => {
  const { user } = useAuth();
  
  // Queries
  const { data: resume, isLoading: isResumeLoading, error: resumeError } = useGetCandidateResume(user?.id);
  const { data: applications, isLoading: isAppsLoading } = useGetApplications('applicant', user?.id);
  const { data: interviews, isLoading: isInterviewsLoading } = useGetInterviews(user?.role);
  
  // Mutation
  const uploadResumeMutation = useUploadResume();

  // Component State
  const [uploadProgress, setUploadProgress] = useState(0);
  const [file, setFile] = useState(null);
  const [activeTab, setActiveTab] = useState('resume');
  const [parsedExpanded, setParsedExpanded] = useState(false);

  // Filter interviews for this applicant
  // Since interviews are scheduled for applications, we filter interviews matching the candidate's applications
  const candidateInterviews = interviews?.filter((interview) => 
    applications?.some((app) => app.id === interview.application_id)
  ) || [];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    if (selectedFile.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed.');
      return;
    }
    setFile(selectedFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.warning('Please select a PDF file to upload.');
      return;
    }

    setUploadProgress(0);
    try {
      await uploadResumeMutation.mutateAsync({
        file,
        onProgress: (percent) => setUploadProgress(percent),
      });
      setFile(null);
    } catch (err) {
      // Handled globally
    }
  };

  // Safe JSON Parsing for skills, experience, education columns (stored as JSON string on backend)
  const parseJsonData = (dataStr) => {
    if (!dataStr) return [];
    try {
      // If it is already an array/object, return it
      if (typeof dataStr !== 'string') return dataStr;
      return JSON.parse(dataStr);
    } catch (e) {
      // In case it's comma separated
      return dataStr.split(',').map(s => s.trim());
    }
  };

  const skills = parseJsonData(resume?.skills);
  const education = parseJsonData(resume?.education);
  const experience = parseJsonData(resume?.experience);

  // Status Styles
  const statusColors = {
    'Applied': 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200/50',
    'Shortlisted': 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/50',
    'Interview Scheduled': 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-200/50',
    'Selected': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/50',
    'Rejected': 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200/50',
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">
          Welcome back, {user?.name}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Review your parsed details, track applications, and view scheduled interviews.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('resume')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-semibold text-sm transition-colors ${
            activeTab === 'resume'
              ? 'border-indigo-500 text-indigo-650 dark:text-indigo-400'
              : 'border-transparent text-slate-550 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-4.5 h-4.5" />
          <span>My Resume</span>
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-semibold text-sm transition-colors ${
            activeTab === 'applications'
              ? 'border-indigo-500 text-indigo-650 dark:text-indigo-400'
              : 'border-transparent text-slate-550 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Layers className="w-4.5 h-4.5" />
          <span>Applications ({applications?.length || 0})</span>
        </button>
        <button
          onClick={() => setActiveTab('interviews')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-semibold text-sm transition-colors ${
            activeTab === 'interviews'
              ? 'border-indigo-500 text-indigo-650 dark:text-indigo-400'
              : 'border-transparent text-slate-550 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Calendar className="w-4.5 h-4.5" />
          <span>Interviews ({candidateInterviews.length})</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="pt-2">
        {activeTab === 'resume' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Upload Area */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-250 pb-2 border-b border-slate-100 dark:border-slate-850">
                {resume ? 'Update Resume' : 'Upload Resume'}
              </h2>

              <form onSubmit={handleUpload} className="space-y-4">
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors relative cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <span className="block text-sm font-semibold text-slate-700 dark:text-slate-350">
                    {file ? file.name : 'Select PDF Resume'}
                  </span>
                  <span className="block text-xs text-slate-400 mt-1">PDF file only (Max 5MB)</span>
                </div>

                {uploadResumeMutation.isPending && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-500">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!file || uploadResumeMutation.isPending}
                  className="w-full py-2 px-4 bg-indigo-500 hover:bg-indigo-650 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
                >
                  Upload & Screen
                </button>
              </form>

              {resume && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Current Resume:</span>
                  <a
                    href={resume.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-indigo-500 hover:text-indigo-600 flex items-center gap-0.5"
                  >
                    <span>View PDF</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Parsed Details */}
            <div className="lg:col-span-2 space-y-6">
              {isResumeLoading ? (
                <div className="p-8 glass border border-slate-200 dark:border-slate-800 rounded-2xl animate-pulse space-y-4">
                  <div className="h-6 w-1/4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  <div className="h-4 w-full bg-slate-100 dark:bg-slate-850 rounded"></div>
                </div>
              ) : resumeError ? (
                <EmptyState
                  title="No Resume Uploaded"
                  description="Upload your PDF resume on the left to activate AI skill screening, education tracking, and job matching details."
                  icon={FileText}
                />
              ) : (
                <div className="p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-855 dark:text-slate-200">AI Screening Breakdown</h2>
                    <p className="text-xs text-slate-405 dark:text-slate-400 mt-0.5">
                      This information was parsed automatically from your resume.
                    </p>
                  </div>

                  {/* Skills tags */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4" />
                      <span>Extracted Skills</span>
                    </h3>
                    {skills.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">Not parsed yet. Admin parser dashboard can trigger parsing.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {skills.map((skill, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-650 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-850/50"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Education & Experience */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    {/* Education */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4" />
                        <span>Education History</span>
                      </h3>
                      {education.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">Not parsed yet.</p>
                      ) : (
                        <div className="space-y-3">
                          {education.map((edu, idx) => (
                            <div
                              key={idx}
                              className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800/50 text-xs"
                            >
                              {typeof edu === 'object' ? (
                                <>
                                  <h4 className="font-bold text-slate-800 dark:text-slate-200">{edu.degree || edu.degree_name}</h4>
                                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">{edu.school || edu.institution}</p>
                                  <p className="text-[10px] text-slate-400 mt-1">{edu.year || edu.duration}</p>
                                </>
                              ) : (
                                <p className="text-slate-650 dark:text-slate-300 font-semibold">{edu}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Experience */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4" />
                        <span>Work Experience</span>
                      </h3>
                      {experience.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">Not parsed yet.</p>
                      ) : (
                        <div className="space-y-3">
                          {experience.map((exp, idx) => (
                            <div
                              key={idx}
                              className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800/50 text-xs"
                            >
                              {typeof exp === 'object' ? (
                                <>
                                  <h4 className="font-bold text-slate-800 dark:text-slate-200">{exp.role || exp.title}</h4>
                                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">{exp.company}</p>
                                  <p className="text-[10px] text-slate-400 mt-1">{exp.year || exp.duration}</p>
                                </>
                              ) : (
                                <p className="text-slate-650 dark:text-slate-300 font-semibold">{exp}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Raw Text Accordion */}
                  <div className="border-t border-slate-100 dark:border-slate-850 pt-4">
                    <button
                      onClick={() => setParsedExpanded(!parsedExpanded)}
                      className="flex items-center justify-between w-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                      <span className="text-xs font-bold uppercase tracking-wider">Raw Parsed Resume Text</span>
                      {parsedExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    
                    <AnimatePresence>
                      {parsedExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden mt-3"
                        >
                          <pre className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-850 rounded-xl text-xs font-mono text-slate-600 dark:text-slate-400 overflow-x-auto whitespace-pre-wrap max-h-60 overflow-y-auto">
                            {resume.parsed_text || 'No raw text parsed yet. Admins can trigger OCR/LLM parsing.'}
                          </pre>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Application Tracking History</h2>

            {isAppsLoading ? (
              <div className="space-y-4">
                <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
                <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
              </div>
            ) : !applications || applications.length === 0 ? (
              <EmptyState
                title="No Applications Yet"
                description="You haven't submitted any job applications yet. Go to the Job listings page to explore positions!"
                icon={Layers}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-850 text-xs font-bold text-slate-400 uppercase">
                      <th className="py-3 px-4">Job Title</th>
                      <th className="py-3 px-4">Applied Date</th>
                      <th className="py-3 px-4">Salary</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-850 text-sm">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors">
                        <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-200">
                          {app.job_title}
                          <span className="block text-xs font-medium text-slate-400 mt-0.5">{app.job_location}</span>
                        </td>
                        <td className="py-4 px-4 text-slate-500 dark:text-slate-400">
                          {new Date(app.applied_date).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="py-4 px-4 text-slate-500 dark:text-slate-400">{app.job_salary}</td>
                        <td className="py-4 px-4 text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusColors[app.status] || 'bg-slate-100 border-slate-200 text-slate-650'}`}>
                            {app.status}
                          </span>
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
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Scheduled Interviews</h2>

            {isInterviewsLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded"></div>
              </div>
            ) : candidateInterviews.length === 0 ? (
              <EmptyState
                title="No Interviews Scheduled"
                description="Once recruiters schedule a technical evaluation or call, it will appear here."
                icon={Calendar}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {candidateInterviews.map((interview) => {
                  // Find corresponding job title
                  const application = applications?.find((a) => a.id === interview.application_id);
                  return (
                    <div
                      key={interview.id}
                      className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/25 flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-slate-850 dark:text-slate-200">
                            {application?.job_title || 'Technical Interview'}
                          </h4>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-850/50">
                            Scheduled
                          </span>
                        </div>

                        <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Date: {interview.interview_date}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Time: {interview.interview_time}</span>
                          </div>
                        </div>
                      </div>

                      {interview.meeting_link && (
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-slate-405 dark:text-slate-450">
                            <Video className="w-4 h-4 text-indigo-500" />
                            <span>Video Conference</span>
                          </div>
                          <a
                            href={interview.meeting_link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-indigo-500/10"
                          >
                            <span>Join Meeting</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}

                      {interview.feedback && (
                        <div className="p-3 bg-amber-50/40 dark:bg-amber-950/10 border border-amber-200/40 dark:border-amber-850/40 rounded-xl text-xs">
                          <p className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Hiring Committee Feedback:</span>
                          </p>
                          <p className="text-slate-550 dark:text-slate-350 mt-1 italic leading-relaxed">
                            "{interview.feedback}"
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;
