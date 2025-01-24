import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS, QUERY_KEYS } from '../constants';
import { axiosInstance } from '../axiosInstance';
import { IAssistant } from '@/interfaces/assistant.interface';

export const useFetchAssistants = () => {
  return useQuery<IAssistant[]>({
    queryKey: [QUERY_KEYS.ASSISTANT],
    queryFn: async () => {
      const { data } = await axiosInstance.post(API_ENDPOINTS.ASSISTANT);
      return data.data;
    }
  });
};
