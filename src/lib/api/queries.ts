import { useQuery } from "@tanstack/react-query";
import * as api from "./base";

// export const useGetSchools = (page: number, limit: number = 10) => {
//   return useQuery({
//     queryKey: ["schools", page, limit],
//     queryFn: () => api.getSchools(page, limit),
//     placeholderData: keepPreviousData, // ✅ replaces keepPreviousData
//     refetchOnWindowFocus: false,
//   });
// };

// export const useGetFaculties = (page: number, limit: number = 10) => {
//   return useQuery({
//     queryKey: ["faculties", page, limit],
//     queryFn: () => api.getFaculties(page, limit),
//     placeholderData: keepPreviousData, // ✅ replaces keepPreviousData
//     refetchOnWindowFocus: false,
//   });
// };

export const useGetFaculties = () => {
  return useQuery({
    queryKey: ["faculties"],
    queryFn: () => api.getFaculties(),
    refetchOnWindowFocus: false,
  });
}

export const useGetDepartments = () => {
  return useQuery({
    queryKey: ["departments"],
    queryFn: () => api.getDepartments(),
    placeholderData: undefined, // ✅ replaces keepPreviousData
    refetchOnWindowFocus: false,
  });
}

//students
export const useGetStudents = (page: number = 1, limit: number = 10, search?: string) => {
  return useQuery({
    queryKey: ["students", page, limit, search],
    queryFn: () => api.getStudents(page, limit, search),
    placeholderData: undefined,
    refetchOnWindowFocus: false,
  });
};

export const useGetStudent = (id: string) => {
  return useQuery({
    queryKey: ["student", id],
    queryFn: () => api.getStudent(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

export const useGetUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => api.getCurrentUser(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 100, // 10 minutes,
  });
}

//courses
export const useGetCourses = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: () => api.getCourses(),
    placeholderData: undefined,
    refetchOnWindowFocus: false,
  });
};

export const useGetCourseRegistrations = (semester:string  = 'First', session:string = '2024/2025',) => {
  return useQuery({
    queryKey: ["courseRegistrations", semester, session],
    queryFn: () => api.getCourseRegistrations(semester, session),
    placeholderData: undefined,
    refetchOnWindowFocus: false,
  });
};

export const useGetStudentsSemesterResults = (semester:string  = 'First', session:string = '2024/2025',) => {
  return useQuery({
    queryKey: ["studentsSemesterResults", semester, session],
    queryFn: () => api.getStudentsSemesterResults(semester, session),
    placeholderData: undefined,
    refetchOnWindowFocus: false,
  });
};

export const useGetTranscript = () => {
return useQuery({
  queryKey: ["transcript"],
  queryFn: () => api.getTranscript(),
  placeholderData: undefined,
  refetchOnWindowFocus: false,
});
};

export const useGetSemesterResult = (semester:string  = 'First', session:string = '2025/2026',) => {
  return useQuery({
    queryKey: ["semesterResult", semester, session],
    queryFn: () => api.getSemesterResult(semester, session),
    placeholderData: undefined,
    refetchOnWindowFocus: false,
  });
};
// export const useGetCourse = (id: string) => {
//   return useQuery({
//     queryKey: ["course", id],
//     queryFn: () => api.getCourse(id),
//     enabled: !!id,
//     refetchOnWindowFocus: false,
//   });
// };