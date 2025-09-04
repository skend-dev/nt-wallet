import * as SecureStore from "expo-secure-store";
import { ENV } from "../config/env";

const API_BASE_URL = ENV.API_BASE_URL;

class ApiService {
  private tokenCache: string | null = null;
  private tokenCacheTime: number = 0;
  private readonly TOKEN_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const now = Date.now();

    if (
      this.tokenCache &&
      now - this.tokenCacheTime < this.TOKEN_CACHE_DURATION
    ) {
      return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.tokenCache}`,
      };
    }

    const token = await SecureStore.getItemAsync("accessToken");
    this.tokenCache = token;
    this.tokenCacheTime = now;

    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = await this.getAuthHeaders();

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  }

  async login(email: string, password: string) {
    const url = `${API_BASE_URL}/auth/login`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const responseData = await response.json();
    return responseData;
  }

  async getBalances() {
    const response = await this.request<any>("/balances");
    return response.data || [];
  }

  async getTransactions(
    page: number = 1,
    limit: number = 20,
    filters?: {
      dateFrom?: Date | null;
      dateTo?: Date | null;
      status?: string[];
      category?: string[];
    }
  ) {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: limit.toString(),
    });

    if (filters?.dateFrom) {
      const year = filters.dateFrom.getFullYear();
      const month = String(filters.dateFrom.getMonth() + 1).padStart(2, "0");
      const day = String(filters.dateFrom.getDate()).padStart(2, "0");
      const dateFromStr = `${year}-${month}-${day}`;
      params.append("date_from", dateFromStr);
    }
    if (filters?.dateTo) {
      const nextDay = new Date(filters.dateTo);
      nextDay.setDate(nextDay.getDate() + 1);
      const year = nextDay.getFullYear();
      const month = String(nextDay.getMonth() + 1).padStart(2, "0");
      const day = String(nextDay.getDate()).padStart(2, "0");
      const dateToStr = `${year}-${month}-${day}`;
      params.append("date_to", dateToStr);
    }
    if (filters?.status && filters.status.length > 0) {
      filters.status.forEach((status) => {
        params.append("status", status.toLowerCase());
      });
    }
    if (filters?.category && filters.category.length > 0) {
      filters.category.forEach((category) => {
        const type =
          category === "Top-up"
            ? "top-up"
            : category === "Withdrawal"
              ? "withdrawal"
              : category.toLowerCase();
        params.append("type", type);
      });
    }

    const finalUrl = `/transactions?${params.toString()}`;
    const response = await this.request<any>(finalUrl);
    return {
      transactions: response.data?.items || [],
      hasMore: response.data?.has_more || false,
      total: response.data?.total || 0,
    };
  }

  async createPayout(payoutData: {
    wallet_id: number;
    provider: string;
    amount: number;
    currency_id: number;
    bank_id?: string;
  }) {
    const response = await this.request<any>("/payouts", {
      method: "POST",
      body: JSON.stringify(payoutData),
    });
    return response.data || response;
  }

  async saveToken(token: string) {
    await SecureStore.setItemAsync("accessToken", token);
    this.tokenCache = token;
    this.tokenCacheTime = Date.now();
  }

  async getStoredToken(): Promise<string | null> {
    return SecureStore.getItemAsync("accessToken");
  }

  async logout() {
    await SecureStore.deleteItemAsync("accessToken");
    this.tokenCache = null;
    this.tokenCacheTime = 0;
  }
}

export const apiService = new ApiService();
