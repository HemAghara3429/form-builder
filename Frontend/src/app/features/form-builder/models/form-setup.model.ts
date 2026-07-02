//here creating a blue print for the form...
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

//form status only two type either publish or unpublish.
export enum FormStatus {
  UNPUBLISHED = 'unpublished',
  PUBLISHED = 'published'
}

//branch take to data one of id and other name.
export interface BranchOption {
  id: string;
  name: string;
}

//section option take only the two filed one of the id and name.
export interface SectionOption {
  id: string;
  name: string;
}

//Acedmic year two filed only require one id and year.
export interface AcademicYearOption {
  id: string;
  year: string;
}
