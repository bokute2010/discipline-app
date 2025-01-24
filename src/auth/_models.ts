
export interface AuthModel {
  AccessToken: string;
}


export interface IResponseSignUp {
  status: string;
  message: string;
  data: any;
}


export interface IResponseFetchUser {
  status: string;
  message: string;
  data: UserModel;
}

export interface UserModel {
  full_name: string;
  id: number;
  cognito_subject_id: string;
  username: string;
  email: string;
  role: string;
  email_verified: boolean;
  first_name: string;
  last_name: string;
  age: number | null;
  gender: string | null;
  avatar_url: string | null;
  country: string | null;
  city: string | null;
  created_at: string;
  updated_at: string;
}


