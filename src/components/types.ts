/* eslint-disable @typescript-eslint/no-explicit-any */
// Client-side TypeScript types for the HMS application
// These interfaces are designed to be used in React TypeScript clients

// =============================================================================
// ENUMS AND CONSTANTS
// =============================================================================

export type UserRole = "student" | "instructor" | "school-admin" | "super-admin";

export type SchoolStatus = "active" | "inactive";

// =============================================================================
// BASE TYPES
// =============================================================================

// Base interface for all entities with timestamps
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// USER TYPES
// =============================================================================

export interface User extends BaseEntity {
  name: string;
  email: string;
  role: UserRole;
  school?: string; // ObjectId as string
}

export interface Student extends User {
  level: number;
  matricNo: string;
  department: string; // ObjectId as string
  school: string; // ObjectId as string
}

export interface Instructor extends User {
  rank?: string;
  department: string; // ObjectId as string
  school: string; // ObjectId as string
  courses?: string[]; // Array of ObjectIds as strings
}

// =============================================================================
// SCHOOL MANAGEMENT TYPES
// =============================================================================

export interface School extends BaseEntity {
  name: string;
  address: string;
  email: string;
  logo?: string;
  status: SchoolStatus;
  currentSession: string;
  currentSemester: string;
  sessions?: string[];
}

export interface Faculty extends BaseEntity {
  name: string;
  code: string;
  description?: string;
  dean?: string;
  school: string; // ObjectId as string
}

export interface Department extends BaseEntity {
  name: string;
  code: string;
  faculty: string; // ObjectId as string
  school?: string; // ObjectId as string
  description?: string;
  hod?: string; // ObjectId as string (Head of Department)
}

export interface IAdminCourseRegs {
  student: Student;
  courseRegistrations: PopulatedCourseRegistration[];
}
// =============================================================================
// COURSE TYPES
// =============================================================================

export interface Course extends BaseEntity {
  code: string;
  title: string;
  department: string; // ObjectId as string
  school: string; // ObjectId as string
  instructors: string[]; // Array of ObjectIds as strings
  creditUnits: number;
}

export interface CourseRegistration extends BaseEntity {
  student: string; // ObjectId as string
  course: string; // ObjectId as string
  semester: string;
  session: string;
  score?: number;
  grade?: string;
}

export interface ResultSummary extends BaseEntity {
  student: string; // ObjectId as string
  semester: string;
  session: string;
  TCU: number; // Total Credit Units
  TGP: number; // Total Grade Points
  GPA: number; // Grade Point Average for this semester
  cumulativeTCU: number;
  cumulativeTGP: number;
  CGPA: number; // Cumulative Grade Point Average
}

// =============================================================================
// POPULATED TYPES (WITH REFERENCED DATA)
// =============================================================================

// For when data is populated from references
export interface PopulatedCourseRegistration extends Omit<CourseRegistration, 'student' | 'course'> {
  student: Student;
  course: Course;
}

export interface PopulatedCourse extends Omit<Course, 'department' | 'school' | 'instructors'> {
  department: Department;
  school: School;
  instructors: Instructor[];
}

export interface PopulatedStudent extends Omit<Student, 'department' | 'school'> {
  department: Department;
  school: School;
}

export interface PopulatedInstructor extends Omit<Instructor, 'department' | 'school' | 'courses'> {
  department: Department;
  school: School;
  courses?: Course[];
}

export interface PopulatedDepartment extends Omit<Department, 'faculty' | 'school' | 'hod'> {
  faculty: Faculty;
  school?: School;
  hod?: Instructor;
}

export interface PopulatedFaculty extends Omit<Faculty, 'school'> {
  school: School;
}

// =============================================================================
// API REQUEST/RESPONSE TYPES
// =============================================================================

// Authentication
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User | Student | Instructor;
}

// Course Registration
export interface RegisterCourseRequest {
  course: string;
  semester: string;
  session: string;
}

export interface RegisterManyCoursesRequest {
  courses: string[];
  semester: string;
  session: string;
}

// Result Upload
export interface UploadResultRequest {
  score: number;
}

export interface UploadMultipleResultsRequest {
  results: Array<{
    id: string; // CourseRegistration ID
    score: number;
  }>;
}

export interface UploadResultResponse {
  id: string;
  registration?: CourseRegistration;
  error?: string;
}

// Student Results
export interface SemesterResultResponse {
  courses: PopulatedCourseRegistration[];
  summary?: ResultSummary;
}

export interface StudentsSemesterResultsResponse extends SemesterResultResponse {
  student: PopulatedStudent;
}

export interface TranscriptResponse {
  summaries: ResultSummary[];
}


export interface PopulatedUser extends Omit<User, 'school'> {
  school?: School;
}

export interface AdminUploadResultsRequest {
  results: Array<{
    matricNo: string;
    score: number;
    grade?: string;
    course: string;
    semester: string;
    session: string;
  }>;
}

// =============================================================================
// FORM TYPES
// =============================================================================

export interface CreateSchoolForm {
  name: string;
  address: string;
  email: string;
  logo?: string;
  currentSession: string;
  currentSemester: string;
}

export interface CreateFacultyForm {
  name: string;
  code: string;
  description?: string;
  dean?: string;
  school: string;
}

export interface CreateDepartmentForm {
  name: string;
  code: string;
  faculty: string;
  school?: string;
  description?: string;
  hod?: string;
}

export interface CreateCourseForm {
  code: string;
  title: string;
  department: string;
  school: string;
  instructors: string[];
  creditUnits: number;
}

export interface CreateUserForm {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  school?: string;
}

export interface CreateStudentForm extends CreateUserForm {
  level: number;
  matricNo: string;
  department: string;
  school: string;
}

export interface CreateInstructorForm extends CreateUserForm {
  rank?: string;
  department: string;
  school: string;
  courses?: string[];
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

// For dropdowns and select components
export interface SelectOption {
  value: string;
  label: string;
}

// For pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// For search and filtering
export interface SearchParams {
  q?: string;
  filters?: Record<string, any>;
}

// Grade calculation helpers
export interface GradeInfo {
  score: number;
  grade: string;
  points: number;
}
