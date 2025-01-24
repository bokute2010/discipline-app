export interface IPayloadGenerateMultiPresignedUrl {
  file_names: string[];
}

export interface IChatAuditMessage {
  prompt?: string;
  response?: string;
  time?: string;
  out?: boolean;
}

export interface IChatAuditHistoryMessage {
  id: number;
  created_at: string;
  prompt: string;
  response: string;
}
