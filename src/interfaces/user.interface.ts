export interface IPayloadUpdateUserProfile {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}

export interface IPayloadCreateUser {
  username: string;
  email: string;
  sub_id: string;
}

export interface ICreateUserResponse {
  message: string;
  data: any;
}



export interface IUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  totalPoints: number;
  createdAt: string;
  updatedAt: string;
}