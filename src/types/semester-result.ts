/**
 * Comprehensive type definitions for the getSemesterResult endpoint
 * Covers all possible response scenarios from the server
 */

// Basic Course structure
export interface CourseInfo {
  _id?: string;
  id?: string;
  code: string;
  title: string;
  creditUnits: number;
  semester?: string;
}

// Course Registration with populated course info
export interface CourseRegistrationWithCourse {
  _id: string;
  student: string;
  course: CourseInfo;
  semester: 'First' | 'Second';
  session: string;
  score?: number;
  grade?: string;
  status?: 'pending' | 'approved' | 'rejected';
  createdAt?: string;
  updatedAt?: string;
}

// Result Summary containing GPA and academic performance metrics
export interface ResultSummaryData {
  _id?: string;
  student: string;
  semester: 'First' | 'Second';
  session: string;
  // Current semester metrics
  TCU: number; // Total Credit Units
  TGP: number; // Total Grade Points
  GPA: number; // Grade Point Average (current semester)
  // Cumulative metrics (all semesters including current)
  cumulativeTCU: number;
  cumulativeTGP: number;
  CGPA: number; // Cumulative GPA
  // Previous metrics (all before current session)
  previous: {
    TCU: number;
    TGP: number;
    CGPA: number;
  };
  comment?: string;
  level?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Payable information with payment tracking
export interface PayableWithPaymentInfo {
  _id: string;
  school: string;
  department?: string;
  level: string;
  session: string;
  semester: 'First' | 'Second' | 'Session';
  partPayment: boolean;
  minPercentage?: number;
  amount: number;
  dueDate: string;
  description: string;
  isForAllDepartments: boolean;
  linkedTo?: 'Results' | 'Course Registration' | 'ID Card' | 'Others';
  // Calculated fields from transaction aggregation
  percentagePaid: number; // Percentage of payable amount paid (0-100)
  totalPaid: number; // Total amount paid towards this payable
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Success response: Results are accessible
 * Returned when all linked payables (payment requirements) are satisfied
 */
export interface GetSemesterResultSuccess {
  courses: CourseRegistrationWithCourse[];
  summary: ResultSummaryData;
  
}

export interface IStudentSemesterResultResponce {
  courses?: CourseRegistrationWithCourse[];
  summary?: ResultSummaryData;
  message?: 'Results not accessible due to incomplete payments';
  payables?: PayableWithPaymentInfo[];
}

/**
 * Blocked response: Results exist but are not accessible due to incomplete payments
 * Returned when student hasn't paid the minimum required amount for linked payables
 */
export interface GetSemesterResultBlocked {
  message: 'Results not accessible due to incomplete payments';
  payables: PayableWithPaymentInfo[];
}

/**
 * Unified success response type
 * Use discriminated union pattern to determine response type
 */
export type GetSemesterResultResponse = 
  | GetSemesterResultSuccess 
  | GetSemesterResultBlocked;

/**
 * Type guard to check if results are accessible
 * @example
 * if (isResultsAccessible(response)) {
 *   // response.courses and response.summary are available
 *   console.log(response.summary.GPA);
 * } else {
 *   // response.payables are available
 *   console.log(response.payables);
 * }
 */
export function isResultsAccessible(
  response: GetSemesterResultResponse
): response is GetSemesterResultSuccess {
  return 'courses' in response && 'summary' in response;
}

/**
 * Type guard to check if results are blocked
 */
export function isResultsBlocked(
  response: GetSemesterResultResponse
): response is GetSemesterResultBlocked {
  return 'payables' in response && response.message?.includes('incomplete payments');
}

/**
 * Error response types (HTTP errors from API)
 * These are handled separately by axios/react-query error handlers
 */
export interface GetSemesterResultErrorResponse {
  message: string;
  semester?: string;
  session?: string;
  error?: unknown;
}

/**
 * Union type for all possible API responses (success + error)
 */
export type GetSemesterResultApiResponse = 
  | GetSemesterResultResponse 
  | GetSemesterResultErrorResponse;

/**
 * Helper interface for calculating payment requirements
 */
export interface PaymentRequirement {
  payable: PayableWithPaymentInfo;
  isSatisfied: boolean;
  percentageDeficit: number; // How much more % they need to pay (0 if satisfied)
  amountDeficit: number; // How much more they need to pay
}

/**
 * Enhanced success response type with processed payment data
 * Useful for UI that needs to show payment status
 */
export type GetSemesterResultSuccessEnhanced = GetSemesterResultSuccess & {
  paymentRequirements?: PaymentRequirement[];
  allPaymentsSatisfied?: boolean;
};

/**
 * Enhanced blocked response type with processed payment requirements
 */
export type GetSemesterResultBlockedEnhanced = GetSemesterResultBlocked & {
  paymentRequirements: PaymentRequirement[];
  allPaymentsSatisfied: false;
};

/**
 * Enhanced response type with processed payment data
 * Useful for UI that needs to show payment status
 */
export type GetSemesterResultEnhanced = 
  | GetSemesterResultSuccessEnhanced 
  | GetSemesterResultBlockedEnhanced;
