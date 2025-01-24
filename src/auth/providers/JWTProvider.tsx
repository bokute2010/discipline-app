/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { confirmResetPassword, fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import axios, { AxiosResponse } from 'axios';
import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useEffect,
  useState
} from 'react';
import { WS_URL } from '@/api/config';
import * as authHelper from '../_helpers';
import { IResponseFetchUser, IResponseSignUp, type AuthModel, type UserModel } from '@/auth';
import { axiosInstance } from '@/api/axiosInstance';
import {
  signIn,
  signOut,
  signUp,
  resetPassword,
  confirmSignUp,
  resendSignUpCode
} from 'aws-amplify/auth';
import { toast } from 'react-toastify';


const API_URL = import.meta.env.VITE_APP_API_URL;

export const GET_USER_BY_ACCESSTOKEN_URL = `/user/me`;
export const REGISTER_URL = `/auth/signup`;

interface AuthContextProps {
  isLoading: boolean;
  auth: AuthModel | undefined;
  saveAuth: (auth: AuthModel | undefined) => void;
  currentUser: UserModel | undefined;
  setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>;
  login: (
    email: string,
    password: string,
    onVerify: () => void,
    onSuccess: () => void
  ) => Promise<void>;
  loginWithGoogle?: () => Promise<void>;
  loginWithFacebook?: () => Promise<void>;
  loginWithGithub?: () => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  confirmRegister: (username: string, code: string) => Promise<void>;
  resendCodeConfirmRegister: (username: string) => Promise<void>;
  handleResetPassword: (email: string) => Promise<void>;
  handleConfirmResetPassword: (email: string, code: string, password: string) => Promise<void>;
  resendCodeResetPassword: (username: string) => Promise<void>;
  getUser: () => Promise<AxiosResponse<any>>;
  logout: () => void;
  verify: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | null>(null);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<AuthModel | undefined>(authHelper.getAuth());
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>();
  
  // Verity user session and validate bearer authentication
  const verify = async () => {
    if (auth) {
      try {
        const { data } = await getUser();
        console.log('data', data);
        setCurrentUser(data?.data);
      } catch (error) {
        console.error('An error occurred during verify.', error);
        saveAuth(undefined);
        setCurrentUser(undefined);
      }
    }
  };

  useEffect(() => {
    verify().finally(() => {
      // delay for layout initialization
      setLoading(false);
    });
  }, []);

  // Set auth object and save it to local storage
  const saveAuth = (auth: AuthModel | undefined) => {
    setAuth(auth);
    if (auth) {
      authHelper.setAuth(auth);
    } else {
      authHelper.removeAuth();
    }
  };

  
  // Login user with email and password
  const login = async (
    username: string,
    password: string,
    onVerify?: () => void,
    onSuccess?: () => void
  ) => {
    try {
      await signOut();
      const { isSignedIn, nextStep } = await signIn({ username, password });
      if (isSignedIn) {
        const accessToken: string = await getAccessToken();
        const subjectId: string = await getSubjectId();
        localStorage.setItem('subjectId', subjectId);
        saveAuth({ AccessToken: accessToken });
      
        if (onSuccess) {
          onSuccess();
        }
      } else if (nextStep.signInStep === 'CONFIRM_SIGN_UP' && onVerify) {
        toast.warning('Vui lòng xác nhận địa chỉ email của bạn');
        onVerify();
      }
    } catch (error: any) {
      console.error('An error occurred during login.', error);
      const errorMessage = error?.response?.data?.message || 'An error occurred during login.';
      const errorStatus = error?.response?.data?.status;
      saveAuth(undefined);
      throw new Error(errorMessage);
    }
  };

  // Register user using default registraion information
  const register = async (username: string, email: string, password: string) => {
    try {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email
          }
        }
      });
      if (userId) {
        // localStorage.setItem('signup_userId', userId);
        localStorage.setItem('signup_username', username);
        localStorage.setItem('signup_email', email);
        localStorage.setItem('isNew', 'true');
      }
    } catch (error: any) {
      console.error('An error occurred during signup.', error);
      const errorMessage = error?.response?.data?.message || 'An error occurred during signup.';
      const errorStatus = error?.response?.data?.status;
      saveAuth(undefined);
      throw new Error(errorMessage);
    }
  };

  // Register user using default registraion information
  const confirmRegister = async (username: string, code: string) => {
    try {
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username,
        confirmationCode: code
      });
      if (isSignUpComplete) {
        toast.success('Tài khoản của bạn đã được xác nhận');
      }
    } catch (error: any) {
      console.error('An error occurred during confirm signup.', error);
      const errorMessage =
        error?.response?.data?.message || 'An error occurred during confirm signup.';
      saveAuth(undefined);
      throw new Error(errorMessage);
    }
  };

  const resendCodeConfirmRegister = async (username: string) => {
    try {
      await resendSignUpCode({ username });
      toast.success('Mã xác nhận đã được gửi lại');
    } catch (error: any) {
      console.error('An error occurred during resend code confirm signup.', error);
      alert(error.response.data.message);
      throw new Error(`Error ${error}`);
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      await resetPassword({ username: email });
    } catch (error: any) {
      console.error('An error occurred during reset password.', error);
      const errorMessage =
        error?.response?.data?.message || 'An error occurred during reset password.';
      const errorStatus = error?.response?.data?.status;
      saveAuth(undefined);
      throw new Error(errorMessage);
    }
  };

  const handleConfirmResetPassword = async (email: string, code: string, password: string) => {
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword: password
      });
    } catch (error: any) {
      console.error('An error occurred during confirm password.', error);
      const errorMessage =
        error?.response?.data?.message || 'An error occurred during confirm password.';
      saveAuth(undefined);
      throw new Error(errorMessage);
    }
  };

  const resendCodeResetPassword = async (username: string) => {
    try {
      await resetPassword({ username });
      toast.success('Mã xác nhận đã được gửi lại');
    } catch (error: any) {
      console.error('An error occurred during resend code reset password.', error);
      alert(error.response.data.message);
      throw new Error(`Error ${error}`);
    }
  };
  // Returns user by using bearer authentication token
  const getUser = async () => {
    return await axiosInstance.post<IResponseFetchUser>(GET_USER_BY_ACCESSTOKEN_URL);
  };

  // Delete auth local storage and resets current user state
  const logout = async () => {
    await signOut();
    saveAuth(undefined);
    setCurrentUser(undefined);
  };

  const getAccessToken = async () => {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();
    if (!token) {
      throw new Error('No access token found');
    }
    return token;
  };

  const getSubjectId = async () => {
    const session = await fetchAuthSession();
    const subjectId = session.userSub?.toString();
    if (!subjectId) {
      throw new Error('No access token found');
    }
    return subjectId;
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading: loading,
        auth,
        saveAuth,
        currentUser,
        setCurrentUser,
        login,
        register,
        confirmRegister,
        resendCodeConfirmRegister,
        handleResetPassword,
        handleConfirmResetPassword,
        resendCodeResetPassword,
        getUser,
        logout,
        verify
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
