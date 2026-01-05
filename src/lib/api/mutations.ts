import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "./base";
// import type { WalletInitResponse } from './base';
import { toast } from "sonner";
import type { AdminUploadResultsRequest, CreateCourseForm, CreateDepartmentForm, CreateFacultyForm, CreateGradingTemplateRequest, CreateInstructorForm, CreateStudentForm, Instructor, RegisterCourseRequest, RegisterManyCoursesRequest, UpdateGradingTemplateRequest } from "@/components/types";

import axios from "axios";
import type { PayableFormData } from "@/types/payable";
export { useUpdateSchoolLogo } from './mutations/useUpdateSchoolLogo';

// School Mutations
export const useUpdateSchool = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { schoolId: string; schoolData: Partial<import("@/components/types").School> }) => api.updateSchool(data.schoolId, data.schoolData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("School updated successfully");
    },
    onError: (error: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((error as any)?.response?.data?.message || "Failed to update school. Please try again.");
    },
  });
};
// Toggle school term results release (school-admin)
export const useSetSchoolResultsRelease = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { schoolId: string; session: string; semester: "First" | "Second"; released: boolean }) =>
      api.setSchoolResultsRelease(data.schoolId, { session: data.session, semester: data.semester, released: data.released }),
    onSuccess: (_res, vars) => {
      queryClient.invalidateQueries({ queryKey: ["schoolResultsRelease", vars.schoolId, vars.session, vars.semester] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success(vars.released ? "Results released for selected term" : "Results access revoked for selected term");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update results release");
    },
  });
};

// Upload file mutation
export const useUploadFile = () => {
  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return api.uploadFile(formData as unknown as FormData);
    },
    onError: (error: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((error as any)?.response?.data?.message || "Failed to upload file. Please try again.");
    },
  });
};
export const useUpdateStudentSemesterReg = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      studentId: string; semester: string;
      session: string, newCourseIds?: string[];
      status?: "pending" | "approved" | "rejected"
    }) => api.updateSemesterCourseReg(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studentCourseRegistration"] });
      toast.success("Course Reg updated successfully");
    },
    onError: (error: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((error as any)?.response?.data?.message || "Failed to update Course Regs. Please try again.");
    },
  })
}

// Wallet mutations
// export const useInitiateWalletFunding = () => {
//   // no queryClient needed here; redirecting to Paystack
//   return useMutation({
//     mutationFn: (amount: number) => api.initiateWalletFunding(amount),
//     onSuccess: (res: unknown) => {
//       // Redirect user to Paystack authorization URL
//   const data = res as WalletInitResponse;
//   const url = data?.authorization_url;
//       if (url) {
//         window.location.href = url;
//       } else {
//         toast.success('Payment initialized. Please complete payment in the popup.');
//       }
//     },
//     onError: (error: unknown) => {
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       toast.error((error as any)?.response?.data?.message || 'Failed to initiate payment. Please try again.');
//     }
//   });
// };

export const useVerifyWalletFunding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reference: string) => api.verifyWalletFunding(reference),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['walletBalance'] });
      queryClient.invalidateQueries({ queryKey: ['walletTransactions'] });
      toast.success('Payment verified');
    },
    onError: (error: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((error as any)?.response?.data?.message || 'Failed to verify payment.');
    }
  });
};

// export const useAddSchool = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (schoolData: ICreateSchoolRequest) => api.createSchool(schoolData),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["schools"] });
//       toast.success("School added successfully");
//     },
//   });
// };

export const useAddFaculty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (facultyData: CreateFacultyForm) => api.createFaculty(facultyData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faculties"] });
      toast.success("Faculty added successfully");
    },
  });
};

export const useDeleteFaculty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (facultyId: string) => api.deleteFaculty(facultyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faculties"] });
      toast.success("Faculty deleted successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete faculty. Please try again.");
    },
  });
};

export const useUpdateFaculty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { facultyId: string; facultyData: CreateFacultyForm }) => api.updateFaculty(data.facultyId, data.facultyData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faculties"] });
      toast.success("Faculty updated successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update faculty. Please try again.");
    },
  });
}

//departments
export const useAddDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (departmentData: CreateDepartmentForm) => api.createDepartment(departmentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Department added successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to add department. Please try again.");
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (departmentId: string) => api.deleteDepartment(departmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student deleted successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete student. Please try again.");
    },
  });
};
export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { studentId: string; studentData: Partial<CreateStudentForm> }) => api.updateStudent(data.studentId, data.studentData as unknown as Partial<CreateStudentForm>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student updated successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update student. Please try again.");
    },
  });
};

// student Mutations
export const useAddStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (studentData: CreateStudentForm) => api.createStudent(studentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student added successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to add student. Please try again.");
    },
  });
};

export const useBulkAddStudents = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (students: CreateStudentForm[]) => api.bulkCreateStudents(students),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Students added successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to add students. Please try again.");
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (studentId: string) => api.deleteStudent(studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Student deleted successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete department. Please try again.");
    },
  });
};
export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { departmentId: string; departmentData: CreateDepartmentForm }) => api.updateDepartment(data.departmentId, data.departmentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Department updated successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update department. Please try again.");
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (loginDetails: { email: string, password: string }) => api.userLogin(loginDetails.email, loginDetails.password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Login successful");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.log(error, 'login error');
      toast.error(error?.response?.data?.message || "Login failed. Please try again.");
    },
  });
};
//courses
export const useAddCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseData: CreateCourseForm) => api.createCourse(courseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course added successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to add course. Please try again.");
    },
  });
};

export const useBulkAddCourses = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courses: CreateCourseForm[]) => api.bulkCreateCourses(courses),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Courses added successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to add courses. Please try again.");
    },
  });
}

// updateInstructor
export const useUpdateInstructor = (id: string, data: Partial<Instructor>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.updateInstructor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
      queryClient.invalidateQueries({ queryKey: ['instructor', id] });
    },
  });
};

//deleteInstructor
export const useDeleteInstructor = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.deleteInstructor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
    },
  });
};
//bulk create instructors
export const useBulkCreateInstructors = (data: CreateInstructorForm[]) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.bulkCreateInstructors(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
    },
  });
};

export const useEnterResult = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { registrationId: string, score: number }) => api.enterResult(data.registrationId, data.score),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseRegistrations'] });
      queryClient.invalidateQueries({ queryKey: ['studentsSemesterResults'] });
      toast.success("Result entered successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to enter result. Please try again.");
    },
  });
}

export const useUploadLogoMutation = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return api.uploadFile(formData);
    },
    onError: (error: unknown) => {
      console.error('Error uploading logo:', error);
      toast.error("Failed to upload logo. Please try again.");
    },
    onSuccess: () => {
      toast.success("Logo uploaded successfully");
    }
  });
}
export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) => api.deleteCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course deleted successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete course. Please try again.");
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { courseId: string; courseData: CreateCourseForm }) => api.updateCourse(data.courseId, data.courseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course updated successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update course. Please try again.");
    },
  });
};

export const useAdminAddBulkRegistrations = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (registrations: { student: string; course: string; semester: string; session: string }[]) => api.adminAddBulkRegistrations(registrations),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courseRegistrations"] });
      toast.success("Bulk registrations added successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to add bulk registrations. Please try again.");
    },
  });
};

export const useAdminUpdateBulkRegStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { studentId: string[]; semester: string; session: string; status: "pending" | "approved" | "rejected" }) => api.updateCourseRegsStatus(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courseRegistrations"] });
      toast.success("Bulk registration status updated successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update bulk registration status. Please try again.");
    },
  });
};

// Course Registration Mutations
export const useRegisterCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (registrationData: RegisterCourseRequest) => api.registerCourse(registrationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courseRegistrations"] });
      toast.success("Course registered successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to register course. Please try again.");
    },
  });
};

export const useRegisterManyCourses = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (registrationData: RegisterManyCoursesRequest) => api.registerManyCourses(registrationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courseRegistrations"] });
      toast.success("Courses registered successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to register courses. Please try again.");
    },
  });
};

export const useAdminUploadResults = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (resultsData: AdminUploadResultsRequest) => api.adminUploadResults(resultsData),
    onSuccess: () => {
      // console.log(data, 'upload response');
      queryClient.invalidateQueries({ queryKey: ["studentsSemesterResults"] });
      toast.success("Results uploaded successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to upload results. Please try again.");
    },
  });
};

export const useStudentRegisterManyCourses = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { courses: string[]; semester: string; session: string }) => api.studentRegisterManyCourses(data.courses, data.semester, data.session),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courseRegistrations", "courseRegistration"] });
      toast.success("Courses registered successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to register courses. Please try again.");
    },
  });
};

export const useCreateGradingTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateGradingTemplateRequest) => api.createGradingTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gradingTemplates"] });
      toast.success("Grading Template registered successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to register gradingTemplate. Please try again.");
    },
  })
}

export const useDeleteGradingTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteGradingTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gradingTemplates"] });
      toast.success("Grading Template deleted successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete Grading Template. Please try again.");
    },
  });
};

export const useUpdateGradingTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; data: UpdateGradingTemplateRequest }) => api.updateGradingTemplate(data.id, data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gradingTemplates"] });
      toast.success("gradingTemplate updated successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update gradingTemplate. Please try again.");
    },
  });
};

// Upload logo mutation
export const useUploadLogo = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Logo uploaded successfully");
    },
    onError: (error: unknown) => {
      console.error('Error uploading logo:', error);
      toast.error("Failed to upload logo. Please try again.");
    }
  });
};

// Payable mutations
export const useAddPayable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payableData: PayableFormData) => api.createPayable(payableData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payables'] });
      toast.success('Payable added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add payable. Please try again.');
    },
  });
};

export const useDeletePayable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payableId: string) => api.deletePayable(payableId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payables'] });
      toast.success('Payable deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete payable. Please try again.');
    },
  });
};

export const useUpdatePayable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { payableId: string; payableData: Partial<PayableFormData> }) => 
      api.updatePayable({id:data.payableId, data:data.payableData}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payables'] });
      toast.success('Payable updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update payable. Please try again.');
    },
  });
};

export const useInitiatePayablePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { payableId: string; amount: number }) => 
      api.initiatePayablePayment(data.payableId, data.amount),
    onSuccess: (paymentInit) => {
      queryClient.invalidateQueries({ queryKey: ['payables'] });
      console.log(paymentInit, 'payment init response');
      toast.success('Payment initialized. Redirecting to payment gateway...');
      // Redirect user to Paystack authorization URL
      const url = paymentInit.data.authorization_url;
      if (url) {
        window.location.href = url;
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to initiate payable payment. Please try again.');
    },
  })
};

export const useTransitionStudents = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { fromLevel: string; toLevel: string; department: string }) => api.transitionStudents(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success(`${data.message}`);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to transition students. Please try again.");
    },
  });
};

export const useAddMarksToStudents = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { courseId: string; semester: string; session: string; marksToAdd: number }) =>
      api.addMarksToStudents(data.courseId, data.semester, data.session, data.marksToAdd),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["resultsPerCourse"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["courseRegistrations"], exact: false });
      toast.success(data.message);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to add marks. Please try again.");
    },
  });
};