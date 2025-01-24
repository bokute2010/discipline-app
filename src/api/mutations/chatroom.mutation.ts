/* eslint-disable no-unused-vars */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  IChatRoom,
  ICreateChatRoomResponse,
  IPayloadCreateChatRoom,
  IPayloadDeleteChatRoom,
  IPayloadUpdateChatRoom
} from '@/interfaces/chat-room.interface';
import {
  requestCreateChatRoom,
  requestDeleteChatRoom,
  requestUpdateChatRoom
} from '../requests/chatroom.request';
import { QUERY_KEYS } from '../constants';
import { toast } from 'react-toastify';

export const useChatRoomCreate = (
  cbSuccess?: (data: IChatRoom) => void,
  cbFailed?: (error: unknown) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IPayloadCreateChatRoom) => requestCreateChatRoom(payload),
    onSuccess: ({ data, message }: ICreateChatRoomResponse) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHAT_ROOM] });
      console.log(message);
      cbSuccess?.(data);
    },
    onError: (error) => {
      const errorMessage =
        (error as any)?.response?.data?.message || 'An error occurred while creating new chat room';
      toast.error(errorMessage);
      console.error('An error occurred while creating the position:', error);
      cbFailed?.(error);
    }
  });
};

export const useChatRoomUpdate = (
  cbSuccess?: (data: unknown) => void,
  cbFailed?: (error: unknown) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IPayloadUpdateChatRoom) => requestUpdateChatRoom(payload),
    onSuccess: ({ data, message }: ICreateChatRoomResponse) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHAT_ROOM] });
      console.log(message);
      cbSuccess?.(data);
    },
    onError: (error) => {
      const errorMessage =
        (error as any)?.response?.data?.message ||
        'An error occurred while updating the chat room name';
      toast.error(errorMessage);
      console.error('An error occurred while updating the position:', error);
      cbFailed?.(error);
    }
  });
};

export const useChatRoomDelete = (
  cbSuccess?: (data: unknown) => void,
  cbFailed?: (error: unknown) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IPayloadDeleteChatRoom) => requestDeleteChatRoom(payload),
    onSuccess: ({ data, message }: ICreateChatRoomResponse) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHAT_ROOM] });
      console.log(message);
      cbSuccess?.(data);
    },
    onError: (error) => {
      const errorMessage =
        (error as any)?.response?.data?.message || 'An error occurred while deleting the chat room';
      toast.error(errorMessage);
      console.error('An error occurred while deleting the position:', error);
      cbFailed?.(error);
    }
  });
};
