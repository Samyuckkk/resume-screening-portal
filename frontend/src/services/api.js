import axios from 'axios';
import { toast } from '../utils/toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isMeRequest = error.config?.url?.includes('/auth/me') || error.config?.url?.endsWith('/me');

    if (!error.response) {
      if (!isMeRequest) {
        toast.error('Network error. Please check your connection.');
      }
      return Promise.reject(error);
    }

    const { status, data } = error.response;
    const errorMessage = data?.detail || data?.message || 'Something went wrong';

    switch (status) {
      case 400:
        toast.error(errorMessage);
        break;
      case 401:
        if (!isMeRequest) {
          toast.error(errorMessage || 'Unauthorized. Please log in.');
        }
        break;
      case 403:
        toast.error(errorMessage || 'Access denied. You do not have permission.');
        break;
      case 404:
        toast.error(errorMessage || 'Requested resource not found.');
        break;
      case 409:
        toast.error(errorMessage || 'Conflict detected.');
        break;
      case 422:
        if (Array.isArray(data?.detail)) {
          const detailMsg = data.detail.map(e => `${e.loc[e.loc.length - 1]}: ${e.msg}`).join(', ');
          toast.error(`Validation Error: ${detailMsg}`);
        } else {
          toast.error(errorMessage);
        }
        break;
      case 500:
        toast.error('Internal Server Error. Please contact support.');
        break;
      default:
        toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

export default api;
