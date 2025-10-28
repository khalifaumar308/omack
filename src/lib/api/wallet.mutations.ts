import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as walletApi from "./base";
import type { 
  InitiateWalletFundingRequest,
  InitiateWalletFundingResponse,
  VerifyWalletFundingResponse 
} from "./wallet.types";

export const useInitiateWalletFunding = () => {
  return useMutation<InitiateWalletFundingResponse, Error, InitiateWalletFundingRequest>({
    mutationFn: async (data) => {
      const result = await walletApi.initiateWalletFunding(data);
      return result;
    },
  });
};

export const useVerifyWalletFunding = () => {
  const queryClient = useQueryClient();
  
  return useMutation<VerifyWalletFundingResponse, Error, { reference: string }>({
    mutationFn: (data) => walletApi.verifyWalletFunding(data.reference),
    onSuccess: () => {
      // Invalidate and refetch balance and transactions
      queryClient.invalidateQueries({ queryKey: ["wallet-balance"] });
      queryClient.invalidateQueries({ queryKey: ["wallet-transactions"] });
    },
  });
};