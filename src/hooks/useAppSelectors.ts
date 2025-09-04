import { useMemo } from "react";
import { useAppSelector } from "../store";

export const useAuthSelectors = () => {
  const authState = useAppSelector((state) => state.auth);

  return useMemo(
    () => ({
      isAuthenticated: authState.isAuthenticated,
      isLoading: authState.isLoading,
      accessToken: authState.accessToken,
    }),
    [authState.isAuthenticated, authState.isLoading, authState.accessToken]
  );
};

export const useWalletSelectors = () => {
  const walletState = useAppSelector((state) => state.wallet);

  return useMemo(
    () => ({
      balances: walletState.balances,
      transactions: walletState.transactions,
      filters: walletState.filters,
      pagination: walletState.pagination,
      isLoading: walletState.isLoading,
      error: walletState.error,
    }),
    [
      walletState.balances,
      walletState.transactions,
      walletState.filters,
      walletState.pagination,
      walletState.isLoading,
      walletState.error,
    ]
  );
};

export const usePrimaryBalance = () => {
  const balances = useAppSelector((state) => state.wallet.balances);

  return useMemo(() => {
    if (!balances || !Array.isArray(balances)) {
      return {
        currency: "EUR",
        amount: 0,
        formatted: "0.00 EUR",
      };
    }

    const balance = balances.find((b) => b.currency_id === 1) || balances[0];

    if (!balance) {
      return {
        currency: "EUR",
        amount: 0,
        formatted: "0.00 EUR",
      };
    }

    const amount = parseFloat(
      balance.available_balance || balance.current_balance || "0"
    );
    const currency =
      balance.currency_id === 1
        ? "EUR"
        : balance.currency_id === 2
          ? "USD"
          : balance.currency_id === 3
            ? "GBP"
            : "EUR";

    return {
      currency,
      amount,
      formatted: `${amount.toFixed(2)} ${currency}`,
      originalData: balance,
    };
  }, [balances]);
};
