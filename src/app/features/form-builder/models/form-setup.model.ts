export interface FormSetupData {
  id?: string;
  formName: string;
  branch: string;
  logoUrl?: string;
  section: string;
  responsibleUser: string;
  formStatus: FormStatus;
  submittedButtonName: string;
  defaultAcademicYear: string;
  description: string;
  successMessage: string;
  confirmationMessage: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum FormStatus {
  UNPUBLISHED = 'unpublished',
  PUBLISHED = 'published'
}

export interface BranchOption {
  id: string;
  name: string;
}

export interface SectionOption {
  id: string;
  name: string;
}

export interface AcademicYearOption {
  id: string;
  year: string;
}
