import { useQuery } from "@tanstack/react-query";
import * as walletApi from "./base";
import type { WalletBalance, WalletTransactionsResponse } from "./wallet.types";

export const useGetWalletBalance = () => {
  return useQuery<WalletBalance, Error>({
    queryKey: ["wallet-balance"],
    queryFn: () => walletApi.getWalletBalance(),
    refetchOnWindowFocus: true,
  });
};

export interface GetWalletTransactionsParams {
  page: number;
  limit: number;
}

export const useGetWalletTransactions = (params: GetWalletTransactionsParams) => {
  return useQuery<WalletTransactionsResponse, Error>({
    queryKey: ["wallet-transactions", params],
    queryFn: () => walletApi.getWalletTransactions(params),
    refetchOnWindowFocus: false,
  });
};