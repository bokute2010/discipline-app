import { IAssistant } from './assistant.interface';

export interface IPayloadCreateChatRoom {
  user_id: string;
  name?: string;
  description?: string;
  assistant_id: number;
  first_prompt?: string;
}

export interface IPayloadUpdateChatRoom {
  name?: string;
  description?: string;
  id: number;
}

export interface IPayloadDeleteChatRoom {
  id: number;
}

export interface IChatRoom {
  id: number;
  name: string;
  description: string;
  assistant: IAssistant;
}

export interface ICreateChatRoomResponse {
  data: IChatRoom;
  message: string;
}

export interface IChatRoomHistory {
  assistant: {
    id: number;
    name: string;
  };
  messages_audit: IMessageHistory[];
  messages_rag: IMessageHistory[];
  id: number;
  name: string;
  description: string;
  user_id: string;
  assistant_id: number;
  created_at: string;
  updated_at: string;
}

export interface IMessageHistory {
  id: number;
  prompt: string;
  response: string;
  retriever?: string[];
  created_at: string;
  updated_at: string;
}
