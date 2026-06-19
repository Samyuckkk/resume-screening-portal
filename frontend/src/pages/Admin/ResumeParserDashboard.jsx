import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Cpu, Eye, FileText, Play, RefreshCcw } from 'lucide-react';
import { useGetApplications } from '../../hooks/useApplications';
import { useParseResume } from '../../hooks/useResumes';
import EmptyState from '../../components/Common/EmptyState';
import { PageHeader, SectionCard } from '../../components/Common/ui';
import { toast } from '../../utils/toast';

const ResumeParserDashboard = () => {
  const { data: applications, isLoading: isAppsLoading } = useGetApplications('admin');
  const parseResumeMutation = useParseResume();
  const [manualResumeId, setManualResumeId] = useState('');
  const [parsedResult, setParsedResult] = useState(null);

  const appsWithResumes = applications?.filter((app) => app.resume_url) || [];

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
      // handled globally
    }
  };

  const handleListParse = async (app) => {
    const resumeId = app.resume_id || 1;
    try {
      const result = await parseResumeMutation.mutateAsync(resumeId);
      setParsedResult({ candidate_name: app.candidate_name, ...result });
    } catch (err) {
      // handled globally
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Link to="/admin" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800"><ArrowLeft className="h-4 w-4" />Back to dashboard</Link>
      <PageHeader eyebrow="Parser studio" title="Run and inspect resume parsing" description="Keep the exact parser behavior while giving admins a more polished queue and output console." />
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <SectionCard className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Manual parse</h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">Trigger the existing OCR and LLM pipeline for a specific resume ID.</p>
          </div>
          <form onSubmit={handleManualParse} className="space-y-4">
            <div className="space-y-2"><label className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Resume ID</label><input type="number" value={manualResumeId} onChange={(e) => setManualResumeId(e.target.value)} className="field" placeholder="e.g. 42" required /></div>
            <button type="submit" disabled={parseResumeMutation.isPending} className="btn-primary w-full">{parseResumeMutation.isPending ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Play className="h-4 w-4" />}<span>{parseResumeMutation.isPending ? 'Running...' : 'Run AI parse'}</span></button>
          </form>
        </SectionCard>
        <div className="space-y-6">
          {parsedResult && (
            <SectionCard className="space-y-4 border-emerald-100 bg-emerald-50/50">
              <div className="flex items-center gap-3"><div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700"><CheckCircle2 className="h-5 w-5" /></div><div><h2 className="text-xl font-bold text-slate-900">Parse response {parsedResult.candidate_name ? `for ${parsedResult.candidate_name}` : ''}</h2><p className="text-sm text-slate-500">Latest parser output from the current backend pipeline.</p></div></div>
              <div className="space-y-3"><p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Skills</p><div className="flex flex-wrap gap-2">{parsedResult.skills?.length ? parsedResult.skills.map((skill, index) => <span key={index} className="soft-pill bg-emerald-100 text-emerald-800">{skill}</span>) : <span className="text-sm text-slate-500">None found</span>}</div></div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.5rem] bg-white p-4"><p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Education</p><div className="mt-3 space-y-2 text-sm text-slate-600">{parsedResult.education?.length ? parsedResult.education.map((item, index) => <div key={index}>{typeof item === 'object' ? `${item.degree} at ${item.school}` : item}</div>) : <div>None found</div>}</div></div>
                <div className="rounded-[1.5rem] bg-white p-4"><p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Experience</p><div className="mt-3 space-y-2 text-sm text-slate-600">{parsedResult.experience?.length ? parsedResult.experience.map((item, index) => <div key={index}>{typeof item === 'object' ? `${item.role} at ${item.company}` : item}</div>) : <div>None found</div>}</div></div>
              </div>
            </SectionCard>
          )}
          <SectionCard className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Resume queue</h2>
              <p className="mt-2 text-sm leading-7 text-slate-500">Applications with resume files ready for parsing.</p>
            </div>
            {isAppsLoading ? <div className="skeleton-shimmer h-28 rounded-[1.75rem]" /> : appsWithResumes.length === 0 ? <EmptyState title="No resumes in queue" description="Once candidates upload resumes and apply to jobs, they will appear here." icon={FileText} /> : <div className="grid gap-4">{appsWithResumes.map((app) => <div key={app.id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-5"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><h3 className="text-lg font-bold text-slate-900">{app.candidate_name}</h3><p className="mt-1 text-sm text-slate-500">Applied for {app.job_title}</p></div><div className="flex flex-wrap gap-2"><a href={app.resume_url} target="_blank" rel="noreferrer" className="btn-secondary"><Eye className="h-4 w-4" />View resume</a><button type="button" onClick={() => handleListParse(app)} disabled={parseResumeMutation.isPending} className="btn-primary">{parseResumeMutation.isPending ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}<span>Run AI parse</span></button></div></div></div>)}</div>}
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default ResumeParserDashboard;

