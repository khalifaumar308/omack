export interface Payable {
  _id?: string;
  school: string;
  department?: string;
  level: string;
  targetGroup: "Student" | "Applicant" | "Both";
  session: string;
  semester: "First" | "Second" | "Session";
  partPayment: boolean;
  minPercentage?: number;
  amount: number;
  dueDate: Date;
  description: string;
  isForAllDepartments: boolean;
  linkedTo?: "Results" | "Course Registration" | "ID Card" | "Application" | "Others";
  createdAt?: string;
  updatedAt?: string;
}

export interface IPopulatedPayable extends Omit<Payable, 'department'> {
  department: {
    _id: string;
    name: string;
  };
}

export interface PayableFormData {
  level: string;
  session: string;
  semester: 'First' | 'Second' | 'Session';
  amount: number;
  dueDate: string;
  description: string;
  partPayment?: boolean;
  department?: string;
  isForAllDepartments?: boolean;
  minPercentage: number;
  linkedTo: "Results" | "Course Registration" | "ID Card" | "Others";

}