import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS, QUERY_KEYS } from '../constants';
import { axiosInstance } from '../axiosInstance';
import { IChatRoom } from '@/interfaces/chat-room.interface';

export const useFetchChatRooms = () => {
  return useQuery<IChatRoom[]>({
    queryKey: [QUERY_KEYS.CHAT_ROOM],
    queryFn: async () => {
      const { data } = await axiosInstance.post(API_ENDPOINTS.CHAT_ROOM);
      return data.data;
    }
  });
};
