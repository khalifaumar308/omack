export interface WalletBalance {
  balance: number;
}

export interface WalletTransaction {
  _id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  status: 'success' | 'pending' | 'failed'; // Changed to match API
  createdAt: string;
  metadata?: Record<string, unknown>;
  reference?: string;
  payableId?: string;
  studentId: string;
  schoolId: string;
}

export interface WalletTransactionsResponse {
  transactions: WalletTransaction[];
  pagination: {
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface InitiateWalletFundingRequest {
  amount: number;
}

export interface InitiateWalletFundingResponse {
  authorization_url: string;
  reference: string;
}

export interface VerifyWalletFundingResponse {
  success: boolean;
  message: string;
  transaction?: WalletTransaction;
}