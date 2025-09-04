export interface Balance {
  id: number;
  user_id: string;
  currency_id: number;
  available_balance: string;
  current_balance: string;
  reserved_balance: string;
  reference_number: string;
}

export interface BalanceDisplay {
  currency: string;
  amount: number;
  formatted: string;
  originalData?: Balance;
}

export interface Transaction {
  wallet_id: number;
  type: "top-up" | "withdrawal";
  status: "pending" | "completed" | "failed";
  reason: string;
  amount: number;
  currency_id: number;
  created_at: string;
}

export interface TransactionDisplay {
  id: string;
  type: "in" | "out" | "fee";
  status: "successful" | "pending" | "failed";
  amount: number;
  currency: string;
  formattedAmount: string;
  description: string;
  timestamp: string;
  date: string;
  category?: string;
  reference?: string;
}

export interface TransactionFilters {
  dateFrom?: Date | null;
  dateTo?: Date | null;
  status?: string[];
  category?: string[];
}

export interface PaginationParams {
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface WalletState {
  balances: Balance[];
  primaryCurrency: string;
  transactions: Transaction[];
  filters: TransactionFilters;
  pagination: PaginationParams;
  isLoading: boolean;
  error: string | null;
}
