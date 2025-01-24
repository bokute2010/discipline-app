import {
  IPayloadCreate,
  IPayloadDelete,
  IPayloadUpdate
} from '@/interfaces/saved-prompt.interface';
import { axiosInstance } from '../axiosInstance';
import { API_ENDPOINTS } from '../constants';

export const requestCreateSavedPrompt = async (payload: IPayloadCreate) => {
  return axiosInstance.post(API_ENDPOINTS.CREATE_SAVED_PROMPT, payload).then((res) => res.data);
};

export const requestUpdateSavedPrompt = async (payload: IPayloadUpdate) => {
  return axiosInstance.post(API_ENDPOINTS.UPDATE_SAVED_PROMPT, payload).then((res) => res.data);
};

export const requestDeleteSavedPrompt = async (payload: IPayloadDelete) => {
  return axiosInstance.post(API_ENDPOINTS.DELETE_SAVED_PROMPT, payload).then((res) => res.data);
};
