import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import {
  FormSetupData,
  BranchOption,
  SectionOption,
  AcademicYearOption,
  FormStatus,
} from '../models/form-setup.model';

const STORAGE_KEY = 'form-setup-data';   //local storage key for the store data form-setup

@Injectable({
  providedIn: 'root',
})
export class FormSetupService {
  private readonly API_URL = '/api/forms';
  private formSetupData$ = new BehaviorSubject<FormSetupData | null>(this.getStoredFormSetupData());

  //branch option data for the form
  private mockBranches: BranchOption[] = [
    { id: '1', name: 'Information Technology' },
    { id: '2', name: 'Computer Science' },
    { id: '3', name: 'Business Administration' },
  ];

  //section option data for the form setup
  private mockSections: SectionOption[] = [
    { id: '1', name: 'Admissions' },
    { id: '2', name: 'General Inquiry' },
    { id: '3', name: 'Support' },
  ];

  //academic year option data for the form setup
  private mockAcademicYears: AcademicYearOption[] = [
    { id: '1', year: '2025 - 2026' },
    { id: '2', year: '2026 - 2027' },
    { id: '3', year: '2027 - 2028' },
  ];

  constructor(private http: HttpClient) {}

  getBranches(): Observable<BranchOption[]> {
    // Replace with actual API call
    return new Observable((observer) => {
      observer.next(this.mockBranches);
      observer.complete();
    });
  }

  getSections(): Observable<SectionOption[]> {
    // Replace with actual API call
    return new Observable((observer) => {
      observer.next(this.mockSections);
      observer.complete();
    });
  }

  getAcademicYears(): Observable<AcademicYearOption[]> {
    // Replace with actual API call
    return new Observable((observer) => {
      observer.next(this.mockAcademicYears);
      observer.complete();
    });
  }
  saveFormSetup(formData: FormSetupData): Observable<FormSetupData> {
    // Replace with actual API call
    // return this.http.post<FormSetupData>(`${this.API_URL}/setup`, formData);
    return new Observable((observer) => {
      const savedData = { ...formData, id: 'new-' + Date.now() };
      this.storeFormSetupData(savedData);
      this.formSetupData$.next(savedData);
      observer.next(savedData);
      observer.complete();
    });
  }
  getFormSetupData(): Observable<FormSetupData | null> {
    return this.formSetupData$.asObservable();
  }
  getFormSetupById(id: string): Observable<FormSetupData> {
    // Replace with actual API call
    // return this.http.get<FormSetupData>(`${this.API_URL}/${id}`);
    return new Observable((observer) => {
      // Mock implementation
      observer.next({
        id,
        formName: '',
        branch: '',
        logoUrl: '',
        section: '',
        responsibleUser: '',
        formStatus: FormStatus.UNPUBLISHED,
        submittedButtonName: 'Submit',
        defaultAcademicYear: '',
        description: '',
        successMessage: '',
        confirmationMessage: '',
      });
      observer.complete();
    });
  }
  clearFormSetupData(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.formSetupData$.next(null);
  }

  private storeFormSetupData(formData: FormSetupData): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }

  private getStoredFormSetupData(): FormSetupData | null {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) {
      return null;
    }

    try {
      return JSON.parse(storedData) as FormSetupData;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }
}
