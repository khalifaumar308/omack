// import axios from 'axios';
// import type { 
//   WalletBalance,
//   WalletTransactionsResponse,
//   InitiateWalletFundingRequest,
//   InitiateWalletFundingResponse,
//   VerifyWalletFundingResponse 
// } from './wallet.types';

// // Create an axios instance
// const api = axios.create({
//   baseURL: 'http://localhost:5000/api',
//   timeout: 20000,
//   withCredentials: true,
// });
// export const getWalletBalance = async (): Promise<WalletBalance> => {
//   const response = await api.get<WalletBalance>('/wallet/balance');
//   return response.data;
// };

// // export const getWalletTransactions = async (
// //   params: { page: number; limit: number }
// // ): Promise<WalletTransactionsResponse> => {
// //   const response = await api.get<WalletTransactionsResponse>('/wallet/transactions', {
// //     params,
// //   });
// //   return response.data;
// // };

// // export const initiateWalletFunding = async (
// //   data: InitiateWalletFundingRequest
// // ): Promise<InitiateWalletFundingResponse> => {
// //   const response = await api.post<InitiateWalletFundingResponse>('/wallet/fund', data);
// //   return response.data;
// // };

// // export const verifyWalletFunding = async (
// //   reference: string
// // ): Promise<VerifyWalletFundingResponse> => {
// //   const response = await api.get<VerifyWalletFundingResponse>(`/wallet/verify?reference=${reference}`);
// //   return response.data;
// // };