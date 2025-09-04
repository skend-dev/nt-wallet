import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "../store";
import {
  setLoading,
  setError,
  setBalances,
  setTransactions,
  addTransactions,
  setPagination,
  updateFilters,
} from "../store/slices/walletSlice";
import { Transaction, Balance, TransactionFilters } from "../types/wallet";
import { apiService } from "../services/api";
import { offlineCacheService } from "../services/offlineCache";

const fetchBalances = async (): Promise<Balance[]> => {
  try {
    const balances = await apiService.getBalances();
    await offlineCacheService.saveBalances(balances);
    return balances;
  } catch (error) {
    const cachedBalances = await offlineCacheService.getCachedBalances();
    if (cachedBalances) {
      return cachedBalances;
    }
    throw error;
  }
};

const fetchTransactions = async (
  page: number = 1,
  limit: number = 20,
  filters?: TransactionFilters
): Promise<{ transactions: Transaction[]; hasMore: boolean }> => {
  try {
    const response = await apiService.getTransactions(page, limit, filters);
    if (page === 1) {
      await offlineCacheService.saveTransactions(response.transactions);
    }
    return {
      transactions: response.transactions,
      hasMore: response.hasMore,
    };
  } catch (error) {
    const cachedTransactions =
      await offlineCacheService.getCachedTransactions();
    if (cachedTransactions) {
      let filteredTransactions = cachedTransactions;

      if (filters?.status && filters.status.length > 0) {
        filteredTransactions = filteredTransactions.filter((t) =>
          filters.status!.includes(t.status)
        );
      }

      if (filters?.category && filters.category.length > 0) {
        const typeMap: { [key: string]: string } = {
          "Top-up": "top-up",
          Withdrawal: "withdrawal",
        };
        const mappedTypes = filters.category
          .map((cat) => typeMap[cat])
          .filter(Boolean);
        filteredTransactions = filteredTransactions.filter((t) =>
          mappedTypes.includes(t.type)
        );
      }

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedTransactions = filteredTransactions.slice(
        startIndex,
        endIndex
      );

      return {
        transactions: paginatedTransactions,
        hasMore: endIndex < filteredTransactions.length,
      };
    }
    throw error;
  }
};

export const useWalletBalances = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const query = useQuery({
    queryKey: ["balances"],
    queryFn: fetchBalances,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: isAuthenticated,
    retry: (failureCount, error) => {
      if (
        error.message.includes("authentication") ||
        error.message.includes("401")
      ) {
        return false;
      }
      return failureCount < 3;
    },
  });

  React.useEffect(() => {
    if (query.data) {
      dispatch(setBalances(query.data));
    }
  }, [query.data, dispatch]);

  React.useEffect(() => {
    if (query.error) {
      dispatch(setError(query.error.message));
    }
  }, [query.error, dispatch]);

  return query;
};

export const useWalletTransactions = (
  page: number,
  filters: TransactionFilters
) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const query = useQuery({
    queryKey: ["transactions", page, filters],
    queryFn: () => fetchTransactions(page, 20, filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
    enabled: isAuthenticated,
    retry: (failureCount, error) => {
      if (
        error.message.includes("authentication") ||
        error.message.includes("401")
      ) {
        return false;
      }
      return failureCount < 3;
    },
  });

  React.useEffect(() => {
    if (query.data) {
      if (page === 1) {
        dispatch(setTransactions(query.data.transactions));
      } else {
        dispatch(addTransactions(query.data.transactions));
      }
      dispatch(
        setPagination({
          page,
          hasMore: query.data.hasMore,
        })
      );
    }
  }, [query.data, page, dispatch]);

  React.useEffect(() => {
    if (query.error) {
      dispatch(setError(query.error.message));
    }
  }, [query.error, dispatch]);

  return query;
};

export const useRefreshWallet = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      dispatch(setLoading(true));
      await queryClient.invalidateQueries({ queryKey: ["balances"] });
      await queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onSettled: () => {
      dispatch(setLoading(false));
    },
  });
};

export const useWalletFilters = () => {
  const filters = useAppSelector((state) => state.wallet.filters);
  const dispatch = useAppDispatch();

  const updateFiltersHandler = (newFilters: Partial<TransactionFilters>) => {
    dispatch(updateFilters(newFilters));
  };

  return { filters, updateFilters: updateFiltersHandler };
};

export const useOfflineCache = () => {
  const queryClient = useQueryClient();

  const seedCache = async (
    balances: Balance[],
    transactions: Transaction[]
  ) => {
    try {
      await offlineCacheService.seedCache(balances, transactions);
    } catch (error) {
      console.error("Error seeding cache:", error);
    }
  };

  const clearCache = async () => {
    try {
      await offlineCacheService.clearCache();
      queryClient.invalidateQueries({ queryKey: ["balances"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  };

  const getCachedData = async () => {
    try {
      return await offlineCacheService.getCachedData();
    } catch (error) {
      console.error("Error getting cached data:", error);
      return null;
    }
  };

  return {
    seedCache,
    clearCache,
    getCachedData,
    isOnline: offlineCacheService.isOnline(),
  };
};
