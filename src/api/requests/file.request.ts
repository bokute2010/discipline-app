import { IPayloadGeneratePresignUrl } from '@/interfaces/file.interface';
import { axiosInstance } from '../axiosInstance';
import { API_ENDPOINTS } from '../constants';

export const requestGeneratePresignedUrlRead = async (payload: IPayloadGeneratePresignUrl) => {
  return axiosInstance
    .post(API_ENDPOINTS.GENERATE_PRESIGNED_URL_READ, payload)
    .then((res) => res.data);
};

export const requestGeneratePresignedUrlPut = async (payload: IPayloadGeneratePresignUrl) => {
  return axiosInstance
    .post(API_ENDPOINTS.GENERATE_PRESIGNED_URL_PUT, payload)
    .then((res) => res.data);
};
