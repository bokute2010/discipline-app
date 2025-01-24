import { updatePassword } from 'aws-amplify/auth';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useUpdateUserProfile } from '@/api/mutations/user.mutation';
import {
  generateMultiplePresignedUrl,
  uploadFileByPresignedUrl
} from '@/api/requests/audit.request';
import { useAuthContext } from '@/auth';
import { IImageInputFile, IImageInputOnchange } from '@/components/image-input';
import { toAbsoluteUrl } from '@/utils';
import { useGeneratePresignedUrlPut } from '@/api/mutations/file.mutation';

// Hook to manage user profile
const useUserProfile = () => {
  const { mutate: generate_presigned_url } = useGeneratePresignedUrlPut(
    onGeneratePresignedUrlSuccess
  );
  const { currentUser, setCurrentUser } = useAuthContext();

  // Simplified user for accessing nested attributes without additional expressions
  const user = useMemo(
    () =>
      currentUser || {
        first_name: '',
        last_name: '',
        avatar_url: '',
        email: '',
        full_name: '',
        gender: '',
        country: '',
        city: ''
      },
    [currentUser]
  );

  const { mutateAsync: mutateUserProfile } = useUpdateUserProfile(onUpdateUserProfileSuccess);

  const [isEditingName, setIsEditingName] = useState(false);
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [fullName, setFullName] = useState(user.full_name);
  const [selected_file, setSelectedFile] = useState<File | null>(null);
  const [avatarInput, setAvatarInput] = useState<IImageInputFile[]>([]);
  const keyAvatar = useRef<string | null>(null);
  const fallbackAvatar = useMemo(
    () => user.avatar_url || toAbsoluteUrl(`/media/avatars/blank.png`),
    [user.avatar_url]
  );

  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [shouldShowPassword, setShouldShowPassword] = useState(false);

  const revertChanges = useCallback(() => {
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setFullName(user.full_name);
    setAvatarInput([{ dataURL: fallbackAvatar }]);
  }, [user, fallbackAvatar]);

  async function onGeneratePresignedUrlSuccess(data: any) {
    if (!selected_file) {
      return;
    }
    await uploadFileByPresignedUrl(data.presign_url, selected_file);

    
    keyAvatar.current && mutateUserProfile({ avatar_url: keyAvatar.current });
  }

  function onUpdateUserProfileSuccess(data: any) {
    console.log('onUpdateUserProfileSuccess', data);
    setCurrentUser(data.data);
    // if (!keyAvatar.current) {
    //   return;
    // }
    // updateUserProfile({ avatar_url: keyAvatar.current });
  }

  const updateUserProfile = async (payload: { first_name?: string; last_name?: string, avatar_url?: string }) => {
    try {
      const res = await mutateUserProfile(payload);
      console.log('res', res);

      setCurrentUser(res.data);
    } catch {
      revertChanges();
    }
  };

  const changeAvatar: IImageInputOnchange = async (selectedAvatar) => {
    try {
      // Set ui avatar
      const url = selectedAvatar[0].dataURL;
      setAvatarInput([{ dataURL: url }]);

      // Upload avatar
      const image = selectedAvatar.length ? selectedAvatar[0] : undefined;

      if (image) {
        setSelectedFile(image.file as File);
        const key = `user_avatars/${currentUser?.cognito_subject_id}/${image.file?.name}`;
        keyAvatar.current = key;
        generate_presigned_url({ key });

        // mutateUserProfile({ avatar_url: key });
      }
    } catch {
      revertChanges();
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      await updatePassword({
        oldPassword,
        newPassword
      });

      return true;
    } catch (error: any) {
      console.error(error);
      alert('Error updating password: ' + error.message);
      return false;
    }
  };

  const toggleShouldShowPassword = () => {
    setShouldShowPassword(!shouldShowPassword);
  };

  useEffect(() => {
    revertChanges();
  }, [revertChanges]);

  return {
    currentUser: user,
    isEditingName,
    isEditingPassword,
    setIsEditingName,
    setIsEditingPassword,
    updateUserProfile,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    fullName,
    setFullName,
    avatarInput,
    avatar: fallbackAvatar,
    changeAvatar,
    changePassword,
    shouldShowPassword,
    toggleShouldShowPassword
  };
};

export { useUserProfile };
