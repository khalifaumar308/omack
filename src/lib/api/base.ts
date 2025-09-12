/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type {
  User, Student, Instructor, School, Faculty, Department, Course,
  CourseRegistration, ResultSummary,
  RegisterCourseRequest, RegisterManyCoursesRequest,
  UploadResultRequest, UploadMultipleResultsRequest, UploadResultResponse,
  SemesterResultResponse, CreateSchoolForm,
  CreateFacultyForm, CreateDepartmentForm, CreateStudentForm,
  CreateInstructorForm,
  PopulatedDepartment,
  PopulatedStudent,
  IAdminCourseRegs,
  StudentsSemesterResultsResponse,
  AdminUploadResultsRequest,
  PopulatedUser,
} from '@/components/types';

// Configure your API base URL
const API_BASE_URL = 'https://hmsms-api.onrender.com/api';

// =============================================================================
// SECURE AXIOS INSTANCE WITH COOKIES AND CSRF
// =============================================================================
// const getCsrfToken = async () => {
//   const val = (await cookieStore.get('_csrfSecret'))?.value
//   return val || null;
// }
// CSRF token management
let csrfToken: string | null = null;

// Create secure axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Include cookies automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add CSRF token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add CSRF token for state-changing operations
    if (['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase() || '')) {
      console.log('Adding CSRF token to request headers', csrfToken);
      if (csrfToken && config.headers) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for automatic token refresh and CSRF token management
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Update CSRF token if provided
    if (response.data && response.data.csrfToken) {
      csrfToken = response.data.csrfToken;
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    const errorData = error.response?.data as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Check if it's a token expiration (not invalid credentials)
      if (errorData?.tokenExpired || errorData?.requiresAuth) {
        try {
          // Try to refresh token using cookies
          const response = await api.post('/auth/refresh');
          
          // Update CSRF token from refresh response
          if (response.data.csrfToken) {
            csrfToken = response.data.csrfToken;
          }
          
          // Retry the original request
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          authManager.handleAuthFailure();
          return Promise.reject(refreshError);
        }
      } else {
        // Invalid credentials or other auth error
        authManager.handleAuthFailure();
      }
    }

    return Promise.reject(error);
  }
);

// =============================================================================
// SECURE AUTHENTICATION MANAGEMENT
// =============================================================================

export const authManager = {
  // Initialize CSRF token
  initializeCSRF: async (): Promise<void> => {
    try {
      if (!csrfToken) {
        const response = await axios.get(`${API_BASE_URL}/csrf-token`, {
          withCredentials: true
        });
        csrfToken = response.data.csrfToken;
      }
    } catch (error) {
      console.warn('Failed to initialize CSRF token:', error);
    }
  },

  // Get current CSRF token
  getCSRFToken: (): string | null => {
    return csrfToken;
  },

  // Set CSRF token manually
  setCSRFToken: (token: string): void => {
    csrfToken = token;
  },

  // Clear CSRF token
  clearCSRFToken: (): void => {
    csrfToken = null;
  },

  // Check if user is authenticated by making a request to /auth/me
  isAuthenticated: async (): Promise<boolean> => {
    try {
      await api.get('/auth/me');
      return true;
    } catch (err) {
      console.warn('User is not authenticated:', err);
      return false;
    }
  },

  // Get current user data
  getCurrentUser: async (): Promise<PopulatedUser | null> => {
    try {
      const response = await api.get('/auth/me');
      return response.data.user;
    } catch (error) {
      console.warn('User is not authenticated:', error);
      return null;
    }
  },

  // Handle authentication failure
  handleAuthFailure: (): void => {
    csrfToken = null;
    
    // Dispatch logout event for React components to handle
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:logout', {
        detail: { message: 'Authentication failed' }
      }));
      
      // Optional: redirect to login page
      // window.location.href = '/login';
    }
  },

  // Handle successful authentication
  handleAuthSuccess: (userData: any): void => {
    if (userData.csrfToken) {
      csrfToken = userData.csrfToken;
    }
    
    // Dispatch login event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:login', {
        detail: { user: userData.user }
      }));
    }
  }
};

// =============================================================================
// AUTHENTICATION APIs
// =============================================================================

export const userLogin = async (email: string, password: string) => {
  // Ensure CSRF token is available
  await authManager.initializeCSRF();
  
  const response = await api.post("/auth/login", { email, password });
  
  // Handle successful authentication
  authManager.handleAuthSuccess(response.data);
  
  return response.data;
};

export const userLogout = async () => {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    // Continue with logout even if server call fails
    console.warn('Logout request failed:', error);
  } finally {
    // Clear CSRF token and dispatch logout event
    authManager.handleAuthFailure();
  }
};

export const refreshToken = async () => {
  const response = await api.post("/auth/refresh");
  
  // Update CSRF token if provided
  if (response.data.csrfToken) {
    authManager.setCSRFToken(response.data.csrfToken);
  }
  
  return response.data;
};

export const getCurrentUser = async () => {
  return await authManager.getCurrentUser();
};

export const checkAuthStatus = async () => {
  return await authManager.isAuthenticated();
};

// =============================================================================
// SCHOOL MANAGEMENT APIs
// =============================================================================

export const createSchool = async (schoolData: CreateSchoolForm) => {
  const response = await api.post<School>("/schools", schoolData);
  return response.data;
};

export const getSchools = async () => {
  const response = await api.get<School[]>("/schools");
  return response.data;
};

export const updateSchool = async (id: string, schoolData: Partial<CreateSchoolForm>) => {
  const response = await api.put<School>(`/schools/${id}`, schoolData);
  return response.data;
};

export const deleteSchool = async (id: string) => {
  const response = await api.delete<{ message: string }>(`/schools/${id}`);
  return response.data;
};

// =============================================================================
// FACULTY MANAGEMENT APIs
// =============================================================================

export const createFaculty = async (facultyData: CreateFacultyForm) => {
  const response = await api.post<Faculty>("/faculties", facultyData);
  return response.data;
};

export const getFaculties = async () => {
  const response = await api.get<Faculty[]>("/faculties");
  return response.data;
};

export const updateFaculty = async (id: string, facultyData: Partial<CreateFacultyForm>) => {
  const response = await api.put<Faculty>(`/faculties/${id}`, facultyData);
  return response.data;
};

export const deleteFaculty = async (id: string) => {
  const response = await api.delete<{ message: string }>(`/faculties/${id}`);
  return response.data;
};

// =============================================================================
// DEPARTMENT MANAGEMENT APIs
// =============================================================================

export const createDepartment = async (departmentData: CreateDepartmentForm) => {
  const response = await api.post<Department>("/departments", departmentData);
  return response.data;
};

export const getDepartments = async () => {
  const response = await api.get<PopulatedDepartment[]>("/departments");
  return response.data;
};

export const updateDepartment = async (id: string, departmentData: Partial<CreateDepartmentForm>) => {
  const response = await api.put<Department>(`/departments/${id}`, departmentData);
  return response.data;
};

export const deleteDepartment = async (id: string) => {
  const response = await api.delete<{ message: string }>(`/departments/${id}`);
  return response.data;
};

// =============================================================================
// STUDENT MANAGEMENT APIs
// =============================================================================

export const createStudent = async (studentData: CreateStudentForm) => {
  const response = await api.post<Student>("/students", studentData);
  return response.data;
};

export const bulkCreateStudents = async (students: CreateStudentForm[]) => {
  const response = await api.post<Student[]>("/students/bulk", { students });
  return response.data;
};

export const getStudents = async (page: number = 1, limit: number = 10, search: string = "") => {
  const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
  if (search) params.append("search", search);
  const response = await api.get<PopulatedStudent[]>(`/students`);
  return response.data;
};

export const getStudent = async (id: string) => {
  const response = await api.get<PopulatedStudent>(`/students/${id}`);
  return response.data;
};

export const updateStudent = async (id: string, studentData: Partial<CreateStudentForm>) => {
  const response = await api.put<Student>(`/students/${id}`, studentData);
  return response.data;
};

export const deleteStudent = async (id: string) => {
  const response = await api.delete<{ message: string }>(`/students/${id}`);
  return response.data;
};

// =============================================================================
// INSTRUCTOR MANAGEMENT APIs
// =============================================================================

export const createInstructor = async (instructorData: CreateInstructorForm) => {
  const response = await api.post<Instructor>("/instructors", instructorData);
  return response.data;
};

export const bulkCreateInstructors = async (instructors: CreateInstructorForm[]) => {
  const response = await api.post<Instructor[]>("/instructors/bulk", { instructors });
  return response.data;
};

export const getInstructors = async () => {
  const response = await api.get<Instructor[]>("/instructors");
  return response.data;
};

export const updateInstructor = async (id: string, instructorData: Partial<CreateInstructorForm>) => {
  const response = await api.put<Instructor>(`/instructors/${id}`, instructorData);
  return response.data;
};

export const deleteInstructor = async (id: string) => {
  const response = await api.delete<{ message: string }>(`/instructors/${id}`);
  return response.data;
};

export const createSuperAdmin = async (adminData: { name: string; email: string; password: string }) => {
  const response = await api.post<{ message: string; token: string; user: User }>("/instructors/super-admin", adminData);
  return response.data;
};

export const registerSchoolAdmin = async (adminData: { name: string; email: string; password: string; school: string }) => {
  const response = await api.post<{ message: string; token: string; user: User }>("/instructors/school-admin", adminData);
  return response.data;
};

// =============================================================================
// COURSE REGISTRATION APIs (Note: These routes need to be added to app.ts)
// =============================================================================

export const getCourseRegistrations = async (semester: string, session: string) => {
  const query = new URLSearchParams({ semester, session });
  const response = await api.get<IAdminCourseRegs[]>(`/course-registrations/registrations?${query.toString()}`);
  return response.data;
};

export const registerCourse = async (registrationData: RegisterCourseRequest) => {
  const response = await api.post<CourseRegistration>("/course-registrations", registrationData);
  return response.data;
};

export const adminAddBulkRegistrations = async (registrations: { student: string; course: string; semester: string; session: string }[]) => {
  const response = await api.post<{ message: string }>("/course-registrations/registrations/bulk", { registrations });
  return response.data;
};

export const studentRegisterManyCourses = async (courses: string[], semester: string, session: string) => {
  const response = await api.post<{ message: string }>("/course-registrations/student-bulk", { courses, semester, session });
  return response.data;
};

export const registerManyCourses = async (registrationData: RegisterManyCoursesRequest) => {
  const response = await api.post<CourseRegistration[]>("/course-registrations/bulk", registrationData);
  return response.data;
};

export const uploadResult = async (registrationId: string, resultData: UploadResultRequest) => {
  const response = await api.put<{ message: string; registration: CourseRegistration }>(`/course-registrations/${registrationId}/result`, resultData);
  return response.data;
};

export const adminUploadResults = async (results:AdminUploadResultsRequest) => {
  const response = await api.post<{ message: string; registration: CourseRegistration }>(`/course-registrations/admin-results`, results);
  return response.data;
};

export const uploadMultipleResults = async (resultsData: UploadMultipleResultsRequest) => {
  const response = await api.post<UploadResultResponse[]>("/course-registrations/results/bulk", resultsData);
  return response.data;
};

export const getSemesterResult = async (semester: string, session: string) => {
  const response = await api.get<SemesterResultResponse>(`/course-registrations/semester?semester=${semester}&session=${session}`);
  return response.data;
};

export const getStudentsSemesterResults = async (semester: string, session: string) => {
  const response = await api.get<StudentsSemesterResultsResponse[]>(`/course-registrations/semester-results?semester=${semester}&session=${session}`);
  return response.data;
};

export const getTranscript = async () => {
  const response = await api.get<ResultSummary[]>("/course-registrations/transcript");
  return response.data;
};

// =============================================================================
// COURSE MANAGEMENT APIs (You may need to implement these endpoints)
// =============================================================================

export const createCourse = async (courseData: { 
  code: string; 
  title: string; 
  department: string; 
  school: string; 
  instructors: string[]; 
  creditUnits: number; 
}) => {
  const response = await api.post<Course>("/courses", courseData);
  return response.data;
};

export const getCourses = async () => {
  const response = await api.get<Course[]>("/courses");
  return response.data;
};

export const getCoursesByDepartment = async (departmentId: string) => {
  const response = await api.get<Course[]>(`/courses?department=${departmentId}`);
  return response.data;
};

export const getCoursesByInstructor = async (instructorId: string) => {
  const response = await api.get<Course[]>(`/courses?instructor=${instructorId}`);
  return response.data;
};

export const updateCourse = async (id: string, courseData: Partial<{ 
  code: string; 
  title: string; 
  department: string; 
  school: string; 
  instructors: string[]; 
  creditUnits: number; 
}>) => {
  const response = await api.put<Course>(`/courses/${id}`, courseData);
  return response.data;
};

export const deleteCourse = async (id: string) => {
  const response = await api.delete<{ message: string }>(`/courses/${id}`);
  return response.data;
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

// Helper function to set authorization (deprecated - use authManager instead)
export const setAuthToken = (token: string) => {
  console.warn('setAuthToken is deprecated. Use authManager.setCSRFToken() instead.');
  authManager.setCSRFToken(token);
};

// Helper function to clear authorization (deprecated - use authManager instead)
export const clearAuthToken = () => {
  console.warn('clearAuthToken is deprecated. Use authManager.clearCSRFToken() instead.');
  authManager.clearCSRFToken();
};

// Grade calculation utility (matching the server-side logic)
export const scoreToGrade = (score: number): string => {
  if (score >= 70) return "A";
  if (score >= 60) return "B";
  if (score >= 50) return "C";
  if (score >= 45) return "D";
  return "F";
};

export const gradeToPoint = (grade: string): number => {
  switch (grade) {
    case "A": return 4;
    case "B": return 3;
    case "C": return 2;
    case "D": return 1;
    default: return 0;
  }
};

// Calculate GPA from course registrations
export const calculateGPA = (registrations: CourseRegistration[]): number => {
  let totalCredits = 0;
  let totalGradePoints = 0;

  registrations.forEach(reg => {
    if (reg.grade) {
      // You'll need to get credit units from the course data
      const credits = 3; // Default, should be fetched from course
      const points = gradeToPoint(reg.grade);
      totalCredits += credits;
      totalGradePoints += points * credits;
    }
  });

  return totalCredits > 0 ? totalGradePoints / totalCredits : 0;
};

// =============================================================================
// ERROR HANDLING UTILITIES
// =============================================================================

export interface ApiError {
  message: string;
  status?: number;
  errors?: any;
}

export const handleApiError = (error: any): ApiError => {
  if (error.response) {
    return {
      message: error.response.data?.message || 'An error occurred',
      status: error.response.status,
      errors: error.response.data?.errors
    };
  } else if (error.request) {
    return {
      message: 'Network error - please check your connection',
      status: 0
    };
  } else {
    return {
      message: error.message || 'An unexpected error occurred'
    };
  }
};

// =============================================================================
// REACT QUERY KEYS (Optional - for use with React Query/TanStack Query)
// =============================================================================

export const queryKeys = {
  // Auth
  currentUser: ['auth', 'currentUser'] as const,
  
  // Schools
  schools: ['schools'] as const,
  school: (id: string) => ['schools', id] as const,
  
  // Faculties
  faculties: ['faculties'] as const,
  faculty: (id: string) => ['faculties', id] as const,
  
  // Departments
  departments: ['departments'] as const,
  department: (id: string) => ['departments', id] as const,
  departmentsByFaculty: (facultyId: string) => ['departments', 'faculty', facultyId] as const,
  
  // Students
  students: ['students'] as const,
  student: (id: string) => ['students', id] as const,
  studentsByDepartment: (departmentId: string) => ['students', 'department', departmentId] as const,
  
  // Instructors
  instructors: ['instructors'] as const,
  instructor: (id: string) => ['instructors', id] as const,
  instructorsByDepartment: (departmentId: string) => ['instructors', 'department', departmentId] as const,
  
  // Courses
  courses: ['courses'] as const,
  course: (id: string) => ['courses', id] as const,
  coursesByDepartment: (departmentId: string) => ['courses', 'department', departmentId] as const,
  coursesByInstructor: (instructorId: string) => ['courses', 'instructor', instructorId] as const,
  
  // Course Registrations
  courseRegistrations: ['courseRegistrations'] as const,
  semesterResult: (semester: string, session: string) => ['courseRegistrations', 'semester', semester, session] as const,
  transcript: (studentId: string) => ['courseRegistrations', 'transcript', studentId] as const,
} as const;

export default {
  // Auth
  userLogin,
  userLogout,
  refreshToken,
  getCurrentUser,
  checkAuthStatus,
  authManager,
  
  // Legacy (deprecated)
  setAuthToken,
  clearAuthToken,
  
  // Schools
  createSchool,
  getSchools,
  updateSchool,
  deleteSchool,
  
  // Faculties
  createFaculty,
  getFaculties,
  updateFaculty,
  deleteFaculty,
  
  // Departments
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
  
  // Students
  createStudent,
  bulkCreateStudents,
  getStudents,
  updateStudent,
  deleteStudent,
  
  // Instructors
  createInstructor,
  bulkCreateInstructors,
  getInstructors,
  updateInstructor,
  deleteInstructor,
  createSuperAdmin,
  registerSchoolAdmin,
  
  // Course Registrations
  getCourseRegistrations,
  registerCourse,
  registerManyCourses,
  uploadResult,
  uploadMultipleResults,
  getSemesterResult,
  getTranscript,
  
  // Courses
  createCourse,
  getCourses,
  getCoursesByDepartment,
  getCoursesByInstructor,
  updateCourse,
  deleteCourse,
  
  // Utilities
  scoreToGrade,
  gradeToPoint,
  calculateGPA,
  handleApiError,
  queryKeys
};
