import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import {
  FormSetupData,
  BranchOption,
  SectionOption,
  AcademicYearOption,
  FormStatus,
} from '../models/form-setup.model';

const STORAGE_KEY = 'form-setup-data'; // localStorage key for form setup data

// Laravel backend API – only the store endpoint is used
const API_URL = 'http://localhost:8000/api/forms';

// Shape of the API response wrapper returned by Laravel
interface ApiResponse<T> {
  message: string;
  data: T;
}

// Backend snake_case record as returned by Laravel
interface FormRecord {
  id: number;
  form_name: string;
  branch: string;
  logo_url: string | null;
  section: string;
  responsible_user: string;
  form_status: string;
  submitted_button_name: string;
  default_academic_year: string;
  description: string | null;
  success_message: string;
  confirmation_message: string;
  fields: unknown[] | null;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class FormSetupService {
  private formSetupData$ = new BehaviorSubject<FormSetupData | null>(
    this.getStoredFormSetupData()
  );

  // ── Mock dropdown data (swap for real API calls when backend endpoints exist) ──
  private mockBranches: BranchOption[] = [
    { id: '1', name: 'Information Technology' },
    { id: '2', name: 'Computer Science' },
    { id: '3', name: 'Business Administration' },
  ];

  private mockSections: SectionOption[] = [
    { id: '1', name: 'Admissions' },
    { id: '2', name: 'General Inquiry' },
    { id: '3', name: 'Support' },
  ];

  private mockAcademicYears: AcademicYearOption[] = [
    { id: '1', year: '2025 - 2026' },
    { id: '2', year: '2026 - 2027' },
    { id: '3', year: '2027 - 2028' },
  ];

  constructor(private http: HttpClient) {}

  // ── Dropdown helpers

  getBranches(): Observable<BranchOption[]> {
    return of(this.mockBranches);
  }

  getSections(): Observable<SectionOption[]> {
    return of(this.mockSections);
  }

  getAcademicYears(): Observable<AcademicYearOption[]> {
    return of(this.mockAcademicYears);
  }

  // ── Save form setup (local only, called from Form Setup page)

  saveFormSetup(formData: FormSetupData): Observable<FormSetupData> {
    const savedData: FormSetupData = {
      ...formData,
      id: formData.id ?? `local-${Date.now()}`,
    };
    this.storeFormSetupData(savedData);
    this.formSetupData$.next(savedData);
    return of(savedData);
  }

  // send the request to the backend and backend save the data and return the response.after the response ui will be update.

  publishForm(
    formData: FormSetupData,
    fields: unknown[]
  ): Observable<FormSetupData> {
    const payload = {
      ...formData,
      formStatus: FormStatus.PUBLISHED,
      fields,
    };

    return this.http
      .post<ApiResponse<FormRecord>>(API_URL, payload)
      .pipe(
        map((response) => this.mapRecordToFormSetupData(response.data)),
        tap((saved) => {
          this.storeFormSetupData(saved);
          this.formSetupData$.next(saved);
        }),
        catchError((error: HttpErrorResponse) => {
          console.warn(
            'Backend unavailable – saving to localStorage only:',
            error.message
          );
          const localData: FormSetupData = {
            ...formData,
            formStatus: FormStatus.PUBLISHED,
            id: formData.id ?? `local-${Date.now()}`,
          };
          this.storeFormSetupData(localData);
          this.formSetupData$.next(localData);
          return of(localData);
        })
      );
  }

  // ── Reactive stream

  getFormSetupData(): Observable<FormSetupData | null> {
    return this.formSetupData$.asObservable();
  }

  // ── Clear (on cancel)

  clearFormSetupData(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.formSetupData$.next(null);
  }

  // ── Private helpers
  private storeFormSetupData(formData: FormSetupData): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }

  private getStoredFormSetupData(): FormSetupData | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as FormSetupData) : null;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }

  /**
   * Convert the backend snake_case record → Angular camelCase interface.
   */
  private mapRecordToFormSetupData(record: FormRecord): FormSetupData {
    return {
      id: String(record.id),
      formName: record.form_name,
      branch: record.branch,
      logoUrl: record.logo_url ?? '',
      section: record.section,
      responsibleUser: record.responsible_user,
      formStatus: record.form_status as FormStatus,
      submittedButtonName: record.submitted_button_name,
      defaultAcademicYear: record.default_academic_year,
      description: record.description ?? '',
      successMessage: record.success_message,
      confirmationMessage: record.confirmation_message,
      createdAt: record.created_at ? new Date(record.created_at) : undefined,
      updatedAt: record.updated_at ? new Date(record.updated_at) : undefined,
    };
  }
}
