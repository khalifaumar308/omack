import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import * as api from "./base";
import type { PaginatedResponse, CourseRegistrationInstructorItem } from '@/components/types';
import type { PayableFilters, PayablesResponse } from "./types";

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

export const useGetStudentSummary = () => {
  return useQuery({
    queryKey: ["studentSummary"],
    queryFn: () => api.getStudentSummary(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 50, // 5 minutes
  });
}

//user

export const useGetUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => api.getCurrentUser(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 200, // 20 minutes,
  });
}

//courses
export const useGetCourses = (page: number = 1, limit: number = 50, search: string = '', department: string = '', semester: string = 'all', level: string = 'all') => {
  return useQuery({
    queryKey: ["courses", page, limit, search, department, semester, level],
    queryFn: () => api.getCourses(page, limit, search || undefined, department || undefined, semester || undefined, level || undefined),
  //   placeholderData: undefined,
  //   refetchOnWindowFocus: false,
  // staleTime: 1000 * 60 * 0, // 2 minutes
    retry: 2,
  });
};

export const useGetCoursesId = (codes: string[]) => {
  return useQuery({
    queryKey: ["course", codes],
    queryFn: () => api.getCourseIdsFromCodes(codes),
    enabled: !!codes.length,
    refetchOnWindowFocus: false,
  });
};

export const useGetCourseRegistrations = (
  semester: string = 'all',
  session: string = 'all',
  page: number = 1,
  limit: number = 10,
  search: string = '',
  student: string = 'all',
  department: string = 'all'
) => {
  return useQuery({
    queryKey: ["courseRegistrations", semester, session, page, limit, search, student, department],
    queryFn: () => api.getCourseRegistrations(
      semester,
      session,
      page,
      limit,
      search,
      student === 'all' ? undefined : student,
      department === 'all' ? undefined : department
    ),
    placeholderData: undefined,
    refetchOnWindowFocus: false,
    enabled: true,
  });
};

export const useGetCourseRegistrationsForInstructor = (
  courseId: string | undefined,
  semester: string,
  session: string,
  page: number = 1,
  limit: number = 20,
  search: string = ''
) => {
  return useQuery({
    queryKey: ["courseRegistrationsForInstructor"],
    queryFn: () => api.getCourseRegistrationsForInstructor(courseId as string, semester === 'all' ? undefined : semester, session === 'all' ? undefined : session, page, limit, search) as Promise<PaginatedResponse<CourseRegistrationInstructorItem>>,
    enabled: !!courseId && !!semester && !!session,
    refetchOnWindowFocus: false,
  });
};

export const useGetCourseRegistrationInfo = () => {
  return useQuery({
    queryKey: ["studentCourseRegistration"],
    queryFn: () => api.getStudentRegstrationsInfo(),
    enabled: true,
    refetchOnWindowFocus: false,
  });
}

export const useGetStudentRegSettingsInfo = (semester: string, session: string) => {
  return useQuery({
    queryKey: ["studentRegSettings", semester, session],
    queryFn: () => api.getStudentRegSettingsInfo(semester, session),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export const useGetAdminDashboard = () => {
  return useQuery({
    queryKey: ["adminDashboard"],
    queryFn: () => api.getadmindashBoardData(),
    placeholderData: undefined,
    refetchOnWindowFocus: false,
  });
}

/**
 * School-wide results release status (school-admin)
 */
export const useGetSchoolResultsRelease = (
  schoolId: string | undefined,
  session: string,
  semester: "First" | "Second"
) => {
  return useQuery({
    queryKey: ["schoolResultsRelease", schoolId, session, semester],
    queryFn: () => api.getSchoolResultsRelease(schoolId as string, session, semester),
    enabled: !!schoolId && !!session && !!semester,
    refetchOnWindowFocus: false,
  });
}

export const useGetStudentsSemesterResults = (
  semester: string = 'First',
  session: string = '2024/2025',
  page: number = 1,
  limit: number = 10,
  search: string = '',
  level: string = 'all'
) => {
  return useQuery({
    queryKey: ["studentsSemesterResults", semester, session, page, limit, search, level],
    queryFn: () => api.getStudentsSemesterResults(semester, session, page, limit, search, level),
    placeholderData: undefined,
    refetchOnWindowFocus: false,
  });
};

export const useGetTranscript = () => {
return useQuery({
  queryKey: ["transcript"],
  queryFn: () => api.getTranscript(),
  refetchOnWindowFocus: false,
});
};

// Payables queries
export const useGetPayables = (filters= { page: 1, limit: 20 }) => {
  return useQuery({
    queryKey: ["payables", filters],
    queryFn: () => api.getPayables(filters),
    refetchOnWindowFocus: false,
  });
};

export const useGetRegistrationSettings = (page:number, department?: string, level?: string, semester?: string, session?: string) => {
  return useQuery({
    queryKey: ["registrationSettings"],
    queryFn: () => api.getRegistrationSettings({page, department, level, semester, session}),
    refetchOnWindowFocus: false,
  });
};

// Student payables (infinite scroll)
export const useGetStudentPayables = (filters: PayableFilters = { limit: 20 }) => {
  return useInfiniteQuery<PayablesResponse>({
    queryKey: ["studentPayables", filters],
    queryFn: ({ pageParam }) => api.getStudentPayables({
      ...filters,
      cursor: pageParam as string | undefined
    }),
    getNextPageParam: (lastPage) => lastPage.pagination.nextCursor,
    initialPageParam: undefined,
    refetchOnWindowFocus: false
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

// export const useGetInstructor = (id: string) => {
//   return useQuery({
//     queryKey: ["instructor", id],
//     queryFn: () => api.getInstructor(id),
//     enabled: !!id,
//     refetchOnWindowFocus: false,
//   });
// };

//getInstructors
export const useGetInstructors = () => {
  return useQuery({
    queryKey: ["instructors"],
    queryFn: api.getInstructors,
    placeholderData: undefined,
    refetchOnWindowFocus: false,
  })
}

export const useGetInstructorCoursesStats = (instructorId: string | undefined) => {
  return useQuery({
    queryKey: ["instructor", instructorId, "coursesStats"],
    queryFn: () => api.getInstructorCoursesStats(instructorId as string),
    enabled: !!instructorId,
    refetchOnWindowFocus: false,
  })
}


//grading templates
export const useGetGradingTemplates = () => {
  return useQuery({
    queryKey: ["gradingTemplates"],
    queryFn: api.getGradingTemplates,
    placeholderData: undefined,
    refetchOnWindowFocus: false,
  })
}

export const useGetGradingTemplateById = (id:string) => {
  return useQuery({
    queryKey: ["gradingTemplates"],
    queryFn: ()=>api.getGradingTemplateById(id),
    placeholderData: undefined,
    refetchOnWindowFocus: false,
  })
}

// End of queries