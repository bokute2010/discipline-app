import { useMutation } from '@tanstack/react-query';

import {
  ICreateUserResponse,
  IPayloadCreateUser,
  IPayloadUpdateUserProfile
} from '@/interfaces/user.interface';
import { createUser, updateUserProfile } from '../requests/user.request';
import { toast } from 'react-toastify';

// Update user profile hook
export const useUpdateUserProfile = (
  cbSuccess?: (data: unknown) => void,
  cbFailed?: (error: unknown) => void
) => {
  return useMutation({
    mutationFn: async (payload: IPayloadUpdateUserProfile) => {
      return updateUserProfile(payload);
    },
    onSuccess: (data) => {
      console.log(data);
      toast.success('Profile updated successfully');
      cbSuccess?.(data);
    },
    onError: (error) => {
      console.log(error);
    }
  });
};

export const useCreateUser = (
  cbSuccess?: (data: unknown) => void,
  cbFailed?: (error: unknown) => void
) => {
  return useMutation({
    mutationFn: async (payload: IPayloadCreateUser) => {
      return createUser(payload);
    },
    onSuccess: ({ data, message }: ICreateUserResponse) => {
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
