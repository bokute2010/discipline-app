import { getAuth } from '@/auth';
import axios, { AxiosInstance } from 'axios';
import { API_URL } from './config';
import ContextPayload from '../utils/DevPayload';

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL
});

// Request interceptor to add token and enrich payload in DEV mode for POST requests
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const auth = getAuth();
      if (auth?.AccessToken) {
        config.headers.Authorization = `Bearer ${auth?.AccessToken}`;
      }

      // Check if the environment is DEV and the method is POST
      if (import.meta.env.VITE_APP_MODE === 'DEV') {
        const context = ContextPayload();
        const originalPayload = config.data || {};
        config.data = {
          context,
          'body-json': { ...originalPayload }
        };
      }
    } catch (error) {
      console.error(error);
    }
    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(error.data);
    return Promise.reject(error);
  }
);
