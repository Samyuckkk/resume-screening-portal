import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Briefcase,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  FileText,
  GraduationCap,
  Layers,
  Upload,
  Video,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGetCandidateResume, useUploadResume } from '../../hooks/useResumes';
import { useGetApplications } from '../../hooks/useApplications';
import { useGetInterviews } from '../../hooks/useInterviews';
import EmptyState from '../../components/Common/EmptyState';
import { PageHeader, SectionCard, StatCard, TabButton } from '../../components/Common/ui';
import { toast } from '../../utils/toast';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const { data: resume, isLoading: isResumeLoading, error: resumeError } = useGetCandidateResume(user?.id);
  const { data: applications, isLoading: isAppsLoading } = useGetApplications('applicant', user?.id);
  const { data: interviews, isLoading: isInterviewsLoading } = useGetInterviews(user?.role);
  const uploadResumeMutation = useUploadResume();

  const [uploadProgress, setUploadProgress] = useState(0);
  const [file, setFile] = useState(null);
  const [activeTab, setActiveTab] = useState('resume');
  const [parsedExpanded, setParsedExpanded] = useState(false);

  const candidateInterviews = interviews?.filter((interview) => applications?.some((app) => app.id === interview.application_id)) || [];

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
      // handled globally
    }
  };

  const parseJsonData = (dataStr) => {
    if (!dataStr) return [];
    try {
      if (typeof dataStr !== 'string') return dataStr;
      return JSON.parse(dataStr);
    } catch (e) {
      return dataStr.split(',').map((item) => item.trim());
    }
  };

  const skills = parseJsonData(resume?.skills);
  const education = parseJsonData(resume?.education);
  const experience = parseJsonData(resume?.experience);

  const statusColors = {
    Applied: 'bg-blue-50 text-blue-700',
    Shortlisted: 'bg-amber-50 text-amber-700',
    'Interview Scheduled': 'bg-violet-50 text-violet-700',
    Selected: 'bg-emerald-50 text-emerald-700',
    Rejected: 'bg-rose-50 text-rose-700',
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 lg:px-6">
      <PageHeader
        eyebrow="My Recruvo"
        title={`Hello, ${user?.name}`}
        description="Manage your resume, track applications, and view interview schedules — all in one place."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={FileText} label="Resume status" value={resume ? 'Uploaded' : 'Missing'} hint={resume ? 'Ready for screening' : 'Upload to unlock applying'} />
        <StatCard icon={Layers} label="Applications" value={applications?.length || 0} tone="violet" hint="Every job you’ve submitted" />
        <StatCard icon={Calendar} label="Interviews" value={candidateInterviews.length} tone="amber" hint="Scheduled sessions ahead" />
      </div>

      <div className="flex flex-wrap gap-1 border-b border-[#e8e8e8]">
        <TabButton active={activeTab === 'resume'} icon={FileText} onClick={() => setActiveTab('resume')}>My Resume</TabButton>
        <TabButton active={activeTab === 'applications'} icon={Layers} onClick={() => setActiveTab('applications')}>Applied Jobs</TabButton>
        <TabButton active={activeTab === 'interviews'} icon={Calendar} onClick={() => setActiveTab('interviews')}>Interviews</TabButton>
      </div>

      {activeTab === 'resume' && (
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <SectionCard className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{resume ? 'Refresh your resume' : 'Upload your resume'}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-500">Keep your learning profile current so applications continue working without any logic changes.</p>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <label className="block rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50/80 p-8 text-center hover:border-blue-300 hover:bg-white">
                <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-blue-50 text-blue-600">
                  <Upload className="h-7 w-7" />
                </div>
                <p className="mt-4 text-base font-semibold text-slate-900">{file ? file.name : 'Choose a PDF resume'}</p>
                <p className="mt-2 text-sm text-slate-500">PDF only. Your existing upload flow remains unchanged.</p>
              </label>

              {uploadResumeMutation.isPending && (
                <div className="space-y-2 rounded-[1.5rem] bg-slate-50 p-4">
                  <div className="flex items-center justify-between text-sm font-semibold text-slate-600">
                    <span>Uploading</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200">
                    <div className="h-2 rounded-full bg-blue-500 transition-all" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}

              <button type="submit" disabled={!file || uploadResumeMutation.isPending} className="btn-primary w-full">
                {uploadResumeMutation.isPending ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Upload className="h-4 w-4" />}
                <span>{uploadResumeMutation.isPending ? 'Uploading...' : 'Upload and screen'}</span>
              </button>
            </form>

            {resume && (
              <div className="rounded-[1.5rem] bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Current file</p>
                <a href={resume.file_url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700">
                  Open uploaded resume
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}
          </SectionCard>

          <SectionCard className="space-y-6">
            {isResumeLoading ? (
              <div className="space-y-3">
                <div className="skeleton-shimmer h-6 w-40 rounded-full" />
                <div className="skeleton-shimmer h-24 rounded-[1.75rem]" />
                <div className="skeleton-shimmer h-24 rounded-[1.75rem]" />
              </div>
            ) : resumeError || !resume ? (
              <EmptyState title="No resume uploaded yet" description="Upload your PDF to activate parsed skills, education history, and application readiness." icon={FileText} />
            ) : (
              <>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">AI screening breakdown</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-500">Automatically parsed details from your uploaded resume.</p>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Extracted skills</p>
                  {skills.length === 0 ? (
                    <p className="text-sm text-slate-500">No skills parsed yet.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <span key={index} className="soft-pill bg-blue-50 text-blue-700">{skill}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[1.75rem] bg-slate-50 p-5">
                    <div className="mb-4 flex items-center gap-2 text-slate-700">
                      <GraduationCap className="h-4 w-4 text-blue-500" />
                      <h3 className="font-semibold">Education</h3>
                    </div>
                    <div className="space-y-3">
                      {education.length === 0 ? (
                        <p className="text-sm text-slate-500">No education details parsed yet.</p>
                      ) : (
                        education.map((edu, index) => (
                          <div key={index} className="rounded-2xl bg-white p-4">
                            {typeof edu === 'object' ? (
                              <>
                                <p className="font-semibold text-slate-900">{edu.degree || edu.degree_name}</p>
                                <p className="text-sm text-slate-500">{edu.school || edu.institution}</p>
                                <p className="mt-1 text-xs text-slate-400">{edu.year || edu.duration}</p>
                              </>
                            ) : (
                              <p className="text-sm font-semibold text-slate-800">{edu}</p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="rounded-[1.75rem] bg-slate-50 p-5">
                    <div className="mb-4 flex items-center gap-2 text-slate-700">
                      <Briefcase className="h-4 w-4 text-blue-500" />
                      <h3 className="font-semibold">Experience</h3>
                    </div>
                    <div className="space-y-3">
                      {experience.length === 0 ? (
                        <p className="text-sm text-slate-500">No experience details parsed yet.</p>
                      ) : (
                        experience.map((exp, index) => (
                          <div key={index} className="rounded-2xl bg-white p-4">
                            {typeof exp === 'object' ? (
                              <>
                                <p className="font-semibold text-slate-900">{exp.role || exp.title}</p>
                                <p className="text-sm text-slate-500">{exp.company}</p>
                                <p className="mt-1 text-xs text-slate-400">{exp.year || exp.duration}</p>
                              </>
                            ) : (
                              <p className="text-sm font-semibold text-slate-800">{exp}</p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.75rem] bg-slate-50 p-5">
                  <button type="button" onClick={() => setParsedExpanded((value) => !value)} className="flex w-full items-center justify-between text-left">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Parsed raw text</p>
                      <p className="mt-1 text-sm text-slate-500">Inspect the stored parser output.</p>
                    </div>
                    {parsedExpanded ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
                  </button>
                  <AnimatePresence>
                    {parsedExpanded && (
                      <motion.pre
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 max-h-64 overflow-auto whitespace-pre-wrap rounded-[1.5rem] bg-slate-900 p-4 text-xs leading-6 text-slate-100"
                      >
                        {resume.parsed_text || 'No raw text parsed yet.'}
                      </motion.pre>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </SectionCard>
        </div>
      )}

      {activeTab === 'applications' && (
        <SectionCard className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Application tracker</h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">A clean progress view for every role you’ve applied to.</p>
          </div>

          {isAppsLoading ? (
            <div className="space-y-3">
              <div className="skeleton-shimmer h-24 rounded-[1.75rem]" />
              <div className="skeleton-shimmer h-24 rounded-[1.75rem]" />
            </div>
          ) : !applications || applications.length === 0 ? (
            <EmptyState title="No applications yet" description="Once you apply to roles, they will appear here with status updates." icon={Layers} />
          ) : (
            <div className="grid gap-4">
              {applications.map((app) => (
                <div key={app.id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{app.job_title}</h3>
                      <p className="mt-1 text-sm text-slate-500">{app.job_location}</p>
                    </div>
                    <span className={`soft-pill ${statusColors[app.status] || 'bg-slate-100 text-slate-700'}`}>{app.status}</span>
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Applied on</p>
                      <p className="mt-2 text-sm font-semibold text-slate-800">
                        {new Date(app.applied_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Salary</p>
                      <p className="mt-2 text-sm font-semibold text-slate-800">{app.job_salary}</p>
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
            <h2 className="text-2xl font-bold text-slate-900">Interview schedule</h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">Everything lined up for your upcoming conversations.</p>
          </div>

          {isInterviewsLoading ? (
            <div className="space-y-3">
              <div className="skeleton-shimmer h-32 rounded-[1.75rem]" />
            </div>
          ) : candidateInterviews.length === 0 ? (
            <EmptyState title="No interviews scheduled" description="Once a recruiter books a session, it will appear here with the meeting details." icon={Calendar} />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {candidateInterviews.map((interview) => {
                const application = applications?.find((item) => item.id === interview.application_id);
                return (
                  <div key={interview.id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{application?.job_title || 'Interview'}</h3>
                        <p className="mt-1 text-sm text-slate-500">Scheduled session</p>
                      </div>
                      <span className="soft-pill bg-violet-50 text-violet-700">Scheduled</span>
                    </div>
                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                      <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-blue-500" />{interview.interview_date}</div>
                      <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-blue-500" />{interview.interview_time}</div>
                    </div>
                    {interview.meeting_link && (
                      <a href={interview.meeting_link} target="_blank" rel="noreferrer" className="btn-primary mt-5 w-full">
                        <Video className="h-4 w-4" />
                        Join meeting
                      </a>
                    )}
                    {interview.feedback && (
                      <div className="mt-4 rounded-[1.5rem] bg-amber-50 p-4 text-sm leading-7 text-slate-600">
                        <p className="font-semibold text-amber-700">Feedback</p>
                        <p className="mt-1">{interview.feedback}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>
      )}
    </div>
  );
};

export default CandidateDashboard;

