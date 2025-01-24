import { IResponseFetchUser } from '@/auth';
import { axiosInstance } from '../axiosInstance';
import { API_ENDPOINTS } from '../constants';
import { IPayloadCreateUser, IPayloadUpdateUserProfile } from '@/interfaces/user.interface';

/**
 * Updates the user profile with the provided information.
 *
 * @param payload - An object containing optional fields to update:
 *  - `first_name`: The user's first name.
 *  - `last_name`: The user's last name.
 *  - `avatar_url`: The URL of the user's avatar.
 *  - `password`: The user's new password.
 *
 * @returns A promise that resolves to the server's response containing the updated user data.
 */

export const updateUserProfile = async (payload: IPayloadUpdateUserProfile) => {
  return axiosInstance
    .post<IResponseFetchUser>(API_ENDPOINTS.UPDATE_USER_PROFILE, payload)
    .then((res) => res.data);
};

export const createUser = async (payload: IPayloadCreateUser) => {
  return axiosInstance
    .post<IResponseFetchUser>(API_ENDPOINTS.CREATE_USER, payload)
    .then((res) => res.data);
}