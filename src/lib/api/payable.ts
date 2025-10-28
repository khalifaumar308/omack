// import type { IPopulatedPayable, Payable, PayableFormData } from '@/types/payable';
// import type { PayableFilters } from '@/types/pagination';
// import type { PaginatedResponse } from '@/types/pagination';
// import { axiosInstance } from './base';

// export const getPayables = async (filters: PayableFilters): Promise<PaginatedResponse<IPopulatedPayable>> => {
//   const { data } = await axiosInstance.get('/payables', { params: filters });
//   return data;
// };

// export const createPayable = async (payableData: PayableFormData): Promise<Payable> => {
//   const { data } = await axiosInstance.post('/payables', payableData);
//   return data;
// };

// export const updatePayable = async (payableId: string, payableData: Partial<PayableFormData>): Promise<Payable> => {
//   const { data } = await axiosInstance.put(`/payables/${payableId}`, payableData);
//   return data;
// };

// export const deletePayable = async (payableId: string): Promise<void> => {
//   await axiosInstance.delete(`/payables/${payableId}`);
// };