import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateSchoolLogo = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post('http://localhost:5000/api/schools/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Logo updated successfully");
    },
    onError: (error: unknown) => {
      console.error('Error uploading logo:', error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Failed to upload logo");
      } else {
        toast.error("Failed to upload logo. Please try again.");
      }
    }
  });
};