import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "./base";
import { toast } from "sonner";
import type { AdminUploadResultsRequest, CreateCourseForm, CreateDepartmentForm, CreateFacultyForm, CreateGradingTemplateRequest, CreateStudentForm, RegisterCourseRequest, RegisterManyCoursesRequest, UpdateGradingTemplateRequest } from "@/components/types";


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

export const useUpdateStudentSemesterReg = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body:{
    studentId: string; semester: string; 
    session: string, newCourseIds?:string[]; 
    status?:"pending" | "approved" | "rejected"
  } ) => api.updateSemesterCourseReg(body),
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
    mutationFn: (data: { studentId: string; studentData: CreateStudentForm }) => api.updateStudent(data.studentId, data.studentData),
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
    mutationFn: (loginDetails:{email: string, password: string}) => api.userLogin(loginDetails.email, loginDetails.password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Login successful");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
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
    mutationFn: (data:CreateGradingTemplateRequest) => api.createGradingTemplate(data),
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
