import { IPayloadGenerateMultiPresignedUrl } from '@/interfaces/audit/audit.interface';
import { axiosInstance } from '../axiosInstance';
import { API_ENDPOINTS } from '../constants';

export const generateMultiplePresignedUrl = async (payload: IPayloadGenerateMultiPresignedUrl) => {
  return axiosInstance
    .put(API_ENDPOINTS.GENERATE_MULTIPLE_PRESIGNED_URL, payload)
    .then((res) => res.data);
};

export const uploadFileByPresignedUrl = async (url: string, file: File) => {
  return fetch(url, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type
    }
  });
};
