export interface IAssistant {
  id: number;
  name: string;
  description?: string;
  avatar_url?: string;
}

export interface IAssistantResponse {
  message: string;
  data: IAssistant[];
  status: string;
}
