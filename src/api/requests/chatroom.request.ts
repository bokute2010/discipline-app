import { axiosInstance } from '../axiosInstance';
import { API_ENDPOINTS } from '../constants';
import {
  IPayloadCreateChatRoom,
  IPayloadDeleteChatRoom,
  IPayloadUpdateChatRoom
} from '@/interfaces/chat-room.interface';

export const requestCreateChatRoom = async (payload: IPayloadCreateChatRoom) => {
  return axiosInstance.post(API_ENDPOINTS.CREATE_CHAT_ROOM, payload).then((res) => res.data);
};

export const requestUpdateChatRoom = async (payload: IPayloadUpdateChatRoom) => {
  return axiosInstance.post(API_ENDPOINTS.UPDATE_CHAT_ROOM, payload).then((res) => res.data);
};

export const requestDeleteChatRoom = async (payload: IPayloadDeleteChatRoom) => {
  return axiosInstance.post(API_ENDPOINTS.DELETE_CHAT_ROOM, payload).then((res) => res.data);
};
