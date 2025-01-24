export interface IResponseChatRag {
  response: string;
  retriever: string[];
}

export interface IChatRagMessage {
  prompt?: string;
  response?: IResponseChatRag;
  time?: string;
  out?: boolean;
  uuid?: string;
}

export interface IChatRagHistoryMessage {
  id: number;
  created_at: string;
  prompt: string;
  response: string;
  retriever: string[];
}
