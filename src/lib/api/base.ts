/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IPopulatedPayable, Payable, PayableFormData } from '@/types/payable';
import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type {
  User, Student, Instructor, School, Faculty, Department, Course,
  CourseRegistration, ResultSummary,
  RegisterCourseRequest, RegisterManyCoursesRequest,
  UploadResultRequest, UploadMultipleResultsRequest, UploadResultResponse,
  CreateSchoolForm,
  CreateFacultyForm, CreateDepartmentForm, CreateStudentForm,
  CreateInstructorForm,
  PopulatedDepartment,
  PopulatedStudent,
  StudentsSemesterResultsResponse,
  AdminUploadResultsRequest,
  PopulatedUser,
  GradingTemplateListResponse,
  CreateGradingTemplateRequest,
  UpdateGradingTemplateRequest,
  StudentRegistrationsInfo,
  PopulatedInstructor,
  PaginatedResponse,
  CourseRegistrationInstructorItem,
  PopulatedCourse,
  CreateCourseForm,
  PopulatedCourseRegistration,
} from '@/components/types';
import type {
  // WalletBalance,
  WalletTransactionsResponse,
  InitiateWalletFundingRequest,
  InitiateWalletFundingResponse,
  VerifyWalletFundingResponse,
  WalletBalance
} from './wallet.types';
import type { PayableFilters } from '@/types/pagination';
import type { PopulatedRegistrationSetting } from '@/types/index';
import type { RegistrationSettingsResponse } from './types';
import type { IStudentSemesterResultResponce } from '@/types/semester-result';

// Configure your API base URL
const API_BASE_URL = 'https://hmsms-api.onrender.com/api';
// const API_BASE_URL = 'http://localhost:5000/api';


// =============================================================================
// SECURE AXIOS INSTANCE WITH COOKIES AND CSRF
// =============================================================================
// const getCsrfToken = async () => {
//   const val = (await cookieStore.get('_csrfSecret'))?.value
//   return val || null;
// }
// Access token management (access token stored in localStorage; refresh handled by httpOnly cookie)
let accessToken: string | null = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

// Create secure axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  withCredentials: true, // Include cookies automatically
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  },
});

// Request interceptor to add Authorization header when we have an access token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!config.headers) (config.headers as any) = {};
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : accessToken;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for automatic token refresh and CSRF token management
api.interceptors.response.use(
  (response: AxiosResponse) => {
    //navigate to login if its 401
    if ([401, 402, 403].includes(response.status)) {
      // Handle unauthorized access (e.g., redirect to login)
      window.location.href = '/login';
    }
    // Update access token if provided in response body
    if (response.data && response.data.accessToken) {
      accessToken = response.data.accessToken;
      try {
        if (typeof window !== 'undefined' && accessToken) localStorage.setItem('accessToken', accessToken);
      } catch (e) {
        console.warn('Failed to persist access token', e);
      }
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    console.log('[API] response error', error.config?.url, error.response?.status, error.response?.data);
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Attempt to refresh access token using refresh endpoint (refresh token should be httpOnly cookie)
      try {
        const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        const newAccess = refreshResponse.data?.accessToken;
        if (newAccess) {
          accessToken = newAccess;
          try {
            if (typeof window !== 'undefined' && accessToken) localStorage.setItem('accessToken', accessToken);
          } catch (e) {
            console.warn('Failed to persist access token', e);
          }

          // Set Authorization header on original request and retry
          if (!originalRequest.headers) originalRequest.headers = {};
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.warn('Token refresh failed', refreshError);
        authManager.handleAuthFailure();
        return Promise.reject(refreshError);
      }
      // If refresh didn't provide token, treat as auth failure
      authManager.handleAuthFailure();
    }

    return Promise.reject(error);
  }
);

// =============================================================================
// SECURE AUTHENTICATION MANAGEMENT
// =============================================================================

export const authManager = {
  // Get current access token
  getAccessToken: (): string | null => {
    try {
      if (typeof window !== 'undefined') return localStorage.getItem('accessToken');
    } catch (e) {
      console.warn('Failed to read access token', e);
    }
    return accessToken;
  },

  // Set access token (stores in memory + localStorage)
  setAccessToken: (token: string | null): void => {
    accessToken = token;
    try {
      if (typeof window !== 'undefined') {
        if (token) localStorage.setItem('accessToken', token);
        else localStorage.removeItem('accessToken');
      }
    } catch (e) {
      console.warn('Failed to persist/clear access token', e);
    }
  },

  // Clear access token
  clearAccessToken: (): void => {
    accessToken = null;
    try {
      if (typeof window !== 'undefined') localStorage.removeItem('accessToken');
    } catch (e) {
      console.warn('Failed to clear access token', e);
    }
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
    authManager.clearAccessToken();

    // Dispatch logout event for React components to handle
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:logout', {
        detail: { message: 'Authentication failed' }
      }));
    }
  },

  // Handle successful authentication (expects object with accessToken and user)
  handleAuthSuccess: (data: any): void => {
    if (data?.accessToken) {
      authManager.setAccessToken(data.accessToken);
    }
    // Dispatch login event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:login', {
        detail: { user: data.user }
      }));
    }
  }
};

// =============================================================================
// AUTHENTICATION APIs
// =============================================================================

export const userLogin = async (email: string, password: string) => {
  // Perform login - expect server to return accessToken in response body and set refresh cookie
  const response = await api.post("/auth/login", { email, password });

  // Handle successful authentication (store accessToken if returned)
  console.log(response.data, 'datatat')
  authManager.handleAuthSuccess(response.data);

  return response.data;
};

export const getStudentSummary = async () => {
  const response = await api.get<{
    student: PopulatedStudent;
    currentCgpa: number;
    totalCreditUnits: number;
    coursesCount: number;
    courses: Array<{
      id: string;
      code: string;
      title: string;
      creditUnits: number;
    }>;
    semester: string;
    session: string;
  }>("/students/summary");
  return response.data;
};

export const userLogout = async () => {
  try {
    await api.post("/auth/logout", {}, { withCredentials: true });
  } catch (error) {
    // Continue with logout even if server call fails
    console.warn('Logout request failed:', error);
  } finally {
    // Clear access token and dispatch logout event
    authManager.handleAuthFailure();
  }
};

export const refreshToken = async () => {
  const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
  // If a new accessToken is returned, persist it
  if (response.data?.accessToken) {
    authManager.setAccessToken(response.data.accessToken);
  }
  return response.data;
};

export const getCurrentUser = async () => {
  return await authManager.getCurrentUser();
};

export const checkAuthStatus = async () => {
  return await authManager.isAuthenticated();
};

//grading template

export const getGradingTemplates = async () => {
  const response = await api.get<GradingTemplateListResponse>("/grading-templates");
  return response.data
}

export const createGradingTemplate = async (template: CreateGradingTemplateRequest) => {
  const response = await api.post("/grading-templates", template);
  return response.data
}

export const updateGradingTemplate = async (id: string, update: UpdateGradingTemplateRequest) => {
  const responce = await api.put(`/grading-templates/${id}`, update)
  return responce.data
}

export const getGradingTemplateById = async (id: string) => {
  const responce = await api.get(`/grading-templates/${id}`)
  return responce.data
}

export const deleteGradingTemplate = async (id: string) => {
  const responce = await api.delete(`/grading-templates/${id}`)
  return responce.data
}

// =============================================================================
// REGISTRATION SETTINGS APIs (admin)
// =============================================================================
export const getRegistrationSettings = async (params?: { page?: number; limit?: number; department?: string; level?: string; semester?: string; session?: string }) => {
  console.log(params, 'params in api')
  const response = await api.get<PaginatedResponse<PopulatedRegistrationSetting>>(`/registration-settings`, { params });
  return response.data;
}

export const createRegistrationSetting = async (payload: {
  department: string;
  level: string;
  semester: "First" | "Second";
  session: string;
  maxCredits: number;
  coreCourses?: string[];
  startDate: string | Date;
  endDate: string | Date;
}) => {
  const response = await api.post(`/registration-settings`, payload);
  return response.data;
}

export const updateRegistrationSetting = async (id: string, payload: {
  maxCredits?: number;
  coreCourses?: string[];
  startDate?: string | Date;
  endDate?: string | Date;
}) => {
  const response = await api.put(`/registration-settings/${id}`, payload);
  return response.data;
}
export const deleteRegistrationSetting = async (id: string) => {
  const response = await api.delete(`/registration-settings/${id}`);
  return response.data;
}

// =============================================================================
// PAYABLE MANAGEMENT APIs
// =============================================================================
export const getPayables = async (filters: PayableFilters): Promise<PaginatedResponse<IPopulatedPayable>> => {
  const params = new URLSearchParams();
  params.append('page', String(filters.page));
  params.append('limit', String(filters.limit));
  if (filters.session) params.append('session', filters.session);
  if (filters.semester) params.append('semester', filters.semester);
  if (filters.level) params.append('level', filters.level);
  if (filters.search) params.append('search', filters.search);

  const response = await api.get(`/payables?${params.toString()}`);
  return response.data;
};

export const createPayable = async (data: PayableFormData): Promise<Payable> => {
  const response = await api.post('/payables', data);
  return response.data;
};

export const updatePayable = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<PayableFormData>;
}): Promise<Payable> => {
  const response = await api.put(`/payables/${id}`, data);
  return response.data;
};

export const deletePayable = async (id: string): Promise<void> => {
  await api.delete(`/payables/${id}`);
};

// Student-specific payables (supports cursor-based pagination)
export const getStudentPayables = async (params: { session?: string; semester?: string; limit?: number; cursor?: string }) => {
  const response = await api.get(`/payables/student/my-payables`, { params });
  console.log('Student payables response:', response.data);
  return response.data;
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

/**
 * Results Release APIs (school-admin)
 */
export const getSchoolResultsRelease = async (schoolId: string, session: string, semester: "First" | "Second") => {
  const response = await api.get<{ released: boolean; record?: { session: string; semester: string; released: boolean; releasedAt?: string; releasedBy?: string } | null }>(
    `/schools/${schoolId}/results-release`,
    { params: { session, semester } }
  );
  return response.data;
};

export const setSchoolResultsRelease = async (schoolId: string, payload: { session: string; semester: "First" | "Second"; released: boolean }) => {
  const response = await api.put<{ message: string; record: any; resultsRelease: any[] }>(
    `/schools/${schoolId}/results-release`,
    payload
  );
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

export const bulkCreateCourses = async (courses: CreateCourseForm[]) => {
  const response = await api.post<Course[]>("/courses/bulk", { courses });
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
  console.log("Updating student:", id, studentData);
  const response = await api.put<Student>(`/students/${id}`, studentData);
  return response.data;
};

export const deleteStudent = async (id: string) => {
  const response = await api.delete<{ message: string }>(`/students/${id}`);
  return response.data;
};

export const transitionStudents = async (data: { fromLevel: string; toLevel: string; department: string }) => {
  const response = await api.put("/students/transition", data);
  return response.data;
};

// Instructor: get paginated registrations for a specific course (for instructors)
export const getCourseRegistrationsForInstructor = async (
  courseId: string,
  semester?: string,
  session?: string,
  page: number = 1,
  limit: number = 20,
  search: string = ''
): Promise<PaginatedResponse<CourseRegistrationInstructorItem>> => {
  const params: Record<string, any> = { page, limit };
  if (semester) params.semester = semester;
  if (session) params.session = session;
  if (search) params.search = search;

  const response = await api.get(`/course-registrations/courses/${courseId}/registrations`, { params });
  return response.data;
};

export const exportCourseRegistrationsCsv = async (courseId: string, semester?: string, session?: string, search: string = '') => {
  const params: any = {};
  if (semester) params.semester = semester;
  if (session) params.session = session;
  if (search) params.search = search;
  // Return raw blob response so caller can trigger download
  const response = await api.get(`/course-registrations/courses/${courseId}/registrations/export`, { params, responseType: 'blob' });
  return response.data;
}
// Upload file using multipart/form-data to server upload route
export const uploadFile = async (formData: FormData) => {
  const response = await api.post('/uploads/file', formData, {
    headers: {
      // Let browser set the Content-Type with boundary
      'Content-Type': 'multipart/form-data',
    },
    // increase timeout for uploads
    timeout: 30000,
  });
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
  const response = await api.get<PopulatedInstructor[]>("/instructors/");
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

export const getInstructorCoursesStats = async (id: string) => {
  const response = await api.get<{
    instructor: { id: string; name?: string };
    semester?: string;
    session?: string;
    courses: Array<{
      id: string;
      code?: string;
      title?: string;
      creditUnits?: number;
      registrations: number;
    }>;
  }>(`/instructors/${id}/courses-stats`);
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

export const updateCourseRegsStatus = async (body: { studentId: string[]; semester: string; session: string; status: "pending" | "approved" | "rejected" }) => {
  const response = await api.patch("/course-registrations/registrations/bulk-status", { ...body, studentIds: body.studentId });
  return response.data;
};

export const enterResult = async (registrationId: string, score: number) => {
  const response = await api.put<{ message: string; registration: CourseRegistration }>(`/course-registrations/${registrationId}/result`, { score });
  return response.data;
}

export const getCourseRegistrations = async (
  semester?: string,
  session?: string,
  page: number = 1,
  limit: number = 10,
  search: string = '',
  student?: string,
  department?: string
) => {
  let url = '/course-registrations/registrations';
  const params = new URLSearchParams();
  console.log(semester, session, ');');
  if (semester) params.append('semester', semester);
  if (session) params.append('session', session);
  if (page) params.append('page', String(page));
  if (limit) params.append('limit', String(limit));
  if (search) params.append('search', search);
  if (student && student !== 'all') params.append('student', student);
  if (department && department !== 'all') params.append('department', department);

  if (Array.from(params).length > 0) {
    url = `${url}?${params.toString()}`;
  }

  // Expect the backend to respond with either an array of registrations or an object
  // { data: IAdminCourseRegs[], pagination: { page, limit, total, totalPages, hasNext, hasPrev } }
  const response = await api.get<any>(url);
  return response.data;
};

export const getCourseRegPercourse = async (courseId: string, semester: string, session: string) => {
  const response = await api.get<{ regs: PopulatedCourseRegistration }>(`/course-registrations/course/${courseId}`, {
    params: { semester, session }
  });
  return response.data;
}

export const addMarksToStudents = async (courseId: string, semester: string, session: string, marksToAdd: number) => {
  const response = await api.post<{
    success: boolean;
    message: string;
    affectedStudents: number;
    updatedStudentIds: string[];
  }>('/course-registrations/add-marks', {
    courseId,
    semester,
    session,
    marksToAdd
  });
  return response.data;
}

export const updateSemesterCourseReg = async (body:
  {
    studentId: string; semester: string;
    session: string, newCourseIds?: string[];
    status?: "pending" | "approved" | "rejected"
  }
) => {
  const response = await api.patch("/course-registrations/edit", body);
  return response.data
}

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

export const adminUploadResults = async (results: AdminUploadResultsRequest) => {
  const response = await api.post<{ message: string; registration: CourseRegistration }>(`/course-registrations/admin-results`, results);
  return response.data;
};

export const uploadMultipleResults = async (resultsData: UploadMultipleResultsRequest) => {
  const response = await api.post<UploadResultResponse[]>("/course-registrations/results/bulk", resultsData);
  return response.data;
};

export const getSemesterResult = async (semester: string, session: string) => {
  const response = await api.get<IStudentSemesterResultResponce>(`/course-registrations/semester?semester=${semester}&session=${session}`);
  return response.data;
};

export const getStudentsSemesterResults = async (
  semester: string,
  session: string,
  page: number = 1,
  limit: number = 10,
  search: string = '',
  level: string = 'all'
) => {
  const params = new URLSearchParams({
    semester,
    session,
    page: page.toString(),
    limit: limit.toString(),
  });
  if (search) params.append('search', search);
  if (level && level !== 'all') params.append('level', level);
  const response = await api.get<{ data: StudentsSemesterResultsResponse[]; pagination: any }>(
    `/course-registrations/semester-results?${params.toString()}`
  );
  return response.data;
};

export const getTranscript = async () => {
  const response = await api.get<ResultSummary[]>("/course-registrations/transcript");
  return response.data;
};

// =============================================================================
// WALLET / TRANSACTION APIs
// =============================================================================

// export interface WalletBalanceResponse {
//   balance: number;
//   id: string;
// }

// export interface WalletInitResponse {
//   authorization_url: string;
//   reference: string;
//   access_code: string;
// }

// export interface WalletTransactionItem {
//   _id: string;
//   studentId?: string;
//   schoolId?: string;
//   payable?: string | { _id: string; description?: string; amount?: number };
//   amount: number;
//   type: 'credit' | 'debit';
//   method: 'paystack' | 'manual' | 'wallet';
//   status: 'pending' | 'success' | 'failed';
//   reference: string;
//   description: string;
//   metadata?: Record<string, any>;
//   receiptNo?: string;
//   createdAt: string;
//   updatedAt?: string;
// }

// export const getWalletBalance = async () => {
//   const response = await api.get<WalletBalanceResponse>(`/wallet/balance`);
//   return response.data;
// };

// export const initiateWalletFunding = async (amount: number) => {
//   const response = await api.post<WalletInitResponse>(`/wallet/fund`, { amount });
//   return response.data;
// };

// export const verifyWalletFunding = async (reference: string) => {
//   const response = await api.get(`/wallet/verify`, { params: { reference } });
//   return response.data;
// };

// export const getWalletTransactions = async (page: number = 1, limit: number = 10) => {
//   const response = await api.get<{ transactions: WalletTransactionItem[]; pagination: any }>(`/wallet/transactions`, { params: { page, limit } });
//   return response.data;
// };

export const getWalletTransactions = async (
  params: { page: number; limit: number }
): Promise<WalletTransactionsResponse> => {
  const response = await api.get<WalletTransactionsResponse>('/wallet/transactions', {
    params,
  });
  return response.data;
};

export const initiateWalletFunding = async (
  data: InitiateWalletFundingRequest
): Promise<InitiateWalletFundingResponse> => {
  const response = await api.post<InitiateWalletFundingResponse>('/wallet/fund', data);
  return response.data;
};

export const initiatePayablePayment = async (
  payableId: string, amount: number
) => {
  const response = await api.post<{status: boolean,message: string, data: {authorization_url: string, reference: string, access_code: string}}>(`/payables/initiate-payment/${payableId}?amount=${amount}`);
  return response.data;
};
export const getWalletBalance = async (): Promise<WalletBalance> => {
  const response = await api.get<WalletBalance>('/wallet/balance');
  return response.data;
};

export const verifyWalletFunding = async (
  reference: string
): Promise<VerifyWalletFundingResponse> => {
  const response = await api.get<VerifyWalletFundingResponse>(`/wallet/verify?reference=${reference}`);
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
  instructors?: string[];
  creditUnits: number;
  semester: string;
  level?: string;
}) => {
  const response = await api.post<PopulatedCourse>("/courses", courseData);
  return response.data;
};

export const getSemesterCourseRegsStats = async (courseCodes: string[], semester: string, session: string) => {
  const response = await api.post<{ data: { code: string, registrations: PopulatedCourseRegistration[], course: Course }[] }>(`/course-registrations/semester-results`, { courseCodes, semester, session });
  return response.data.data;
}

export const getCourseIdsFromCodes = async (courseCodes: string[]) => {
  const response = await api.post<{ courses: { id: string; code: string }[] }>("/courses/ids", { courseCodes });
  return response.data.courses;
};

// Export results as an XLSX (returns Blob)
export const exportResults = async (params: { departmentId: string; level?: string; semester: string; session: string }) => {
  const response = await api.get('/exports', { params, responseType: 'blob' as const });
  return response.data;
}

export const getadmindashBoardData = async () => {
  const response = await api.get<{
    studentCount: number,
    courseCount: number,
    departmentCount: number,
    facultyCount: number
  }>(`/schools/admin-dashboard`);
  return response.data;
};

export const getCourses = async (page?: number, limit?: number, search?: string, department?: string, semester?: string, level?: string) => {
  const params: Record<string, string> = {};
  if (page) params.page = String(page);
  if (limit) params.limit = String(limit);
  if (search) params.search = search;
  if (department) params.department = department;
  if (semester && semester !== 'all') params.semester = semester;
  if (level && level !== 'all') params.level = level;

  const response = await api.get<{
    data: PopulatedCourse[]; pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    }
  }>(`/courses`, { params });
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
  // Map to new access-token API
  authManager.setAccessToken(token);
};

// Helper function to clear authorization (deprecated - use authManager instead)
export const clearAuthToken = () => {
  console.warn('clearAuthToken is deprecated. Use authManager.clearCSRFToken() instead.');
  // Map to new access-token API
  authManager.clearAccessToken();
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

export const getStudentRegstrationsInfo = async () => {
  const response = await api.get<StudentRegistrationsInfo[]>(`/course-registrations/student-regs`);
  return response.data;
}

export const getStudentRegSettingsInfo = async (semester: string, session: string) => {
  const response = await api.get<RegistrationSettingsResponse>(`/course-registrations/student-reg-settings/?semester=${semester}&session=${session}`);
  return response.data;
}

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
  getSchoolResultsRelease,
  setSchoolResultsRelease,

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

  // Export
  exportResults,

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
  queryKeys,

  // Wallet
  getWalletBalance,
  initiateWalletFunding,
  verifyWalletFunding,
  getWalletTransactions,

  // Student summary
};




