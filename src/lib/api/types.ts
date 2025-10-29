// Base Types
export interface Payable {
  _id: string;
  school: string;
  level: number;
  session: string;
  semester: string;
  amount: number;
  dueDate: string;
  description: string;
  partPayment: boolean;
  department?: {
    _id: string;
    name: string;
  };
  isForAllDepartments: boolean;
  amountPaid: number;
  percentagePaid: number;
}

export interface Transaction {
  _id: string;
  amount: number;
  payable: string;
  student: string;
  reference: string;
  status: 'pending' | 'success' | 'failed';
}

// Query Types
export interface PayablesResponse {
  data: Payable[];
  pagination: {
    hasNext: boolean;
    nextCursor: string | null;
    limit: number;
  };
}

export interface PayableFilters {
  limit?: number;
  session?: string;
  semester?: string;
  cursor?: string;
}

export interface WalletTransaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  status: 'completed' | 'pending' | 'failed';
  description: string;
  createdAt: string;
}

export interface WalletBalance {
  balance: number;
  currency: string;
}