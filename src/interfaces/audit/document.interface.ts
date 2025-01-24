export interface IDocument {
  client_id: number;
  created_at: string;
  id: number;
  is_clean: boolean;
  name: string;
  type: string;
  updated_at: string;
  url: string;
}

export interface IDocumentResponse {
    message: string;
    data: IDocument[];
    status: string;
}