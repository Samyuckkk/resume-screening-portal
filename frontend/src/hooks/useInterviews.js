import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { toast } from '../utils/toast';

// Helper to manage localStorage for applicant interviews fallback
const getLocalInterviews = () => {
  const data = localStorage.getItem('portal_interviews');
  return data ? JSON.parse(data) : [];
};

const saveLocalInterviews = (interviews) => {
  localStorage.setItem('portal_interviews', JSON.stringify(interviews));
};

export const useGetInterviews = (role) => {
  return useQuery({
    queryKey: ['interviews', role],
    queryFn: async () => {
      if (role === 'applicant') {
        return getLocalInterviews();
      }
      const response = await api.get('/interviews/');
      return response.data;
    },
  });
};

export const useGetInterview = (id) => {
  return useQuery({
    queryKey: ['interview', id],
    queryFn: async () => {
      const local = getLocalInterviews().find(i => i.id === id || String(i.id) === String(id));
      if (local) return local;

      const response = await api.get(`/interviews/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateInterview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (interviewData) => {
      const response = await api.post('/interviews/', interviewData);
      const data = response.data;
      
      const local = getLocalInterviews();
      local.push({
        id: data.id,
        application_id: interviewData.application_id,
        interview_date: interviewData.interview_date,
        interview_time: interviewData.interview_time,
        meeting_link: interviewData.meeting_link,
        feedback: '',
      });
      saveLocalInterviews(local);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
      toast.success('Interview scheduled successfully!');
    },
  });
};

export const useUpdateFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, feedback }) => {
      const response = await api.patch(`/interviews/${id}/feedback`, { feedback });
      const data = response.data;

      const local = getLocalInterviews();
      const idx = local.findIndex(i => i.id === id || String(i.id) === String(id));
      if (idx !== -1) {
        local[idx].feedback = feedback;
        saveLocalInterviews(local);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
      queryClient.invalidateQueries({ queryKey: ['interview', data.id] });
      toast.success('Interview feedback updated.');
    },
  });
};

export const useDeleteInterview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/interviews/${id}`);
      
      const local = getLocalInterviews();
      const filtered = local.filter(i => i.id !== id && String(i.id) !== String(id));
      saveLocalInterviews(filtered);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
      toast.success('Interview deleted successfully.');
    },
  });
};
