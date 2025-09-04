import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  WalletState,
  Transaction,
  TransactionFilters,
  Balance,
} from "../../types/wallet";

const initialState: WalletState = {
  balances: [
    {
      id: 1,
      user_id: "1",
      currency_id: 1,
      available_balance: "0.00",
      current_balance: "0.00",
      reserved_balance: "0.00",
      reference_number: "WAL001",
    },
  ],
  primaryCurrency: "EUR",
  transactions: [],
  filters: {},
  pagination: {
    page: 1,
    limit: 20,
    hasMore: true,
  },
  isLoading: false,
  error: null,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setBalances: (state, action: PayloadAction<Balance[]>) => {
      state.balances = action.payload;
    },
    setPrimaryCurrency: (state, action: PayloadAction<string>) => {
      state.primaryCurrency = action.payload;
    },
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
    },
    addTransactions: (state, action: PayloadAction<Transaction[]>) => {
      const existingKeys = new Set(
        state.transactions.map((t) => `${t.wallet_id}_${t.created_at}`)
      );
      const newTransactions = action.payload.filter(
        (t) => !existingKeys.has(`${t.wallet_id}_${t.created_at}`)
      );
      state.transactions = [...state.transactions, ...newTransactions];
    },
    updateFilters: (
      state,
      action: PayloadAction<Partial<TransactionFilters>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1;
      state.pagination.hasMore = true;
    },
    setPagination: (
      state,
      action: PayloadAction<Partial<typeof state.pagination>>
    ) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearTransactions: (state) => {
      state.transactions = [];
      state.pagination.page = 1;
      state.pagination.hasMore = true;
    },
  },
});

export const {
  setLoading,
  setError,
  setBalances,
  setPrimaryCurrency,
  setTransactions,
  addTransactions,
  updateFilters,
  setPagination,
  clearTransactions,
} = walletSlice.actions;

export default walletSlice.reducer;
