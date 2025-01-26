import { IResponseFetchUser } from '@/auth';
import { axiosInstance } from '../axiosInstance';
import { API_ENDPOINTS } from '../constants';
import { IPayloadCreateUser, IPayloadUpdateUserProfile, IUser } from '@/interfaces/user.interface';



import { db } from '@/config/firebase';
import { doc, setDoc } from 'firebase/firestore';

export const saveUserToFirestore = async (user: IUser): Promise<void> => {
  try {
    const userRef = doc(db, 'users', user.uid); // Reference to the user's document
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      createdAt: new Date().toISOString(),
    });
    console.log('User data saved to Firestore');
  } catch (error) {
    console.error('Error saving user data to Firestore:', (error as Error).message);
    throw error;
  }
};


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