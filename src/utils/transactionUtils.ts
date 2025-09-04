import { Transaction, TransactionDisplay } from "../types/wallet";
import { formatTransactionDate, formatMonthKey } from "./dateUtils";

const transactionCache = new Map<string, TransactionDisplay>();
const groupedCache = new Map<string, any>();

const currencyMap = new Map<number, string>([
  [1, "EUR"],
  [2, "USD"],
  [3, "GBP"],
]);

const statusMap = new Map<string, string>([
  ["completed", "successful"],
  ["pending", "pending"],
  ["failed", "failed"],
]);

export const processTransaction = (t: Transaction): TransactionDisplay => {
  const cacheKey = `${t.wallet_id}_${t.created_at}_${t.amount}_${t.type}_${t.status}`;

  if (transactionCache.has(cacheKey)) {
    return transactionCache.get(cacheKey)!;
  }

  const isTopUp = t.type === "top-up";
  const currency = currencyMap.get(t.currency_id) || "EUR";
  const formattedDate = formatTransactionDate(t.created_at);
  const status = statusMap.get(t.status) || "failed";

  const processed: TransactionDisplay = {
    id: `tx_${t.wallet_id}_${t.created_at}_${t.amount}`,
    type: isTopUp ? "in" : "out",
    status: status as "successful" | "pending" | "failed",
    amount: Math.abs(t.amount),
    currency,
    formattedAmount: `${isTopUp ? "+" : ""}${t.amount.toFixed(2)} ${currency}`,
    description: t.reason || "Transaction",
    timestamp: t.created_at,
    date: formattedDate,
    category: t.type,
    reference: `WAL${t.wallet_id}`,
  };

  transactionCache.set(cacheKey, processed);
  return processed;
};

export const processTransactions = (
  transactions: Transaction[]
): TransactionDisplay[] => {
  return transactions.map(processTransaction);
};

export const groupTransactionsByMonth = (
  transactions: TransactionDisplay[]
) => {
  const cacheKey = transactions.map((t) => t.id).join(",");

  if (groupedCache.has(cacheKey)) {
    return groupedCache.get(cacheKey);
  }

  const grouped = transactions.reduce(
    (acc, transaction) => {
      const monthKey = formatMonthKey(transaction.timestamp);

      if (!acc[monthKey]) {
        acc[monthKey] = [];
      }
      acc[monthKey].push(transaction);
      return acc;
    },
    {} as Record<string, TransactionDisplay[]>
  );

  const result = Object.entries(grouped)
    .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
    .map(([month, transactions]) => ({
      month,
      monthKey: `month_${month.replace(/\s+/g, "_")}_${transactions.length}`,
      transactions: transactions.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ),
    }));

  groupedCache.set(cacheKey, result);
  return result;
};

export const clearTransactionCaches = () => {
  transactionCache.clear();
  groupedCache.clear();
};

export const getCacheStats = () => ({
  transactionCacheSize: transactionCache.size,
  groupedCacheSize: groupedCache.size,
});
