import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetCandidateResume, useParseResume } from '../../hooks/useResumes';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, FileText, Briefcase, GraduationCap, ExternalLink, ChevronUp, ChevronDown, Award, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
      // Handled globally
    }
  };

  const parseJsonData = (dataStr) => {
    if (!dataStr) return [];
    try {
      if (typeof dataStr !== 'string') return dataStr;
      return JSON.parse(dataStr);
    } catch (e) {
      return dataStr.split(',').map(s => s.trim());
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="text-center py-12 p-6 glass rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg mx-auto">
        <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Resume Found</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          This candidate has not uploaded a resume, or it hasn't been parsed yet.
        </p>
        <Link
          to="/recruiter"
          className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-500 hover:bg-indigo-650 text-white text-xs font-bold rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    );
  }

  const skills = parseJsonData(resume.skills);
  const education = parseJsonData(resume.education);
  const experience = parseJsonData(resume.experience);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header / Back Link */}
      <div className="flex items-center justify-between">
        <Link
          to="/recruiter"
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex items-center gap-2">
          {user && (user.role === 'recruiter' || user.role === 'admin') && (
            <button
              onClick={handleParse}
              disabled={parseResumeMutation.isPending}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              {parseResumeMutation.isPending ? (
                <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCcw className="w-3.5 h-3.5" />
              )}
              <span>{parseResumeMutation.isPending ? 'Parsing...' : 'AI Parse Resume'}</span>
            </button>
          )}
          <a
            href={resume.file_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-850 hover:bg-indigo-100 dark:hover:bg-indigo-800/20 text-indigo-650 dark:text-indigo-400 rounded-xl text-xs font-bold transition-all"
          >
            <span>Open PDF Resume</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main card */}
      <div className="p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Award className="w-6 h-6 text-indigo-500" />
            <span>Candidate Resume Details</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse structured AI-extracted information from the uploaded PDF document.
          </p>
        </div>

        {/* Skills */}
        <div className="space-y-2 pb-6 border-b border-slate-100 dark:border-slate-850">
          <h3 className="text-xs font-bold text-slate-405 uppercase tracking-wider flex items-center gap-1.5">
            <Briefcase className="w-4.5 h-4.5 text-indigo-500" />
            <span>Extracted Skills</span>
          </h3>
          {skills.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No skills extracted yet.</p>
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

        {/* Education & Experience Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100 dark:border-slate-850">
          {/* Education */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-405 uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-4.5 h-4.5 text-indigo-500" />
              <span>Education details</span>
            </h3>
            {education.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No education details parsed.</p>
            ) : (
              <div className="space-y-3">
                {education.map((edu, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50/50 dark:bg-slate-800/20 rounded-xl border border-slate-100 dark:border-slate-850 text-xs space-y-1"
                  >
                    {typeof edu === 'object' ? (
                      <>
                        <h4 className="font-bold text-slate-800 dark:text-slate-200">{edu.degree || edu.degree_name}</h4>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">{edu.school || edu.institution}</p>
                        <p className="text-[10px] text-slate-400 font-semibold">{edu.year || edu.duration}</p>
                      </>
                    ) : (
                      <p className="text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">{edu}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Experience */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-405 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-4.5 h-4.5 text-indigo-500" />
              <span>Experience History</span>
            </h3>
            {experience.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No experience details parsed.</p>
            ) : (
              <div className="space-y-3">
                {experience.map((exp, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50/50 dark:bg-slate-800/20 rounded-xl border border-slate-100 dark:border-slate-850 text-xs space-y-1"
                  >
                    {typeof exp === 'object' ? (
                      <>
                        <h4 className="font-bold text-slate-800 dark:text-slate-200">{exp.role || exp.title}</h4>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">{exp.company}</p>
                        <p className="text-[10px] text-slate-400 font-semibold">{exp.year || exp.duration}</p>
                      </>
                    ) : (
                      <p className="text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">{exp}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Raw Text Accordion */}
        <div className="pt-2">
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
                  {resume.parsed_text || 'No raw text parsed yet.'}
                </pre>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CandidateResume;
