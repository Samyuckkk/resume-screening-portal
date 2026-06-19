import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Award, Briefcase, ChevronDown, ChevronUp, ExternalLink, FileText, GraduationCap, RefreshCcw } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useGetCandidateResume, useParseResume } from '../../hooks/useResumes';
import { useAuth } from '../../context/AuthContext';
import { PageHeader, SectionCard } from '../../components/Common/ui';

const CandidateResume = () => {
  const { candidate_id } = useParams();
  const { data: resume, isLoading, error } = useGetCandidateResume(candidate_id);
  const [parsedExpanded, setParsedExpanded] = useState(false);
  const { user } = useAuth();
  const parseResumeMutation = useParseResume();

  const handleParse = async () => {
    if (!resume?.id) return;
    try {
      await parseResumeMutation.mutateAsync(resume.id);
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

  if (isLoading) {
    return <div className="surface-card flex justify-center rounded-[2rem] p-10"><div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" /></div>;
  }

  if (error || !resume) {
    return (
      <SectionCard className="mx-auto max-w-2xl text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-slate-50 text-slate-500"><FileText className="h-10 w-10" /></div>
        <h2 className="text-2xl font-bold text-slate-900">No resume found</h2>
        <p className="mt-3 text-sm leading-7 text-slate-500">This candidate has not uploaded a resume yet.</p>
        <Link to="/recruiter" className="btn-primary mt-6"><ArrowLeft className="h-4 w-4" />Back to dashboard</Link>
      </SectionCard>
    );
  }

  const skills = parseJsonData(resume.skills);
  const education = parseJsonData(resume.education);
  const experience = parseJsonData(resume.experience);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link to="/recruiter" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800"><ArrowLeft className="h-4 w-4" />Back to dashboard</Link>
      <PageHeader
        eyebrow="Candidate resume"
        title="Structured resume review"
        description="Inspect parsed candidate details and trigger parsing when you need a fresh extraction."
        action={<div className="flex flex-wrap gap-3">{user && (user.role === 'recruiter' || user.role === 'admin') && <button type="button" onClick={handleParse} disabled={parseResumeMutation.isPending} className="btn-danger">{parseResumeMutation.isPending ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}<span>{parseResumeMutation.isPending ? 'Parsing...' : 'AI parse resume'}</span></button>}<a href={resume.file_url} target="_blank" rel="noreferrer" className="btn-secondary"><ExternalLink className="h-4 w-4" />Open PDF</a></div>}
      />
      <SectionCard className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-700"><Award className="h-5 w-5 text-blue-600" /><h2 className="text-2xl font-bold text-slate-900">Resume intelligence</h2></div>
          {skills.length === 0 ? <p className="text-sm text-slate-500">No extracted skills yet.</p> : <div className="flex flex-wrap gap-2">{skills.map((skill, index) => <span key={index} className="soft-pill bg-blue-50 text-blue-700">{skill}</span>)}</div>}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[1.75rem] bg-slate-50 p-5"><div className="mb-4 flex items-center gap-2"><GraduationCap className="h-4 w-4 text-blue-500" /><h3 className="font-semibold text-slate-900">Education</h3></div><div className="space-y-3">{education.length === 0 ? <p className="text-sm text-slate-500">No education details parsed.</p> : education.map((edu, index) => <div key={index} className="rounded-2xl bg-white p-4">{typeof edu === 'object' ? <><p className="font-semibold text-slate-900">{edu.degree || edu.degree_name}</p><p className="text-sm text-slate-500">{edu.school || edu.institution}</p><p className="mt-1 text-xs text-slate-400">{edu.year || edu.duration}</p></> : <p className="text-sm font-semibold text-slate-800">{edu}</p>}</div>)}</div></div>
          <div className="rounded-[1.75rem] bg-slate-50 p-5"><div className="mb-4 flex items-center gap-2"><Briefcase className="h-4 w-4 text-blue-500" /><h3 className="font-semibold text-slate-900">Experience</h3></div><div className="space-y-3">{experience.length === 0 ? <p className="text-sm text-slate-500">No experience details parsed.</p> : experience.map((exp, index) => <div key={index} className="rounded-2xl bg-white p-4">{typeof exp === 'object' ? <><p className="font-semibold text-slate-900">{exp.role || exp.title}</p><p className="text-sm text-slate-500">{exp.company}</p><p className="mt-1 text-xs text-slate-400">{exp.year || exp.duration}</p></> : <p className="text-sm font-semibold text-slate-800">{exp}</p>}</div>)}</div></div>
        </div>
        <div className="rounded-[1.75rem] bg-slate-50 p-5">
          <button type="button" onClick={() => setParsedExpanded((value) => !value)} className="flex w-full items-center justify-between text-left"><div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Parsed raw text</p><p className="mt-1 text-sm text-slate-500">Inspect the original parsed content.</p></div>{parsedExpanded ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}</button>
          <AnimatePresence>{parsedExpanded && <motion.pre initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 max-h-64 overflow-auto whitespace-pre-wrap rounded-[1.5rem] bg-slate-900 p-4 text-xs leading-6 text-slate-100">{resume.parsed_text || 'No raw text parsed yet.'}</motion.pre>}</AnimatePresence>
        </div>
      </SectionCard>
    </div>
  );
};

export default CandidateResume;

