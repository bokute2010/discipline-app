import { IPayloadGeneratePresignUrl } from '@/interfaces/file.interface';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { requestGeneratePresignedUrlPut, requestGeneratePresignedUrlRead } from '../requests/file.request';

export const useGeneratePresignedUrlRead = (
  cbSuccess?: (data: unknown) => void,
  cbFailed?: (error: unknown) => void
) => {
  return useMutation({
    mutationFn: (payload: IPayloadGeneratePresignUrl) => requestGeneratePresignedUrlRead(payload),
    onSuccess: ({ data, message }: any) => {
      console.log(message);
      //   how to download file from presigned url
      window.open(data.presign_url, '_blank');

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
export const useGeneratePresignedUrlPut = (
  cbSuccess?: (data: unknown) => void,
  cbFailed?: (error: unknown) => void
) => {
  return useMutation({
    mutationFn: (payload: IPayloadGeneratePresignUrl) => requestGeneratePresignedUrlPut(payload),
    onSuccess: ({ data, message }: any) => {
      console.log(message);
      //   how to download file from presigned url

      cbSuccess?.(data);
    },
    onError: (error) => {
      const errorMessage =
        (error as any)?.response?.data?.message || 'An error occurred while generating presigned URL';
      toast.error(errorMessage);
      console.error('An error occurred while generating presigned URL:', error);
      cbFailed?.(error);
    }
  });
};
