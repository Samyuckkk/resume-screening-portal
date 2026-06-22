import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Briefcase, DollarSign, FileText, MapPin, Save } from 'lucide-react';
import { useCreateJob, useUpdateJob, useGetJob } from '../../hooks/useJobs';
import { PageHeader, SectionCard } from '../../components/Common/ui';
import { toast } from '../../utils/toast';

const JobForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const createJobMutation = useCreateJob();
  const updateJobMutation = useUpdateJob();
  const { data: job, isLoading: isJobLoading } = useGetJob(id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');

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
      // handled globally
    }
  };

  if (isEditMode && isJobLoading) {
    return <div className="surface-card flex justify-center rounded-[2rem] p-10"><div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" /></div>;
  }

  const isPending = createJobMutation.isPending || updateJobMutation.isPending;

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 lg:px-6">
      <Link to="/recruiter" className="inline-flex items-center gap-2 text-sm text-[#717b9e] hover:text-[#457eff]"><ArrowLeft className="h-4 w-4" />Back to dashboard</Link>
      <PageHeader eyebrow="Post a Job" title={isEditMode ? 'Edit job posting' : 'Post a new job'} description="Fill in the job details to attract the right candidates." />
      <SectionCard>
        <form onSubmit={handleSubmit} className="grid gap-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Job title</label>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-slate-400 shrink-0" />
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="field !px-3.5" placeholder="Senior Full Stack Engineer" required />
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Location</label>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                <input value={location} onChange={(e) => setLocation(e.target.value)} className="field !px-3.5" placeholder="Remote or hybrid" required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Salary range</label>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-slate-400 shrink-0" />
                <input value={salary} onChange={(e) => setSalary(e.target.value)} className="field !px-3.5" placeholder="$120k - $150k" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Job description</label>
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-slate-400 shrink-0 mt-2.5" />
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="textarea-field min-h-56 !px-3.5" placeholder="Describe responsibilities, expectations, and outcomes..." required />
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link to="/recruiter" className="btn-secondary">Cancel</Link>
            <button type="submit" disabled={isPending} className="btn-primary">
              {isPending ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Save className="h-4 w-4" />}
              <span>{isPending ? 'Saving...' : isEditMode ? 'Update role' : 'Publish role'}</span>
            </button>
          </div>
        </form>
      </SectionCard>
    </div>
  );
};

export default JobForm;

