import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "../services/api";

interface PayoutData {
  wallet_id: number;
  provider: string;
  amount: number;
  currency_id: number;
  bank_id?: string;
}

export const useCreatePayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payoutData: PayoutData) => {
      return await apiService.createPayout(payoutData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["balances"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};
