import { IAssistant } from "./assistant.interface";

export interface ISavedPromptItem {
  id: number;
  title: string;
  content: string;
  user_id: string;
  assistant: IAssistant;
  created_at: string;
  updated_at: string;
}

export interface ISavedPromptCreateResponse {
  data: ISavedPromptItem;
  message: string;
}

export interface IPayloadCreate {
  title: string;
  content: string;
  assistant_id: number;
}

export interface IPayloadUpdate {
  content: string;
  title: string;
  id: number;
}

export interface IPayloadDelete {
  id: number;
}

export interface INavigateState {
  assistant_id: number;
  content: string;
}
