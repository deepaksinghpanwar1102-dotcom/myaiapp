
export interface SubjectResult {
  subject: string;
  marks: number;
  totalMarks: number;
}

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  class: string;
  section: string;
  results: SubjectResult[];
  lastUpdated: string;
}

export interface SchoolSettings {
  name: string;
  location: string;
  primaryColor: string;
  logoUrl?: string;
}

export type UserRole = 'admin' | 'student';

export interface UserSession {
  role: UserRole;
  data: Student | null;
}

export enum Grade {
  A_PLUS = 'A+',
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  F = 'F'
}
