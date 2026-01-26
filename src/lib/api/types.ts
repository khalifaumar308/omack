// Base Types
export interface Payable {
  _id: string;
  school: string;
  level: number;
  session: string;
  semester: string;
  amount: number;
  dueDate: string;
  description: string;
  partPayment: boolean;
  department?: {
    _id: string;
    name: string;
  };
  isForAllDepartments: boolean;
  amountPaid: number;
  percentagePaid: number;
}

export interface Transaction {
  _id: string;
  amount: number;
  payable: string;
  student: string;
  reference: string;
  status: 'pending' | 'success' | 'failed';
}

// Query Types
export interface PayablesResponse {
  data: Payable[];
  pagination: {
    hasNext: boolean;
    nextCursor: string | null;
    limit: number;
  };
}

export interface PayableFilters {
  limit?: number;
  session?: string;
  semester?: string;
  cursor?: string;
}

export interface WalletTransaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  status: 'completed' | 'pending' | 'failed';
  description: string;
  createdAt: string;
}

export interface WalletBalance {
  balance: number;
  currency: string;
}

export interface RegistrationSetting {
  department: string;
  level: string;
  semester: "First" | "Second";
  session: string;
  maxCredits: number;
  coreCourses: {_id:string; code: string; title: string; creditUnits: number;}[];
  startDate: Date;
  endDate: Date;
  createdBy?: string;
}

export interface RegistrationSettingsResponse {
  regSettings: RegistrationSetting;
  carryOverCourses: {_id:string; code: string; title: string; creditUnits: number;}[];
}


/**
 * Client-side TypeScript types for the Applicant Management system.
 * These interfaces are designed to be used in React TypeScript clients.
 */

export interface IOLevelSubject {
    subject: string;
    grade: 'A1' | 'B2' | 'B3' | 'C4' | 'C5' | 'C6' | 'D7' | 'E8' | 'F9';
}

export interface IOLevelSitting {
    examType: 'WAEC' | 'NECO' | 'NABTEB' | 'GCE';
    examNumber: string;
    examYear: string;
    subjects: IOLevelSubject[];
}

export interface Applicant {
    _id: string;
    school: string | { _id: string; name: string };
    surname: string;
    firstName: string;
    middleName?: string;
    dateOfBirth: string;
    gender: 'Male' | 'Female';
    stateOfOrigin: string;
    lga: string;
    nationality: string;
    religion: 'Christianity' | 'Islam' | 'Traditional' | 'Others';
    maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
    phoneNumber: string;
    email: string;
    residentialAddress: string;
    nin: string;
    passportPhoto: string;
    jambRegNumber: string;
    jambScore: number;
    firstChoice: string;
    secondChoice: string;
    firstSitting: IOLevelSitting;
    secondSitting?: IOLevelSitting;
    nokFullName: string;
    nokRelationship: string;
    nokPhoneNumber: string;
    nokAddress: string;
    applicationNumber?: string;
    status: 'pending' | 'approved' | 'rejected';
    paymentStatus: 'pending' | 'paid';
    hasPaid: boolean;
    submittedAt: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Input for submitting a new application
 */
export type SubmitApplicationRequest = Omit<
    Applicant,
    | "_id"
    | "applicationNumber"
    | "status"
    | "paymentStatus"
    | "hasPaid"
    | "submittedAt"
    | "createdAt"
    | "updatedAt"
> & { school: string };

/**
 * Response from submitApplication endpoint
 */
export interface SubmitApplicationResponse {
    application: Applicant;
    payment?: {
        authorization_url: string;
        access_code: string;
        reference: string;
    };
}

/**
 * Response from getApplicationStatus endpoint
 */
export interface GetApplicationStatusResponse extends Applicant {
    school: {
        _id: string;
        name: string;
    };
}

/**
 * Transaction interface for frontend use
 */
export interface ApplicantTransaction {
    _id: string;
    applicantId?: string;
    schoolId: string;
    payable?: string;
    amount: number;
    type: 'credit' | 'debit';
    method: 'paystack' | 'manual' | 'wallet';
    status: 'pending' | 'success' | 'failed';
    reference: string;
    description: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata: Record<string, any>;
    receiptNo?: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Response from verifyApplicantPayment endpoint
 */
export interface VerifyApplicantPaymentResponse {
    status: "success" | "failed";
    transaction: ApplicantTransaction;
}

/**
 * Response from getApplications (admin) endpoint
 */
export type GetApplicationsResponse = Applicant[];

/**
 * Common error response
 */
export interface ApplicantErrorResponse {
    message: string;
    error?: string;
}
