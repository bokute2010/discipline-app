// hooks/useEvent.ts
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS, QUERY_KEYS } from '../constants';
import { axiosInstance } from '../axiosInstance';
import { IDocumentResponse } from '@/interfaces/audit/document.interface';
import { IStagingCdpsResponse, IStagingNkcResponse } from '@/interfaces/audit/staging.interface';

export const useFetchDocuments = () => {
  return useQuery<IDocumentResponse>({
    queryKey: [QUERY_KEYS.DOCUMENTS],
    queryFn: async () => {
      const response = await axiosInstance.post(API_ENDPOINTS.DOCUMENT);
      return response.data;
    }
  });
};

export const useFetchStagingCdps = () => {
  return useQuery<IStagingCdpsResponse>({
    queryKey: [QUERY_KEYS.STAGING_CDPS],
    queryFn: async () => {
      const response = await axiosInstance.post(API_ENDPOINTS.STAGING_CDPS);
      return response.data;
    }
  });
}

export const useFetchStagingNkc = () => {
  return useQuery<IStagingNkcResponse>({
    queryKey: [QUERY_KEYS.STAGING_NKC],
    queryFn: async () => {
      const response = await axiosInstance.post(API_ENDPOINTS.STAGING_NKC);
      return response.data;
    }
  });
}
