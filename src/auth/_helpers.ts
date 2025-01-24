import { User as Auth0UserModel } from '@auth0/auth0-spa-js';

import { getData, setData } from '@/utils';
import { type AuthModel } from './_models';
import axios, { AxiosInstance } from 'axios';

const AUTH_LOCAL_STORAGE_KEY = `${import.meta.env.VITE_APP_NAME}-auth-v${
  import.meta.env.VITE_APP_VERSION
}`;

const getAuth = (): AuthModel | undefined => {
  try {
    const auth = getData(AUTH_LOCAL_STORAGE_KEY) as AuthModel | undefined;

    if (auth) {
      return auth;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error('AUTH LOCAL STORAGE PARSE ERROR', error);
  }
};

const getAuth0 = (): Auth0UserModel | undefined => {
  try {
    const auth = getData(AUTH_LOCAL_STORAGE_KEY) as Auth0UserModel | undefined;

    if (auth) {
      // You can easily check auth_token expiration also
      return auth;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error('AUTH LOCAL STORAGE PARSE ERROR', error);
  }
};

const setAuth = (auth: AuthModel | Auth0UserModel) => {
  setData(AUTH_LOCAL_STORAGE_KEY, auth);
};

const removeAuth = () => {
  if (!localStorage) {
    return;
  }

  try {
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
  } catch (error) {
    console.error('AUTH LOCAL STORAGE REMOVE ERROR', error);
  }
};

export function setupAxios(axios: any) {
  axios.defaults.headers.Accept = 'application/json';
  axios.interceptors.request.use(
    (config: { headers: { Authorization: string } }) => {
      const auth = getAuth();
      // console.log('auth', auth?.AccessToken);

      if (auth?.AccessToken) {
        config.headers.Authorization = `Bearer ${auth.AccessToken}`;
      }

      return config;
    },
    async (err: any) => await Promise.reject(err)
  );
}

export { AUTH_LOCAL_STORAGE_KEY, getAuth, getAuth0, removeAuth, setAuth };
