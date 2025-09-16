export interface ISchool {
  id: string;
  name: string;
  address: string;
  email: string;
  logo: string;
  active: boolean;
  registrarSignature?: string;
  createdAt: string;
  updatedAt: string;
}
// =LOWER(LEFT(c2,3)) & LOWER(SUBSTITUTE(MID(c2,4,LEN(c2)),"/","")) & "@omark.com"
export interface ICreateSchoolRequest {
  name: string;
  address: string;
  email: string;
  logo: string;
  registrarSignature?: string;
}




export interface ICreateFacultyRequest {
  name: string;
  code: string;
  description?: string;
  dean?: string;
}

export interface BaseUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth?: string;
  address?: string;
  profilePicture?: string; // URL or base64 string
  schoolId?: string;
  school?: ISchool;
  createdAt: string;
  updatedAt: string;
}

export interface Student extends BaseUser {
  type: "student";
  studentId: string;
  matricNumber: string;
  levelId?: string;
  facultyId?: string;
  departmentId?: string;
  currentLevel: number;
  admissionYear: number;
  status: "active" | "inactive" | "graduated" | "suspended";
}

export interface Instructor extends BaseUser {
  type: "instructor";
  employeeId: string;
  title: string; // Dr., Prof., Mr., Mrs., etc.
  qualification: string;
  specialization: string;
  departmentId?: string;
  facultyId?: string;
  status: "active" | "inactive" | "retired";
}

// Academic structure types
export interface IFaculty {
  id: string;
  name: string;
  code: string;
  description?: string;
  dean?: string;
  schoolId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = object> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  total: number;
  page: number;
  pageSize: number;
  data: T[];
}
