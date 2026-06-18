import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCreateJob, useUpdateJob, useGetJob } from '../../hooks/useJobs';
import { ArrowLeft, Save, Briefcase, MapPin, DollarSign, FileText } from 'lucide-react';
import { toast } from '../../utils/toast';

const JobForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Mutations/Queries
  const createJobMutation = useCreateJob();
  const updateJobMutation = useUpdateJob();
  const { data: job, isLoading: isJobLoading } = useGetJob(id);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');

  // Populate data in edit mode
  useEffect(() => {
    if (isEditMode && job) {
      setTitle(job.title);
      setDescription(job.description);
      setLocation(job.location);
      setSalary(job.salary || '');
    }
  }, [isEditMode, job]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !location) {
      toast.warning('Please fill in Title, Description, and Location.');
      return;
    }

    const jobData = { title, description, location, salary };

    try {
      if (isEditMode) {
        await updateJobMutation.mutateAsync({ id, jobData });
      } else {
        await createJobMutation.mutateAsync(jobData);
      }
      navigate('/recruiter');
    } catch (err) {
      // Handled globally
    }
  };

  if (isEditMode && isJobLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          to="/recruiter"
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Form Card */}
      <div className="p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-905 dark:text-slate-100">
            {isEditMode ? 'Edit Job Posting' : 'Post a New Job Position'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Provide details about the open position to start matching with candidate applications.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Job Title</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                placeholder="Senior Full Stack Engineer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-205 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm text-slate-805 dark:text-slate-200 outline-none"
              />
            </div>
          </div>

          {/* Location & Salary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Location */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="New York, NY (Hybrid) or Remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-205 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm text-slate-855 dark:text-slate-200 outline-none"
                />
              </div>
            </div>

            {/* Salary */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Salary Range</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. $120k - $150k"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-205 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm text-slate-855 dark:text-slate-200 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Job Description</span>
            </label>
            <textarea
              required
              rows={8}
              placeholder="Detail job tasks, candidate requirements, benefits, and tech stack details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-205 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm text-slate-855 dark:text-slate-200 outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="pt-4 flex justify-end gap-3">
            <Link
              to="/recruiter"
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 text-sm font-semibold transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={createJobMutation.isPending || updateJobMutation.isPending}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-400 text-white font-bold rounded-xl text-sm transition-all shadow-md focus:outline-none"
            >
              {createJobMutation.isPending || updateJobMutation.isPending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditMode ? 'Update Posting' : 'Publish Job'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;
