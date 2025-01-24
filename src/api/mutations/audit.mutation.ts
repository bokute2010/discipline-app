import { IPayloadGenerateMultiPresignedUrl } from '@/interfaces/audit/audit.interface';
import { useMutation } from '@tanstack/react-query';
import { generateMultiplePresignedUrl, uploadFileByPresignedUrl } from '../requests/audit.request';

export const useGenerateMultiPresignedUrls = (
  cbSuccess?: (data: any) => void,
  cbFailed?: (error: unknown) => void
) => {
  return useMutation({
    mutationFn: (payload: IPayloadGenerateMultiPresignedUrl) =>
      generateMultiplePresignedUrl(payload),
    onSuccess: ({ data }) => {
      // console.log(data);
      cbSuccess?.(data);
    },
    onError: (error) => {
      console.error('An error occurred while generating presigned URLs:', error);
      cbFailed?.(error);
    }
  });
};

export const useUploadFileByPresignedUrl = () => {
  return useMutation({
    mutationFn: (payload: { url: string; file: File }) =>
      uploadFileByPresignedUrl(payload.url, payload.file),
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.error('An error occurred while uploading the file:', error);
    }
  });
};
