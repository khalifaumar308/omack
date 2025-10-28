export interface Payable {
  _id?: string;
  school: string;
  department?: string;
  level: string;
  session: string;
  semester: 'First' | 'Second';
  partPayment: boolean;
  amount: number;
  dueDate: string;
  description: string;
  isForAllDepartments: boolean;
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
  semester: 'First' | 'Second';
  amount: number;
  dueDate: string;
  description: string;
  partPayment?: boolean;
  department?: string;
  isForAllDepartments?: boolean;
}