import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { toast } from '../utils/toast';

export const useGetCandidateResume = (candidateId) => {
  return useQuery({
    queryKey: ['resume', candidateId],
    queryFn: async () => {
      const response = await api.get(`/resumes/candidate/${candidateId}`);
      return response.data;
    },
    enabled: !!candidateId,
    retry: false, // Don't spam retries if the user hasn't uploaded a resume yet
  });
};

export const useUploadResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ file, onProgress }) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/resumes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          if (onProgress) {
            onProgress(percentCompleted);
          }
        },
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate both general and specific resume queries
      queryClient.invalidateQueries({ queryKey: ['resume'] });
      toast.success('Resume uploaded successfully!');
    },
  });
};

export const useParseResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (resumeId) => {
      const response = await api.post(`/resumes/parse/${resumeId}`);
      return response.data;
    },
    onSuccess: (data, resumeId) => {
      queryClient.invalidateQueries({ queryKey: ['resume'] });
      toast.success('Resume parsed successfully by AI parser!');
    },
  });
};
