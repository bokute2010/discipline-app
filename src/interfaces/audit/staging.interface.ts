export interface IStagingCdps {
  id: number;
  account_number: string;
  start_debt_money: number;
  start_credit_money: number;
  debt_arises_money: number;
  credit_arises_money: number;
  end_debt_money: number;
  end_credit_money: number;
  created_at: string;
  updated_at: string;
  document_id: number;
  year: number;
}

export interface IStagingCdpsResponse {
  message: string;
  data: IStagingCdps[];
  status: string;
}

export interface IStagingNkc {
  id: number;
  account_debt: number;
  account_credit: number;
  money: number;
  receipt_number: string;
  description: string;
  created_at: string;
  updated_at: string;
  document_id: number;
}

export interface IStagingNkcResponse {
  message: string;
  data: IStagingNkc[];
  status: string;
}
