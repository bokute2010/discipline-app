import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS, QUERY_KEYS } from '../constants';
import { axiosInstance } from '../axiosInstance';
import { ISavedPromptItem } from '@/interfaces/saved-prompt.interface';

export const useFetchSavedPrompt = () => {
  return useQuery<ISavedPromptItem[]>({
    queryKey: [QUERY_KEYS.SAVED_PROMPT],
    queryFn: async () => {
      const { data } = await axiosInstance.post(API_ENDPOINTS.SAVED_PROMPT);
      return data.data;
    }
  });
};
