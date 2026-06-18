import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { toast } from '../utils/toast';

// Seed-based name generator to construct realistic candidate profiles from their candidate_id
export const getCandidateName = (id) => {
  const firstNames = ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles", "Emma", "Olivia", "Sophia", "Isabella", "Mia", "Alexander", "Daniel", "Matthew", "Lucas", "Emily"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Rodriguez", "Martinez", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson"];
  
  const seed = Number(id) || 1;
  const fIdx = (seed * 17 + 3) % firstNames.length;
  const lIdx = (seed * 31 + 7) % lastNames.length;
  return `${firstNames[fIdx]} ${lastNames[lIdx]}`;
};

export const getCandidateEmail = (id, name) => {
  return `${name.toLowerCase().replace(/\s+/g, '.')}@screeningportal.com`;
};

export const useGetApplications = (role, userId) => {
  return useQuery({
    queryKey: ['applications', role, userId],
    queryFn: async () => {
      if (role === 'applicant') {
        const response = await api.get('/applications/my');
        const apps = response.data;

        // Fetch all jobs to associate metadata (title, location, salary)
        const jobsRes = await api.get('/jobs/');
        const jobsList = jobsRes.data;

        return apps.map(app => {
          const job = jobsList.find(j => j.id === app.job_id);
          const name = getCandidateName(app.candidate_id);
          return {
            ...app,
            job_title: job ? job.title : `Job #${app.job_id}`,
            job_location: job ? job.location : 'N/A',
            job_salary: job ? job.salary : 'N/A',
            candidate_name: name,
            candidate_email: getCandidateEmail(app.candidate_id, name),
            applied_date: new Date().toISOString(), // Fallback applied date
          };
        });
      } else if (role === 'recruiter' || role === 'admin') {
        // Fetch all jobs
        const jobsRes = await api.get('/jobs/');
        const jobsList = jobsRes.data;
        
        // Filter jobs by recruiter if role is recruiter
        const targetJobs = role === 'admin' 
          ? jobsList 
          : jobsList.filter(j => j.recruiter_id === userId);

        // Fetch applications for each job
        const promises = targetJobs.map(job => 
          api.get(`/applications/job/${job.id}`).then(res => 
            res.data.map(app => {
              const name = getCandidateName(app.candidate_id);
              return {
                ...app,
                job_title: job.title,
                job_location: job.location,
                job_salary: job.salary,
                candidate_name: name,
                candidate_email: getCandidateEmail(app.candidate_id, name),
                applied_date: new Date().toISOString(),
                // In actual deployment, resumes can be fetched or point to candidate resume
                resume_url: `https://frczxnikwppbeoouokmb.supabase.co/storage/v1/object/public/resumes/resume_${app.candidate_id}.pdf`
              };
            })
          ).catch(() => []) // Silently ignore if job fetch fails
        );

        const results = await Promise.all(promises);
        return results.flat();
      }
      return [];
    },
    enabled: !!role,
  });
};

export const useGetApplication = (id) => {
  return useQuery({
    queryKey: ['application', id],
    queryFn: async () => {
      // Fetch details by checking my applications or search
      const response = await api.get('/applications/my');
      const app = response.data.find(a => String(a.id) === String(id));
      if (!app) {
        throw new Error('Application details not found');
      }
      const name = getCandidateName(app.candidate_id);
      return {
        ...app,
        candidate_name: name,
        candidate_email: getCandidateEmail(app.candidate_id, name),
      };
    },
    enabled: !!id,
  });
};

export const useApplyToJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const jobId = payload?.job_id || payload?.job?.id || payload;
      const response = await api.post('/applications/', { job_id: Number(jobId) });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Your application was submitted successfully!');
    },
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await api.put(`/applications/${id}`, { status });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application', data.id] });
      toast.success(`Application status updated to ${data.status}!`);
    },
  });
};
