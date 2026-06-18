import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '../utils/toast';

// Helper to simulate network latency
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Retrieve application data from local storage
const getStoredApplications = () => {
  const data = localStorage.getItem('portal_applications');
  return data ? JSON.parse(data) : [];
};

// Save applications to local storage
const saveStoredApplications = (apps) => {
  localStorage.setItem('portal_applications', JSON.stringify(apps));
};

export const useGetApplications = (role, userId) => {
  return useQuery({
    queryKey: ['applications', role, userId],
    queryFn: async () => {
      await delay(800); // Simulate network latency
      const apps = getStoredApplications();
      
      if (role === 'applicant') {
        return apps.filter((app) => app.candidate_id === userId);
      } else if (role === 'recruiter') {
        // Return applications. Since recruiter jobs might be filtered, in mock we return all
        return apps;
      }
      return apps;
    },
  });
};

export const useGetApplication = (id) => {
  return useQuery({
    queryKey: ['application', id],
    queryFn: async () => {
      await delay(400);
      const apps = getStoredApplications();
      const app = apps.find((a) => a.id === id);
      if (!app) throw new Error('Application not found');
      return app;
    },
    enabled: !!id,
  });
};

export const useApplyToJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ job, candidate, resumeUrl }) => {
      await delay(1000); // Simulate network latency
      const apps = getStoredApplications();
      
      // Check if already applied
      const alreadyApplied = apps.some(
        (app) => app.job_id === job.id && app.candidate_id === candidate.id
      );

      if (alreadyApplied) {
        throw new Error('You have already applied for this job!');
      }

      const newApp = {
        id: `app-${Math.random().toString(36).substring(2, 9)}`,
        job_id: job.id,
        job_title: job.title,
        job_location: job.location,
        job_salary: job.salary,
        candidate_id: candidate.id,
        candidate_name: candidate.name,
        candidate_email: candidate.email,
        resume_url: resumeUrl || '',
        status: 'applied',
        applied_date: new Date().toISOString(),
      };

      apps.push(newApp);
      saveStoredApplications(apps);
      return newApp;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Your application was submitted successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to submit application.');
    },
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => {
      await delay(600);
      const apps = getStoredApplications();
      const appIndex = apps.findIndex((a) => a.id === id);
      
      if (appIndex === -1) {
        throw new Error('Application not found');
      }

      apps[appIndex].status = status;
      saveStoredApplications(apps);
      return apps[appIndex];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application', data.id] });
      toast.success(`Application status updated to ${data.status}!`);
    },
  });
};
