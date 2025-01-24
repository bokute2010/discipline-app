import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '../constants';
import {
  requestCreateSavedPrompt,
  requestDeleteSavedPrompt,
  requestUpdateSavedPrompt
} from '../requests';
import {
  IPayloadCreate,
  IPayloadDelete,
  IPayloadUpdate,
  ISavedPromptCreateResponse
} from '@/interfaces/saved-prompt.interface';
import { toast } from 'react-toastify';

export const useSavedPromptCreate = (
  // eslint-disable-next-line no-unused-vars
  cbSuccess?: (data: unknown) => void,
  // eslint-disable-next-line no-unused-vars
  cbFailed?: (error: unknown) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IPayloadCreate) => requestCreateSavedPrompt(payload),
    onSuccess: ({ data, message }: ISavedPromptCreateResponse) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SAVED_PROMPT] });
      toast.success(message);
      console.log(message);
      cbSuccess?.(data);
    },
    onError: (error: any) => {
      const errorMessage =
        (error as any)?.response?.data?.message || 'An error occurred while creating saved prompt';
      toast.error(errorMessage);
      console.error('An error occurred while creating saved prompt:', error);
      cbFailed?.(error);
    }
  });
};

export const useSavedPromptUpdate = (
  // eslint-disable-next-line no-unused-vars
  cbSuccess?: (data: unknown) => void,
  // eslint-disable-next-line no-unused-vars
  cbFailed?: (error: unknown) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IPayloadUpdate) => requestUpdateSavedPrompt(payload),
    onSuccess: ({ data, message }: ISavedPromptCreateResponse) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SAVED_PROMPT] });
      console.log(message);
      cbSuccess?.(data);
    },
    onError: (error: any) => {
      const errorMessage =
        (error as any)?.response?.data?.message || 'An error occurred while updating saved prompt';
      toast.error(errorMessage);
      console.error('An error occurred while updating saved prompt:', error);
      cbFailed?.(error);
    }
  });
};

export const useSavedPromptDelete = (
  // eslint-disable-next-line no-unused-vars
  cbSuccess?: (data: unknown) => void,
  // eslint-disable-next-line no-unused-vars
  cbFailed?: (error: unknown) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: IPayloadDelete) => requestDeleteSavedPrompt(id),
    onSuccess: ({ message }: ISavedPromptCreateResponse) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SAVED_PROMPT] });
      toast.success(message);
      cbSuccess?.(message);
    },
    onError: (error: any) => {
      const errorMessage =
        (error as any)?.response?.data?.message || 'An error occurred while deleting saved prompt';
      toast.error(errorMessage);
      console.error('An error occurred while deleting saved prompt:', error);
      cbFailed?.(error);
    }
  });
};
