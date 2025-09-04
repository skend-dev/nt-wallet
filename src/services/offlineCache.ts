import AsyncStorage from "@react-native-async-storage/async-storage";
import { Balance, Transaction } from "../types/wallet";

const CACHE_KEYS = {
  BALANCES: "offline_balances",
  TRANSACTIONS: "offline_transactions",
  LAST_UPDATED: "offline_last_updated",
} as const;

const MAX_TRANSACTIONS = 50;
const CACHE_EXPIRY_HOURS = 24; // Cache expires after 24 hours

export interface CacheData {
  balances: Balance[];
  transactions: Transaction[];
  lastUpdated: number;
}

class OfflineCacheService {
  private async isCacheValid(): Promise<boolean> {
    try {
      const lastUpdated = await AsyncStorage.getItem(CACHE_KEYS.LAST_UPDATED);
      if (!lastUpdated) return false;

      const lastUpdatedTime = parseInt(lastUpdated);
      const now = Date.now();
      const hoursSinceUpdate = (now - lastUpdatedTime) / (1000 * 60 * 60);

      return hoursSinceUpdate < CACHE_EXPIRY_HOURS;
    } catch (error) {
      console.error("Error checking cache validity:", error);
      return false;
    }
  }

  async saveBalances(balances: Balance[]): Promise<void> {
    try {
      await AsyncStorage.setItem(CACHE_KEYS.BALANCES, JSON.stringify(balances));
      await AsyncStorage.setItem(
        CACHE_KEYS.LAST_UPDATED,
        Date.now().toString()
      );
    } catch (error) {
      console.error("Error saving balances to cache:", error);
    }
  }

  async saveTransactions(transactions: Transaction[]): Promise<void> {
    try {
      const limitedTransactions = transactions
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, MAX_TRANSACTIONS);

      await AsyncStorage.setItem(
        CACHE_KEYS.TRANSACTIONS,
        JSON.stringify(limitedTransactions)
      );
      await AsyncStorage.setItem(
        CACHE_KEYS.LAST_UPDATED,
        Date.now().toString()
      );
    } catch (error) {
      console.error("Error saving transactions to cache:", error);
    }
  }

  async getCachedBalances(): Promise<Balance[] | null> {
    try {
      const isValid = await this.isCacheValid();
      if (!isValid) return null;

      const cachedData = await AsyncStorage.getItem(CACHE_KEYS.BALANCES);
      if (!cachedData) return null;

      return JSON.parse(cachedData);
    } catch (error) {
      console.error("Error getting cached balances:", error);
      return null;
    }
  }

  async getCachedTransactions(): Promise<Transaction[] | null> {
    try {
      const isValid = await this.isCacheValid();
      if (!isValid) return null;

      const cachedData = await AsyncStorage.getItem(CACHE_KEYS.TRANSACTIONS);
      if (!cachedData) return null;

      return JSON.parse(cachedData);
    } catch (error) {
      console.error("Error getting cached transactions:", error);
      return null;
    }
  }

  async getCachedData(): Promise<CacheData | null> {
    try {
      const balances = await this.getCachedBalances();
      const transactions = await this.getCachedTransactions();

      if (!balances || !transactions) return null;

      const lastUpdated = await AsyncStorage.getItem(CACHE_KEYS.LAST_UPDATED);

      return {
        balances,
        transactions,
        lastUpdated: lastUpdated ? parseInt(lastUpdated) : 0,
      };
    } catch (error) {
      console.error("Error getting cached data:", error);
      return null;
    }
  }

  async clearCache(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        CACHE_KEYS.BALANCES,
        CACHE_KEYS.TRANSACTIONS,
        CACHE_KEYS.LAST_UPDATED,
      ]);
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  }

  isOnline(): boolean {
    return navigator.onLine !== false;
  }

  async seedCache(
    balances: Balance[],
    transactions: Transaction[]
  ): Promise<void> {
    try {
      await this.saveBalances(balances);
      await this.saveTransactions(transactions);
    } catch (error) {
      console.error("Error seeding cache:", error);
    }
  }
}

export const offlineCacheService = new OfflineCacheService();
