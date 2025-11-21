export interface Course {
  id?: string;
  _id?: string;
  code: string;
  title: string;
  creditUnits: number;
  semester: string;
}

export interface IRegistrationSetting {
  _id: string;
  department: string;
  level: string;
  semester: 'First' | 'Second';
  session: string;
  maxCredits: number;
  coreCourses: string[];
  startDate: string;
  endDate: string;
}

export interface PopulatedRegistrationSetting extends Omit<IRegistrationSetting, "coreCourses"| "department" > {
    coreCourses: Course[];
    department: {
      _id: string;
      name: string;
    };
}